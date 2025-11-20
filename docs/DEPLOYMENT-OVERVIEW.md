# Deployment Overview

## Technology Stack

- **Framework:** Next.js 15 with App Router
- **Package Manager:** Bun (not npm or yarn)
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Payments:** Stripe
- **Email:** Resend
- **Image CDN:** ImageKit
- **Hosting:** Vercel

## Local Development

```bash
# Install dependencies
bun install

# Setup database
bun x prisma generate
bun x prisma migrate deploy

# Create admin user
bun run scripts/create-admin.ts

# Start dev server
bun run dev
```

## Production Deployment

### Prerequisites
- Supabase database configured
- Stripe account with API keys
- ImageKit account with credentials
- Resend account with API key
- Vercel account connected to GitHub

### Environment Variables

Required in production (Vercel):
- `DATABASE_URL` - Supabase pooled connection
- `DIRECT_URL` - Supabase direct connection
- `NEXTAUTH_URL` - https://kollect-it.com
- `NEXTAUTH_SECRET` - Generated secret
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Production webhook secret
- `RESEND_API_KEY` - Email API key
- And others (see .env.example)

### Deployment Process

1. Push to main branch
2. Vercel auto-deploys
3. Build command: `bun install && bun x prisma generate && bun run build`
4. Verify at: https://kollect-it.com

## Important Commands

```bash
# Health check
bun run health-check

# Type check
bun run typecheck

# Build test
bun run build

# Production verification
bun run verify-production

# View database
bun x prisma studio
```

## Troubleshooting

### Build Fails
```bash
bun x tsc --noEmit  # Check TypeScript
bun x prisma generate  # Regenerate client
bun run build  # Try again
```

### Database Issues
```bash
bun x prisma migrate deploy  # Apply migrations
bun x prisma studio  # View database
```

### Authentication Issues
- Verify NEXTAUTH_URL matches deployment URL
- Check NEXTAUTH_SECRET is set
- Verify admin user exists

## Support

- Documentation: /docs directory
- Troubleshooting: docs/TROUBLESHOOTING.md
- Health check: `bun run health-check`