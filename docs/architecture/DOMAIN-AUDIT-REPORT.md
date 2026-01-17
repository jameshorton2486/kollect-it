# Domain Leakage Audit Report

**Date:** January 16, 2026  
**Auditor:** Principal Software Architect  
**Status:** Proposed  
**Branch:** `chore/sync-local-changes`

---

## Executive Summary

This audit analyzed `/src/lib/` (89 files) to identify domain leakage, architectural violations, and opportunities for cleaner separation of concerns. The codebase shows **good infrastructure separation** but **significant domain leakage** where business logic is mixed with utilities and admin-specific code bleeds into shared modules.

**Key Findings:**
- ✅ Infrastructure layer is well-structured (prisma, cache, logger, email)
- ⚠️ **Admin logic leaked into 16+ files** that non-admin code imports
- ⚠️ **Domain logic scattered** across `/lib` instead of domain folders
- ⚠️ **God files** doing too many things (analytics/queries.ts: 800+ lines)
- ⚠️ **Misplaced utilities** (SKU logic in `utils/image-parser.ts`)

**Risk Level:** Medium-High  
**Recommended Action:** Phased migration over 3-4 PRs

---

## Part A: Current State Inventory

| File Path | Lines | Current Domain | Issues Found | Priority |
|-----------|-------|----------------|--------------|----------|
| `auth.ts` | ~185 | **user** | None | - |
| `auth-admin.ts` | ~48 | **admin** | ⚠️ Used by 16 files (leakage risk) | High |
| `auth-helpers.ts` | ~50 | **user** | Contains `checkAdminAuth()` - should be admin | Medium |
| `pricing/engineWithConfidence.ts` | ~383 | **product** | ✅ Pure domain logic | Low |
| `pricing/rules.ts` | ~200 | **product** | ✅ Pure domain logic | Low |
| `pricing/types.ts` | ~50 | **product** | ✅ Pure domain logic | Low |
| `category-config.ts` | ~244 | **category** | ⚠️ Should be domain/category | Medium |
| `utils/image-parser.ts` | ~199 | **sku** | ⚠️ SKU logic in image parser (wrong domain) | High |
| `image.ts` | ~150 | **image** | ⚠️ Mixed: helpers + validation | Medium |
| `image-helpers.ts` | ~150 | **image** | ⚠️ Contains `getAdminPreviewImageUrl()` - admin leak | Medium |
| `image-validation.ts` | ~100 | **image** | ✅ Pure validation | Low |
| `imagekit.ts` | ~200 | **infrastructure** | ✅ External service wrapper | - |
| `imagekit-sync.ts` | ~240 | **image** | ⚠️ Business logic + infrastructure | Medium |
| `analytics/queries.ts` | ~810 | **admin** | ⚠️ God file - does everything | High |
| `analytics/export.ts` | ~150 | **admin** | ⚠️ Admin-specific but in shared | High |
| `analytics/types.ts` | ~200 | **admin** | ⚠️ Admin types in shared | Medium |
| `analytics/filters.ts` | ~100 | **admin** | ⚠️ Admin filters in shared | Medium |
| `analytics/optimization.ts` | ~150 | **admin** | ⚠️ Admin optimization in shared | Medium |
| `analytics/scheduler.ts` | ~100 | **infrastructure** | ✅ Job scheduling | - |
| `email.ts` | ~300 | **infrastructure** | ⚠️ Contains `sendAdminNewOrderEmail()` - admin leak | Low |
| `email/reportSender.ts` | ~200 | **admin** | ⚠️ Admin-specific in shared | Medium |
| `prisma.ts` | ~20 | **infrastructure** | ✅ Database client | - |
| `cache.ts` | ~100 | **infrastructure** | ✅ Caching layer | - |
| `logger.ts` | ~50 | **infrastructure** | ✅ Logging | - |
| `enhanced-logger.ts` | ~200 | **infrastructure** | ✅ Enhanced logging | - |
| `stripe.ts` | ~200 | **infrastructure** | ✅ Payment gateway | - |
| `recommendations.ts` | ~150 | **product** | ⚠️ Should be domain/product | Medium |
| `seo.ts` | ~200 | **infrastructure** | ⚠️ Contains product SEO logic - domain leak | Medium |
| `currency.ts` | ~50 | **infrastructure** | ✅ Currency formatting | - |
| `pagination.ts` | ~100 | **infrastructure** | ✅ Pagination utilities | - |
| `utils.ts` | ~10 | **infrastructure** | ✅ Pure utilities (cn function) | - |
| `websocket/server.ts` | ~200 | **infrastructure** | ✅ WebSocket server | - |
| `websocket/types.ts` | ~50 | **infrastructure** | ✅ Type definitions | - |
| `ai/client.ts` | ~100 | **infrastructure** | ✅ AI service client | - |
| `ai/product-generator.ts` | ~70 | **product** | ⚠️ Domain logic in infrastructure | Medium |
| `ai/claude-product-analyzer.ts` | ~300 | **product** | ⚠️ Domain logic in infrastructure | Medium |
| `ai/gpt4v-image-analyzer.ts` | ~200 | **image** | ⚠️ Domain logic in infrastructure | Medium |
| `server/categories.ts` | ~100 | **category** | ⚠️ Server-side category logic - should be domain | Medium |
| `db-optimization.ts` | ~232 | **infrastructure** | ✅ DB optimization | - |
| `performance.ts` | ~100 | **infrastructure** | ✅ Performance utilities | - |
| `performance-config.ts` | ~100 | **infrastructure** | ✅ Performance config | - |
| `rate-limit.ts` | ~100 | **infrastructure** | ✅ Rate limiting | - |
| `security.ts` | ~150 | **infrastructure** | ✅ Security utilities | - |
| `api-error.ts` | ~50 | **infrastructure** | ✅ API error handling | - |
| `api/withErrorHandling.ts` | ~50 | **infrastructure** | ✅ Error handling wrapper | - |
| `csv-export.ts` | ~150 | **admin** | ⚠️ Admin export in shared | Medium |
| `init.ts` | ~50 | **infrastructure** | ✅ App initialization | - |
| `env.ts` | ~50 | **infrastructure** | ✅ Environment variables | - |
| `web-vitals.ts` | ~50 | **infrastructure** | ✅ Web vitals tracking | - |
| `request-context.ts` | ~50 | **infrastructure** | ✅ Request context | - |

