# Unified Image Pipeline Design

**Status:** Design Document  
**Last Updated:** December 2024  
**Reference:** [ADR-0005: Unified Image Processing Pipeline](../decisions/ADR-0005-image-pipeline.md)

## 🎯 Design Goal

A single source of truth for how images enter, transform, and exit the system.

---

## 🔁 Pipeline Flow (Authoritative)

```
Client Upload
   ↓
Server Ingestion Endpoint
   ↓
Validation (type, size, count)
   ↓
Normalization
   - Resize
   - Background cleanup
   - Orientation fix
   ↓
Optimization
   - Format conversion
   - Compression
   ↓
Metadata Stripping
   ↓
Storage (processed only)
   ↓
CDN URL Generation
   ↓
Public Listing Display
```

---

## 🧱 Boundaries (Strict)

### Client Responsibilities

- ✅ Upload initiation
- ✅ Preview display
- ❌ **Never transforms**
- ❌ **Never stores final URLs**

### Server Responsibilities

- ✅ Owns ALL transformations
- ✅ Owns validation
- ✅ Owns storage
- ✅ Owns CDN URLs

---

## 🛑 Hard Rules

- ❌ **No raw image URLs in listings**
- ❌ **No client-side resizing**
- ❌ **No bypass paths** (edit = same pipeline)
- ❌ **No conditional enforcement**

---

## 📌 Enforcement Points

1. **API Layer** - Single ingestion endpoint
   - All uploads must go through `/api/admin/products/images/upload` (or equivalent)
   - No direct ImageKit uploads from client

2. **`/lib/images`** - Future consolidation point
   - All transformation logic centralized here
   - No duplicate image processing code

3. **CI Tests** - Automated enforcement
   - Test 1: Raw image exposure check
   - Test 2: Mandatory transform check
   - Test 3: Single ingestion path check

---

## 🔄 Current vs. Target State

### Current State (Problems)

- Multiple upload entry points
- Client-side transformations
- Inconsistent enforcement
- Raw images sometimes exposed
- Duplicate logic across components

### Target State (After Phase 2)

- Single server-side ingestion
- Mandatory transformations
- All images via CDN
- Centralized logic in `/lib/images`
- CI-enforced rules

---

## 📋 Implementation Phases

### Phase 1: Documentation & ADR (Current)
- ✅ ADR-0005 created
- ✅ Design documented
- ✅ Rules defined

### Phase 2: Refactoring (Future)
- Consolidate image logic
- Create `/lib/images` module
- Remove client-side transformations
- Enforce single ingestion path

### Phase 3: CI Enforcement (Future)
- Add pipeline tests
- Enforce in CI/CD
- Monitor for violations

---

## 🧪 CI Test Requirements

See [CI Enforcement Design](CI_ENFORCEMENT_DESIGN.md) for detailed test specifications.

---

## 📚 References

- [ADR-0005: Unified Image Pipeline](../decisions/ADR-0005-image-pipeline.md)
- [Image Requirements](../images/image-requirements.md)
- [Processing Pipeline](../images/processing-pipeline.md)
- [CDN Strategy](../images/cdn-strategy.md)
