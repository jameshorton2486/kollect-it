# 🤖 AI AGENT PROMPT - KOLLECT-IT CODE FIXES

**For:** VS Code Copilot, Cursor, Windsurf, or any AI coding assistant  
**Purpose:** Implement all code-level fixes for Kollect-It marketplace  
**Runtime:** Bun (all commands use `bun` or `bunx`, NOT `npm`)  
**Expected Duration:** 30-45 minutes autonomous execution

---

## 📋 INSTRUCTIONS FOR USER

1. **Copy this entire prompt** (from this line to the end)
2. Open your AI coding assistant in VS Code (Copilot Chat, Cursor, etc.)
3. Paste this prompt
4. Let the AI agent work through all tasks
5. Review changes when complete
6. Run verification commands at the end

---

## 🎯 AI AGENT: YOUR MISSION

You are a Senior TypeScript/Next.js developer tasked with fixing critical issues in the Kollect-It marketplace codebase to prepare it for production deployment.

**Project Context:**
- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL via Prisma
- **Package Manager:** Bun (NOT npm)
- **Deployment Target:** Vercel
- **Key Services:** Stripe, ImageKit, Supabase, NextAuth

**Working Directory:** `/kollect-it-marketplace-1` (or current VS Code workspace)

**Your Objectives:**
1. Fix environment variable mismatches
2. Align code with actual `.env` structure
3. Ensure build succeeds without errors
4. Implement safe fallbacks for development mode
5. Document all changes

---

## 🔧 TASK 1: Fix ImageKit Environment Variable Names

**Problem:** Code expects `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`, but `.env.example` uses `IMAGEKIT_URL_ENDPOINT`.

### Step 1.1: Update `.env.example`

File: `.env.example`

**Find:**
```env
IMAGEKIT_URL_ENDPOINT=
```

**Replace with:**
```env
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
```

**Reason:** The client-side code needs `NEXT_PUBLIC_` prefix to access this in the browser.

### Step 1.2: Verify Code Usage

File: `src/lib/imagekit.ts`

**Ensure it reads:**
```typescript
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY; // Server-only, no NEXT_PUBLIC_
```

**If different, fix it to match above.**

### Step 1.3: Add Comment to Code

Add this comment block at the top of `src/lib/imagekit.ts`:

```typescript
/**
 * ImageKit Configuration
 * 
 * Required Environment Variables:
 * - NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: Public URL endpoint (client + server)
 * - NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: Public API key (client + server)
 * - IMAGEKIT_PRIVATE_KEY: Private key (server-only, no NEXT_PUBLIC_ prefix)
 */
```

---

## 🔧 TASK 2: Synchronize `.env.example` with Diagnostics Endpoint

**Problem:** The diagnostics endpoint expects certain env vars, but `.env.example` doesn't list them all.

### Step 2.1: Review Required Variables

File: `src/app/api/diagnostics/env/route.ts`

**Find the `requiredVars` array (around line 10-30).**

It should list:
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`

### Step 2.2: Update `.env.example`

File: `.env.example`

**Ensure ALL variables from `requiredVars` are present. Add missing ones:**

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:password@host:5432/database?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@host:5432/database"

# Authentication
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# Optional: AI Services
CLAUDE_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-...

# Optional: Admin
ADMIN_EMAIL=admin@kollect-it.com

# Optional: Site URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=
```

### Step 2.3: Add Header Comment

At the TOP of `.env.example`, add:

```env
# ============================================================================
# KOLLECT-IT MARKETPLACE - ENVIRONMENT VARIABLES
# ============================================================================
# 
# Required variables are marked with [REQUIRED]
# Optional variables are marked with [OPTIONAL]
# 
# Copy this file to .env and fill in your actual values.
# Never commit .env to git - it contains secrets!
#
# Validation: Required variables are checked by /api/diagnostics/env
# ============================================================================
```

---

## 🔧 TASK 3: Fix Stripe Configuration for Development

**Problem:** Stripe throws immediately if keys are missing, making local dev impossible.

### Step 3.1: Update `src/lib/stripe.ts`

File: `src/lib/stripe.ts`

**Find the initialization code (around lines 5-15).**

**Replace:**
```typescript
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});
```

**With:**
```typescript
// Allow development without Stripe in non-production environments
if (!process.env.STRIPE_SECRET_KEY) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable in production");
  } else {
    console.warn("[Stripe] STRIPE_SECRET_KEY not set - Stripe features disabled in development");
  }
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
  : null;

// Export a safe getter
export function getStripe() {
  if (!stripe) {
    throw new Error("Stripe not configured - check environment variables");
  }
  return stripe;
}

export default getStripe();
```

### Step 3.2: Update Client-Side Stripe

File: `src/lib/stripe-client.ts` (or wherever `getStripe` for client is defined)

**Find the publishable key check:**

**Replace:**
```typescript
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Missing publishable key");
}
```

**With:**
```typescript
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in production");
  }
  console.warn("[Stripe] Publishable key not set - payment features disabled");
  return null;
}
```

---

## 🔧 TASK 4: Fix Email Configuration Structure

