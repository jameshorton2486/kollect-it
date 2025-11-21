import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Report Schedules API
 * Phase 6 Step 4 - Manage automated report schedules
 */

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // For now, return mock data (implement database storage later)
    const schedules = [
      {
        id: "1",
        name: "Daily Sales Summary",
        frequency: "daily" as const,
        recipients: ["admin@kollect-it.com"],
        format: "pdf" as const,
        includeCharts: true,
        active: true,
        lastRun: new Date(Date.now() - 86400000).toISOString(),
        nextRun: new Date(Date.now() + 86400000).toISOString(),
      },
    ];

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, frequency, recipients, format, includeCharts, active } = body;

    // Calculate next run time based on frequency
    const now = new Date();
    let nextRun = new Date(now);

    switch (frequency) {
      case "daily":
        nextRun.setDate(nextRun.getDate() + 1);
        break;
      case "weekly":
        nextRun.setDate(nextRun.getDate() + 7);
        break;
      case "monthly":
        nextRun.setMonth(nextRun.getMonth() + 1);
        break;
    }

    // Create new schedule (mock implementation - store in database later)
    const newSchedule = {
      id: Date.now().toString(),
      name,
      frequency,
      recipients,
      format,
      includeCharts,
      active,
      lastRun: null,
      nextRun: nextRun.toISOString(),
    };

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 },
    );
  }
}

