# ADR-0002: Image Processing Pipeline

**Status:** Accepted  
**Date:** December 2024  
**Deciders:** Development Team

## Context

Kollect-It requires a robust image processing pipeline for product photos. Images must be:
- Optimized for web delivery
- Consistent in quality and format
- Served via CDN for performance
- Transformable for different use cases (thumbnails, detail views, admin previews)

## Decision

We will use **ImageKit** as our image processing and CDN service:

1. **Upload**: Images uploaded to ImageKit via API
2. **Storage**: Images stored in ImageKit's cloud storage
3. **Transformation**: On-the-fly transformations via URL parameters
4. **CDN Delivery**: Global CDN for fast image delivery
5. **Multiple Formats**: Automatic WebP conversion for modern browsers

## Implementation Details

- ImageKit integration in `src/lib/image-helpers.ts`
- Transformation presets for:
  - Product grid thumbnails
  - Product detail views
  - Admin preview images
- Image upload component in `src/components/admin/ImageUpload.tsx`

## Consequences

### Positive
- ✅ Fast, optimized image delivery
- ✅ Automatic format conversion
- ✅ On-the-fly transformations
- ✅ Global CDN performance
- ✅ Reduced server load

### Negative
- ⚠️ Dependency on ImageKit service
- ⚠️ Additional cost for high traffic
- ⚠️ Requires ImageKit API keys

## Alternatives Considered

1. **Self-hosted with Sharp**: More control but requires infrastructure
2. **Cloudinary**: Similar to ImageKit but different pricing model
3. **AWS S3 + CloudFront**: More complex setup, requires more code

## References

- [ImageKit Setup Guide](../integrations/IMAGEKIT_SETUP.md)
- Image helpers: `src/lib/image-helpers.ts`
