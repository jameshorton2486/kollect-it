/**
 * Verify Stripe Configuration
 * Tests that Stripe keys are properly configured and valid
 */

import Stripe from "stripe";

async function verifyStripeSetup() {
  console.log("Verifying Stripe configuration...\n");

  // Check environment variables
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let allValid = true;

  // 1. Check publishable key
  console.log("1) Checking publishable key...");
  if (!publishableKey) {
    console.error("   ERROR: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
    allValid = false;
  } else if (!publishableKey.startsWith("pk_test_") && !publishableKey.startsWith("pk_live_")) {
    console.error("   ERROR: Invalid format (must start with pk_test_ or pk_live_)");
    allValid = false;
  } else {
    const mode = publishableKey.startsWith("pk_test_") ? "TEST" : "LIVE";
    console.log(`   OK: Valid ${mode} publishable key`);
  }

  // 2. Check secret key
  console.log("\n2) Checking secret key...");
  if (!secretKey) {
    console.error("   ERROR: STRIPE_SECRET_KEY is not set");
    allValid = false;
  } else if (secretKey.startsWith("rk_")) {
    console.error("   ERROR: Restricted keys (rk_*) cannot be used for server-side Stripe operations");
    allValid = false;
  } else if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("sk_live_")) {
    console.error("   ERROR: Invalid format (must start with sk_test_ or sk_live_)");
    allValid = false;
  } else {
    const mode = secretKey.startsWith("sk_test_") ? "TEST" : "LIVE";
    console.log(`   OK: Valid ${mode} secret key`);

    // Try to connect to Stripe API
    try {
      console.log("\n3) Testing Stripe API connection...");
      const stripe = new Stripe(secretKey, { typescript: true });
      const account = await stripe.accounts.retrieve();
      console.log("   OK: Connected to Stripe successfully");
      console.log(`   OK: Account: ${account.email || account.id}`);
      console.log(`   OK: Mode: ${mode}`);

      // Verify webhook endpoint exists and includes required events (live or test, based on key)
      console.log("\n4) Checking webhook endpoint...");
      const requiredEvents = new Set([
        "checkout.session.completed",
        "payment_intent.succeeded",
        "payment_intent.payment_failed",
      ]);
      const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
      const targetUrl = "https://kollect-it.com/api/stripe/webhook";
      const endpoint = endpoints.data.find((item) => item.url === targetUrl);

      if (!endpoint) {
        console.error(`   ERROR: Webhook endpoint not found for ${targetUrl}`);
        allValid = false;
      } else {
        const enabled = new Set(endpoint.enabled_events || []);
        const missing = [...requiredEvents].filter((evt) => !enabled.has(evt));
        if (missing.length > 0) {
          console.error(`   ERROR: Webhook missing required events: ${missing.join(", ")}`);
          allValid = false;
        } else {
          console.log("   OK: Webhook endpoint found with required events");
        }
      }
    } catch (error) {
      console.error("   ERROR: Failed to connect to Stripe API");
      if (error instanceof Error) {
        console.error(`   ERROR: ${error.message}`);
      }
      allValid = false;
    }
  }

  // 3. Check webhook secret (optional)
  console.log("\n5) Checking webhook secret...");
  if (!webhookSecret) {
    if (secretKey?.startsWith("sk_live_")) {
      console.error("   ERROR: STRIPE_WEBHOOK_SECRET is required for live webhooks");
      allValid = false;
    } else {
      console.warn("   WARN: STRIPE_WEBHOOK_SECRET is not set (required for production webhooks)");
    }
  } else if (!webhookSecret.startsWith("whsec_")) {
    console.error("   ERROR: Invalid format (must start with whsec_)");
    allValid = false;
  } else {
    console.log("   OK: Valid webhook secret");
  }

  // 4. Check key consistency
  console.log("\n6) Checking key consistency...");
  if (publishableKey && secretKey) {
    const pubMode = publishableKey.startsWith("pk_test_") ? "test" : "live";
    const secMode = secretKey.startsWith("sk_test_") ? "test" : "live";

    if (pubMode !== secMode) {
      console.error("   ERROR: Mode mismatch");
      console.error(`   ERROR: Publishable key is ${pubMode.toUpperCase()} mode`);
      console.error(`   ERROR: Secret key is ${secMode.toUpperCase()} mode`);
      console.error("   ERROR: Both keys must be from the same mode (test or live)");
      allValid = false;
    } else {
      console.log(`   OK: Both keys are ${pubMode.toUpperCase()} mode (consistent)`);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  if (allValid) {
    console.log("OK: Stripe configuration is valid and ready to use.");
    console.log("\nNext steps:");
    if (secretKey?.startsWith("sk_test_")) {
      console.log("   - Test keys detected (good for development)");
      console.log("   - For production, switch to live keys in Vercel");
    } else {
      console.log("   - Live keys detected (ready for production)");
      console.log("   - Make sure these are set in Vercel environment variables");
    }
    process.exit(0);
  } else {
    console.error("ERROR: Stripe configuration has issues. Please fix the errors above.");
    console.error("\nSee docs/integrations/README.md for guidance.");
    process.exit(1);
  }
}

// Run verification
verifyStripeSetup().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
