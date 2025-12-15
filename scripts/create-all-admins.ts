import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

interface UserToCreate {
  email: string;
  password: string;
  name: string;
}

/**
 * SECURITY WARNING: This script should only be used in development
 * For production, use create-admin.ts with environment variables
 * 
 * To use this script securely:
 * 1. Set passwords via environment variables
 * 2. Or modify this script to use a secure configuration file (not committed)
 * 3. Never commit passwords to version control
 */

async function main() {
  console.log("🔐 Creating admin users...\n");
  console.log("⚠️  SECURITY: This script requires environment variables for all passwords\n");

  // Check if running in production
  if (process.env.NODE_ENV === "production") {
    console.error("❌ ERROR: This script should not be run in production!");
    console.error("   Use scripts/create-admin.ts with environment variables instead.");
    process.exit(1);
  }

  // SECURITY: All passwords must come from environment variables
  const requiredEnvVars = {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    JAMES_PASSWORD: process.env.JAMES_PASSWORD,
    BILLING_PASSWORD: process.env.BILLING_PASSWORD,
    INFO_PASSWORD: process.env.INFO_PASSWORD,
    SUPPORT_PASSWORD: process.env.SUPPORT_PASSWORD,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error("❌ ERROR: Missing required environment variables:");
    missingVars.forEach(v => console.error(`   - ${v}`));
    console.error("\n💡 Set these in .env.local before running this script.");
    console.error("   Example: ADMIN_PASSWORD=your-secure-password-here");
    process.exit(1);
  }

  const users: UserToCreate[] = [
    {
      email: "admin@kollect-it.com",
      password: requiredEnvVars.ADMIN_PASSWORD!,
      name: "Admin",
    },
    {
      email: "james@kollect-it.com",
      password: requiredEnvVars.JAMES_PASSWORD!,
      name: "James",
    },
    {
      email: "billing@kollect-it.com",
      password: requiredEnvVars.BILLING_PASSWORD!,
      name: "Billing",
    },
    {
      email: "info@kollect-it.com",
      password: requiredEnvVars.INFO_PASSWORD!,
      name: "Info",
    },
    {
      email: "support@kollect-it.com",
      password: requiredEnvVars.SUPPORT_PASSWORD!,
      name: "Support",
    },
  ];

  try {
    for (const userData of users) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create or update the user
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          password: hashedPassword,
          role: "admin",
        },
        create: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          role: "admin",
        },
      });

      console.log(`✅ Created: ${user.email}`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("📋 All Admin Users Created Successfully!");
    console.log("=".repeat(50));
    console.log("\n🔐 Login Credentials:\n");

    users.forEach((user) => {
      console.log(`📧 ${user.email}`);
      console.log(`   Password: [Set via environment variable]\n`);
    });

    console.log("=".repeat(50));
    console.log("\n🌐 Login URLs:");
    console.log("   Local:      http://localhost:3000/admin/login");
    console.log("   Production: https://kollect-it.vercel.app/admin/login");
    console.log("\n⚠️  IMPORTANT: Save these credentials somewhere secure!");
    console.log("   (Consider using a password manager)\n");
  } catch (error) {
    console.error("❌ Error creating admin users:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
