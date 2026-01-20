# Kollect-It Final Stabilization & Go-Live
## Professional Cursor AI Prompt Library

**Purpose:** Production-ready prompts for systematic codebase verification and launch preparation  
**Project:** Kollect-It (Next.js 16 / TypeScript / Prisma / Supabase)  
**Date:** January 18, 2026

---

## How to Use This Document

1. Copy the entire prompt (including the context block) into Cursor AI
2. Run one prompt at a time in sequence
3. Review output before proceeding to next phase
4. Document any findings in your project notes

---

# PHASE 1: Design System Verification

## Prompt 1.1 — Tailwind Configuration Audit

```
@workspace

# OBJECTIVE
Perform a comprehensive audit of the Tailwind CSS configuration to verify design system completeness and internal consistency.

# CONTEXT
- Project: Kollect-It (luxury antiques marketplace)
- Design system uses `lux-*` color tokens as primary palette
- Typography: Cormorant Garamond (serif/headlines) + Inter (sans/body)
- Must support both light luxury aesthetic and accessibility requirements

# FILES TO ANALYZE
- tailwind.config.ts
- src/app/globals.css (for cross-reference)

# VERIFICATION CHECKLIST
Confirm the presence and completeness of:

1. **Color System**
   - [ ] `lux-*` palette (black, ink, charcoal, white, pearl, cream, gray variants, gold)
   - [ ] Legacy compatibility layer (ink-*, surface-*, border-*)
   - [ ] Semantic colors (error, success, warning, info)
   - [ ] No orphaned or duplicate color definitions

2. **Typography**
   - [ ] Font family variables (--font-serif, --font-sans, --font-logo)
   - [ ] Font size scale with line-height configurations
   - [ ] Display sizes for hero sections
   - [ ] Heading hierarchy tokens

3. **Spacing**
   - [ ] Consistent spacing scale (xs through 3xl)
   - [ ] Section spacing tokens
   - [ ] Grid gap utilities

4. **Visual Effects**
   - [ ] Shadow system (clean, soft, elevated, gold-soft)
   - [ ] Border radius scale
   - [ ] Transition duration tokens

5. **Animations**
   - [ ] Keyframe definitions
   - [ ] Animation utility classes
   - [ ] Proper easing functions

# OUTPUT FORMAT
Provide a structured report:
- ✅ COMPLETE: [item] — [brief confirmation]
- ⚠️ REVIEW: [item] — [concern and recommendation]
- ❌ MISSING: [item] — [what needs to be added]

# CONSTRAINTS
- DO NOT suggest changes unless something is definitively missing or broken
- DO NOT refactor working code
- This is a READ-ONLY verification audit
```

---

## Prompt 1.2 — CSS Variables & Utilities Audit

```
@workspace

# OBJECTIVE
Verify that CSS custom properties in globals.css align with Tailwind configuration and provide complete utility coverage.

# CONTEXT
- Design system version: 1.0 (December 2025)
- CSS variables must match Tailwind token values exactly
- Utility classes must follow luxury design language

# FILES TO ANALYZE
- src/app/globals.css
- tailwind.config.ts (for cross-reference)

# VERIFICATION CHECKLIST

1. **CSS Variable Alignment**
   - [ ] All `--lux-*` variables defined with correct HSL values
   - [ ] Typography variables (--font-serif, --font-sans, etc.)
   - [ ] Spacing tokens match Tailwind extend.spacing
   - [ ] Shadow variables match Tailwind extend.boxShadow
   - [ ] Border radius variables consistent

2. **Typography Utilities**
   - [ ] `.heading-page` — responsive sizing, gold color, serif font
   - [ ] `.heading-section` — secondary heading style
   - [ ] `.heading-subsection` — tertiary heading style
   - [ ] `.lead` — intro paragraph styling
   - [ ] `.text-label` — uppercase micro text
   - [ ] `.text-muted` — secondary information

3. **Layout Utilities**
   - [ ] Section spacing classes (.section-tight, .section-normal, .section-grand)
   - [ ] Grid gap utilities (.gap-standard, .gap-luxury, .gap-hero)
   - [ ] Card padding standards

4. **Component Utilities**
   - [ ] Button classes (.btn-primary, .btn-secondary)
   - [ ] Shadow utilities mapping to CSS variables
   - [ ] Gradient backgrounds
   - [ ] Divider styles

5. **Animation & Effects**
   - [ ] Keyframe definitions
   - [ ] Animation classes
   - [ ] Skeleton/shimmer loading states
   - [ ] Transition utilities

6. **Browser Compatibility**
   - [ ] Custom scrollbar styling
   - [ ] Print styles
   - [ ] Focus-visible states

# OUTPUT FORMAT
```markdown
## CSS Variables Audit Report

