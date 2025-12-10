# Global Components Deployment Guide

**Created:** December 9, 2025  
**Files:** 6 components + 1 index file

---

## Files Created

| Source File | Deploy To |
|-------------|-----------|
| `components/EmptyState.tsx` | `src/components/ui/EmptyState.tsx` |
| `components/LoadingState.tsx` | `src/components/ui/LoadingState.tsx` |
| `components/ErrorState.tsx` | `src/components/ui/ErrorState.tsx` |
| `components/PageHeader.tsx` | `src/components/ui/PageHeader.tsx` |
| `components/InfoCard.tsx` | `src/components/ui/InfoCard.tsx` |
| `components/StepCard.tsx` | `src/components/ui/StepCard.tsx` |
| `components/index.ts` | `src/components/ui/index.ts` |

---

## Cursor Prompt

Copy and paste this into Cursor:

```
Please create a new directory and add the following component files from Work-Files/components/:

1. Create directory: src/components/ui/
2. Add: src/components/ui/EmptyState.tsx ← Work-Files/components/EmptyState.tsx
3. Add: src/components/ui/LoadingState.tsx ← Work-Files/components/LoadingState.tsx
4. Add: src/components/ui/ErrorState.tsx ← Work-Files/components/ErrorState.tsx
5. Add: src/components/ui/PageHeader.tsx ← Work-Files/components/PageHeader.tsx
6. Add: src/components/ui/InfoCard.tsx ← Work-Files/components/InfoCard.tsx
7. Add: src/components/ui/StepCard.tsx ← Work-Files/components/StepCard.tsx
8. Add: src/components/ui/index.ts ← Work-Files/components/index.ts

These are the new global reusable components for Kollect-It.
```

---

## Component API Reference

### EmptyState

```tsx
import { EmptyState } from "@/components/ui";
import { Package } from "lucide-react";

<EmptyState
  icon={Package}
  title="No Products Found"
  description="Try adjusting your filters or browse our full collection."
  primaryAction={{ label: "Browse All", href: "/browse" }}
  secondaryAction={{ label: "Clear Filters", href: "/category/fine-art" }}
/>
```

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `icon` | `LucideIcon` | ✅ | Icon to display |
| `title` | `string` | ✅ | Main heading |
| `description` | `string` | | Supporting text |
| `primaryAction` | `{ label, href }` | | Primary button |
| `secondaryAction` | `{ label, href }` | | Secondary button |

---

### LoadingState

```tsx
import { LoadingState } from "@/components/ui";

// Spinner (default)
<LoadingState text="Loading products..." />

// Skeleton cards
<LoadingState variant="skeleton-cards" count={6} />

// Skeleton table
<LoadingState variant="skeleton-table" count={5} />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"spinner" \| "skeleton-cards" \| "skeleton-table" \| "skeleton-list"` | `"spinner"` | Loading style |
| `count` | `number` | `3` | Number of skeleton items |
| `text` | `string` | | Loading text (spinner only) |

---

### ErrorState

```tsx
import { ErrorState } from "@/components/ui";

<ErrorState
  title="Something went wrong"
  description="We couldn't load the products. Please try again."
  retryAction={() => refetch()}
  backHref="/browse"
  backLabel="Back to Browse"
/>
```

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✅ | Error heading |
| `description` | `string` | | Error details |
| `retryAction` | `() => void` | | Retry callback |
| `backHref` | `string` | | Back link URL |
| `backLabel` | `string` | | Back button text |

---

### PageHeader

```tsx
import { PageHeader } from "@/components/ui";

<PageHeader
  label="Fine Art"
  title="Oil Paintings"
  description="A curated collection of original oil paintings from emerging and established artists."
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Browse", href: "/browse" },
    { label: "Fine Art", href: "/category/fine-art" },
  ]}
  maxWidth="6xl"
/>
```

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✅ | Page title |
| `label` | `string` | | Category label |
| `description` | `string` | | Lead paragraph |
| `breadcrumbs` | `Array<{ label, href }>` | | Navigation trail |
| `maxWidth` | `"4xl" \| "5xl" \| "6xl"` | `"4xl"` | Container width |

---

### InfoCard

