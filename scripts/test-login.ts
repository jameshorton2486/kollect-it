/**
 * Test login credentials against the database
 * Run: npx tsx scripts/test-login.ts
 */
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.TEST_EMAIL || "info@kollect-it.com";
  const password = process.env.TEST_PASSWORD;

  if (!password) {
    console.error("❌ TEST_PASSWORD environment variable required");
    console.log('Usage: TEST_PASSWORD="yourpassword" npx tsx scripts/test-login.ts');
    process.exit(1);
  }

  console.log(` Testing login for: ${email}\n`);

  // 1. Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
      emailVerified: true,
    },
  });

  if (!user) {
    console.error("❌ USER NOT FOUND in database");
    console.log("\n Run the create-admin script first:");
    console.log('   $env:DATABASE_URL="your-db-url"');
    console.log('   $env:ADMIN_EMAIL="info@kollect-it.com"');
    console.log('   $env:ADMIN_PASSWORD="yourpassword"');
    console.log("   npx tsx scripts/create-admin.ts");
    await prisma.$disconnect();
    process.exit(1);
  }

  console.log("✅ User found:");
  console.log(`   ID: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Name: ${user.name || "(not set)"}`);
  console.log(`   Role: ${user.role}`);
  console.log(`   Email Verified: ${user.emailVerified ? "Yes" : "No"}`);
  console.log(`   Has Password: ${user.password ? "Yes" : "No"}`);

  // 2. Check password
  if (!user.password) {
    console.error("\n❌ USER HAS NO PASSWORD SET");
    console.log(" Re-run create-admin script to set password");
    await prisma.$disconnect();
    process.exit(1);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    console.log("\n✅ PASSWORD MATCHES - Login should work!");

    if (!user.emailVerified) {
      console.warn("\n⚠️  WARNING: Email not verified - some systems require this");
    }

    if (user.role !== "admin") {
      console.warn(`\n⚠️  WARNING: User role is "${user.role}", not "admin"`);
    }
  } else {
    console.error("\n❌ PASSWORD DOES NOT MATCH");
    console.log("\n Possible causes:");
    console.log("   1. Wrong password entered");
    console.log("   2. Password was changed after generation");
    console.log("   3. Hash algorithm mismatch");
    console.log("\n Re-run create-admin script with correct password");
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Error:", e);
  prisma.$disconnect();
  process.exit(1);
});
