import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
 * - JAMES_PERSONAL_PASSWORD (for info@kollect-it.com)
 */

const getUsers = () => {
  const requiredPasswords = {
    ADMIN: process.env.ADMIN_PASSWORD,
    JAMES: process.env.JAMES_PASSWORD,
    BILLING: process.env.BILLING_PASSWORD,
    INFO: process.env.INFO_PASSWORD,
    SUPPORT: process.env.SUPPORT_PASSWORD,
    JAMES_PERSONAL: process.env.JAMES_PERSONAL_PASSWORD,
  };

  const missing = Object.entries(requiredPasswords)
    .filter(([_, value]) => !value)
    .map(([key]) => {
      if (key === "JAMES_PERSONAL") return "JAMES_PERSONAL_PASSWORD";
      return `${key}_PASSWORD`;
    });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
      "Set these in .env.local before running this script."
    );
  }

  return [
    { email: "admin@kollect-it.com", password: requiredPasswords.ADMIN!, name: "Admin User" },
    { email: "James@kollect-it.com", password: requiredPasswords.JAMES!, name: "James Horton" },
    { email: "billing@kollect-it.com", password: requiredPasswords.BILLING!, name: "Billing Dept" },
    { email: "info@kollect-it.com", password: requiredPasswords.INFO!, name: "Info" },
    { email: "support@kollect-it.com", password: requiredPasswords.SUPPORT!, name: "Support" },
    { email: "info@kollect-it.com", password: requiredPasswords.JAMES_PERSONAL!, name: "James Personal" },
  ];
};

async function main() {
  console.log("🔐 Setting up team logins...");

  // Get users (will throw if env vars are missing)
  const users = getUsers();

  for (const user of users) {
    // Normalize email to lowercase to avoid case-sensitivity issues
    const normalizedEmail = user.email.toLowerCase();
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const upsertedUser = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        password: hashedPassword,
        role: "admin", // Granting admin access to all these team accounts
        name: user.name,
      },
      create: {
        email: normalizedEmail,
        password: hashedPassword,
        name: user.name,
        role: "admin",
      },
    });

    console.log(`✅ Configured: ${upsertedUser.email}`);
  }

  console.log("🎉 All accounts set up successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
