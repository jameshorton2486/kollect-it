# 🚀 Kollect-It Deployment & Testing Guide

## Overview

This guide provides step-by-step instructions to verify your Kollect-It deployment is working correctly, both locally and in production (Vercel).

---

## Prerequisites

Before running tests, ensure you have:

- [ ] Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Access to third-party service dashboards (Stripe, Supabase, ImageKit, Resend)

---

## 📋 Testing Checklist

### Phase 1: Local Environment Testing (30 minutes)

#### 1.1 Environment Variables Validation

Run the comprehensive production verification script:

```bash
bun run scripts/verify-production.ts
```

**What this tests:**
- ✅ All required environment variables are set
- ✅ Database connectivity (both pooled and direct)
- ✅ Stripe API integration
- ✅ ImageKit CDN configuration
- ✅ Email service (Resend)
- ✅ AI services (Claude & OpenAI)

**Expected Output:**
- All critical services should show ✅ PASS
- Optional services may show ⏭️ SKIP (acceptable)
- No ❌ FAIL for critical services

**If tests fail:**
1. Check `.env.local` file exists
2. Verify all credentials are correct
3. Check network connectivity
4. Verify third-party services are active

---

#### 1.2 Database Connection Test

Run the existing database test:

```bash
bun run scripts/test-db-connection.ts
```

**What this tests:**
- Database pooler connection (port 6543)
- Direct connection (port 5432)
- Read/write permissions
- Schema integrity

**Common Issues:**
- **Connection timeout**: Check Supabase project is active
- **Authentication failed**: Verify DATABASE_URL password
- **SSL error**: Ensure connection string includes SSL parameters

---

#### 1.3 Test Individual Services

**Stripe:**
```bash
bun run scripts/test-services.ts
```

**ImageKit:**
```bash
bun run scripts/test-imagekit.ts
```

**Health Check:**
```bash
bun run scripts/health-check.ts
```

---

### Phase 2: Local Development Server (15 minutes)

#### 2.1 Start Development Server

```bash
bun run dev
```

#### 2.2 Manual Browser Tests

Open your browser and test these URLs:

**Public Pages:**
- [ ] `http://localhost:3000` - Homepage loads
- [ ] `http://localhost:3000/shop` - Products display
- [ ] `http://localhost:3000/categories` - Categories load
- [ ] `http://localhost:3000/about` - About page
- [ ] `http://localhost:3000/contact` - Contact form

**Authentication:**
- [ ] `http://localhost:3000/login` - Login page
- [ ] `http://localhost:3000/register` - Registration form
- [ ] Try creating a test account
- [ ] Try logging in

**API Endpoints:**
- [ ] `http://localhost:3000/api/health` - Returns JSON with status
- [ ] `http://localhost:3000/api/products` - Returns products array
- [ ] `http://localhost:3000/api/categories` - Returns categories

**Admin (after login as admin):**
- [ ] `http://localhost:3000/admin/dashboard` - Admin dashboard
- [ ] `http://localhost:3000/admin/products` - Product management
- [ ] `http://localhost:3000/admin/orders` - Order management

---

### Phase 3: Build & Production Test (20 minutes)

#### 3.1 Production Build

```bash
# Clean previous builds
rm -rf .next

# Create production build
bun run build
```

**Expected Output:**
- No TypeScript errors
- All pages compiled successfully
- Bundle size report displayed

**Common Build Errors:**
- **TypeScript errors**: Fix type issues in code
- **Missing dependencies**: Run `bun install`
- **Environment variable errors**: Check `.env.local`

#### 3.2 Test Production Build Locally

```bash
bun run start
```

Test the same URLs as Phase 2 at `http://localhost:3000`

---

### Phase 4: Vercel Deployment Testing (30 minutes)

#### 4.1 Configure Vercel Environment Variables

Go to your Vercel project settings and add these environment variables:

**Critical (Required):**
```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="[32+ char secret]"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_..."
IMAGEKIT_PRIVATE_KEY="private_..."
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/..."
```

**Important (Recommended):**
```bash
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@your-domain.com"
CLAUDE_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."
ADMIN_EMAIL="admin@your-domain.com"
```

#### 4.2 Deploy to Vercel

```bash
# Using Vercel CLI (if installed)
vercel --prod

# Or push to your main branch (if auto-deploy enabled)
git push origin main
```

#### 4.3 Run Deployment Tests

Once deployed, test your live site:

```bash
bun run scripts/test-vercel-deployment.ts https://your-domain.vercel.app
```

**What this tests:**
- ✅ All public pages load correctly
- ✅ API endpoints respond
- ✅ Authentication flows work
- ✅ Static assets load
- ✅ Performance metrics
- ✅ Security headers

**Expected Results:**
- All critical endpoints: ✅ PASS
- Average response time: < 3000ms
- All security headers present

---

### Phase 5: Post-Deployment Verification (20 minutes)

#### 5.1 Database Migrations in Production

```bash
# Pull production environment variables
vercel env pull .env.production

# Run migrations with production config
DATABASE_URL="your-production-url" bun x prisma migrate deploy
```

#### 5.2 Create Admin User

```bash
# Set production environment
export $(cat .env.production | xargs)

# Create admin user
bun run scripts/create-admin.ts
```

#### 5.3 Manual Production Tests

**Test Critical User Flows:**

1. **Browse Products**
   - [ ] Visit your site homepage
   - [ ] Navigate to shop page
   - [ ] Click on a product
   - [ ] Product details load correctly

2. **User Registration**
   - [ ] Go to register page
   - [ ] Create new account
   - [ ] Receive welcome email (check inbox)
   - [ ] Login with new account

