# Contributing to Kollect-It

Welcome! This guide ensures consistent, professional contributions to the Kollect-It marketplace.

## 📋 Before You Start

1. **Read** [the main documentation](README.md)
2. **Check** existing issues and PRs to avoid duplication
3. **Discuss** large features in an issue first
4. **Follow** all rules below—they're enforced

---

## 🏗️ Repository Structure (REQUIRED)

```
kollect-it/
├── src/app/              # Next.js App Router pages and API routes
├── src/components/       # Reusable React components (shadcn/ui patterns)
├── src/lib/              # Business logic, helpers, AI clients
├── src/styles/           # Global styles and Tailwind configuration
├── public/               # Static assets (images, manifests, etc.)
├── scripts/              # Dev, migration, and maintenance scripts
├── docs/                 # ALL documentation (mandatory organization)
├── tests/                # Unit and integration tests
├── .github/              # GitHub Actions, issue templates
├── prisma/               # Database schema and migrations
└── package.json          # Project metadata and dependencies
```

### Folder Rules

| Folder | Purpose | Example Files |
|--------|---------|----------------|
| `src/app/` | Pages & routes | `marketplace/page.tsx`, `api/listings/route.ts` |
| `src/components/` | UI components | `ProductCard.tsx`, `SellerProfile.tsx` |
| `src/lib/` | Business logic | `ai/client.ts`, `db/queries.ts`, `utils/formatting.ts` |
| `src/styles/` | Global styles | `globals.css`, Tailwind plugins |
| `public/` | Static files | Images, manifests, robots.txt |
| `scripts/` | Automation | `seed.ts`, `migrate.ts`, dev utilities |
| `docs/` | **ALL documentation** | Architecture, QA, operations, SEO |
| `prisma/` | Database schema | `schema.prisma`, migrations, `seed.ts` |

---

## 📝 Documentation Rules (CRITICAL)

### ✅ Documentation MUST GO IN `/docs/`

When documenting anything:
- Create the file in `/docs/` and its relevant subdirectory
- Examples:
  - Architecture decision → `docs/architecture/component-strategy.md`
  - QA procedures → `docs/qa/testing-strategy.md`
  - Operations task → `docs/operations/database-backup.md`
  - Deployment checklist → `docs/checklists/PRODUCTION_DEPLOY.md`

### ❌ NEVER Create Root-Level .md Files

**Do NOT create:**
- `MY_NOTES.md` (root level)
- `FEATURE_PLAN.md` (root level)
- `SCRATCH.md` (root level)
- `DEBUG_LOG.md` (root level)

**Instead:**
- Feature plans → `docs/architecture/FEATURE_NAME.md`
- Debug notes → Debug in code comments, commit to `docs/operations/debug-log.md`
- Scratch work → Don't commit; use local branches

### Root README Only

The root `README.md` is **minimal and read-only**:
- Project name
- One-paragraph description
- Link to `docs/README.md`
- Quick install steps

Everything else lives in `/docs/`.

---

## 🔧 Code Style & Quality

### TypeScript & Formatting

```bash
# Type checking (must pass)
bun run typecheck

# Formatting with Biome (required)
bun run format

# Linting (must pass)
bun run lint
```

### Commit Rules

- ✅ Imperative tone: `"Add seller verification flow"`
- ✅ Specific: `"Fix race condition in checkout"`
- ❌ Vague: `"Fix stuff"`, `"Update code"`
- ❌ Never: Commented-out code, debug logs, temporary files

### Code Standards

| Rule | Requirement |
|------|-------------|
| **Imports** | Organized, no unused imports |
| **Type safety** | Full TypeScript coverage (no `any` without reason) |
| **AI clients** | Lazy-loaded from `@/lib/ai/client` (never module-scope) |
| **API routes** | `export const dynamic = "force-dynamic"` for AI ops |
| **Database** | Use Prisma; never raw SQL in views |
| **Comments** | Explain *why*, not *what* (code explains what) |

---

## 🔄 Pull Request Checklist

Before submitting a PR:

