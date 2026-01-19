# Codebase Audit — Design System, Accessibility, SEO, Performance

**Date:** 2026-01-15

## Scope
This audit reviews the current implementation of the design system, accessibility, SEO, and performance across the Next.js codebase.

## Design System
**What’s in place**
- Tailwind configuration defines a luxury-focused palette (`lux-*`), legacy color aliases, typography tokens, spacing, shadows, and animation primitives. (See `tailwind.config.ts`.)
- Global CSS tokens set system-level colors, typography families, spacing/radius/shadow tokens, and typography utility classes. (See `src/app/globals.css`.)
- Documentation defines baseline palette and typography guidelines and references `src/components/` for component implementations. (See `docs/design/README.md`.)

**Risks / Gaps**
- Multiple palette layers exist (lux + legacy + aesop), which increases the risk of inconsistent usage and visual drift if components mix systems.
- Utility classes are defined twice for luxury transitions in `globals.css`, suggesting possible duplication and maintenance overhead.

**Recommendations**
- Decide on a deprecation timeline for legacy palettes and add usage linting (or a design-system checklist) so new work favors `lux-*` tokens.
- Consolidate repeated utilities in `globals.css` to reduce redundancy and avoid diverging behavior.

## Accessibility (A11y)
**What’s in place**
- A skip-to-content link and focus-visible ring styles are present at the layout level. (See `src/app/layout.tsx`.)
- Navigation landmarks and focus styles are provided for primary navigation and interactive elements in the header/footer. (See `src/components/Header.tsx` and `src/components/Footer.tsx`.)

**Risks / Gaps**
- The newsletter email input in the footer uses a placeholder but no associated label or `aria-label`, which can fail form labeling requirements.
- Instances of `text-lux-gold` on light backgrounds may need contrast validation for WCAG AA compliance given the gold palette token definitions.

**Recommendations**
- Add an explicit `<label>` or `aria-label` to the newsletter input.
- Run automated contrast checks (e.g., axe/Lighthouse) for gold-on-light combinations and adjust tokens or use alternative text colors where contrast is insufficient.

## SEO
**What’s in place**
- Global metadata (title template, OpenGraph, Twitter) is set in the root layout. (See `src/app/layout.tsx`.)
- Per-page metadata is provided for key routes (home, categories, etc.). (See `src/app/page.tsx` and `src/app/categories/page.tsx`.)
- Product pages generate dynamic metadata, canonical URLs, and include JSON-LD structured data for products. (See `src/app/product/[slug]/page.tsx`.)
- Robots and sitemap are defined via Next.js metadata routes. (See `src/app/robots.ts` and `src/app/sitemap.ts`.)

**Risks / Gaps**
- Ensure canonical URLs align with routing (for example, `/product/[slug]` paths) and that legacy `/shop` routes are redirected as expected. (See `next.config.js`.)

**Recommendations**
- Validate canonical/OG URLs in production to confirm they match the deployed domain and routing behavior.
- Consider adding structured data for category and organization pages if those routes are important for search discovery.

## Performance
**What’s in place**
- Next.js configuration includes caching headers, console stripping in production, and static asset caching. (See `next.config.js`.)
- Pages use ISR (`revalidate = 60`) for content like the home page and product pages. (See `src/app/page.tsx` and `src/app/product/[slug]/page.tsx`.)

**Risks / Gaps**
- `images.unoptimized = true` disables Next.js image optimization globally, which can significantly impact LCP and bandwidth usage on image-heavy pages. (See `next.config.js`.)
- Multiple components use raw `<img>` tags instead of `next/image`, which bypasses built-in optimization and responsive loading behavior. (See `src/components/search/SearchResults.tsx` and `src/components/product/ProductReviews.tsx`.)

**Recommendations**
- Re-enable Next.js image optimization once the timeout issue is resolved, or scope `unoptimized` to only the problematic image sets.
- Replace raw `<img>` usage with `next/image` (or add explicit width/height and `loading="lazy"` attributes) for consistent optimization and layout stability.

## Commands Run
- `ls`
- `find .. -name AGENTS.md -print`
- `sed -n '1,200p' README.md`
- `sed -n '1,200p' docs/README.md`
- `ls docs/design`
- `sed -n '1,200p' docs/design/README.md`
- `cat components.json`
- `sed -n '1,240p' tailwind.config.ts`
- `sed -n '240,520p' tailwind.config.ts`
- `sed -n '1,200p' src/app/layout.tsx`
- `ls docs/seo`
- `sed -n '1,200p' docs/seo/README.md`
- `sed -n '1,240p' src/components/Header.tsx`
- `sed -n '240,520p' src/components/Header.tsx`
- `sed -n '1,240p' src/components/Footer.tsx`
- `sed -n '1,240p' src/app/globals.css`
- `sed -n '240,520p' src/app/globals.css`
- `rg -n "performance" docs -g"*.md"`
- `sed -n '1,200p' docs/AUDIT_SUMMARY.md`
- `sed -n '1,200p' next.config.js`
- `rg -n "metadata" src/app`
- `sed -n '1,200p' src/app/page.tsx`
- `rg -n "next/image|<img" src/components src/app`
- `sed -n '220,320p' src/components/search/SearchResults.tsx`
- `sed -n '1,120p' src/app/categories/page.tsx`
- `rg -n "schema|jsonld|structured" src/app src/components`
- `sed -n '1,220p' src/app/product/[slug]/page.tsx`
- `ls public`
- `cat public/robots.txt`
- `rg -n "sitemap" .`
- `sed -n '1,200p' src/app/robots.ts`
- `sed -n '1,200p' src/app/sitemap.ts`
- `sed -n '150,260p' src/components/product/ProductReviews.tsx`
