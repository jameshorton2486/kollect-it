# Environment Variables Audit

**Date:** January 19, 2026  
**Project:** Kollect-It Marketplace

---

## Required Variables

| Variable | Used In | Required | Has Default | Status |
|----------|---------|----------|-------------|--------|
| DATABASE_URL | prisma.ts, env.ts | Yes | No | ✅ |
| DIRECT_URL | prisma.ts, env.ts | No | No | ⚠️ Optional |
| NEXTAUTH_URL | auth.ts, env.ts | Yes | No | ✅ |
| NEXTAUTH_SECRET | auth.ts, env.ts | Yes | No | ✅ |
| STRIPE_SECRET_KEY | stripe.ts, checkout routes | Yes | No | ✅ |
| STRIPE_WEBHOOK_SECRET | webhooks/stripe/route.ts | Yes | No | ✅ |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | checkout/page.tsx | Yes | No | ✅ |
| IMAGEKIT_PRIVATE_KEY | imagekit.ts, imagekit-sync.ts | Yes | No | ✅ |
| NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY | ProductImage.tsx, MultiImageUpload.tsx | Yes | No | ✅ |
| NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT | imagekit.ts, ProductImage.tsx | Yes | No | ✅ |
| GOOGLE_CLIENT_ID | auth.ts, env.ts | Yes | No | ✅ |
| GOOGLE_CLIENT_SECRET | auth.ts, env.ts | Yes | No | ✅ |
| NEXT_PUBLIC_APP_EMAIL | email.ts, env.ts | Yes | No | ✅ |
| PRODUCT_INGEST_API_KEY | admin/products/ingest/route.ts | Yes | No | ✅ |
| NEXT_PUBLIC_APP_URL | useWebSocket.ts | No | Yes (localhost:3000) | ⚠️ Optional |

**Total Required:** 13  
**Total Optional:** 2

---

## Client-Exposed Variables (NEXT_PUBLIC_*)

| Variable | Purpose | Sensitive? | Safe to Expose? |
|----------|---------|------------|-----------------|
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe.js client-side | No | ✅ Yes (publishable keys are safe) |
| NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY | ImageKit client-side | No | ✅ Yes (public keys are safe) |
| NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT | ImageKit CDN endpoint | No | ✅ Yes (public endpoint) |
| NEXT_PUBLIC_APP_EMAIL | Contact email display | No | ✅ Yes (public email) |
| NEXT_PUBLIC_APP_URL | WebSocket connection | No | ✅ Yes (public URL) |

**Security Check:** ✅ All NEXT_PUBLIC_* variables are safe to expose (no secrets)

---

## Server-Only Variables (Secure)

| Variable | Purpose | Exposed? |
|----------|---------|----------|
| DATABASE_URL | Database connection | ❌ No (server-only) |
| DIRECT_URL | Direct DB connection | ❌ No (server-only) |
| NEXTAUTH_SECRET | Session encryption | ❌ No (server-only) |
| STRIPE_SECRET_KEY | Stripe API | ❌ No (server-only) |
| STRIPE_WEBHOOK_SECRET | Webhook verification | ❌ No (server-only) |
| IMAGEKIT_PRIVATE_KEY | ImageKit API | ❌ No (server-only) |
| GOOGLE_CLIENT_SECRET | OAuth secret | ❌ No (server-only) |
| PRODUCT_INGEST_API_KEY | Internal API | ❌ No (server-only) |

**Security Check:** ✅ All secrets are server-only, never exposed to client

---

## Validation & Type Safety

✅ **Excellent:** Environment variables are validated through `src/lib/env.ts`:
- Type-safe access via `getEnv()` and `requireEnv()`
- Validation on startup (fails fast in production)
- Format validation (URLs, key prefixes, length requirements)
- Clear error messages for missing variables

**Validation Rules:**
- `NEXTAUTH_SECRET`: Minimum 32 characters
- `PRODUCT_INGEST_API_KEY`: Minimum 16 characters
- `STRIPE_SECRET_KEY`: Must start with `sk_`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Must start with `pk_`
- URL variables: Must be valid URLs

