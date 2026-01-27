# Kollect-It: Vercel Environment Variables

**Copy this checklist to verify all variables are set in Vercel Dashboard**

---

## Required Variables

### Database (Supabase/PostgreSQL)
```
DATABASE_URL=postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```
- [ ] `DATABASE_URL` - Pooled connection (for serverless)
- [ ] `DIRECT_URL` - Direct connection (for migrations)

### Authentication (NextAuth)
```
NEXTAUTH_URL=https://kollect-it.com
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
```
- [ ] `NEXTAUTH_URL` - Your production URL
- [ ] `NEXTAUTH_SECRET` - Secure random string (32+ chars)

### Stripe (Payment Processing)
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
- [ ] `STRIPE_SECRET_KEY` - Server-side key (sk_live_*)
- [ ] `STRIPE_PUBLISHABLE_KEY` - Client-side key (pk_live_*)
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook signing secret

### ImageKit (Image CDN)
```
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
```
- [ ] `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` - Your ImageKit URL
- [ ] `IMAGEKIT_PUBLIC_KEY` - Public key
- [ ] `IMAGEKIT_PRIVATE_KEY` - Private key

### Desktop App Integration
```
PRODUCT_INGEST_API_KEY=<secure-random-string>
```
- [ ] `PRODUCT_INGEST_API_KEY` - Shared secret with desktop app

---

## Email Configuration (Choose ONE)

### Email Service (Zoho Mail SMTP)
```
EMAIL_FROM="Kollect-It <info@kollect-it.com>"
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_USER=info@kollect-it.com
EMAIL_PASSWORD=your-zoho-app-password
ADMIN_EMAIL=info@kollect-it.com
```
- [ ] `EMAIL_FROM` - Display name and address
- [ ] `EMAIL_HOST` - SMTP server (smtp.zoho.com)
- [ ] `EMAIL_PORT` - SMTP port (587)
- [ ] `EMAIL_USER` - SMTP username (your Zoho Mail email)
- [ ] `EMAIL_PASSWORD` - Zoho App Password (NOT regular password)
- [ ] `ADMIN_EMAIL` - Admin notification recipient

### Email Service
Kollect-It uses Zoho Mail SMTP via Nodemailer. No alternative email services are configured.

---

## Optional Variables

### AI Features
```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```
- [ ] `ANTHROPIC_API_KEY` - For Claude AI features (web upload form)
- [ ] `OPENAI_API_KEY` - For OpenAI features (if any)

### Analytics & Monitoring
```
NEXT_PUBLIC_GA_ID=G-...
SENTRY_DSN=https://...
```
- [ ] `NEXT_PUBLIC_GA_ID` - Google Analytics 4
- [ ] `SENTRY_DSN` - Error tracking (optional)

---

## Quick Setup in Vercel

1. Go to: https://vercel.com/[your-team]/kollect-it/settings/environment-variables

2. For each variable:
   - Click "Add New"
   - Enter name exactly as shown
   - Paste value
   - Select environments: ✅ Production, ✅ Preview, ✅ Development
   - Click "Save"

3. After adding all variables:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Select "Redeploy"
   - Wait for deployment to complete

---

## Verification Commands

### Test Database Connection
```bash
# In project directory
bun x prisma db pull
# Should complete without errors
```

### Test Stripe Connection
```bash
curl https://kollect-it.com/api/health
# Should return {"status":"ok"}
```

### Test Desktop App API
```bash
curl -X GET https://kollect-it.com/api/admin/products/ingest \
  -H "Authorization: Bearer YOUR_PRODUCT_INGEST_API_KEY"
# Should return categories list
```

---

## Security Notes

⚠️ **Never commit these values to git**

⚠️ **Use different values for Production vs Preview environments**

⚠️ **Rotate `PRODUCT_INGEST_API_KEY` periodically**

⚠️ **Use App Passwords for Zoho Mail, not your actual password**

---

*Reference version 1.0 • January 2026*
