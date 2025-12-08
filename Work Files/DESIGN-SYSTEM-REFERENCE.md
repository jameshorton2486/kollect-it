# KOLLECT-IT DESIGN SYSTEM — COMPLETE REFERENCE
## Version 1.0 | December 2025

---

## QUICK REFERENCE

| Element | Class/Token | Notes |
|---------|-------------|-------|
| **Page Title (H1)** | `.heading-page` | Gold, Cormorant Garamond |
| **Section Title (H2)** | `.heading-section` | Gold, Cormorant Garamond |
| **Subsection (H3)** | `.heading-subsection` | Charcoal, Cormorant Garamond |
| **Labels/Tags** | `.text-label` | Uppercase, Inter, gray-light |
| **Muted Text** | `.text-muted` | Inter, gray-light |
| **Lead Paragraph** | `.lead` | 1.25rem, Inter |
| **Primary Button** | `.btn-primary` | Gold bg, charcoal text |
| **Secondary Button** | `.btn-secondary` | Gold border, transparent bg |
| **Section Spacing** | `.section-normal` | py-16 (4rem) |

---

## 1. TYPOGRAPHY

### Fonts
- **Serif**: Cormorant Garamond (headings, titles)
- **Sans-serif**: Inter (body, UI, labels)

### Heading Classes

```css
.heading-page      /* H1: 2.2rem → 3.2rem, gold, bold */
.heading-section   /* H2: 1.8rem → 2.6rem, gold, semibold */
.heading-subsection /* H3: 1.4rem → 1.8rem, charcoal, medium */
```

### Text Classes

```css
.lead        /* Intro paragraphs: 1.25rem, gray-dark */
.text-label  /* Tags/metadata: 0.75rem, uppercase, tracking-widest */
.text-muted  /* Secondary info: 0.875rem, gray-light */
.text-body   /* Body text: 1rem */
.text-body-lg /* Large body: 1.125rem */
.text-body-sm /* Small body: 0.875rem */
```

---

## 2. COLORS

### Primary Palette (Use These)

| Token | HSL | Use For |
|-------|-----|---------|
| `lux-gold` | 46 65% 52% | **Primary accent**, CTAs |
| `lux-gold-light` | 46 75% 65% | Hover states |
| `lux-black` | 220 18% 10% | Primary headings |
| `lux-charcoal` | 220 12% 18% | Header/Footer bg |
| `lux-pearl` | 36 22% 94% | **Page background** |
| `lux-cream` | 40 30% 92% | Section backgrounds |
| `lux-gray-light` | 28 8% 80% | Captions, muted text |
| `lux-gray` | 26 9% 60% | Supporting text |

### Usage Rules

```tsx
// ✅ CORRECT
<h1 className="heading-page">Page Title</h1>
<p className="text-lux-gray">Supporting text</p>
<div className="bg-lux-pearl">Page content</div>
<footer className="bg-lux-charcoal">Footer</footer>

// ❌ NEVER USE
text-gray-300  → Use text-lux-gray-light
text-gray-600  → Use text-ink-600
bg-gray-*      → Use bg-lux-* or bg-surface-*
bg-white       → Use bg-lux-white or bg-lux-pearl
```

---

## 3. SPACING

### Section Spacing

```css
.section-tight   /* py-12 (3rem) - Compact sections */
.section-normal  /* py-16 (4rem) - Default */
.section-grand   /* py-24 (6rem) - Heroes */
```

### Grid Gaps

```css
.gap-standard  /* 1.5rem (gap-6) */
.gap-luxury    /* 2rem (gap-8) */
.gap-hero      /* 3rem (gap-12) */
```

---

## 4. BUTTONS

### Primary CTA (Gold)
```tsx
<button className="btn-primary">
  Browse Collection
</button>
```

### Secondary CTA (Outlined)
```tsx
<button className="btn-secondary">
  Learn More
</button>
```

### Manual Button Styling
```tsx
// Primary
className="bg-lux-gold text-lux-charcoal hover:bg-lux-gold-light px-6 py-3 rounded-md"

// Secondary
className="border border-lux-gold-light text-lux-gold hover:bg-lux-cream px-6 py-3 rounded-md"
```

---

## 5. SECTIONS

### Light Section (Content)
```tsx
<section className="section-light section-normal">
  {/* bg-lux-cream text-lux-charcoal py-16 */}
</section>
```

### Dark Section (Hero/Emphasis)
```tsx
<section className="section-dark section-grand">
  {/* bg-surface-900 text-lux-ink-soft py-24 */}
</section>
```

---

## 6. SHADOWS

```css
.shadow-clean      /* Subtle card shadows */
.shadow-soft       /* Default card shadows */
.shadow-card       /* Product cards */
.shadow-card-hover /* Hover state */
.shadow-elevated   /* Modals, dropdowns */
.shadow-gold-soft  /* Gold accent glow */
```

---

## 7. COMPONENT STANDARDS

### Header
- Background: `bg-lux-charcoal`
- Text: `text-lux-cream`
- Hover: `text-lux-gold-light`

### Footer
- **MUST match header**: `bg-lux-charcoal`
- Links: `text-lux-gray-light` → hover: `text-lux-gold`

### ProductCard
- Title: `font-serif`
- Price: `font-sans` (Inter)
- Metadata: `.text-label`
- Hover: `shadow-card-hover scale-[1.01]`

### Category Grid
- 2×2 layout (4 categories only)
- Square images
- Serif titles (Cormorant)
- Gold underline on hover

---

## 8. PAGE STRUCTURE

### Static Pages (About, FAQ, Terms, etc.)
```tsx
<section className="section-normal">
  <div className="container">
    <h1 className="heading-page">Page Title</h1>
    <p className="lead">Introduction paragraph...</p>
    {/* Content */}
  </div>
</section>
```

### Category Pages
```tsx
<section className="section-normal">
  <div className="container">
    <h1 className="heading-page">Fine Art</h1>
    <p className="lead">Description...</p>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-luxury">
      {/* ProductCards */}
    </div>
  </div>
</section>
```

---

## 9. IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (Current)
- [x] Font loading (Inter + Cormorant Garamond)
- [x] Typography utility classes
- [x] Button system
- [x] CSS variables
- [ ] Deploy to project

### Phase 2: Components
- [ ] Footer.tsx (11 fixes)
- [ ] ProductCard.tsx (4 fixes)
- [ ] ProductReviews.tsx (2 fixes)
- [ ] RelatedProducts.tsx (1 fix)
- [ ] AesopSection.tsx (1 fix)
- [ ] ContactForm.tsx (1 fix)

### Phase 3: Pages
- [ ] Legal pages (terms, privacy, etc.)
- [ ] Account page
- [ ] Admin pages (low priority)

---

## 10. FILE LOCATIONS

| File | Path |
|------|------|
| Layout (fonts) | `src/app/layout.tsx` |
| Styles | `src/app/globals.css` |
| Tailwind config | `tailwind.config.ts` |
| Footer | `src/components/Footer.tsx` |
| ProductCard | `src/components/ProductCard.tsx` |

---

*Generated for Kollect-It Design System v1.0*