---

## Missing from .env.example

**Note:** `.env.example` file exists but is filtered by .gitignore (correct behavior).

**Recommended .env.example structure:**
```bash
# Application
NODE_ENV=production
NEXTAUTH_URL=https://kollect-it.com
NEXTAUTH_SECRET=your-secret-here-min-32-chars

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://... (optional, for migrations)

# Stripe (Production - use live keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# ImageKit
IMAGEKIT_PRIVATE_KEY=your-private-key
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your-public-key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Email
NEXT_PUBLIC_APP_EMAIL=info@kollect-it.com

# Product Ingest API
PRODUCT_INGEST_API_KEY=your-api-key-min-16-chars

# Optional
NEXT_PUBLIC_APP_URL=https://kollect-it.com
```

---

## Vercel Configuration Required

Copy these to **Vercel → Settings → Environment Variables**:

### Production Environment
```
DATABASE_URL=postgresql://[supabase-connection-string]
DIRECT_URL=postgresql://[supabase-direct-connection] (optional)
NEXTAUTH_URL=https://kollect-it.com
NEXTAUTH_SECRET=[generate-32-char-secret]
STRIPE_SECRET_KEY=sk_live_[your-live-key]
STRIPE_WEBHOOK_SECRET=whsec_[your-webhook-secret]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[your-live-key]
IMAGEKIT_PRIVATE_KEY=[your-imagekit-private-key]
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=[your-imagekit-public-key]
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/[your-id]
GOOGLE_CLIENT_ID=[your-google-client-id]
GOOGLE_CLIENT_SECRET=[your-google-client-secret]
NEXT_PUBLIC_APP_EMAIL=info@kollect-it.com
PRODUCT_INGEST_API_KEY=[your-api-key]
NEXT_PUBLIC_APP_URL=https://kollect-it.com
```

### Preview Environment (Optional)
Use test/development keys for preview deployments:
- Stripe: Use `sk_test_` and `pk_test_` keys
- Other variables: Can use same as production or separate test values

---

## Security Check

- ✅ No secrets in NEXT_PUBLIC_* variables
- ✅ No hardcoded API keys in source code
- ✅ .env files in .gitignore (verified)
- ✅ Environment validation on startup
- ✅ Type-safe access prevents typos
- ✅ Production mode fails fast on missing variables

---

## Optional Variables

| Variable | Purpose | Default | Notes |
|----------|---------|---------|-------|
| NEXT_PUBLIC_APP_URL | WebSocket URL | `http://localhost:3000` | Auto-detected in production |
| DIRECT_URL | Direct DB connection | None | Optional, for migrations |
| VERCEL_URL | Vercel deployment URL | Auto-provided | Vercel automatically sets this |

---

## AI Provider Variables (Not Required)

**Note:** AI features (Claude, OpenAI) are optional and not required for core functionality. If AI features are used, these would be needed:

- `ANTHROPIC_API_KEY` (for Claude)
- `OPENAI_API_KEY` (for OpenAI)

These are **not** in the required list as they're feature-optional.

---

## Verification Commands

### Check Environment Variables (Development)
```bash
# Run diagnostics endpoint
curl http://localhost:3000/api/diagnostics/env

# Or check via health endpoint
curl http://localhost:3000/api/health
```

### Verify in Production
After deployment, verify all variables are set:
1. Check Vercel dashboard → Settings → Environment Variables
2. Verify all required variables are present
3. Test application functionality
4. Check error logs for missing variable warnings

---

## Summary

**Status:** ✅ **WELL CONFIGURED**

- ✅ All required variables documented
- ✅ Type-safe validation in place
- ✅ No security issues (secrets properly scoped)
- ✅ Clear separation of client/server variables
- ⚠️ Need to configure in Vercel dashboard before launch

**Action Required:** Set all environment variables in Vercel before production deployment.
