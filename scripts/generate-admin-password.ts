import bcrypt from "bcryptjs";

// Generate a secure random password
function generatePassword(length: number = 16): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function main() {
  const newPassword = generatePassword(16);
  const hash = await bcrypt.hash(newPassword, 12);

  console.log("\n✅ New Admin Credentials Generated\n");
  console.log("══════════════════════════════════════");
  console.log("Email:    info@kollect-it.com");
  console.log("Password:", newPassword);
  console.log("══════════════════════════════════════");
  console.log("\nPassword Hash (for .env):");
  console.log(hash);
  console.log("\n⚠️  SAVE THIS PASSWORD SECURELY - IT WON'T BE SHOWN AGAIN!\n");
}

main();
