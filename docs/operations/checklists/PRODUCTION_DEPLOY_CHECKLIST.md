# Production Deployment Checklist

**Last Updated:** December 2024  
**Purpose:** Ensure safe, repeatable production deployments for Kollect-It

---

## ✅ PRE-DEPLOYMENT VERIFICATION

### 1. Environment Variables

Verify ALL required environment variables are set in Vercel:

#### Database
- [ ] `DATABASE_URL` - PostgreSQL connection string (Supabase)

#### Authentication
- [ ] `NEXTAUTH_SECRET` - Random secret (generate: `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` - Production URL (`https://kollect-it.com`)

#### Stripe
- [ ] `STRIPE_SECRET_KEY` - Live mode secret key (starts with `sk_live_`)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Live mode publishable key (starts with `pk_live_`)
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook signing secret from Stripe Dashboard

#### ImageKit
- [ ] `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` - ImageKit URL endpoint
- [ ] `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` - ImageKit public key
- [ ] `IMAGEKIT_PRIVATE_KEY` - ImageKit private key

#### Email (Optional)
- [ ] `SMTP_HOST` - SMTP server hostname
- [ ] `SMTP_PORT` - SMTP port (usually 587)
- [ ] `SMTP_USER` - SMTP username
- [ ] `SMTP_PASSWORD` - SMTP password
- [ ] `SMTP_FROM` - From email address

#### AI Services (Optional)
- [ ] `OPENAI_API_KEY` - OpenAI API key (if using AI features)
- [ ] `ANTHROPIC_API_KEY` - Anthropic/Claude API key (if using AI features)

#### Admin Setup
- [ ] `ADMIN_EMAIL` - Admin user email (for initial setup)
- [ ] `ADMIN_PASSWORD` - Admin user password (strong password required)

**⚠️ CRITICAL:** Never commit `.env.local` or expose secrets in logs/repos.

---

### 2. Database Migration

Ensure database schema is up-to-date:

```bash
# Generate Prisma client
bun run db:generate

# Run migrations
bun run db:migrate deploy

# Verify schema matches
bun run db:push --accept-data-loss
```

**Required Tables:**
- [ ] `User` - User accounts
- [ ] `Product` - Products
- [ ] `Order` - Orders
- [ ] `StripeWebhookEvent` - Webhook idempotency (⚠️ REQUIRED for webhooks)

---

### 3. Build Verification

Ensure clean build with no errors:

```bash
# Clean build
rm -rf .next node_modules/.cache
bun install
bun run db:generate
bun run build
```

**Check:**
- [ ] Build completes successfully (exit code 0)
- [ ] No TypeScript errors
- [ ] No Prisma warnings
- [ ] No missing environment variable warnings
- [ ] Build output size is reasonable (< 50MB uncompressed)

---

### 4. Security Checklist

#### Admin Routes
- [ ] All `/admin/*` routes require authentication
- [ ] Admin routes return 401/403 when unauthenticated
- [ ] No default/hardcoded admin credentials in code
- [ ] Admin dashboard accessible only to authenticated admins

#### API Routes
- [ ] Admin API routes (`/api/admin/*`) require authentication
- [ ] Payment routes properly validated
- [ ] No test API keys in production code
- [ ] Webhook endpoints verify signatures

#### Stripe Configuration
- [ ] Using **live mode** keys (`sk_live_`, `pk_live_`)
- [ ] Webhook endpoint configured in Stripe Dashboard
- [ ] Webhook secret stored in `STRIPE_WEBHOOK_SECRET`
- [ ] Required webhook events subscribed:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `charge.refunded`
  - `charge.dispute.created`

#### Environment
- [ ] `.env.local` NOT committed to Git
- [ ] `.env.example` doesn't contain real secrets
- [ ] No API keys in code comments or docs
- [ ] Production logs don't expose sensitive data

---

### 5. ImageKit Configuration

- [ ] ImageKit account configured
- [ ] All environment variables set
- [ ] Test image upload works
- [ ] Image transformations working (product_grid, product_detail, admin_preview)
- [ ] CDN caching enabled

---

### 6. Domain & DNS

- [ ] Domain configured in Vercel
- [ ] DNS records pointing to Vercel
- [ ] SSL certificate active (automatic with Vercel)
- [ ] `www` subdomain redirects (if applicable)

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Final Code Review

- [ ] All changes committed to `main` branch (or PR merged)
- [ ] Branch protection rules satisfied
- [ ] No merge conflicts
- [ ] Code review completed (if required)

### Step 2: Pre-Deploy Checks

Run verification script (if available):

```bash
bun run verify-production
```

Or manually:
- [ ] Type check: `bun run typecheck`
- [ ] Build: `bun run build`
- [ ] Lint: `bun run lint`

### Step 3: Deploy to Vercel

**Option A: Git Push (Recommended)**
```bash
git push origin main
# Vercel automatically deploys
```

**Option B: Vercel CLI**
```bash
vercel --prod
```

### Step 4: Post-Deploy Verification

After deployment, verify:

- [ ] Deployment succeeded (green status in Vercel)
- [ ] Site loads at production URL
- [ ] Homepage renders correctly
- [ ] No console errors in browser
- [ ] Admin login works
- [ ] Product pages load
- [ ] Images load via ImageKit
- [ ] Database connection works

---

## 🧪 SMOKE TESTS

Perform these tests after deployment:

### Basic Functionality
- [ ] Homepage loads
- [ ] Browse page loads and shows products
- [ ] Product detail page loads
- [ ] Search works
- [ ] Category pages load

### Admin Functionality
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] Can create product (as draft)
- [ ] Can publish product
- [ ] Can view orders