- [ ] **No root-level files created** (except code in `src/`)
- [ ] **Documentation updated** (if behavior changed, update `/docs/`)
- [ ] **Types check:** `bun run typecheck`
- [ ] **Format passes:** `bun run format`
- [ ] **Lint passes:** `bun run lint`
- [ ] **Tests added/updated** (if applicable)
- [ ] **No unused imports** or commented code
- [ ] **Commit messages clear** (imperative, linked to issue)
- [ ] **Branch name follows convention:**
  - `feature/seller-verification`
  - `bugfix/checkout-race-condition`
  - `docs/update-architecture`
  - `cleanup/remove-dead-code`

### PR Title & Description

**Title:** Clear, imperative
```
Add seller verification email step
Fix race condition in checkout
Update SEO schema for collectibles
```

**Description:** Include context
```
Closes #123

## What Changed
- Added email verification step to seller onboarding
- Created `SendVerificationEmail` server action
- Updated seller registration flow in `/seller/signup`

## Testing
- [x] Manual smoke test on staging
- [x] E2E test covers verification flow
- [x] No regressions in existing seller flow
```

---

## 🚨 Collaboration Rules

### Before Starting Big Features

1. Open an issue describing the feature
2. Link related issues
3. Wait for discussion before coding
4. Get team approval on design

### Reviewer Responsibilities

- ✅ Verify no root clutter is introduced
- ✅ Check docs are in `/docs/` if added
- ✅ Ensure no temporary files are committed
- ✅ Verify tests are meaningful
- ✅ Check for hardcoded values or credentials

### Merging Rules

- Squash merge for cleaner history
- Delete branch after merge
- Link merged PR in related issues

---

## 🛡️ Security & Credentials

### Never Commit

- `.env`, `.env.local`, `.env.production.local`
- API keys, tokens, passwords
- Database credentials
- Private URLs or IPs

### If Accidentally Committed

1. **Immediately rotate** the credential
2. Use `git filter-branch` or `git reset --hard` to remove
3. Force-push to branch (only if not in main)
4. Report to security team if in main

See [Operations Guide](operations/) for incident response procedures.

---

## 🧪 Testing Guidelines

### Test Placement

- Unit tests: `src/lib/__tests__/` (mirrors structure)
- E2E tests: `e2e/` (marketplace flows, critical paths)
- Integration tests: Same as unit test structure

### Test Naming

```typescript
describe("SellerVerification", () => {
  it("should send verification email on signup", () => {
    // Test here
  });

  it("should validate email token before activation", () => {
    // Test here
  });
});
```

### When to Test

- ✅ New features
- ✅ Bug fixes (prevents regression)
- ✅ Performance-critical paths
- ❌ Don't test third-party libraries
- ❌ Don't test framework behavior

---

## 📚 Documentation Standards

### Every Documentation File Should Include

```markdown
# [Feature/Topic Name]

> Brief one-line description

## Overview
[2-3 paragraph explanation]

## Key Concepts
- Concept 1: Description
- Concept 2: Description

## Implementation Details
[Technical explanation]

## Examples
[Code examples or workflows]

## Related Documentation
- [Link to related doc](../other-doc.md)
- [Link to architecture](../architecture/)

**Last Updated:** [Date]
**Owner:** [Team/Person Name]
```

---

## 🚀 Marketplace-Specific Rules

### Seller & Buyer Workflows

- **Seller trust:** Every feature must enforce identity verification
- **Provenance:** Track item origin, condition, authenticity
- **Categories:** Never change taxonomy without stakeholder approval
- **SEO:** Every listing must have schema.org metadata

### SKU & Inventory

- Use consistent SKU format: `CATEGORY-SUBCATEGORY-YEAR-VARIANT`
- Maintain inventory accuracy
- Track condition changes over time
- Never merge duplicate listings

### Image Management

- All images → ImageKit (never raw filesystem)
- Normalize dimensions and background
- Use appropriate compression for category
- See [Marketplace Guide](marketplace/) for details

### Database Integrity

- Use Prisma constraints where possible
- Validate category choices on backend
- Audit schema changes before migration
- Test migrations on staging first

---

## 🆘 Getting Help

- **Documentation:** Check [docs/README.md](README.md)
- **Issues:** Open with reproduction steps
- **Code review:** Tag reviewers for feedback
- **Security:** Email security team (don't post in public issues)

---

## ✨ Thank You

Thank you for contributing to Kollect-It! Your attention to these standards makes the codebase and marketplace better for everyone.

**Questions?** Ask in PR discussions or open an issue.

---

**Last Updated:** January 2026
**Enforced by:** Copilot AI + Team Reviews
