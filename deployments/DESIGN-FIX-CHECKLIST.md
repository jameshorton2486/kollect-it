# 🎯 Visual Design Fix Checklist

## ✅ Quick Wins (30 minutes - Do First!)

### **1. Replace HSL Color References (10 min)**
```bash
# Run find/replace in VS Code:
Find: text-\[hsl\(var\(--ink-([0-9]+)\)\)\]
Replace: text-ink-$1

Find: bg-\[hsl\(var\(--surface-([0-9]+)\)\)\]
Replace: bg-surface-$1

Find: border-\[hsl\(var\(--border-([0-9]+)\)\)\]
Replace: border-border-$1
```

**Files to update:**
- [ ] `src/app/shop/page.tsx`
- [ ] `src/app/cart/page.tsx`
- [ ] `src/app/product/[slug]/page.tsx`
- [ ] All product components

---

### **2. Standardize Section Padding (10 min)**

**Replace:**
```tsx
// Old inconsistent padding
<section className="py-20 md:py-32">
<div className="mb-10">
<div className="mt-12 pt-8">
```

**With:**
```tsx
// New consistent padding
<AesopSection className="py-16 md:py-24">
<div className="mb-section">
<div className="mt-section-small">
```

**Files to check:**
- [ ] `src/app/page.tsx` - Hero section
- [ ] `src/app/shop/page.tsx` - All sections
- [ ] `src/app/cart/page.tsx` - Header and sections

---

### **3. Fix Button Sizes (10 min)**

**Standardize to:**
```tsx
// Small buttons
<Button size="sm" className="px-4 py-2">

// Default buttons  
<Button size="default" className="px-6 py-3">

// Large CTAs
<Button size="lg" className="px-8 py-4">
```

**Files to update:**
- [ ] `src/components/Hero.tsx` - CTA buttons
- [ ] `src/components/Header.tsx` - "Sell Item" button
- [ ] `src/app/cart/page.tsx` - Checkout buttons

---

## 📝 Typography Fixes (1 hour)

### **Heading Sizes**

**Create these utility classes in `tailwind.config.ts`:**
```typescript
extend: {
  fontSize: {
    'display-xl': ['4rem', { lineHeight: '1.1' }],      // 64px
    'display-lg': ['3rem', { lineHeight: '1.2' }],      // 48px
    'display-md': ['2.25rem', { lineHeight: '1.25' }],  // 36px
    'display-sm': ['1.5rem', { lineHeight: '1.3' }],    // 24px
  }
}
```

**Then replace:**
```tsx
// Old
<h1 className="font-serif text-4xl md:text-6xl lg:text-7xl">

// New
<h1 className="text-display-xl">
```

**Update in:**
- [ ] Hero component
- [ ] Shop page headings
- [ ] Cart page headings
- [ ] Product page titles

---

### **Line Heights**

**Replace:**
```tsx
// Old arbitrary values
leading-[1.7]
leading-tight

// New standardized
leading-tight     // headings (1.25)
leading-normal    // body (1.5)
leading-relaxed   // large text (1.625)
```

**Files to check:**
- [ ] All page.tsx files
- [ ] All component files with text

---

### **Letter Spacing**

**Replace:**
```tsx
// Old arbitrary
tracking-[0.2em]

// New standardized
tracking-wide     // 0.05em
tracking-wider    // 0.1em
tracking-widest   // 0.15em
```

**Files with uppercase text:**
- [ ] `src/app/cart/page.tsx` - "SHOPPING CART"
- [ ] `src/app/shop/page.tsx` - "PROFESSIONALLY CURATED"
- [ ] Product category labels

---

## 🎨 Color Standardization (45 minutes)

### **Text Colors**

**Replace throughout:**
```tsx
// Primary text
text-ink → text-ink-900

// Secondary text  
text-ink-light → text-ink-700

// Tertiary text
text-ink-600 (keep as is)

// Muted text
text-ink-500 (use for hints)
```

**Check all components for:**
- [ ] Inconsistent ink color usage
- [ ] Mixed text color tokens

---

### **Gold/Accent Colors**

**Standardize:**
```tsx
// Primary gold (text, borders)
text-gold-600
border-gold-600

// Hover states
hover:text-gold-700
hover:border-gold-700

// Background gold
bg-gold-600 (buttons)
bg-gold-50 (subtle backgrounds)
```

**Files to update:**
- [ ] Header navigation
- [ ] Footer links
- [ ] All CTAs
- [ ] Product prices

---

### **Background Colors**

**Replace:**
```tsx
// Page backgrounds
bg-cream → bg-surface-50

// Card backgrounds
bg-surface-0 (white cards)
bg-surface-100 (subtle elevation)

// Hover states
hover:bg-surface-200
```

**Check:**
- [ ] Footer background
- [ ] Card components
- [ ] Section backgrounds

---

## 📐 Spacing System (1 hour)

### **Section Spacing**

**Add to tailwind.config.ts:**
```typescript
extend: {
  spacing: {
    'section': 'clamp(4rem, 8vw, 8rem)',       // 64-128px
    'section-small': 'clamp(2rem, 4vw, 4rem)', // 32-64px
  }
}
```

