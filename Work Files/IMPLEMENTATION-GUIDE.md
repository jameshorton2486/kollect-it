# KOLLECT-IT DESIGN SYSTEM IMPLEMENTATION GUIDE
## Complete Step-by-Step Instructions

**Created:** December 8, 2025  
**Status:** Ready for Implementation

---

## 📋 WHAT YOU'RE IMPLEMENTING

| Item | Description | Impact |
|------|-------------|--------|
| **Google Fonts** | Cormorant Garamond (serif) + Inter (sans) | Brand typography |
| **Typography Classes** | .heading-page, .heading-section, .text-label, etc. | Consistent headings |
| **Batch 1 Components** | 6 shared components with color fixes | Affects ~25 pages |

---

## 🚀 IMPLEMENTATION STEPS

### STEP 1: Download Files from Claude

After this conversation, download these files from the outputs folder:

```
📁 Downloads from Claude
├── fonts.ts                          → Goes to src/lib/fonts.ts
├── typography-additions.css          → Contents go INTO globals.css
├── layout-update-instructions.tsx    → Reference only (don't deploy)
├── Deploy-UI-Updates.ps1             → Run from project root
└── 📁 batch1-components/
    ├── Footer.tsx
    ├── ProductCard.tsx
    ├── ProductReviews.tsx
    ├── RelatedProducts.tsx
    ├── AesopSection.tsx
    └── ContactForm.tsx
```

### STEP 2: Organize in Work Files Folder

Copy downloaded files to your Work Files folder:

```
C:\Users\james\kollect-it-marketplace-1\Work Files\
├── fonts.ts
├── typography-additions.css
├── layout-update-instructions.tsx
├── Deploy-UI-Updates.ps1
└── batch1-components\
    ├── Footer.tsx
    ├── ProductCard.tsx
    ├── ProductReviews.tsx
    ├── RelatedProducts.tsx
    ├── AesopSection.tsx
    └── ContactForm.tsx
```

### STEP 3: Run Deployment Script

Open PowerShell in your project root and run:

```powershell
cd "C:\Users\james\kollect-it-marketplace-1"
.\Work Files\Deploy-UI-Updates.ps1
```

This will:
- ✅ Create timestamped backups
- ✅ Deploy fonts.ts to src/lib/
- ✅ Deploy all 6 Batch 1 components
- ✅ Log all changes

### STEP 4: Manual Update - layout.tsx

Open `src/app/layout.tsx` and make these changes:

**Add import at top:**
```tsx
import { fontVariables } from '@/lib/fonts';
```

**Update the html tag:**
```tsx
// Find this:
<html lang="en">

// Change to:
<html lang="en" className={fontVariables}>
```

**Update the body tag (add font-sans and antialiased):**
```tsx
// Example - adapt to your existing classes:
<body className="min-h-screen bg-lux-pearl font-sans antialiased">
```

### STEP 5: Manual Update - globals.css

Open `src/app/globals.css` and add the typography classes.

**Find the `@layer utilities` section** (or create one if it doesn't exist).

**Copy the entire contents of `typography-additions.css`** and paste it into globals.css inside or after the utilities layer.

### STEP 6: Test Locally

```bash
npm run dev
```

**Check these pages:**
- Homepage - Footer should have correct colors
- Shop/Browse - ProductCard placeholders correct
- Any product page - Related products and reviews correct
- Contact page - Form disabled state correct

**Check browser console for errors.**

---

## 🔄 ROLLBACK IF NEEDED

If something breaks, your backups are at:

```
C:\Users\james\kollect-it-marketplace-1\backups\ui-updates\[timestamp]\
```

Simply copy the `.bak` files back to their original locations.

---

## ✅ TESTING CHECKLIST

After implementation, verify:

- [ ] No console errors in browser
- [ ] Fonts loading (check Network tab for Google Fonts)
- [ ] Footer uses correct `text-lux-gray-light` colors
- [ ] ProductCard placeholder images have correct background
- [ ] Headings use Cormorant Garamond (serif)
- [ ] Body text uses Inter (sans-serif)
- [ ] Gold accent color (#D4AF37) visible on headings

---

## 🎯 WHAT'S NEXT

After Batch 1 is verified:

1. **Tell Claude:** "Batch 1 tested successfully. Ready for Batch 2."
2. **Ask ChatGPT:** For homepage wireframe/layout guidance
3. **Continue:** Batches 2-5 for remaining pages

---

## 📁 FILE REFERENCE

| New File | Location | Purpose |
|----------|----------|---------|
| fonts.ts | src/lib/fonts.ts | Google Font configuration |
| typography-additions.css | Merged into globals.css | New utility classes |

| Updated File | Changes Made |
|--------------|--------------|
| layout.tsx | Added fontVariables, font-sans |
| globals.css | Added typography utility classes |
| Footer.tsx | 11 color token fixes |
| ProductCard.tsx | 4 color token fixes |
| ProductReviews.tsx | 2 color token fixes |
| RelatedProducts.tsx | 1 color token fix |
| AesopSection.tsx | 1 color token fix |
| ContactForm.tsx | 1 color token fix |

---

## 🆘 TROUBLESHOOTING

**Fonts not loading?**
- Check Network tab for failed requests
- Verify fontVariables is applied to <html> tag
- Ensure fonts.ts is in src/lib/ directory

**Tailwind classes not working?**
- Run `npm run dev` to regenerate CSS
- Check for syntax errors in globals.css

**Colors look wrong?**
- Verify your existing lux-* tokens are intact in tailwind.config.ts
- Check that --lux-gold, --lux-gray-light, etc. are defined

**Component errors?**
- Check file paths match your project structure
- Verify all imports are correct
