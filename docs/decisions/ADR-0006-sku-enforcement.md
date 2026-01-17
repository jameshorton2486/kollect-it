# ADR-0006: SKU Enforcement End-to-End

**Status:** Proposed  
**Date:** January 2026  
**Deciders:** Development Team  
**Supersedes:** ADR-0003 (SKU Format Standard) - Enforcement gaps

## Context

SKU format standardization exists (ADR-0003), but enforcement is incomplete across the system. Current implementation shows:

- ✅ SKU validation exists in product creation API
- ❌ SKU not enforced at image upload boundaries
- ❌ SKU not enforced in Google Drive sync flows
- ❌ SKU not enforced in admin edit flows
- ❌ Format inconsistency: ADR specifies `CAT-YYYY-NNNN`, code uses `SKU-YYYY-XXX`
- ❌ No CI tests enforcing SKU invariants

**Risks:**
- Duplicate SKUs can be created
- Broken analytics and inventory tracking
- SKU format drift between ADR and implementation
- No automated enforcement of SKU uniqueness

## Decision

We will enforce SKU format and uniqueness at **all entry points**:

### Format Standardization

**Current State:** Code uses `SKU-YYYY-XXX` format, but ADR-0003 specifies `CAT-YYYY-NNNN`

**Decision:** Standardize on `SKU-YYYY-XXX` format for simplicity and consistency with existing implementation:
- `SKU`: Literal prefix
- `YYYY`: Year (4 digits)
- `XXX`: Sequential number within year (3 digits, zero-padded)

**Rationale:** 
- Already implemented and working
- Simpler than category-prefixed format
- Can be migrated to `CAT-YYYY-NNNN` later if needed (Phase 2)
- Focus on enforcement first, optimization later

### Enforcement Points

All SKU operations must pass through these checks:

1. **Product Creation** (`POST /api/admin/products/create`)
   - ✅ Format validation
   - ✅ Uniqueness check
   - ✅ Database constraint

2. **Image Upload** (`POST /api/imagekit-auth`, ImageUpload components)
   - ❌ **MUST ADD:** SKU validation if SKU provided
   - ❌ **MUST ADD:** SKU → image binding validation

3. **Google Drive Sync** (`scripts/sync-drive-to-imagekit.ts`, `watch-google-drive.ts`)
   - ❌ **MUST ADD:** SKU format validation on product JSON
   - ❌ **MUST ADD:** SKU uniqueness check before sync

4. **Admin Edit Flows** (`PUT/PATCH /api/admin/products/*`)
   - ✅ SKU immutability (enforced by governance test)
   - ✅ Existing products validated on read

5. **Bulk Operations** (`POST /api/admin/products/bulk-approve`)
   - ❌ **MUST ADD:** SKU validation for each product
   - ❌ **MUST ADD:** Batch uniqueness check

### CI Enforcement

Add invariant tests that fail the build if:

- SKU format doesn't match `/^SKU-\d{4}-\d{3}$/`
- SKU appears in update operations (immutability)
- SKU validation is bypassed at any enforcement point
- Duplicate SKUs are detected in test data

## Implementation Plan

### Phase 1: Standardize Format (This PR)
- [ ] Update ADR-0003 to reflect `SKU-YYYY-XXX` as canonical format
- [ ] Ensure all validation uses `validateSKU()` from `src/lib/utils/image-parser.ts`
- [ ] Add CI tests for format and uniqueness

### Phase 2: Add Missing Enforcement (Next PR)
- [ ] Add SKU validation to image upload endpoints
- [ ] Add SKU validation to Google Drive sync scripts
- [ ] Add SKU validation to bulk operations
- [ ] Add SKU → image binding validation

### Phase 3: Migration (Future)
- [ ] Consider migrating to `CAT-YYYY-NNNN` format if needed
- [ ] Add category code mapping if format changes

## Hard Rules

- ❌ **No SKU modification** after product creation (immutability)
- ❌ **No bypass** of SKU validation at any entry point
- ❌ **No duplicate SKUs** - enforced at database and application level
- ✅ **All SKUs** must match `/^SKU-\d{4}-\d{3}$/` format
- ✅ **All SKU operations** must use centralized `validateSKU()` function

## Enforcement Tests

See `tests/governance/sku-enforcement.test.ts`:
- SKU immutability test
- SKU format centralization test
- Single SKU format pattern test

## Consequences

### Positive
- ✅ Consistent SKU format across all entry points
- ✅ Automated enforcement via CI tests
- ✅ Reduced risk of duplicate SKUs
- ✅ Clear enforcement boundaries

### Negative
- ⚠️ Requires updates to image upload flows
- ⚠️ Requires updates to Google Drive sync scripts
- ⚠️ May break existing test data if format is enforced strictly

## References

- [ADR-0003: SKU Format Standard](ADR-0003-sku-format.md) - Original format decision
- `src/lib/utils/image-parser.ts` - SKU validation functions
- `tests/governance/sku-enforcement.test.ts` - Governance tests
- `src/app/api/admin/products/create/route.ts` - Primary creation endpoint
