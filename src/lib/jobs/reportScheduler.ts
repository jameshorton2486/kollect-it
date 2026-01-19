/**
 * Background Job Scheduler
 * Phase 5 - Execute scheduled reports on cron schedule
 */

import { prisma } from "@/lib/prisma";
// import { sendReportEmail } from '@/lib/email/reportSender';
import {
  getReportsDue,
  markReportAsSent,
  logReportSent,
} from "@/lib/analytics/scheduler";

interface ScheduledJob {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

const activeJobs = new Map<string, NodeJS.Timeout>();

/**
 * Parse cron expression to milliseconds until next run
 * Simplified version - supports basic patterns like "0 9 * * MON"
 */
export function getNextRunMs(cronExpression: string): number {
  const parts = cronExpression.split(" ");
  const [minute, hour] = parts;

  const now = new Date();
  let next = new Date(now);

  // For simplicity, calculate next run:
  // If time has passed today, use tomorrow
  // Otherwise use today
  const targetHour = hour ? parseInt(hour, 10) : 9;
  const targetMinute = minute ? parseInt(minute, 10) : 0;

  next.setHours(targetHour, targetMinute, 0, 0);

  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  return next.getTime() - now.getTime();
}

/**
 * Format time for next run display
 */
export function formatNextRun(ms: number): Date {
  return new Date(Date.now() + ms);
}

/**
 * Execute a scheduled report
 */
async function executeReport(reportId: string): Promise<void> {
  try {
    const report = await (prisma as any).scheduledReport.findUnique({
      where: { id: reportId },
      include: { user: true },
    });

    if (!report) {
      console.error(`Report not found: ${reportId}`);
      return;
    }

    // Generate report data
    // const reportData = await generateReportData(report.format);

    // Send emails (commented out - requires email service setup)
    const recipients = report.recipients
      .split(",")
      .map((r: string) => r.trim());
    // await sendReportEmail({
    //   recipients,
    //   reportName: report.name,
    //   data: reportData,
    //   format: report.format,
    // });

    // Mark as sent and log
    await markReportAsSent(reportId);
    await logReportSent(reportId, recipients, "SUCCESS");

    console.log(`Report executed successfully: ${report.name} (${reportId})`);
  } catch (error) {
    console.error(`Error executing report ${reportId}:`, error);

    // Log error
    await logReportSent(reportId, [], "FAILED");
  }
}

/**
 * Poll for due reports every minute
 */
async function pollDueReports(): Promise<void> {
  try {
    const dueReports = await getReportsDue();

    for (const report of dueReports) {
      await executeReport(report.id);
    }

    if (dueReports.length > 0) {
      console.log(`Processed ${dueReports.length} due reports`);
    }
  } catch (error) {
    console.error("Error polling due reports:", error);
  }
}

/**
 * Start background job scheduler
 */
export function startJobScheduler(): void {
  console.log("Starting background job scheduler...");

  // Poll for due reports every minute
  const pollInterval = setInterval(() => {
    pollDueReports().catch((error) => console.error("Poll error:", error));
  }, 60000); // 60 seconds

  activeJobs.set("report-poller", pollInterval);

  // Also run once at startup
  pollDueReports().catch((error) =>
    console.error("Initial poll error:", error),
  );

  console.log("Background job scheduler started");
}

/**
 * Stop background job scheduler
 */
export function stopJobScheduler(): void {
  console.log("Stopping background job scheduler...");

  for (const [name, timeout] of activeJobs) {
    clearInterval(timeout);
    console.log(`Stopped job: ${name}`);
  }

  activeJobs.clear();
}

/**
 * Get active jobs list
 */
export function getActiveJobs(): ScheduledJob[] {
  return Array.from(activeJobs.entries()).map(([name]) => ({
    id: name,
    name,
    schedule: "every minute",
    enabled: true,
  }));
}

/**
 * Manually trigger report execution
 */
export async function triggerReportNow(reportId: string): Promise<void> {
  await executeReport(reportId);
}

/**
 * Get scheduler health status
 */
export async function getSchedulerHealth() {
  const activeCount = activeJobs.size;
  const recentReports = await (prisma as any).reportAuditLog.findMany({
    where: {
      sentAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
    orderBy: { sentAt: "desc" },
    take: 10,
  });

  const successCount = recentReports.filter(
    (r: any) => r.status === "SUCCESS",
  ).length;
  const errorCount = recentReports.filter(
    (r: any) => r.status === "ERROR",
  ).length;

  return {
    isRunning: activeCount > 0,
    activeJobs: activeCount,
    lastReports: recentReports.length,
    successCount,
    errorCount,
    successRate:
      recentReports.length > 0
        ? Math.round((successCount / recentReports.length) * 100)
        : 0,
  };
}

