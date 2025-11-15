# Hero Component Implementation Guide

**Status:** ✅ HERO COMPONENT CREATED  
**Date:** November 5, 2025  
**Location:** `src/components/Hero.tsx`

---

## 📝 Component Overview

The Hero component has been created at `/src/components/Hero.tsx` with the following features:

- ✅ Full-screen background image with dark gradient overlay
- ✅ Centered content overlay with luxury typography
- ✅ Gold accents (#D3AF37) matching Kollect-It dark theme
- ✅ Responsive design (mobile-first)
- ✅ Two primary CTAs: "Browse Collections" and "How We Authenticate"
- ✅ Feature bullets with responsive bullet separators
- ✅ Social proof with star rating
- ✅ Next.js Image optimization (priority loading, quality 90)

---

## 🖼️ Hero Image Setup

### Step 1: Download the Hero Image

1. Go to: https://drive.google.com/file/d/1BERqbAc4p0blRiXnnDQ8gYxGvPhK-emh/view
2. Click **Download** (top-right)
3. Save the file to: `public/images/hero-antique-shop.jpg`

### Step 2: Create Images Directory

If it doesn't exist, create it:

```bash
mkdir -p public/images
```

### Step 3: Place the Image

Copy/move the downloaded image to:

```
c:\Users\james\kollect-it-marketplace-1\public\images\hero-antique-shop.jpg
```

### Step 4: Verify

```bash
ls public/images/hero-antique-shop.jpg
```

Should output the file path if it exists.

---

## 📋 Product Images - Google Drive Folder

All product images will be stored in this Google Drive folder:

**📁 Folder URL:** https://drive.google.com/drive/folders/[REDACTED-FOLDER-ID]

**Note:** This is where you'll upload all product images that will later be synced to ImageKit using the Google Drive → ImageKit sync system (in progress).

---

## 🚀 How to Use the Hero Component

### Import in Your Page

```tsx
// app/page.tsx or any page file
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      {/* Other sections below */}
    </main>
  );
}
```

### Component Props

The Hero component is a **standalone, no-props component**. It uses hardcoded content and styling appropriate for the homepage.

If you need a reusable hero with dynamic content later, you can refactor it to accept props.

---

## 🎨 Styling Details

### Color Scheme

- **Background:** `#1a1a1a` (dark)
- **Accent Gold:** `#D3AF37`
- **Text:** White / `gray-200` for secondary
- **Overlay:** Black gradient (70% opacity)

### Responsive Breakpoints

- **Mobile:** Single column, stacked CTAs
- **Tablet (md):** Inline CTAs, adjusted typography
- **Desktop (lg):** Full 7xl headline, optimal spacing

### Interactive Elements

- **CTA Buttons:** 300ms smooth transitions on hover
- **Gold button hover:** Slightly darker gold (`#c9a532`)
- **White button hover:** Inverts to white background with dark text

---

## 📊 Component Structure

```
<section> (Hero wrapper)
  ├── <div> (Background image container)
  │   ├── <Image> (Next.js Image component)
  │   └── <div> (Gradient overlay)
  └── <div> (Content overlay)
      ├── <p> (Tagline - Gold)
      ├── <h1> (Headline - Large serif)
      ├── <p> (Subheading - Gray-200)
      ├── <div> (Feature bullets)
      ├── <div> (CTA buttons)
      └── <div> (Social proof)
```

---

## ✅ Verification Checklist

Before you deploy, verify:

- [ ] Hero image downloaded to `public/images/hero-antique-shop.jpg`
- [ ] Hero component created at `src/components/Hero.tsx`
- [ ] Component imported correctly in your page
- [ ] Image loads without errors (check browser console)
- [ ] Text is readable against the image overlay
- [ ] CTAs are clickable and navigate correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Build passes: `bun run build`

---

## 🔍 Troubleshooting

### Image Not Loading

**Problem:** Hero image shows as broken or blank

**Solutions:**

1. Verify file is at: `public/images/hero-antique-shop.jpg`
2. Check file name has no typos (case-sensitive on Linux)
3. Clear Next.js cache: `rm -rf .next`
4. Restart dev server: `bun run dev`
5. Check browser DevTools console for 404 errors

### Text Not Visible

**Problem:** Tagline, headline, or subheading appears invisible

**Solutions:**

1. Verify gradient overlay exists in the component
2. Check that `text-white` and `text-gray-200` classes are applied
3. Ensure Tailwind CSS is properly configured
4. Check for CSS conflicts in global styles

### CTAs Not Working

**Problem:** Buttons don't navigate when clicked

**Solutions:**

1. Verify routes exist: `/collections` and `/authentication`
2. Check Link imports are from `next/link`
3. Ensure Next.js routing is properly configured

---

## 📚 AI Agent Prompt Reference

If you need to modify or regenerate the Hero component, use this prompt:

```
Create an improved Hero section component for Kollect-It, a Next.js 15 TypeScript e-commerce marketplace for authenticated antiques and collectibles.

REQUIREMENTS:
1. Component: Hero.tsx in /components directory
2. Framework: Next.js 15 with TypeScript, using Next.js Image component
3. Styling: Tailwind CSS with dark theme (#1a1a1a backgrounds, #D3AF37 gold accents, white text)
4. Image: Background hero image at /public/images/hero-antique-shop.jpg showing collectors in an upscale antique gallery
5. Layout: Full-width hero section with centered content overlay

COMPONENT STRUCTURE:
- Background: Full-screen image with dark gradient overlay (black/70 opacity) for text readability
- Tagline: Small uppercase text in gold (#D3AF37) - "CURATED FOR THE DISCERNING COLLECTOR"
- Headline: Large serif font (5xl-7xl), light weight - "Authenticated Antiques, Curated with Care"
- Subheading: 2 lines max, gray-200 text, describing museum-quality antiques
- Feature bullets: Single row with bullet separators - "Fine Art to Rare Books • Furniture to Collectibles • Expert Authentication • Insured Shipping"
- CTAs:
  - Primary: Gold button (#D3AF37) with dark text - "Browse Collections" → /collections
  - Secondary: White outlined button - "How We Authenticate" → /authentication
- Social proof: Star rating with text "Trusted by museums and private collectors"

STYLING REQUIREMENTS:
- Minimum height: 600px
- Responsive: Stack CTAs on mobile, inline on desktop
- Hover states: Smooth transitions (300ms) on all interactive elements
- Typography: Serif for headlines, sans-serif for body
- Spacing: Generous padding and margins for luxury feel
- Image optimization: priority loading, quality={90}, object-cover

ACCESSIBILITY:
- Proper alt text for hero image
- Semantic HTML (section, h1, etc.)
- Adequate color contrast for overlaid text
- Focus states for keyboard navigation

Export as default function component following Next.js 15 best practices.
```

---

## 🔗 Related Setup (ImageKit Sync)

**Note:** The product images from the Google Drive folder will be synced to ImageKit using the sync system we created earlier.

**Next steps (when ready):**

1. Complete ImageKit configuration (see: `docs/IMAGEKIT-COMPLETION-CHECKLIST.md`)
2. Upload product images to the Drive folder
3. Run the sync script: `bun run sync-images`
4. Use `ProductImage` component to display synced images on product pages

---

## 📄 Files Modified/Created

- ✅ **Created:** `src/components/Hero.tsx`
- ⏳ **Pending:** `public/images/hero-antique-shop.jpg` (download from Google Drive)

---

## 🎯 Next Steps

1. **Download hero image** from Google Drive link provided
2. **Place image** in `public/images/hero-antique-shop.jpg`
3. **Import Hero component** in your homepage or main layout
4. **Test** on different screen sizes
5. **Verify** image loads and styling is correct
6. **Build & deploy** when ready

---

**Status:** ✅ Ready for image download and integration  
**Last Updated:** November 5, 2025