**Replace:**
```tsx
// Old
py-20 md:py-32

// New
py-section
```

---

### **Grid Gaps**

**Standardize:**
```tsx
// Tight
gap-2  // 8px

// Normal
gap-4  // 16px

// Comfortable
gap-6  // 24px

// Spacious  
gap-8  // 32px
```

**Update in:**
- [ ] Product grids
- [ ] Category cards
- [ ] Cart item spacing

---

### **Margin/Padding**

**Heading margins:**
```tsx
h1: mb-6
h2: mb-4  
h3: mb-3
h4: mb-2
```

**Component padding:**
```tsx
Cards: p-6
Buttons: px-6 py-3 (default)
Containers: px-4 md:px-6 lg:px-8
```

---

## 📱 Responsive Fixes (1.5 hours)

### **Text Sizing**

**Replace:**
```tsx
// Old - too extreme jumps
text-4xl md:text-6xl lg:text-7xl

// New - gradual scaling
text-3xl md:text-5xl lg:text-6xl
```

**Update:**
- [ ] Hero headline
- [ ] Section titles
- [ ] Page headings

---

### **Grid Columns**

**Add intermediate breakpoints:**
```tsx
// Old
grid-cols-1 sm:grid-cols-2

// New
grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
```

**Update:**
- [ ] Shop category grid
- [ ] Product grid
- [ ] Cart suggestions

---

### **Mobile Padding**

**Ensure all sections have:**
```tsx
px-4 md:px-6 lg:px-8
py-12 md:py-16 lg:py-24
```

**Check:**
- [ ] All AesopSection components
- [ ] All page containers
- [ ] Mobile navigation

---

## 🎯 Component Consistency (1 hour)

### **Buttons**

**Audit all buttons for:**
- [ ] Consistent size prop
- [ ] Consistent padding
- [ ] Consistent hover states
- [ ] Consistent border radius

---

### **Icons**

**Standardize sizes:**
```tsx
// Small
h-4 w-4  // 16px

// Default
h-5 w-5  // 20px

// Large
h-6 w-6  // 24px
```

**Update:**
- [ ] Header icons
- [ ] Footer social icons
- [ ] Cart icons
- [ ] Product detail icons

---

### **Cards**

**Consistent structure:**
```tsx
<div className="rounded-lg border border-border-300 bg-surface-0 p-6">
  {/* content */}
</div>
```

**Update:**
- [ ] Product cards
- [ ] Category cards
- [ ] Cart summary
- [ ] Info cards

---

## 📊 Testing Checklist

**After each fix:**
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1440px)
- [ ] Check dark mode (if applicable)
- [ ] Verify hover states
- [ ] Check focus states

---

## 🔄 Implementation Order

**Day 1 (2-3 hours):**
1. ✅ Quick wins (HSL colors, padding, buttons)
2. Typography fixes (headings, line-height)
3. Commit: "fix: standardize typography and spacing"

**Day 2 (2-3 hours):**
4. Color standardization (ink, gold, backgrounds)
5. Spacing system (gaps, margins, padding)
6. Commit: "fix: standardize colors and spacing"

**Day 3 (2-3 hours):**
7. Responsive fixes (text, grids, mobile padding)
8. Component consistency (buttons, icons, cards)
9. Commit: "fix: improve responsive design and component consistency"

**Day 4 (1 hour):**
10. Final testing on all pages
11. Fix any remaining issues
12. Commit: "fix: final visual design improvements"

---

## 📁 Files to Update (Priority Order)

**High Priority:**
1. `src/components/Hero.tsx`
2. `src/app/shop/page.tsx`
3. `src/app/cart/page.tsx`
4. `src/components/Header.tsx`
5. `src/components/Footer.tsx`

**Medium Priority:**
6. `src/app/product/[slug]/page.tsx`
7. `src/components/product/*`
8. `src/app/categories/page.tsx`
9. `src/app/about/page.tsx`

**Low Priority:**
10. `src/app/contact/page.tsx`
11. `src/app/how-it-works/page.tsx`
12. Admin pages (if needed)

---

## 🎨 Before Starting

**Create backup branch:**
```bash
git checkout -b feature/visual-design-fixes
```

**After each major section:**
```bash
git add .
git commit -m "fix: [description of what was fixed]"
```

**When complete:**
```bash
git checkout main
git merge feature/visual-design-fixes
git push origin main
```

---

## ✅ Final Verification

**Before calling it done:**
- [ ] All HSL colors replaced with tokens
- [ ] All sections have consistent padding
- [ ] All buttons use size prop
- [ ] All headings use design system scale
- [ ] All colors use design tokens
- [ ] All grids have proper breakpoints
- [ ] All spacing uses design system
- [ ] All icons same size category
- [ ] Mobile looks good (test on real device)
- [ ] Desktop looks polished (test on large screen)

---

**Time estimate:** 6-10 hours total
**Impact:** Professional, consistent visual design
**Difficulty:** Medium (mostly find/replace and systematic updates)
