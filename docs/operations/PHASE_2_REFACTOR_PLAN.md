# Phase 2 Refactor Plan

**Status:** Planning Document  
**Date:** December 2024  
**⚠️ This is not cleanup. This is intentional restructuring.**

---

## 🎯 Phase 2 Objectives

1. Eliminate duplication
2. Lock domain rules
3. Centralize invariants
4. Preserve existing behavior

---

## 📦 Proposed Phase 2 Scope

### 1. `/lib` Consolidation

**Create `/lib/domain/` structure:**

```
lib/
├── domain/
│   ├── sku.ts          # SKU generation, validation, authority
│   ├── categories.ts   # Category normalization, validation
│   ├── condition.ts    # Condition grading logic
│   └── provenance.ts  # Provenance validation
```

**Extract:**
- SKU logic → `/lib/domain/sku.ts`
- Image rules → `/lib/images/` (separate module)
- Category normalization → `/lib/domain/categories.ts`
- Condition grading → `/lib/domain/condition.ts`

**Benefits:**
- Clear domain boundaries
- Reusable domain logic
- Easier testing
- No UI leakage

### 2. Image Pipeline

**Introduce `/lib/images/` module:**

```
lib/
├── images/
│   ├── ingestion.ts    # Single ingestion endpoint logic
│   ├── transform.ts    # All transformations
│   ├── validation.ts   # Image validation
│   └── cdn.ts         # CDN URL generation
```

**Actions:**
- Move all transformations server-side
- Delete client-side transformation logic
- Enforce single ingestion path
- Centralize all image processing

**Reference:** [ADR-0005: Unified Image Pipeline](../decisions/ADR-0005-image-pipeline.md)

### 3. SKU Authority

**Introduce single SKU module:**

```
lib/
├── domain/
│   └── sku.ts         # SKU authority module
```

**Functions:**
- `generateSKU(category, year)` - Centralized generation
- `validateSKU(sku)` - Format validation
- `isImmutable(sku)` - Immutability check
- `parseSKU(sku)` - Parse components

**All writes go through it:**
- Product creation → `generateSKU()`
- Product updates → `isImmutable()` check
- Import flows → `validateSKU()`

---

## 🚫 Out of Scope (Phase 2)

- ❌ UI redesigns
- ❌ Performance optimization
- ❌ New features
- ❌ Schema changes (unless required)
- ❌ Database migrations (unless required for immutability)

---

## 📋 Phase 2 Entry Conditions

Phase 2 must not begin until:

- ✅ ADR-0005 accepted (Image Pipeline)
- ✅ ADR-0003 accepted (SKU Format)
- ✅ CI tests in place (enforcement)
- ✅ Repo hygiene clean (Phase 1 complete)
- ✅ Team alignment on approach

**Current Status:**
- ✅ ADR-0005 created
- ✅ ADR-0003 exists
- 🟡 CI tests designed (not yet implemented)
- ✅ Repo hygiene in progress
- ✅ Documentation complete

---

## 🔄 Refactoring Strategy

### Approach

1. **Create new structure** (don't break existing)
2. **Migrate incrementally** (file by file)
3. **Update imports** (gradually)
4. **Remove old code** (after migration)
5. **Add tests** (before removing old)

### Risk Mitigation

- Keep old code until new code is proven
- Feature flags if needed
- Comprehensive testing
- Gradual rollout

---

## 📊 Success Criteria

After Phase 2:

- ✅ No duplicate image logic
- ✅ No duplicate SKU logic
- ✅ No duplicate category logic
- ✅ All domain rules centralized
- ✅ All transformations server-side
- ✅ SKU immutable after creation
- ✅ CI tests enforce rules
- ✅ No breaking changes to functionality

---

## 🧪 Testing Requirements

### Before Phase 2

- [ ] CI enforcement tests designed
- [ ] Test infrastructure ready
- [ ] Baseline tests passing

### During Phase 2

- [ ] Unit tests for new modules
- [ ] Integration tests for pipelines
- [ ] Regression tests for existing features

### After Phase 2

- [ ] All tests passing
- [ ] CI enforcement active
- [ ] No performance regressions

---

## 📚 References

- [ADR-0005: Unified Image Pipeline](../decisions/ADR-0005-image-pipeline.md)
- [ADR-0003: SKU Format](../decisions/ADR-0003-sku-format.md)
- [Image Pipeline Design](IMAGE_PIPELINE_DESIGN.md)
- [SKU Enforcement Audit](SKU_ENFORCEMENT_AUDIT.md)
- [CI Enforcement Design](CI_ENFORCEMENT_DESIGN.md)

---

**⚠️ Do not begin Phase 2 until all entry conditions are met.**
