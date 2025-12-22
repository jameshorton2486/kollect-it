import { PrismaClient } from "@prisma/client";

/**
 * Validates that DIRECT_URL is properly configured for category system
 * This script checks:
 * 1. DIRECT_URL is set in environment
 * 2. DIRECT_URL uses port 5432 (not 6543)
 * 3. Database connection works
 * 4. Category/Subcategory tables exist
 */
async function main() {
  console.log("🔍 Validating Category System Setup...\n");

  // Check environment variables
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  console.log("📋 Environment Check:");
  console.log(`   DATABASE_URL: ${databaseUrl ? "✅ Set" : "❌ Missing"}`);
  console.log(`   DIRECT_URL: ${directUrl ? "✅ Set" : "❌ Missing"}\n`);

  if (!directUrl) {
    console.log("❌ DIRECT_URL is not set!");
    console.log("\n📝 To fix this:");
    console.log("   1. Open .env.local in your project root");
    console.log("   2. Copy your DATABASE_URL line");
    console.log("   3. Paste it below and change:");
    console.log("      - DATABASE_URL → DIRECT_URL");
    console.log("      - Port 6543 → Port 5432");
    console.log("\n   Example:");
    console.log('   DATABASE_URL="postgresql://user:pass@host:6543/db"');
    console.log('   DIRECT_URL="postgresql://user:pass@host:5432/db"');
    process.exit(1);
  }

  // Check port number
  const portMatch = directUrl.match(/:(\d+)\//);
  const port = portMatch ? portMatch[1] : null;

  if (port === "6543") {
    console.log("⚠️  WARNING: DIRECT_URL is using port 6543 (pooler port)");
    console.log("   It should use port 5432 (direct connection)");
    console.log("\n📝 To fix:");
    console.log("   In .env.local, change DIRECT_URL port from 6543 to 5432");
    console.log(`   Current: ${directUrl.substring(0, 100)}...`);
    process.exit(1);
  }

  if (port !== "5432") {
    console.log(`⚠️  WARNING: DIRECT_URL port is ${port}, expected 5432`);
  } else {
    console.log("✅ DIRECT_URL uses correct port (5432)");
  }

  // Test database connection
  console.log("\n🔌 Testing Database Connection...");
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log("✅ Database connection successful");

    // Check if tables exist
    const categoryCount = await prisma.category.count();
    const subcategoryCount = await prisma.subcategory.count();

    console.log("\n📊 Database Status:");
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Subcategories: ${subcategoryCount}`);

    if (categoryCount === 0) {
      console.log("\n💡 No categories found. Run the seed script:");
      console.log("   npx tsx scripts/seed-categories.ts");
    } else {
      console.log("\n✅ Category system is ready!");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    if (error instanceof Error) {
      if (error.message.includes("P1001")) {
        console.log("\n💡 This might be a connection issue. Check:");
        console.log("   1. DIRECT_URL is correct");
        console.log("   2. Database server is accessible");
        console.log("   3. Firewall/network settings");
      }
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n✨ Validation complete!");
}

main().catch((e) => {
  console.error("❌ Validation error:", e);
  process.exit(1);
});

