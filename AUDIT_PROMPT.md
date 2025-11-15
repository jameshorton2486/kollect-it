# KOLLECT-IT MARKETPLACE - FULL CODEBASE AUDIT

You are analyzing the **Kollect-It marketplace** codebase located in this repository.

## OBJECTIVE

Perform a comprehensive, automated analysis of the entire Kollect-It marketplace codebase. Identify issues, inefficiencies, security risks, and optimization opportunities. Provide actionable recommendations with specific file paths and line numbers.

## ANALYSIS SCOPE

### 1. CONFIGURATION & ENVIRONMENT

**Environment Variables**

- Compare `.env.local`, `.env.example`, `.env.production`, and any env documentation files.
- Identify missing, unused, or improperly configured environment variables.
- Check for hardcoded secrets or API keys in tracked files.
- Verify all required env vars are documented with examples.
- Flag any environment variables used in code but not defined in env files.
- Check for database connection strings, API keys (Stripe, ImageKit, Google), and auth secrets.

**Git & Version Control**

- Review `.gitignore` for completeness (node_modules, .env\*, build outputs, .next, etc.).
- Identify tracked files that should be ignored (env files, secrets, build artifacts).
- Detect duplicate or conflicting gitignore rules.
- Check for sensitive files in git history (even if now ignored).

**Dependencies**

- Scan `package.json` for unused dependencies (installed but never imported).
- Identify outdated packages with security vulnerabilities.
- Flag peer dependency warnings or conflicts.
- Check for duplicate dependencies or multiple versions of the same package.
- Verify Next.js 15 compatibility of all dependencies.
- Check for deprecated packages (e.g., node-fetch when native fetch is available).

---

### 2. CODE QUALITY & STRUCTURE

**Unused Code**

- Identify unused imports across all TypeScript/JavaScript files.
- Find unused functions, variables, types, and interfaces.
- Detect unreachable code or dead branches.
- Locate commented-out code blocks (>10 lines).
- Find unused React components (not imported or rendered anywhere).
- Identify unused API routes.

**Duplicate Code**

- Find duplicate functions or logic blocks (>15 lines).
- Identify repeated API calls or database queries.
- Detect duplicate component patterns.
- Flag copy-pasted utility functions that should be centralized.
- Check for duplicate type definitions.

**File Organization**

- List files in wrong directories (components in utils, etc.).
- Identify orphaned files (not imported anywhere).
- Find empty or nearly-empty files that can be deleted.
- Check for inconsistent naming conventions (camelCase vs kebab-case).
- Verify proper App Router structure (`app/` directory with proper layout/page hierarchy).
- Check for leftover Pages Router files if migrated to App Router.

---

### 3. DATABASE & PRISMA

**Schema Issues**

- Review `prisma/schema.prisma` for:
  - Unused models or fields.
  - Missing indexes on frequently queried fields (userId, productId, status, createdAt).
  - Incorrect relationships or cascading rules.
  - Models that don't match actual database usage.
  - Missing unique constraints.
  - Improper field types (String vs Text for long content).
- Check for migrations that need to be applied or cleaned up (review prisma/migrations).
- Verify database provider configuration (PostgreSQL for Supabase).

**Query Optimization**

- Identify N+1 query problems (queries in loops).
- Find missing `include` or `select` statements causing over-fetching.
- Detect queries without pagination on large datasets.
- Flag raw SQL queries that could be replaced by Prisma.
- Check for missing connection pooling configuration.
- Review transaction usage (proper use of $transaction).

---

### 4. SECURITY & BEST PRACTICES

**Security Vulnerabilities**

- Check for exposed API keys or secrets in code.
- Identify missing authentication checks on API routes (especially admin routes).
- Review file upload handling for security issues (file type validation, size limits).
- Check for SQL injection vulnerabilities (in raw queries).
- Verify CORS and CSP configurations where applicable.
- Check NextAuth configuration and session handling.
- Review rate limiting on API routes (especially checkout, auth).
- Verify input validation on all forms and API endpoints.
- Check for XSS vulnerabilities in user-generated content.

**Error Handling**

- Find try-catch blocks without proper error logging.
- Identify unhandled promise rejections.
- Check for missing error boundaries in React components.
- Review API routes for consistent error responses.
- Verify error messages don't leak sensitive information.

**Authentication & Authorization**

- Check that protected routes have proper auth middleware.
- Verify admin-only routes are properly secured.
- Review session management and token handling.
- Check for role-based access control implementation.

---

### 5. PERFORMANCE & OPTIMIZATION

