# Components Domain Leakage Audit

**Status:** Audit Complete  
**Date:** December 2024  
**Scope:** `src/components/` directory

---

## 🎯 Objective

Identify domain logic that has leaked into UI components and should be moved to `/lib/domain/` during Phase 2 refactoring.

---

## 🔴 Critical Findings

### 1. SKU Validation Logic

**Location:** `src/components/admin/ProductUploadForm.tsx`

**Issue:**
- Imports `validateSKU` from `@/lib/utils/image-parser`
- SKU validation logic should be in `/lib/domain/sku.ts`
- Component directly calls validation function

**Code:**
```typescript
import { validateSKU } from "@/lib/utils/image-parser";
// ...
const validation = validateSKU(value);
```

**Action:** Move to `/lib/domain/sku.ts` in Phase 2

---

### 2. Condition Constants Hardcoded

**Location:** `src/components/CategoryFilters.tsx`

**Issue:**
- Condition values hardcoded as constant array
- Should reference centralized condition definitions
- Inconsistent with ADR-0007 condition grading

**Code:**
```typescript
const CONDITIONS = ["Fine", "Very Good", "Good", "Fair"] as const;
```

**Action:** Reference `/lib/domain/condition.ts` in Phase 2

---

### 3. Category Data Hardcoded

**Location:** `src/components/home/ShopByCategoriesClient.tsx`

**Issue:**
- Category data hardcoded in component
- Should fetch from API or reference domain constants
- Duplicates category taxonomy

**Code:**
```typescript
const categories = [
  { slug: "rare-books", title: "Rare Manuscripts", ... },
  { slug: "militaria", title: "Historic Militaria", ... },
  // ...
];
```

**Action:** Fetch from API or reference `/lib/domain/categories.ts` in Phase 2

---

### 4. Condition Values Inconsistent

**Location:** `src/components/search/SearchResults.tsx`

**Issue:**
- Different condition values than CategoryFilters
- Uses: "mint", "near-mint", "excellent", "good", "fair"
- Should match ADR-0007: "Fine", "Very Good", "Good", "Fair"

**Code:**
```typescript
options: [
  { value: "mint", label: "Mint", count: 0 },
  { value: "near-mint", label: "Near Mint", count: 0 },
  // ...
]
```

**Action:** Standardize to ADR-0007 values in Phase 2

---

## 🟡 Moderate Findings

### 5. Price Formatting Duplication

**Locations:**
- `src/components/Search.tsx` - `formatUSD0`
- `src/components/admin/OrderDetailsPanel.tsx` - Inline formatting
- Multiple other components

**Issue:**
- Price formatting logic duplicated across components
- Should be centralized utility function

**Action:** Create `/lib/utils/formatting.ts` or similar

---

### 6. Category Code Mapping Missing

**Issue:**
- No centralized category code mapping (FA, RB, CL, ML)
- SKU generation may be inconsistent
- Should be in `/lib/domain/categories.ts`

**Action:** Create category code mapping in Phase 2

---

## ✅ Acceptable Patterns

### Display Logic Only
- `ProductCard.tsx` - Display only, no business logic
- `ProductInfo.tsx` - Display only, no validation
- `ProductTabs.tsx` - Display only, no domain rules

### UI State Management
- Form validation (email, required fields) - Acceptable in components
- UI state (loading, errors) - Acceptable in components

---

## 📋 Phase 2 Refactoring Plan

### Priority 1: Critical Domain Leakage

1. **Move SKU validation** → `/lib/domain/sku.ts`
   - Create `validateSKU()` function
   - Create `generateSKU()` function
   - Update `ProductUploadForm.tsx` to import from domain

2. **Centralize condition constants** → `/lib/domain/condition.ts`
   - Export `CONDITION_GRADES` constant
   - Update `CategoryFilters.tsx` to import
   - Fix `SearchResults.tsx` to use correct values

3. **Centralize category data** → `/lib/domain/categories.ts`
   - Export category code mapping
   - Export category constants
   - Update `ShopByCategoriesClient.tsx` to fetch from API

### Priority 2: Utility Consolidation

4. **Centralize price formatting** → `/lib/utils/formatting.ts`
   - Create `formatPrice()` function
   - Update all components to use centralized function

---

## 🎯 Success Criteria

After Phase 2:

- ✅ No domain logic in components
- ✅ All SKU logic in `/lib/domain/sku.ts`
- ✅ All condition logic in `/lib/domain/condition.ts`
- ✅ All category logic in `/lib/domain/categories.ts`
- ✅ Components only handle UI and display
- ✅ Business rules testable in isolation

---

## 📚 References

- [ADR-0003: SKU Format](../decisions/ADR-0003-sku-format.md)
- [ADR-0006: Category Taxonomy](../decisions/ADR-0006-category-taxonomy.md)
- [ADR-0007: Condition Grading](../decisions/ADR-0007-condition-grading.md)
- [Phase 2 Refactor Plan](PHASE_2_REFACTOR_PLAN.md)

---

**Last Updated:** December 2024
