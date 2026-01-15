# Marketplace Guide

This directory documents marketplace-specific logic, workflows, and business rules.

## 🛍️ Seller Workflows

### 1. Seller Registration

1. Sign up with email
2. Complete profile (shop name, description)
3. Agree to seller terms
4. Email verification
5. Payment method setup (for receiving orders)

### 2. Create Listing

1. Upload item photos (via ImageKit)
2. Select category and subcategory
3. Enter item details:
   - Title (SEO-optimized)
   - Description (condition, provenance, authenticity)
   - Price (including fees)
   - Condition (Mint, Near Mint, Excellent, Good, Fair, Poor)
4. Add SKU (optional, for inventory tracking)
5. Set shipping options
6. Publish listing

### 3. Manage Listings

- Edit published listings (affects search index)
- Deactivate without deleting
- Reactivate inactive listings
- View analytics (views, favorites)

---

## 🛒 Buyer Workflows

### 1. Browse & Search

- Browse categories
- Full-text search
- Filter by price, condition, seller rating
- Save favorites

### 2. Purchase

1. Add item to cart (or buy now)
2. Checkout:
   - Shipping address
   - Shipping method selection
   - Payment method (Stripe, PayPal)
3. Order confirmation email
4. Funds held in escrow (seller cannot access yet)

### 3. Item Received

1. Buyer marks item as received
2. Escrow releases to seller
3. Buyer can leave review
4. Return window closes (30 days)

### 4. Returns & Disputes

- Buyer can request return within 30 days
- Seller responds to return request
- Items shipped back to seller
- Refund processed if accepted

---

## 📂 Category Taxonomy

**Structure:** Category > Subcategory

### Main Categories

- **Antiques** (pre-1900)
  - Furniture
  - Clocks & Timepieces
  - Decorative Objects
  - Textiles
- **Collectibles** (1900-present)
  - Trading Cards
  - Action Figures
  - Coins & Stamps
  - Memorabilia
- **Vintage** (50-100 years old)
  - Fashion
  - Home Décor
  - Entertainment
  - Sporting Equipment

### Rules

- ✅ Seller must choose exact category
- ✅ Cannot change category after listing published
- ❌ No custom categories
- ✅ Request new category in GitHub issue

---

## 🏷️ SKU & Inventory

### SKU Format

`CATEGORY-SUBCATEGORY-YEAR-VARIANT`

Example: `ANT-FURN-1890-OAK-CHAIRS-001`

### Rules

- Seller must enter SKU for tracking
- SKU uniquely identifies item variant
- Used for inventory management in dashboard
- Searchable in admin tools

---

## ✨ Condition Standards

All items must be categorized by condition:

| Condition | Description |
|-----------|-------------|
| **Mint** | Original packaging, never used |
| **Near Mint** | Minimal signs of use or age |
| **Excellent** | Well-preserved, minor wear |
| **Good** | Normal wear, fully functional |
| **Fair** | Significant wear, minor damage |
| **Poor** | Heavy wear, requires repair |

---

## 📸 Image Pipeline

See [Operations Guide](../operations/) for image processing details.

### Upload Process

1. Seller uploads image to listing form
2. ImageKit processes image:
   - Auto-crop to item boundaries
   - Standardize background (white/neutral)
   - Resize for web (mobile, tablet, desktop)
   - Compress for CDN delivery
3. Image indexed in search

### CDN Serving

All images served from ImageKit CDN:
- Global edge locations
- Automatic format negotiation (WebP, AVIF)
- Responsive images (srcset)
- Caching headers set to 30 days

---

## 🔍 SEO & Listings

### Listing Metadata

Every listing must include:

- **Title:** Clear, searchable (e.g., "1950s Walnut Dining Table")
- **Description:** Item condition, dimensions, history, authenticity
- **Keywords:** Embedded in title and description
- **Schema.org:** Product + Offer markup
- **Image Alt Text:** Descriptive for accessibility

### Seller Badges

Sellers earn badges through reviews:

- ✅ New Seller (first 10 sales)
- ✅ Trusted (4.5+ star rating)
- ✅ Power Seller (50+ sales)
- ✅ Specialist (5+ sales in category)

---

## 💰 Pricing & Fees

### Listing Fees

- Free to list items
- Seller pays transaction fee when item sells

### Transaction Fee

- 10% of sale price (standard)
- 8% for Trusted Sellers (4.5+ stars)

### Seller Payout

```
Sale Price: $100
Transaction Fee (10%): -$10
Shipping Cost (if included): -$5
Payout to Seller: $85
```

---

## ⭐ Reviews & Ratings

### Buyer Reviews

- 1-5 star rating
- Optional written review
- Can only review after purchase confirmed

### Seller Ratings

- Average of all buyer reviews
- Displayed prominently on seller profile
- Used for badge eligibility

### Removal

Reviews cannot be removed, but:
- Disputes filed with support team
- Defamatory reviews subject to content policy

---

## 🚨 Dispute Resolution

### Buyer Claims

1. Item not received
2. Item not as described
3. Item damaged

### Resolution Process

1. Buyer files claim within 60 days of purchase
2. Seller responds (48 hours)
3. Negotiation period (14 days)
4. Escalation to support team if needed

---

## 📊 Analytics for Sellers

Sellers can view:

- Listing views
- Listing favorites (wishlist adds)
- Click-through rate to order
- Sales history
- Rating trends

---

**Last Updated:** January 2026
**Maintained by:** Marketplace Product Team
