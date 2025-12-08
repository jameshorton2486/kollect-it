# Batch 1: Shared Components - Deployment Instructions

**Created:** December 8, 2025  
**Files Updated:** 6 components  
**Estimated Impact:** ~25 pages affected (through cascade)

---

## Files Included

| File | Changes Made | Lines Fixed |
|------|--------------|-------------|
| `Footer.tsx` | 11 gray classes → lux tokens | 53, 58, 76, 79, 82, 85, 105, 121, 127, 140, 153 |
| `ProductCard.tsx` | 4 gray classes → lux tokens | 61, 64, 123, 126 |
| `ProductReviews.tsx` | 2 gray classes → lux tokens | 90, 173 |
| `RelatedProducts.tsx` | 1 gray class → lux token | 130 |
| `AesopSection.tsx` | 1 gray class → lux token | 35 |
| `ContactForm.tsx` | 1 gray class → lux token | 193 |

---

## Specific Changes

### Footer.tsx
```diff
- text-gray-300  →  text-lux-gray-light  (social icons, links, descriptions)
- text-gray-600  →  text-lux-gray  (newsletter text, copyright)
- placeholder:text-gray-700  →  placeholder:text-lux-gray
```

### ProductCard.tsx
```diff
- text-gray-300  →  text-lux-gray-light  (placeholder icon)
- text-gray-600  →  text-ink-600  (placeholder text)
```

### ProductReviews.tsx
```diff
- text-gray-300  →  text-lux-gray-light  (empty star icons)
```

### RelatedProducts.tsx
```diff
- text-gray-600  →  text-ink-600  (placeholder text)
```

### AesopSection.tsx
```diff
- text-gray-800  →  text-lux-black  (default text color)
```

### ContactForm.tsx
```diff
- disabled:bg-gray-400  →  disabled:bg-surface-300  (disabled button)
```

---

## Deployment Steps

### Option A: Manual Copy (Recommended for first batch)

1. Download the files from this folder
2. Copy to your project's `Work Files` folder:
   ```
   C:\Users\james\kollect-it-marketplace-1\Work Files\
   ```
3. Run the deployment script:
   ```powershell
   cd C:\Users\james\kollect-it-marketplace-1
   .\Deploy-UI-Updates.ps1
   ```

### Option B: Direct Copy

Copy files to these locations:

```
batch1-components/Footer.tsx        → src/components/Footer.tsx
batch1-components/ProductCard.tsx   → src/components/ProductCard.tsx
batch1-components/ProductReviews.tsx → src/components/product/ProductReviews.tsx
batch1-components/RelatedProducts.tsx → src/components/product/RelatedProducts.tsx
batch1-components/AesopSection.tsx  → src/components/AesopSection.tsx
batch1-components/ContactForm.tsx   → src/components/forms/ContactForm.tsx
```

---

## Testing Checklist

After deployment, verify these pages:

- [ ] **Homepage** - Footer displays correctly with gold accents
- [ ] **Shop/Browse** - ProductCard placeholders use correct colors
- [ ] **Product Detail** - Related products and reviews render correctly
- [ ] **Contact Page** - Form submit button has correct disabled state
- [ ] **Any page with AesopSection** - Text colors are consistent

---

## Rollback

If issues occur, restore from the backup created by the deployment script:

```powershell
# Backups are in:
C:\Users\james\kollect-it-marketplace-1\backups\ui-updates\

# Files are named: YYYYMMDD-HHMMSS-filename.tsx
```

---

## Next Steps

After confirming Batch 1 works:

1. **Batch 2: Legal/Info Pages** - terms, privacy, refund-policy, cookies, our-process
2. **Batch 3: Account Page** - account/page.tsx (24 fixes)
3. **Batch 4: Admin Components** - internal dashboard components
4. **Batch 5: Admin Pages** - admin page files

---

*Batch 1 Complete - Ready for Review*
