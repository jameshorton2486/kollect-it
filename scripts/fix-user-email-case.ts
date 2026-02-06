import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🔧 Normalizing user emails to lowercase\n");

  const users = await prisma.user.findMany({
    select: { id: true, email: true },
  });

  let fixed = 0;
  for (const u of users) {
    const lower = u.email.toLowerCase();
    if (u.email === lower) continue;
    const existing = users.find((o) => o.id !== u.id && o.email.toLowerCase() === lower);
    if (existing) {
      console.log(`   Skip (duplicate): "${u.email}" → "${lower}" (already exists as ${existing.email})`);
      continue;
    }
    await prisma.user.update({
      where: { id: u.id },
      data: { email: lower },
    });
    console.log(`   Fixed: "${u.email}" → "${lower}"`);
    fixed++;
  }

  await prisma.$disconnect();

  console.log("\n" + "=".repeat(50));
  console.log(`Done. ${fixed} user(s) updated.`);
  if (fixed > 0) {
    console.log("Login lookups use lowercase; re-run audit-users.ts to verify.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
