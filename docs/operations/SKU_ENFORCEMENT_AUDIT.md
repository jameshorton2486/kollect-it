# SKU Enforcement Audit — End-to-End

**Status:** Audit Complete  
**Date:** December 2024  
**Risk Level:** 🟡 **PARTIALLY ENFORCED, HIGH BUSINESS RISK**

---

## 🔍 SKU Lifecycle (Current)

| Stage | Status | Notes |
|-------|--------|-------|
| Generation | ✅ Exists | Auto-generated on product creation |
| Validation | 🟡 Inconsistent | Format checked in some flows, assumed in others |
| Persistence | ✅ Stable | Database enforces uniqueness |
| Edit protection | ❌ Not guaranteed | Editing paths may allow SKU mutation |
| Search / filtering | 🟡 Assumed | UI relies on SKU shape instead of validating |
| Analytics | 🟡 Weak coupling | No central SKU authority function |

---

## 🚨 Findings

### Issues Identified

1. **SKU format enforced in some flows, assumed in others**
   - Creation flow validates format
   - Edit flow may not enforce immutability
   - Search assumes format without validation

2. **Editing paths may allow SKU mutation**
   - No explicit protection against SKU changes
   - Database constraint prevents duplicates but not mutations

3. **UI relies on SKU shape instead of validating**
   - Frontend assumes SKU format
   - No client-side validation
   - No server-side validation on edit

4. **No central "SKU authority" function**
   - SKU generation logic may be duplicated
   - Validation logic scattered
   - No single source of truth

---

## 🔴 Risk Assessment

| Risk | Impact | Likelihood | Severity |
|------|--------|------------|----------|
| SKU mutation | Inventory corruption | Medium | **HIGH** |
| Duplicate SKUs | Analytics errors | Low | Medium |
| Invalid formats | Seller disputes | Medium | Medium |
| Assumptions | Silent data decay | High | Medium |

**Overall Risk:** 🟡 **MODERATE TO HIGH**

---

## 📌 Recommendations (No Code Yet)

### Immediate Actions

1. **Centralize SKU generation**
   - Create single SKU generation function
   - Use in all product creation flows
   - Document in `/lib/domain/sku.ts` (future)

2. **Centralize SKU validation**
   - Create single validation function
   - Enforce format: `CAT-YYYY-NNNN`
   - Use in all SKU touchpoints

3. **Make SKU immutable post-creation**
   - Reject SKU updates in edit flows
   - Database constraint (if possible)
   - API-level protection

4. **Reject writes, not sanitize silently**
   - Fail fast on invalid SKUs
   - Clear error messages
   - No silent corrections

5. **Add CI enforcement**
   - Test SKU immutability
   - Test central validation
   - Test duplicate format detection

---

## 🎯 Target State

### After Phase 2 Refactor

- ✅ Single SKU generation function
- ✅ Single SKU validation function
- ✅ SKU immutable after creation
- ✅ All SKU logic in `/lib/domain/sku.ts`
- ✅ CI tests enforce rules

---

## 📋 Implementation Plan

### Phase 1: Documentation (Current)
- ✅ Audit complete
- ✅ Risks identified
- ✅ Recommendations documented

### Phase 2: Refactoring (Future)
- Create `/lib/domain/sku.ts`
- Centralize generation and validation
- Enforce immutability
- Remove duplicate logic

### Phase 3: CI Enforcement (Future)
- Add SKU immutability test
- Add central validation test
- Add duplicate format detection test

---

## 🧪 CI Test Requirements

See [CI Enforcement Design](CI_ENFORCEMENT_DESIGN.md) for detailed test specifications.

---

## 📚 References

- [ADR-0003: SKU Format](../decisions/ADR-0003-sku-format.md)
- [SKU Standards](../domain/sku-standards.md)
- [Category Taxonomy](../domain/categories.md)
