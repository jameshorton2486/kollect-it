import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimiters } from "@/lib/rate-limit";
import { applySecurityHeaders } from "@/lib/security";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Apply strict rate limiting (5 attempts per 15 minutes)
    const rateLimitCheck = await rateLimiters.strict(request);
    if (rateLimitCheck) {
      return applySecurityHeaders(rateLimitCheck);
    }
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        ),
      );
    }

    if (password.length < 6) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 },
        ),
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 },
        ),
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const response = NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 },
    );
    return applySecurityHeaders(response);
  } catch (error) {
    console.error("Registration error:", error);
    const errorResponse = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
    return applySecurityHeaders(errorResponse);
  }
}