**Total Files Analyzed:** 55  
**Domain Violations:** 23  
**Infrastructure (Good):** 18  
**Admin Leakage:** 9 files  
**Cross-Domain Issues:** 6 files

---

## Part B: Violations Summary

### VIOLATION 1: Admin Logic in Shared Code

**Files:**
- `src/lib/auth-admin.ts` - Imported by 16 files (including non-admin routes)
- `src/lib/analytics/queries.ts` - Admin analytics in shared code
- `src/lib/analytics/export.ts` - Admin export functionality
- `src/lib/analytics/types.ts` - Admin types
- `src/lib/analytics/filters.ts` - Admin filters
- `src/lib/analytics/optimization.ts` - Admin optimization
- `src/lib/email/reportSender.ts` - Admin report sender
- `src/lib/csv-export.ts` - Admin CSV export
- `src/lib/auth-helpers.ts` - Contains `checkAdminAuth()` function

**Description:** Admin-specific logic is in `/src/lib/` which is imported by non-admin code, creating a security and architectural boundary violation.

**Impact:**
- Non-admin code can accidentally import admin utilities
- Harder to audit admin access patterns
- Violates principle of least privilege
- Makes testing admin logic harder

**Fix:** Move all admin-specific code to `/src/domains/admin/` or `/src/lib/admin/` with clear imports.

