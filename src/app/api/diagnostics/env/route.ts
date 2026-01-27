import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Environment Variable Diagnostics
 *
 * SECURITY: Only returns variable NAMES, never values
 *
 * Returns:
 * - 200: All required variables present
 * - 206: Some variables missing (partial content)
 * - Lists missing variable names only
 */

export async function GET(request: Request) {
  const token = request.headers.get("x-healthcheck-token");
  if (process.env.HEALTHCHECK_TOKEN && token === process.env.HEALTHCHECK_TOKEN) {
    // allow
  } else {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Define all required environment variables
  const requiredVars = [
    "DATABASE_URL",
    "DIRECT_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    "IMAGEKIT_PRIVATE_KEY",
  ];

  // Check which variables are missing
  const missing: string[] = [];
  const present: string[] = [];

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value || value.trim() === "") {
      missing.push(varName);
    } else {
      present.push(varName);
    }
  }

  // Determine status
  const allPresent = missing.length === 0;
  const status = allPresent ? 200 : 206;

  // Build response
  const response = {
    status: allPresent ? "complete" : "incomplete",
    environment: process.env.NODE_ENV || "unknown",
    required: requiredVars.length,
    present: present.length,
    missing: missing.length,
    missingVariables: missing, // Only names, never values
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status });
}

