# Kollect-It Design System Reference

> **Status: ✅ FULLY IMPLEMENTED**  
> **Last Verified:** January 18, 2026  
> **Previous Audit Issues:** All 230+ resolved

---

## 🎨 COLOR PALETTE

### Primary Luxury Colors (`lux-*`)
Your **primary palette** — used consistently across all 162 components:

| Token | CSS Variable | Value | Use For |
|-------|--------------|-------|---------|
| `lux-black` | `--lux-black` | `hsl(220 18% 10%)` | Headings, primary text |
| `lux-ink` | `--lux-ink` | `hsl(220 16% 12%)` | Body copy |
| `lux-charcoal` | `--lux-charcoal` | `hsl(220 12% 18%)` | Header/Footer background |
| `lux-white` | `--lux-white` | `hsl(38 40% 98%)` | Card backgrounds |
| `lux-pearl` | `--lux-pearl` | `hsl(36 22% 94%)` | Page background |
| `lux-cream` | `--lux-cream` | `hsl(40 30% 92%)` | Hero/section backgrounds |
| `lux-gray-light` | `--lux-gray-light` | `hsl(28 8% 80%)` | Captions, dividers |
| `lux-gray` | `--lux-gray` | `hsl(26 9% 60%)` | Supporting text |
| `lux-gray-dark` | `--lux-gray-dark` | `hsl(26 12% 38%)` | Muted headings |
| `lux-gold` | `--lux-gold` | `hsl(46 65% 52%)` | **Primary accent** (#D4AF37) |
| `lux-gold-light` | `--lux-gold-light` | `hsl(46 75% 65%)` | Hover gold |

### ✅ Standard Usage Patterns
```tsx
// Headlines
className="text-lux-gold"        // Gold accent headlines
className="text-lux-black"       // Primary dark text
className="text-lux-cream"       // Light text on dark backgrounds

// Backgrounds
className="bg-lux-charcoal"      // Header/Footer
className="bg-lux-pearl"         // Page background
className="bg-lux-cream"         // Section backgrounds

// Supporting text
className="text-lux-gray-light"  // Captions, secondary info
className="text-lux-gray"        // Muted body text
className="text-ink-600"         // Body text emphasis
className="text-ink-900"         // Strong body text
```

### Supporting Palettes
```tsx
// Ink scale (body text)
text-ink-600    // Body text
text-ink-700    // Emphasis
text-ink-900    // Strong/headings

// Surface scale (backgrounds)
bg-surface-200  // Skeletons, loading
bg-surface-300  // Disabled states
bg-surface-800  // Dark UI elements
bg-surface-900  // Dark panels

// Borders
border-border-200  // Light borders
border-border-300  // Default borders
```

---

## 📝 TYPOGRAPHY

### Fonts (Loaded via Google Fonts)
| Variable | Font Family | Use For |
|----------|-------------|---------|
| `--font-serif` | Cormorant Garamond | Headlines (h1-h6) |
| `--font-sans` | Inter | Body text, UI |
| `--font-logo` | Archivo Black | Logo/Brand |

### Typography Utility Classes
```css
/* Headlines - Serif */
.heading-page     /* 40px @ desktop, gold, bold */
.heading-section  /* 32px @ desktop, gold, semibold */
.heading-subsection /* 24px @ desktop, charcoal */

/* Body - Sans */
.lead            /* 20px, light weight, intro paragraphs */
.text-body       /* 18px, standard body */
.text-muted      /* 14px, gray-light, secondary info */
.text-label      /* 12px, uppercase, tracking */
```

### Display Sizes (Heroes)
```tsx
className="text-display-sm"   // 2rem
className="text-display-md"   // 2.5rem
className="text-display-lg"   // 3rem
className="text-display-xl"   // 3.5rem
className="text-display-2xl"  // 4rem
```

---

## 📐 SPACING

### Section Spacing
| Class | Padding | Use For |
|-------|---------|---------|
| `.section-tight` | py-12 (3rem) | Compact sections |
| `.section-normal` | py-16 (4rem) | Default sections |
| `.section-grand` | py-24 (6rem) | Hero/feature sections |

### Grid Gaps
| Class | Gap | Use For |
|-------|-----|---------|
| `.gap-standard` | 1.5rem (gap-6) | Default grids |
| `.gap-luxury` | 2rem (gap-8) | Spaced grids |
| `.gap-hero` | 3rem (gap-12) | Hero sections |

---

## 🎭 SHADOWS

| Class | Use For |
|-------|---------|
| `shadow-clean` | Subtle card shadows |
| `shadow-soft` | Hover state shadows |
| `shadow-gold-soft` | Gold accent shadows |
| `shadow-card` | Product cards |
| `shadow-card-hover` | Card hover states |
| `shadow-elevated` | Modals, dropdowns |

---

## 📦 SECTION PRESETS

```tsx
// Light cream sections
className="section-light"  // bg-lux-cream text-lux-charcoal

// Soft neutral sections
className="section-muted"  // bg-lux-ink-soft text-lux-charcoal

// Dark sections (heroes, emphasis)
className="section-dark"   // bg-surface-900 text-lux-ink-soft
```

---

## 🔘 BUTTON CLASSES

```tsx
// Primary - Gold background, high emphasis
className="btn-primary"

// Secondary - Gold border, transparent background
className="btn-secondary"
```

---

## ✅ AUDIT STATUS

### December 2025 Issues — ALL RESOLVED

| Component | Issues Found | Current Status |
|-----------|--------------|----------------|
| `Footer.tsx` | 11 | ✅ Clean |
| `ProductCard.tsx` | 4 | ✅ Clean |
| `ContactForm.tsx` | 1 | ✅ Clean |
| `ProductReviews.tsx` | 2 | ✅ Clean |
| `AesopSection.tsx` | 1 | ✅ Clean |
| `account/page.tsx` | 24 | ✅ Clean |
| All admin components | 100+ | ✅ Clean |

### Current Metrics
- **Total `lux-*` token usages:** 2,031
- **Legacy `gray-*` violations:** 0
- **TypeScript errors:** 0

---

## 📋 QUICK REFERENCE FOR NEW COMPONENTS

When creating new components, use this pattern:

```tsx
// Example: New feature card
export function FeatureCard({ title, description }: Props) {
  return (
    <div className="rounded-lg border border-border-200 bg-lux-white p-6 shadow-clean transition-all duration-luxury hover:shadow-soft hover:-translate-y-0.5">
      <h3 className="font-serif text-heading-md text-lux-gold mb-2">
        {title}
      </h3>
      <p className="text-ink-600 leading-relaxed">
        {description}
      </p>
      <button className="mt-4 btn-primary rounded-lg">
        Learn More
      </button>
    </div>
  );
}
```

---

## 🚫 DO NOT USE

These legacy patterns are prohibited:

```tsx
// ❌ NEVER use these:
text-gray-300, text-gray-400, text-gray-500, text-gray-600, text-gray-700
bg-gray-50, bg-gray-100, bg-gray-200, bg-gray-800, bg-gray-900
border-gray-200, border-gray-300

// ✅ ALWAYS use instead:
text-lux-gray-light, text-lux-gray, text-ink-600, text-ink-900
bg-lux-pearl, bg-lux-cream, bg-surface-200, bg-lux-charcoal
border-border-200, border-border-300
```

---

*Last updated: January 18, 2026*  
*Supersedes: KOLLECT-IT-DESIGN-SYSTEM-REFERENCE.md (December 2025)*
