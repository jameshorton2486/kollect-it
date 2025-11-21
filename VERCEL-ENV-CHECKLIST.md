# Vercel Environment Variables Checklist

## Critical Variables for Production

These MUST be set in Vercel Dashboard → Settings → Environment Variables:

### Authentication (CRITICAL)
- [ ] `NEXTAUTH_URL` = `https://kollect-it.com`
- [ ] `NEXTAUTH_SECRET` = [your secret key - never commit to git]

### Database (CRITICAL)
- [ ] `DATABASE_URL` = [Supabase connection pooler URL - port 5432]
- [ ] `DIRECT_URL` = [Supabase direct connection URL - port 5432]

### Stripe (REQUIRED)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = pk_live_...
- [ ] `STRIPE_SECRET_KEY` = sk_live_...
- [ ] `STRIPE_WEBHOOK_SECRET` = whsec_...

### ImageKit (REQUIRED)
- [ ] `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` = public_...
- [ ] `IMAGEKIT_PRIVATE_KEY` = private_...
- [ ] `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` = https://ik.imagekit.io/kollectit

### Site URLs (RECOMMENDED)
- [ ] `NEXT_PUBLIC_APP_URL` = `https://kollect-it.com`
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://kollect-it.com`

### Optional
- [ ] `ADMIN_EMAIL` = admin@kollect-it.com
- [ ] `EMAIL_SERVER` = [your SMTP config]
- [ ] `EMAIL_FROM` = noreply@kollect-it.com

## How to Update Vercel Variables

1. Go to: https://vercel.com/dashboard
2. Select: kollect-it project
3. Click: Settings → Environment Variables
4. Find the variable and click (⋮) → Edit
5. Update the value
6. Click Save
7. **CRITICAL**: Go to Deployments → Latest → (⋮) → Redeploy

## Environment-Specific Values

| Variable | Local Development | Production |
|----------|------------------|------------|
| NEXTAUTH_URL | http://localhost:3000 | https://kollect-it.com |
| NEXT_PUBLIC_APP_URL | http://localhost:3000 | https://kollect-it.com |
| NEXT_PUBLIC_SITE_URL | http://localhost:3000 | https://kollect-it.com |
