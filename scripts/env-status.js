#!/usr/bin/env node
/**
 * Quick Environment Variables Status Report
 */

const envVars = {
  "DATABASE_URL": "✅ PostgreSQL (pgbouncer)",
  "DIRECT_URL": "✅ PostgreSQL (direct, migrations)",
  "NEXT_PUBLIC_SUPABASE_URL": "✅ Supabase URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY": "✅ Supabase anonymous key",
  "NEXTAUTH_URL": "✅ NextAuth URL",
  "NEXTAUTH_SECRET": "✅ NextAuth secret",
  "GOOGLE_CLIENT_ID": "✅ Google OAuth",
  "GOOGLE_CLIENT_SECRET": "✅ Google OAuth secret",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "✅ Stripe publishable (pk_live_)",
  "STRIPE_SECRET_KEY": "✅ Stripe secret (sk_live_)",
  "STRIPE_WEBHOOK_SECRET": "⚠️  Stripe webhook (placeholder)",
  "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY": "✅ ImageKit public key",
  "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT": "✅ ImageKit endpoint",
  "IMAGEKIT_PRIVATE_KEY": "✅ ImageKit private key",
  "ANTHROPIC_API_KEY": "✅ Anthropic Claude API",
  "OPENAI_API_KEY": "✅ OpenAI API",
  "RESEND_API_KEY": "✅ Resend email service",
  "EMAIL_FROM": "✅ Email sender",
  "ADMIN_EMAIL": "✅ Admin email",
  "SUPABASE_SERVICE_ROLE_KEY": "✅ Supabase service role",
};

console.log("\n🔍 ENVIRONMENT VARIABLES STATUS REPORT\n");
console.log("=========================================\n");

for (const [key, desc] of Object.entries(envVars)) {
  const value = process.env[key];
  const status = value ? "✅ SET" : "❌ MISSING";
  console.log(`${status} | ${key.padEnd(40)} | ${desc}`);
}

console.log("\n=========================================\n");

const set = Object.keys(envVars).filter(k => process.env[k]).length;
const total = Object.keys(envVars).length;

console.log(`📊 Summary: ${set}/${total} variables configured\n`);

if (set === total) {
  console.log("✅ ALL VARIABLES CONFIGURED!\n");
} else {
  console.log(`⚠️  ${total - set} variables missing or incomplete\n`);
}
