/**
 * Helper script to guide you through fixing DIRECT_URL
 * 
 * This script checks your current DIRECT_URL configuration
 * and provides specific instructions if it needs fixing.
 */

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

console.log("🔍 Checking DIRECT_URL Configuration...\n");

if (!databaseUrl) {
  console.log("❌ DATABASE_URL is not set in your environment");
  console.log("   Please check your .env.local file");
  process.exit(1);
}

if (!directUrl) {
  console.log("❌ DIRECT_URL is missing!\n");
  console.log("📝 TO FIX:");
  console.log("   1. Open .env.local in your project root");
  console.log("   2. Copy your DATABASE_URL line");
  console.log("   3. Paste it below and change:");
  console.log("      - DATABASE_URL → DIRECT_URL");
  console.log("      - Port 6543 → Port 5432\n");
  console.log("   Example:");
  console.log(`   DATABASE_URL="${databaseUrl.substring(0, 60)}..."`);
  console.log(`   DIRECT_URL="${databaseUrl.replace(':6543', ':5432').substring(0, 60)}..."`);
  console.log("\n   ⚠️  Note: For Supabase, the hostname might be different.");
  console.log("      Check your Supabase dashboard → Settings → Database");
  console.log("      for the 'Connection string' (direct connection, not pooler)");
  process.exit(1);
}

// Check port
const portMatch = directUrl.match(/:(\d+)\//);
const port = portMatch ? portMatch[1] : null;

if (port === "6543") {
  console.log("❌ DIRECT_URL is using port 6543 (pooler port)");
  console.log("   It MUST use port 5432 for direct connections\n");
  console.log("📝 TO FIX:");
  console.log("   In .env.local, change DIRECT_URL:");
  console.log(`   Current: ${directUrl.substring(0, 80)}...`);
  console.log(`   Change port from 6543 to 5432`);
  console.log(`   Should be: ${directUrl.replace(':6543', ':5432').substring(0, 80)}...`);
  process.exit(1);
}

if (port !== "5432") {
  console.log(`⚠️  WARNING: DIRECT_URL port is ${port}, expected 5432`);
  console.log("   This might cause migration issues");
} else {
  console.log("✅ DIRECT_URL is configured correctly!");
  console.log(`   Port: ${port} (correct)`);
  console.log(`   URL: ${directUrl.substring(0, 60)}...`);
  console.log("\n✨ Your DIRECT_URL is ready for migrations!");
}
