# Kollect-It Troubleshooting Quick Reference

**Last Updated:** November 18, 2025  
**Use this when:** Something breaks and you need to know where to look

---

## 🚨 FIRST STEP: Generate Error Summary

```bash
# Run this FIRST whenever something breaks
bun run error-summary

# Then check the generated file
cat error-summary-ai.md

# Share that file with AI agent (Claude, VS Code Copilot, etc.)
```

**Why this works:** The summary automatically finds, analyzes, and formats ALL errors with full context - saving you 20+ minutes of manual log reading.

---

## 📁 File Locations by Problem Type

### 🔐 Authentication / Login Issues

| Problem | File Location | Quick Check |
|---------|--------------|-------------|
| Login fails silently | `src/lib/auth.ts` | Check logs: `bun run error-summary` |
| "Invalid credentials" | `src/lib/auth.ts` + logs | Look for specific reason in logs |
| User doesn't exist | `prisma/schema.prisma` | Run: `bunx prisma studio` |
| User has no password | Database + `scripts/create-admin.ts` | Run: `bun run scripts/create-admin.ts` |
| NextAuth errors | `.env.local` | Check `NEXTAUTH_SECRET` and `NEXTAUTH_URL` |
| Session issues | `src/lib/auth.ts` callbacks | Check JWT and session callbacks |

**Quick Fix Commands:**
```bash
# Create/recreate admin account
bun run scripts/create-admin.ts

# View users in database
bunx prisma studio

# Check environment variables
cat .env.local | grep NEXTAUTH
```

---

### 🌐 API Endpoint Errors

| Problem | File Location | Quick Check |
|---------|--------------|-------------|
| API returns 500 | `src/app/api/[route]/route.ts` | Check error logs for route |
| API returns 404 | `src/app/api/` directory | Verify file exists at route path |
| API timeout | External service config | Check ImageKit, Stripe, Resend |
| Database query fails | API route + `prisma/schema.prisma` | Run: `bunx prisma validate` |
| Missing env vars | `.env.local` + `src/lib/env.ts` | Check startup logs |

**File Pattern:**
- Route: `/api/admin/products` → File: `src/app/api/admin/products/route.ts`

**Quick Fix Commands:**
```bash
# Check which routes exist
find src/app/api -name "route.ts"

# View API error logs
bun run error-summary

# Test specific endpoint
curl http://localhost:3000/api/health
```

---

### 🗄️ Database / Prisma Issues

| Problem | File Location | Quick Check |
|---------|--------------|-------------|
| Schema out of sync | `prisma/schema.prisma` | Run: `bunx prisma db push` |
| Migration failed | `prisma/migrations/` | Check latest migration SQL |
| Can't connect to DB | `.env.local` | Check `DATABASE_URL` |
| Table doesn't exist | Supabase dashboard | Check if table exists |
| Query syntax error | API route file | Check Prisma query syntax |

**Quick Fix Commands:**
```bash
# Sync schema to database
bunx prisma db push

# Open database GUI
bunx prisma studio

# Validate schema
bunx prisma validate

# Generate Prisma client
bunx prisma generate

# Check connection
bunx prisma db pull
```

---

### 🖼️ Image Upload / Processing Errors

| Problem | File Location | Quick Check |
|---------|--------------|-------------|
| Upload fails | `src/lib/imagekit.ts` | Check ImageKit credentials |
| Images don't display | `src/components/ProductImage.tsx` | Check image URL format |
| Sync from Drive fails | `src/lib/imagekit-sync.ts` | Check Google Drive API key |
| Wrong image dimensions | Image processing logic | Check transformation params |

**Quick Fix Commands:**
```bash
# Test ImageKit connection
bun run scripts/test-imagekit.ts

# Sync images from Google Drive
bun run scripts/sync-imagekit.ts
```

---

### ⚙️ Environment Variables