### Alignment Status
| Category | Tailwind | CSS Vars | Status |
|----------|----------|----------|--------|
| Colors   | X tokens | Y vars   | ✅/⚠️/❌ |
...

### Utility Classes
- [Class name]: [Status] [Notes]

### Recommendations
1. [If any]
```

# CONSTRAINTS
- Report mismatches only — do not auto-fix
- Preserve existing naming conventions
- This is verification, not refactoring
```

---

# PHASE 2: Component Consistency Verification

## Prompt 2.1 — Design Token Usage Audit

```
@workspace

# OBJECTIVE
Verify that all components consistently use the established design token system with zero legacy/generic Tailwind color classes.

# CONTEXT
- Previous audit found 230+ instances of generic gray-* classes
- All issues should now be resolved
- Must confirm zero regressions

# SCOPE
- All files in src/components/
- All files in src/app/ (excluding api/)

# SEARCH PATTERNS TO VERIFY AS ZERO

## Prohibited Patterns (should return 0 results)
- `text-gray-100` through `text-gray-900`
- `bg-gray-50` through `bg-gray-900`
- `border-gray-100` through `border-gray-900`
- `text-slate-*`, `text-zinc-*`, `text-neutral-*`
- `bg-slate-*`, `bg-zinc-*`, `bg-neutral-*`

## Expected Patterns (should be prevalent)
- `text-lux-*` (gold, cream, charcoal, gray, gray-light, gray-dark, black)
- `bg-lux-*` (pearl, cream, charcoal, white)
- `text-ink-*` (600, 700, 900)
- `bg-surface-*` (200, 300, 800, 900)
- `border-border-*` (200, 300)

# ANALYSIS REQUIRED

1. **Quantitative Check**
   Run grep-equivalent searches and report counts:
   ```
   Prohibited classes found: [count]
   Proper lux-* usages: [count]
   Proper ink-* usages: [count]
   Proper surface-* usages: [count]
   Proper border-* usages: [count]
   ```

2. **Component-Level Report**
   For each component directory, confirm status:
   - src/components/ui/
   - src/components/home/
   - src/components/product/
   - src/components/admin/
   - src/components/forms/
   - src/components/search/

3. **High-Risk Components** (verify specifically)
   - Footer.tsx — must use lux-charcoal, lux-cream, lux-gold
   - ProductCard.tsx — must use ink-*, lux-gold, border-border-*
   - Header.tsx — must match Footer background
   - ContactForm.tsx — must use proper focus states

# OUTPUT FORMAT
```markdown
## Design Token Compliance Report

### Summary
- Prohibited classes: X (target: 0)
- Compliant token usage: Y instances

### Component Status
| Component | Status | Notes |
|-----------|--------|-------|
| Footer.tsx | ✅ | Fully compliant |
...

### Files Requiring Attention
[List any files with issues, or "None — all compliant"]
```

# CONSTRAINTS
- DO NOT modify any files
- Report findings only
- Flag false positives (e.g., gray in comments or strings)
```

---

## Prompt 2.2 — Typography Consistency Audit

