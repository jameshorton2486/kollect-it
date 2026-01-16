# SEO Strategy

This directory documents search engine optimization for Kollect-It listings and pages.

## 🔍 Listing SEO

### Title Best Practices

**Format:** `[Year] [Material] [Item Type] [Condition]`

**Examples:**
- ✅ "1950s Walnut Mid-Century Modern Dining Table"
- ✅ "Vintage Rolex Submariner Watch 1975"
- ✅ "1920s Art Deco Emerald Brooch Excellent"
- ❌ "Nice Antique"
- ❌ "Great Deal!"

### Description Optimization

Include:
1. Item type and material
2. Condition and wear description
3. Dimensions and weight
4. Provenance or history
5. Authenticity details
6. Keywords naturally (don't keyword-stuff)

**Length:** 150-300 words minimum

### Metadata

- **Meta Description:** 155 characters, includes category and condition
- **Alt Text:** Descriptive for all images
- **Canonical URL:** Auto-set by Next.js

## 🏷️ Schema Markup

All listings include Schema.org:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "1950s Walnut Dining Table",
  "description": "...",
  "offers": {
    "@type": "Offer",
    "url": "https://kollect-it.com/listings/...",
    "priceCurrency": "USD",
    "price": "850"
  },
  "image": "https://ik.imagekit.io/...",
  "author": {
    "@type": "Person",
    "name": "Seller Name"
  }
}
```

## 📱 Mobile Optimization

- Responsive images (srcset)
- Fast page load (ImageKit CDN)
- Touch-friendly buttons (44px minimum)
- Readable text (minimum 16px on mobile)

## 🔗 Internal Linking

- Link related listings in description
- Link category pages in navigation
- Link seller profile from listings
- Use descriptive anchor text

## 📊 Performance Metrics

Target performance:

| Metric | Target |
|--------|--------|
| **Core Web Vitals** | Green |
| **Page Load Time** | < 2s |
| **First Contentful Paint** | < 1s |
| **Cumulative Layout Shift** | < 0.1 |

---

**Last Updated:** January 2026
**Maintained by:** SEO Team
