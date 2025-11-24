# 🔧 Specific Code Fixes - Examples

## Quick Reference: What to Change

---

## 1️⃣ HSL Color Fixes

### **Shop Page (src/app/shop/page.tsx)**

**Line 170 - Change:**
```tsx
// BEFORE
<p className="text-[hsl(var(--ink-700))] mb-4">

// AFTER
<p className="text-ink-700 mb-4">
```

**Line 176 - Change:**
```tsx
// BEFORE
<div className="rounded border border-[hsl(var(--border-300))] bg-cream p-6">

// AFTER
<div className="rounded border border-border-300 bg-surface-50 p-6">
```

**Line 178 - Change:**
```tsx
// BEFORE
<p className="text-[hsl(var(--ink-700))]">

// AFTER
<p className="text-ink-700">
```

**Line 205 - Change:**
```tsx
// BEFORE
<p className="max-w-[700px] mx-auto text-base leading-[1.7] text-[hsl(var(--ink-700))]">

// AFTER
<p className="max-w-[700px] mx-auto text-base leading-relaxed text-ink-700">
```

**Line 223 - Change:**
```tsx
// BEFORE
className="group block overflow-hidden rounded border border-[hsl(var(--border-300))] bg-surface-0 shadow-sm transition hover:shadow-md"

// AFTER
className="group block overflow-hidden rounded border border-border-300 bg-surface-0 shadow-sm transition hover:shadow-md"
```

**Line 240 - Change:**
```tsx
// BEFORE
<p className="ki-text-sm text-[hsl(var(--ink-700))]">

// AFTER
<p className="ki-text-sm text-ink-700">
```

---

## 2️⃣ Typography Fixes

### **Hero Component (src/components/Hero.tsx)**

**Line 15-19 - Change:**
```tsx
// BEFORE
<h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-ink-900">

// AFTER
<h1 className="font-serif text-display-xl font-bold mb-6 leading-tight text-ink-900">
```

**Line 23 - Change:**
```tsx
// BEFORE
<p className="text-lg md:text-xl text-ink-700 mb-8 max-w-2xl mx-auto leading-relaxed">

// AFTER
<p className="text-body-lg text-ink-700 mb-8 max-w-2xl mx-auto leading-relaxed">
```

---

### **Cart Page (src/app/cart/page.tsx)**

**Line 79 - Change:**
```tsx
// BEFORE
<h1 className="font-serif text-4xl text-ink mb-3">

// AFTER
<h1 className="font-serif text-display-lg text-ink-900 mb-3">
```

**Line 82 - Change:**
```tsx
// BEFORE
<p className="text-ink-light mb-8 text-lg">

// AFTER
<p className="text-ink-700 mb-8 text-body-lg">
```

**Line 99 - Change:**
```tsx
// BEFORE
<h2 className="font-serif text-3xl md:text-4xl text-ink text-center mb-12">

// AFTER
<h2 className="font-serif text-display-md text-ink-900 text-center mb-12">
```

**Line 129 - Change:**
```tsx
// BEFORE
<h3 className="font-serif text-lg text-ink mb-2 group-hover:text-gold transition-colors line-clamp-2">

// AFTER
<h3 className="font-serif text-lg text-ink-900 mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
```

**Line 132 - Change:**
```tsx
// BEFORE
<p className="text-gold font-semibold text-lg">

// AFTER  
<p className="text-gold-600 font-semibold text-lg">
```

**Line 135 - Change:**
```tsx
// BEFORE
<p className="text-ink-light text-sm">{p.category?.name}</p>

// AFTER
<p className="text-ink-600 text-sm">{p.category?.name}</p>
```

**Line 151 - Change:**
```tsx
// BEFORE
<p className="text-[12px] tracking-[0.2em] text-[hsl(var(--gold-500))] uppercase mb-2 font-normal">

// AFTER
<p className="text-xs tracking-widest text-gold-600 uppercase mb-2 font-normal">
```

**Line 154 - Change:**
```tsx
// BEFORE
<h1 className="font-serif text-4xl md:text-5xl text-ink">

// AFTER
<h1 className="font-serif text-display-lg text-ink-900">
```