```
@workspace

# OBJECTIVE
Verify consistent typography implementation across all pages and components.

# CONTEXT
- Headlines: Cormorant Garamond (font-serif)
- Body: Inter (font-sans)
- Gold headlines for page/section titles
- Proper hierarchy must be maintained

# VERIFICATION POINTS

1. **Font Family Usage**
   Search for and verify correct application:
   - `font-serif` on h1, h2, h3 elements and heading components
   - `font-sans` on body text, UI elements, buttons
   - No hardcoded font-family declarations

2. **Heading Hierarchy**
   Verify semantic structure:
   - Each page has exactly one h1 (or equivalent)
   - Headings follow logical order (h1 → h2 → h3)
   - Heading utility classes used consistently

3. **Text Color Hierarchy**
   - Page titles: `text-lux-gold`
   - Section titles: `text-lux-gold` or `text-lux-black`
   - Body text: `text-ink-600` or `text-ink-900`
   - Muted/secondary: `text-lux-gray` or `text-lux-gray-light`
   - Light on dark: `text-lux-cream`

4. **Size Consistency**
   Verify responsive scaling patterns:
   - Mobile-first sizing
   - Consistent breakpoint scaling
   - Display sizes only in hero sections

# FILES TO CHECK
- src/app/page.tsx (homepage)
- src/app/about/page.tsx
- src/app/browse/page.tsx
- src/app/product/[slug]/page.tsx
- src/components/Hero.tsx
- src/components/ui/PageHeader.tsx
- src/components/ui/SectionHeading.tsx

# OUTPUT FORMAT
```markdown
## Typography Audit Report

### Font Family Compliance
- Serif headlines: [count] instances ✅
- Sans body text: [count] instances ✅
- Violations: [list or "None"]

### Heading Hierarchy
| Page | h1 | h2 | h3 | Status |
|------|----|----|----| -------|
...

### Recommendations
[Any improvements, or "None — fully consistent"]
```
```

---

# PHASE 3: Production Readiness Verification

## Prompt 3.1 — TypeScript Production Audit

```
@workspace

# OBJECTIVE
Verify TypeScript compilation status for production code only, explicitly excluding test files and archives.

# CONTEXT
- Build must pass with zero errors in src/
- Test files (tests/, *.test.ts) are excluded from production criteria
- Work files (work_files/) are archived and excluded
- Strict mode is enabled

# COMMANDS TO RUN
```bash
# Production-only type check
npx tsc --noEmit 2>&1 | grep "^src/"
```

# ANALYSIS REQUIRED

1. **Error Classification**
   If any errors exist, categorize by:
   - Type errors (TS2xxx)
   - Import errors (TS2307)
   - Unused variable warnings (TS6133)
   - Strict null check failures

2. **Severity Assessment**
   - BLOCKING: Errors that would cause runtime failures
   - NON-BLOCKING: Warnings that don't affect functionality
   - DEFERRED: Issues in non-production code

3. **File-Level Report**
   For any errors found, report:
   - File path
   - Line number
   - Error code and message
   - Suggested fix (if straightforward)

# EXPECTED RESULT
```
Production TypeScript Errors: 0
Status: ✅ CLEAN
```

# IF ERRORS FOUND
Provide fixes in this format:
```typescript
// File: [path]
// Line: [number]
// Error: [TS code] [message]

// Current:
[problematic code]

// Fix:
[corrected code]
```

# CONSTRAINTS
- Focus ONLY on src/ directory
- DO NOT attempt to fix tests/ or work_files/
- DO NOT change tsconfig.json settings
- Report findings, request approval before fixing
```

---

## Prompt 3.2 — Build Process Verification

