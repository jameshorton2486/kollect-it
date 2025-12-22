import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

type SeedUser = {
  email: string;
  password: string;
  name: string;
  role: string;
};

/**
 * SECURITY: This script requires environment variables for all passwords
 * No hardcoded passwords are allowed
 * 
 * Required environment variables:
 * - ADMIN_PASSWORD
 * - JAMES_PASSWORD
 * - BILLING_PASSWORD
 * - INFO_PASSWORD
 * - SUPPORT_PASSWORD
 */

// Initial Kollect-It accounts - passwords must come from environment variables
const getUserList = (): SeedUser[] => {
  const requiredPasswords = {
    ADMIN: process.env.ADMIN_PASSWORD,
    JAMES: process.env.JAMES_PASSWORD,
    BILLING: process.env.BILLING_PASSWORD,
    INFO: process.env.INFO_PASSWORD,
    SUPPORT: process.env.SUPPORT_PASSWORD,
  };

  const missing = Object.entries(requiredPasswords)
    .filter(([_, value]) => !value)
    .map(([key]) => `${key}_PASSWORD`);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
      "Set these in .env.local before running this script."
    );
  }

  return [
    { email: "admin@kollect-it.com", name: "Admin", password: requiredPasswords.ADMIN!, role: "admin" },
    { email: "James@kollect-it.com", name: "James", password: requiredPasswords.JAMES!, role: "admin" },
    { email: "billing@kollect-it.com", name: "Billing", password: requiredPasswords.BILLING!, role: "admin" },
    { email: "info@kollect-it.com", name: "Info", password: requiredPasswords.INFO!, role: "admin" },
    { email: "support@kollect-it.com", name: "Support", password: requiredPasswords.SUPPORT!, role: "admin" },
  ];
};

async function upsertUser(u: SeedUser) {
  const hashed = await bcrypt.hash(u.password, 10);
  const user = await prisma.user.upsert({
    where: { email: u.email },
    update: { password: hashed, name: u.name, role: u.role },
    create: { email: u.email, password: hashed, name: u.name, role: u.role },
  });
  return { user, plainPassword: u.password };
}

async function main() {
  console.log("🚀 Creating initial Kollect-It users (idempotent upsert)\n");
  if (process.env.NODE_ENV === "production") {
    console.error("❌ Refusing to run seed user creation in production environment.");
    process.exit(1);
  }

  // Get user list (will throw if env vars are missing)
  const USERS = getUserList();

  const results = [] as Array<{ email: string; password: string; id: string; role: string }>;

  for (const u of USERS) {
    try {
      const { user, plainPassword } = await upsertUser(u);
      results.push({ email: user.email, id: user.id, role: user.role, password: plainPassword });
      console.log(`✅ Upserted ${user.email} (role=${user.role})`);
    } catch (err) {
      console.error(`❌ Failed to upsert ${u.email}:`, err);
    }
  }

  console.log("\n📋 Created / Updated Users:");
  console.log("─".repeat(60));
  for (const r of results) {
    console.log(`📧 ${r.email}\n   ID: ${r.id}\n   Role: ${r.role}\n   Password: [Set via environment variable]`);
    console.log("-".repeat(60));
  }
  console.log("\n⚠️  Passwords are set via environment variables. Store them securely!\n");
}

main()
  .catch((e) => {
    console.error("Unexpected error while creating users", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
