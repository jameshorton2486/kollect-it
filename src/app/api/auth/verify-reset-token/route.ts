import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { rateLimiters } from "@/lib/rate-limit";
import { applySecurityHeaders } from "@/lib/security";

// Force dynamic rendering
export const dynamic = "force-dynamic";

/**
 * GET /api/auth/verify-reset-token
 * Verifies that a password reset token is valid and not expired
 * SECURITY: Protected with strict rate limiting (5 attempts per 15 minutes)
 */
export async function GET(request: NextRequest) {
  try {
    // Apply strict rate limiting (5 attempts per 15 minutes)
    const rateLimitCheck = await rateLimiters.strict(request);
    if (rateLimitCheck) {
      return applySecurityHeaders(rateLimitCheck);
    }
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: "Token is required" },
          { status: 400 },
        ),
      );
    }

    // Hash the token to compare with stored hash
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token that hasn't expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: tokenHash,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: "Invalid or expired reset token" },
          { status: 400 },
        ),
      );
    }

    return applySecurityHeaders(
      NextResponse.json({
        valid: true,
        email: user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3"), // Mask email
      }),
    );
  } catch (error) {
    console.error("[Auth] Verify reset token error:", error);
    return applySecurityHeaders(
      NextResponse.json(
        { error: "An error occurred" },
        { status: 500 },
      ),
    );
  }
}
