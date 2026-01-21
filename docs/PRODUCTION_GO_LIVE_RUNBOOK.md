# KOLLECT-IT — PRODUCTION GO-LIVE RUNBOOK

**Version:** 1.0  
**Date:** 2026-01-21  
**Status:** Execution Ready

---

## 🔹 PRE-FLIGHT CHECKS

### Step 1: Local Environment Setup

```powershell
# Navigate to project
cd C:\Users\james\kollect-it

# Install dependencies
bun install

# Generate Prisma client
bun x prisma generate

# TypeScript check
bun x tsc --noEmit

# Production build
bun run build
```

**Expected Output:**
- ✅ All commands complete without errors
- ✅ Build output in `.next/` directory

**If Failed:**
- Fix TypeScript errors
- Resolve missing dependencies
- **DO NOT PROCEED** until all pass

---

## 🔹 ENVIRONMENT VARIABLE VERIFICATION

### Step 2: Local Environment

```powershell
# Verify .env.local exists and has real values
Get-Content .env.local | Select-String "DATABASE_URL|STRIPE_SECRET_KEY|PRODUCT_INGEST_API_KEY"
```

**Required Variables:**
- `DATABASE_URL` (Supabase pooled connection)
- `DIRECT_URL` (Supabase direct connection)
- `NEXTAUTH_SECRET` (32+ characters)
- `NEXTAUTH_URL` (https://kollect-it.com)
- `STRIPE_SECRET_KEY` (sk_live_...)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_...)
- `STRIPE_WEBHOOK_SECRET` (whsec_...)
- `IMAGEKIT_PRIVATE_KEY` (private_...)
- `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` (public_...)
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` (https://ik.imagekit.io/...)
- `PRODUCT_INGEST_API_KEY` (16+ characters)

**If Missing:**
- Add missing variables to `.env.local`
- **DO NOT PROCEED** until all present

### Step 3: Vercel Environment (HUMAN ACTION REQUIRED)

```powershell
# Pull Vercel env vars to verify
vercel env pull .env.vercel

# Compare with .env.local
Compare-Object (Get-Content .env.local) (Get-Content .env.vercel) | Select-Object InputObject
```

**Or verify in Vercel Dashboard:**
- Go to: https://vercel.com/james-hortons-projects-6d806c91/kollect-it-marketplace-1/settings/environment-variables
- Verify all variables listed above are present
- Ensure `STRIPE_SECRET_KEY` is **live key** (not test)

**If Missing:**
- Add via Vercel Dashboard or CLI:
  ```powershell
  vercel env add VARIABLE_NAME production
  ```

---

## 🔹 DATABASE MIGRATIONS

### Step 4: Migration Status

```powershell
# Check migration status
bun x prisma migrate status

# Apply any pending migrations
bun x prisma migrate deploy
```

**Expected Output:**
- ✅ "Database schema is up to date"
- ✅ No pending migrations

**If Failed:**
- Review migration errors
- **DO NOT PROCEED** until migrations applied

### Step 5: Verify Schema

```powershell
# Connect to database and verify Product table
# (Use Supabase SQL Editor or psql)
```

**SQL Query:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Product'
ORDER BY ordinal_position;
```

**Expected:**
- `sku` column exists (String, NOT NULL, UNIQUE)
- `skuYear` column exists (Int, nullable)
- `skuNumber` column exists (Int, nullable)
- **NO** `origin` or `source` columns (correct)

---

## 🔹 API HEALTH CHECKS

### Step 6: Automated API Tests

```powershell
# Run API endpoint tests
.\scripts\test-api-endpoints.ps1 -BaseUrl "https://kollect-it.com"
```

**Expected Output:**
- ✅ Ingest endpoint rejects wrong auth (401)
- ✅ Ingest endpoint rejects invalid SKU (400)
- ✅ Products endpoint accessible (200)

**If Failed:**
- Review error messages
- Check API routes are deployed
- Verify environment variables in Vercel

---

## 🔹 STRIPE CONFIGURATION (HUMAN ACTION REQUIRED)

### Step 7: Switch to Live Mode

**Action Required:**
1. Go to: https://dashboard.stripe.com/test/developers
2. Toggle "Test mode" OFF
3. Confirm you're in **Live mode**

**Verification:**
- Dashboard header shows "Live mode"
- API keys show `sk_live_...` and `pk_live_...`

### Step 8: Create Webhook Endpoint

**Action Required:**
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Configure:
   - **Endpoint URL:** `https://kollect-it.com/api/webhooks/stripe`
   - **Events to send:**
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
4. Click "Add endpoint"
5. **Copy the webhook signing secret** (starts with `whsec_...`)

### Step 9: Add Webhook Secret to Vercel

```powershell
# Add webhook secret to Vercel
echo "whsec_YOUR_SECRET_HERE" | vercel env add STRIPE_WEBHOOK_SECRET production
```

**Or via Dashboard:**
- Go to Vercel → Environment Variables
- Add `STRIPE_WEBHOOK_SECRET` = `whsec_...` (from Step 8)
- Set for **Production** environment

### Step 10: Redeploy After Stripe Changes

