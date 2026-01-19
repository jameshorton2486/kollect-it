# PHASE 3: Production Readiness Verification
## Cursor AI Prompts for Kollect-It

---

## Prompt 3.1 — TypeScript Production Audit

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Verify TypeScript compilation status for production code only, explicitly excluding test files and archives.

# CONTEXT
- Project: Kollect-It (Next.js 16 / TypeScript / Prisma)
- Build must pass with zero errors in src/
- Test files (tests/, *.test.ts) are excluded from production criteria
- Work files (work_files/) are archived and excluded
- Strict mode is enabled

# COMMANDS TO RUN
```bash
# Production-only type check
npx tsc --noEmit 2>&1 | grep "^src/"
```

# ANALYSIS REQUIRED

1. **Error Classification**
   If any errors exist, categorize by:
   - Type errors (TS2xxx)
   - Import errors (TS2307)
   - Unused variable warnings (TS6133)
   - Strict null check failures

2. **Severity Assessment**
   - BLOCKING: Errors that would cause runtime failures
   - NON-BLOCKING: Warnings that don't affect functionality
   - DEFERRED: Issues in non-production code

3. **File-Level Report**
   For any errors found, report:
   - File path
   - Line number
   - Error code and message
   - Suggested fix (if straightforward)

# EXPECTED RESULT
```
Production TypeScript Errors: 0
Status: ✅ CLEAN
```

# IF ERRORS FOUND
Provide fixes in this format:
```typescript
// File: [path]
// Line: [number]
// Error: [TS code] [message]

// Current:
[problematic code]

// Fix:
[corrected code]
```

# CONSTRAINTS
- Focus ONLY on src/ directory
- DO NOT attempt to fix tests/ or work_files/
- DO NOT change tsconfig.json settings
- Report findings, request approval before fixing
```

---

## Prompt 3.2 — Build Process Verification

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Verify the Next.js build process completes successfully with no blocking warnings.

# CONTEXT
- Project: Kollect-It
- Next.js 16.1.1 with Turbopack
- Prisma client generation required
- Static + dynamic route mix
- Production deployment target: Vercel

# BUILD COMMAND
```bash
npm run build
```

# VERIFICATION CHECKLIST

1. **Prisma Generation**
   - [ ] `prisma generate` completes without errors
   - [ ] Client generated to node_modules/@prisma/client

2. **Compilation**
   - [ ] "Compiled successfully" message
   - [ ] No TypeScript errors (should show "Skipping validation" or pass)

3. **Page Generation**
   - [ ] Static pages generated (○ markers)
   - [ ] Dynamic routes configured (ƒ markers)
   - [ ] No pages fail to generate

4. **Route Analysis**
   Count and categorize:
   - Static pages (○): [count]
   - Dynamic routes (ƒ): [count]
   - API routes: [count]
   - Total: [count]

5. **Warning Assessment**
   - "Route not found" during SSG — typically acceptable (API routes during static gen)
   - Deprecation warnings — note but don't block
   - Any actual error messages — BLOCKING

# OUTPUT FORMAT
```markdown
## Build Verification Report

### Status: ✅ PASSING / ❌ FAILING

### Metrics
- Compilation time: Xs
- Static pages: X
- Dynamic routes: X
- API routes: X

### Warnings
| Type | Count | Blocking |
|------|-------|----------|
| Route not found | X | No |
...

### Issues Requiring Attention
[List or "None"]
```

# CONSTRAINTS
- Run build in clean environment
- Report warnings but don't fail on non-blocking items
- Note any missing environment variables
```

---

## Prompt 3.3 — Console Statement Cleanup (Optional)

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Identify and fix console.log statements that should not appear in production client-side code.

# CONTEXT
- Server-side console.log in API routes is ACCEPTABLE (for logging)
- Client-side console.log in components should be wrapped in development checks or removed
- console.error for error handling is ACCEPTABLE

# SEARCH SCOPE
- src/components/**/*.tsx
- src/app/**/page.tsx (exclude api/)

# PATTERNS TO FIND

## Should be wrapped or removed:
- `console.log(` in client components
- Debug statements like `console.log("Debug:`, `console.log("🔐`

## Acceptable (leave alone):
- `console.error(` for error handling
- `console.warn(` for warnings
- Any console statement already wrapped in `if (process.env.NODE_ENV === "development")`
- Console statements in src/app/api/ routes

# FIX PATTERN
```typescript
// BEFORE (problematic)
console.log("Debug info", data);

// AFTER (wrapped for dev only)
if (process.env.NODE_ENV === "development") {
  console.log("Debug info", data);
}

// OR simply remove if not needed
```

# OUTPUT FORMAT
```markdown
## Console Statement Audit

### Client-Side (Action Required)
| File | Line | Statement | Action |
|------|------|-----------|--------|
| [path] | [line] | [snippet] | Wrap/Remove |

### Server-Side (No Action)
- [count] statements in API routes (acceptable)

### Already Wrapped (No Action)
- [count] statements with dev check

### Fixes Applied
[Show each fix or "None required"]
```

# CONSTRAINTS
- DO NOT remove console.error statements
- DO NOT modify API route logging
- Wrap in dev check rather than delete (preserves debug capability)
```

---

## Prompt 3.4 — Import & Dependency Check

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Verify all imports resolve correctly and no circular dependencies exist in production code.

# CONTEXT
- Uses path aliases (@/ maps to src/)
- Prisma client import from @prisma/client
- Next.js specific imports (next/image, next/link, next/navigation)

# CHECKS TO PERFORM

1. **Broken Imports**
   Search for import statements that reference:
   - Non-existent files
   - Incorrect path aliases
   - Missing named exports

2. **Circular Dependencies**
   Check for circular import patterns in:
   - src/lib/
   - src/components/
   - src/contexts/

3. **Unused Imports**
   Identify imports that are declared but never used (TS6133 warnings)

4. **External Dependencies**
   Verify these critical packages are properly imported:
   - next-auth
   - @prisma/client
   - stripe
   - lucide-react
   - tailwindcss (config only)

# OUTPUT FORMAT
```markdown
## Import Analysis Report

### Broken Imports
| File | Import | Issue |
|------|--------|-------|
[None found / List]

### Circular Dependencies
[None detected / Describe chains]

### Unused Imports (Low Priority)
| File | Import | Recommendation |
|------|--------|----------------|
[List or "None significant"]

### External Package Status
| Package | Status | Notes |
|---------|--------|-------|
| next-auth | ✅ | |
| @prisma/client | ✅ | |
| stripe | ✅ | |
...
```

# CONSTRAINTS
- Focus on src/ directory only
- Unused imports in test files can be ignored
- Report only — do not auto-remove imports
```

---

## Quick Reference: Which Prompt to Use

| Situation | Use Prompt |
|-----------|------------|
| Verify TypeScript is clean | 3.1 |
| Confirm build passes | 3.2 |
| Clean up debug logs | 3.3 |
| Check for import issues | 3.4 |

**Recommended order:** 3.1 → 3.2 → 3.3 (if needed) → 3.4 (if issues suspected)

---

*Copy each prompt individually into Cursor AI. Run in sequence for best results.*
