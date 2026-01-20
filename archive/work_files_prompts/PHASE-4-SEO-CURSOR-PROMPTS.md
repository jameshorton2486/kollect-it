# PHASE 4: SEO & Metadata Verification
## Cursor AI Prompts for Kollect-It

---

## Prompt 4.1 — SEO Infrastructure Audit

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Perform a comprehensive audit of SEO implementation including metadata, structured data, and technical SEO elements.

# CONTEXT
- Project: Kollect-It (luxury antiques marketplace)
- Production URL: https://kollect-it.com
- E-commerce marketplace requiring Product schema
- Must support social sharing (OG, Twitter cards)
- Target audience: collectors, antique enthusiasts

# FILES TO ANALYZE
- src/app/layout.tsx (root metadata)
- src/app/*/page.tsx (page-level metadata)
- src/app/product/[slug]/page.tsx (product pages - critical)
- src/app/category/[slug]/page.tsx (category pages)
- src/app/sitemap.xml/route.ts or src/app/sitemap.ts
- src/app/robots.txt/route.ts or src/app/robots.ts
- src/components/seo/ (any SEO components)

# VERIFICATION CHECKLIST

1. **Root Metadata (layout.tsx)**
   - [ ] title.default and title.template configured
   - [ ] description present and compelling (under 160 chars)
   - [ ] metadataBase set to https://kollect-it.com
   - [ ] openGraph object complete (type, siteName, title, description, images)
   - [ ] twitter card configuration (card type, site, creator)
   - [ ] icons/favicon configured

2. **Page-Level Metadata**
   Verify `export const metadata` or `generateMetadata` exists for:
   - [ ] Homepage (/)
   - [ ] Browse/Shop (/browse, /shop)
   - [ ] Category pages (/category/[slug])
   - [ ] Product pages (/product/[slug]) — CRITICAL
   - [ ] About (/about)
   - [ ] Contact (/contact)
   - [ ] FAQ (/faq)
   - [ ] Legal pages (/terms, /privacy, /refund-policy)

3. **Dynamic Metadata (Product Pages)**
   - [ ] generateMetadata function fetches product data
   - [ ] Title includes product name
   - [ ] Description includes key product details
   - [ ] OG image uses product image
   - [ ] Price in meta tags (if applicable)

4. **Structured Data (JSON-LD)**
   - [ ] Product schema on /product/[slug] pages
   - [ ] Includes: name, description, image, price, availability
   - [ ] Proper @context ("https://schema.org")
   - [ ] Valid @type ("Product")
   - [ ] Offer schema nested with price, priceCurrency, availability

5. **Technical SEO**
   - [ ] sitemap.xml generates dynamically with all products
   - [ ] robots.txt allows crawling of important pages
   - [ ] robots.txt blocks /admin/, /api/, /checkout/
   - [ ] Canonical URLs set via metadataBase
   - [ ] No accidental noindex on public pages

6. **Social Sharing**
   - [ ] Default OG image exists (/og-default.jpg or similar)
   - [ ] OG image dimensions: 1200x630 recommended
   - [ ] Twitter card type: summary_large_image
   - [ ] Product pages use product image for OG

# OUTPUT FORMAT
```markdown
## SEO Infrastructure Audit Report

### Executive Summary
- Overall SEO readiness: [Ready/Needs Work/Critical Issues]
- Metadata coverage: X/Y pages
- Structured data: [Present/Partial/Missing]

### Root Metadata (layout.tsx)
| Element | Status | Value/Notes |
|---------|--------|-------------|
| title.default | ✅/❌ | [value] |
| title.template | ✅/❌ | [value] |
| description | ✅/❌ | [length] chars |
| metadataBase | ✅/❌ | [URL] |
| openGraph | ✅/❌ | [complete/partial] |
| twitter | ✅/❌ | [card type] |

### Page-Level Metadata Coverage
| Page | metadata | generateMetadata | Status |
|------|----------|------------------|--------|
| / (home) | ✅/❌ | N/A | |
| /browse | ✅/❌ | N/A | |
| /product/[slug] | N/A | ✅/❌ | CRITICAL |
| /category/[slug] | N/A | ✅/❌ | |
| /about | ✅/❌ | N/A | |
| /contact | ✅/❌ | N/A | |
| /terms | ✅/❌ | N/A | |
| /privacy | ✅/❌ | N/A | |

### Structured Data (JSON-LD)
| Page Type | Schema | Status | Notes |
|-----------|--------|--------|-------|
| Product | Product + Offer | ✅/❌ | |
| Homepage | Organization | ✅/❌ | Optional |
| Category | CollectionPage | ✅/❌ | Optional |

### Technical SEO
| Element | Status | Notes |
|---------|--------|-------|
| sitemap.xml | ✅/❌ | [dynamic/static] |
| robots.txt | ✅/❌ | [properly configured] |
| Canonical URLs | ✅/❌ | via metadataBase |

### Critical Issues (Must Fix Before Launch)
1. [Issue and fix]

### Recommendations (Post-Launch OK)
1. [Improvement suggestion]
```

# CONSTRAINTS
- Verify presence and correctness, not content quality
- Product pages are CRITICAL — must have complete metadata
- Note missing items but don't block launch for optional schemas
- Report only — do not modify files without approval
```

---

## Prompt 4.2 — Product Page SEO Deep Dive

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Deep audit of product page SEO implementation — the most critical pages for an e-commerce site.

# CONTEXT
- Product pages drive organic traffic and conversions
- Must have complete metadata for search engines
- Must have structured data for rich snippets
- Dynamic metadata based on product data

# FILE TO ANALYZE
- src/app/product/[slug]/page.tsx

# VERIFICATION CHECKLIST

1. **generateMetadata Function**
   - [ ] Function exists and is exported
   - [ ] Fetches product data from database
   - [ ] Handles missing product gracefully (404)
   - [ ] Returns complete Metadata object

2. **Metadata Fields**
   - [ ] title: Includes product name
   - [ ] description: Includes key details (condition, era, category)
   - [ ] openGraph.title: Product name
   - [ ] openGraph.description: Compelling description
   - [ ] openGraph.images: Product image URL
   - [ ] openGraph.type: "product" or "website"
   - [ ] twitter.card: "summary_large_image"
   - [ ] twitter.images: Product image

3. **JSON-LD Structured Data**
   Must include:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Product",
     "name": "[product name]",
     "description": "[product description]",
     "image": "[product image URL]",
     "sku": "[SKU if available]",
     "brand": {
       "@type": "Brand",
       "name": "[brand or 'Kollect-It']"
     },
     "offers": {
       "@type": "Offer",
       "price": "[price]",
       "priceCurrency": "USD",
       "availability": "https://schema.org/InStock",
       "url": "[product URL]"
     }
   }
   ```

4. **Image Optimization**
   - [ ] Product images have descriptive alt text
   - [ ] OG image uses absolute URL
   - [ ] Image dimensions appropriate for social sharing

5. **URL Structure**
   - [ ] Slug is SEO-friendly (lowercase, hyphens)
   - [ ] Canonical URL correctly set

# OUTPUT FORMAT
```markdown
## Product Page SEO Audit

### generateMetadata Function
- Status: ✅ Present / ❌ Missing
- Product data fetch: ✅/❌
- Error handling: ✅/❌

### Metadata Completeness
| Field | Present | Value/Pattern |
|-------|---------|---------------|
| title | ✅/❌ | `${product.title} – Kollect-It` |
| description | ✅/❌ | [length] chars |
| og:title | ✅/❌ | |
| og:description | ✅/❌ | |
| og:image | ✅/❌ | [absolute URL?] |
| og:type | ✅/❌ | |
| twitter:card | ✅/❌ | |

### JSON-LD Structured Data
- Location: [inline script / component]
- Schema type: Product ✅/❌
- Required fields:
  | Field | Present | Notes |
  |-------|---------|-------|
  | name | ✅/❌ | |
  | description | ✅/❌ | |
  | image | ✅/❌ | |
  | offers.price | ✅/❌ | |
  | offers.priceCurrency | ✅/❌ | |
  | offers.availability | ✅/❌ | |

### Issues Found
1. [Critical/High/Medium] [Issue description]

### Recommended Fixes
[Code snippets if needed]
```

# CONSTRAINTS
- This is the highest priority SEO page
- All fields should be present
- JSON-LD must be valid (test with Google Rich Results Test)
```

---

## Prompt 4.3 — Sitemap & Robots.txt Verification

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Verify sitemap.xml and robots.txt are correctly configured for search engine crawling.

# CONTEXT
- Sitemap should include all public pages and products
- Robots.txt should allow crawling but block sensitive areas
- Both should be dynamically generated in Next.js

# FILES TO ANALYZE
- src/app/sitemap.ts or src/app/sitemap.xml/route.ts
- src/app/robots.ts or src/app/robots.txt/route.ts

# SITEMAP VERIFICATION

1. **Implementation**
   - [ ] Using Next.js built-in sitemap generation
   - [ ] Returns array of URL objects
   - [ ] Includes lastModified dates

2. **URL Coverage**
   Must include:
   - [ ] Homepage (/)
   - [ ] Static pages (/about, /contact, /faq, etc.)
   - [ ] Category pages (/category/[slug]) — dynamic
   - [ ] Product pages (/product/[slug]) — dynamic
   - [ ] Legal pages (/terms, /privacy)

   Must NOT include:
   - [ ] Admin pages (/admin/*)
   - [ ] API routes (/api/*)
   - [ ] Auth pages (/login, /register) — optional
   - [ ] Checkout pages (/checkout/*)

3. **Product URLs**
   - [ ] Fetches all published products from database
   - [ ] Uses correct URL format (https://kollect-it.com/product/[slug])
   - [ ] Includes lastModified from product.updatedAt

4. **Priority & Frequency** (optional but good)
   - [ ] Homepage: priority 1.0, changeFrequency: daily
   - [ ] Products: priority 0.8, changeFrequency: weekly
   - [ ] Categories: priority 0.7, changeFrequency: weekly
   - [ ] Static pages: priority 0.5, changeFrequency: monthly

# ROBOTS.TXT VERIFICATION

1. **Allow Rules**
   - [ ] Allow: / (allow all by default)
   - [ ] Sitemap: https://kollect-it.com/sitemap.xml

2. **Disallow Rules**
   Should block:
   - [ ] Disallow: /admin/
   - [ ] Disallow: /api/
   - [ ] Disallow: /checkout/
   - [ ] Disallow: /_next/
   - [ ] Disallow: /account/ (user private pages)

3. **User-Agent**
   - [ ] User-agent: * (applies to all crawlers)

# OUTPUT FORMAT
```markdown
## Sitemap & Robots.txt Audit

### Sitemap (sitemap.xml)
- Implementation: [Next.js sitemap.ts / Custom route / Missing]
- Location: [file path]

#### URL Coverage
| Page Type | Included | Count | Notes |
|-----------|----------|-------|-------|
| Homepage | ✅/❌ | 1 | |
| Static pages | ✅/❌ | X | |
| Categories | ✅/❌ | X | Dynamic |
| Products | ✅/❌ | X | Dynamic |
| Admin | ❌ | 0 | Correctly excluded |
| API | ❌ | 0 | Correctly excluded |

#### Configuration
- lastModified: ✅/❌
- changeFrequency: ✅/❌
- priority: ✅/❌

### Robots.txt
- Implementation: [Next.js robots.ts / Static file / Missing]
- Location: [file path]

#### Rules
| Rule | Status | Value |
|------|--------|-------|
| User-agent | ✅/❌ | * |
| Allow | ✅/❌ | / |
| Disallow /admin | ✅/❌ | |
| Disallow /api | ✅/❌ | |
| Disallow /checkout | ✅/❌ | |
| Sitemap | ✅/❌ | [URL] |

### Issues
1. [Issue and recommendation]

### Sample Output
[Show what sitemap.xml and robots.txt should output]
```

# CONSTRAINTS
- Both files must exist for proper SEO
- Test URLs should be absolute (include https://kollect-it.com)
- Verify database query for products doesn't timeout
```

---

## Prompt 4.4 — Missing Metadata Generator

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Generate metadata exports for pages that are missing SEO configuration.

# CONTEXT
- Following patterns established in layout.tsx
- Each page needs unique, relevant metadata
- Must include title, description, openGraph, twitter

# TEMPLATE PATTERN
```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "[Page-Specific Title]",
  description: "[Compelling description, 150-160 characters, includes keywords]",
  openGraph: {
    title: "[Page Title] – Kollect-It",
    description: "[Same or similar to meta description]",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "[Page Title]",
    description: "[Same description]",
  },
};
```

# PAGES TO CHECK AND GENERATE

For each page listed below, check if metadata exists. If missing, generate appropriate metadata:

1. **src/app/about/page.tsx**
   - Title: "About Us – Our Story & Mission"
   - Focus: Company story, expertise, trust

2. **src/app/contact/page.tsx**
   - Title: "Contact Us – Get in Touch"
   - Focus: Customer service, inquiries

3. **src/app/faq/page.tsx**
   - Title: "Frequently Asked Questions"
   - Focus: Common questions, help

4. **src/app/browse/page.tsx** (or /shop)
   - Title: "Browse Collection – Antiques & Collectibles"
   - Focus: Shopping, discovery

5. **src/app/consign/page.tsx**
   - Title: "Sell With Us – Consignment Services"
   - Focus: Sellers, consignment process

6. **src/app/terms/page.tsx**
   - Title: "Terms of Service"
   - Focus: Legal, terms

7. **src/app/privacy/page.tsx**
   - Title: "Privacy Policy"
   - Focus: Legal, data protection

8. **src/app/refund-policy/page.tsx**
   - Title: "Refund Policy"
   - Focus: Returns, refunds

# OUTPUT FORMAT
```markdown
## Metadata Generation Report

### Pages With Existing Metadata ✅
- [page]: [current title]

### Pages Missing Metadata (Generated Below)
[For each missing page, provide complete code block]

#### [Page Name] — src/app/[path]/page.tsx

Add this at the top of the file (after imports, before component):

```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "[Generated Title]",
  description: "[Generated description ~155 chars]",
  openGraph: {
    title: "[Title] – Kollect-It",
    description: "[Description]",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "[Title]",
    description: "[Description]",
  },
};
```
```

# CONSTRAINTS
- Keep descriptions under 160 characters
- Use natural language, include relevant keywords
- Match the luxury brand voice (professional, trustworthy, curated)
- Don't duplicate the root layout metadata exactly
```

---

## Prompt 4.5 — JSON-LD Schema Generator

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Verify and generate JSON-LD structured data for improved search engine rich snippets.

# CONTEXT
- Product pages should have Product schema (CRITICAL)
- Homepage could have Organization schema (RECOMMENDED)
- Category pages could have CollectionPage schema (OPTIONAL)

# PRIORITY ORDER
1. Product schema on /product/[slug] — MUST HAVE
2. Organization schema on homepage — SHOULD HAVE
3. BreadcrumbList on product/category pages — NICE TO HAVE

# PRODUCT SCHEMA TEMPLATE (for product pages)
```typescript
const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.title,
  description: product.description,
  image: product.images[0]?.url,
  sku: product.sku,
  brand: {
    "@type": "Brand",
    name: product.brand || "Kollect-It",
  },
  offers: {
    "@type": "Offer",
    price: product.price,
    priceCurrency: "USD",
    availability: product.status === "ACTIVE" 
      ? "https://schema.org/InStock" 
      : "https://schema.org/OutOfStock",
    url: `https://kollect-it.com/product/${product.slug}`,
    seller: {
      "@type": "Organization",
      name: "Kollect-It",
    },
  },
  ...(product.condition && {
    itemCondition: `https://schema.org/${product.condition}Condition`,
  }),
};

// In the page component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
/>
```

# ORGANIZATION SCHEMA TEMPLATE (for homepage)
```typescript
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kollect-It",
  url: "https://kollect-it.com",
  logo: "https://kollect-it.com/logo.png",
  description: "Curated marketplace for fine antiques, rare books, collectibles, and militaria.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Antonio",
    addressRegion: "TX",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-469-386-6065",
    contactType: "customer service",
    email: "info@kollect-it.com",
  },
  sameAs: [
    // Add social media URLs when available
  ],
};
```

# VERIFICATION TASKS

1. **Check Product Page**
   - Does JSON-LD script exist?
   - Are all required fields populated?
   - Is it valid JSON?

2. **Check Homepage**
   - Is Organization schema present?
   - If missing, provide implementation

3. **Validate Schemas**
   - Recommend testing with: https://search.google.com/test/rich-results
   - Recommend testing with: https://validator.schema.org/

# OUTPUT FORMAT
```markdown
## JSON-LD Structured Data Audit

### Product Pages (/product/[slug])
- Schema present: ✅/❌
- Location: [line number or "not found"]
- Fields:
  | Field | Present | Value/Pattern |
  |-------|---------|---------------|
  | @type | ✅/❌ | Product |
  | name | ✅/❌ | |
  | description | ✅/❌ | |
  | image | ✅/❌ | |
  | offers.price | ✅/❌ | |
  | offers.availability | ✅/❌ | |

### Homepage (/)
- Organization schema: ✅/❌
- If missing, add this code: [provide code block]

### Recommendations
1. [Priority] [Recommendation]

### Validation URLs
- Test Product schema: https://search.google.com/test/rich-results?url=https://kollect-it.com/product/[sample-slug]
- Test Homepage: https://search.google.com/test/rich-results?url=https://kollect-it.com
```

# CONSTRAINTS
- Product schema is required for e-commerce SEO
- Use actual product data, not placeholder values
- Ensure JSON is valid (no trailing commas, proper escaping)
```

---

## Quick Reference: Phase 4 Prompts

| Prompt | Purpose | Priority |
|--------|---------|----------|
| **4.1** | Full SEO infrastructure audit | High — run first |
| **4.2** | Product page deep dive | Critical — most important pages |
| **4.3** | Sitemap & robots.txt | High — affects crawling |
| **4.4** | Generate missing metadata | Medium — fill gaps |
| **4.5** | JSON-LD schema check | Medium — rich snippets |

**Recommended order:** 4.1 → 4.2 → 4.3 → 4.4 (if gaps found) → 4.5

---

*Copy each prompt individually into Cursor AI. Run in sequence for comprehensive SEO coverage.*
