// scripts/check-env.ts
// Simple environment variable checker for Kollect-It
// Run with: bun run scripts/check-env.ts or npm run test:env

type CheckResult = {
  name: string;
  set: boolean;
};

const REQUIRED_VARS: string[] = [
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
  "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
  "IMAGEKIT_PRIVATE_KEY",
];

const RECOMMENDED_VARS: string[] = [
  "RESEND_API_KEY",
  "EMAIL_SERVER",
  "EMAIL_FROM",
  "ADMIN_EMAIL",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_WS_URL",
];

function checkVars(names: string[]): CheckResult[] {
  return names.map((name) => ({
    name,
    set: !!process.env[name] && String(process.env[name]).trim() !== "",
  }));
}

function printSection(title: string, results: CheckResult[]): void {
  console.log(`\n=== ${title} ===`);
  results.forEach(({ name, set }) => {
    const status = set ? "✅" : "❌";
    console.log(` ${status} ${name}`);
  });
}

async function main() {
  console.log("🔍 Kollect-It environment check\n");

  const requiredResults = checkVars(REQUIRED_VARS);
  const recommendedResults = checkVars(RECOMMENDED_VARS);

  const missingRequired = requiredResults.filter(({ set }) => !set);
  const missingRecommended = recommendedResults.filter(({ set }) => !set);

  printSection("Required variables", requiredResults);
  printSection("Recommended variables", recommendedResults);

  console.log("\nSummary:");
  if (missingRequired.length === 0) {
    console.log(" ✅ All REQUIRED variables are set.");
  } else {
    console.log(" ❌ Missing REQUIRED variables:");
    missingRequired.forEach(({ name }) => console.log("   - " + name));
  }

  if (missingRecommended.length > 0) {
    console.log("\n (Optional) Missing RECOMMENDED variables:");
    missingRecommended.forEach(({ name }) => console.log("   - " + name));
  }

  process.exit(missingRequired.length === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("Unexpected error in check-env:", error);
  process.exit(1);
});
