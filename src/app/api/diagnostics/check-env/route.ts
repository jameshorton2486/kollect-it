import { NextResponse } from "next/server";

export async function GET() {
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