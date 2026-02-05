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

  // Check database connection (actionable logs for SASL / connection failures)
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch (error) {
    checks.status = "unhealthy";
    checks.database = "disconnected";
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(
      "[Health] Database check failed. Use direct Postgres URL (port 5432) for DATABASE_URL. See docs/PRODUCTION_ENV_SETUP.md.",
      { message: err.message, name: err.name }
    );
  }

  // Core vars (app won't function without these)
  const coreEnvVars = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"];

  // Service vars (features degrade gracefully without these)
  const serviceEnvVars = [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "IMAGEKIT_PRIVATE_KEY",
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    "EMAIL_PASSWORD",
  ];

  // Check core vars
  checks.environment = {};
  for (const envVar of coreEnvVars) {
    checks.environment[envVar] = !!process.env[envVar];
  }

  // Check service vars (reported but don't affect health status)
  const services: Record<string, boolean> = {};
  for (const envVar of serviceEnvVars) {
    services[envVar] = !!process.env[envVar];
  }

  // Determine overall health - only core vars affect status
  const allCoreSet = Object.values(checks.environment).every((v) => v === true);
  if (!allCoreSet || checks.database === "disconnected") {
    checks.status = "degraded";
  }

  return NextResponse.json(
    {
      ...checks,
      services,
    },
    { status: checks.status === "healthy" ? 200 : 503 },
  );
}
