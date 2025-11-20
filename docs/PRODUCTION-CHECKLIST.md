# Production Deployment Checklist

## Pre-Deployment

- [ ] `bun run health-check` passes
- [ ] `bun run typecheck` passes
- [ ] `bun run build` succeeds
- [ ] Admin login works locally
- [ ] Test payment processes locally
- [ ] All environment variables set in Vercel
- [ ] NEXTAUTH_URL = https://kollect-it.com in Vercel
- [ ] Stripe production webhook created
- [ ] Stripe webhook secret in Vercel

## Deployment

- [ ] Code pushed to main branch
- [ ] Vercel build succeeds
- [ ] Deployment shows "Ready"
- [ ] No build errors in logs

## Post-Deployment

- [ ] Homepage loads at https://kollect-it.com
- [ ] SSL certificate valid (🔒)
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] Test payment processes
- [ ] Webhook events received (check Stripe)
- [ ] No console errors
- [ ] Lighthouse score > 90

## Monitoring

- [ ] Vercel analytics enabled
- [ ] Error tracking configured
- [ ] Stripe webhooks monitored
- [ ] Database backups scheduled

## Go-Live

- [ ] Switch Stripe to live mode (when ready)
- [ ] Verify domain email (Resend)
- [ ] Add products to catalog
- [ ] Test full customer journey
- [ ] Announce launch