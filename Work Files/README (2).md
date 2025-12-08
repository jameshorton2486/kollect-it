# Kollect-It Design System Update - Deployment Instructions

**Generated:** December 8, 2025  
**Version:** 1.0  

---

## 📦 Files Included

| File | Purpose | Destination |
|------|---------|-------------|
| `layout.tsx` | Inter font + body styling | `src/app/layout.tsx` |
| `globals.css` | New typography utilities | `src/app/globals.css` |
| `Footer.tsx` | Fixed 11 color tokens | `src/components/Footer.tsx` |
| `ProductCard.tsx` | Fixed 4 color tokens | `src/components/ProductCard.tsx` |
| `ProductReviews.tsx` | Fixed 2 color tokens | `src/components/product/ProductReviews.tsx` |
| `RelatedProducts.tsx` | Fixed 1 color token | `src/components/product/RelatedProducts.tsx` |
| `AesopSection.tsx` | Fixed 1 color token | `src/components/AesopSection.tsx` |
| `ContactForm.tsx` | Fixed 1 color token | `src/components/forms/ContactForm.tsx` |
| `Deploy-Design-System.ps1` | Deployment script | (run from Work Files) |

---

## 🚀 Step-by-Step Instructions

### Step 1: Download Files from Claude

1. Click the download links for each file above
2. Save all files to your **Downloads** folder

### Step 2: Copy to Work Files Folder

Copy all downloaded files to:
```
C:\Users\james\kollect-it-marketplace-1\Work Files
```

### Step 3: Run the Deployment Script

**Option A: Using PowerShell (Recommended)**
```powershell
cd "C:\Users\james\kollect-it-marketplace-1"
.\Work Files\Deploy-Design-System.ps1
```

**Option B: Using Cursor (Manual)**
1. Open each file in Cursor
2. Use Cursor's file explorer to navigate to the destination
3. Replace the existing file

### Step 4: Test Locally

```bash
npm run dev
```

Then check these pages:
- [ ] Homepage footer displays correctly
- [ ] Shop/Browse page ProductCards look right
- [ ] Product detail page reviews and related products
- [ ] Contact page form
- [ ] Any page with AesopSection

### Step 5: Commit Changes

```bash
git add .
git commit -m "Apply design system update - Batch 1 components"
git push
```

---

## 🔄 Rollback Instructions

If something goes wrong:

1. Navigate to: `C:\Users\james\kollect-it-marketplace-1\backups\design-system-[timestamp]`
2. Copy the backup files back to their original locations
3. Run `npm run dev` to verify

---

## ✅ What Changed

### Core Changes
- **Font:** Lato → Inter (sans-serif)
- **Body background:** `bg-lux-ink-soft` → `bg-lux-pearl`
- **Body text:** `text-lux-ink` → `text-lux-black`

### New Typography Utilities (in globals.css)
```css
.heading-page      /* Gold page titles (H1) */
.heading-section   /* Gold section titles (H2) */
.heading-subsection /* Charcoal subsection headers (H3) */
.text-label        /* Uppercase small labels */
.text-muted        /* Secondary text */
.lead              /* Hero subtitles */
```

### Color Token Replacements (20 total)
| Old Class | New Class | Files |
|-----------|-----------|-------|
| `text-gray-300` | `text-lux-gray-light` | Footer, ProductCard, ProductReviews |
| `text-gray-600` | `text-ink-600` | Footer, ProductCard, RelatedProducts |
| `text-gray-700` | `text-lux-gray` | Footer |
| `text-gray-800` | `text-lux-black` | AesopSection |
| `disabled:bg-gray-400` | `disabled:bg-surface-300` | ContactForm |

---

## 📋 Next Steps After Batch 1

Once you confirm Batch 1 is working:

1. **Ask Claude for Batch 2** (Legal/Info pages)
2. **Ask ChatGPT for Homepage Wireframe**

---

## 💬 Questions?

Just ask Claude:
> "I deployed Batch 1 but [describe issue]. Can you help me debug?"
