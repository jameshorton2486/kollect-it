# Phase 6 Deployment Guide

## Analytics & Dashboards - Production Deployment

### Prerequisites Checklist

- [ ] Vercel account configured
- [ ] Database hosted (Supabase/Railway/PlanetScale)
- [ ] Environment variables configured
- [ ] Domain configured (optional)

---

## 1. Vercel Deployment

### Deploy to Production

```bash
# Ensure all changes are committed
git status

# Push to GitHub (triggers Vercel auto-deploy if configured)
git push origin main

# Or deploy manually with Vercel CLI
npx vercel --prod
```

### Vercel Configuration

Ensure your `vercel.json` is configured:

```json
{
  "buildCommand": "bun run build",
  "framework": "nextjs",
  "installCommand": "bun install"
}
```

---

## 2. Environment Variables Configuration

### Required Environment Variables (Add to Vercel Dashboard)

#### Database (Supabase)

```bash
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
```

#### Authentication (NextAuth)

```bash
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="[generate with: openssl rand -base64 32]"
```

#### Google Services

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Google Analytics (for Traffic Analytics Dashboard)
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

#### Email Service (Google Workspace SMTP)

```bash
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@your-domain.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@your-domain.com"
```

**Important:** Use App Password, not your regular Gmail password
Generate at: https://myaccount.google.com/apppasswords

#### Payment (Stripe)

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### File Storage (ImageKit)

```bash
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="your-public-key"
IMAGEKIT_PRIVATE_KEY="your-private-key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-id"
```

#### Optional: Redis (Production Caching)

```bash
REDIS_URL="redis://default:[password]@[host]:6379"
```

---

## 3. Database Setup

### Run Migrations

```bash
# Push schema to production database
bunx prisma db push

# Or run migrations
bunx prisma migrate deploy

# Seed initial data (if needed)
bunx prisma db seed
```

### Apply Performance Indexes

Run the recommended indexes from `src/lib/db-optimization.ts`:

```sql
-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON "Product"("category");
CREATE INDEX IF NOT EXISTS idx_products_status ON "Product"("status");
CREATE INDEX IF NOT EXISTS idx_products_created_at ON "Product"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON "Product"("price");
CREATE INDEX IF NOT EXISTS idx_products_featured ON "Product"("featured") WHERE "featured" = true;

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON "Order"("userId");
CREATE INDEX IF NOT EXISTS idx_orders_status ON "Order"("status");
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON "Order"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_orders_total ON "Order"("total");
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON "Order"("paymentStatus");

-- OrderItem indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON "OrderItem"("productId");

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"("email");
CREATE INDEX IF NOT EXISTS idx_users_role ON "User"("role");
CREATE INDEX IF NOT EXISTS idx_users_created_at ON "User"("createdAt" DESC);

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON "Order"("userId", "status");
CREATE INDEX IF NOT EXISTS idx_products_category_status ON "Product"("category", "status");
```

**Apply via Supabase Dashboard:**

1. Go to SQL Editor
2. Paste indexes above
3. Run query

---

## 4. Third-Party Service Configuration

### Google Analytics Setup

1. Create GA4 Property: https://analytics.google.com/
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to environment variables
4. Verify tracking in GA Real-Time reports

### Email Service (Google Workspace SMTP)

```bash
# Test email configuration
curl -X POST https://your-domain.vercel.app/api/admin/emails/test \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@domain.com"}'
```

**Google Workspace App Password Setup:**

1. Enable 2-Step Verification
2. Go to Security → App passwords
3. Generate app password for "Mail"
4. Use generated password in `EMAIL_SERVER_PASSWORD`

### Stripe Webhook Configuration

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `checkout.session.completed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

---

## 5. Post-Deployment Verification

### Health Checks

```bash
# Test API endpoints
curl https://your-domain.vercel.app/api/health

# Test admin authentication
curl https://your-domain.vercel.app/api/auth/session

# Test database connection
curl https://your-domain.vercel.app/api/admin/dashboard/metrics
```

### Admin Dashboard Testing

- [ ] Login as admin user
- [ ] Verify dashboard loads with metrics
- [ ] Test sales analytics page
- [ ] Test product analytics page
- [ ] Test traffic analytics (after GA configured)
- [ ] Test email notification system
- [ ] Test settings panel
- [ ] Verify mobile responsiveness

### Performance Testing

```bash
# Test page load times
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.vercel.app/admin

# Create curl-format.txt:
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
```

---

## 6. Monitoring Setup (Recommended)

### Vercel Analytics

Enable in Vercel Dashboard → Analytics (free tier available)

### Error Monitoring (Optional)

```bash
# Install Sentry
bun add @sentry/nextjs

# Configure in next.config.js
```

### Performance Monitoring

- Vercel Speed Insights (free)
- Google Analytics Performance reports
- Built-in performance monitoring: `/api/admin/performance`

---

## 7. Security Checklist

### Pre-Production Security

- [ ] All sensitive keys in environment variables (not committed)
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Authentication on all admin routes
- [ ] Rate limiting configured (if needed)
- [ ] CORS properly configured
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (React handles this)
- [ ] CSRF tokens on form submissions

### Admin Access

- [ ] Create admin user account
- [ ] Test role-based access control
- [ ] Verify non-admin users cannot access admin routes

---

## 8. DNS & Domain Configuration (Optional)

### Custom Domain Setup

1. Vercel Dashboard → Project → Settings → Domains
2. Add custom domain
3. Configure DNS records:
   - **A Record:** `@` → `76.76.21.21`
   - **CNAME:** `www` → `cname.vercel-dns.com`

---

## 9. Rollback Plan

### If Issues Occur

```bash
# Revert to previous deployment
vercel rollback [deployment-url]

# Or redeploy previous commit
git revert HEAD
git push origin main
```

### Database Rollback

```bash
# Revert last migration
bunx prisma migrate resolve --rolled-back [migration-name]
```

---

## 10. Success Metrics

### Track These KPIs

- **Page Load Time:** < 2 seconds
- **API Response Time:** < 500ms
- **Error Rate:** < 1%
- **Uptime:** > 99.5%
- **Database Query Time:** < 200ms (p95)

### Monitor in Admin Dashboard

- Check `/admin/performance` for real-time metrics
- Review Vercel Analytics for user behavior
- Monitor Google Analytics for traffic patterns

---

## Deployment Complete! ✅

Your Phase 6 Analytics & Dashboards system is now live in production.

### Next Steps:

1. Monitor for 24-48 hours
2. Gather user feedback
3. Address any issues
4. Plan Phase 7

**Need Help?**

- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
- Check logs in Vercel Dashboard → Deployments → Logs