```powershell
# Trigger redeployment
vercel --prod
```

**Expected Output:**
- ✅ Deployment succeeds
- ✅ Build completes
- ✅ No environment variable errors

---

## 🔹 DESKTOP INGEST TEST

### Step 11: End-to-End Ingest Test

**Prerequisites:**
- Desktop app configured with `PRODUCT_INGEST_API_KEY`
- Test images ready

**Steps:**
1. Launch desktop app
2. Load test product images
3. Run AI analysis
4. Set SKU: `KOL-2026-0001` (or next available)
5. Fill required fields
6. Click "Publish" or "Save as Draft"

**Expected Result:**
- ✅ Product created in database
- ✅ Status: `isDraft: true`
- ✅ SKU validated and saved
- ✅ Images uploaded to ImageKit
- ✅ Product visible in admin dashboard

**Verification:**
```powershell
# Check product in database (via Supabase or script)
bun run scripts/check-users.ts
# Then verify product exists
```

**If Failed:**
- Check API logs in Vercel
- Verify `PRODUCT_INGEST_API_KEY` matches
- Review SKU format (must be `KOL-YYYY-NNNN`)

---

## 🔹 CHECKOUT TEST

### Step 12: Test Checkout Flow

**Prerequisites:**
- At least one published product in database
- Stripe live keys configured
- Webhook endpoint active

**Steps:**
1. Navigate to: https://kollect-it.com
2. Add product to cart
3. Proceed to checkout
4. Enter test shipping info
5. Use Stripe test card: `4242 4242 4242 4242`
6. Complete payment

**Expected Result:**
- ✅ Payment Intent created
- ✅ Payment succeeds
- ✅ Order created in database
- ✅ Order visible in admin dashboard
- ✅ Webhook received (check Stripe dashboard)

**Verification:**
```sql
-- Check order in database
SELECT * FROM "Order" ORDER BY "createdAt" DESC LIMIT 1;
```

**If Failed:**
- Check Stripe dashboard for payment status
- Review webhook logs in Vercel
- Verify `STRIPE_WEBHOOK_SECRET` matches

---

## 🔹 DNS & SSL (HUMAN ACTION REQUIRED)

### Step 13: DNS Verification

**Action Required:**
- DNS already configured (per user confirmation)
- A record: `76.76.21.21` (Vercel)
- CNAME: `www` → `cname.vercel-dns.com`

**Verification:**
```powershell
# Test DNS resolution
nslookup kollect-it.com
nslookup www.kollect-it.com
```

**Expected:**
- Both resolve to Vercel IPs
- SSL certificate valid (88 days remaining per user)

### Step 14: HTTPS Enforcement

**Verification:**
1. Visit: https://kollect-it.com
2. Check browser shows 🔒 (secure)
3. Check: https://www.kollect-it.com
4. Verify no mixed content warnings

**If Issues:**
- Check Vercel domain settings
- Verify SSL certificate in Vercel dashboard
- Wait for DNS propagation (up to 48 hours)

---

## 🔹 GO-LIVE DECLARATION CHECKLIST

### Final Verification

- [ ] All pre-flight checks passed
- [ ] Environment variables set in Vercel
- [ ] Migrations applied
- [ ] API endpoints tested
- [ ] Stripe live mode active
- [ ] Webhook configured and tested
- [ ] Desktop ingest tested end-to-end
- [ ] Checkout flow tested
- [ ] DNS configured and verified
- [ ] SSL certificate valid
- [ ] Production build successful
- [ ] No critical errors in logs

### Go-Live Command

```powershell
# Final deployment
vercel --prod

# Verify deployment
vercel inspect --logs
```

**Once all boxes checked:**
- ✅ **GO LIVE** - Site is production-ready
- Monitor Vercel logs for first 24 hours
- Monitor Stripe dashboard for transactions
- Monitor Supabase for database health

---

## 🔹 EMERGENCY ROLLBACK

### If Critical Issues Found

**Step 1: Rollback Deployment**
```powershell
# List recent deployments
vercel ls

# Promote previous deployment
vercel promote [DEPLOYMENT_URL]
```

**Step 2: Disable Stripe (if payment issues)**
- Go to Stripe Dashboard
- Toggle "Live mode" OFF
- Or disable webhook endpoint

**Step 3: Database Rollback (if needed)**
- Go to Supabase Dashboard
- Restore from backup (if available)
- Or manually fix data issues

**Step 4: Communication**
- Update status page (if exists)
- Notify users if service interruption
- Document issue for post-mortem

---

## 📋 QUICK REFERENCE

### Critical URLs

- **Production Site:** https://kollect-it.com
- **Vercel Dashboard:** https://vercel.com/james-hortons-projects-6d806c91/kollect-it-marketplace-1
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Supabase Dashboard:** https://supabase.com/dashboard
- **ImageKit Dashboard:** https://imagekit.io/dashboard

### Support Contacts

- **Vercel Support:** support@vercel.com
- **Stripe Support:** https://support.stripe.com
- **Supabase Support:** https://supabase.com/support

---

**Last Updated:** 2026-01-21  
**Next Review:** After first production transaction
