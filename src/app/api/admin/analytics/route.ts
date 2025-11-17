/**
 * Admin Analytics API Endpoint
 * Phase 4 - GET /api/admin/analytics
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  getAnalyticsSummary,
  getDashboardMetrics,
} from "@/lib/analytics/queries";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");
    const category = searchParams.get("category") || undefined;
    const statusParam = searchParams.get("status");
    const format = searchParams.get("format") || "dashboard"; // 'dashboard' or 'summary'

    // Validate status parameter
    let status: "APPROVED" | "REJECTED" | "ALL" | undefined;
    if (
      statusParam === "APPROVED" ||
      statusParam === "REJECTED" ||
      statusParam === "ALL"
    ) {
      status = statusParam;
    }

    let analytics;

    // Return new dashboard metrics format or legacy summary format
    if (format === "dashboard") {
      // Default to last 30 days
      const endDate = endDateStr ? new Date(endDateStr) : new Date();
      const startDate = startDateStr
        ? new Date(startDateStr)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      analytics = await getDashboardMetrics(startDate, endDate);
    } else {
      // Legacy format
      analytics = await getAnalyticsSummary({
        startDate: startDateStr || undefined,
        endDate: endDateStr || undefined,
        category,
        status,
      });
    }

    return NextResponse.json(analytics, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}

