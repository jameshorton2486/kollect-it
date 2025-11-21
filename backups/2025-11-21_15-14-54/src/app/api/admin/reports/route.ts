/**
 * GET /api/admin/reports - List all scheduled reports
 * POST /api/admin/reports - Create new scheduled report
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // TODO: Add auth check for admin
    const reports = await (prisma as any).scheduledReport.findMany({
      select: {
        id: true,
        name: true,
        frequency: true,
        format: true,
        recipients: true,
        nextScheduled: true,
        enabled: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add auth check for admin
    const body = await request.json();
    const { name, frequency, format, recipients } = body;

    // Validate input
    if (!name || !frequency || !recipients) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Calculate next scheduled time
    const now = new Date();
    let nextScheduled = new Date(now);

    if (frequency === "DAILY") {
      nextScheduled.setDate(nextScheduled.getDate() + 1);
      nextScheduled.setHours(9, 0, 0, 0);
    } else if (frequency === "WEEKLY") {
      // Next Monday at 9 AM
      const daysUntilMonday = (1 - nextScheduled.getDay() + 7) % 7;
      nextScheduled.setDate(
        nextScheduled.getDate() + (daysUntilMonday === 0 ? 7 : daysUntilMonday),
      );
      nextScheduled.setHours(9, 0, 0, 0);
    } else if (frequency === "MONTHLY") {
      // First of next month at 9 AM
      nextScheduled.setMonth(nextScheduled.getMonth() + 1);
      nextScheduled.setDate(1);
      nextScheduled.setHours(9, 0, 0, 0);
    }

    const report = await (prisma as any).scheduledReport.create({
      data: {
        name,
        frequency,
        format: format || "JSON",
        recipients,
        nextScheduled,
        userId: "user-id", // TODO: Get from auth session
        enabled: true,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 },
    );
  }
}

