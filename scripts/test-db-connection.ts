#!/usr/bin/env tsx
/**
 * Test Database Connection
 * 
 * Verifies that DATABASE_URL and DIRECT_URL are correctly configured
 * and that we can connect to the database.
 * 
 * Usage:
 *   npx tsx scripts/test-db-connection.ts
 */

import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🔍 Testing database connection...\n");

  // Check environment variables
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  console.log("📋 Environment Variables:");
  console.log("─".repeat(50));
  
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not set!");
    console.log("   Set it in .env.local or environment variables");
    process.exit(1);
  } else {
    // Mask password in output
    const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ":****@");
    console.log(`✅ DATABASE_URL: ${maskedUrl.substring(0, 60)}...`);
  }

  if (!directUrl) {
    console.warn("⚠️  DIRECT_URL is not set (optional for migrations)");
  } else {
    const maskedUrl = directUrl.replace(/:([^:@]+)@/, ":****@");
    console.log(`✅ DIRECT_URL: ${maskedUrl.substring(0, 60)}...`);
  }

  console.log("─".repeat(50));
  console.log("");

  // Test connection
  try {
    console.log("🔄 Attempting to connect to database...");
    
    // Simple query to test connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    console.log("✅ Database connection successful!");
    console.log("");

    // Test Prisma client
    console.log("🔄 Testing Prisma client...");
    const userCount = await prisma.user.count();
    console.log(`✅ Prisma client working! Found ${userCount} user(s) in database.`);
    console.log("");

    // Test a simple query
    console.log("🔄 Testing database query...");
    const testUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (testUser) {
      console.log("✅ Can query database successfully!");
      console.log(`   Sample user: ${testUser.email} (${testUser.role})`);
    } else {
      console.log("✅ Can query database (no users found yet)");
    }

    console.log("");
    console.log("🎉 All database tests passed!");
    console.log("");
    console.log("📝 Next steps:");
    console.log("   1. Run: npx tsx scripts/fix-admin-auth.ts");
    console.log("   2. Test login at: http://localhost:3000/admin/login");
    console.log("");

  } catch (error: any) {
    console.error("❌ Database connection failed!");
    console.error("");
    console.error("Error details:");
    console.error(error.message);
    console.error("");

    // Provide helpful error messages
    if (error.message.includes("SASL authentication")) {
      console.error("🔴 SASL Authentication Failed");
      console.error("   This means the database password is incorrect.");
      console.error("");
      console.error("   Fix:");
      console.error("   1. Reset password in Supabase dashboard");
      console.error("   2. Update DATABASE_URL in .env.local");
      console.error("   3. Update DATABASE_URL in Vercel");
      console.error("   4. Run this test again");
    } else if (error.message.includes("Can't reach database server")) {
      console.error("🔴 Cannot Reach Database Server");
      console.error("   This means the connection string is wrong or network is blocked.");
      console.error("");
      console.error("   Fix:");
      console.error("   1. Check DATABASE_URL format");
      console.error("   2. Verify Supabase project is active");
      console.error("   3. Check network/firewall settings");
    } else if (error.message.includes("timeout")) {
      console.error("🔴 Connection Timeout");
      console.error("   This means the database server is not responding.");
      console.error("");
      console.error("   Fix:");
      console.error("   1. Check if Supabase project is paused");
      console.error("   2. Verify connection string host/port");
      console.error("   3. Try direct connection (DIRECT_URL)");
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
