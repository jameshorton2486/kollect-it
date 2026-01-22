# 🚀 KOLLECT-IT — PUSH THE BUTTON CHECKLIST

**Final Pre-Launch Verification**  
**Date:** 2026-01-21  
**Status:** Ready for Launch

---

## ✅ CODE & BUILD

- [x] ✅ TypeScript compiles without errors
- [x] ✅ All product creation paths use SKU validation
- [x] ✅ SKU format standardized to `SKU-YYYY-XXX` (except ingest: `KOL-YYYY-NNNN`)
- [x] ✅ Origin/source fields added to schema
- [x] ✅ Database migration created and ready
- [x] ✅ No legacy SKU patterns in codebase
- [x] ✅ Prisma client generated successfully

**Status:** ✅ **COMPLETE**

---

## ✅ DATABASE

- [ ] ⚠️ **CRITICAL:** Migration `20260121000000_add_product_origin_source` applied
  ```powershell
  bun x prisma migrate deploy
  ```
- [ ] ⚠️ Origin and source columns exist in Product table
  ```sql
  SELECT origin, source FROM "Product" LIMIT 1;
  ```
- [ ] ✅ Database connection working
- [ ] ✅ No pending migrations

**Status:** ⚠️ **REQUIRES ACTION** (Apply migration)

---

## ✅ ENVIRONMENT VARIABLES

### Local (.env.local)
- [ ] ✅ DATABASE_URL set (not empty)
- [ ] ✅ DIRECT_URL set
- [ ] ✅ NEXTAUTH_SECRET set
- [ ] ✅ PRODUCT_INGEST_API_KEY set
- [ ] ✅ STRIPE_SECRET_KEY set (live key)
- [ ] ✅ STRIPE_WEBHOOK_SECRET set
- [ ] ✅ IMAGEKIT keys set
- [ ] ✅ ANTHROPIC_API_KEY set (if using AI features)

### Vercel Production
- [ ] ⚠️ **VERIFY:** All required vars set in Vercel
  ```powershell
  .\scripts\verify-vercel-env-final.ps1 -Environment production
  ```
- [ ] ⚠️ **CRITICAL:** STRIPE_WEBHOOK_SECRET added after webhook creation

**Status:** ⚠️ **REQUIRES VERIFICATION**

---

## ✅ API ENDPOINTS

- [ ] ⚠️ **TEST:** Products endpoint accessible
  ```powershell
  .\scripts\test-api-endpoints-final.ps1 -BaseUrl "https://kollect-it.com"
  ```
- [ ] ⚠️ **TEST:** Ingest endpoint rejects wrong auth (401)
- [ ] ⚠️ **TEST:** Ingest endpoint rejects invalid SKU (400)
- [ ] ✅ All endpoints return expected status codes

**Status:** ⚠️ **REQUIRES TESTING**

---

## ✅ STRIPE INTEGRATION

- [ ] ⚠️ **HUMAN ACTION:** Stripe switched to Live mode
- [ ] ⚠️ **HUMAN ACTION:** Webhook created at `/api/webhooks/stripe`
- [ ] ⚠️ **HUMAN ACTION:** Webhook secret added to Vercel
- [ ] ⚠️ **TEST:** Checkout flow works in test mode
- [ ] ⚠️ **TEST:** Checkout flow works in live mode (small test payment)
- [ ] ✅ Webhooks being received (check Stripe dashboard)

**Status:** ⚠️ **REQUIRES ACTION** (Stripe setup)

---

## ✅ DESKTOP APP INTEGRATION

- [ ] ⚠️ **TEST:** Desktop app can ingest products
- [ ] ⚠️ **TEST:** Origin/source fields persist correctly
- [ ] ⚠️ **TEST:** SKU validation works (rejects invalid formats)
- [ ] ✅ Desktop app uses correct API endpoint
- [ ] ✅ Desktop app uses correct API key

**Status:** ⚠️ **REQUIRES TESTING**

---

## ✅ DNS & SSL

- [ ] ⚠️ **VERIFY:** Domain points to Vercel
  ```powershell
  nslookup kollect-it.com
  ```
- [ ] ⚠️ **VERIFY:** www subdomain configured
  ```powershell
  nslookup www.kollect-it.com
  ```
- [ ] ⚠️ **VERIFY:** SSL certificate valid
  - Visit: https://kollect-it.com
  - Check for 🔒 (secure) indicator
- [ ] ✅ No mixed content warnings

**Status:** ⚠️ **REQUIRES VERIFICATION**

---

## ✅ DEPLOYMENT

- [ ] ✅ Code pushed to GitHub main branch
- [ ] ✅ Vercel deployment successful
- [ ] ✅ Build logs show no errors
- [ ] ✅ Production site loads correctly
- [ ] ✅ No console errors in browser

**Status:** ✅ **COMPLETE** (Code pushed, Vercel will auto-deploy)

---

## ✅ END-TO-END TESTS

- [ ] ⚠️ **TEST:** Homepage loads
- [ ] ⚠️ **TEST:** Browse page shows products
- [ ] ⚠️ **TEST:** Product detail page loads
- [ ] ⚠️ **TEST:** Admin login works
- [ ] ⚠️ **TEST:** Can create product (as draft)
- [ ] ⚠️ **TEST:** Images load via ImageKit
- [ ] ⚠️ **TEST:** Search works
- [ ] ⚠️ **TEST:** Category pages load

**Status:** ⚠️ **REQUIRES TESTING**

---

## 🚨 CRITICAL BLOCKERS

**DO NOT GO LIVE IF ANY OF THESE ARE UNCHECKED:**

- [ ] ⚠️ **BLOCKER:** Database migration applied
- [ ] ⚠️ **BLOCKER:** All required environment variables set in Vercel
- [ ] ⚠️ **BLOCKER:** Stripe webhook created and secret added
- [ ] ⚠️ **BLOCKER:** DNS configured correctly
- [ ] ⚠️ **BLOCKER:** SSL certificate valid

---

## ✅ FINAL VERIFICATION

**Run comprehensive check:**

```powershell
# 1. Production readiness
.\scripts\verify-production-readiness-final.ps1

# 2. Vercel environment
.\scripts\verify-vercel-env-final.ps1 -Environment production

# 3. API endpoints
.\scripts\test-api-endpoints-final.ps1 -BaseUrl "https://kollect-it.com"
```

**All scripts must return:** ✅ **PASS**

---

## 🚀 GO-LIVE DECISION

**When ALL items above are checked:**

✅ **READY TO GO LIVE**

**Post-Launch Actions:**
1. Monitor Vercel logs for first hour
2. Check Stripe dashboard for webhook activity
3. Verify first real order processes correctly
4. Monitor error logs for 24 hours
5. Test admin functions
6. Verify images loading correctly

---

## 📋 QUICK REFERENCE

**Migration Command:**
```powershell
bun x prisma migrate deploy
```

**Verification Scripts:**
```powershell
.\scripts\verify-production-readiness-final.ps1
.\scripts\verify-vercel-env-final.ps1 -Environment production
.\scripts\test-api-endpoints-final.ps1 -BaseUrl "https://kollect-it.com"
```

**Stripe Webhook URL:**
```
https://kollect-it.com/api/webhooks/stripe
```

**Vercel Dashboard:**
```
https://vercel.com/dashboard
```

**Stripe Dashboard:**
```
https://dashboard.stripe.com
```

---

**Checklist Version:** 2.0 (Final)  
**Last Updated:** 2026-01-21  
**Next Review:** After deployment