**Problem:** `.env.example` uses `EMAIL_SERVER=smtp://...`, but code may expect discrete variables.

### Step 4.1: Determine Current Email Implementation

**Search the codebase for email configuration:**

```typescript
// In your terminal
rg "EMAIL_" --type typescript
```

**Identify which pattern is used:**
- Pattern A: `EMAIL_SERVER` (single URI)
- Pattern B: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` (discrete)

### Step 4.2A: If Code Uses EMAIL_SERVER

File: `.env.example`

**Keep:**
```env
# Email (optional)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@kollect-it.com
```

**In email config file (e.g., `src/lib/email.ts`):**

```typescript
export const emailConfig = {
  server: process.env.EMAIL_SERVER,
  from: process.env.EMAIL_FROM || "noreply@kollect-it.com",
};
```

### Step 4.2B: If Code Uses Discrete Variables

File: `.env.example`

**Replace EMAIL_SERVER with:**
```env
# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@kollect-it.com
EMAIL_SECURE=false
```

**In email config file:**
```typescript
export const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  from: process.env.EMAIL_FROM || "noreply@kollect-it.com",
};
```

**Choose ONE approach and make it consistent across `.env.example` and code.**

---

## 🔧 TASK 5: Add Missing Environment Variables to `.env.example`

**Problem:** Code references env vars not in `.env.example`.

### Step 5.1: Scan Codebase for Environment Variables

**Run this search:**
```bash
rg "process\.env\." --type typescript --no-heading | cut -d: -f2 | sort | uniq
```

### Step 5.2: Add Any Missing Variables to `.env.example`

**Common missing ones:**

```env
# Google Drive Integration (optional)
GOOGLE_DRIVE_FOLDER_ID=

# WebSocket (optional - for real-time features)
NEXT_PUBLIC_WS_URL=ws://localhost:3000

# Sentry (optional - error tracking)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

**Mark each as `[OPTIONAL]` or `[REQUIRED]` based on whether the code throws without them.**

---

## 🔧 TASK 6: Update Prisma postinstall Script

**Problem:** `postinstall` in `package.json` runs bare `prisma generate`, should use `bunx`.

### Step 6.1: Fix package.json

File: `package.json`

**Find:**
```json
"postinstall": "prisma generate"
```

**Replace with:**
```json
"postinstall": "bunx prisma generate"
```

**Reason:** Ensures consistency with Bun ecosystem and uses the correct CLI path.

---

## 🔧 TASK 7: Add .gitattributes for Line Endings

**Problem:** Git warns about `LF will be replaced by CRLF`.

### Step 7.1: Create `.gitattributes`

File: `.gitattributes` (create new file in project root)

**Contents:**
```
# Auto-detect text files and normalize to LF
* text=auto

# Force LF for source files
*.ts text eol=lf
*.tsx text eol=lf
*.js text eol=lf
*.jsx text eol=lf
*.json text eol=lf
*.md text eol=lf
*.css text eol=lf
*.scss text eol=lf

# Windows-specific files should use CRLF
*.bat text eol=crlf
*.ps1 text eol=crlf

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary
```

---

## 🔧 TASK 8: Update README with Quick Start

**Problem:** README doesn't explicitly warn against using npm.

### Step 8.1: Add Quick Start Section

File: `README.md`

**Add this section BEFORE the existing content (or replace existing quick start):**

```markdown
## 🚀 Quick Start

**Critical: This project uses Bun, not npm.**

### Prerequisites
- [Bun](https://bun.sh) ≥ 1.0
- [Node.js](https://nodejs.org) ≥ 18 (for compatibility)
- PostgreSQL database (we use Supabase)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/jameshorton2486/kollect-it.git
cd kollect-it

# 2. Install dependencies with Bun (NOT npm!)
bun install

# 3. Copy environment variables
cp .env.example .env
# Edit .env and fill in your actual credentials

# 4. Generate Prisma client
bunx prisma generate

# 5. Run database migrations
bunx prisma migrate deploy

# 6. Start development server
bun run dev
```

**⚠️ DO NOT RUN `npm install`** - This project is configured for Bun. Using npm will cause dependency conflicts and Prisma errors.

### Verify Installation

```bash
# Should build without errors
bun run build

# Should pass without errors
bun run typecheck
```
```

---

## 🔧 TASK 9: Create Deployment Documentation

**Problem:** Deployment process not clearly documented.

### Step 9.1: Create `docs/DEPLOYMENT.md`

File: `docs/DEPLOYMENT.md` (create new file)

**Contents:**
```markdown
# Kollect-It Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured in Vercel
- [ ] Database migrations deployed to production
- [ ] Stripe webhooks configured
- [ ] ImageKit connected and tested
- [ ] Build succeeds locally: `bun run build`
- [ ] TypeScript passes: `bun run typecheck`

## Vercel Deployment

### Initial Setup

1. Install Vercel CLI:
   ```bash
   bun add -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link project:
   ```bash
   vercel link
   ```

4. Configure environment variables:
   ```bash
   vercel env pull .env.production
   # Edit .env.production with production values
   vercel env push .env.production
   ```

### Deploy

```bash
# Preview deployment (test branch)
vercel