**Line 160 - Change:**
```tsx
// BEFORE
<Link href="/shop" className="text-gold font-semibold hover:underline">

// AFTER
<Link href="/shop" className="text-gold-600 font-semibold hover:underline">
```

---

## 3️⃣ Spacing Fixes

### **Shop Page (src/app/shop/page.tsx)**

**Line 193 - Change:**
```tsx
// BEFORE
<div className="shop-intro text-center mb-[clamp(3rem,6vw,5rem)]">

// AFTER
<div className="shop-intro text-center mb-section">
```

---

### **Hero Component (src/components/Hero.tsx)**

**Line 8 - Change:**
```tsx
// BEFORE
<section className="relative bg-gradient-subtle py-20 md:py-32 overflow-hidden">

// AFTER
<section className="relative bg-gradient-subtle py-16 md:py-24 lg:py-32 overflow-hidden">
```

**Line 49 - Change:**
```tsx
// BEFORE
<div className="mt-12 pt-8 border-t border-border-300">

// AFTER
<div className="mt-section-small pt-8 border-t border-border-300">
```

---

## 4️⃣ Button Fixes

### **Hero Component (src/components/Hero.tsx)**

**Lines 30-35 - Change:**
```tsx
// BEFORE
<Button
  asChild
  size="lg"
  className="bg-cta-600 hover:bg-cta-700 text-white font-semibold px-8 py-6 text-lg shadow-cta"
>

// AFTER
<Button
  asChild
  size="lg"
  className="bg-cta-600 hover:bg-cta-700 text-white font-semibold shadow-cta"
>
```
*(Remove redundant px/py since size="lg" handles it)*

**Lines 38-43 - Change:**
```tsx
// BEFORE
<Button
  asChild
  size="lg"
  variant="outline"
  className="border-2 border-border-300 text-ink-900 hover:bg-surface-100 hover:text-ink-900 px-8 py-6 text-lg"
>

// AFTER
<Button
  asChild
  size="lg"
  variant="outline"
  className="border-2 border-border-300 text-ink-900 hover:bg-surface-100 hover:text-ink-900"
>
```

---

### **Cart Page (src/app/cart/page.tsx)**

**Line 88 - Change:**
```tsx
// BEFORE
<Link
  href="/shop"
  className="inline-block bg-gold text-white font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
>

// AFTER
<Button
  asChild
  size="lg"
  className="bg-gold-600 hover:bg-gold-700"
>
  <Link href="/shop">
    Browse Collection
  </Link>
</Button>
```

**Line 301-306 - Change:**
```tsx
// BEFORE
<Link
  href="/checkout"
  className="block w-full bg-gold text-white font-semibold py-4 text-center rounded-lg hover:opacity-90 transition-opacity mb-3"
>

// AFTER
<Button
  asChild
  size="lg"
  className="w-full bg-gold-600 hover:bg-gold-700 mb-3"
>
  <Link href="/checkout">
    Proceed to Checkout
  </Link>
</Button>
```

**Line 308-313 - Change:**
```tsx
// BEFORE
<button
  onClick={() => (window.location.href = "/shop")}
  className="w-full border-2 border-gold text-gold font-semibold py-3 rounded-lg hover:bg-gold hover:text-white transition-colors"
>

// AFTER
<Button
  onClick={() => (window.location.href = "/shop")}
  variant="outline"
  size="lg"
  className="w-full border-2 border-gold-600 text-gold-600 hover:bg-gold-600 hover:text-white"
>
  Continue Shopping
</Button>
```

---

## 5️⃣ Grid/Layout Fixes

### **Shop Page (src/app/shop/page.tsx)**

**Line 218 - Change:**
```tsx
// BEFORE
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

// AFTER
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
```

---

### **Cart Page (src/app/cart/page.tsx)**

**Line 102 - Change:**
```tsx
// BEFORE
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

// AFTER
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
```

**Line 168 - Change:**
```tsx
// BEFORE
<div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

// AFTER
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
```

