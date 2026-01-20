# Admin-Only Tools

The following directories contain internal, administrator-only tooling.

They are:
- NOT user-facing
- NOT deployed to the public frontend
- NOT imported by application runtime code
- Intended for internal operational use only

## Admin Tooling
- `/product-application/` - Desktop application for product ingestion and management

## Rules
- No secrets stored in code
- All credentials loaded from environment variables
- No frontend imports from admin tooling
- Changes require admin review

## Environment Variables

Admin tooling reads from the centralized environment configuration:
- **Local Development**: `.env.local` at repo root
- **Production**: Vercel environment variables

Required variables:
- `PRODUCT_INGEST_API_KEY` - API key for product ingestion endpoint
- `IMAGEKIT_PUBLIC_KEY` - ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` - ImageKit private key
- `ANTHROPIC_API_KEY` - Anthropic API key for AI features
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key

---

*Last updated: January 19, 2026*
