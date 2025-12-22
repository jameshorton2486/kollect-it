#!/usr/bin/env bun
/**
 * Environment Variables Verification Script
 * Tests all critical env vars from .env.local
 */

import * as fs from "fs";
import * as path from "path";

interface EnvTest {
  key: string;
  required: boolean;
  test: (value: string) => Promise<boolean>;
  description: string;
}

const tests: EnvTest[] = [
  {
    key: "NODE_ENV",
    required: true,
    test: async (val) => val === "development" || val === "production",
    description: "Environment mode (development/production)",
  },
  {
    key: "DATABASE_URL",
    required: true,
    test: async (val) => val.startsWith("postgresql://"),
    description: "PostgreSQL connection string (pgbouncer)",
  },
  {
    key: "DIRECT_URL",
    required: true,
    test: async (val) => val.startsWith("postgresql://"),
    description: "Direct PostgreSQL connection (for migrations)",
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_URL",
    required: true,
    test: async (val) => val.startsWith("https://") && val.includes("supabase.co"),
    description: "Supabase project URL",
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    required: true,
    test: async (val) => val.length > 100 && val.includes("."),
    description: "Supabase anonymous key (JWT token)",
  },
  {
    key: "NEXTAUTH_URL",
    required: true,
    test: async (val) => val.startsWith("http://") || val.startsWith("https://"),
    description: "NextAuth authentication URL",
  },
  {
    key: "NEXTAUTH_SECRET",
    required: true,
    test: async (val) => val.length >= 32,
    description: "NextAuth encryption secret (min 32 chars)",
  },
  {
    key: "GOOGLE_CLIENT_ID",
    required: true,
    test: async (val) => val.includes("-") && val.includes("googleusercontent.com"),
    description: "Google OAuth Client ID",
  },
  {
    key: "GOOGLE_CLIENT_SECRET",
    required: true,
    test: async (val) => val.startsWith("GOCSPX-") || val.length > 20,
    description: "Google OAuth Client Secret",
  },
  {
    key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    required: true,
    test: async (val) => val.startsWith("pk_live_") || val.startsWith("pk_test_"),
    description: "Stripe publishable key (public)",
  },
  {
    key: "STRIPE_SECRET_KEY",
    required: true,
    test: async (val) => val.startsWith("sk_live_") || val.startsWith("sk_test_"),
    description: "Stripe secret key (private, server-side only)",
  },
  {
    key: "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    required: true,
    test: async (val) => val.startsWith("public_") && val.length > 20,
    description: "ImageKit public key",
  },
  {
    key: "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
    required: true,
    test: async (val) => val.startsWith("https://ik.imagekit.io/"),
    description: "ImageKit URL endpoint",
  },
  {
    key: "IMAGEKIT_PRIVATE_KEY",
    required: true,
    test: async (val) => val.startsWith("private_") && val.length > 20,
    description: "ImageKit private key (server-side only)",
  },
  {
    key: "ANTHROPIC_API_KEY",
    required: true,
    test: async (val) => val.startsWith("sk-ant-"),
    description: "Anthropic Claude API key",
  },
  {
    key: "OPENAI_API_KEY",
    required: true,
    test: async (val) => val.startsWith("sk-proj-"),
    description: "OpenAI API key",
  },
  {
    key: "RESEND_API_KEY",
    required: false,
    test: async (val) => val.startsWith("re_") && val.length > 20,
    description: "Resend email service API key",
  },
  {
    key: "EMAIL_FROM",
    required: true,
    test: async (val) => val.includes("@"),
    description: "Email sender address",
  },
  {
    key: "ADMIN_EMAIL",
    required: true,
    test: async (val) => val.includes("@"),
    description: "Admin user email",
  },
  {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    required: true,
    test: async (val) => val.length > 100 && val.includes("."),
    description: "Supabase service role key (JWT token)",
  },
];

async function runTests() {
  console.log("🔍 Environment Variables Verification\n");
  console.log("========================================\n");

  let passed = 0;
  let failed = 0;
  let missing = 0;

  for (const test of tests) {
    const value = process.env[test.key];

    if (!value) {
      if (test.required) {
        console.log(`❌ MISSING (REQUIRED): ${test.key}`);
        console.log(`   ${test.description}\n`);
        missing++;
      } else {
        console.log(`⚠️  MISSING (OPTIONAL): ${test.key}`);
        console.log(`   ${test.description}\n`);
      }
      continue;
    }

    try {
      const result = await test.test(value);

      if (result) {
        console.log(`✅ VALID: ${test.key}`);
        console.log(`   ${test.description}`);
        console.log(`   Format: ${value.substring(0, 30)}...\n`);
        passed++;
      } else {
        console.log(`❌ INVALID FORMAT: ${test.key}`);
        console.log(`   ${test.description}`);
        console.log(`   Got: ${value.substring(0, 50)}...\n`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ERROR TESTING: ${test.key}`);
      console.log(`   ${error}\n`);
      failed++;
    }
  }

  console.log("========================================\n");
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Missing: ${missing}`);
  console.log(`📊 Total: ${passed + failed + missing}\n`);

  if (failed > 0 || missing > 0) {
    console.log("🚨 ISSUES DETECTED - Please fix the above items.\n");
    process.exit(1);
  } else {
    console.log("✅ ALL ENVIRONMENT VARIABLES VALIDATED!\n");
    process.exit(0);
  }
}

runTests();
