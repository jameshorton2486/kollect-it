# Kollect-It Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured in Vercel
- [ ] Database migrations deployed to production
- [ ] Stripe webhooks configured with production keys
- [ ] ImageKit connected and tested
- [ ] Build succeeds locally: `bun run build`
- [ ] TypeScript passes: `bun run typecheck`
- [ ] All tests pass: `bun run test:e2e`

## Environment Variables

### Required for Production

- **DATABASE_URL**: PostgreSQL connection string (with pgbouncer for connection pooling)
- **DIRECT_URL**: Direct PostgreSQL connection (for migrations)
- **NEXTAUTH_SECRET**: Generate with `openssl rand -base64 32`
- **NEXTAUTH_URL**: Your production URL (e.g., https://kollect-it.com)
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Stripe publishable key (pk_live_...)
- **STRIPE_SECRET_KEY**: Stripe secret key (sk_live_...)
- **STRIPE_WEBHOOK_SECRET**: Webhook signing secret (whsec_...)
- **NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT**: ImageKit URL endpoint
- **NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY**: ImageKit public key
- **IMAGEKIT_PRIVATE_KEY**: ImageKit private key

### Optional

- **GOOGLE_CLIENT_ID**: For OAuth (if enabling)
- **GOOGLE_CLIENT_SECRET**: For OAuth (if enabling)
- **CLAUDE_API_KEY**: For AI features
- **OPENAI_API_KEY**: For AI features

## Vercel Deployment

### Initial Setup

1. **Install Vercel CLI:**
   ```bash
   bun add -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link project:**
   ```bash
   vercel link
   ```

### Pre-deployment Verification

1. **Local build test:**
   ```bash
   bun run build
   # Should complete without errors
   ```

2. **TypeScript check:**
   ```bash
   bun run typecheck
   # Should have no errors
   ```

3. **Lint check:**
   ```bash
   bunx eslint . --max-warnings=0
   # Should have no errors
   ```

### Deploy to Staging

```bash
# Test deployment (preview)
vercel
```

### Deploy to Production

```bash
# Production deployment
vercel --prod
```

### Set Environment Variables in Vercel

Option 1: **Via CLI**
```bash
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
# ... repeat for all required variables
```

Option 2: **Via Web Dashboard**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all required variables
3. Ensure they're available for Production, Preview, and Development

### Post-Deployment Checklist

1. **Run database migrations:**
   ```bash
   bunx prisma migrate deploy
   ```

2. **Verify application:**
   - Visit production URL
   - Check authentication works
   - Test product browsing
   - Test checkout with test card (if Stripe configured)

3. **Monitor logs:**
   ```bash
   vercel logs --follow
   ```

4. **Check Stripe webhooks:**
   - Verify webhook endpoint is receiving events
   - Check Stripe dashboard → Developers → Webhooks

5. **Monitor ImageKit:**
   - Verify images are being served correctly
   - Check ImageKit dashboard for upload success

## Troubleshooting

### Build Fails

**Check Vercel build logs:**
```bash
vercel logs --follow
```

**Common causes:**
- Missing environment variables
- TypeScript errors
- Prisma client not generated
- Missing dependencies

**Fix:**
```bash
# Ensure all required env vars are set
vercel env list

# Regenerate Prisma client
bunx prisma generate

# Test build locally
bun run build
```

### Database Connection Fails

**Check connection string:**
```bash
# Verify it matches Supabase format
# Should be: postgresql://user:password@host:5432/db?pgbouncer=true
```

**Verify database is accessible:**
```bash
# From local terminal
bunx prisma db push
```

**Check Supabase status:**
- Go to https://supabase.com → Project Dashboard
- Verify database is running
- Check connection settings

### Stripe Integration Issues

**Verify webhook is configured:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

**Test webhook:**
```bash
vercel logs --follow
# Make a test payment and watch for webhook events
```

### ImageKit Upload Fails

**Check credentials:**
- Verify `IMAGEKIT_PRIVATE_KEY` is correct
- Verify `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` is correct
- Verify `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` is correct

**Test connection:**
```bash
curl -X GET "https://api.imagekit.io/v1/files" \
  -u "IMAGEKIT_PRIVATE_KEY:"
# Should return file list (not 401)
```

## Rollback

If deployment has critical issues:

```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]

# Or go to Vercel Dashboard → Deployments → Select deployment → Promote to Production
```

## Performance Monitoring

### Enable Analytics

1. Go to Vercel Dashboard → Project Settings → Monitoring
2. Enable Web Analytics
3. Install analytics client (already in code)

### Monitor Core Web Vitals

```bash
# View Web Vitals in Vercel Dashboard
# Metrics:
# - Largest Contentful Paint (LCP)
# - First Input Delay (FID)
# - Cumulative Layout Shift (CLS)
```

### Database Query Performance

```bash
# Connect to Supabase
# Use Query Performance tab to identify slow queries
# Add indexes if needed
```

## Maintenance

### Regular Tasks

**Weekly:**
- Check error logs for new issues
- Monitor Stripe webhook delivery
- Verify image optimization working

**Monthly:**
- Update dependencies: `bun update`
- Review database backups (Supabase auto-backups)
- Check Vercel bandwidth usage

**Quarterly:**
- Full security audit
- Performance optimization review
- Database maintenance (VACUUM, ANALYZE)

## Emergency Procedures

### Site is Down

1. **Check status:**
   ```bash
   vercel ls
   # If no recent deployments, check Vercel status page
   ```

2. **Check logs:**
   ```bash
   vercel logs --follow
   # Look for errors
   ```

3. **Quick rollback:**
   ```bash
   vercel rollback
   # Rolls back to previous successful deployment
   ```

### Database is Unreachable

1. **Check Supabase status:**
   - Go to https://supabase.com → Status Page
   - Verify database is running

2. **Check connection string:**
   ```bash
   echo $DATABASE_URL
   # Verify it's correct in Vercel environment
   ```

3. **Restart database:**
   - Supabase Dashboard → Project → Database → Restart

### Stripe is Not Processing Payments

1. **Check keys:**
   ```bash
   # Verify STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are correct
   vercel env list
   ```

2. **Check Stripe status:**
   - Go to Stripe Dashboard → Status
   - Check incident reports

3. **Test webhook:**
   ```bash
   vercel logs --follow
   # Make a test payment
   ```

## Support

**For deployment issues:**
- Check [Vercel Docs](https://vercel.com/docs)
- Check [Next.js Docs](https://nextjs.org/docs)
- Check [Stripe Docs](https://stripe.com/docs)

**For code issues:**
- Check application logs: `vercel logs --follow`
- Review git history: `git log --oneline`
- Check [GitHub Issues](https://github.com/jameshorton2486/kollect-it/issues)
