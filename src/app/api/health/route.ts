import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.headers.get("x-healthcheck-token");
  if (process.env.HEALTHCHECK_TOKEN && token === process.env.HEALTHCHECK_TOKEN) {
    // allow
  } else {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  const checks = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: "unknown",
    environment: {} as Record<string, boolean>,
  };

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch (error) {
    checks.status = "unhealthy";
    checks.database = "disconnected";
  }

  // Check required environment variables (never expose values!)
  const requiredEnvVars = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    "IMAGEKIT_PRIVATE_KEY",
  ];

  for (const envVar of requiredEnvVars) {
    checks.environment[envVar] = !!process.env[envVar];
  }

  // Determine overall health
  const allEnvVarsSet = Object.values(checks.environment).every(
    (v) => v === true,
  );
  if (!allEnvVarsSet || checks.database === "disconnected") {
    checks.status = "degraded";
  }

  const statusCode = checks.status === "healthy" ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}

