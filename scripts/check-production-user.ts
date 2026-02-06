import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TARGET_EMAIL = "info@kollect-it.com";

async function main() {
  console.log("🔍 Checking", TARGET_EMAIL, "in database (current DATABASE_URL)...\n");

  const user = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
  });

  if (!user) {
    console.log("❌ USER NOT FOUND");
    console.log("   The user does not exist in the database pointed to by .env.local");
    console.log("\n   If you expected production: create-admin.ts may have run against a different DB.");
    console.log("   FIX: vercel env pull .env.local --environment=production");
    console.log("   Then run: $env:ADMIN_EMAIL=\"" + TARGET_EMAIL + "\"; npx tsx scripts/create-admin.ts");
    await prisma.$disconnect();
    return;
  }

  console.log("✅ USER FOUND:");
  console.log("   Email:", user.email);
  console.log("   Role:", user.role);
  console.log("   Has password:", user.password ? "YES" : "NO!");

  if (user.password) {
    console.log("   Password hash:", user.password.substring(0, 15) + "...");
    console.log("   Hash length:", user.password.length);
    console.log("   Valid bcrypt:", /^\$2[aby]?\$/.test(user.password) ? "YES" : "NO!");
  }

  await prisma.$disconnect();
}

main().catch(console.error);
