import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🔐 Creating admin user...\n");

  // Change these values
  const email = "admin@kollect-it.com";
  const password = "KollectIt@2025Admin"; // CHANGE THIS TO YOUR SECURE PASSWORD!
  const name = "Admin";

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

    console.log("✅ Admin user created successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("─".repeat(40));
    console.log(`📧 Email:    ${user.email}`);
    console.log(`🔐 Password: ${password}`);
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
