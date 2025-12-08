# Cursor AI Agent Prompt: Fix ProductCard + Add Typography Utilities

## Overview
Fix color inconsistencies in ProductCard.tsx and add standardized typography utility classes to globals.css. All changes must use the **existing design tokens** defined in the project.

---

## Task 1: Fix ProductCard.tsx Color Classes

**File:** `src/components/ProductCard.tsx`

Find and replace these 4 instances (exact lines may vary):

| Line ~61 | Find | Replace With |
|----------|------|--------------|
| SVG class | `text-gray-300` | `text-lux-gray-light` |

| Line ~64 | Find | Replace With |
|----------|------|--------------|
| span class | `text-gray-600` | `text-ink-600` |

| Line ~123 | Find | Replace With |
|----------|------|--------------|
| SVG class | `text-gray-300` | `text-lux-gray-light` |

| Line ~126 | Find | Replace With |
|----------|------|--------------|
| span class | `text-gray-600` | `text-ink-600` |

**Search regex:** `text-gray-300|text-gray-600`

**Important:** Only replace these 4 instances. Do not modify any other classes.

---

## Task 2: Add Typography Utility Classes to globals.css

**File:** `src/app/globals.css`

Add the following utility classes inside the existing `@layer utilities` block that already contains `.text-heading-xl`, `.text-heading-lg`, etc. (around line 167-191).

**Add these new classes:**

```css
/* Page-level heading - for main page titles (h1) */
.heading-page {
  @apply font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight;
  color: hsl(var(--lux-gold));
}

/* Section heading - for section headers (h2) */
.heading-section {
  @apply font-serif text-2xl md:text-3xl font-semibold;
  color: hsl(var(--lux-gold));
}

/* Subsection heading - for h3 */
.heading-subsection {
  @apply font-serif text-xl md:text-2xl font-medium;
  color: hsl(var(--lux-cream));
}

/* Small uppercase labels - for category tags, metadata */
.text-label {
  @apply text-xs uppercase tracking-widest font-medium;
  color: hsl(var(--lux-gray-light));
}

/* Muted/secondary text */
.text-muted {
  @apply text-sm;
  color: hsl(var(--lux-gray-light));
}
```

**Placement:** Add after the existing `.text-body` utility class definition (around line 190), but still inside the `@layer utilities { }` block.

---

## Task 3: Verify Existing Typography (No Changes Needed)

Confirm these already exist in globals.css (DO NOT duplicate):
- `.text-heading-xl`
- `.text-heading-lg`
- `.text-heading-md`
- `.text-body`

---

## Validation Checklist

After completing the tasks:

1. [ ] ProductCard.tsx has NO remaining `text-gray-300` or `text-gray-600`
2. [ ] globals.css has new classes: `.heading-page`, `.heading-section`, `.heading-subsection`, `.text-label`, `.text-muted`
3. [ ] All new classes use existing CSS variables (`--lux-gold`, `--lux-cream`, `--lux-gray-light`)
4. [ ] No duplicate utility class definitions

---

## Usage Reference (for future components)

```tsx
// Page titles
<h1 className="heading-page">Fine Art Collection</h1>

// Section headers
<h2 className="heading-section">Featured Items</h2>

// Subsection headers
<h3 className="heading-subsection">Oil Paintings</h3>

// Category labels
<span className="text-label">Militaria</span>

// Secondary text
<p className="text-muted">Last updated 3 days ago</p>
```

---

**Run this prompt in Cursor Agent mode. Confirm changes before committing.**