```
@workspace

# OBJECTIVE
Verify the Next.js build process completes successfully with no blocking warnings.

# CONTEXT
- Next.js 16.1.1 with Turbopack
- Prisma client generation required
- Static + dynamic route mix
- Production deployment target: Vercel

# BUILD COMMAND
```bash
npm run build
```

# VERIFICATION CHECKLIST

1. **Prisma Generation**
   - [ ] `prisma generate` completes without errors
   - [ ] Client generated to node_modules/@prisma/client

2. **Compilation**
   - [ ] "Compiled successfully" message
   - [ ] No TypeScript errors (should show "Skipping validation" or pass)

3. **Page Generation**
   - [ ] Static pages generated (○ markers)
   - [ ] Dynamic routes configured (ƒ markers)
   - [ ] No pages fail to generate

4. **Route Analysis**
   Count and categorize:
   - Static pages (○): [count]
   - Dynamic routes (ƒ): [count]
   - API routes: [count]
   - Total: [count]

5. **Warning Assessment**
   - "Route not found" during SSG — typically acceptable (API routes)
   - Deprecation warnings — note but don't block
   - Any actual error messages — BLOCKING

# OUTPUT FORMAT
```markdown
## Build Verification Report

### Status: ✅ PASSING / ❌ FAILING

### Metrics
- Compilation time: Xs
- Static pages: X
- Dynamic routes: X
- API routes: X

### Warnings
| Type | Count | Blocking |
|------|-------|----------|
| Route not found | X | No |
...

### Issues Requiring Attention
[List or "None"]
```

# CONSTRAINTS
- Run build in clean environment
- Report warnings but don't fail on non-blocking items
- Note any missing environment variables
```

---

# PHASE 4: SEO & Metadata Verification

## Prompt 4.1 — SEO Infrastructure Audit

```
@workspace

# OBJECTIVE
Verify comprehensive SEO implementation including metadata, structured data, and technical SEO elements.

# CONTEXT
- Production URL: https://kollect-it.com
- E-commerce marketplace requiring Product schema
- Must support social sharing (OG, Twitter cards)

# FILES TO ANALYZE
- src/app/layout.tsx (root metadata)
- src/app/*/page.tsx (page-level metadata)
- src/app/sitemap.xml/route.ts or sitemap.ts
- src/app/robots.txt/route.ts or robots.ts
- src/components/seo/ (any SEO components)

# VERIFICATION CHECKLIST

1. **Root Metadata (layout.tsx)**
   - [ ] title.default and title.template configured
   - [ ] description present and compelling
   - [ ] metadataBase set to production URL
   - [ ] openGraph object complete (type, siteName, title, description, images)
   - [ ] twitter card configuration
   - [ ] icons/favicon configured

2. **Page-Level Metadata**
   Verify `export const metadata` or `generateMetadata` for:
   - [ ] Homepage (/)
   - [ ] Category pages (/category/[slug])
   - [ ] Product pages (/product/[slug])
   - [ ] About, Contact, FAQ
   - [ ] Legal pages (terms, privacy)

3. **Structured Data (JSON-LD)**
   - [ ] Product schema on product pages
   - [ ] Organization schema (if present)
   - [ ] BreadcrumbList schema (if present)
   - [ ] Proper @context and @type

4. **Technical SEO**
   - [ ] sitemap.xml generates dynamically
   - [ ] robots.txt configured correctly
   - [ ] Canonical URLs (via metadataBase)
   - [ ] No noindex on important pages

5. **Social Sharing**
   - [ ] OG image specified (og-default.jpg or dynamic)
   - [ ] OG image dimensions (1200x630 recommended)
   - [ ] Twitter card type (summary_large_image)

# OUTPUT FORMAT
```markdown
## SEO Audit Report

### Metadata Coverage
| Page Type | Title | Description | OG | Twitter | Schema |
|-----------|-------|-------------|----|---------| -------|
| Homepage | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Product | ✅ | ✅ | ✅ | ✅ | ✅ |
...

### Structured Data
- Product schema: [Present/Missing]
- Organization schema: [Present/Missing]
- Breadcrumbs: [Present/Missing]

### Technical SEO
- sitemap.xml: [Status]
- robots.txt: [Status]
- Canonical URLs: [Status]

