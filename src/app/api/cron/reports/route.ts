import { NextRequest, NextResponse } from "next/server";
import { runDueReportsOnce } from "@/lib/jobs/reportScheduler";
import { securityMiddleware } from "@/lib/security";

/**
 * Cron-triggered report execution
 * Intended for Vercel Cron (serverless-safe)
 */
export async function POST(request: NextRequest) {
  const securityCheck = await securityMiddleware(request, {
    requireApiKey: true,
    maxBodySize: 1 * 1024 * 1024,
    allowedContentTypes: ["application/json"],
  });
  if (securityCheck) return securityCheck;

  try {
    await runDueReportsOnce();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cron report run failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to run due reports" },
      { status: 500 },
    );
  }
}
