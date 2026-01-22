# Kollect-It Critical Fixes Summary

**Date:** January 22, 2026  
**Priority:** CRITICAL - Must fix before production testing

---

## Executive Summary

Two critical issues were identified that could break the desktop-to-website product ingestion workflow:

1. **Draft products appearing publicly** - Fixed by changing `status: 'active'` to `status: 'draft'` on ingestion
2. **SKU format mismatch** - Fixed by unifying validation to accept `PREFIX-YYYY-NNNN` format

---

## Issue 1: Draft Product Visibility (CRITICAL)

### Problem
- Ingest API creates products with `isDraft: true` BUT `status: 'active'`
- Public API only filters on `status: 'active'`, not `isDraft`
- Result: Draft products can appear in public listings and be cached publicly

### Root Cause
```typescript
// Line 322-323 in ingest/route.ts (BEFORE)
isDraft: true,
status: 'active',  // ← BUG: Should be 'draft'
```

### Fix Applied
```typescript
// Line 322-323 in ingest/route.ts (AFTER)
isDraft: true,
status: 'draft',  // ← FIXED: Now 'draft'
```

Additionally, the public products API now has defense-in-depth:
```typescript
// Added to public API where clause
const where: Prisma.ProductWhereInput = {
  status: "active",
  isDraft: false,  // ← ADDED: Belt-and-suspenders
};
```

---

## Issue 2: SKU Format Mismatch (CRITICAL)

### Problem
Three different SKU formats across systems:

| System | Format | Example | Pattern |
|--------|--------|---------|---------|
| Desktop App | `PREFIX-YYYY-NNNN` | `MILI-2025-0001` | 3-4 letters, 4 digits |
| Ingest API | `KOL-YYYY-NNNN` | `KOL-2025-0001` | KOL only, 4 digits |
| Admin Tools | `SKU-YYYY-XXX` | `SKU-2025-001` | SKU only, 3 digits |

Desktop app generates category-prefixed SKUs that the ingest API rejects.

### Fix Applied
Created unified SKU validation that accepts BOTH formats:

**New Standard Format:** `PREFIX-YYYY-NNNN`
- PREFIX: 3-4 uppercase letters (category code)
- YYYY: 4-digit year (2020 to current+1)
- NNNN: 4-digit sequence (0001-9999)

**Examples:**
- `MILI-2025-0001` (Militaria)
- `COLL-2025-0042` (Collectibles)
- `BOOK-2026-0001` (Rare Books)
- `ARTS-2025-0003` (Fine Art)
- `KOL-2025-0001` (General/Legacy)

**Backwards Compatible:** Legacy `SKU-YYYY-XXX` format still accepted for existing products.

---

## Files Modified

| File | Change |
|------|--------|
| `src/app/api/admin/products/ingest/route.ts` | Fixed status + SKU validation |
| `src/app/api/products/route.ts` | Added isDraft filter |
| `src/lib/utils/image-parser.ts` | Updated SKU validation for both formats |
| `src/lib/sku-validation.ts` | NEW: Unified SKU validation module |

---

## Deployment Instructions

### Step 1: Apply Fixes
```powershell
cd C:\projects\kollect-it-main
.\apply-critical-fixes.ps1
```

This will:
- Create timestamped backups in `backups/critical-fixes-{timestamp}/`
- Apply all fixed files
- Clean up `.fixed` temp files
- Log all changes

### Step 2: Build & Test
```powershell
npm run build
npm run dev
```

### Step 3: Test Desktop App Integration
1. Open desktop app
2. Create test product with category prefix SKU (e.g., `MILI-2026-0001`)
3. Publish to website
4. Verify product appears in admin panel as draft
5. Verify product does NOT appear on public shop page
6. Approve product in admin
7. Verify product now appears publicly

### Step 4: Deploy
```powershell
git add .
git commit -m "Fix: Draft visibility + SKU format standardization"
git push origin main
```

---

## Verification Checklist

- [ ] Build succeeds without errors
- [ ] Desktop app can generate category-prefixed SKUs
- [ ] Ingest API accepts new SKU format
- [ ] Ingest API rejects invalid SKU formats
- [ ] Ingested products have status='draft'
- [ ] Draft products don't appear in public shop
- [ ] Approved products (status='active', isDraft=false) appear publicly
- [ ] Admin can still create products with SKU-YYYY-XXX format
- [ ] Existing products with old SKU format still work

---

## Rollback Instructions

If issues occur, restore from backup:
```powershell
# Find your backup folder
dir backups\critical-fixes-*

# Copy back original files
copy backups\critical-fixes-{timestamp}\src\app\api\admin\products\ingest\route.ts src\app\api\admin\products\ingest\route.ts
copy backups\critical-fixes-{timestamp}\src\app\api\products\route.ts src\app\api\products\route.ts
copy backups\critical-fixes-{timestamp}\src\lib\utils\image-parser.ts src\lib\utils\image-parser.ts
# The sku-validation.ts is new, can be deleted if needed
```

---

## Desktop App SKU Configuration

The desktop app's `sku_scanner.py` generates SKUs in the format `PREFIX-YYYY-NNNN`. The category prefixes are:

| Category | Prefix | Example |
|----------|--------|---------|
| Militaria | `MILI` | `MILI-2025-0001` |
| Collectibles | `COLL` | `COLL-2025-0042` |
| Rare Books | `BOOK` | `BOOK-2026-0001` |
| Fine Art | `ARTS` | `ARTS-2025-0003` |

These prefixes are configurable in the desktop app's category configuration.

---

## Related Documentation

- `docs/OPERATOR_RUNBOOK_PRODUCT_INGESTION.md` - Full ingestion workflow
- `docs/FIRST-PRODUCT-TEST-CHECKLIST.md` - Testing checklist
- `product-application/desktop-app/modules/sku_scanner.py` - Desktop SKU generation
