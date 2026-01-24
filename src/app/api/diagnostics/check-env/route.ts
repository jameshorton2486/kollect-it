import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'STRIPE_SECRET_KEY',
    'IMAGEKIT_PRIVATE_KEY',
    'RESEND_API_KEY'
  ];

  const results = requiredVars.map(varName => ({
    name: varName,
    set: !!process.env[varName],
    // Don't expose values, just confirm existence
  }));

  const allSet = results.every(r => r.set);

  return NextResponse.json({
    status: allSet ? "ok" : "missing_vars",
    variables: results,
    timestamp: new Date().toISOString()
  });
}
