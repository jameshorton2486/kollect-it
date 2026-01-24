/**
 * GET /api/admin/reports - List all scheduled reports
 * POST /api/admin/reports - Create new scheduled report
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const reports = await prisma.scheduledReport.findMany({
      where: {
        userId: session.user.id,
      },
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
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 },
      );
    }
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }
    const body = await request.json();
    const { name, frequency, format, recipients } = body;

    // Validate input
    if (!name || !frequency || !recipients) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate frequency
    if (!["DAILY", "WEEKLY", "MONTHLY"].includes(frequency)) {
      return NextResponse.json(
        { error: "Invalid frequency. Must be DAILY, WEEKLY, or MONTHLY" },
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

    const report = await prisma.scheduledReport.create({
      data: {
        name,
        frequency,
        format: format || "JSON",
        recipients,
        nextScheduled,
        userId: session.user.id as string,
        enabled: true,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 },
      );
    }
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 },
    );
  }
}

