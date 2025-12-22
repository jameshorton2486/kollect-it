/**
 * Verify Stripe Configuration
 * Tests that Stripe keys are properly configured and valid
 */

import Stripe from "stripe";

async function verifyStripeSetup() {
  console.log("💳 Verifying Stripe Configuration...\n");

  // Check environment variables
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let allValid = true;

  // 1. Check publishable key
  console.log("1️⃣ Checking Publishable Key...");
  if (!publishableKey) {
    console.error("   ❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
    allValid = false;
  } else if (!publishableKey.startsWith("pk_test_") && !publishableKey.startsWith("pk_live_")) {
    console.error(`   ❌ Invalid format: Should start with pk_test_ or pk_live_`);
    console.error(`   ❌ Current value starts with: ${publishableKey.substring(0, 10)}...`);
    allValid = false;
  } else {
    const mode = publishableKey.startsWith("pk_test_") ? "TEST" : "LIVE";
    console.log(`   ✅ Valid ${mode} publishable key`);
  }

  // 2. Check secret key
  console.log("\n2️⃣ Checking Secret Key...");
  if (!secretKey) {
    console.error("   ❌ STRIPE_SECRET_KEY is not set");
    allValid = false;
  } else if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("sk_live_")) {
    console.error(`   ❌ Invalid format: Should start with sk_test_ or sk_live_`);
    console.error(`   ❌ Current value starts with: ${secretKey.substring(0, 10)}...`);
    allValid = false;
  } else {
    const mode = secretKey.startsWith("sk_test_") ? "TEST" : "LIVE";
    console.log(`   ✅ Valid ${mode} secret key`);

    // Try to connect to Stripe API
    try {
      console.log("\n3️⃣ Testing Stripe API Connection...");
      const stripe = new Stripe(secretKey, { typescript: true });
      const account = await stripe.accounts.retrieve();
      console.log(`   ✅ Connected to Stripe successfully`);
      console.log(`   ✅ Account: ${account.email || account.id}`);
      console.log(`   ✅ Mode: ${mode}`);
    } catch (error) {
      console.error("   ❌ Failed to connect to Stripe API");
      if (error instanceof Error) {
        console.error(`   ❌ Error: ${error.message}`);
      }
      allValid = false;
    }
  }

  // 3. Check webhook secret (optional)
  console.log("\n4️⃣ Checking Webhook Secret...");
  if (!webhookSecret) {
    console.warn("   ⚠️  STRIPE_WEBHOOK_SECRET is not set (optional but recommended)");
  } else if (!webhookSecret.startsWith("whsec_")) {
    console.error(`   ❌ Invalid format: Should start with whsec_`);
    console.error(`   ❌ Current value starts with: ${webhookSecret.substring(0, 10)}...`);
    allValid = false;
  } else {
    console.log("   ✅ Valid webhook secret");
  }

  // 4. Check key consistency
  console.log("\n5️⃣ Checking Key Consistency...");
  if (publishableKey && secretKey) {
    const pubMode = publishableKey.startsWith("pk_test_") ? "test" : "live";
    const secMode = secretKey.startsWith("sk_test_") ? "test" : "live";

    if (pubMode !== secMode) {
      console.error(`   ❌ Mode mismatch!`);
      console.error(`   ❌ Publishable key is ${pubMode.toUpperCase()} mode`);
      console.error(`   ❌ Secret key is ${secMode.toUpperCase()} mode`);
      console.error(`   ❌ Both keys must be from the same mode (test or live)`);
      allValid = false;
    } else {
      console.log(`   ✅ Both keys are ${pubMode.toUpperCase()} mode (consistent)`);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  if (allValid) {
    console.log("✅ Stripe configuration is valid and ready to use!");
    console.log("\n📋 Next Steps:");
    if (secretKey?.startsWith("sk_test_")) {
      console.log("   • Test keys detected - good for development");
      console.log("   • For production, switch to live keys in Vercel");
    } else {
      console.log("   • Live keys detected - ready for production");
      console.log("   • Make sure these are set in Vercel environment variables");
    }
    process.exit(0);
  } else {
    console.error("❌ Stripe configuration has errors. Please fix the issues above.");
    console.error("\n💡 See STRIPE_SETUP_GUIDE.md for help getting correct keys.");
    process.exit(1);
  }
}

// Run verification
verifyStripeSetup().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
