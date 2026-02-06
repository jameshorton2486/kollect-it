#!/usr/bin/env npx tsx
/**
 * Update Admin Password in Database
 */

import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🔐 Updating admin password in database...\n");

  const email = process.env.ADMIN_EMAIL || "info@kollect-it.com";
  const newPassword = process.env.ADMIN_PASSWORD;

  if (!newPassword || newPassword.trim().length < 8) {
    console.error("❌ ADMIN_PASSWORD is required and must be at least 8 characters.");
    console.error("   Example: $env:ADMIN_PASSWORD=\"your-strong-password\"");
    process.exit(1);
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      console.log("❌ User not found. Creating admin user...");

      // Create admin user
      const user = await prisma.user.create({
        data: {
          email,
          name: "Admin",
          password: hashedPassword,
          role: "admin",
        },
      });

      console.log("✅ Admin user created successfully!\n");
      console.log("📋 Login Credentials:");
      console.log("─".repeat(40));
      console.log(`📧 Email:    ${user.email}`);
      console.log(`🔐 Password: ${newPassword}`);
      console.log(`👤 Role:     ${user.role}`);
      console.log("─".repeat(40));
    } else {
      console.log("✅ User found. Updating password...");

      // Update password
      const user = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: "admin",
        },
      });

      console.log("✅ Admin password updated successfully!\n");
      console.log("📋 Login Credentials:");
      console.log("─".repeat(40));
      console.log(`📧 Email:    ${user.email}`);
      console.log(`🔐 Password: ${newPassword}`);
      console.log(`👤 Role:     ${user.role}`);
      console.log("─".repeat(40));
    }

    console.log("\n🌐 Login at: https://kollect-it.com/admin/login");
    console.log("⚠️  IMPORTANT: Change this password after logging in!\n");
  } catch (error) {
    console.error("❌ Error updating password:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
