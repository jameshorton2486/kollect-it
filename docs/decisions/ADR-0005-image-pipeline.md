# ADR-0005: Unified Image Processing Pipeline

**Status:** Accepted  
**Date:** December 2024  
**Deciders:** Development Team

## Context

Images are a core trust and value signal in the Kollect-It marketplace. Inconsistent image sizing, backgrounds, metadata, or delivery directly impacts SEO, buyer confidence, and seller disputes.

Current implementation shows multiple image entry points and partial enforcement of standards. This creates:
- Inconsistent product presentation
- SEO degradation risk
- Seller disputes
- Performance regressions

## Decision

Kollect-It will enforce a **single, unified, server-side image pipeline** with the following guarantees:

- All images pass through a centralized ingestion layer
- Transformations are mandatory, not optional
- Raw uploads are never publicly exposed
- Output images conform to documented size, format, and quality standards
- Public delivery occurs only via a controlled CDN

Client-side image logic is limited to previewing only.

## Pipeline Guarantees

1. **Deterministic output dimensions** - All images conform to preset sizes
2. **Background normalization** - Consistent presentation
3. **Metadata stripping** - Privacy and security
4. **CDN-backed delivery URLs** - Performance and reliability
5. **Immutable processed assets** - Once processed, assets don't change

## Implementation Boundaries

### Client Responsibilities
- Upload initiation
- Preview display
- **Never transforms**
- **Never stores final URLs**

### Server Responsibilities
- Owns ALL transformations
- Owns validation
- Owns storage
- Owns CDN URLs

## Hard Rules

- ❌ No raw image URLs in listings
- ❌ No client-side resizing
- ❌ No bypass paths (edit = same pipeline)
- ❌ No conditional enforcement

## Enforcement Points

1. **API layer** - Single ingestion endpoint
2. **`/lib/images`** - Future consolidation point
3. **CI tests** - Automated enforcement checks

## Consequences

### Positive
- ✅ Consistent product presentation
- ✅ Improved SEO and performance
- ✅ Reduced support and dispute risk
- ✅ Clear enforcement surface for tests and CI
- ✅ Predictable image behavior

### Negative
- ⚠️ Requires refactoring existing image logic
- ⚠️ Client-side preview may need adjustment
- ⚠️ Migration of existing images may be needed

## Alternatives Considered

1. **Client-side processing** - Rejected: Inconsistent, insecure, unreliable
2. **Optional transformations** - Rejected: Leads to inconsistency
3. **Multiple ingestion paths** - Rejected: Current problem we're solving

## References

- [Image Pipeline Design](../operations/IMAGE_PIPELINE_DESIGN.md)
- [Image Requirements](../images/image-requirements.md)
- [Processing Pipeline](../images/processing-pipeline.md)
- [ADR-0002: Image Pipeline](ADR-0002-image-pipeline.md) - Original decision
