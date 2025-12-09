# Batch I & J Deployment Guide

**Created:** December 9, 2025  
**Files:** 6 pages (4 info + 2 utility)

---

## Files Created

| Source File | Deploy To |
|-------------|-----------|
| `batch-ij/shipping-returns-page.tsx` | `src/app/shipping-returns/page.tsx` |
| `batch-ij/how-it-works-page.tsx` | `src/app/how-it-works/page.tsx` |
| `batch-ij/authentication-page.tsx` | `src/app/authentication/page.tsx` |
| `batch-ij/payment-page.tsx` | `src/app/payment/page.tsx` |
| `batch-ij/subcategory-page.tsx` | `src/app/subcategory/[slug]/page.tsx` |
| `batch-ij/compare-page.tsx` | `src/app/compare/page.tsx` |

---

## Cursor Prompt

Copy and paste this into Cursor:

```
Please replace the following files with the updated versions from Work-Files/batch-ij/:

BATCH I (Information Pages):
1. src/app/shipping-returns/page.tsx ← Work-Files/batch-ij/shipping-returns-page.tsx
2. src/app/how-it-works/page.tsx ← Work-Files/batch-ij/how-it-works-page.tsx
3. src/app/authentication/page.tsx ← Work-Files/batch-ij/authentication-page.tsx
4. src/app/payment/page.tsx ← Work-Files/batch-ij/payment-page.tsx

BATCH J (Utility Pages):
5. src/app/subcategory/[slug]/page.tsx ← Work-Files/batch-ij/subcategory-page.tsx
6. src/app/compare/page.tsx ← Work-Files/batch-ij/compare-page.tsx

Replace the existing files completely with the new versions.
```

---

## Design System Applied

### Information Pages Pattern

**Layout:**
- Hero section: `bg-lux-cream section-normal border-b border-lux-silver-soft`
- Main content: `bg-lux-pearl section-normal`
- Dark CTA: `bg-lux-charcoal section-normal`

**Info Card Pattern:**
```tsx
<div className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 md:p-8 shadow-clean">
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 rounded-full bg-lux-cream flex items-center justify-center">
      <Icon className="h-6 w-6 text-lux-gold" />
    </div>
    <div>
      <h2 className="heading-subsection">[Title]</h2>
      <p className="text-ink-600 mt-2">[Description]</p>
    </div>
  </div>
</div>
```

**Step Card Pattern (How It Works):**
```tsx
<div className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 shadow-clean">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-full bg-lux-cream flex items-center justify-center">
      <Icon className="h-5 w-5 text-lux-gold" />
    </div>
    <span className="text-label text-lux-gold">Step 01</span>
  </div>
  <h3 className="heading-subsection">[Title]</h3>
  <p className="text-ink-600 text-sm">[Description]</p>
</div>
```

---

## Page-Specific Features

### Shipping & Returns
- 4 policy cards with icons (Truck, MapPin, RotateCcw, Globe)
- Bullet point lists with gold bullets
- Dark CTA section with contact link

### How It Works
- Dark hero with "At a Glance" summary card
- Two parallel paths: Collectors (3 steps) and Consignors (3 steps)
- Trust section with listing standards checklist
- Dual CTA buttons (Browse / Consign)

### Authentication Guarantee
- 3 process cards (Our Process, Your Protection, Third-Party)
- Glossary section with 4 terminology definitions in 2-column grid
- Dark CTA with email contact

### Payment Options
- 4 payment method cards in 2-column grid
- Security section with ShieldCheck icon
- Trust badges (SSL, PCI, Secure Checkout)

### Subcategory Page
- Breadcrumb navigation (Browse > Category > Subcategory)
- Cream header with category label
- ProductGrid component for products
- Empty state with Package icon and dual CTAs

### Compare Page
- Cream header with Clear All button
- Product cards row (responsive: 1-3 columns)
- Specs comparison table (Category, Condition, Year, Artist, Rarity)
- Horizontal scroll on mobile
- Empty state with Scale icon

---

## Testing Checklist

### Batch I — Information Pages

- [ ] **Shipping & Returns**
  - [ ] All 4 policy cards display
  - [ ] Icons render correctly
  - [ ] Dark CTA section links to /contact
  - [ ] Mobile layout stacks cards

- [ ] **How It Works**
  - [ ] Dark hero section displays
  - [ ] "At a Glance" card visible
  - [ ] Collector steps (3) display
  - [ ] Consignor steps (3) display
  - [ ] Trust section with checkmarks
  - [ ] Both CTA buttons work

- [ ] **Authentication Guarantee**
  - [ ] Process cards display with icons
  - [ ] Glossary terms in 2-column grid
  - [ ] Dark CTA with email

- [ ] **Payment Options**
  - [ ] 4 payment method cards in grid
  - [ ] Security section with trust badges
  - [ ] Browse button works

### Batch J — Utility Pages

- [ ] **Subcategory Page**
  - [ ] Breadcrumb navigation works
  - [ ] Category name displays
  - [ ] Products load and display
  - [ ] Empty state shows when no products
  - [ ] Back to category link works

- [ ] **Compare Page**
  - [ ] Loading state shows
  - [ ] Empty state shows with no products
  - [ ] Products display in cards
  - [ ] Remove button works (X)
  - [ ] Clear All button works
  - [ ] Specs table displays
  - [ ] View Details buttons work
  - [ ] Horizontal scroll on mobile

---

## Dependencies

**Shipping & Returns, How It Works, Authentication, Payment:**
- `lucide-react` icons
- No external dependencies

**Subcategory Page:**
- `@/components/ProductGrid`
- `@/lib/prisma`
- Prisma ORM queries

**Compare Page:**
- localStorage for compare list
- API route: `/api/products/compare`

---

## Icons Used

| Page | Icons (from lucide-react) |
|------|---------------------------|
| Shipping & Returns | Truck, MapPin, RotateCcw, Globe |
| How It Works | Search, Heart, ShoppingCart, Upload, FileSignature, Tag, CheckCircle |
| Authentication | CheckCircle, Search, Shield, FileText |
| Payment | CreditCard, Wallet, Landmark, CalendarClock, ShieldCheck |
| Subcategory | Package |
| Compare | X, Scale |

---

## Summary

| Batch | Pages | Status |
|-------|-------|--------|
| I | Shipping & Returns, How It Works, Authentication, Payment | ✅ Ready |
| J | Subcategory, Compare | ✅ Ready |

**Total files:** 6 pages ready for deployment

---

## Complete Site Status

| Batch | Pages | Status |
|-------|-------|--------|
| Homepage | Hero, Categories, Featured, Trust, Newsletter, CTA | ✅ Deployed |
| Header/Footer | Site-wide components | ✅ Deployed |
| A-D | Category, About, Contact, Consign, Legal, Product, Browse, Search | ✅ Ready |
| E-F | Account, Wishlist, Cart, Checkout, FAQ, Cookies, Categories, Our Process | ✅ Ready |
| G-H | Login, Register, Forgot/Reset Password, Checkout Success/Cancel | ✅ Ready |
| **I-J** | Shipping, How It Works, Authentication, Payment, Subcategory, Compare | ✅ Ready |

**Total design system pages ready:** 35+ pages
