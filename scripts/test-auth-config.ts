#!/usr/bin/env bun
/**
 * Test NextAuth Configuration (ADMIN_* env-based auth)
 *
 * This script expects ADMIN_EMAIL and ADMIN_PASSWORD_HASH in env.
 * The Kollect-It app uses DATABASE auth (User table) instead.
 * For env verification and login testing, use: bun run verify:auth
 * See docs/AUTH-SETUP-AND-TEST.md.
 */

import bcrypt from "bcryptjs";

async function testAuth() {
  console.log("🔐 Testing NextAuth Configuration...\n");

  // Check environment variables
  const checks = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
  };

  let allPresent = true;

  for (const [key, value] of Object.entries(checks)) {
    if (!value) {
      console.error(`❌ ${key}: Missing`);
      allPresent = false;
    } else {
      const displayValue = value.length > 50 ? `${value.substring(0, 30)}...` : value;
      console.log(`✅ ${key}: ${displayValue}`);
    }
  }

  if (!allPresent) {
    console.error("\n❌ Missing required environment variables");
    process.exit(1);
  }

  // Test password hash validity
  console.log("\n🔑 Testing password hash...");
  const testPassword = "Texas1234";

  try {
    const isValid = await bcrypt.compare(
      testPassword,
      checks.ADMIN_PASSWORD_HASH!
    );

    if (isValid) {
      console.log(`✅ Password hash is valid (test password: "${testPassword}")`);
    } else {
      console.error(`❌ Password hash does NOT match test password`);
      process.exit(1);
    }
  } catch (error: any) {
    console.error(`❌ Password hash validation error: ${error.message}`);
    process.exit(1);
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("✅ NextAuth configuration is valid!");
  console.log("\nYou can now:");
  console.log(`1. Start dev server: bun run dev`);
  console.log(`2. Navigate to: http://localhost:3000/login`);
  console.log(`3. Login with:`);
  console.log(`   Email: ${checks.ADMIN_EMAIL}`);
  console.log(`   Password: ${testPassword}`);
  console.log("\n" + "=".repeat(50));
}

testAuth();
