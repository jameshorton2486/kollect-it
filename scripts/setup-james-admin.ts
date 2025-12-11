import 'dotenv/config';

import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🔐 Setting up admin user for James...\n");

  const email = "jameshorton2486@gmail.com";
  const password = "admin2486";
  const name = "James";

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
    console.log("\n📋 Login Credentials:");
    console.log("─".repeat(50));
    console.log(`📧 Email:    ${user.email}`);
    console.log(`👤 Name:     ${user.name || 'Not set'}`);
    console.log(`🔐 Password: ${password}`);
    console.log(`👑 Role:     ${user.role}`);
    console.log(`🆔 ID:       ${user.id}`);
    console.log("─".repeat(50));
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

