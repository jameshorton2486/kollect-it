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
- API keys in `.env.local`
- Webhook handlers in `src/app/api/webhooks/stripe`

---

**Last Updated:** January 2026
**Maintained by:** DevOps Team
