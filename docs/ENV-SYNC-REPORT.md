# Environment Variable Sync Report

**Date:** 2026-01-27
**Status:** ✅ PRODUCT_INGEST_API_KEY synced successfully

---

## ✅ Completed

### 1. PRODUCT_INGEST_API_KEY Sync

- **Status:** ✅ **MATCHES EXACTLY**
- Desktop app: `kollect-it-FLLkdujgZVJeJuClg502hThAvGxuqfi7FNaxsHt1xVZDXPgJlU34CmkY3r73C-Gx` (75 chars)
- Vercel (.env.local): Same value
- **Action taken:** Cleaned desktop app .env (removed trailing whitespace, normalized line endings to LF)

---

## ⚠️ Issues Found in Vercel Environment

### 1. STRIPE_WEBHOOK_SECRET (CRITICAL - Malformed)

**Current value:**

```
STRIPE_WEBHOOK_SECRET="whsec_YOUR_https://kollect-it-marketplace-1-ospdeg5s5.vercel.app/api/webhooks/stripe"
```

**Problem:** This is not a valid webhook secret. It appears to be a placeholder mixed with a URL.

**Fix required:**

1. Go to Stripe Dashboard → Developers → Webhooks
2. Find your webhook endpoint: `https://kollect-it-marketplace-1-ospdeg5s5.vercel.app/api/webhooks/stripe`
3. Click "Reveal" next to "Signing secret"
4. Copy the value (should start with `whsec_` and be ~40+ characters)
5. Update in Vercel:

   ```bash
   vercel env rm STRIPE_WEBHOOK_SECRET production
   vercel env add STRIPE_WEBHOOK_SECRET production
   # Paste the correct whsec_... value when prompted
   ```

---

### 2. NEXTAUTH_URL (Should be Production Domain)

**Current value:**

```
NEXTAUTH_URL="https://kollect-it-marketplace-1.vercel.app"
```

**Should be:**

```
NEXTAUTH_URL="https://kollect-it.com"
```

**Fix:**

```bash
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production
# Enter: https://kollect-it.com
```

**Note:** This affects OAuth callbacks and email links. Update for production.

---

### 3. Supabase Database URLs (Check for Opaque Token Migration)

**Current DATABASE_URL:**

```
postgres://postgres:jaeV7FzHvR5FDx8S@db.xqrroyyqrgdytzpcckwk.supabase.co:6543/postgres?pgbouncer=true&sslmode=require
```

**Current DIRECT_URL:**

```
postgres://postgres:jaeV7FzHvR5FDx8S@db.xqrroyyqrgdytzpcckwk.supabase.co:5432/postgres?sslmode=require
```

**Analysis:**

- Password/token length: **16 characters** (short)
- Supabase has migrated to "Opaque Tokens" which are typically 40+ characters
- If you're experiencing database connection errors, this may be the cause

**Action required if connection fails:**

1. Go to Supabase Dashboard → Settings → Database
2. Click "Reset Database Password" or "Generate New Connection String"
3. Copy the new connection strings (they'll have longer opaque tokens)
4. Update both DATABASE_URL and DIRECT_URL in Vercel:

   ```bash
   vercel env rm DATABASE_URL production
   vercel env add DATABASE_URL production
   # Paste new pooled connection string (port 6543)

   vercel env rm DIRECT_URL production
   vercel env add DIRECT_URL production
   # Paste new direct connection string (port 5432)
   ```

---

## ✅ Variables Present (No Action Needed)

These variables are correctly set in Vercel:

- ✅ `NEXTAUTH_SECRET` - Present
- ✅ `STRIPE_SECRET_KEY` - Present (sk_live_...)
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Present (pk_live_...)
- ✅ `PRODUCT_INGEST_API_KEY` - Present and matches desktop app
- ✅ `IMAGEKIT_PRIVATE_KEY` - Present
- ✅ `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` - Present
- ✅ `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` - Present
- ✅ `ANTHROPIC_API_KEY` - Present
- ✅ `DATABASE_URL` - Present (but check token length)
- ✅ `DIRECT_URL` - Present (but check token length)

---

## 📋 Quick Fix Commands

Run these in your terminal (after linking to Vercel with `vercel link`):

```bash
# 1. Fix STRIPE_WEBHOOK_SECRET (get correct value from Stripe Dashboard first)
vercel env rm STRIPE_WEBHOOK_SECRET production
vercel env add STRIPE_WEBHOOK_SECRET production

# 2. Fix NEXTAUTH_URL
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production
# Enter: https://kollect-it.com

# 3. If database connection fails, update Supabase URLs:
vercel env rm DATABASE_URL production
vercel env add DATABASE_URL production
# Paste new connection string from Supabase Dashboard

vercel env rm DIRECT_URL production
vercel env add DIRECT_URL production
# Paste new direct connection string from Supabase Dashboard
```

---

## 🔄 After Making Changes

1. **Pull updated values:**

   ```bash
   vercel env pull .env.local
   ```

2. **Verify desktop app still matches:**
   - Check `PRODUCT_INGEST_API_KEY` in desktop app `.env` matches `.env.local`

3. **Test desktop app connection:**
   - Try publishing a product from the desktop app
   - Should no longer get 401 Unauthorized

---

## 📝 Notes

- Desktop app `.env` has been cleaned (LF line endings, no trailing whitespace)
- All values in `.env.local` are quoted (Vercel format) - this is normal
- Desktop app `.env` uses unquoted values - this is correct for Python `os.getenv()`
- The 401 error should be resolved since `PRODUCT_INGEST_API_KEY` matches exactly
