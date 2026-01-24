# Kollect-It Complete Production Setup & Audit Guide

> **One document to rule them all.** Database setup, CLI tools, and production audit in one place.

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Part 1: Fix DATABASE_URL](#part-1-fix-database_url)
3. [Part 2: Supabase CLI Setup](#part-2-supabase-cli-setup)
4. [Part 3: Cursor CLI Setup](#part-3-cursor-cli-setup)
5. [Part 4: Production Audit](#part-4-production-audit)
6. [Part 5: Your Pending Git Files](#part-5-your-pending-git-files)
7. [Part 6: Commit & Deploy](#part-6-commit--deploy)

---

## Quick Reference

### Commands You'll Use Most

```powershell
# Open project in Cursor
cd C:\Users\james\kollect-it
cursor .

# Test database connection
npx prisma db pull

# Run TypeScript check
npx tsc --noEmit

# Build for production
npm run build

# Generate Prisma types
npx prisma generate
```

---

## Part 1: Fix DATABASE_URL

### Step 1: Get Your Supabase Connection Strings

1. Go to **[supabase.com/dashboard](https://supabase.com/dashboard)**
2. Click your **Kollect-It project**
3. Click **Settings** → **Database**
4. Scroll to **Connection string** → **URI** tab

You need **TWO** URLs:

| Type | Port | Toggle Setting |
|------|------|----------------|
| **Transaction (Pooler)** | `6543` | Mode: "Transaction" |
| **Session (Direct)** | `5432` | Mode: "Session" |

### Step 2: Edit `.env.local`

Open in Notepad:
```
C:\Users\james\kollect-it\.env.local
```

Add/update these lines:

```env
# Pooled connection (port 6543) - for app queries
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (port 5432) - for Prisma migrations
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

**Replace:**
- `[PROJECT-REF]` → Your project reference (e.g., `abcd1234efgh`)
- `[PASSWORD]` → Your database password

### Step 3: Test the Connection

```powershell
cd C:\Users\james\kollect-it
npx prisma db pull
```

✅ **Success:** Shows your schema
❌ **Failure:** Check password and project reference

### Alternative: Use Your Existing Script

You already have a helper script:

```powershell
npx tsx scripts/generate-direct-url.ts
```

This will:
1. Read your existing `DATABASE_URL`
2. Generate the correct `DIRECT_URL`
3. Optionally add it to `.env.local` automatically

---

## Part 2: Supabase CLI Setup

### What Supabase CLI Can Do

| Command | Purpose |
|---------|---------|
| `supabase projects list` | List your projects |
| `supabase db pull` | Pull remote schema |
| `supabase db push` | Push migrations |
| `supabase gen types typescript` | Generate TypeScript types |

### What It Can't Do

- Retrieve your database password
- Get your connection string (must use dashboard)
- Interactive browser login (in automated environments)

### Install Supabase CLI

```powershell
# Option 1: npm (recommended)
npm install -g supabase

# Option 2: Scoop (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Authenticate with Access Token

1. Go to [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
2. Click **Generate new token**
3. Name it "Kollect-It CLI"
4. Copy the token

```powershell
# Login with token
supabase login --token YOUR_ACCESS_TOKEN

# Verify it works
supabase projects list
```

### Link Your Project

```powershell
cd C:\Users\james\kollect-it
supabase link --project-ref YOUR_PROJECT_REF
```

### Generate TypeScript Types

```powershell
supabase gen types typescript --linked > src/types/supabase.ts
```

---

## Part 3: Cursor CLI Setup

### Verify Installation

```powershell
if (Get-Command cursor -ErrorAction SilentlyContinue) { 
    Write-Host "✅ Cursor CLI is ready" -ForegroundColor Green 
} else { 
    Write-Host "❌ Cursor CLI not found" -ForegroundColor Red
    Write-Host "Fix: Open Cursor → Ctrl+Shift+P → 'Shell Command: Install cursor command in PATH'" -ForegroundColor Yellow 
}
```

### Install if Missing

1. Open Cursor IDE
2. Press `Ctrl + Shift + P`
3. Type: `Shell Command: Install 'cursor' command in PATH`
4. Press Enter
5. Restart PowerShell

### Basic Usage

```powershell
# Open current folder in Cursor
cursor .

# Open specific file
cursor src/app/page.tsx

# Open in new window
cursor . --new-window
```

---

## Part 4: Production Audit

### How to Run the Audit

1. **Open Cursor:**
   ```powershell
   cd C:\Users\james\kollect-it
   cursor .
   ```

2. **Press `Ctrl + L`** to open Chat panel

3. **Type `@Codebase`** then paste this prompt:

```markdown
@Codebase

# Role: Senior Full-Stack Engineer & Security Auditor
# Task: Kollect-It Production-Readiness Audit

Perform a comprehensive "Go-Live" audit on this Next.js marketplace codebase.

---

## 1. SECURITY AUDIT

### Exposed Secrets
- Scan ALL `.ts`, `.tsx`, `.js` files for hardcoded API keys, passwords, tokens
- Verify NO secrets in git-tracked files
- Cross-reference `.env.example` with actual `process.env` usage
- Flag any undocumented environment variables

### Authentication
- Review NextAuth config in `src/app/api/auth/`
- Verify admin routes require authentication
- Check session validation on protected endpoints
- Audit middleware for proper route protection

### API Security
- Check all routes in `src/app/api/` for:
  - Input validation
  - Error handling
  - Rate limiting
  - CORS configuration

---

## 2. DATABASE AUDIT

### Prisma/Supabase
- Verify `schema.prisma` is production-ready
- Check for missing indexes on frequently queried fields
- Flag N+1 query patterns
- Verify draft products are filtered from public queries

### Data Integrity
- Verify SKU uniqueness enforcement
- Check cascade delete configurations
- Validate foreign key relationships

---

## 3. CODE QUALITY

### Incomplete Code
- Find all TODO, FIXME, HACK comments
- Identify empty function bodies
- Flag stub implementations
- List console.log statements to remove

### Dead Code
- Unused imports
- Unreachable code blocks
- Commented-out code
- Unused utility functions

### Critical Flows to Trace
1. Product creation → draft → publish
2. User registration → email verification
3. Checkout → Stripe payment → order creation
4. Desktop app → API → database sync

---

## 4. SPECIFIC FILES TO AUDIT

Check these files from current git status:
- `scripts/cleanup-test-data.ts` - Has dry-run mode?
- `scripts/add-database-url.ts` - Logs sensitive data?
- `.github/workflows/domain-guardrails.yml` - Valid syntax?

---

## OUTPUT FORMAT

### 🔴 CRITICAL (Must fix before launch)
List each issue with file:line and fix

### 🟡 WARNING (Should fix soon)
List each issue with file:line and fix

### 🟢 OPTIMIZATION (Nice to have)
List improvements

### ✅ PASSED CHECKS
List what looks good

Provide copy-paste code fixes for all CRITICAL issues.
```

4. **Wait 1-2 minutes** for full scan

### Quick Health Checks (PowerShell)

```powershell
# Find TODO/FIXME comments
Select-String -Path "src/**/*.ts","src/**/*.tsx" -Pattern "TODO|FIXME|HACK" -Recurse

# Find console.log statements
Select-String -Path "src/**/*.ts","src/**/*.tsx" -Pattern "console\.log" -Recurse

# Check TypeScript errors
npx tsc --noEmit

# Validate Prisma schema
npx prisma validate

# Test production build
npm run build
```

---

## Part 5: Your Pending Git Files

Based on your git status, here's what needs attention:

### File: `scripts/cleanup-test-data.ts`
**Status:** Staged
**Risk:** ⚠️ Medium

**Check for:**
- [ ] Has a `--dry-run` flag to preview deletions
- [ ] Requires confirmation before deleting
- [ ] Only targets test/demo data, not production
- [ ] Logs what it deletes for audit trail

### File: `scripts/add-database-url.ts`
**Status:** Untracked
**Risk:** ⚠️ High

**Check for:**
- [ ] Does NOT log passwords to console
- [ ] Does NOT write credentials to log files
- [ ] Validates input before using
- [ ] Uses environment variables, not hardcoded values

### File: `.github/workflows/domain-guardrails.yml`
**Status:** Modified
**Risk:** 🟡 Low

**Current Status:** ✅ I reviewed this file - syntax is valid

The workflow checks for:
- Raw image exposure
- Multiple image ingestion endpoints
- SKU mutation
- Merge conflict markers

**Triggers:** On push to `main` and all pull requests

### File: `docs/UI_UX_CONSISTENCY_AUDIT_PROMPT.md`
**Status:** Untracked
**Risk:** 🟢 None - documentation only

**Action:** Add to repo or `.gitignore`

---

## Part 6: Commit & Deploy

### Pre-Commit Checklist

```powershell
# 1. Run TypeScript check
npx tsc --noEmit

# 2. Run linter
npm run lint

# 3. Test build
npm run build

# 4. Validate Prisma
npx prisma validate
```

### Create a Feature Branch

```powershell
# Create branch with today's date
$date = Get-Date -Format "yyyyMMdd"
git checkout -b fix/production-audit-$date
```

### Stage Files Selectively

```powershell
# Interactive staging (review each change)
git add -p

# Or stage specific files
git add scripts/cleanup-test-data.ts
git add .github/workflows/domain-guardrails.yml
```

### Commit with Clear Messages

Use conventional commit format:

```powershell
# Security fixes
git commit -m "security: add input validation to API routes"

# Bug fixes
git commit -m "fix: filter draft products from public queries"

# New features
git commit -m "feat: add dry-run mode to cleanup script"

# Maintenance
git commit -m "chore: update GitHub Actions workflow"

# Documentation
git commit -m "docs: add UI consistency audit prompt"
```

### Push and Create PR

```powershell
# Push to remote
git push -u origin fix/production-audit-$(Get-Date -Format "yyyyMMdd")

# Then create PR on GitHub
```

### After PR Merge - Deploy

```powershell
# Switch to main
git checkout main
git pull origin main

# Vercel auto-deploys from main, but you can force:
vercel --prod
```

---

## Appendix: Your Existing Scripts

You already have production-readiness scripts. Use them:

| Script | Purpose | Run With |
|--------|---------|----------|
| `verify-production-readiness.ps1` | Full check | `.\scripts\verify-production-readiness.ps1` |
| `pre-deploy-check.ps1` | Pre-deployment | `.\scripts\pre-deploy-check.ps1` |
| `test-db-connection.ts` | DB test | `npx tsx scripts/test-db-connection.ts` |
| `check-env.ts` | Env validation | `npx tsx scripts/check-env.ts` |
| `verify-env.ts` | Full env check | `npx tsx scripts/verify-env.ts` |
| `health-check.ts` | Health check | `npx tsx scripts/health-check.ts` |

### Run Full Pre-Deployment Check

```powershell
cd C:\Users\james\kollect-it
.\scripts\pre-deploy-check.ps1
```

---

## Emergency Procedures

### If You Accidentally Commit Secrets

You have a script for this:

```powershell
.\scripts\maintenance\EMERGENCY-REMOVE-CREDENTIALS-FROM-HISTORY.ps1
```

### If Build Fails

```powershell
# Clean and rebuild
.\scripts\clean-build.ps1

# Or manually:
Remove-Item -Recurse -Force .next, node_modules\.cache -ErrorAction SilentlyContinue
npm run build
```

### If Database Connection Fails

```powershell
# Test connection
npx tsx scripts/test-db-connection.ts

# Check both connection types
npx tsx scripts/test-both-connections.ts

# Diagnose issues
npx tsx scripts/diagnose-database.ts
```

---

*Generated for Kollect-It - January 2025*
*Save this file to: `C:\Users\james\kollect-it\docs\PRODUCTION-SETUP-GUIDE.md`*