| Variable | Used By | Impact if Missing |
|----------|---------|-------------------|
| `DATABASE_URL` | Prisma | App won't start, all DB operations fail |
| `NEXTAUTH_SECRET` | NextAuth | Auth completely broken |
| `NEXTAUTH_URL` | NextAuth | Redirects broken, session issues |
| `IMAGEKIT_*` | Image upload | Can't upload/display images |
| `STRIPE_*` | Payments | Checkout broken |
| `RESEND_API_KEY` | Emails | Can't send emails |
| `GOOGLE_*` | Drive sync | Can't import from Drive |

**Quick Check:**
```bash
# View all environment variables (local)
cat .env.local

# Check specific variable
echo $DATABASE_URL

# Verify all required vars are set
bun run scripts/check-env.mjs
```

**Where to Set:**
- **Local:** `.env.local` file (root directory)
- **Vercel:** Project Settings → Environment Variables
- **Production:** Always use Vercel dashboard, never commit secrets

---

### 📧 Email Sending Issues

| Problem | File Location | Quick Check |
|---------|--------------|-------------|
| Emails not sending | `src/lib/email.ts` | Check `RESEND_API_KEY` |
| Wrong email template | `src/emails/*.tsx` | Check React Email component |
| Email HTML broken | Email template file | Test with React Email dev server |

**Quick Fix Commands:**
```bash
# Test email sending
bun run scripts/test-email.ts

# View email templates
ls src/emails/
```

---

### 💳 Payment / Stripe Issues

| Problem | File Location | Quick Check |
|---------|--------------|-------------|
| Checkout fails | `src/app/api/checkout/*/route.ts` | Check Stripe keys |
| Webhook not working | `src/app/api/webhooks/stripe/route.ts` | Check webhook secret |
| Wrong pricing | `src/lib/pricing/*` | Check pricing calculation logic |

**Quick Fix Commands:**
```bash
# Test Stripe connection
node -e "require('@stripe/stripe-js').loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)"

# View webhook logs
# Go to: https://dashboard.stripe.com/webhooks
```

---

### 🏗️ Build / Deployment Errors

| Problem | File Location | Quick Check |
|---------|--------------|-------------|
| Build fails | Terminal output | Read error message carefully |
| TypeScript errors | Files mentioned in error | Fix type issues |
| Module not found | `package.json` + `node_modules/` | Run: `bun install` |
| Vercel deploy fails | Vercel dashboard logs | Check environment variables |

**Quick Fix Commands:**
```bash
# Build locally to see errors
bun run build

# Check for TypeScript errors
bunx tsc --noEmit

# Install dependencies
bun install

# Clean and rebuild
rm -rf .next node_modules
bun install
bun run build
```

---

## 🔧 Diagnostic Commands Reference

### Immediate Diagnostics
```bash
# Generate AI-ready error summary (DO THIS FIRST)
bun run error-summary

# Check last 20 errors
tail -n 20 logs/error-*.log

# Check app health
curl http://localhost:3000/api/health

# View environment variables
cat .env.local
```

### Database Diagnostics
```bash
# Open database GUI
bunx prisma studio

# Sync schema
bunx prisma db push

# Validate schema
bunx prisma validate

# Check connection
bunx prisma db pull
```

### Code Diagnostics
```bash
# TypeScript errors
bunx tsc --noEmit

# Build errors
bun run build

# Lint issues
bun run lint
```

---

## 🎯 Problem → Solution Lookup

### "I can't log in"

1. Run: `bun run error-summary`
2. Check the generated `error-summary-ai.md`
3. Look for auth failure reasons
4. Common fixes:
   - User doesn't exist → `bun run scripts/create-admin.ts`
   - No password hash → `bun run scripts/create-admin.ts`
   - Wrong password → Check your password
   - NextAuth error → Check `.env.local` for `NEXTAUTH_SECRET`

### "My API endpoint returns 500"

