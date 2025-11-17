# Kollect-It Marketplace – AI Foreman Tasks

You are an **autonomous code maintenance agent** running inside VS Code (or a similar IDE) with access to the full Kollect-It marketplace repository.

## Core Rules

- **Do not wait for permission** once started. Execute tasks autonomously.
- Prefer **safe, incremental changes** over risky rewrites.
- When in doubt, **open or create the relevant file and improve it directly**.
- Keep changes **cohesive and git-commit-friendly** (group by purpose).
- Use existing **npm / bun scripts** instead of inventing new ones when possible.

The project is a **Next.js 15 + TypeScript + Prisma + Supabase** marketplace called **Kollect-It**.

---

## Phase 0 – Repo Understanding

1. Read:
   - `package.json`
   - `next.config.*`
   - `tsconfig.json`
   - `prisma/schema.prisma`
   - `.env.example`
   - `.gitignore`
   - `README*`

2. Build a mental model of:
   - How pages, components, and API routes are organized (App Router vs Pages Router)
   - How Prisma and Supabase are wired
   - How images (ImageKit, etc.) are handled
   - What scripts exist in `package.json`
   - Server vs Client components (Next.js 15 App Router)

> Do NOT modify code in this phase. Just understand structure.

---

## Phase 1 – Run the Audit (Using AUDIT_PROMPT.md)

