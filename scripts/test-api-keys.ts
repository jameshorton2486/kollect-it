#!/usr/bin/env bun
/**
 * Test API Keys
 * Validates that Stripe and Anthropic API keys are working
 */

import Stripe from "stripe";

async function testStripeKey() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    console.error("❌ STRIPE_SECRET_KEY not found in environment");
    return false;
  }

  try {
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-12-18.acacia",
    });

    // Simple API call to verify key
    const balance = await stripe.balance.retrieve();
    console.log("✅ Stripe API Key: Valid");
    console.log(`   Balance: ${balance.available[0]?.amount || 0} ${balance.available[0]?.currency || 'USD'}`);
    return true;
  } catch (error: any) {
    console.error("❌ Stripe API Key: Invalid");
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

async function testAnthropicKey() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!anthropicKey) {
    console.error("❌ ANTHROPIC_API_KEY not found in environment");
    return false;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 10,
        messages: [{ role: "user", content: "Hi" }],
      }),
    });

    if (response.ok) {
      console.log("✅ Anthropic API Key: Valid");
      return true;
    } else {
      const error = await response.json();
      console.error("❌ Anthropic API Key: Invalid");
      console.error(`   Error: ${error.error?.message || response.statusText}`);
      return false;
    }
  } catch (error: any) {
    console.error("❌ Anthropic API Key: Error");
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("🔑 Testing API Keys...\n");

  const stripeValid = await testStripeKey();
  console.log();
  const anthropicValid = await testAnthropicKey();

  console.log("\n" + "=".repeat(50));
  if (stripeValid && anthropicValid) {
    console.log("✅ All API keys are valid!");
  } else {
    console.log("❌ Some API keys are invalid. Please check and update.");
    process.exit(1);
  }
}

main();
