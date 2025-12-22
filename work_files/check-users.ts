import 'dotenv/config';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking all users in database...\n");

  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`Found ${users.length} users:\n`);

  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Created: ${user.createdAt.toISOString().split('T')[0]}`);
    console.log('');
  });
}

main()
  .catch((e) => console.error('Error:', e))
  .finally(async () => await prisma.$disconnect());
