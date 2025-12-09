# NEXT CHATGPT PROMPT — BATCH D, E, F PAGES

## CONTEXT

Batches A, B, and C are complete! Claude has implemented:

**Batch A:**
- Category page ✅

**Batch B:**
- About page ✅
- Contact page ✅
- Consign page ✅

**Batch C:**
- Terms of Service ✅
- Privacy Policy ✅
- Refund Policy ✅
- Shared LegalPageLayout component ✅

The design system is fully active. Claude already has all tokens, typography, spacing, and color definitions.

---

## REQUEST — REMAINING PAGE WIREFRAMES

I need wireframes for the remaining user-facing pages. Structure only — no tokens needed.

Each wireframe must include:
1. ASCII/Text Layout
2. Section Breakdown (purpose + content)
3. Tailwind Structure Snippet (DOM hierarchy only)
4. Mobile Notes (stacking/collapse behavior)

---

## BATCH D — PRODUCT & SHOP PAGES

### 1. Product Detail Page `/product/[slug]`

Include:
- Image gallery (main image + thumbnails)
- Product title (serif heading)
- Price display
- Add to Cart button
- Add to Wishlist button
- Description section
- Details grid: Condition, Provenance, Dimensions, Year, Artist/Maker
- Related Products section (4 ProductCards)

### 2. Shop Page `/shop`

Include:
- Page header with title
- Filter bar (category, price range, sort)
- Product grid (responsive: 2 → 3 → 4 columns)
- Pagination or infinite scroll placeholder
- Empty state for no results

### 3. Search Results Page `/search`

Include:
- Search input (pre-filled with query)
- Results count
- Filter options
- Product grid
- No results state with suggestions

---

## BATCH E — USER ACCOUNT PAGES

### 4. Account Dashboard `/account`

Include:
- Welcome header with user name
- Quick stats (orders, wishlist count)
- Recent orders list
- Account navigation (Orders, Wishlist, Settings)
- Quick links section

### 5. Wishlist Page `/wishlist`

Include:
- Page header
- Wishlist grid (ProductCards)
- Empty state with CTA to browse
- Remove item functionality hint

### 6. Cart Page `/cart`

Include:
- Cart items list (image, title, price, quantity, remove)
- Order summary sidebar (subtotal, shipping estimate, total)
- Continue Shopping link
- Proceed to Checkout button
- Empty cart state

### 7. Checkout Page `/checkout`

Include:
- Progress indicator (Shipping → Payment → Review)
- Shipping address form
- Payment section placeholder
- Order summary sidebar
- Place Order button

---

## BATCH F — SUPPLEMENTARY PAGES

### 8. FAQ Page `/faq`

Include:
- Page header
- Category tabs or sections (Buying, Selling, Shipping, Returns)
- Accordion-style Q&A items
- Contact CTA at bottom

### 9. Cookie Policy `/cookies`

Include:
- Same structure as legal pages (use LegalPageLayout)
- Sections: What Are Cookies, How We Use Them, Managing Cookies, Contact

### 10. Browse/Categories Page `/browse` or `/categories`

Include:
- Page header
- Category cards grid (4 main categories)
- Each card: image, title, item count, link
- Optional: featured items from each category

---

## OUTPUT FORMAT (STRICT)

For EACH page:

```
## PAGE NAME

### Wireframe
[ASCII layout]

### Sections
1. Section Name
   - Purpose
   - Content structure
   - Layout behavior

### Tailwind Structure Snippet
[Structural pseudocode only — no colors, no typography tokens]

### Mobile Notes
[Explain stacking and responsive behaviors]
```

---

## IMPORTANT REMINDERS

- Claude already has the full design system
- You only need to output wireframes and structural plans
- Claude will apply lux color palette, typography classes, and spacing automatically
- Focus on layout, content placement, and responsive behavior
- Think luxury editorial design (1stDibs, Sotheby's aesthetic)

---

## PRIORITY ORDER

If you need to split this up:
1. **Batch D first** (Product, Shop, Search) — core commerce pages
2. **Batch E second** (Account, Wishlist, Cart, Checkout) — user flow
3. **Batch F third** (FAQ, Cookies, Browse) — supplementary

---

END OF PROMPT
