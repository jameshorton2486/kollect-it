/**
 * GET /api/admin/reports/[id]/audit - Get audit logs for a report
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const auditLogs = await (prisma as any).reportAuditLog.findMany({
      where: { reportId: id },
      orderBy: { sentAt: "desc" },
      take: 50,
    });

    return NextResponse.json(auditLogs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 },
    );
  }
}