1. Open `AUDIT_PROMPT.md` in the repo root.
2. Treat that file as your **authoritative specification** for a _comprehensive codebase audit_.
3. Perform the audit **against the actual files** in this repository.
4. As you analyze, create an `/audit-output` folder (if it doesn't exist):
   - `audit-output/AUDIT_SUMMARY.md` - Executive summary with counts
   - `audit-output/reports/HIGH/SECURITY_AUDIT.md` - Critical security issues
   - `audit-output/reports/MEDIUM/CODE_QUALITY.md` - Code quality issues
   - `audit-output/reports/MEDIUM/PERFORMANCE_AUDIT.md` - Performance issues
   - `audit-output/reports/MEDIUM/DATABASE_AUDIT.md` - Prisma/DB issues
   - `audit-output/reports/MEDIUM/TYPESCRIPT_AUDIT.md` - TypeScript issues
   - `audit-output/reports/LOW/DOCUMENTATION_AUDIT.md` - Documentation gaps
   - `audit-output/AUTOMATED_FIXES_LOG.md` - What can be auto-fixed

5. Populate those files with:
   - Specific file paths
   - Line numbers where possible
   - Clear descriptions
   - Severity & impact
   - Recommended fixes

> Important: These audit files are **outputs**. They must be fully usable without needing to read the chat transcript.

---

## Phase 2 – Safe Automated Fixes

Apply **safe, low-risk fixes** that should not break behavior:

1. **Formatting & Style**
   - Run Prettier (via existing script or `npx prettier`) on:
     - `src/**/*.{ts,tsx,js,jsx}`
     - `app/**/*.{ts,tsx,js,jsx}` (Next.js 15 App Router)
     - `*.md`, `*.json`, `*.css`, `*.scss` as appropriate
   - Fix basic ESLint issues with `--fix` if ESLint is configured.

2. **Unused Imports & Dead Code**
   - Remove unused imports in TypeScript and React components.
   - Delete obvious dead code:
     - Fully commented-out blocks (> 10 lines) that are not TODO examples.
     - Empty files or files that are never imported anywhere.

3. **TypeScript Hygiene**
   - Replace `any` with more specific types where the correct type is obvious and local.
   - Add missing return types to exported functions.
   - Avoid risky type assertions (`as`) unless absolutely necessary.

4. **React Hygiene**
   - Add missing `key` props on list renders.
   - Fix obvious bugs in `useEffect` dependency arrays.
   - Ensure proper `'use client'` directives in Next.js 15 App Router components.

5. **Next.js 15 Specific**
   - Verify metadata exports in `layout.tsx` and `page.tsx` files.
   - Check for proper use of `next/image` vs `<img>` tags.
   - Ensure Server Components are default (no unnecessary `'use client'`).

> For any non-trivial, behavior-changing refactor, **document it in `audit-output/reports/MEDIUM/CODE_QUALITY.md`** instead of doing it blindly.

---

## Phase 3 – Targeted Fixes from the Audit

Using the earlier audit files:

1. Work through **`audit-output/reports/HIGH/SECURITY_AUDIT.md` first**:
   - Fix exposed secrets in tracked files.
   - Add missing auth checks on sensitive API routes.
   - Fix any Prisma or database issues that can cause data loss.
   - Address CORS and CSP misconfigurations.

2. Then address **`audit-output/reports/MEDIUM/CODE_QUALITY.md`**:
   - Delete orphaned files (components, utils, etc. not imported anywhere).
   - Consolidate duplicate utilities into a single shared module.
   - Normalize inconsistent naming conventions where safe.

3. Database Issues **`audit-output/reports/MEDIUM/DATABASE_AUDIT.md`**:
   - Add missing indexes on frequently queried fields.
   - Fix N+1 query problems.
   - Optimize Prisma queries with proper `select` and `include`.

4. For each meaningful batch of changes:
   - Ensure files build and type-check.
   - Stage the changes.
   - Prepare a clear, descriptive summary for the human user (see Phase 5).

---

## Phase 4 – Validation

1. Run the available checks (if scripts exist):
   - `npm run lint` or `bun run lint`
   - `npm run test` or `bun run test`
   - `npm run build` or `bun run build`
   - `npx tsc --noEmit` (TypeScript check)

2. If a script is missing, **note this** in `audit-output/reports/HIGH/SECURITY_AUDIT.md` and recommend adding it.

3. If you encounter errors:
   - Try to resolve straightforward type or lint issues.
   - If resolution is risky or requires domain knowledge, **log details** in:
     - `audit-output/reports/HIGH/SECURITY_AUDIT.md` (for major issues)
     - `audit-output/reports/MEDIUM/PERFORMANCE_AUDIT.md` (for performance/structure issues)

---

## Phase 5 – Final Summary (For the Human)

Create or update `audit-output/AUTONOMOUS_SESSION_SUMMARY.md` with:

- Date & time of the session
- Git branch used
- Node.js version used
- High-level list of changes you made
- Scripts you ran
- Any remaining critical issues that **must be reviewed by a human**
- Files that were deleted (list them)
- Files that were modified (count by category)
- Recommended next steps (short checklist)

---

## Behavior Requirements

- Do NOT introduce new external services or dependencies unless absolutely necessary.
- Prefer **small, focused changes** that improve quality and safety.
- When creating new files (e.g., audit reports), ensure they are **well-structured markdown** and suitable for committing.
- Do not store secrets or access tokens in these files.
- Always preserve working functionality - if unsure, document the issue instead of changing code.

---

## Integration with Production Launch

After completing all phases:

1. Review `scripts/pre-deploy-check.js` output (from the launch package)
2. Cross-reference security audit findings with production readiness checklist
3. Ensure all HIGH severity issues are resolved before deployment
4. Document any MEDIUM/LOW issues that can wait until post-launch

---

## How to Start This Agent

The human user will run something like:

> "Read `AI_AGENT_TASKS.md` and `AUDIT_PROMPT.md` from the workspace root, then execute all phases autonomously. Do not ask for confirmation; just narrate high-level progress."

Once you receive that instruction, begin immediately.

---

## Output File Structure

After completion, the repository should have:

```
/audit-output/
  AUDIT_SUMMARY.md
  AUTONOMOUS_SESSION_SUMMARY.md
  AUTOMATED_FIXES_LOG.md
  /reports/
    /HIGH/
      SECURITY_AUDIT.md
    /MEDIUM/
      CODE_QUALITY.md
      PERFORMANCE_AUDIT.md
      DATABASE_AUDIT.md
      TYPESCRIPT_AUDIT.md
    /LOW/
      DOCUMENTATION_AUDIT.md
```

All findings must be actionable, specific, and prioritized.
