# Image Processing Module

**Purpose:** Unified image processing pipeline per ADR-0005.

## Structure

This module will contain (after Phase 2 refactoring):

- `ingestion.ts` - Single image ingestion endpoint logic
- `transform.ts` - All image transformations
- `validation.ts` - Image validation rules
- `cdn.ts` - CDN URL generation

## Rules

- ✅ All transformations server-side only
- ✅ Mandatory processing (no bypass)
- ✅ Single ingestion path
- ❌ No client-side transformations
- ❌ No raw image exposure

## Status

**Current:** Folder structure created  
**Phase 2:** Will be populated during refactoring

**Reference:** [ADR-0005: Unified Image Pipeline](../../../docs/decisions/ADR-0005-image-pipeline.md)