```tsx
import { InfoCard } from "@/components/ui";
import { Truck } from "lucide-react";

<InfoCard
  icon={Truck}
  title="Free Shipping"
  description="On all orders over $100"
  details={[
    "Ships within 1-2 business days",
    "Tracking included",
    "Insured delivery"
  ]}
  note="Contact us for expedited shipping options."
/>
```

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `icon` | `LucideIcon` | ✅ | Card icon |
| `title` | `string` | ✅ | Card heading |
| `description` | `string` | | Main text |
| `details` | `string[]` | | Bullet list items |
| `note` | `string` | | Footer note |
| `variant` | `"default" \| "compact"` | `"default"` | Size variant |

---

### StepCard

```tsx
import { StepCard, StepCardGrid } from "@/components/ui";
import { Search, Heart, ShoppingCart } from "lucide-react";

<StepCardGrid columns={3}>
  <StepCard
    step="01"
    icon={Search}
    title="Browse"
    description="Explore our curated collection."
  />
  <StepCard
    step="02"
    icon={Heart}
    title="Favorite"
    description="Save items to your wishlist."
  />
  <StepCard
    step="03"
    icon={ShoppingCart}
    title="Purchase"
    description="Secure checkout with confidence."
  />
</StepCardGrid>
```

**StepCard Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `step` | `string \| number` | ✅ | Step number |
| `icon` | `LucideIcon` | ✅ | Step icon |
| `title` | `string` | ✅ | Step title |
| `description` | `string` | ✅ | Step description |

**StepCardGrid Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `2 \| 3 \| 4` | `3` | Grid columns |

---

## Pages to Refactor

Replace hardcoded empty/loading/error states with these components:

### EmptyState Replacements

| Page | Location | Suggested Icon |
|------|----------|----------------|
| `/search` | No results | `Search` |
| `/wishlist` | Empty wishlist | `Heart` |
| `/cart` | Empty cart | `ShoppingCart` |
| `/account?tab=orders` | No orders | `Package` |
| `/category/[slug]` | No products | `Package` |
| `/subcategory/[slug]` | No products | `Package` |
| `/compare` | No items to compare | `Scale` |
| `/browse` | No filtered results | `Filter` |

### PageHeader Replacements

These pages can use the `<PageHeader>` component:

- `/about`
- `/contact`
- `/consign`
- `/faq`
- `/terms`
- `/privacy`
- `/refund-policy`
- `/cookies`
- `/authentication`
- `/shipping-returns`
- `/payment`
- `/our-process`
- `/how-it-works`
- `/category/[slug]`
- `/subcategory/[slug]`

### InfoCard Replacements

| Page | Use For |
|------|---------|
| `/shipping-returns` | Policy cards |
| `/payment` | Payment method cards |
| `/authentication` | Process cards |

### StepCard Replacements

| Page | Use For |
|------|---------|
| `/how-it-works` | Collector steps, Consignor steps |
| `/our-process` | Process steps |

---

## Usage Examples

### Before (hardcoded):
```tsx
// Old empty state in wishlist
<div className="text-center py-16">
  <Heart className="w-16 h-16 mx-auto text-lux-gray mb-4" />
  <h2 className="text-2xl font-serif text-lux-black mb-2">No Favorites Yet</h2>
  <p className="text-ink-600 mb-6">Start adding items to your wishlist.</p>
  <Link href="/browse" className="btn-primary">Browse Collection</Link>
</div>
```

### After (component):
```tsx
import { EmptyState } from "@/components/ui";
import { Heart } from "lucide-react";

<EmptyState
  icon={Heart}
  title="No Favorites Yet"
  description="Start adding items to your wishlist."
  primaryAction={{ label: "Browse Collection", href: "/browse" }}
/>
```

---

## Benefits

| Metric | Before | After |
|--------|--------|-------|
| Lines of code per empty state | ~15 | 1 import + ~6 props |
| Consistency | Manual | Guaranteed |
| Updates | Edit every page | Edit one component |
| New page setup time | 30+ min | 5 min |

---

## Summary

| Component | Status | Primary Use |
|-----------|--------|-------------|
| `EmptyState` | ✅ Ready | No content states |
| `LoadingState` | ✅ Ready | Data fetching |
| `ErrorState` | ✅ Ready | API/network errors |
| `PageHeader` | ✅ Ready | Page titles |
| `InfoCard` | ✅ Ready | Feature/policy cards |
| `StepCard` | ✅ Ready | Process flows |

**Total files:** 7 (6 components + 1 index)
