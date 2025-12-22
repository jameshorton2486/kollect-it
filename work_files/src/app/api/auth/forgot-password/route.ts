import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * POST /api/auth/forgot-password
 * Generates a password reset token and sends reset email
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    // Always return success to prevent email enumeration attacks
    const successResponse = NextResponse.json({
      message: "If an account exists with this email, you will receive reset instructions.",
    });

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal that email doesn't exist
      return successResponse;
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 1 hour
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    // Save hashed token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry,
      },
    });

    // Build reset URL - FIXED: Correct baseUrl logic
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(
      resetToken,
    )}`;

    // Try to send email
    try {
      const emailModule = await import("@/lib/email");

      if (emailModule.isEmailConfigured()) {
        // Send password reset email using the email service
        await emailModule.sendPasswordResetEmail({
          name: user.name || "User",
          email: user.email,
          resetUrl,
        });

        console.log(`[Auth] Password reset email sent to ${user.email}`);
      } else {
        // Log the reset URL for development
        console.log(
          `[Auth] Email not configured. Reset URL for ${user.email}: ${resetUrl}`,
        );
      }
    } catch (emailError) {
      // Log error but don't fail the request
      console.error("[Auth] Failed to send password reset email:", emailError);
      // Still log the URL for manual recovery
      console.log(`[Auth] Manual reset URL for ${user.email}: ${resetUrl}`);
    }

    return successResponse;
  } catch (error) {
    console.error("[Auth] Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 },
    );
  }
}
