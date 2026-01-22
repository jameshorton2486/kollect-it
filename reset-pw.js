const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("KollectIt2024!", 12);
  const user = await prisma.user.update({
    where: { email: "jameshorton2486@gmail.com" },
    data: { password: hash }
  });
  console.log("? Password reset for:", user.email);
  console.log("   New password: KollectIt2024!");
  await prisma.$disconnect();
}
main().catch(console.error);