**Line 377 - Change:**
```tsx
// BEFORE
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">

// AFTER
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
```

---

## 6️⃣ Responsive Text Fixes

### **Hero Component**

**Line 15 - Change:**
```tsx
// BEFORE
<h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-ink-900">

// AFTER
<h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-ink-900">
```

---

### **Cart Page**

**Line 154 - Change:**
```tsx
// BEFORE
<h1 className="font-serif text-4xl md:text-5xl text-ink">

// AFTER
<h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ink-900">
```

---

## 🎯 Find & Replace Patterns

**Run these in VS Code (use regex):**

### **Pattern 1: HSL Colors**
```
Find:    text-\[hsl\(var\(--ink-([0-9]+)\)\)\]
Replace: text-ink-$1

Find:    bg-\[hsl\(var\(--surface-([0-9]+)\)\)\]
Replace: bg-surface-$1

Find:    border-\[hsl\(var\(--border-([0-9]+)\)\)\]
Replace: border-border-$1
```

### **Pattern 2: Replace bg-cream**
```
Find:    bg-cream
Replace: bg-surface-50
```

### **Pattern 3: Replace text-ink-light**
```
Find:    text-ink-light
Replace: text-ink-700
```

### **Pattern 4: Replace text-gold (base)**
```
Find:    text-gold(\s|")
Replace: text-gold-600$1
```

### **Pattern 5: Arbitrary line-height**
```
Find:    leading-\[1\.7\]
Replace: leading-relaxed
```

### **Pattern 6: Arbitrary tracking**
```
Find:    tracking-\[0\.2em\]
Replace: tracking-widest
```

---

## 📋 Component-by-Component Summary

### **Hero.tsx**
- [ ] Fix heading responsive sizes (line 15)
- [ ] Fix paragraph size (line 23)
- [ ] Remove redundant button padding (lines 30-43)
- [ ] Fix section padding (line 8)

### **shop/page.tsx**
- [ ] Replace 6 HSL color instances
- [ ] Fix grid columns (line 218)
- [ ] Fix arbitrary leading value (line 205)
- [ ] Fix bg-cream to bg-surface-50 (line 176)

### **cart/page.tsx**
- [ ] Replace text-ink → text-ink-900 (8 instances)
- [ ] Replace text-ink-light → text-ink-700 (4 instances)
- [ ] Replace text-gold → text-gold-600 (6 instances)
- [ ] Convert link buttons to Button components (3 instances)
- [ ] Fix grid responsiveness (3 instances)
- [ ] Fix heading sizes (4 instances)

### **Header.tsx**
- [ ] Standardize icon sizes (lines 77, 84, 91)
- [ ] Fix color tokens (lines 62-64)

### **Footer.tsx**
- [ ] Fix hover colors (lines 54, 63, 72)
- [ ] Standardize icon sizes (lines 57, 66, 75)

---

## ⏱️ Time Estimates

- **Hero.tsx:** 10 minutes
- **shop/page.tsx:** 15 minutes
- **cart/page.tsx:** 25 minutes
- **Header.tsx:** 10 minutes
- **Footer.tsx:** 10 minutes

**Total:** ~70 minutes for main pages

---

## ✅ Testing After Each Fix

```bash
# Start dev server
bun run dev

# Test these URLs:
http://localhost:3000/                 # Hero
http://localhost:3000/shop             # Shop page
http://localhost:3000/cart             # Cart page

# Test on different screen sizes in browser DevTools:
- Mobile: 375px
- Tablet: 768px
- Desktop: 1440px
```

---

## 🔄 Git Workflow

```bash
# After fixing each page
git add src/components/Hero.tsx
git commit -m "fix: improve Hero typography and spacing"

git add src/app/shop/page.tsx
git commit -m "fix: replace HSL colors and improve grid in shop page"

git add src/app/cart/page.tsx
git commit -m "fix: standardize cart page design tokens and buttons"

# etc...
```

---

**Ready to start?** Begin with Hero.tsx - it's quick and you'll see immediate improvement!
