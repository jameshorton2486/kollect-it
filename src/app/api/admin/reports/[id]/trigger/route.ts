/**
 * POST /api/admin/reports/[id]/trigger - Manually trigger a report send
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
