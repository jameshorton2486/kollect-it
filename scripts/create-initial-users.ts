import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

type SeedUser = {
  email: string;
  password: string;
  name: string;
  role: string;
};

// Initial Kollect-It accounts requested
const USERS: SeedUser[] = [
  { email: "admin@kollect-it.com", name: "Admin", password: "KollectIt@2025Admin", role: "admin" },
  { email: "James@kollect-it.com", name: "James", password: "James@KI-2025", role: "admin" },
  { email: "billing@kollect-it.com", name: "Billing", password: "billing@KI-2025", role: "admin" },
  { email: "info@kollect-it.com", name: "Info", password: "info@KI-2025", role: "admin" },
  { email: "support@kollect-it.com", name: "Support", password: "support@KI-2025", role: "admin" },
];

async function upsertUser(u: SeedUser) {
  const hashed = await bcrypt.hash(u.password, 10);
  const user = await prisma.user.upsert({
    where: { email: u.email },
    update: { password: hashed, name: u.name, role: u.role },
    create: { email: u.email, password: hashed, name: u.name, role: u.role },
  });
  return { user, plainPassword: u.password };
}

async function main() {
  console.log("🚀 Creating initial Kollect-It users (idempotent upsert)\n");
  if (process.env.NODE_ENV === "production") {
    console.error("❌ Refusing to run seed user creation in production environment.");
    process.exit(1);
  }

  const results = [] as Array<{ email: string; password: string; id: string; role: string }>;

  for (const u of USERS) {
    try {
      const { user, plainPassword } = await upsertUser(u);
      results.push({ email: user.email, id: user.id, role: user.role, password: plainPassword });
      console.log(`✅ Upserted ${user.email} (role=${user.role})`);
    } catch (err) {
      console.error(`❌ Failed to upsert ${u.email}:`, err);
    }
  }

  console.log("\n📋 Created / Updated Users:");
  console.log("─".repeat(60));
  for (const r of results) {
    console.log(`📧 ${r.email}\n   ID: ${r.id}\n   Role: ${r.role}\n   Password: ${r.password}`);
    console.log("-".repeat(60));
  }
  console.log("\n⚠️  Store these passwords securely. Consider resetting after first login.\n");
}

main()
  .catch((e) => {
    console.error("Unexpected error while creating users", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
