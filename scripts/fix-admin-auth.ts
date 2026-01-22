#!/usr/bin/env tsx
/**
 * Quick Fix: Reset Admin Password
 * 
 * This script immediately resets the admin password so you can log in.
 * 
 * Usage:
 *   npx tsx scripts/fix-admin-auth.ts
 * 
 * After running, log in with:
 *   Email: admin@kollect-it.com
 *   Password: KollectIt2024!
 */

import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🔐 Fixing admin authentication...\n");

  const email = "admin@kollect-it.com";
  const newPassword = "KollectIt2024!";

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      console.log("❌ User not found. Creating admin user...");
      
      // Create admin user
      const hashedPassword = await bcrypt.hash(newPassword, 10);
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
      console.log("─".repeat(40));
    } else {
      console.log("✅ User found. Updating password...");
      
      // Update password and ensure admin role
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: "admin", // Ensure role is admin
        },
      });

      console.log("✅ Admin password reset successfully!\n");
      console.log("📋 Login Credentials:");
      console.log("─".repeat(40));
      console.log(`📧 Email:    ${user.email}`);
      console.log(`🔐 Password: ${newPassword}`);
      console.log(`👤 Role:     ${user.role}`);
      console.log("─".repeat(40));
    }

    console.log("\n🌐 Login at:");
    console.log("   Local:      http://localhost:3000/admin/login");
    console.log("   Production: https://kollect-it.com/admin/login");
    console.log("\n⚠️  IMPORTANT: Change this password after logging in!\n");
  } catch (error) {
    console.error("❌ Error fixing admin auth:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