1. Run: `bun run error-summary`
2. Find your route in the API errors section
3. Check the specific file: `src/app/api/[your-route]/route.ts`
4. Common causes:
   - Database connection → Check `DATABASE_URL`
   - Missing env var → Check `.env.local`
   - Type error → Check TypeScript errors
   - External API timeout → Check API credentials

### "Images won't upload"

1. Check: `src/lib/imagekit.ts`
2. Verify ImageKit credentials in `.env.local`:
   - `IMAGEKIT_PUBLIC_KEY`
   - `IMAGEKIT_PRIVATE_KEY`
   - `IMAGEKIT_URL_ENDPOINT`
3. Test: `bun run scripts/test-imagekit.ts`

### "Build fails on Vercel"

1. Check Vercel deployment logs
2. Look for "Environment Variables" section
3. Ensure all required vars are set in Vercel dashboard
4. Try building locally: `bun run build`

### "Database query fails"

1. Check: `prisma/schema.prisma`
2. Run: `bunx prisma validate`
3. Sync schema: `bunx prisma db push`
4. Check Supabase dashboard for table structure

---

## 📊 Log File Structure

```
project-root/
└── logs/
    ├── *.log              # JSON logs (one entry per line)
    └── (created automatically when app runs)
```

**Log Entry Format:**
```json
{
  "level": "error",
  "msg": "Login failed: user not found",
  "time": "2025-11-18T10:30:00.000Z",
  "requestId": "req_abc123",
  "attemptedEmail": "admin@example.com",
  "route": "/api/auth/[...nextauth]"
}
```

**Production Logs (Vercel):**
- Go to: https://vercel.com/your-project/logs
- Filter by: Function, Time, Status
- Search: Use request ID from client

---

## 🚀 Quick Start Debugging Workflow

**When anything breaks, follow this exact sequence:**

```bash
# 1. Generate error summary
bun run error-summary

# 2. Review the summary
cat error-summary-ai.md

# 3. Share with AI agent
# Copy error-summary-ai.md contents and paste to Claude/Copilot

# 4. Apply AI's suggested fixes

# 5. Test the fix
bun run dev
# Try the action that failed

# 6. Verify fix worked
bun run error-summary
# Should show fewer/no errors

# 7. Deploy if fixed
git add .
git commit -m "Fix: [description]"
git push
```

**Time saved:** 30 minutes → 5 minutes

---

## 🤖 AI Agent Instructions

When sharing logs with an AI agent, always include:

1. The generated `error-summary-ai.md` file
2. What you were trying to do when it broke
3. What environment (local dev vs. production)
4. Recent changes you made

**Good AI Prompt Example:**
```
I'm getting a login error on Kollect-It. Here's my error summary:

[paste error-summary-ai.md contents]

I was trying to log in with admin@kollect-it.com.
This is on local development (bun run dev).
I just recreated the database yesterday.

Can you tell me exactly what's wrong and how to fix it?
```

---

## 📞 External Service Dashboards

When local logs aren't enough:

| Service | Dashboard URL | What to Check |
|---------|--------------|---------------|
| Vercel | https://vercel.com/dashboard | Deployment logs, env vars |
| Supabase | https://supabase.com/dashboard | Database logs, tables, queries |
| ImageKit | https://imagekit.io/dashboard | Upload logs, storage |
| Stripe | https://dashboard.stripe.com | Payment logs, webhooks |
| Resend | https://resend.com/dashboard | Email sending logs |

---

## 🎓 Learning Resources

- **Error handling code:** `src/lib/logger.ts`, `src/lib/api-error.ts`
- **Full error guide:** `docs/ERROR_HANDLING_AND_LOGGING_GUIDE.md`
- **Logging overview:** `docs/LOGGING.md`
- **Auth guide:** `docs/AUTH_GUIDE.md`

---

**Remember:** `bun run error-summary` is your first step for ANY issue. It does the heavy lifting of finding, analyzing, and formatting errors so AI can help you fix them instantly.
