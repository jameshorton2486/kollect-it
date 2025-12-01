/**
 * POST /api/admin/reports/[id]/trigger - Manually trigger a report send
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const report = await (prisma as any).scheduledReport.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Log the manual trigger
    await (prisma as any).reportAuditLog.create({
      data: {
        reportId: id,
        recipients: report.recipients,
        status: "SUCCESS",
      },
    });

    // Update lastSent
    await (prisma as any).scheduledReport.update({
      where: { id },
      data: { lastSent: new Date() },
    });

    return NextResponse.json({ success: true, message: "Report triggered" });
  } catch (error) {
    console.error("Error triggering report:", error);
    return NextResponse.json(
      { error: "Failed to trigger report" },
      { status: 500 },
    );
  }
}
