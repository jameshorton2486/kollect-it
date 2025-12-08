# Kollect-It Design System Reference

> **Your design system already exists.** The issue is inconsistent usage, not missing definitions.

---

## 🎨 COLOR PALETTE (Already Defined)

### Primary Luxury Colors (`lux-*`)
Use these as your **primary palette**:

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

### ✅ Correct Usage Examples
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
```

### ❌ DO NOT USE (Inconsistent)
```tsx
// These cause inconsistency:
text-gray-300    → Use text-lux-gray-light instead
text-gray-600    → Use text-ink-600 or text-lux-gray instead
text-gray-700    → Use text-lux-gray-dark instead
bg-gray-*        → Use bg-lux-* or bg-surface-* instead
```

---

## 🔤 TYPOGRAPHY (Already Defined)

### Fonts
| Variable | Fallback | Use For |
|----------|----------|---------|
| `--font-serif` | Georgia, Times New Roman | Headlines (h1-h6) |
| `--font-sans` | system-ui, sans-serif | Body text, UI |
| `--font-logo` | system-ui | Logo/Brand |

### Font Sizes (CSS Variables)
| Token | Size | Use For |
|-------|------|---------|
| `--text-heading-xl` | 2.5rem (40px) | Page titles |
| `--text-heading-lg` | 2rem (32px) | Section headers |
| `--text-heading-md` | 1.5rem (24px) | Subsection headers |
| `--text-body` | 1.125rem (18px) | Body text |
| `--text-body-base` | 1rem (16px) | UI text |

### Tailwind Display Sizes (for heroes)
```tsx
className="text-display-sm"   // 2rem
className="text-display-md"   // 2.5rem
className="text-display-lg"   // 3rem
className="text-display-xl"   // 3.5rem
className="text-display-2xl"  // 4rem
```

### Existing Utility Classes (in globals.css)
```css
.text-heading-xl   /* 40px, line-height 1.2 */
.text-heading-lg   /* 32px, line-height 1.25 */
.text-heading-md   /* 24px, line-height 1.3 */
.text-body         /* 18px, line-height 1.6 */
.text-body-lg      /* 18px, lighter weight */
.text-body-sm      /* 14px */
.lead              /* 20px, for intro paragraphs */
```

---

## 📐 SPACING (Already Defined)

### Section Spacing
| Class | Padding | Use For |
|-------|---------|---------|
| `.section-tight` | py-12 (3rem) | Compact sections |
| `.section-normal` | py-16 (4rem) | Default sections |
| `.section-grand` | py-24 (6rem) | Hero/feature sections |
| `.section-y-sm` | 2rem | Small vertical spacing |
| `.section-y` | 3rem | Default vertical spacing |
| `.section-y-lg` | 4rem | Large vertical spacing |

### Grid Gaps
| Class | Gap | Use For |
|-------|-----|---------|
| `.gap-standard` | 1.5rem (gap-6) | Default grids |
| `.gap-luxury` | 2rem (gap-8) | Spaced grids |
| `.gap-hero` | 3rem (gap-12) | Hero sections |

---

## 🎭 SHADOWS (Already Defined)

| Class | Use For |
|-------|---------|
| `shadow-clean` | Subtle card shadows |
| `shadow-soft` | Hover state shadows |
| `shadow-gold-soft` | Gold accent shadows |
| `shadow-card` | Product cards |
| `shadow-card-hover` | Card hover states |
| `shadow-elevated` | Modals, dropdowns |

---

## 📦 SECTION PRESETS (Already Defined)

```tsx
// Light cream sections
className="section-light"  // bg-lux-cream text-lux-charcoal

// Soft neutral sections
className="section-muted"  // bg-lux-ink-soft text-lux-charcoal

// Dark sections (heroes, emphasis)
className="section-dark"   // bg-surface-900 text-lux-ink-soft
```

---

## ⚠️ KNOWN INCONSISTENCIES TO FIX

### 1. ProductCard.tsx (4 instances)
**Lines 61, 64, 123, 126:**
- `text-gray-300` → `text-lux-gray-light`
- `text-gray-600` → `text-ink-600`

### 2. Header/Footer Background Mismatch
Both should use: `bg-lux-charcoal` or `bg-surface-900`

### 3. Missing Typography Utility Classes
Add these to `globals.css`:
- `.heading-page` — Main page titles
- `.heading-section` — Section headers
- `.text-label` — Uppercase labels

---

## 📋 WHAT TO TELL CHATGPT

> "I already have a complete design system in my `tailwind.config.ts` and `globals.css`. The problem isn't missing definitions—it's inconsistent usage across pages. Before redesigning anything, please:
>
> 1. **Audit my existing color tokens** (the `lux-*` palette is my primary system)
> 2. **Propose fixes that use my existing tokens**, not new ones
> 3. **Check which components are using non-standard classes** like `text-gray-*` instead of `text-lux-*`
>
> Here are my confirmed design decisions:
> - Header + Footer: Same background (`bg-lux-charcoal`)
> - Gold accent: `lux-gold` (#D4AF37)
> - Page background: `bg-lux-pearl`
> - Section backgrounds: `bg-lux-cream`
> - Primary text: `text-lux-black`
> - Supporting text: `text-lux-gray` or `text-lux-gray-light`
>
> Please work within this system."

---

## ✅ NEXT STEPS

1. **Fix ProductCard.tsx** — Replace 4 gray instances (see Cursor prompt below)
2. **Add typography utility classes** — `.heading-page`, `.heading-section`, `.text-label`
3. **Audit Header/Footer** — Ensure matching backgrounds
4. **Run codebase grep** — Find remaining `text-gray-*` usage

---

*Generated from your existing `tailwind.config.ts` and `globals.css`*
