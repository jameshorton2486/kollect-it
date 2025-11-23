#!/usr/bin/env bun

/**
 * 🧪 Kollect-It Production Verification Script
 * Tests all critical services and configurations
 * Run with: bun run scripts/verify-production.ts
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { Resend } from "resend";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

// Load environment variables
config({ path: ".env.local" });

interface TestResult {
  name: string;
  status: "pass" | "fail" | "warn" | "skip";
  message: string;
  details?: any;
}

class ProductionVerifier {
  private results: TestResult[] = [];
  private isProduction = process.env.NODE_ENV === "production";

  async runAllTests(): Promise<void> {
    console.log("🧪 Kollect-It Production Verification");
    console.log("=====================================\n");

    // Environment Variables
    await this.testEnvironmentVariables();

    // Database
    await this.testDatabaseConnection();

    // Stripe
    await this.testStripeIntegration();

    // ImageKit
    await this.testImageKit();

    // Email Service
    await this.testEmailService();

    // AI Services
    await this.testAIServices();

    // Generate Report
    this.generateReport();
  }

  private async testEnvironmentVariables(): Promise<void> {
    console.log("🔍 Testing Environment Variables...");

    const requiredVars = [
      "DATABASE_URL",
      "NEXTAUTH_SECRET",
      "NEXTAUTH_URL",
      "STRIPE_SECRET_KEY",
      "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
      "IMAGEKIT_PRIVATE_KEY",
      "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
      "RESEND_API_KEY",
      "ADMIN_EMAIL",
    ];

    const optionalVars = [
      "ANTHROPIC_API_KEY",
      "OPENAI_API_KEY",
      "VERCEL_URL",
    ];

    let configured = 0;
    const issues: string[] = [];

    // Check required variables
    for (const varName of requiredVars) {
      const value = process.env[varName];
      if (!value) {
        issues.push(`❌ ${varName} is missing`);
      } else if (value.length < 10) {
        issues.push(`⚠️  ${varName} seems too short`);
      } else {
        configured++;
      }
    }

    // Check optional variables
    for (const varName of optionalVars) {
      const value = process.env[varName];
      if (!value) {
        issues.push(`⏭️  ${varName} not configured (optional)`);
      }
    }

    // Special validations
    if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
      issues.push("⚠️  NEXTAUTH_SECRET should be at least 32 characters");
    }

    if (this.isProduction && process.env.NEXTAUTH_URL?.includes("localhost")) {
      issues.push("⚠️  NEXTAUTH_URL contains localhost in production");
    }

    const status = issues.some(i => i.startsWith("❌")) ? "fail" :
                   issues.some(i => i.startsWith("⚠️")) ? "warn" : "pass";

    this.results.push({
      name: "Environment Variables",
      status,
      message: `${configured}/${requiredVars.length} required variables configured`,
      details: issues,
    });
  }

  private async testDatabaseConnection(): Promise<void> {
    console.log("🗄️  Testing Database Connection...");

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        this.results.push({
          name: "Database",
          status: "fail",
          message: "Supabase credentials missing",
        });
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Test basic connection with a simple query that should work
      // Try to get categories first (more likely to exist and be accessible)
      const { data, error } = await supabase
        .from("Category")
        .select("count", { count: "exact", head: true });

      if (error) {
        // If Category fails, try User table
        const { data: userData, error: userError } = await supabase
          .from("User")
          .select("count", { count: "exact", head: true });

        if (userError) {
          throw userError;
        }

        this.results.push({
          name: "Database",
          status: "pass",
          message: `Connected (${userData || 0} users)`,
        });
      } else {
        this.results.push({
          name: "Database",
          status: "pass",
          message: `Connected (${data || 0} categories)`,
        });
      }

    } catch (error: any) {
      this.results.push({
        name: "Database",
        status: "fail",
        message: `Connection failed: ${error.message}`,
      });
    }
  }

  private async testStripeIntegration(): Promise<void> {
    console.log("💳 Testing Stripe Integration...");

    try {
      const stripeSecret = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecret) {
        this.results.push({
          name: "Stripe",
          status: "fail",
          message: "STRIPE_SECRET_KEY not configured",
        });
        return;
      }

      const stripe = new Stripe(stripeSecret, {
        apiVersion: "2024-06-20",
      });

      // Test API connection
      const balance = await stripe.balance.retrieve();

      const isLive = !stripeSecret.includes("sk_test_");
      const mode = isLive ? "live" : "test";

      let status: TestResult["status"] = "pass";
      let message = `Connected (${mode} mode)`;

      if (this.isProduction && !isLive) {
        status = "warn";
        message += " - Consider using live keys in production";
      }

      this.results.push({
        name: "Stripe",
        status,
        message,
      });

    } catch (error: any) {
      this.results.push({
        name: "Stripe",
        status: "fail",
        message: `Connection failed: ${error.message}`,
      });
    }
  }

  private async testImageKit(): Promise<void> {
    console.log("🖼️  Testing ImageKit...");

    try {
      const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
      const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
      const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

      if (!publicKey || !privateKey || !urlEndpoint) {
        this.results.push({
          name: "ImageKit",
          status: "fail",
          message: "ImageKit credentials incomplete",
        });
        return;
      }

      // Test ImageKit API directly (since we can't test local endpoint in standalone script)
      // This tests that the credentials are valid by making a basic API call
      const testUrl = `https://api.imagekit.io/v1/files?skip=0&limit=1`;

      const response = await fetch(testUrl, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`,
        },
      });

      if (response.ok) {
        this.results.push({
          name: "ImageKit",
          status: "pass",
          message: "CDN operational",
        });
      } else if (response.status === 401) {
        throw new Error("Invalid API credentials");
      } else {
        throw new Error(`API returned ${response.status}`);
      }

    } catch (error: any) {
      this.results.push({
        name: "ImageKit",
        status: "fail",
        message: `Connection failed: ${error.message}`,
      });
    }
  }

  private async testEmailService(): Promise<void> {
    console.log("📧 Testing Email Service...");

    try {
      const resendKey = process.env.RESEND_API_KEY;

      if (!resendKey) {
        this.results.push({
          name: "Email",
          status: "skip",
          message: "RESEND_API_KEY not configured (optional)",
        });
        return;
      }

      const resend = new Resend(resendKey);

      // Test API key validity
      const domains = await resend.domains.list();

      this.results.push({
        name: "Email",
        status: "pass",
        message: "Service configured",
      });

    } catch (error: any) {
      this.results.push({
        name: "Email",
        status: "fail",
        message: `Configuration failed: ${error.message}`,
      });
    }
  }

  private async testAIServices(): Promise<void> {
    console.log("🤖 Testing AI Services...");

    const claudeKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!claudeKey && !openaiKey) {
      this.results.push({
        name: "AI Services",
        status: "skip",
        message: "No AI services configured (optional)",
      });
      return;
    }

    const results: string[] = [];

    // Test Claude
    if (claudeKey) {
      try {
        const anthropic = new Anthropic({
          apiKey: claudeKey,
        });

        await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 10,
          messages: [{ role: "user", content: "Hello" }],
        });

        results.push("✅ Claude API functional");
      } catch (error: any) {
        results.push(`❌ Claude API failed: ${error.message}`);
      }
    }

    // Test OpenAI
    if (openaiKey) {
      try {
        const openai = new OpenAI({
          apiKey: openaiKey,
        });

        await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 10,
        });

        results.push("✅ OpenAI API functional");
      } catch (error: any) {
        results.push(`❌ OpenAI API failed: ${error.message}`);
      }
    }

    const hasFailures = results.some(r => r.startsWith("❌"));
    const status = hasFailures ? "fail" : "pass";

    this.results.push({
      name: "AI Services",
      status,
      message: results.length > 0 ? results.join(", ") : "No services tested",
    });
  }

  private generateReport(): void {
    console.log("\n📊 PRODUCTION VERIFICATION REPORT");
    console.log("==================================");

    const statusSymbols = {
      pass: "✅",
      fail: "❌",
      warn: "⚠️ ",
      skip: "⏭️ ",
    };

    let criticalFailures = 0;
    let warnings = 0;

    for (const result of this.results) {
      const symbol = statusSymbols[result.status];
      console.log(`${symbol} ${result.name}: ${result.message}`);

      if (result.details && result.details.length > 0) {
        for (const detail of result.details) {
          console.log(`   ${detail}`);
        }
      }

      if (result.status === "fail") criticalFailures++;
      if (result.status === "warn") warnings++;
    }

    console.log("\n🎯 PRODUCTION READINESS ASSESSMENT");
    console.log("===================================");

    if (criticalFailures === 0) {
      const readiness = warnings === 0 ? "EXCELLENT" : "GOOD";
      console.log(`✅ ${readiness} - Ready for deployment!`);
      if (warnings > 0) {
        console.log(`⚠️  ${warnings} warnings to address`);
      }
    } else {
      console.log(`❌ NEEDS ATTENTION - ${criticalFailures} critical issues`);
    }

    console.log("\n💡 Next Steps:");
    if (criticalFailures > 0) {
      console.log("   - Fix critical failures before deployment");
      console.log("   - Check service dashboards and credentials");
      console.log("   - Verify environment variables");
    } else {
      console.log("   - Run deployment tests: bun run scripts/test-vercel-deployment.ts");
      console.log("   - Complete production checklist");
      console.log("   - Deploy to production! 🚀");
    }
  }
}

// Run the verification
async function main() {
  const verifier = new ProductionVerifier();
  await verifier.runAllTests();
}

if (import.meta.main) {
  main().catch(console.error);
}

export { ProductionVerifier };