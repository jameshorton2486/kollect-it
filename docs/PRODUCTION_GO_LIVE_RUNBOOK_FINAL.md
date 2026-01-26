# KOLLECT-IT — PRODUCTION GO-LIVE RUNBOOK

**Version:** 2.0 (Final)  
**Date:** 2026-01-21  
**Status:** Execution Ready  
**Purpose:** Step-by-step guide for production launch

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
```

**Expected Output:**
- ✅ All commands complete without errors
- ✅ No TypeScript errors

**If Failed:**
- Fix TypeScript errors
- Resolve missing dependencies
- **DO NOT PROCEED** until all pass

---

### Step 2: Run Production Readiness Verification

```powershell
# Run comprehensive verification script
.\scripts\verify-production-readiness-final.ps1
```

**Expected Output:**
- ✅ VERIFICATION PASSED
- All checks green

**If Failed:**
- Review error messages
- Fix issues
- **DO NOT PROCEED** until verification passes

---

## 🔹 ENVIRONMENT VARIABLE VERIFICATION

### Step 3: Verify Local Environment

```powershell
# Check .env.local has real values (not placeholders)
Get-Content .env.local | Select-String "DATABASE_URL|STRIPE_SECRET_KEY|PRODUCT_INGEST_API_KEY"
```

**Required Variables:**
- `DATABASE_URL` (Supabase PostgreSQL connection string)
- `DIRECT_URL` (Supabase direct connection)
- `NEXTAUTH_SECRET` (Random secure string)
- `PRODUCT_INGEST_API_KEY` (Secure API key for desktop app)

**Recommended Variables:**
- `STRIPE_SECRET_KEY` (Live key for production)
- `STRIPE_WEBHOOK_SECRET` (From Stripe webhook)
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `ANTHROPIC_API_KEY`
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`

---

### Step 4: Verify Vercel Environment Variables

```powershell
# Check Vercel environment variables
.\scripts\verify-vercel-env-final.ps1 -Environment production
```

**Expected Output:**
- ✅ All required environment variables are set

**If Failed:**
- Add missing variables:
  ```powershell
  vercel env add VARIABLE_NAME production
  ```
- **DO NOT PROCEED** until all required vars are set

---

## 🔹 DATABASE MIGRATIONS

### Step 5: Check Migration Status

```powershell
# Check migration status
bun x prisma migrate status
```

**Expected Output:**
- ✅ "Database schema is up to date"
- ✅ No pending migrations

**If Pending Migrations:**
- Apply migrations:
  ```powershell
  bun x prisma migrate deploy
  ```

**CRITICAL:** The migration `20260121000000_add_product_origin_source` must be applied before origin/source fields work.

---

### Step 6: Verify Schema

```sql
-- Run in Supabase SQL Editor or psql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Product'
AND column_name IN ('origin', 'source')
ORDER BY column_name;
```

**Expected:**
- `origin` column exists (TEXT, nullable)
- `source` column exists (TEXT, nullable)

**If Missing:**
- Run migration: `bun x prisma migrate deploy`
- **DO NOT PROCEED** until columns exist

---

## 🔹 API HEALTH CHECKS

### Step 7: Test API Endpoints

```powershell
# Run API endpoint tests
.\scripts\test-api-endpoints-final.ps1 -BaseUrl "https://kollect-it.com"
```

**Expected Output:**
- ✅ Products endpoint accessible (200)
- ✅ Ingest endpoint rejects wrong auth (401)
- ✅ Ingest endpoint rejects invalid SKU (400)
- ✅ ALL TESTS PASSED

**If Failed:**
- Review error messages
- Check API routes are deployed
- Verify environment variables
- **DO NOT PROCEED** until tests pass

---

## 🔹 STRIPE CONFIGURATION (HUMAN ACTION REQUIRED)

### Step 8: Switch Stripe to Live Mode

**⚠️ HUMAN ACTION REQUIRED**

1. Go to: https://dashboard.stripe.com
2. Click "Activate test mode" toggle → Switch to **Live mode**
3. Verify you see "Live mode" indicator

**Verification:**
- Stripe dashboard shows "Live mode"
- API keys show "pk_live_..." and "sk_live_..."

---

### Step 9: Create Stripe Webhook

**⚠️ HUMAN ACTION REQUIRED**

1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL:** `https://kollect-it.com/api/webhooks/stripe`
4. **Events to send:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. **Copy the webhook signing secret** (starts with `whsec_...`)

---

### Step 10: Add Webhook Secret to Vercel

**⚠️ HUMAN ACTION REQUIRED**

```powershell
# Add webhook secret to Vercel
vercel env add STRIPE_WEBHOOK_SECRET production
# Paste the webhook secret when prompted
```

**Verification:**
```powershell
# Verify it was added
vercel env ls production | Select-String "STRIPE_WEBHOOK_SECRET"
```

---

### Step 11: Redeploy After Webhook Setup

```powershell
# Trigger redeployment (or wait for next git push)
git commit --allow-empty -m "chore: trigger redeploy after webhook setup"
git push origin main
```

**Wait for Vercel deployment to complete** (2-3 minutes)

---

## 🔹 DESKTOP INGEST TEST

### Step 12: Test Product Ingestion

**Using Desktop App or curl:**

