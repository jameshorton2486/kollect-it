import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

interface UserToCreate {
  email: string;
  password: string;
  name: string;
}

async function main() {
  console.log("🔐 Creating admin users...\n");

  const users: UserToCreate[] = [
    {
      email: "admin@kollect-it.com",
      password: "admin@KI-2025",
      name: "Admin",
    },
    {
      email: "james@kollect-it.com",
      password: "James@KI-2025",
      name: "James",
    },
    {
      email: "billing@kollect-it.com",
      password: "billing@KI-2025",
      name: "Billing",
    },
    {
      email: "info@kollect-it.com",
      password: "info@KI-2025",
      name: "Info",
    },
    {
      email: "support@kollect-it.com",
      password: "support@KI-2025",
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
      console.log(`   Password: ${user.password}\n`);
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
