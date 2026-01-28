# Vercel Environment Variables - Complete Add Guide

**Date:** 2026-01-27
**Status:** ⚠️ **22 of 23 required variables missing in production**

---

## 🔴 Critical Finding

**Production environment only has 1 of 23 required variables:**

- ✅ `NEXTAUTH_URL` (present)
- ❌ All other 22 variables are **MISSING**

This explains why you're getting 401 errors and other issues!

---

## 📋 Quick Start: Add PRODUCT_INGEST_API_KEY First

This is the most critical one for fixing your 401 error:

```bash
# Get the value from your desktop app .env
# Value: kollect-it-FLLkdujgZVJeJuClg502hThAvGxuqfi7FNaxsHt1xVZDXPgJlU34CmkY3r73C-Gx

echo "kollect-it-FLLkdujgZVJeJuClg502hThAvGxuqfi7FNaxsHt1xVZDXPgJlU34CmkY3r73C-Gx" | vercel env add PRODUCT_INGEST_API_KEY production
```

Or use the automated script:

```bash
.\scripts\add-missing-vercel-env.ps1
```

---

## 📝 Complete Variable List

### 🔴 Critical (App won't work without these)

#### 1. Database (Supabase)

```bash
# Get from: Supabase Dashboard → Settings → Database
vercel env add DATABASE_URL production
# Paste: postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true

vercel env add DIRECT_URL production
# Paste: postgresql://postgres:[password]@[host]:5432/postgres
```

#### 2. Authentication

```bash
# Generate with: openssl rand -base64 32
vercel env add NEXTAUTH_SECRET production
# Paste: [32+ character random string]

# Already present, but verify:
# NEXTAUTH_URL = https://kollect-it.com
```

#### 3. Stripe

```bash
# Get from: Stripe Dashboard → Developers → API keys
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# Paste: pk_live_...

vercel env add STRIPE_SECRET_KEY production
# Paste: sk_live_...

# Get from: Stripe Dashboard → Developers → Webhooks → Signing Secret
vercel env add STRIPE_WEBHOOK_SECRET production
# Paste: whsec_... (NOT the malformed one you have now!)
```

#### 4. ImageKit

```bash
# Get from: ImageKit Dashboard → Developer Options → API Keys
vercel env add NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT production
# Paste: https://ik.imagekit.io/kollectit

vercel env add NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY production
# Paste: public_...

vercel env add IMAGEKIT_PRIVATE_KEY production
# Paste: private_...
```

#### 5. Desktop App Integration

```bash
vercel env add PRODUCT_INGEST_API_KEY production
# Paste: kollect-it-FLLkdujgZVJeJuClg502hThAvGxuqfi7FNaxsHt1xVZDXPgJlU34CmkY3r73C-Gx
```

---

### 🟡 Recommended (Highly Recommended)

#### 6. Google OAuth

```bash
# Get from: Google Cloud Console → APIs & Services → Credentials
vercel env add GOOGLE_CLIENT_ID production
# Paste: [client-id].apps.googleusercontent.com

vercel env add GOOGLE_CLIENT_SECRET production
# Paste: [client-secret]
```

#### 7. Email (Zoho Mail)

```bash
vercel env add EMAIL_HOST production
# Value: smtp.zoho.com

vercel env add EMAIL_PORT production
# Value: 587

vercel env add EMAIL_USER production
# Value: info@kollect-it.com (your Zoho email)

vercel env add EMAIL_PASSWORD production
# Value: [Zoho App Password - NOT regular password]

vercel env add EMAIL_FROM production
# Value: "Kollect-It <info@kollect-it.com>"

vercel env add ADMIN_EMAIL production
# Value: admin@kollect-it.com
```

---

### 🟢 Optional (Nice to Have)

#### 8. Supabase (if using beyond Postgres)

```bash
# Get from: Supabase Dashboard → Settings → API
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste: https://[project-id].supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste: eyJ... (Legacy) or sb_... (New Opaque Token)

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Paste: eyJ... (Legacy) or sb_... (New Opaque Token)
```

**⚠️ Check Supabase Key Format:**

- **`eyJ`** = Legacy JWT format (old)
- **`sb_`** = New Opaque Token format (migrated)

If you see `sb_` format, Supabase has migrated to Opaque Tokens.

#### 9. AI (Optional)

```bash
# Get from: Anthropic Console → API Keys
vercel env add ANTHROPIC_API_KEY production
# Paste: sk-ant-...
```

---

## 🚀 Batch Add Script

I've created a script that helps add variables. Run:

```bash
.\scripts\add-missing-vercel-env.ps1
```

This will:

1. Automatically add `PRODUCT_INGEST_API_KEY` from your desktop app
2. Guide you through adding other variables

---

## ✅ Verification

After adding variables, verify:

```bash
# Pull updated values
vercel env pull .env.local --environment=production

# Run audit again
.\scripts\audit-vercel-env.ps1

# Sync desktop app
.\scripts\sync-desktop-env.ps1
```

---

## 📊 Current Status

- **Production:** 1/23 variables (4%)
- **Development:** 1/23 variables
- **Preview:** 9/23 variables

**Action Required:** Add 22 missing variables to production.

---

## 🔍 Where to Get Values

| Variable | Where to Get |
|----------|-------------|
| `DATABASE_URL`, `DIRECT_URL` | Supabase Dashboard → Settings → Database |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `STRIPE_*` | Stripe Dashboard → Developers → API keys / Webhooks |
| `IMAGEKIT_*` | ImageKit Dashboard → Developer Options → API Keys |
| `GOOGLE_*` | Google Cloud Console → APIs & Services → Credentials |
| `EMAIL_*` | Zoho Mail → Settings → Security → App Passwords |
| `SUPABASE_*` | Supabase Dashboard → Settings → API |
| `ANTHROPIC_API_KEY` | Anthropic Console → API Keys |
| `PRODUCT_INGEST_API_KEY` | Your desktop app `.env` file |

---

## ⚠️ Important Notes

1. **STRIPE_WEBHOOK_SECRET**: The current value in Vercel is malformed. Get the correct value from Stripe Dashboard.

2. **Supabase Opaque Tokens**: If your keys start with `sb_`, Supabase has migrated. Make sure your connection strings are updated too.

3. **Email Password**: Must be a Zoho App Password, NOT your regular Zoho Mail password. Requires 2FA to be enabled.

4. **No Trailing Spaces**: When pasting values, make sure there are no trailing spaces or hidden characters.

---

## 🎯 Priority Order

1. **PRODUCT_INGEST_API_KEY** (fixes 401 error) ⚡
2. **DATABASE_URL**, **DIRECT_URL** (app won't work without database)
3. **NEXTAUTH_SECRET** (authentication required)
4. **STRIPE_*** (if using payments)
5. **IMAGEKIT_*** (if using image uploads)
6. **EMAIL_*** (if using email features)
7. **GOOGLE_*** (if using OAuth)
8. **SUPABASE_*** (if using Supabase features beyond Postgres)
9. **ANTHROPIC_API_KEY** (if using AI features)

---

## 📞 Need Help?

- See `docs/VERCEL-ENV-VARS-COMPLETE.md` for detailed descriptions
- Run `.\scripts\audit-vercel-env.ps1` to check current status
- Check `docs/ENV-SYNC-STATUS.md` for sync status
