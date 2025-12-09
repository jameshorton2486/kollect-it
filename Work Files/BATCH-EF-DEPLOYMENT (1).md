# Batches E & F - Deployment Instructions

**Generated:** December 8, 2025  
**Total Files:** 8

---

## File Mappings

### BATCH E (Account, Wishlist, Cart, Checkout)

| Source File | Destination |
|-------------|-------------|
| `batch-ef/account-page.tsx` | `src/app/account/page.tsx` |
| `batch-ef/wishlist-page.tsx` | `src/app/wishlist/page.tsx` |
| `batch-ef/cart-page.tsx` | `src/app/cart/page.tsx` |
| `batch-ef/checkout-page.tsx` | `src/app/checkout/page.tsx` |

### BATCH F (FAQ, Cookies, Categories, Our Process)

| Source File | Destination |
|-------------|-------------|
| `batch-ef/faq-page.tsx` | `src/app/faq/page.tsx` |
| `batch-ef/cookies-page.tsx` | `src/app/cookies/page.tsx` |
| `batch-ef/categories-page.tsx` | `src/app/categories/page.tsx` |
| `batch-ef/our-process-page.tsx` | `src/app/our-process/page.tsx` |

---

## Cursor Prompt

Copy and paste this into Cursor:

```
BATCH E (Account/Cart Pages):
1. src/app/account/page.tsx ← Work-Files/batch-ef/account-page.tsx
2. src/app/wishlist/page.tsx ← Work-Files/batch-ef/wishlist-page.tsx
3. src/app/cart/page.tsx ← Work-Files/batch-ef/cart-page.tsx
4. src/app/checkout/page.tsx ← Work-Files/batch-ef/checkout-page.tsx

BATCH F (Info Pages):
5. src/app/faq/page.tsx ← Work-Files/batch-ef/faq-page.tsx
6. src/app/cookies/page.tsx ← Work-Files/batch-ef/cookies-page.tsx
7. src/app/categories/page.tsx ← Work-Files/batch-ef/categories-page.tsx
8. src/app/our-process/page.tsx ← Work-Files/batch-ef/our-process-page.tsx

Replace existing files. These files use the established design system.
```

---

## Design System Applied

All files now consistently use:

**Typography Classes:**
- `.heading-page` — Page titles (gold, serif)
- `.heading-section` — Section headers (gold, serif)
- `.heading-subsection` — Subsection titles (charcoal, serif)
- `.text-label` — Uppercase metadata labels
- `.text-muted` — Captions and secondary text
- `.lead` — Intro paragraphs

**Color Tokens:**
- `bg-lux-pearl` — Page backgrounds
- `bg-lux-cream` — Section backgrounds
- `bg-lux-charcoal` — Dark sections/CTAs
- `bg-lux-white` — Cards and panels
- `text-lux-gold` — Accent text
- `text-lux-black` — Primary text
- `text-ink-600` — Body text
- `border-lux-silver-soft` — Subtle borders

**Button Classes:**
- `.btn-primary` — Gold background, charcoal text
- `.btn-secondary` — Gold border, transparent background

**Layout Classes:**
- `.container` — Max-width container with padding
- `.section-normal` — Standard vertical padding (py-16)
- `.section-grand` — Large vertical padding (py-24)
- `.gap-standard` — Standard grid gap
- `.gap-luxury` — Larger grid gap

---

## Testing Checklist

After deployment, test each page:

### Batch E
- [ ] **Account** (`/account`) — Tab navigation works, modals open/close
- [ ] **Wishlist** (`/wishlist`) — Grid displays, remove buttons work
- [ ] **Cart** (`/cart`) — Empty state shows, quantity controls work
- [ ] **Checkout** (`/checkout`) — Form validation, step progression

### Batch F
- [ ] **FAQ** (`/faq`) — Accordions expand/collapse
- [ ] **Cookies** (`/cookies`) — TOC sidebar displays on desktop
- [ ] **Categories** (`/categories`) — Category cards link correctly
- [ ] **Our Process** (`/our-process`) — Steps display with icons

---

## Dependencies

**Cookies page requires:** `LegalPageLayout` component  
Location: `src/components/legal/LegalPageLayout.tsx`

If this component wasn't deployed from Batch C, deploy it first from:  
`batch-pages/LegalPageLayout.tsx`

---

## Notes

- Account page is a client component with complex state (tabs, modals)
- Cart/Checkout pages use existing `CartContext` and Stripe integration
- All API endpoints remain unchanged (`/api/wishlist`, `/api/orders`, etc.)
- FAQ now uses expandable `<details>` elements for better UX
- Categories page now has a dark CTA section at bottom

---

## Complete Batch Summary

| Batch | Pages | Status |
|-------|-------|--------|
| Homepage | Header, Footer, 5 sections | ✅ Ready |
| A | Category [slug] | ✅ Ready |
| B | About, Contact, Consign | ✅ Ready |
| C | Terms, Privacy, Refund (+ LegalPageLayout) | ✅ Ready |
| D | Product [slug], Browse, SearchResults | ✅ Ready |
| **E** | **Account, Wishlist, Cart, Checkout** | ✅ **Complete** |
| **F** | **FAQ, Cookies, Categories, Our Process** | ✅ **Complete** |

**Total files ready for deployment:** 29
