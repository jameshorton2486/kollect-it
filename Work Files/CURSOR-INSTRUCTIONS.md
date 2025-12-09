# CURSOR INSTRUCTIONS — BATCH A & B PAGES

## FILE MAPPINGS

| Source (Work Files/batch-pages/) | Destination |
|----------------------------------|-------------|
| `category-[slug]-page.tsx` | `src/app/category/[slug]/page.tsx` |
| `about-page.tsx` | `src/app/about/page.tsx` |
| `contact-page.tsx` | `src/app/contact/page.tsx` |
| `consign-page.tsx` | `src/app/consign/page.tsx` |

---

## CURSOR PROMPT (Copy/Paste)

```
Deploy Batch A & B page updates from Work Files/batch-pages/ folder:

1. src/app/category/[slug]/page.tsx ← Work Files/batch-pages/category-[slug]-page.tsx
2. src/app/about/page.tsx ← Work Files/batch-pages/about-page.tsx
3. src/app/contact/page.tsx ← Work Files/batch-pages/contact-page.tsx
4. src/app/consign/page.tsx ← Work Files/batch-pages/consign-page.tsx

Replace existing files with these updated versions.
```

---

## WHAT CHANGED

### Category Page
- Added design system typography (`.heading-page`, `.heading-section`, `.heading-subsection`)
- Updated background to `bg-lux-cream` header, `bg-lux-pearl` content
- Applied `.section-normal` spacing
- Added `.text-label`, `.text-muted` for supporting text
- Updated button styles to `.btn-secondary`

### About Page
- Complete restructure to match wireframe
- Hero story block with cream background
- Mission & values in 2-column grid
- "What makes us different" section with 4 cards
- "Who we serve" section with 4 audience types
- CTA section with charcoal background

### Contact Page
- Two-column layout: form + contact info
- Contact form with proper styling
- Gold icons for email, phone, location
- Applied design system typography throughout

### Consign Page
- Clear header with lead text
- "What We Accept" section with bullet list
- 3-step process with icons
- CTA section
- FAQ accordion-style cards
- "When It's Not a Fit" section

---

## TEST CHECKLIST

After deployment, verify:

- [ ] Category page: cream header, gold heading, product grid works
- [ ] About page: all sections display, CTA section has dark background
- [ ] Contact page: form displays, contact info with gold icons
- [ ] Consign page: 3-step icons show, FAQ cards render

---

## STILL NEEDED

**Batch C (Legal Pages)** - Waiting for ChatGPT wireframes for:
- Terms of Service
- Privacy Policy  
- Refund Policy

**Product Detail Page** - The existing page structure is good, may only need minor token updates.
