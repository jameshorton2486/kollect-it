# Kollect-It UI & UX Consistency Audit — Codex Prompt

Project: Kollect-It  
Framework: Next.js 16 (App Router) + Tailwind CSS  
Execution Mode: Read-only audit (no automatic edits)  
Scope: Public, Auth, User, and Admin pages  

---

## OBJECTIVE

Perform a comprehensive UI and UX consistency audit of the Kollect-It web application.  
The goal is to ensure a professional, cohesive, production-grade experience across the entire site.

This is a **visual, structural, and behavioral audit**, not a business-logic or backend audit.

---

## AUDIT REQUIREMENTS

Audit the application to verify:

1. **Visual consistency**
   - Typography scale consistency (headings, body text, labels)
   - Consistent spacing (padding, margins, section rhythm)
   - Proper use of Tailwind spacing tokens (avoid arbitrary values unless justified)

2. **Layout & structure**
   - Page layout hierarchy consistency
   - Section alignment and grid usage
   - Container widths and breakpoint behavior
   - No unintended layout shifts

3. **Navigation behavior**
   - Header consistency across pages
   - Footer consistency across pages
   - Breadcrumb usage where appropriate
   - Active states for navigation items
   - Mobile navigation behavior

4. **Component reuse**
   - Identify duplicated UI patterns that should be shared components
   - Flag one-off styles that should be normalized
   - Recommend component consolidation where appropriate

5. **Design system adherence**
   - Color usage matches defined design palette
   - No inconsistent grays, borders, or shadows
   - Buttons, inputs, badges, alerts follow shared patterns

6. **Accessibility (baseline)**
   - Contrast issues
   - Focus states visible
   - Keyboard navigation sanity check
   - No obvious accessibility regressions

7. **Responsiveness**
   - Mobile, tablet, desktop behavior
   - No broken layouts at common breakpoints
   - Tables, grids, and forms degrade gracefully

---

## PAGES TO AUDIT

Audit **every route in the application**, including but not limited to:

### Public Pages
- /
- /browse
- /category/[slug]
- /subcategory/[slug]
- /product/[slug]
- /about
- /contact
- /faq
- /sell-with-us
- /consign-with-us
- /shipping-returns
- /authentication-guarantee
- /privacy
- /terms

### Auth Pages
- /login
- /register
- /forgot-password
- /reset-password

### User Pages (Authenticated)
- /account
- /account/profile
- /account/orders
- /account/orders/[id]
- /account/wishlist

### Admin Pages
- /admin
- /admin/products
- /admin/products/[id]
- /admin/products/queue
- /admin/categories
- /admin/orders
- /admin/reports
- /admin/analytics
- Any other admin routes discovered during crawl

---

## OUTPUT FORMAT

Produce a **single markdown report** with the following structure:

1. Executive summary
2. Global issues affecting multiple pages
3. Page-specific findings (grouped by section)
4. Component reuse opportunities
5. Accessibility findings (high-level)
6. Mobile responsiveness findings
7. Recommended fixes (prioritized)
8. Optional follow-up improvements

---

## IMPORTANT CONSTRAINTS

- Do NOT apply any code changes
- Do NOT modify business logic
- Do NOT modify authentication
- Do NOT modify backend or API routes
- Report findings and recommendations only

---

## SUCCESS CRITERIA

At completion, the audit should provide:
- A clear list of UI/UX inconsistencies
- Concrete, actionable recommendations
- Confidence that the site presents as a cohesive, professional product
