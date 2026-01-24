# Kollect-It Production Audit & Setup - Complete Codex Prompt

> **Copy and paste this entire prompt into Codex CLI or Cursor Chat with @Codebase**

---

## INSTRUCTIONS FOR CODEX

You are a Senior Full-Stack Engineer performing a production-readiness audit and setup for Kollect-It, a luxury antiques marketplace built with Next.js 15, Prisma, Supabase, and Stripe.

Execute ALL of the following tasks in order:

---

## TASK 1: ENVIRONMENT SETUP

### 1.1 Verify Required Files Exist

Check that these new scripts exist in the `scripts/` folder:
- `scripts/add-database-url.ts`
- `scripts/cleanup-test-data.ts`

If they don't exist, report this and stop - the user needs to run the file installation script first.

### 1.2 Verify Environment Configuration

Check `.env.local` for required variables:

```
DATABASE_URL      - Should use port 6543 (pooled)
DIRECT_URL        - Should use port 5432 (direct)
NEXTAUTH_URL      - Should be http://localhost:3000 for local
NEXTAUTH_SECRET   - Must be at least 32 characters
STRIPE_SECRET_KEY - Should start with sk_test_ or sk_live_
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - Should start with pk_test_ or pk_live_
IMAGEKIT_PRIVATE_KEY - Required for image uploads
PRODUCT_INGEST_API_KEY - Required for desktop app sync
```

For each missing or misconfigured variable:
1. Report the issue
2. Explain how to fix it
3. Do NOT log actual values (security)

### 1.3 Test Database Connection

Run:
```bash
npx prisma validate
npx prisma db pull --print
```

Report any connection errors with suggested fixes.

---

## TASK 2: SECURITY AUDIT

### 2.1 Scan for Exposed Secrets

Search ALL files for hardcoded credentials:

```bash
# API keys
grep -r "sk_live_" --include="*.ts" --include="*.tsx" --include="*.js" src/
grep -r "sk_test_" --include="*.ts" --include="*.tsx" --include="*.js" src/
grep -r "pk_live_" --include="*.ts" --include="*.tsx" --include="*.js" src/

# Database passwords
grep -r "postgresql://.*:.*@" --include="*.ts" --include="*.tsx" src/

# Generic patterns
grep -rE "(password|secret|apikey|api_key)\s*[:=]\s*['\"][^'\"]+['\"]" --include="*.ts" --include="*.tsx" src/
```

**CRITICAL**: If ANY secrets are found in code files, report them as CRITICAL issues.

### 2.2 Audit Authentication

Check these files for proper auth protection:

1. `src/app/admin/*` - ALL admin routes must check for admin role
2. `src/app/api/admin/*` - ALL admin API routes must verify session
3. `src/middleware.ts` - Must protect /admin routes

Look for patterns like:
```typescript
// GOOD - Protected
if (session?.user?.role !== 'admin') {
  return redirect('/login');
}

// BAD - Unprotected
export default function AdminPage() {
  // No auth check
}
```

### 2.3 Audit API Routes

For each file in `src/app/api/`:
- Check for input validation
- Check for proper error handling (try/catch)
- Check for rate limiting on sensitive endpoints
- Verify authentication where required

Report any unprotected sensitive endpoints.

### 2.4 Check Draft Product Filtering

Verify that public queries filter out draft products:

Search for Prisma queries that should exclude drafts:
```typescript
// GOOD
where: { isDraft: false, status: 'active' }

// BAD - Exposes draft products
where: { status: 'active' } // Missing isDraft check
```

Files to check:
- `src/app/shop/page.tsx`
- `src/app/browse/page.tsx`
- `src/app/category/[slug]/page.tsx`
- `src/app/search/page.tsx`
- `src/app/api/products/route.ts`

---

## TASK 3: CODE QUALITY AUDIT

### 3.1 Find Incomplete Code

```bash
# Find TODO/FIXME comments
grep -rn "TODO\|FIXME\|HACK\|XXX" --include="*.ts" --include="*.tsx" src/

# Find empty function bodies
grep -rn "() => {}" --include="*.ts" --include="*.tsx" src/
grep -rn "{\s*}" --include="*.ts" --include="*.tsx" src/app/api/
```

Report all findings with file:line references.

### 3.2 Find Console Statements

```bash
grep -rn "console.log\|console.error\|console.warn" --include="*.ts" --include="*.tsx" src/
```

List all console statements that should be removed for production.

### 3.3 Check for Unused Imports

Run TypeScript compiler to find issues:
```bash
npx tsc --noEmit 2>&1 | grep -E "is declared but|is defined but never used"
```

### 3.4 Verify Build Success

```bash
npm run build
```

