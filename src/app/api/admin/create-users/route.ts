import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * SECURITY WARNING: This endpoint should only be used in development
 * It contains hardcoded credentials for convenience during setup
 * 
 * For production:
 * 1. Use scripts/create-admin.ts with environment variables
 * 2. Or remove this endpoint entirely
 * 3. Never commit actual passwords to version control
 */

/**
 * DEPRECATED: This endpoint should not be used in production
 * 
 * RECOMMENDATION: Use scripts/create-admin.ts instead for secure admin creation
 * 
 * This endpoint creates a single admin user using environment variables:
 * - ADMIN_EMAIL (defaults to admin@kollect-it.com if not set)
 * - ADMIN_PASSWORD (REQUIRED - will fail if not set)
 * - ADMIN_NAME (defaults to "Admin User" if not set)
 * 
 * SECURITY: This endpoint is disabled in production. For production, use the script.
 */
const getAdminUser = () => {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password === "CHANGE_THIS_BEFORE_PRODUCTION") {
    throw new Error("ADMIN_PASSWORD environment variable must be set. This endpoint requires explicit password configuration.");
  }

  return {
    email: process.env.ADMIN_EMAIL || "admin@kollect-it.com",
    password,
    name: process.env.ADMIN_NAME || "Admin User",
    role: "admin" as const,
  };
};

export async function GET() {
  // SECURITY: Block this endpoint in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is disabled in production. Use scripts/create-admin.ts instead." },
      { status: 403 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Get admin user from environment variables (will throw if not properly configured)
    const userData = getAdminUser();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: { password: hashedPassword, role: userData.role, name: userData.name },
      create: { email: userData.email, password: hashedPassword, name: userData.name, role: userData.role },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Admin user created/updated", 
      users: [{ email: user.email, id: user.id, name: user.name, role: user.role }],
      note: "For additional users, use scripts/create-admin.ts"
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
