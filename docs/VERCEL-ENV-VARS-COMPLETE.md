# Kollect-It: Complete Vercel Environment Variables Checklist

**Generated from:** Prompt #8 - Generate Vercel Env Var List
**Date:** 2026-01-27
**Purpose:** Complete reference for all required environment variables in Vercel production

---

## 1. Database (Supabase PostgreSQL)

### DATABASE_URL

- **Description:** Pooled connection string for serverless functions (uses pgbouncer on port 6543)
- **Format:** `postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true`
- **Where to get:** Supabase Dashboard → Settings → Database → Connection string (pooled)
- **Required:** ✅ Yes
- **Example:** `postgresql://postgres.xxxxx:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

### DIRECT_URL

- **Description:** Direct connection string for migrations and Prisma operations (port 5432)
- **Format:** `postgresql://postgres:[password]@[host]:5432/postgres`
- **Where to get:** Supabase Dashboard → Settings → Database → Connection string (direct)
- **Required:** ✅ Yes
- **Example:** `postgresql://postgres.xxxxx:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres`

**⚠️ IMPORTANT:** Supabase now uses "Opaque Tokens" instead of passwords. If your connection string contains a password that doesn't work, you may need to:

1. Go to Supabase Dashboard → Settings → Database
2. Click "Reset Database Password" or generate a new connection string
3. The new connection string will use an opaque token format

---

## 2. Authentication (NextAuth.js)

### NEXTAUTH_URL

- **Description:** Public URL of your application (used for OAuth callbacks and email links)
- **Format:** Full URL with protocol
- **Required:** ✅ Yes
- **Production value:** `https://kollect-it.com`
- **Development value:** `http://localhost:3000`

### NEXTAUTH_SECRET