Report any build errors with suggested fixes.

---

## TASK 4: DATABASE AUDIT

### 4.1 Validate Prisma Schema

```bash
npx prisma validate
```

### 4.2 Check for Missing Indexes

Review `prisma/schema.prisma` and suggest indexes for:
- Foreign key fields without indexes
- Fields used in WHERE clauses frequently
- Fields used in ORDER BY clauses

### 4.3 Check N+1 Query Patterns

Search for potential N+1 queries:
```typescript
// BAD - N+1 pattern
const products = await prisma.product.findMany();
for (const product of products) {
  const images = await prisma.image.findMany({ where: { productId: product.id } });
}

// GOOD - Include relation
const products = await prisma.product.findMany({
  include: { images: true }
});
```

---

## TASK 5: DESIGN SYSTEM CONSISTENCY

### 5.1 Find Non-Standard Color Classes

```bash
# Find gray classes that should be lux-* tokens
grep -rn "text-gray-" --include="*.tsx" src/
grep -rn "bg-gray-" --include="*.tsx" src/
grep -rn "border-gray-" --include="*.tsx" src/
```

### 5.2 Replacement Mappings

Apply these replacements:
| Find | Replace With |
|------|--------------|
| `text-gray-300` | `text-lux-gray-light` |
| `text-gray-400` | `text-lux-gray-light` |
| `text-gray-500` | `text-lux-gray` |
| `text-gray-600` | `text-ink-600` |
| `text-gray-700` | `text-lux-gray-dark` |
| `text-gray-800` | `text-lux-black` |
| `text-gray-900` | `text-lux-black` |
| `bg-gray-50` | `bg-lux-pearl` |
| `bg-gray-100` | `bg-lux-cream` |
| `bg-gray-800` | `bg-surface-900` |
| `bg-gray-900` | `bg-lux-charcoal` |

---

## TASK 6: CRITICAL FLOW VERIFICATION

### 6.1 Product Flow
Trace the product lifecycle:
1. Desktop app creates draft via `/api/products/ingest`
2. Admin reviews in `/admin/products`
3. Admin publishes (sets `isDraft: false`)
4. Product appears in shop

Verify each step has proper error handling.

### 6.2 Authentication Flow
Verify:
1. Registration creates user with hashed password
2. Login validates credentials properly
3. Session persists correctly
4. Protected routes redirect unauthenticated users

### 6.3 Checkout Flow
Verify:
1. Cart items validate product availability
2. Stripe payment intent created correctly
3. Order created on successful payment
4. Inventory/status updated post-purchase

---

## TASK 7: GITHUB WORKFLOW VALIDATION

### 7.1 Validate Workflow Syntax

Check `.github/workflows/domain-guardrails.yml`:
```bash
# Validate YAML syntax
cat .github/workflows/domain-guardrails.yml | head -50
```

Verify:
- Proper `on:` triggers
- Valid `runs-on:` values
- Correct step syntax

---

## OUTPUT FORMAT

Provide your findings in this structure:

### 🔴 CRITICAL ISSUES (Must Fix Before Launch)

For each critical issue:
```
FILE: path/to/file.ts:LINE
ISSUE: Description of the problem
FIX: Exact code or command to fix it
```

### 🟡 WARNINGS (Should Fix Soon)

For each warning:
```
FILE: path/to/file.ts:LINE
ISSUE: Description
RECOMMENDATION: How to fix
```

### 🟢 OPTIMIZATIONS (Nice to Have)

For each optimization:
```
FILE: path/to/file.ts
SUGGESTION: What could be improved
```

### ✅ PASSED CHECKS

List everything that passed inspection.

### 📋 COMMANDS TO RUN

Provide a sequential list of commands to fix all issues:

```powershell
# 1. Fix critical security issue
# Command here

# 2. Fix authentication
# Command here

# etc.
```

---

## AFTER AUDIT: COMMIT WORKFLOW

Once all critical issues are fixed, provide commit commands:

```powershell
# Create feature branch
git checkout -b fix/production-audit-YYYYMMDD

# Stage security fixes
git add [files]
git commit -m "security: [description]"

# Stage bug fixes
git add [files]
git commit -m "fix: [description]"

# Stage cleanup
git add [files]
git commit -m "chore: [description]"

# Push for PR
git push -u origin fix/production-audit-YYYYMMDD
```

---

## IMPORTANT RULES

1. **NEVER log or display actual passwords, API keys, or secrets**
2. **Create backups before modifying any file**
3. **Test changes don't break the build before committing**
4. **Use atomic commits - one logical change per commit**
5. **Prioritize stability over aesthetic improvements**

---

*End of Codex Prompt*
