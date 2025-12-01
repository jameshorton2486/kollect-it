import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { requireAdminAuth } from "@/lib/auth-admin";

const prisma = new PrismaClient();

const users = [
  { email: "admin@kollect-it.com", password: "KollectIt@2025Admin", name: "Admin User", role: "admin" },
  { email: "James@kollect-it.com", password: "James@KI-2025", name: "James Horton", role: "admin" },
  { email: "billing@kollect-it.com", password: "billing@KI-2025", name: "Billing Department", role: "admin" },
  { email: "info@kollect-it.com", password: "info@KI-2025", name: "Info Support", role: "admin" },
  { email: "support@kollect-it.com", password: "support@KI-2025", name: "Customer Support", role: "admin" },
  { email: "jameshorton2486@gmail.com", password: "james@KI-2025", name: "James Horton (Personal)", role: "admin" },
];

export async function GET() {
  try {
    const session = await requireAdminAuth();
    if (session instanceof Response) return session;

    const results = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: { password: hashedPassword, role: userData.role, name: userData.name },
        create: { email: userData.email, password: hashedPassword, name: userData.name, role: userData.role },
      });
      results.push({ email: user.email, id: user.id, name: user.name, role: user.role });
    }
    return NextResponse.json({ success: true, message: "Users created", users: results });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