- **Description:** Secret key for signing and encrypting JWT tokens and session cookies
- **Format:** Random string, 32+ characters
- **How to generate:** `openssl rand -base64 32` (or use: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`)
- **Required:** ✅ Yes
- **Example:** `aBc123XyZ456...` (32+ character random string)

---

## 3. Stripe (Payment Processing)

### STRIPE_SECRET_KEY

- **Description:** Server-side secret key for Stripe API operations (charges, refunds, webhooks)
- **Format:** `sk_live_...` (production) or `sk_test_...` (testing)
- **Where to get:** Stripe Dashboard → Developers → API keys → Secret key
- **Required:** ✅ Yes (for production)
- **Example:** `sk_live_51AbCdEf...` (redacted)

### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

- **Description:** Client-side publishable key for Stripe.js (payment forms, checkout)
- **Format:** `pk_live_...` (production) or `pk_test_...` (testing)
- **Where to get:** Stripe Dashboard → Developers → API keys → Publishable key
- **Required:** ✅ Yes (for production)
- **Example:** `pk_live_51AbCdEf...` (redacted)

### STRIPE_WEBHOOK_SECRET

- **Description:** Webhook signing secret for verifying Stripe webhook events
- **Format:** `whsec_...`
- **Where to get:** Stripe Dashboard → Developers → Webhooks → Add endpoint → Copy signing secret
- **Required:** ✅ Yes (if using webhooks)
- **Example:** `whsec_1234567890abcdef...` (redacted)

---

## 4. ImageKit (Image CDN)

### NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

- **Description:** Public URL endpoint for ImageKit CDN (used for image URLs)
- **Format:** `https://ik.imagekit.io/[your-id]/`
- **Where to get:** ImageKit Dashboard → URL Endpoint
- **Required:** ✅ Yes
- **Example:** `https://ik.imagekit.io/kollectit/`

### NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY

- **Description:** Public API key for ImageKit (client-side uploads and transformations)
- **Format:** `public_...`
- **Where to get:** ImageKit Dashboard → Developer Options → API Keys → Public Key
- **Required:** ✅ Yes
- **Example:** `public_xxxxxxxxxxxx` (redacted)

### IMAGEKIT_PRIVATE_KEY

- **Description:** Private API key for ImageKit (server-side authentication)
- **Format:** `private_...`
- **Where to get:** ImageKit Dashboard → Developer Options → API Keys → Private Key
- **Required:** ✅ Yes
- **Example:** `private_xxxxxxxxxxxx` (redacted)

---

## 5. Email (SMTP)

### EMAIL_HOST

- **Description:** SMTP server hostname
- **Format:** Hostname string
- **Required:** ✅ Yes (if using email features)
- **Examples:**
  - `smtp.zoho.com` (Zoho Mail)
  - `smtp.outlook.com` (Outlook)
  - `smtp.mail.yahoo.com` (Yahoo)
  - Or your email provider's SMTP server

### EMAIL_PORT

- **Description:** SMTP server port
- **Format:** Integer
- **Required:** ✅ Yes (if using email features)
- **Common values:**
  - `587` (TLS - recommended)
  - `465` (SSL)
  - `25` (unencrypted - not recommended)

### EMAIL_USER

- **Description:** SMTP username (your email address)
- **Format:** Email address
- **Required:** ✅ Yes (if using email features)
- **Example:** `james@kollect-it.com`

### EMAIL_PASSWORD

- **Description:** Email App Password (NOT your regular password)
- **Format:** App-specific password from your email provider
- **Where to get:**
  - Zoho Mail: Zoho Mail → Settings → Security → App Passwords
  - Outlook: Microsoft Account → Security → App Passwords
  - Other providers: Check your email provider's documentation
- **Required:** ✅ Yes (if using email features)
- **Note:** Must be an App Password, not your regular email password

### EMAIL_FROM

- **Description:** Display name and email address for outgoing emails
- **Format:** `"Display Name <email@domain.com>"`
- **Required:** ✅ Yes (if using email features)
- **Example:** `"Kollect-It <james@kollect-it.com>"`

### ADMIN_EMAIL

- **Description:** Email address for admin notifications (new orders, contact form submissions)
- **Format:** Email address
- **Required:** ⚠️ Recommended (falls back to EMAIL_USER if not set)
- **Example:** `james@kollect-it.com`

---

## 6. Desktop App Integration

### PRODUCT_INGEST_API_KEY

- **Description:** Shared secret key for authenticating product ingestion requests from desktop app
- **Format:** Secure random string
- **How to generate:** Use a secure random string generator (e.g., `openssl rand -hex 32`)
- **Required:** ✅ Yes (if using desktop app)
- **Example:** `kollect-it-product-service-2025` (or longer secure random string)
- **⚠️ CRITICAL:** This must match EXACTLY in both:
  - Vercel environment variables
  - Desktop app `.env` file (`product-application/desktop-app/.env`)

---

## 7. AI (Optional - for AI product analysis)

### ANTHROPIC_API_KEY

- **Description:** Anthropic API key for Claude AI (product analysis, pricing, descriptions)
- **Format:** `sk-ant-...`
- **Where to get:** Anthropic Console → API Keys
- **Required:** ⚠️ Optional (only if using AI features)
- **Example:** `sk-ant-xxxxxxxxxxxx` (redacted)

---

## 8. Application Configuration

### NODE_ENV

- **Description:** Node.js environment mode
- **Format:** `production` | `development` | `test`
- **Required:** ⚠️ Auto-set by Vercel (usually `production`)
- **Value:** `production` (on Vercel)

### NEXT_PUBLIC_SITE_URL

- **Description:** Public site URL (used for canonical URLs, Open Graph, etc.)
- **Format:** Full URL
- **Required:** ⚠️ Recommended
- **Value:** `https://kollect-it.com`

---

## Quick Setup Checklist

Copy this checklist to track your Vercel environment variable setup:

### Database

- [ ] `DATABASE_URL` - Supabase pooled connection (port 6543)
- [ ] `DIRECT_URL` - Supabase direct connection (port 5432)

### Authentication

- [ ] `NEXTAUTH_URL` - Set to `https://kollect-it.com`
- [ ] `NEXTAUTH_SECRET` - Generated with `openssl rand -base64 32`

### Stripe

- [ ] `STRIPE_SECRET_KEY` - From Stripe Dashboard (sk_live_...)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - From Stripe Dashboard (pk_live_...)
- [ ] `STRIPE_WEBHOOK_SECRET` - From Stripe Webhooks (whsec_...)

### ImageKit

- [ ] `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` - From ImageKit Dashboard
- [ ] `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` - From ImageKit Dashboard
- [ ] `IMAGEKIT_PRIVATE_KEY` - From ImageKit Dashboard

### Email

- [ ] `EMAIL_HOST` - Set to `smtp.zoho.com`
- [ ] `EMAIL_PORT` - Set to `587`
- [ ] `EMAIL_USER` - Your Zoho Mail email
- [ ] `EMAIL_PASSWORD` - Zoho App Password (NOT regular password)
- [ ] `EMAIL_FROM` - Display name and email
- [ ] `ADMIN_EMAIL` - Admin notification email

### Desktop App

- [ ] `PRODUCT_INGEST_API_KEY` - Secure random string (must match desktop app)

### Optional

- [ ] `ANTHROPIC_API_KEY` - If using AI features

---

## Troubleshooting

### "401 Unauthorized" from Desktop App

1. Check `PRODUCT_INGEST_API_KEY` matches exactly in Vercel and desktop app `.env`
2. Verify no trailing spaces or hidden characters (CRLF vs LF)
3. Run `vercel env pull .env.local` to sync local with Vercel

### Database Connection Errors

1. Verify `DATABASE_URL` uses port 6543 (pooled) and `DIRECT_URL` uses port 5432
2. Check if Supabase connection string uses "Opaque Tokens" - may need to regenerate
3. Ensure password/token in connection string is correct

### Email Not Sending

1. Verify `EMAIL_PASSWORD` is an App Password, not regular password
2. Check Zoho Mail 2FA is enabled (required for App Passwords)
3. Verify `EMAIL_FROM` format: `"Name <email@domain.com>"`

---

## Security Notes

- **Never commit `.env.local` or `.env` files to git**
- **Use Vercel's environment variable UI for production secrets**
- **Rotate keys regularly, especially if exposed**
- **Use different keys for development and production**
- **Keep `PRODUCT_INGEST_API_KEY` long and random (32+ characters recommended)**