---

### VIOLATION 2: Domain Logic in Infrastructure

**Files:**
- `src/lib/ai/product-generator.ts` - Product domain logic in AI infrastructure
- `src/lib/ai/claude-product-analyzer.ts` - Product analysis (domain) in AI (infrastructure)
- `src/lib/ai/gpt4v-image-analyzer.ts` - Image analysis (domain) in AI (infrastructure)
- `src/lib/pricing/engineWithConfidence.ts` - Product pricing (domain) - location OK but should be domain/product
- `src/lib/recommendations.ts` - Product recommendations (domain)
- `src/lib/utils/image-parser.ts` - SKU validation (domain) in image parser utility

**Description:** Business logic (product pricing, SKU validation, recommendations) is mixed with infrastructure code (AI clients, utilities).

**Impact:**
- Hard to test domain logic in isolation
- Domain rules scattered across infrastructure
- Violates dependency rule (domain shouldn't depend on infrastructure details)
- Makes domain logic harder to understand and evolve

**Fix:** Move domain logic to `/src/domains/{domain}/` folders.

---

### VIOLATION 3: Cross-Domain Mixing

**Files:**
- `src/lib/utils/image-parser.ts` - Contains both **image** parsing AND **SKU** validation
- `src/lib/seo.ts` - Contains product SEO logic (product domain) mixed with generic SEO
- `src/lib/image-helpers.ts` - Contains admin preview functions (admin domain) mixed with image utilities

**Description:** Files handle multiple domains, violating single responsibility principle.

**Impact:**
- Unclear ownership and responsibility
- Changes in one domain affect another
- Harder to test and maintain

**Fix:** Split into domain-specific files:
- `utils/image-parser.ts` → Split SKU logic to `domains/sku/validation.ts`
- `seo.ts` → Move product SEO to `domains/product/seo.ts`
- `image-helpers.ts` → Move admin function to `domains/admin/image-preview.ts`

---

### VIOLATION 4: God Files

**Files:**
- `src/lib/analytics/queries.ts` - 810 lines, does everything: metrics, trends, revenue, categories
- `src/lib/imagekit-sync.ts` - 240 lines, handles sync, upload, retry, validation

**Description:** Single files doing too many things, violating single responsibility.

**Impact:**
- Hard to test individual concerns
- High cognitive load
- Difficult to maintain and extend
- Merge conflicts more likely

**Fix:** Split into smaller, focused modules:
- `analytics/queries.ts` → Split by metric type (revenue, approvals, products, categories)
- `imagekit-sync.ts` → Split into: sync service, upload service, retry logic

---

### VIOLATION 5: Misplaced Domain Logic

**Files:**
- `src/lib/category-config.ts` - Category domain config should be in `domains/category/`
- `src/lib/server/categories.ts` - Server-side category logic should be domain
- `src/lib/pricing/` - Pricing is product domain, should be `domains/product/pricing/`
- `src/lib/recommendations.ts` - Product recommendations should be `domains/product/recommendations.ts`

**Description:** Domain logic is in `/lib` instead of dedicated domain folders.

**Impact:**
- Unclear domain boundaries
- Hard to see what belongs to which domain
- Violates domain-driven design principles

**Fix:** Move to appropriate domain folders.

---

### VIOLATION 6: Infrastructure Dependency in Domain

**None found!** ✅

All domain logic correctly depends only on Prisma types, not on infrastructure implementations.

---

## Part C: Proposed Domain Structure

```
src/
├── domains/
│   ├── product/
│   │   ├── services/
│   │   │   ├── pricing/
│   │   │   │   ├── engine.ts           (from lib/pricing/engineWithConfidence.ts)
│   │   │   │   ├── rules.ts            (from lib/pricing/rules.ts)
│   │   │   │   └── types.ts            (from lib/pricing/types.ts)
│   │   │   ├── recommendations.ts      (from lib/recommendations.ts)
│   │   │   ├── seo.ts                  (product SEO from lib/seo.ts)
│   │   │   └── analysis.ts             (AI analysis orchestration)
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── image/
│   │   ├── pipeline/
│   │   │   ├── sync.ts                 (from lib/imagekit-sync.ts - sync logic)
│   │   │   ├── upload.ts               (from lib/imagekit-sync.ts - upload logic)
│   │   │   └── retry.ts                (from lib/imagekit-sync.ts - retry logic)
│   │   ├── validation/
│   │   │   └── requirements.ts         (from lib/image-validation.ts)
│   │   ├── parsing/
│   │   │   └── metadata.ts             (from lib/utils/image-parser.ts - image parsing only)
│   │   ├── helpers/
│   │   │   └── urls.ts                 (from lib/image-helpers.ts - non-admin only)
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── sku/
│   │   ├── validation.ts               (from lib/utils/image-parser.ts - SKU functions)
│   │   ├── generation.ts               (future: SKU generation logic)
│   │   ├── parsing.ts                  (future: SKU parsing utilities)
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── category/
│   │   ├── config.ts                   (from lib/category-config.ts)
│   │   ├── validation.ts               (from lib/server/categories.ts)
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── order/
│   │   ├── cart.ts                     (future: cart operations)
│   │   ├── checkout.ts                 (future: checkout logic)
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── user/
│   │   ├── auth.ts                     (from lib/auth.ts)
│   │   ├── helpers.ts                  (from lib/auth-helpers.ts - non-admin)
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   └── admin/
│       ├── auth.ts                     (from lib/auth-admin.ts)
│       ├── analytics/
│       │   ├── queries.ts              (split from lib/analytics/queries.ts)
│       │   ├── revenue.ts
│       │   ├── approvals.ts
│       │   ├── products.ts
│       │   ├── categories.ts
│       │   ├── export.ts               (from lib/analytics/export.ts)
│       │   ├── filters.ts              (from lib/analytics/filters.ts)
│       │   ├── optimization.ts         (from lib/analytics/optimization.ts)
│       │   └── types.ts                (from lib/analytics/types.ts)
│       ├── email/
│       │   └── reports.ts              (from lib/email/reportSender.ts)
│       ├── exports/
│       │   └── csv.ts                  (from lib/csv-export.ts)
│       ├── image/
│       │   └── preview.ts              (admin preview from lib/image-helpers.ts)
│       ├── email.ts                    (admin email from lib/email.ts)
│       ├── types.ts
│       └── index.ts
│
├── infrastructure/
│   ├── database/
│   │   └── prisma.ts                   (from lib/prisma.ts)
│   ├── cache/
│   │   └── cache.ts                    (from lib/cache.ts)
│   ├── email/
│   │   ├── client.ts                   (from lib/email.ts - generic email)
│   │   └── templates/                  (from src/emails/)
│   ├── logging/
│   │   ├── logger.ts                   (from lib/logger.ts)
│   │   └── enhanced.ts                 (from lib/enhanced-logger.ts)
│   ├── external/
│   │   ├── imagekit/
│   │   │   ├── client.ts               (from lib/imagekit.ts)
│   │   │   └── types.ts                (from types/imagekit.ts)
│   │   ├── stripe/
│   │   │   └── client.ts               (from lib/stripe.ts)
│   │   ├── ai/
│   │   │   ├── client.ts               (from lib/ai/client.ts)
│   │   │   ├── claude.ts               (from lib/ai/claude-product-analyzer.ts - client only)
│   │   │   └── gpt4v.ts                (from lib/ai/gpt4v-image-analyzer.ts - client only)
│   │   └── supabase/
│   │       ├── client.ts               (from lib/supabase/client.ts)
│   │       └── server.ts               (from lib/supabase/server.ts)
│   ├── api/
│   │   ├── error-handling.ts           (from lib/api-error.ts)
│   │   └── with-error-handling.ts      (from lib/api/withErrorHandling.ts)
│   ├── security/
│   │   ├── rate-limit.ts               (from lib/rate-limit.ts)
│   │   └── security.ts                 (from lib/security.ts)
│   ├── performance/
│   │   ├── performance.ts              (from lib/performance.ts)
│   │   └── config.ts                   (from lib/performance-config.ts)
│   ├── monitoring/
│   │   ├── web-vitals.ts               (from lib/web-vitals.ts)
│   │   └── request-context.ts          (from lib/request-context.ts)
│   ├── jobs/
│   │   ├── scheduler.ts                (from lib/analytics/scheduler.ts)
│   │   └── report-scheduler.ts         (from lib/jobs/reportScheduler.ts)
│   ├── websocket/
│   │   ├── server.ts                   (from lib/websocket/server.ts)
│   │   └── types.ts                    (from lib/websocket/types.ts)
│   ├── db/
│   │   └── optimization.ts             (from lib/db-optimization.ts)
│   ├── utils/
│   │   ├── currency.ts                 (from lib/currency.ts)
│   │   ├── pagination.ts               (from lib/pagination.ts)
│   │   ├── cn.ts                       (from lib/utils.ts)
│   │   └── recharts-formatters.ts      (from lib/utils/recharts-formatters.ts)
│   ├── seo/
│   │   └── generic.ts                  (generic SEO from lib/seo.ts)
│   ├── env/
│   │   └── env.ts                      (from lib/env.ts)
│   └── init/
│       └── init.ts                     (from lib/init.ts)
│
└── lib/
    └── (deprecated - use domains/ or infrastructure/)
```

---

## Part D: Migration Plan

### Phase 1: Create New Structure (PR #1)
**Goal:** Create folder structure without moving files  
**Risk:** Low  
**Time:** 1 hour

- [ ] Create `src/domains/` folder structure
- [ ] Create `src/infrastructure/` folder structure
- [ ] Add README.md files explaining structure
- [ ] No file moves yet - just scaffolding

**Validation:**
- Structure matches proposed layout
- README files explain purpose

---

### Phase 2: Move Infrastructure (PR #2)
**Goal:** Move pure infrastructure code first  
**Risk:** Low (least dependencies)  
**Time:** 2-3 hours

**Files to move:**
- [ ] `lib/prisma.ts` → `infrastructure/database/prisma.ts`
- [ ] `lib/cache.ts` → `infrastructure/cache/cache.ts`
- [ ] `lib/logger.ts` → `infrastructure/logging/logger.ts`
- [ ] `lib/enhanced-logger.ts` → `infrastructure/logging/enhanced.ts`
- [ ] `lib/currency.ts` → `infrastructure/utils/currency.ts`
- [ ] `lib/pagination.ts` → `infrastructure/utils/pagination.ts`
- [ ] `lib/utils.ts` → `infrastructure/utils/cn.ts`
- [ ] `lib/rate-limit.ts` → `infrastructure/security/rate-limit.ts`
- [ ] `lib/security.ts` → `infrastructure/security/security.ts`
- [ ] `lib/stripe.ts` → `infrastructure/external/stripe/client.ts`
- [ ] `lib/imagekit.ts` → `infrastructure/external/imagekit/client.ts`
- [ ] `lib/db-optimization.ts` → `infrastructure/db/optimization.ts`
- [ ] `lib/web-vitals.ts` → `infrastructure/monitoring/web-vitals.ts`
- [ ] `lib/request-context.ts` → `infrastructure/monitoring/request-context.ts`
- [ ] `lib/env.ts` → `infrastructure/env/env.ts`
- [ ] `lib/init.ts` → `infrastructure/init/init.ts`

**Update imports:**
- [ ] Update all imports to new paths
- [ ] Run `bun run typecheck` to verify
- [ ] Run tests

**Validation:**
- All imports updated
- Typecheck passes
- Tests pass
- No runtime errors

---

### Phase 3: Move Domain Logic - Product (PR #3)
**Goal:** Extract product domain  
**Risk:** Medium (many dependencies)  
**Time:** 4-5 hours

**Files to move:**
- [ ] `lib/pricing/*` → `domains/product/services/pricing/*`
- [ ] `lib/recommendations.ts` → `domains/product/services/recommendations.ts`
- [ ] Product SEO from `lib/seo.ts` → `domains/product/services/seo.ts`
- [ ] `lib/ai/product-generator.ts` → Extract domain logic to `domains/product/services/analysis.ts`

**Update imports:**
- [ ] Update all product-related imports
- [ ] Keep AI client in infrastructure, domain calls it

**Validation:**
- Product pricing tests pass
- Recommendations work
- Product pages load correctly

---

### Phase 4: Move Domain Logic - Image & SKU (PR #4)
**Goal:** Extract image and SKU domains  
**Risk:** Medium  
**Time:** 3-4 hours

**Image Domain:**
- [ ] `lib/image-validation.ts` → `domains/image/validation/requirements.ts`
- [ ] Image parsing from `lib/utils/image-parser.ts` → `domains/image/parsing/metadata.ts`
- [ ] Non-admin helpers from `lib/image-helpers.ts` → `domains/image/helpers/urls.ts`
- [ ] `lib/imagekit-sync.ts` → Split into `domains/image/pipeline/{sync,upload,retry}.ts`

**SKU Domain:**
- [ ] SKU validation from `lib/utils/image-parser.ts` → `domains/sku/validation.ts`
- [ ] SKU generation from `lib/utils/image-parser.ts` → `domains/sku/generation.ts` (future)

**Update imports:**
- [ ] Update all image and SKU imports
- [ ] Fix image upload components
- [ ] Fix SKU validation in product creation

**Validation:**
- Image upload works
- SKU validation works
- Product creation works

---

### Phase 5: Move Admin Domain (PR #5)
**Goal:** Extract admin-specific code  
**Risk:** High (many files, security-sensitive)  
**Time:** 5-6 hours

**Files to move:**
- [ ] `lib/auth-admin.ts` → `domains/admin/auth.ts`
- [ ] `lib/analytics/*` → `domains/admin/analytics/*` (split large files)
- [ ] `lib/csv-export.ts` → `domains/admin/exports/csv.ts`
- [ ] `lib/email/reportSender.ts` → `domains/admin/email/reports.ts`
- [ ] Admin email function from `lib/email.ts` → `domains/admin/email.ts`
- [ ] Admin preview from `lib/image-helpers.ts` → `domains/admin/image/preview.ts`

**Split large files:**
- [ ] `lib/analytics/queries.ts` (810 lines) → Split into:
  - `domains/admin/analytics/revenue.ts`
  - `domains/admin/analytics/approvals.ts`
  - `domains/admin/analytics/products.ts`
  - `domains/admin/analytics/categories.ts`

**Update imports:**
- [ ] Update all admin route imports
- [ ] Update all admin page imports
- [ ] Ensure non-admin code cannot import admin modules

**Validation:**
- Admin dashboard works
- Admin analytics work
- Non-admin pages don't break
- Security: Verify admin-only routes still protected

---

### Phase 6: Move Remaining Domains (PR #6)
**Goal:** Category, User, Order domains  
**Risk:** Low-Medium  
**Time:** 3-4 hours

**Category Domain:**
- [ ] `lib/category-config.ts` → `domains/category/config.ts`
- [ ] `lib/server/categories.ts` → `domains/category/validation.ts`

**User Domain:**
- [ ] `lib/auth.ts` → `domains/user/auth.ts`
- [ ] Non-admin from `lib/auth-helpers.ts` → `domains/user/helpers.ts`

**Order Domain:**
- [ ] Create structure for future order/cart logic
- [ ] No files to move yet (logic in API routes)

**Update imports:**
- [ ] Update category imports
- [ ] Update auth imports
- [ ] Verify login/logout works

**Validation:**
- Category pages work
- Authentication works
- User profiles work

---

### Phase 7: Cleanup & Finalization (PR #7)
**Goal:** Remove old structure, update docs  
**Risk:** Low  
**Time:** 1-2 hours

- [ ] Delete empty `/lib` folders
- [ ] Update import paths in remaining files
- [ ] Update documentation
- [ ] Update ADRs
- [ ] Add migration guide to CONTRIBUTING.md

**Validation:**
- No remaining imports from old `/lib` structure
- All tests pass
- Documentation updated
- Build succeeds

---

## Part E: Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking imports during migration | High | High | Update imports in same PR as file move. Use IDE refactoring tools. Run full test suite. |
| Circular dependencies | Medium | Medium | Review dependency graph before moving. Domains can import infrastructure, not vice versa. |
| Admin code accidentally exposed | Low | High | Add ESLint rule preventing non-admin code from importing `domains/admin/`. Use barrel exports with access control. |
| Merge conflicts | Medium | Low | Migrate in small, focused PRs. Coordinate with team. |
| Performance regression | Low | Medium | Monitor bundle size and runtime performance. No logic changes, only structural. |
| Test failures | Medium | Medium | Move tests with code. Ensure test infrastructure updated. |
| Developer confusion | Medium | Low | Clear documentation in README files. Migration guide in CONTRIBUTING.md. |

---

## Part F: Benefits After Migration

### 1. Clear Domain Boundaries
- ✅ Easy to see what belongs to which domain
- ✅ Clear ownership and responsibility
- ✅ Easier onboarding for new developers

### 2. Better Security
- ✅ Admin code isolated - easier to audit
- ✅ Can add ESLint rules preventing cross-boundary imports
- ✅ Clear separation of concerns

### 3. Improved Testability
- ✅ Domain logic testable without infrastructure
- ✅ Can mock infrastructure easily
- ✅ Unit tests don't require database/external services

### 4. Easier Maintenance
- ✅ Changes in one domain don't affect others
- ✅ Smaller, focused files easier to understand
- ✅ Reduced cognitive load

### 5. Better Scalability
- ✅ Can extract domains to microservices later
- ✅ Clear API boundaries
- ✅ Domain logic can evolve independently

---

## Part G: Metrics

**Current State:**
- Total files in `/lib`: 89
- Files with domain logic: 23
- Files with admin logic: 9
- God files (>500 lines): 2
- Cross-domain files: 6

**Target State:**
- Files in `/domains/`: ~45
- Files in `/infrastructure/`: ~35
- God files: 0
- Cross-domain files: 0
- Admin isolation: 100%

---

## Part H: Recommendations

### Immediate Actions (This Week)
1. ✅ **Approve this audit report**
2. ✅ **Create Phase 1 PR** - Scaffold new structure
3. ✅ **Review migration plan** with team

### Short Term (Next 2 Weeks)
1. **Phase 2 & 3** - Infrastructure + Product domain
2. **Add ESLint rules** - Prevent cross-domain imports
3. **Update documentation** - Architecture decisions

### Medium Term (Next Month)
1. **Phase 4-6** - Complete domain migration
2. **Phase 7** - Cleanup and finalization
3. **Add domain tests** - Test domain logic in isolation

### Long Term (Ongoing)
1. **Monitor** - Ensure new code follows structure
2. **Refine** - Adjust structure based on learnings
3. **Document** - Keep architecture docs up to date

---

## References

- [ADR-0001: Repository Structure](decisions/ADR-0001-repo-structure.md)
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- Current codebase: `src/lib/`
- Proposed structure: See Part C

---

**Next Steps:** Review and approve this audit, then proceed with Phase 1 migration.
