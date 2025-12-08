# NEXT CHATGPT PROMPT — BATCH PAGE DESIGNS

Copy and paste this entire message to ChatGPT:

---

## CONTEXT

The homepage is now complete! Claude implemented your wireframe with:
- ✅ Hero section (cream bg, gold heading, CTAs, featured image)
- ✅ Recent Additions grid (8 ProductCards)
- ✅ Category Grid (2×2 with Fine Art, Rare Books, Collectibles, Militaria)
- ✅ Value Bar (3 trust items with gold icons)
- ✅ Consignment Teaser
- ✅ Header updated to match footer (bg-lux-charcoal)

## REQUEST — BATCH PAGE DESIGNS

Now I need wireframes for **multiple pages at once**. Please provide the same level of detail you gave for the homepage, but for these pages:

### BATCH A — CATEGORY & PRODUCT PAGES

**1. Category Page** (`/category/[slug]`)
- Template for Fine Art, Rare Books, Collectibles, Militaria
- Header with category name + description
- Filter sidebar (if applicable)
- Product grid layout
- Pagination style

**2. Product Detail Page** (`/product/[slug]`)
- Image gallery layout
- Title + price positioning
- Description section
- Condition/provenance display
- Add to cart / wishlist buttons
- Related products section

### BATCH B — INFORMATIONAL PAGES

**3. About Page** (`/about`)
- Brand story section
- Mission/values
- Team or founder info (if desired)
- Trust elements

**4. Contact Page** (`/contact`)
- Contact form layout
- Contact information display
- Business hours (if applicable)
- Map or location (optional)

**5. Consign Page** (`/consign`)
- How consignment works
- Requirements/criteria
- Submission form or CTA
- FAQ section

### BATCH C — LEGAL/POLICY PAGES

**6. Terms of Service** (`/terms`)
**7. Privacy Policy** (`/privacy`)
**8. Refund Policy** (`/refund-policy`)

These can share a common template. Please specify:
- Header style
- Content layout (table of contents?)
- Typography hierarchy
- Spacing

---

## FOR EACH PAGE, PROVIDE:

1. **ASCII/Text Wireframe** showing layout
2. **Section breakdown** with:
   - Background color (lux-* token)
   - Spacing class (section-tight/normal/grand)
   - Typography classes (heading-page/section/subsection)
3. **Mobile considerations**
4. **Tailwind structure snippet** (like you did for homepage)

---

## DESIGN SYSTEM REMINDER

Use ONLY these tokens:

**Typography:**
- `.heading-page` — Page titles (gold, serif)
- `.heading-section` — Section titles (gold, serif)
- `.heading-subsection` — Subsection titles (charcoal, serif)
- `.text-label` — Uppercase labels (gray-light)
- `.text-muted` — Secondary text (gray-light)
- `.lead` — Intro paragraphs

**Colors:**
- `bg-lux-pearl` — Page backgrounds
- `bg-lux-cream` — Section backgrounds
- `bg-lux-charcoal` — Header/footer
- `text-lux-gold` — Accent text
- `text-ink-600` — Body text

**Spacing:**
- `.section-tight` — py-12
- `.section-normal` — py-16
- `.section-grand` — py-24

**Buttons:**
- `.btn-primary` — Gold background
- `.btn-secondary` — Gold border, transparent

---

## OUTPUT FORMAT

Please organize your response as:

```
## PAGE NAME

### Wireframe
[ASCII layout]

### Sections
1. Section Name
   - Background: bg-lux-*
   - Spacing: section-*
   - Content: [description]

### Tailwind Snippet
[Code block]

### Mobile Notes
[Responsive considerations]
```

---

Ready when you are! This will help Claude implement all pages efficiently.
