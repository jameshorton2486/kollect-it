# Kollect-It Full Production Readiness Audit

**Execution Mode:** `codex --full-auto`  
**Priority:** Complete production certification  
**Scope:** Security, stability, type safety, deployment readiness

---

## OBJECTIVE

Perform a comprehensive production readiness audit of the Kollect-It codebase. Fix all issues that could cause production failures, security vulnerabilities, or deployment problems.

This is a certification audit — the goal is to confirm the app is safe to deploy and operate under real traffic.

---

## HARD RULES

```
❌ DO NOT modify prisma/schema.prisma unless absolutely unavoidable
❌ DO NOT remove or weaken authentication
❌ DO NOT expose secrets or credentials
❌ DO NOT introduce breaking API changes without explanation
❌ DO NOT refactor working code unnecessarily
```

---

## AUDIT SCOPE

### 1. API ROUTES — Security & Functionality

**Scan:** `src/app/api/**`

**Check:**
- All admin routes have `getServerSession` + role check
- User routes validate session ownership
- Prisma queries use correct PascalCase relation names
- Error handling returns proper HTTP status codes
- No secrets logged or exposed
- No unauthenticated write access

**Fix:**
- Add missing auth checks
- Fix Prisma relation name mismatches
- Normalize error responses

---

### 2. PRISMA — Schema Consistency

**Scan:** All files using `prisma.*` queries

**Canonical Relations (from schema):**
```
Product: Image, Category, Subcategory, Review, WishlistItem, CartItem, OrderItem
Order: User, OrderItem
Review: User, Product
ScheduledReport: ReportAuditLog, User
CartItem: Product, User
WishlistItem: Product, User
Category: Product, Subcategory
Subcategory: Product, Category
```

**Check:**
- No lowercase relation names (images, items, user, category, etc.)
- Property access matches include/select statements
- _count uses correct relation names
- No N+1 query patterns

**Fix:**
- Replace all lowercase relations with PascalCase
- Update downstream property access

---

### 3. AUTHENTICATION & AUTHORIZATION

**Scan:** 
- `src/app/api/admin/**`
- `src/lib/auth.ts`
- Any route with write operations

**Check:**
- Admin routes require `role === "admin"`
- User routes check `session.user.id` matches resource owner
- API-key routes (like `/api/admin/products/ingest`) handle both auth methods
- No auth logic inconsistencies

---

### 4. ENVIRONMENT VARIABLES

**Scan:**
- `.env.example`
- `src/lib/env/**`
- All `process.env` usage

**Check:**
- Required vars enforced at startup
- Optional vars don't crash app when missing
- No `NEXT_PUBLIC_` vars contain secrets
- DATABASE_URL uses pooler (port 6543)
- DIRECT_URL uses direct connection (port 5432)

---

### 5. FRONTEND RUNTIME SAFETY

**Scan:** `src/app/**/*.tsx`, `src/components/**`

**Check:**
- No `process.env` in client components (except NEXT_PUBLIC_)
- API errors handled gracefully
- Loading states present
- No hydration mismatches
- Error boundaries where appropriate

---

### 6. STRIPE & PAYMENTS

**Scan:** 
- `src/app/api/checkout/**`
- `src/app/api/webhooks/**`
- Any Stripe-related code

**Check:**
- Webhook signatures verified
- No hardcoded secrets
- Orders idempotent (no duplicate charges)
- Failed payments don't corrupt state

---

### 7. TYPE SAFETY

**Scan:** All `.ts` and `.tsx` files

**Check:**
- `npm run build` passes
- Identify `as any` usage (report, don't necessarily fix)
- No TypeScript errors suppressed
- Proper typing on API responses

---

### 8. PERFORMANCE

**Check:**
- Large queries have pagination/limits
- No blocking queries in hot paths
- Proper use of `select` to limit data fetched

---

## EXECUTION STEPS

1. Scan entire `src/` directory
2. Apply safe fixes automatically
3. Run `npx prisma generate`
4. Run `npm run build`
5. Report all findings

---

## OUTPUT FORMAT

After completion, provide:

### 1. Summary
- Total files scanned
- Issues found
- Issues fixed
- Issues deferred (with reason)

### 2. Files Modified
- List each file with brief description of changes

### 3. Remaining Risks
- Any issues that require manual review
- Architectural concerns
- Performance considerations

### 4. Verification Commands
```bash
npx prisma generate
npm run build
vercel --prod
```

### 5. Final Status
One of:
- ✅ PRODUCTION READY
- ⚠️ PRODUCTION READY WITH KNOWN RISKS (list them)
- ❌ NOT PRODUCTION READY (blocking issues listed)

---

## BEGIN AUDIT

Scan the repository and execute all checks. Apply fixes automatically where safe. Report findings comprehensively.

Start now.
