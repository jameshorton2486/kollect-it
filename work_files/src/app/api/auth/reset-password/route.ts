import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * POST /api/auth/reset-password
 * Resets user password using valid reset token
 */
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 },
      );
    }

    // FIXED: Standardized to 8 characters minimum
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Hash the token to compare with stored hash (SECURE APPROACH)
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with matching token that hasn't expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: tokenHash,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    console.log(`[Auth] Password reset successfully for ${user.email}`);

    // Optionally send confirmation email
    try {
      const emailModule = await import("@/lib/email");

      if (emailModule.isEmailConfigured()) {
        await emailModule.sendPasswordChangedEmail({
          name: user.name || "User",
          email: user.email,
        });
      }
    } catch (emailError) {
      // Non-critical, just log
      console.error(
        "[Auth] Failed to send password changed confirmation:",
        emailError,
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("[Auth] Reset password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 },
    );
  }
}