```powershell
# Set API key
$apiKey = $env:PRODUCT_INGEST_API_KEY

# Test ingest with origin/source
$body = @{
    sku = "KOL-2026-0001"
    title = "Test Product - Go-Live Verification"
    description = "Test product for production verification"
    price = 100.00
    category = "fine-art"
    origin = "United States"
    source = "desktop-app"
    images = @(
        @{
            url = "https://example.com/test.jpg"
            alt = "Test image"
            order = 0
        }
    )
} | ConvertTo-Json

# Send request
$response = Invoke-RestMethod `
    -Uri "https://kollect-it.com/api/admin/products/ingest" `
    -Method POST `
    -Headers @{ "x-api-key" = $apiKey } `
    -ContentType "application/json" `
    -Body $body

Write-Host "Product created: $($response.product.id)"
```

**Expected:**
- ✅ Product created as draft
- ✅ SKU validated
- ✅ Origin/source persisted
- ✅ Images linked

**Verification:**
```sql
-- Check product was created
SELECT id, sku, title, origin, source, "isDraft"
FROM "Product"
WHERE sku = 'KOL-2026-0001';
```

**Expected:**
- Product exists
- `origin = 'United States'`
- `source = 'desktop-app'`
- `isDraft = true`

---

## 🔹 CHECKOUT TEST (STRIPE TEST MODE FIRST)

### Step 13: Test Checkout Flow

**⚠️ IMPORTANT:** Test in Stripe test mode first, then switch to live.

1. **Add product to cart** (via website)
2. **Proceed to checkout**
3. **Use Stripe test card:** `4242 4242 4242 4242`
4. **Complete checkout**

**Expected:**
- ✅ Payment Intent created
- ✅ Checkout completes
- ✅ Order created in database
- ✅ Webhook received (check Stripe dashboard)

**Verification:**
```sql
-- Check order was created
SELECT id, "paymentIntentId", total, status
FROM "Order"
ORDER BY "createdAt" DESC
LIMIT 1;
```

---

### Step 14: Switch to Live Mode and Test Again

**⚠️ HUMAN ACTION REQUIRED**

1. **Switch Stripe to Live mode** (Step 8)
2. **Update Vercel env vars** with live keys
3. **Redeploy**
4. **Test checkout with real card** (small amount)

**Expected:**
- ✅ Live payment processes
- ✅ Order created
- ✅ Webhook received

---

## 🔹 DNS + SSL CONFIRMATION (HUMAN VERIFICATION)

### Step 15: Verify DNS Configuration

**⚠️ HUMAN VERIFICATION REQUIRED**

1. **Check A record:**
   ```powershell
   nslookup kollect-it.com
   ```
   **Expected:** Points to Vercel IP (76.76.21.21 or similar)

2. **Check CNAME:**
   ```powershell
   nslookup www.kollect-it.com
   ```
   **Expected:** Points to `cname.vercel-dns.com`

3. **Verify SSL:**
   - Visit: https://kollect-it.com
   - Check browser shows 🔒 (secure)
   - No mixed content warnings

**If Issues:**
- Check DNS propagation (may take 24-48 hours)
- Verify Vercel domain configuration
- Check SSL certificate status in Vercel

---

## 🔹 GO-LIVE DECLARATION CHECKLIST

### Step 16: Final Pre-Launch Verification

**Run all verification scripts:**

```powershell
# 1. Production readiness
.\scripts\verify-production-readiness-final.ps1

# 2. Vercel environment
.\scripts\verify-vercel-env-final.ps1 -Environment production

# 3. API endpoints
.\scripts\test-api-endpoints-final.ps1 -BaseUrl "https://kollect-it.com"
```

**All must pass:** ✅

---

### Step 17: Final Checklist

- [ ] ✅ All pre-flight checks passed
- [ ] ✅ Environment variables verified (local + Vercel)
- [ ] ✅ Database migrations applied
- [ ] ✅ Origin/source fields exist in database
- [ ] ✅ API health checks passed
- [ ] ✅ Stripe live mode activated
- [ ] ✅ Stripe webhook created and secret added to Vercel
- [ ] ✅ Desktop ingest test successful
- [ ] ✅ Checkout test successful (test mode)
- [ ] ✅ Checkout test successful (live mode)
- [ ] ✅ DNS configured correctly
- [ ] ✅ SSL certificate valid
- [ ] ✅ No console errors on production site
- [ ] ✅ Admin login works
- [ ] ✅ Product pages load correctly
- [ ] ✅ Images load via ImageKit

**If all checked:** ✅ **READY TO GO LIVE**

---

## 🔹 EMERGENCY ROLLBACK PROCEDURES

### If Deployment Fails

**Vercel Rollback:**
1. Go to: https://vercel.com/dashboard
2. Select project → **Deployments**
3. Find previous successful deployment
4. Click **"..."** → **"Promote to Production"**

**Database Rollback:**
```powershell
# Rollback last migration (if needed)
bun x prisma migrate resolve --rolled-back 20260121000000_add_product_origin_source
```

**Stripe Rollback:**
1. Go to Stripe Dashboard
2. Switch back to **Test mode**
3. Disable live webhook endpoint

**Supabase Rollback:**
1. Go to Supabase Dashboard
2. **Database** → **Backups**
3. Restore from backup if data corruption occurred

---

## 🚀 GO-LIVE DECLARATION

**When all steps are complete and verified:**

✅ **KOLLECT-IT IS NOW LIVE**

**Post-Launch Monitoring:**
- Monitor Vercel logs for errors
- Check Stripe dashboard for payments
- Verify webhooks are being received
- Monitor database for issues
- Check user feedback

**First 24 Hours:**
- Monitor error logs
- Verify webhooks processing
- Test actual payment (small amount)
- Check database for orphaned records
- Verify all images displaying correctly

---

**Runbook Version:** 2.0  
**Last Updated:** 2026-01-21  
**Status:** ✅ Production Ready