### Recommendations
1. [Priority] [Recommendation]
...
```

# CONSTRAINTS
- Verify presence, not content quality
- Note missing items but don't block launch for optional schemas
- Product pages MUST have Product schema
```

---

# PHASE 5: Accessibility Quick Check

## Prompt 5.1 — Accessibility Baseline Audit

```
@workspace

# OBJECTIVE
Perform a targeted accessibility audit focusing on critical issues that would block users with disabilities.

# CONTEXT
- Luxury marketplace with older demographic
- Must support keyboard navigation
- Focus on WCAG 2.1 Level A compliance
- Not a full WCAG audit — targeted quick wins only

# SCOPE
Priority components only:
- src/components/Header.tsx
- src/components/Footer.tsx
- src/components/ProductCard.tsx
- src/components/forms/ContactForm.tsx
- src/components/Search.tsx
- src/components/ui/button.tsx

# VERIFICATION CHECKLIST

1. **Interactive Elements**
   - [ ] All buttons have accessible names (text content or aria-label)
   - [ ] All links have descriptive text (not "click here")
   - [ ] Form inputs have associated labels
   - [ ] Icon-only buttons have aria-label

2. **Keyboard Navigation**
   - [ ] Focus states visible (focus: or focus-visible: classes)
   - [ ] No keyboard traps
   - [ ] Skip links present (optional but recommended)
   - [ ] Tab order logical

3. **Images**
   - [ ] All <img> tags have alt attributes
   - [ ] Decorative images have alt=""
   - [ ] next/image components have alt text

4. **Color Contrast**
   - [ ] Text on lux-gold background: sufficient contrast
   - [ ] Text on lux-charcoal background: sufficient contrast
   - [ ] lux-gray-light text: verify readability

5. **Semantic HTML**
   - [ ] Proper heading hierarchy
   - [ ] <main>, <nav>, <footer> landmarks
   - [ ] Lists use <ul>/<ol> appropriately
   - [ ] Tables have proper headers (if present)

6. **ARIA Usage**
   - [ ] aria-label used correctly (not redundant)
   - [ ] aria-hidden on decorative elements
   - [ ] Role attributes where needed

# OUTPUT FORMAT
```markdown
## Accessibility Quick Audit

### Critical Issues (Must Fix)
| Component | Issue | WCAG | Fix |
|-----------|-------|------|-----|
...

### Warnings (Should Fix)
| Component | Issue | WCAG | Fix |
|-----------|-------|------|-----|
...

### Passing Checks
- [List of verified items]

### Quick Wins (5 min or less each)
1. [Specific fix with code snippet]
...
```

# CONSTRAINTS
- Focus on blocking issues only
- Provide specific code fixes for quick wins
- Don't audit admin pages (internal only)
- Skip theoretical issues — focus on real impact
```

---

# PHASE 6: Pre-Launch Checklist Generation

## Prompt 6.1 — Generate Launch Readiness Report

```
@workspace

# OBJECTIVE
Generate a comprehensive launch readiness report based on all previous verification phases.

# CONTEXT
- Target: Production launch of Kollect-It marketplace
- All code verification complete
- Build passing
- Design system consistent

# SYNTHESIZE FINDINGS FROM
- Design system verification (Phases 1-2)
- TypeScript/build status (Phase 3)
- SEO audit (Phase 4)
- Accessibility check (Phase 5)

# REPORT STRUCTURE

## Executive Summary
- Overall status: READY / NOT READY / READY WITH CAVEATS
- Blocking issues: [count]
- Non-blocking recommendations: [count]

## Verification Status

### Code Quality
| Check | Status | Notes |
|-------|--------|-------|
| TypeScript (src/) | ✅/❌ | |
| Build | ✅/❌ | |
| Design System | ✅/❌ | |

### User Experience
| Check | Status | Notes |
|-------|--------|-------|
| Typography | ✅/❌ | |
| Color consistency | ✅/❌ | |
| Mobile responsive | ✅/❌ | |

### SEO & Discoverability
| Check | Status | Notes |
|-------|--------|-------|
| Metadata | ✅/❌ | |
| Structured data | ✅/❌ | |
| Sitemap | ✅/❌ | |

### Accessibility
| Check | Status | Notes |
|-------|--------|-------|
| Keyboard nav | ✅/❌ | |
| Screen reader | ✅/❌ | |
| Color contrast | ✅/❌ | |

## Blocking Issues
[List with severity and required action, or "None"]

## Post-Launch Recommendations
[Items that can be addressed after launch]

## Sign-Off Checklist
- [ ] All blocking issues resolved
- [ ] Build passes in CI/CD
- [ ] Environment variables configured in Vercel
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Analytics/monitoring enabled
- [ ] Error tracking configured

## Conclusion
[Final recommendation with confidence level]
```

