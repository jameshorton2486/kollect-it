# CURSOR INSTRUCTIONS — BATCH D (Product & Shop Pages)

## FILE MAPPINGS

| Source (Work Files/batch-d/) | Destination |
|------------------------------|-------------|
| `product-[slug]-page.tsx` | `src/app/product/[slug]/page.tsx` |
| `browse-page.tsx` | `src/app/browse/page.tsx` |
| `SearchResults.tsx` | `src/components/search/SearchResults.tsx` |

---

## CURSOR PROMPT (Copy/Paste)

```
Deploy Batch D pages from Work Files/batch-d/:

1. src/app/product/[slug]/page.tsx ← Work Files/batch-d/product-[slug]-page.tsx
2. src/app/browse/page.tsx ← Work Files/batch-d/browse-page.tsx
3. src/components/search/SearchResults.tsx ← Work Files/batch-d/SearchResults.tsx

Replace existing files with these updated versions.
```

---

## WHAT CHANGED

### Product Detail Page
- Added design system typography (`.heading-page`, `.heading-section`)
- Breadcrumb navigation with proper styling
- Category label with gold color
- Details grid with card-style layout
- Consistent section spacing
- Related products section with heading

### Browse/Shop Page
- Header with `.heading-page` and `.lead` text
- Cream background for header section
- Updated filter sidebar styling
- Product grid with design system spacing
- Pagination with gold accent on active state
- Empty state with proper styling

### Search Results
- Header section with cream background
- Filter/sort bar with consistent button styles
- Grid/list view toggle with gold active state
- Loading state with animated icon
- No results state with suggestions
- Product cards with design system tokens

---

## TEST CHECKLIST

After deployment, verify:

- [ ] Product page: breadcrumbs work, details grid shows
- [ ] Browse page: filters work, pagination styled correctly
- [ ] Search page: search input works, results display in grid
- [ ] All pages: gold accents, cream/pearl backgrounds correct

---

## NOTES

- The `/shop` page currently redirects to `/browse` - this is fine
- Search uses the `/api/search` endpoint which already exists
- Filter components (CategoryFilters, SearchFilters) remain unchanged
