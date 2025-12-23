// scripts/setup-imagekit-sync.ts
// Helper script to verify ImageKit configuration before enabling sync flows.

const REQUIRED_IMAGEKIT_VARS = [
  "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
  "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
  "IMAGEKIT_PRIVATE_KEY",
];

function checkEnv() {
  console.log("🖼  Kollect-It ImageKit setup check\n");

  const missing: string[] = [];
  for (const name of REQUIRED_IMAGEKIT_VARS) {
    const value = process.env[name];
    const isSet = !!value && String(value).trim() !== "";
    console.log(`${isSet ? "✅" : "❌"} ${name}`);
    if (!isSet) {
      missing.push(name);
    }
  }

  if (missing.length === 0) {
    console.log("\nAll ImageKit variables are set. You're ready to configure sync scripts.");
  } else {
    console.log("\nMissing ImageKit variables:");
    missing.forEach((name) => console.log(" - " + name));
    console.log(
      "\nAdd these to your .env.local for local development and to your hosting provider for production.",
    );
  }
}

async function main() {
  console.log("Running ImageKit sync setup helper...\n");
  checkEnv();

  console.log(
    "\nNext steps:\n" +
      " 1. Verify your ImageKit account credentials and URL endpoint.\n" +
      " 2. Confirm Google Drive → ImageKit sync scripts are configured.\n" +
      " 3. Use `npm run sync-images` once environment values are in place.\n",
  );
}

main().catch((error) => {
  console.error("Error in setup-imagekit-sync:", error);
  process.exit(1);
});
