import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendTestEmail, getEmailStatus, isEmailConfigured } from "@/lib/email";
import { rateLimiters } from "@/lib/rate-limit";
import { applySecurityHeaders } from "@/lib/security";

/**
 * POST /api/admin/email/test
 *
 * Send test email to verify SMTP configuration
 * Admin only
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitCheck = await rateLimiters.standard(request);
    if (rateLimitCheck) return rateLimitCheck;

    // Check admin authorization
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      const response = NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 403 },
      );
      return applySecurityHeaders(response);
    }

    const { to } = await request.json();

    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      const response = NextResponse.json(
        { error: "Valid email address required" },
        { status: 400 },
      );
      return applySecurityHeaders(response);
    }

    const result = await sendTestEmail(to);

    const response = NextResponse.json({
      success: result.success,
      message: result.success
        ? `Test email sent to ${to}`
        : `Failed to send email: ${result.error}`,
      messageId: result.messageId,
    });

    return applySecurityHeaders(response);
  } catch (error) {
    console.error("Error sending test email:", error);
    const response = NextResponse.json(
      {
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
    return applySecurityHeaders(response);
  }
}

/**
 * GET /api/admin/email/status
 *
 * Get email configuration status
 * Admin only
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitCheck = await rateLimiters.standard(request);
    if (rateLimitCheck) return rateLimitCheck;

    // Check admin authorization
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      const response = NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 403 },
      );
      return applySecurityHeaders(response);
    }

    const status = getEmailStatus();
    const configured = isEmailConfigured();

    const response = NextResponse.json({
      configured,
      ...status,
      instructions: configured
        ? "Email service is configured and ready"
        : "Add EMAIL_USER and EMAIL_PASSWORD to .env.local to enable emails",
    });

    return applySecurityHeaders(response);
  } catch (error) {
    console.error("Error fetching email status:", error);
    const response = NextResponse.json(
      {
        error: "Failed to fetch email status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
    return applySecurityHeaders(response);
  }
}

