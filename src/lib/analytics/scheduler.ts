/**
 * Scheduled Reports System
 * Phase 5 - Automated report generation and email delivery
 */

import { prisma } from "@/lib/prisma";
import { getDashboardMetrics } from "@/lib/analytics/queries";
import {
  exportMetricsAsJSON,
  exportMetricsAsCSV,
} from "@/lib/analytics/export";

export enum ReportFrequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export interface ScheduledReport {
  id: string;
  userId: string;
  name: string;
  frequency: ReportFrequency;
  recipients: string[];
  format: "JSON" | "CSV" | "PDF";
  includeCharts: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastSent?: Date;
  nextScheduled?: Date;
}

export interface ReportData {
  title: string;
  generatedAt: Date;
  metrics: any;
  format: string;
  fileContent: string;
}

/**
 * Create scheduled report
 */
export async function createScheduledReport(
  userId: string,
  name: string,
  frequency: ReportFrequency,
  recipients: string[],
  format: "JSON" | "CSV" = "CSV",
  includeCharts: boolean = false,
): Promise<ScheduledReport> {
  const nextScheduled = calculateNextScheduled(frequency);

  const report = await (prisma as any).scheduledReport.create({
    data: {
      userId,
      name,
      frequency,
      recipients,
      format,
      includeCharts,
      nextScheduled,
    },
  });

  return report;
}

/**
 * Update scheduled report
 */
export async function updateScheduledReport(
  reportId: string,
  updates: Partial<ScheduledReport>,
): Promise<ScheduledReport> {
  const report = await (prisma as any).scheduledReport.update({
    where: { id: reportId },
    data: updates,
  });

  return report;
}

/**
 * Delete scheduled report
 */
export async function deleteScheduledReport(reportId: string): Promise<void> {
  await (prisma as any).scheduledReport.delete({
    where: { id: reportId },
  });
}

/**
 * Get user's scheduled reports
 */
export async function getUserScheduledReports(
  userId: string,
): Promise<ScheduledReport[]> {
  const reports = await (prisma as any).scheduledReport.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return reports;
}

/**
 * Generate report data
 */
export async function generateReportData(
  format: "JSON" | "CSV",
): Promise<ReportData> {
  const metrics = await getDashboardMetrics();

  let fileContent = "";
  if (format === "JSON") {
    fileContent = exportMetricsAsJSON(metrics);
  } else {
    fileContent = exportMetricsAsCSV(metrics);
  }

  return {
    title: `Analytics Report - ${new Date().toLocaleDateString()}`,
    generatedAt: new Date(),
    metrics,
    format,
    fileContent,
  };
}

/**
 * Generate filename for report
 */
export function generateReportFilename(
  reportName: string,
  format: "JSON" | "CSV",
): string {
  const timestamp = new Date().toISOString().split("T")[0];
  const ext = format === "JSON" ? "json" : "csv";
  return `${reportName}-${timestamp}.${ext}`;
}

/**
 * Calculate next scheduled time
 */
function calculateNextScheduled(frequency: ReportFrequency): Date {
  const now = new Date();
  const next = new Date(now);

  switch (frequency) {
    case ReportFrequency.DAILY:
      next.setDate(next.getDate() + 1);
      next.setHours(9, 0, 0, 0); // 9 AM
      break;

    case ReportFrequency.WEEKLY:
      // Next Monday at 9 AM
      const daysUntilMonday = (1 - next.getDay() + 7) % 7 || 7;
      next.setDate(next.getDate() + daysUntilMonday);
      next.setHours(9, 0, 0, 0);
      break;

    case ReportFrequency.MONTHLY:
      // First day of next month at 9 AM
      next.setMonth(next.getMonth() + 1);
      next.setDate(1);
      next.setHours(9, 0, 0, 0);
      break;
  }

  return next;
}

/**
 * Check if report should be sent
 */
export function shouldSendReport(report: ScheduledReport): boolean {
  if (!report.nextScheduled) return false;
  return new Date() >= new Date(report.nextScheduled);
}

/**
 * Get reports due for sending
 */
export async function getReportsDue(): Promise<ScheduledReport[]> {
  const now = new Date();

  const reports = await (prisma as any).scheduledReport.findMany({
    where: {
      nextScheduled: {
        lte: now,
      },
    },
  });

  return reports;
}

/**
 * Mark report as sent
 */
export async function markReportAsSent(reportId: string): Promise<void> {
  const report = await (prisma as any).scheduledReport.findUnique({
    where: { id: reportId },
  });

  const nextScheduled = calculateNextScheduled(report.frequency);

  await (prisma as any).scheduledReport.update({
    where: { id: reportId },
    data: {
      lastSent: new Date(),
      nextScheduled,
    },
  });
}

/**
 * Create audit log for report
 */
export async function logReportSent(
  reportId: string,
  recipients: string[],
  status: "SUCCESS" | "FAILED",
  error?: string,
): Promise<void> {
  await (prisma as any).reportAuditLog.create({
    data: {
      reportId,
      recipients,
      status,
      error,
      sentAt: new Date(),
    },
  });
}

/**
 * Get report audit logs
 */
export async function getReportAuditLogs(reportId: string) {
  const logs = await (prisma as any).reportAuditLog.findMany({
    where: { reportId },
    orderBy: { sentAt: "desc" },
    take: 100,
  });

  return logs;
}