**Bundle Size**

- Identify large dependencies that could be replaced.
- Find unused exported functions from libraries.
- Check for dynamic imports that should be code-split.
- Review image optimization usage (`next/image`, ImageKit, etc.).
- Check for client-side libraries imported in Server Components.

**React Optimization**

- Find missing `key` props in list renders.
- Identify components that should be memoized (React.memo).
- Check for inline function definitions in render methods.
- Review `useEffect` dependencies for bugs and unnecessary re-renders.
- Check for useState overuse where useReducer would be better.

**Next.js 15 Specific Performance**

- Verify proper use of Server Components (default) vs Client Components.
- Check for unnecessary `'use client'` directives.
- Review loading.tsx and error.tsx implementations.
- Check for proper metadata exports (no dynamic metadata in Client Components).
- Verify proper use of Suspense boundaries.
- Check for streaming optimization opportunities.

---

### 6. NEXT.JS 15 APP ROUTER ISSUES

**App Router Structure**

- Verify proper layout.tsx hierarchy (root layout, nested layouts).
- Check that page.tsx files are in correct directories.
- Review route groups usage (proper (group) syntax).
- Check for proper dynamic routes ([slug], [id], etc.).
- Verify catch-all routes ([[...slug]]) are used correctly.

**Server vs Client Components**

- Ensure Server Components are used by default (no unnecessary 'use client').
- Verify Client Components have 'use client' directive at top of file.
- Check that Server Components don't use client-side hooks (useState, useEffect, etc.).
- Verify Client Components don't import Server Components.
- Check for proper data fetching in Server Components (async components).

**Metadata & SEO**

- Check that all pages have proper metadata exports.
- Verify Open Graph and Twitter card metadata.
- Check for dynamic metadata using generateMetadata function.
- Verify proper title and description on all pages.

**Images & Assets**

- Verify all images use next/image component (not <img>).
- Check for proper image optimization (width, height, priority, quality).
- Review public/ folder for unused images.
- Verify ImageKit CDN integration is used consistently.

**API Routes (Route Handlers)**

- Check that API routes are in app/api/ directory with route.ts naming.
- Verify proper HTTP methods (GET, POST, PUT, DELETE).
- Check for proper error handling and status codes.
- Verify response format consistency (JSON).

---

### 7. TYPESCRIPT & TYPE SAFETY

**Type Issues**

- Find `any` types that should be properly typed.
- Identify type assertions (`as`) that might hide bugs.
- Check for missing return types on functions.
- Review interfaces vs types usage consistency.
- Check for proper Prisma client types usage.
- Verify proper typing of API responses.

**Type Organization**

- Check for duplicate type definitions.
- Verify types are properly exported and imported.
- Check for centralized type definitions vs scattered types.
- Review proper use of TypeScript utility types (Partial, Pick, Omit, etc.).

---

### 8. DOCUMENTATION & MAINTENANCE

**Code Documentation**

- Identify complex functions without comments.
- Check for outdated TODO/FIXME comments.
- Review README accuracy against actual codebase.
- Flag API routes without JSDoc comments or equivalent documentation.
- Check for proper component prop documentation (TypeScript interfaces).

**README & Setup Docs**

- Verify installation instructions are current.
- Check environment variable documentation.
- Review deployment instructions.
- Check for accurate script descriptions in package.json.

---

### 9. KOLLECT-IT SPECIFIC CHECKS

**Business Logic**

- Review product listing logic (authentication, validation).
- Check cart and checkout implementation (Stripe integration).
- Verify seller dashboard functionality.
- Review admin panel access controls.
- Check email notification system (SMTP configuration).

**Integrations**

- Verify Stripe integration (production vs test keys).
- Check ImageKit CDN configuration.
- Review Supabase/Prisma connection.
- Verify NextAuth configuration.
- Check Google Workspace email integration.

---

## OUTPUT FORMAT

For each category, provide:

1. **Summary Statistics**
   - Count of issues found.
   - Severity rating (Critical/High/Medium/Low).

2. **Detailed Findings**
   - Specific file paths and line numbers.
   - Clear description of the issue.
   - Impact assessment.

3. **Actionable Recommendations**
   - Specific fix or deletion instructions.
   - Priority ranking.
   - Estimated time to fix.

4. **Quick Wins Section**
   - List of files that can be safely deleted immediately.
   - Simple fixes that take <5 minutes each.
   - Low-risk optimizations.

5. **Automated Cleanup Notes**
   - Which issues can be safely addressed automatically.
   - Which require manual or domain knowledge review.

