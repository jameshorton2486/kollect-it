import 'dotenv/config';

import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🔐 Setting up admin user...\n");

  // Get credentials from environment variables or command-line arguments
  const email = process.env.ADMIN_EMAIL || process.argv[2];
  const password = process.env.ADMIN_PASSWORD || process.argv[3];
  const name = process.env.ADMIN_NAME || process.argv[4] || "Admin";

  // Validate required credentials
  if (!email) {
    console.error("❌ Error: Email is required");
    console.error("\nUsage:");
    console.error("  Option 1: Set environment variables");
    console.error("    ADMIN_EMAIL=user@example.com ADMIN_PASSWORD=password ADMIN_NAME=Name npm run setup-admin");
    console.error("  Option 2: Pass as command-line arguments");
    console.error("    npm run setup-admin -- user@example.com password Name");
    console.error("\n⚠️  Never commit credentials to version control!");
    process.exit(1);
  }

  if (!password) {
    console.error("❌ Error: Password is required");
    console.error("\nUsage:");
    console.error("  Option 1: Set environment variables");
    console.error("    ADMIN_EMAIL=user@example.com ADMIN_PASSWORD=password ADMIN_NAME=Name npm run setup-admin");
    console.error("  Option 2: Pass as command-line arguments");
    console.error("    npm run setup-admin -- user@example.com password Name");
    console.error("\n⚠️  Never commit credentials to version control!");
    process.exit(1);
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create or update the user
    const user = await prisma.user.upsert({
      where: { email },
      update: { 
        password: hashedPassword,
        role: "admin",
        name: name,
      },
      create: {
        email,
        password: hashedPassword,
        name,
        role: "admin",
      },
    });

    console.log("✅ Admin user created/updated successfully!");
    console.log("\n📋 User Details:");
    console.log("─".repeat(50));
    console.log(`📧 Email:    ${user.email}`);
    console.log(`👤 Name:     ${user.name || 'Not set'}`);
    console.log(`👑 Role:     ${user.role}`);
    console.log(`🆔 ID:       ${user.id}`);
    console.log("─".repeat(50));
    console.log("\n🌐 Login at:");
    console.log("   Local:      http://localhost:3000/admin/login");
    console.log("   Production: https://kollect-it.vercel.app/admin/login");
    console.log("\n⚠️  IMPORTANT:");
    console.log("   - Your password was set but is not displayed for security");
    console.log("   - Save your credentials securely (use a password manager)");
    console.log("   - Never commit credentials to version control!\n");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