# Production deployment
vercel --prod
```

### Post-Deployment

1. Run database migrations:
   ```bash
   vercel env pull
   bunx prisma migrate deploy
   ```

2. Test critical flows:
   - Authentication
   - Product browsing
   - Checkout with test card
   - Admin panel access

3. Monitor logs:
   ```bash
   vercel logs --follow
   ```

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all environment variables are set
- Test locally: `bun run build`

### Database Connection Fails
- Verify DATABASE_URL in Vercel environment
- Check Supabase project status
- Test connection: `bunx prisma db pull`

### Stripe Webhook Fails
- Verify webhook endpoint is accessible
- Check Stripe dashboard logs
- Ensure STRIPE_WEBHOOK_SECRET is correct

## Rollback

If deployment has critical issues:

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```
```

---

## 🔧 TASK 10: Clean Up Legacy Automation Files

**Problem:** Root-level PowerShell scripts are outdated and confusing.

### Step 10.1: Create Archive Directory

```bash
mkdir -p archive/legacy-automation
```

### Step 10.2: Move Legacy Files

**Move these files to `archive/legacy-automation/`:**
- `00-MASTER-DEPLOYMENT-PREP.ps1`
- `01-SCAN-TSX-FILES.ps1`
- `02-EXTRACT-TSX-CONTENTS.ps1`
- `03-ANALYZE-COLOR-COMPLIANCE.ps1`
- Any other `.ps1` files that aren't `MASTER-FIX.ps1`

```bash
mv 00-MASTER-DEPLOYMENT-PREP.ps1 archive/legacy-automation/
mv 01-SCAN-TSX-FILES.ps1 archive/legacy-automation/
mv 02-EXTRACT-TSX-CONTENTS.ps1 archive/legacy-automation/
mv 03-ANALYZE-COLOR-COMPLIANCE.ps1 archive/legacy-automation/
```

### Step 10.3: Create Archive README

File: `archive/legacy-automation/README.md`

**Contents:**
```markdown
# Legacy Automation Scripts

These PowerShell scripts were used during initial development and color refactoring.

**Status:** Archived - No longer maintained  
**Date Archived:** 2025-11-17

For current automation, use:
- `MASTER-FIX.ps1` (in project root)
- `MANUAL-CHECKLIST.md` (in outputs/)
- `AI-AGENT-PROMPT.md` (in outputs/)

## Contents

- `00-MASTER-DEPLOYMENT-PREP.ps1` - Original deployment prep
- `01-SCAN-TSX-FILES.ps1` - TSX file scanner
- `02-EXTRACT-TSX-CONTENTS.ps1` - Content extractor
- `03-ANALYZE-COLOR-COMPLIANCE.ps1` - Color system analyzer

These are kept for historical reference only.
```

---

## ✅ VERIFICATION COMMANDS

After completing all tasks, run these commands to verify everything works:

```bash
# 1. TypeScript compilation
bunx tsc --noEmit
# Expected: No errors

# 2. Linting
bunx eslint . --max-warnings=0
# Expected: No errors or warnings

# 3. Prisma client generation
bunx prisma generate
# Expected: "Prisma Client generated"

# 4. Build
bun run build
# Expected: "Compiled successfully"

# 5. Environment diagnostics (if endpoint exists)
bun run dev
# In another terminal:
curl http://localhost:3000/api/diagnostics/env
# Expected: JSON response with status 200 or 206
```

---

## 📊 COMPLETION REPORT

**After completing all tasks, create a summary:**

File: `AI-AGENT-COMPLETION-REPORT.md` (create in project root)

**Template:**
```markdown
# AI Agent Completion Report

**Date:** [Current Date]  
**Agent:** [Your AI Assistant Name]  
**Duration:** [Time taken]

## Tasks Completed

- [x] Task 1: ImageKit environment variable names
- [x] Task 2: Synchronized .env.example with diagnostics
- [x] Task 3: Fixed Stripe development mode
- [x] Task 4: Fixed email configuration
- [x] Task 5: Added missing environment variables
- [x] Task 6: Updated Prisma postinstall script
- [x] Task 7: Added .gitattributes
- [x] Task 8: Updated README Quick Start
- [x] Task 9: Created deployment documentation
- [x] Task 10: Archived legacy automation

## Verification Results

- TypeScript typecheck: ✅ PASS / ❌ FAIL
- ESLint: ✅ PASS / ❌ FAIL
- Prisma generate: ✅ PASS / ❌ FAIL
- Build: ✅ PASS / ❌ FAIL

## Issues Encountered

[List any issues or blockers encountered]

## Next Steps for Human

1. Review all changes made by AI agent
2. Complete MANUAL-CHECKLIST.md tasks
3. Test locally: `bun run dev`
4. Deploy to Vercel when ready

## Files Modified

[List all files created or modified]

## Notes

[Any additional notes or recommendations]
```

---

## 🎯 END OF AI AGENT INSTRUCTIONS

**Human:** Review the completion report, test the application, and proceed with manual deployment steps in `MANUAL-CHECKLIST.md`.