3. **Shopping Cart**
   - [ ] Add product to cart
   - [ ] View cart
   - [ ] Update quantities
   - [ ] Proceed to checkout

4. **Payment Flow**
   - [ ] Use Stripe test card: `4242 4242 4242 4242`
   - [ ] Complete payment
   - [ ] Receive order confirmation email
   - [ ] Order appears in account

5. **Admin Functions**
   - [ ] Login as admin
   - [ ] Access admin dashboard
   - [ ] View orders
   - [ ] Manage products
   - [ ] Check analytics

---

## 🔍 Service-Specific Testing

### Stripe Integration

**Test Mode:**
1. Use test publishable key (pk_test_...)
2. Use test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
3. Check Stripe Dashboard for test transactions

**Live Mode:**
1. Switch to live keys (pk_live_...)
2. Make small real transaction ($0.50)
3. Verify in Stripe Dashboard
4. Issue refund to test refund flow

**Webhook Setup:**
1. In Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.failed`
4. Copy webhook secret to STRIPE_WEBHOOK_SECRET
5. Test webhook with Stripe CLI:
   ```bash
   stripe trigger payment_intent.succeeded
   ```

---

### Supabase Database

**Connection Test:**
```bash
bun run scripts/test-both-connections.ts
```

**Verify Tables:**
```bash
bun run scripts/diagnose-database.ts
```

**Performance Check:**
- Query response time should be < 100ms
- Connection pooler should be active
- No connection errors in logs

---

### ImageKit CDN

**Test Image Upload:**
```bash
bun run scripts/test-imagekit.ts
```

**Manual Test:**
1. Go to admin dashboard
2. Upload product image
3. Verify image appears on product page
4. Check ImageKit dashboard for new image
5. Verify image URL uses ImageKit domain

**Optimization Check:**
- Images should auto-convert to WebP
- Lazy loading should be enabled
- Proper caching headers set

---

### Resend Email Service

**Test Email:**
```bash
# Create test script
node -e "
const fetch = require('node:fetch');
fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${RESEND_API_KEY}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: '${EMAIL_FROM}',
    to: 'your-email@example.com',
    subject: 'Kollect-It Test Email',
    html: '<p>Test email from Kollect-It</p>'
  })
}).then(r => r.json()).then(console.log);
"
```

**Check Email Delivery:**
1. Send test registration
2. Check inbox (and spam folder)
3. Verify email formatting
4. Check Resend dashboard for logs

---

### AI Services (Optional)

**Claude API:**
```bash
# Test Claude integration
node -e "
const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: '${CLAUDE_API_KEY}' });
client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 100,
  messages: [{ role: 'user', content: 'Test' }]
}).then(() => console.log('✅ Claude API working'));
"
```

**OpenAI API:**
```bash
# Test OpenAI integration
node -e "
const OpenAI = require('openai');
const client = new OpenAI({ apiKey: '${OPENAI_API_KEY}' });
client.models.list().then(() => console.log('✅ OpenAI API working'));
"
```

---

## 📊 Monitoring & Logs

### Vercel Logs

```bash
# View real-time logs
vercel logs --follow

# View recent errors
vercel logs --since 1h
```

### Error Tracking

Check these log locations:
- Vercel Dashboard > Logs
- Supabase Dashboard > Logs
- Stripe Dashboard > Developers > Logs
- Resend Dashboard > Logs

### Performance Monitoring

Monitor these metrics:
- Response times (< 3s for pages)
- Error rates (< 1%)
- Database connection pool usage
- CDN hit rate (> 80%)

---

## 🐛 Common Issues & Solutions

### "Environment variable not found"
- Run `vercel env pull .env.production`
- Verify variable exists in Vercel dashboard
- Redeploy after adding variables

### "Database connection failed"
- Check Supabase project is active
- Verify connection strings are correct
- Ensure IP allowlist includes Vercel (or set to allow all)
- Check connection pool isn't exhausted

### "Stripe webhook verification failed"
- Verify STRIPE_WEBHOOK_SECRET is set
- Check webhook endpoint URL is correct
- Ensure webhook is in live/test mode matching keys

### "Images not loading"
- Check IMAGEKIT_URL_ENDPOINT is correct
- Verify ImageKit API keys
- Check CORS settings in ImageKit dashboard

### "Emails not sending"
- Verify RESEND_API_KEY is valid
- Check domain is verified in Resend
- Review Resend logs for errors

---

## ✅ Final Production Checklist

Before going live:

- [ ] All critical tests pass
- [ ] Database migrations deployed
- [ ] Admin user created
- [ ] Test transaction completed
- [ ] Stripe webhooks configured
- [ ] Email delivery verified
- [ ] All images loading from CDN
- [ ] SSL certificate active
- [ ] Domain DNS configured
- [ ] Error monitoring set up
- [ ] Backup strategy in place
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent banner active

---

## 🆘 Support Resources

**Documentation:**
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Stripe: https://stripe.com/docs
- Supabase: https://supabase.com/docs

**Community:**
- Next.js Discord
- Prisma Slack
- Stripe Discord

**Your Project:**
- GitHub Repository: [your-repo]
- Vercel Project: [your-vercel-url]
- Production URL: [your-domain]

---

## 📈 Post-Launch Monitoring

**Daily:**
- Check error logs
- Monitor transaction success rate
- Review user signups

**Weekly:**
- Analyze performance metrics
- Review user feedback
- Check security logs
- Update dependencies

**Monthly:**
- Full security audit
- Performance optimization review
- Cost analysis
- Feature planning

---

**Need Help?** If any tests fail, review the error messages carefully and check the relevant service documentation. Most issues are configuration-related and can be resolved by double-checking environment variables and service settings.