---

## OUTPUT FILE STRUCTURE

Write audit results to these files:

### `/audit-output/AUDIT_SUMMARY.md`

- Executive summary with counts by severity
- Top 10 critical issues
- Quick wins list
- Estimated total time to fix all issues

### `/audit-output/reports/HIGH/SECURITY_AUDIT.md`

- Exposed secrets or API keys
- Missing authentication on sensitive routes
- Input validation issues
- CORS/CSP misconfigurations
- Database security issues

### `/audit-output/reports/MEDIUM/CODE_QUALITY.md`

- Unused code (imports, functions, components)
- Duplicate code
- File organization issues
- Naming convention inconsistencies
- Orphaned files

### `/audit-output/reports/MEDIUM/PERFORMANCE_AUDIT.md`

- Bundle size issues
- Image optimization problems
- React optimization opportunities
- Next.js 15 performance issues (Server vs Client components)
- Database query optimization

### `/audit-output/reports/MEDIUM/DATABASE_AUDIT.md`

- Prisma schema issues
- Missing indexes
- N+1 query problems
- Query optimization opportunities
- Migration issues

### `/audit-output/reports/MEDIUM/TYPESCRIPT_AUDIT.md`

- `any` types to fix
- Missing return types
- Type assertion issues
- Type organization problems

### `/audit-output/reports/LOW/DOCUMENTATION_AUDIT.md`

- Missing code comments
- Outdated TODO/FIXME
- README inaccuracies
- Missing API documentation

### `/audit-output/AUTOMATED_FIXES_LOG.md`

- List of fixes that can be automated
- List of fixes requiring manual review
- Proposed script changes

---

## EXECUTION INSTRUCTIONS

1. Start with a complete directory tree overview.
2. Analyze files systematically by the categories above.
3. Cross-reference findings (e.g., unused imports in files that are never imported).
4. Prioritize critical issues (security, breaking bugs).
5. Group related issues for batch fixing.
6. Write results into the specified output files.

---

## SEVERITY DEFINITIONS

**CRITICAL (Immediate Action Required)**

- Exposed secrets or API keys
- Missing authentication on admin routes
- Database queries that could cause data loss
- Security vulnerabilities with known exploits

**HIGH (Fix Before Production Deploy)**

- Missing input validation
- Unhandled errors in critical paths
- Performance issues causing >5s load times
- Missing error boundaries

**MEDIUM (Fix During Development)**

- Code quality issues (unused code, duplicates)
- TypeScript any types
- Missing documentation
- Non-critical performance optimizations

**LOW (Nice to Have)**

- Outdated comments
- Naming convention inconsistencies
- Minor documentation gaps

---

## CRITICAL REQUIREMENTS

- Be specific: Always include file paths and line numbers when possible.
- Be actionable: Every issue should have a clear fix.
- Be safe: Flag high-risk changes that need manual review.
- Be comprehensive: Don't skip files or directories.
- Be automation-friendly: Clearly separate issues that scripts/agents can auto-fix.
- Use markdown formatting for readability (headers, lists, code blocks).
- Include code snippets showing the problem and suggested fix.

---

## EXAMPLE OUTPUT FORMAT

````markdown
## Issue: Exposed Stripe Secret Key

**Severity:** CRITICAL  
**File:** `src/lib/stripe.ts:5`  
**Impact:** Production API key exposed in version control

**Current Code:**

```typescript
const stripe = new Stripe("sk_live_abc123xyz...");
```
````

**Recommended Fix:**

```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

**Time to Fix:** 2 minutes  
**Auto-fixable:** No (requires manual env var setup)

```

---

## FINAL DELIVERABLES

1. `audit-output/AUDIT_SUMMARY.md` – Executive summary
2. `audit-output/reports/HIGH/SECURITY_AUDIT.md` – Security and breaking problems
3. `audit-output/reports/MEDIUM/CODE_QUALITY.md` – Code quality issues
4. `audit-output/reports/MEDIUM/PERFORMANCE_AUDIT.md` – Performance issues
5. `audit-output/reports/MEDIUM/DATABASE_AUDIT.md` – Database/Prisma issues
6. `audit-output/reports/MEDIUM/TYPESCRIPT_AUDIT.md` – TypeScript issues
7. `audit-output/reports/LOW/DOCUMENTATION_AUDIT.md` – Documentation gaps
8. `audit-output/AUTOMATED_FIXES_LOG.md` – Automation notes

Begin the audit when instructed by `AI_AGENT_TASKS.md`.
```