---

# PHASE 7: Quick Fix Prompts

## Prompt 7.1 — Fix Specific Accessibility Issue

```
@workspace

# OBJECTIVE
Fix the following specific accessibility issue with minimal code change.

# ISSUE
[Paste specific issue from audit, e.g., "Newsletter input in Footer.tsx missing aria-label"]

# CONSTRAINTS
- Change ONLY the specific issue
- Preserve all existing functionality
- Follow existing code patterns
- Use design system tokens

# REQUIREMENTS
1. Show the current code
2. Show the fixed code
3. Explain the change
4. Confirm no side effects

# OUTPUT FORMAT
```typescript
// File: [path]
// Issue: [description]

// BEFORE
[current code block]

// AFTER
[fixed code block]

// EXPLANATION
[Why this fix is correct and complete]
```
```

---

## Prompt 7.2 — Add Missing Metadata

```
@workspace

# OBJECTIVE
Add metadata export to a page that is missing SEO configuration.

# PAGE
[Specify page path, e.g., src/app/about/page.tsx]

# REQUIREMENTS
1. Follow existing metadata patterns from layout.tsx
2. Include: title, description, openGraph, twitter
3. Use appropriate keywords for the page content
4. Keep descriptions under 160 characters

# TEMPLATE
```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "[Page Title]",
  description: "[Compelling description under 160 chars]",
  openGraph: {
    title: "[Page Title] – Kollect-It",
    description: "[Description]",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "[Page Title]",
    description: "[Description]",
  },
};
```

# OUTPUT
Complete metadata object tailored to the specific page content.
```

---

# UTILITY PROMPTS

## Prompt U.1 — Verify Single Component

```
@workspace

# OBJECTIVE
Verify that a specific component follows all design system and code quality standards.

# COMPONENT
[Specify component path]

# CHECKS
1. Design tokens (no gray-*, uses lux-*/ink-*/surface-*)
2. Typography (correct font families)
3. Accessibility (labels, focus states, semantic HTML)
4. TypeScript (no type errors)
5. Consistent with similar components

# OUTPUT
Pass/Fail for each check with specific line references for any issues.
```

---

## Prompt U.2 — Search and Report Pattern Usage

```
@workspace

# OBJECTIVE
Search the codebase for a specific pattern and report all occurrences.

# PATTERN
[Specify pattern, e.g., "text-gray-", "console.log", "<img "]

# SCOPE
- Include: src/
- Exclude: node_modules/, .next/, tests/, work_files/

# OUTPUT FORMAT
```
Pattern: [pattern]
Total occurrences: [count]

Files:
- [file:line] [context snippet]
...
```

# ANALYSIS
- Which occurrences are intentional vs problematic?
- Recommendations for each category
```

---

## Document Metadata

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Created | January 18, 2026 |
| Author | Claude (Anthropic) |
| Project | Kollect-It |
| Compatibility | Cursor AI, GitHub Copilot Chat, Claude |

---

*These prompts are designed for copy-paste execution. Run them sequentially for best results.*
