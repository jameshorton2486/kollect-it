# CI Enforcement Design — Image & SKU

**Status:** Design Document  
**Date:** December 2024  
**Purpose:** Governance tests to prevent regression and enforce domain rules

---

## 🎯 Why CI (Not Just Code)

These tests:
- ✅ Prevent regression
- ✅ Protect domain rules
- ✅ Enforce discipline even with AI assistance
- ✅ Make violations visible immediately

---

## 🖼️ Image Pipeline CI Checks

### Test 1 — Raw Image Exposure

**Objective:** Fail if any public URL references an upload bucket

**Method:**
- Scan codebase for ImageKit upload URLs
- Check for direct bucket references
- Verify all images use transformation URLs

**Failure Condition:**
- Any URL that doesn't include transformation parameters
- Any direct reference to upload bucket
- Any raw image URL in public-facing code

**Implementation:**
```typescript
// Pseudo-code (not actual implementation)
test('no raw image URLs in listings', () => {
  const codebase = scanFiles(['src/app/**/*.tsx', 'src/components/**/*.tsx']);
  const violations = findRawImageUrls(codebase);
  expect(violations).toHaveLength(0);
});
```

### Test 2 — Mandatory Transform

**Objective:** Fail if an image bypasses processing function

**Method:**
- Check all image upload endpoints
- Verify all use transformation pipeline
- Ensure no direct ImageKit uploads

**Failure Condition:**
- Image upload that doesn't go through `/lib/images/ingestion.ts`
- Direct ImageKit API calls from client
- Bypass of transformation logic

**Implementation:**
```typescript
// Pseudo-code
test('all images use transformation pipeline', () => {
  const uploadEndpoints = findImageUploadEndpoints();
  uploadEndpoints.forEach(endpoint => {
    expect(endpoint.usesTransformationPipeline).toBe(true);
  });
});
```

### Test 3 — Single Ingestion Path

**Objective:** Fail if multiple upload endpoints exist

**Method:**
- Count image upload API routes
- Verify single ingestion point
- Check for duplicate upload logic

**Failure Condition:**
- More than one image upload endpoint
- Duplicate upload logic in different files
- Multiple entry points for image processing

**Implementation:**
```typescript
// Pseudo-code
test('single image ingestion path', () => {
  const uploadEndpoints = findImageUploadEndpoints();
  expect(uploadEndpoints.length).toBe(1);
  expect(uploadEndpoints[0].path).toBe('/api/admin/products/images/upload');
});
```

---

## 🏷️ SKU Enforcement CI Checks

### Test 1 — SKU Immutability

**Objective:** Fail if SKU is written in update paths

**Method:**
- Scan product update endpoints
- Check for SKU field in update payloads
- Verify SKU is excluded from updates

**Failure Condition:**
- SKU field in update request body
- SKU modification in update handlers
- Any code path that changes SKU after creation

**Implementation:**
```typescript
// Pseudo-code
test('SKU immutable after creation', () => {
  const updateEndpoints = findProductUpdateEndpoints();
  updateEndpoints.forEach(endpoint => {
    expect(endpoint.acceptsSKU).toBe(false);
    expect(endpoint.modifiesSKU).toBe(false);
  });
});
```

### Test 2 — Central Validation

**Objective:** Fail if SKU format logic appears outside authority module

**Method:**
- Scan codebase for SKU format patterns
- Verify all validation uses central function
- Check for duplicate regex patterns

**Failure Condition:**
- SKU format regex outside `/lib/domain/sku.ts`
- Duplicate validation logic
- Inline SKU format checks

**Implementation:**
```typescript
// Pseudo-code
test('SKU validation centralized', () => {
  const skuPatterns = findSKUFormatPatterns();
  const centralModule = 'lib/domain/sku.ts';
  skuPatterns.forEach(pattern => {
    expect(pattern.file).toBe(centralModule);
  });
});
```

### Test 3 — Duplicate Format Detection

**Objective:** Fail if multiple SKU regex patterns exist

**Method:**
- Find all SKU format regex patterns
- Verify single pattern definition
- Check for pattern variations

**Failure Condition:**
- Multiple SKU format regex patterns
- Pattern variations in different files
- Inconsistent format definitions

**Implementation:**
```typescript
// Pseudo-code
test('single SKU format pattern', () => {
  const patterns = findAllSKUPatterns();
  const uniquePatterns = new Set(patterns);
  expect(uniquePatterns.size).toBe(1);
});
```

---

## 🔧 Implementation Strategy

### Phase 1: Design (Current)
- ✅ Test requirements documented
- ✅ Failure conditions defined
- ✅ Implementation approach outlined

### Phase 2: Implementation (Future)
- Create test infrastructure
- Implement checks
- Add to CI pipeline
- Monitor for violations

### Phase 3: Enforcement (Future)
- Fail builds on violations
- Report violations clearly
- Document fixes required

---

## 📋 Test Infrastructure Requirements

### Tools Needed

- Code scanning (AST parsing)
- Pattern matching (regex)
- File system traversal
- Test framework integration

### CI Integration

- Run on every PR
- Fail build on violations
- Report violations in PR comments
- Block merge on failure

---

## 🎯 Success Criteria

After implementation:

- ✅ All image pipeline violations caught
- ✅ All SKU violations caught
- ✅ Clear error messages
- ✅ Fast execution (< 30 seconds)
- ✅ No false positives

---

## 📚 References

- [ADR-0005: Unified Image Pipeline](../decisions/ADR-0005-image-pipeline.md)
- [ADR-0003: SKU Format](../decisions/ADR-0003-sku-format.md)
- [Image Pipeline Design](IMAGE_PIPELINE_DESIGN.md)
- [SKU Enforcement Audit](SKU_ENFORCEMENT_AUDIT.md)

---

**These are governance tests, not unit tests. They enforce architectural decisions, not functionality.**
