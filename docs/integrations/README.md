# Integrations

This directory documents third-party service integrations.

## 🔌 Current Integrations

### Supabase (Database)

- PostgreSQL database
- Authentication support
- Real-time subscriptions
- Edge Functions (optional)

**Setup:**
- Create project at supabase.com
- Copy connection string to `.env.local`
- Migrations auto-applied on deploy

### ImageKit (Image Service)

- Image upload and normalization
- CDN delivery globally
- Auto-resizing and compression
- Background removal (optional)

**Setup:**
- Account at imagekit.io
- API keys in `.env.local`
- See `src/lib/imagekit.ts`

### NextAuth.js (Authentication)

- Email/password authentication
- OAuth providers (Google, GitHub)
- Session management
- Callback hooks

**Setup:**
- See `src/app/api/auth/`
- Configure providers in `nextauth.config.ts`

### Stripe (Payment Processing)

- Credit card processing
- Escrow management
- Payout to sellers

**Setup:**
- Account at stripe.com
- API keys in `.env.local` (local dev) and Vercel (production)
- Webhook handlers in `src/app/api/webhooks/stripe`

**Production Webhooks (Live Mode):**
- Webhook URL: `https://kollect-it.com/api/stripe/webhook`
- Route alias in code also supports: `https://kollect-it.com/api/webhooks/stripe`
- Use a STANDARD secret key (`sk_live_...`) to create webhooks
- Restricted keys (`rk_live_...`) cannot create webhook endpoints
- Required env vars (server-only, sensitive):
  - `STRIPE_SECRET_KEY` (live secret key)
  - `STRIPE_WEBHOOK_SECRET` (webhook signing secret)
- Optional env vars:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (client publishable key)

**Create Webhook via Stripe CLI (Live Mode):**
```powershell
stripe webhook_endpoints create --api-key sk_live_XXXX --url "https://kollect-it.com/api/stripe/webhook" --enabled-events "checkout.session.completed" --enabled-events "payment_intent.succeeded" --enabled-events "payment_intent.payment_failed"
```
- Replace `sk_live_XXXX` with your real live secret key.
- Copy the `whsec_...` value from the output and store it as `STRIPE_WEBHOOK_SECRET` in Vercel (production).

**Key Rotation (Safe):**
- Create a new live secret key in Stripe
- Add it to Vercel as `STRIPE_SECRET_KEY` (production)
- Redeploy, then revoke the old key in Stripe

**Webhook Recovery:**
- If a webhook is deleted, recreate it with the same URL and events
- Update `STRIPE_WEBHOOK_SECRET` in Vercel with the new `whsec_...`

**Quick Verification Checklist:**
- Confirm Vercel env vars are set for production:
  - `STRIPE_SECRET_KEY` (live)
  - `STRIPE_WEBHOOK_SECRET` (whsec)
- Verify the webhook endpoint exists in Stripe (Live mode)
- Trigger a live-mode test event (e.g., a real checkout) and confirm:
  - Stripe dashboard shows the event delivered
  - No 4xx/5xx errors for the webhook endpoint

---

**Last Updated:** January 2026
**Maintained by:** DevOps Team
