# 🚀 PUSH THE BUTTON — Final Go-Live Checklist

**Date:** 2026-01-21  
**Status:** Pre-Launch Final Verification

---

## ⚠️ CRITICAL: Fix Before Launch

### ❌ SKU Validation Missing (3 Endpoints)

**Must Fix:**
1. `src/app/api/products/route.ts` - Add SKU validation
2. `src/app/api/admin/products/approve/route.ts` - Add SKU validation  
3. `src/app/api/admin/products/bulk-approve/route.ts` - Add SKU validation

**Impact:** These endpoints can create products with invalid/colliding SKUs

**Recommendation:** Add `validateSKU()` or use `formatSKU()` before product creation

---

## ✅ Pre-Launch Verification

### Code & Build
- [ ] TypeScript compiles: `bun x tsc --noEmit`
- [ ] Production build succeeds: `bun run build`
- [ ] Prisma client generated: `bun x prisma generate`
- [ ] No critical errors in build logs

### Database
- [ ] Migrations applied: `bun x prisma migrate deploy`
- [ ] Product table verified (no origin/source fields - correct)
- [ ] Test query succeeds: `SELECT * FROM "Product" LIMIT 1;`

### Environment Variables
- [ ] All required vars in `.env.local` (local dev)
- [ ] All required vars in Vercel (production)
- [ ] Stripe keys are **LIVE** (not test)
- [ ] `PRODUCT_INGEST_API_KEY` matches desktop app

### API Endpoints
- [ ] Ingest endpoint rejects wrong auth (401)
- [ ] Ingest endpoint validates SKU format (400 on invalid)
- [ ] Products endpoint accessible (200)
- [ ] Checkout endpoint functional

### Stripe (HUMAN ACTION)
- [ ] Switched to **Live mode** in Stripe dashboard
- [ ] Webhook endpoint created: `https://kollect-it.com/api/webhooks/stripe`
- [ ] Webhook secret added to Vercel: `STRIPE_WEBHOOK_SECRET`
- [ ] Test payment succeeds with live key

### DNS & SSL
- [ ] Domain resolves: `kollect-it.com` → Vercel
- [ ] WWW subdomain resolves: `www.kollect-it.com` → Vercel
- [ ] SSL certificate valid (88 days remaining)
- [ ] HTTPS enforced (no mixed content)

### End-to-End Tests
- [ ] Desktop app can ingest product
- [ ] Product appears in admin dashboard
- [ ] Product visible on public site
- [ ] Checkout flow completes successfully
- [ ] Order created in database
- [ ] Webhook received in Stripe

---

## 🎯 GO-LIVE DECISION

### If ALL boxes checked above:

**YOU ARE READY TO GO LIVE** 🚀

```powershell
# Final deployment
vercel --prod

# Monitor first deployment
vercel inspect --logs
```

### If ANY box unchecked:

**DO NOT GO LIVE** - Fix issues first

---

## 📊 Post-Launch Monitoring (First 24 Hours)

- [ ] Monitor Vercel logs for errors
- [ ] Monitor Stripe dashboard for transactions
- [ ] Monitor Supabase for database health
- [ ] Test checkout with real payment (small amount)
- [ ] Verify webhook events received
- [ ] Check admin dashboard for new orders

---

## 🆘 Emergency Contacts

- **Vercel:** https://vercel.com/support
- **Stripe:** https://support.stripe.com
- **Supabase:** https://supabase.com/support

---

**Last Updated:** 2026-01-21  
**Ready Status:** ⚠️ **PENDING** (3 SKU validation fixes required)
