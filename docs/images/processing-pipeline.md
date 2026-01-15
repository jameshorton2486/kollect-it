# Image Processing Pipeline

**Status:** Active  
**Last Updated:** December 2024

## Overview

Kollect-It uses ImageKit for image processing and CDN delivery.

## Pipeline Flow

1. **Upload**: Image uploaded to ImageKit via API
2. **Storage**: Stored in ImageKit cloud storage
3. **Transformation**: On-the-fly transformations via URL parameters
4. **CDN Delivery**: Served via global CDN

## Transformation Presets

### Product Grid
- Width: Auto (responsive)
- Format: WebP
- Quality: 80
- Crop: Smart

### Product Detail
- Width: 1200px
- Format: WebP
- Quality: 85
- Crop: Center

### Admin Preview
- Width: 200px
- Format: WebP
- Quality: 75
- Crop: Center

## Implementation

- ImageKit integration: `src/lib/image-helpers.ts`
- Upload component: `src/components/admin/ImageUpload.tsx`
- Helper functions: `getProductGridImageUrl()`, `getProductDetailImageUrl()`, `getAdminPreviewImageUrl()`

## References

- [Image Requirements](image-requirements.md)
- [CDN Strategy](cdn-strategy.md)
- [ADR-0002: Image Pipeline](../decisions/ADR-0002-image-pipeline.md)
