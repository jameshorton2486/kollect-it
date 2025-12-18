import 'dotenv/config';

import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import * as readline from "readline";

/**
 * Secure Admin User Creation Script
 * 
 * SECURITY: Uses environment variables or prompts for password
 * Never hardcodes credentials in this file
 */

async function promptInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log("🔐 Creating admin user...\n");
  console.log("⚠️  SECURITY: This script requires secure credentials\n");

  // Get email from environment or prompt
  const email = process.env.ADMIN_EMAIL || await promptInput("Admin email (or set ADMIN_EMAIL env var): ");
  
  if (!email || !email.includes("@")) {
    console.error("❌ Error: Valid email address required");
    process.exit(1);
  }

  // Get password from environment or prompt (recommended: use env var)
  let password = process.env.ADMIN_PASSWORD;
  
  if (!password) {
    console.log("💡 Tip: Set ADMIN_PASSWORD environment variable to avoid prompts");
    password = await promptInput("Admin password (input will be visible): ");
    
    // For security, prompt for confirmation
    const confirmPassword = await promptInput("Confirm password: ");
    
    if (password !== confirmPassword) {
      console.error("❌ Error: Passwords do not match");
      process.exit(1);
    }
  }

  if (!password || password.length < 8) {
    console.error("❌ Error: Password must be at least 8 characters long");
    process.exit(1);
  }

  const name = process.env.ADMIN_NAME || "Admin";

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create or update the user
    const user = await prisma.user.upsert({
      where: { email },
      update: { 
        password: hashedPassword,
        role: "admin",
      },
      create: {
        email,
        password: hashedPassword,
        name,
        role: "admin",
      },
    });

    console.log("✅ Admin user created/updated successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("─".repeat(40));
    console.log(`📧 Email:    ${user.email}`);
    if (!process.env.ADMIN_PASSWORD) {
      // Only show password if entered via prompt (not env var)
      console.log(`🔐 Password: ${password}`);
    } else {
      console.log(`🔐 Password: [Set via ADMIN_PASSWORD environment variable]`);
    }
    console.log("─".repeat(40));
    console.log("\n🌐 Login at:");
    console.log("   Local:      http://localhost:3000/admin/login");
    console.log("   Production: https://kollect-it.vercel.app/admin/login");
    console.log("\n⚠️  IMPORTANT: Save your password somewhere secure!");
    console.log("   (Consider using a password manager)\n");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
