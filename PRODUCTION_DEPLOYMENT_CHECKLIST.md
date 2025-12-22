# 🚀 Production Deployment Checklist

**Last Updated:** December 2024  
**Status:** Pre-Launch Verification

---

## ✅ Phase 1: Environment Verification

### Required Environment Variables

- [ ] `DATABASE_URL` - Production PostgreSQL connection string
- [ ] `DIRECT_URL` - Direct database connection (if using connection pooling)
- [ ] `NEXTAUTH_SECRET` - Secure random string (min 32 chars) - Generate: `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` - Production URL (e.g., `https://kollect-it.com`)
- [ ] `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` - ImageKit public key
- [ ] `IMAGEKIT_PRIVATE_KEY` - ImageKit private key
- [ ] `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` - ImageKit URL endpoint
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe LIVE publishable key (`pk_live_...`)
- [ ] `STRIPE_SECRET_KEY` - Stripe LIVE secret key (`sk_live_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret (`whsec_...`)
- [ ] `ADMIN_EMAIL` - Admin account email
- [ ] `ADMIN_PASSWORD` - Secure admin password (use script to create)

### Optional Environment Variables

- [ ] `ANTHROPIC_API_KEY` - For AI product analysis (optional)
- [ ] `OPENAI_API_KEY` - For image quality analysis (optional)
- [ ] `GOOGLE_CLIENT_ID` - For OAuth (optional)
- [ ] `GOOGLE_CLIENT_SECRET` - For OAuth (optional)

**Verification Command:**
```bash
bun run scripts/check-env.ts
```

---

## ✅ Phase 2: Build Verification

### Pre-Deploy Build Test

```bash
# Clean install
rm -rf node_modules .next
bun install

# Generate Prisma client
bun run db:generate

# Build application
bun run build
```

**Must pass with:**
- ✅ No TypeScript errors
- ✅ No Prisma warnings
- ✅ No build-time errors
- ✅ All pages compile successfully

**If build fails:**
1. Check TypeScript errors: `bun run typecheck`
2. Check Prisma schema: `bun run db:generate`
3. Review error messages and fix before deploying

---

## ✅ Phase 3: Security Checklist

### Admin Routes

- [ ] All `/api/admin/*` routes require authentication
- [ ] Test: Try accessing admin routes without login → Should return 401/403
- [ ] Admin authentication uses secure session cookies
- [ ] No test/default admin credentials in production

**Verification:**
```bash
# Test admin route protection
bun run scripts/verify-admin-security.ts
```

### API Security

- [ ] Stripe webhook signature verification enabled
- [ ] `STRIPE_WEBHOOK_SECRET` is set in production
- [ ] No hardcoded API keys in source code
- [ ] `.env.local` is in `.gitignore` (verify it's not committed)

### OAuth & Authentication

- [ ] No test OAuth providers in production
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] `NEXTAUTH_URL` matches production domain exactly
- [ ] Password hashing uses bcrypt with salt rounds ≥10

---

## ✅ Phase 4: Database Setup

### Prisma Migrations

- [ ] All migrations applied to production database
- [ ] Database schema matches `prisma/schema.prisma`
- [ ] StripeWebhookEvent table exists (for webhook idempotency)

**Commands:**
```bash
# Check migration status
bun run db:migrate:deploy

# Verify schema
bun run db:studio
```

### Required Data

- [ ] At least one admin user exists
- [ ] Categories are populated (Collectibles, Fine Art, Books, Militaria)
- [ ] Test product created (to verify system works)

**Create Admin:**
```bash
bun run scripts/create-admin.ts
```

---

## ✅ Phase 5: Stripe Configuration

### Stripe Dashboard

- [ ] Webhook endpoint created: `https://your-domain.com/api/webhooks/stripe`
- [ ] Webhook events subscribed:
  - ✅ `checkout.session.completed`
  - ✅ `payment_intent.succeeded`
  - ✅ `payment_intent.payment_failed`
  - ✅ `charge.refunded` (recommended)
  - ✅ `charge.dispute.created` (recommended)
- [ ] Webhook signing secret copied to `STRIPE_WEBHOOK_SECRET`
- [ ] Using LIVE keys (not test keys) in production environment

**Test Webhook:**
```bash
# Using Stripe CLI (for local testing)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

### Payment Flow Verification

- [ ] Checkout page loads correctly
- [ ] Stripe Payment Elements render
- [ ] Test payment with Stripe test card: `4242 4242 4242 4242`
- [ ] Order created after successful payment
- [ ] Webhook received and order updated

---

## ✅ Phase 6: ImageKit Configuration

### ImageKit Dashboard

- [ ] ImageKit account configured
- [ ] Public key, private key, and URL endpoint set in environment
- [ ] Transformations configured (optional but recommended):
  - `product_grid` - 600px square crop
  - `product_detail` - 2000px max width
  - `admin_preview` - 400px thumbnail

**Test Image Upload:**
```bash
bun run scripts/test-imagekit.ts
```

### Image Upload Verification

- [ ] Admin can upload images
- [ ] Images appear on product pages
- [ ] Image URLs are ImageKit URLs (not local)
- [ ] Images persist after page refresh

---

## ✅ Phase 7: Smoke Tests

### Critical User Flows

- [ ] **Homepage loads** - No errors, products display
- [ ] **Product page loads** - Images, description, price visible
- [ ] **Admin login works** - Can access admin dashboard
- [ ] **Product creation** - Admin can create new product
- [ ] **Image upload** - Admin can upload product images
- [ ] **Checkout flow** - User can add to cart and proceed to checkout
- [ ] **Payment test** - Test payment completes (use Stripe test mode first!)

### Performance Checks

- [ ] Page load times < 3 seconds
- [ ] No console errors in browser
- [ ] Images load efficiently (WebP format)
- [ ] Database queries optimized (check slow query log)

---

## ✅ Phase 8: Monitoring & Logging

### Error Tracking

- [ ] Error logging configured (check `src/lib/logger.ts`)
- [ ] Logs are visible in Vercel dashboard
- [ ] Critical errors trigger alerts (if configured)

### Analytics (Optional)

- [ ] Analytics tracking code added (if using)
- [ ] Conversion tracking configured

---

## ✅ Phase 9: Rollback Plan

### Before Deployment

- [ ] Git tag created: `git tag -a v1.0.0 -m "Production release"`
- [ ] Database backup created
- [ ] Environment variables documented (stored securely)
- [ ] Rollback procedure documented

### If Issues Occur

1. **Disable payments** - Set `STRIPE_SECRET_KEY` to invalid value (forces 503 on payment endpoints)
2. **Revert deployment** - Use Vercel's deployment history to rollback
3. **Restore database** - From backup if data corruption occurred
4. **Communicate** - Notify users if service disruption expected

---

## ✅ Phase 10: Post-Deployment Verification

### Immediate Checks (Within 1 hour)

- [ ] Site accessible at production URL
- [ ] No error pages (check Vercel logs)
- [ ] Admin can log in
- [ ] Test product creation works
- [ ] Image uploads work
- [ ] Checkout page loads

### First 24 Hours

- [ ] Monitor error logs for issues
- [ ] Verify webhooks are being received (check Stripe dashboard)
- [ ] Test actual payment (small amount) if comfortable
- [ ] Check database for orphaned records
- [ ] Verify all images displaying correctly

---

## 🚨 Critical Issues (STOP Deployment If Present)

- ❌ TypeScript build errors
- ❌ Database migration failures
- ❌ Missing `STRIPE_WEBHOOK_SECRET` in production
- ❌ Missing `NEXTAUTH_SECRET` or weak secret
- ❌ Admin routes accessible without authentication
- ❌ Test Stripe keys in production environment
- ❌ `.env.local` committed to Git

---

## 📋 Quick Verification Script

Run this before final deployment:

```bash
# 1. Check environment
bun run scripts/check-env.ts

# 2. Type check
bun run typecheck

# 3. Build test
bun run build

# 4. Database verification
bun run scripts/test-db-connection.ts

# 5. Stripe verification
bun run verify:stripe

# 6. Production readiness
bun run verify-production
```

---

## ✅ Deployment Command

Once all checks pass:

```bash
# Commit all changes
git add .
git commit -m "chore: production deployment preparation"

# Push to main (triggers Vercel deployment)
git push origin main

# Or deploy via Vercel CLI
vercel --prod
```

---

## 📞 Support Contacts

- **Stripe Support:** https://support.stripe.com
- **Vercel Support:** https://vercel.com/support
- **Database Issues:** Check Supabase/PostgreSQL provider docs

---

**Status:** ⚠️ Pre-Launch - Complete checklist before going live