### Payments (Test Mode First)
- [ ] Test checkout flow (use Stripe test card: `4242 4242 4242 4242`)
- [ ] Order created in database
- [ ] Webhook received and processed
- [ ] Order status updated correctly

### Image Upload
- [ ] Can upload product image
- [ ] Image appears in ImageKit
- [ ] Image displays correctly on product page
- [ ] ImageKit transformations working

---

## 🔄 ROLLBACK PLAN

If deployment fails or issues are discovered:

### Immediate Rollback (Vercel)

1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Database Rollback (if needed)

```bash
# Rollback last migration
bun run db:migrate resolve --rolled-back <migration_name>

# Or restore from backup (if available)
# Contact database admin for backup restoration
```

### Code Rollback

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to previous version
git reset --hard <previous-commit-hash>
git push --force origin main  # ⚠️ Only if safe to force push
```

---

## 📊 POST-DEPLOYMENT MONITORING

Monitor for first 24-48 hours:

- [ ] Check Vercel analytics for errors
- [ ] Monitor Stripe Dashboard for webhook failures
- [ ] Check database connection errors
- [ ] Review application logs
- [ ] Monitor payment success rate
- [ ] Check image upload success rate

---

## 🐛 TROUBLESHOOTING

### Build Fails

**Check:**
- Environment variables set correctly
- Dependencies installed (`bun install`)
- TypeScript errors resolved
- Database connection working

### Runtime Errors

**Check:**
- Environment variables accessible at runtime
- Database connection string valid
- API keys valid and have correct permissions
- Webhook endpoints accessible from Stripe

### Payment Issues

**Check:**
- Stripe keys are live mode (not test)
- Webhook endpoint configured correctly
- Webhook secret matches Stripe Dashboard
- Events subscribed correctly

### Image Issues

**Check:**
- ImageKit credentials valid
- ImageKit folder structure correct
- CDN enabled
- Transformations configured

---

## ✅ DEPLOYMENT SIGN-OFF

- [ ] All pre-deployment checks passed
- [ ] Deployment successful
- [ ] Smoke tests passed
- [ ] Monitoring configured
- [ ] Team notified of deployment
- [ ] Documentation updated (if needed)

**Deployed by:** _________________  
**Date:** _________________  
**Version/Commit:** _________________  
**Notes:** _________________

---

## 📝 NOTES

- Always test in preview/staging environment first if available
- Keep deployment logs for audit trail
- Document any manual steps taken during deployment
- Update this checklist if new requirements are identified
