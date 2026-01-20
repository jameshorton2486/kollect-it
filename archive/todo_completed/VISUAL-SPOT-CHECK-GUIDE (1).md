# Kollect-It Visual Spot Check Guide

**Purpose:** Verify luxury brand consistency across key pages before launch  
**Time Required:** 15-20 minutes  
**Date:** January 18, 2026

---

## Quick Reference: Design System Values

| Element | Expected Value | Visual Check |
|---------|----------------|--------------|
| **Gold Accent** | `#D4AF37` (lux-gold) | Rich antique gold |
| **Page Background** | Warm pearl/cream | Soft, not pure white |
| **Header/Footer** | Dark charcoal | `hsl(220, 12%, 18%)` |
| **Headlines** | Cormorant Garamond | Elegant serif |
| **Body Text** | Inter | Clean sans-serif |
| **Card Shadows** | Subtle, soft | No harsh black shadows |
| **Hover States** | Gold tint + slight lift | Smooth 200ms transition |

---

## Page-by-Page Checklist

### 1. Homepage (`/`)
**Priority: CRITICAL**

- [ ] Header: Dark charcoal background, gold logo hover
- [ ] Hero section: Cream/pearl background, serif headline in gold
- [ ] Category cards: White cards on pearl background, gold accent on hover
- [ ] Product cards: Consistent shadow, gold hover states
- [ ] Footer: Matches header background exactly
- [ ] Newsletter signup: Gold button, charcoal text on hover

**Screenshot locations to capture:**
1. Above the fold (hero)
2. Category grid section
3. Footer with newsletter

---

### 2. Shop/Browse Page (`/browse`)
**Priority: CRITICAL**

- [ ] Page title: Gold serif headline
- [ ] Filter sidebar: Clean borders, pearl background
- [ ] Product grid: Consistent card sizing
- [ ] Product cards: 
  - [ ] Gold category label
  - [ ] Charcoal title text
  - [ ] Gray condition/year text
  - [ ] Price in dark ink
  - [ ] Heart icon gold on hover
- [ ] Pagination: Gold accent on active page
- [ ] Empty state (if applicable): Matches design system

---

### 3. Product Detail Page (`/product/[slug]`)
**Priority: CRITICAL**

- [ ] Breadcrumbs: Gray text, gold hover
- [ ] Product title: Serif, charcoal or gold
- [ ] Price: Large, dark ink
- [ ] Add to Cart button: Gold background, charcoal text
- [ ] Image gallery: Clean borders, subtle shadow
- [ ] Product tabs: Gold underline on active
- [ ] Related products: Consistent with shop grid

---

### 4. Cart Page (`/cart`)
**Priority: HIGH**

- [ ] Page title: Gold serif
- [ ] Cart items: White cards, subtle border
- [ ] Remove button: Subtle, gold on hover
- [ ] Quantity controls: Clean, accessible
- [ ] Subtotal: Clear typography hierarchy
- [ ] Checkout button: Gold, prominent

---

### 5. Checkout Page (`/checkout`)
**Priority: HIGH**

- [ ] Form fields: Clean borders, gold focus ring
- [ ] Section headers: Serif, appropriately sized
- [ ] Order summary: Clear hierarchy
- [ ] Payment section: Stripe elements styled correctly
- [ ] Submit button: Gold, disabled state in gray
- [ ] Trust indicators: Subtle, professional

---

### 6. Category Pages (`/category/[slug]`)
**Priority: HIGH**

- [ ] Hero banner: Cream background, gold headline
- [ ] Subcategory pills: Gold border/background on active
- [ ] Product grid: Matches browse page
- [ ] Empty state: Elegant messaging

---

### 7. About Page (`/about`)
**Priority: MEDIUM**

- [ ] Hero: Consistent with brand
- [ ] Content sections: Proper typography hierarchy
- [ ] Images: Professional, well-composed
- [ ] Call-to-action: Gold buttons

---

### 8. Contact Page (`/contact`)
**Priority: MEDIUM**

- [ ] Form: Clean, accessible
- [ ] Input focus states: Gold ring
- [ ] Submit button: Gold
- [ ] Success state: Green checkmark, gold accent
- [ ] Contact info: Clear, professional

---

### 9. Account Pages (`/account`)
**Priority: MEDIUM**

- [ ] Navigation tabs: Gold active indicator
- [ ] Order history: Clean table/cards
- [ ] Profile form: Consistent with contact form
- [ ] Password change: Clear feedback states

---

### 10. Legal Pages (`/terms`, `/privacy`, `/refund-policy`)
**Priority: LOW (but check one)

- [ ] Page title: Gold serif
- [ ] Body text: Readable, proper line height
- [ ] Links: Gold on hover
- [ ] Back to top: If present, gold accent

---

## Mobile Responsiveness Check

Test on these breakpoints:
- [ ] **375px** (iPhone SE)
- [ ] **414px** (iPhone 14)
- [ ] **768px** (iPad)
- [ ] **1024px** (iPad landscape/small laptop)

**Key mobile checks:**
- [ ] Header: Hamburger menu works, logo visible
- [ ] Hero: Text readable, not cut off
- [ ] Product grid: 2 columns on mobile, 3-4 on tablet
- [ ] Checkout: Form fields properly sized
- [ ] Footer: Stacks cleanly, newsletter usable

---

## Common Issues to Watch For

### ❌ Red Flags (Needs Fix)
- Pure white (#FFFFFF) backgrounds instead of pearl/cream
- Generic gray text instead of ink/lux-gray
- Blue links instead of gold
- Sharp/harsh shadows
- Inconsistent button styles
- Sans-serif headlines where serif expected

### ⚠️ Yellow Flags (Note for Later)
- Minor spacing inconsistencies
- Slight color variations in third-party components
- Loading states without animation

### ✅ Green Flags (Expected)
- Warm, cohesive color palette throughout
- Consistent typography hierarchy
- Smooth hover transitions
- Gold accents used sparingly but effectively
- Professional, upscale feel

---

## Screenshot Documentation

For each page, capture:
1. **Desktop (1440px)** - Full page
2. **Mobile (375px)** - Above fold + scroll
3. **Any hover states** - Button, card, link hovers

Save to: `screenshots/visual-audit-[date]/`

---

## Sign-Off

| Page | Desktop ✓ | Mobile ✓ | Notes |
|------|-----------|----------|-------|
| Homepage | [ ] | [ ] | |
| Browse | [ ] | [ ] | |
| Product Detail | [ ] | [ ] | |
| Cart | [ ] | [ ] | |
| Checkout | [ ] | [ ] | |
| Category | [ ] | [ ] | |
| About | [ ] | [ ] | |
| Contact | [ ] | [ ] | |
| Account | [ ] | [ ] | |
| Legal (any) | [ ] | [ ] | |

**Reviewed by:** _______________  
**Date:** _______________  
**Status:** [ ] APPROVED / [ ] NEEDS FIXES

---

*Use this checklist to confirm the luxury brand experience is consistent before announcing the site to customers.*
