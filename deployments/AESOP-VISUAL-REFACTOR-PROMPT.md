# 🎨 KOLLECT-IT AESOP-INSPIRED VISUAL REFACTOR
## Master Prompt for AI Agent (Cursor / Copilot / Claude in VS Code)

---

## 🚫 CRITICAL: READ THESE RULES FIRST

This prompt will **ONLY change visual appearance**. It will **NEVER** change:

❌ Text content, headings, descriptions  
❌ Routes, URLs, links  
❌ API endpoints, server actions  
❌ Database schema, Prisma models  
❌ Business logic  
❌ Product data, prices, titles  
❌ SEO metadata  
❌ Props, types, interfaces  

✅ It **WILL ONLY** change:

✔ Colors, backgrounds  
✔ Typography (font families, not text)  
✔ Layout structure, spacing  
✔ Visual components  
✔ CSS design tokens  
✔ Tailwind configuration  

---

## 🧠 MASTER PROMPT FOR AI AGENT

Copy everything below this line and paste into your AI coding assistant:

```
You are assisting with a Next.js 15 (App Router) + TypeScript + Tailwind CSS project named Kollect-It, an antiques & collectibles marketplace.

Your job is to:
* Improve the visual appearance of the site (colors, typography, spacing, backgrounds, layout rhythm).
* Apply an Aesop-inspired, calm, earthy, boutique look.
* Update all pages automatically so the aesthetic is consistent across the entire app.

🚫 NON-NEGOTIABLE CONSTRAINTS (READ CAREFULLY)

You MUST obey all of these:

1. DO NOT CHANGE ANY TEXT CONTENT.
   * Do not rewrite, reword, or delete any user-facing strings.
   * Do not change headings, paragraphs, button labels, link text, product descriptions, SEO copy, metadata titles/descriptions, etc.
   * You may only wrap existing text in additional `<div>`/layout components or apply Tailwind classes.
   * All string literals must remain exactly the same.

2. DO NOT CHANGE ROUTES OR LOGIC.
   * Do not rename route folders under `src/app`.
   * Do not change URLs in `<Link>` components.
   * Do not modify API routes, server actions, or database logic.
   * No changes to Prisma schema or data models.

3. SCOPE = VISUALS ONLY. You may only change:
   * CSS design tokens (in `globals.css`)
   * Tailwind config (colors, fonts, radii, spacing, shadows, animations)
   * Layout markup & classes inside React components to improve visual hierarchy and spacing
   * New presentational components (like `AesopSection`)

4. NO NEW PAGES, NO NEW FEATURES.
   * Do not add new routes.
   * Do not add new major features. Only visual polish.

If a requested visual improvement would require touching content or logic, skip it and leave a comment instead.

🔍 FILES YOU MAY EDIT

You are allowed to edit ONLY these kinds of files:
* `src/app/globals.css`
* `tailwind.config.ts`
* `src/app/layout.tsx`
* `src/components/**` (presentational components only)
* `src/app/**/page.tsx` (page components – layout + classes only, no text edits)

You must not touch:
* `prisma/**`
* `src/lib/**` (business logic)
* `src/app/api/**`
* `next.config.*`, `package.json`, etc.

🎨 STEP 1 – Add Aesop-Inspired Palette to globals.css

In `src/app/globals.css`, inside the `:root { ... }` block, append these variables (if not present already):

/* Aesop-Inspired Earthy Palette */
--aesop-cream: 40 29% 96%;   /* soft parchment */
--aesop-sand: 37 23% 90%;    /* warm sand */
--aesop-olive: 81 14% 30%;   /* deep olive green */
--aesop-charcoal: 0 0% 14%;  /* dark charcoal */

--aesop-olive-foreground: 40 29% 96%;
--aesop-charcoal-foreground: 96 14% 92%;

Do not remove the existing Kollect-It tokens (ink, surface, gold, cta). You are extending, not replacing.

🎛 STEP 2 – Wire Palette into Tailwind (tailwind.config.ts)

In `tailwind.config.ts`, under `theme.extend.colors`, add:

aesop: {
  cream: "hsl(var(--aesop-cream))",
  sand: "hsl(var(--aesop-sand))",
  olive: "hsl(var(--aesop-olive))",
  charcoal: "hsl(var(--aesop-charcoal))",
  "olive-foreground": "hsl(var(--aesop-olive-foreground))",
  "charcoal-foreground": "hsl(var(--aesop-charcoal-foreground))",
},

Do not remove existing `ink`, `gold`, `surface`, `cta`, `semantic`, etc. You are only adding an `aesop` group.

This must enable classes like:
* `bg-aesop-cream`, `bg-aesop-sand`, `bg-aesop-olive`, `bg-aesop-charcoal`
* `text-aesop-olive-foreground`, `text-aesop-charcoal-foreground`

🖋 STEP 3 – Add Tenor Sans as "Aesop" Heading Font

In `src/app/layout.tsx`:

1. Import and configure the font:

import { Tenor_Sans } from "next/font/google";

const tenor = Tenor_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-aesop",
});

2. Add `tenor.variable` to the `<html>` className, preserving existing ones:

<html
  lang="en"
  className={`${lato.variable} ${cormorant.variable} ${archivoBlack.variable} ${tenor.variable}`}
/>

3. In `globals.css`, make headings use this font (without changing any text):

h1, h2, h3, h4 {
  font-family: var(--font-aesop), var(--font-serif), Georgia, 'Times New Roman', serif;
  letter-spacing: 0.02em;
}

Do not alter any actual heading strings.

🧩 STEP 4 – Create AesopSection Component (Reusable Layout)

Create `src/components/AesopSection.tsx` with this visual-only component:

"use client";

import Image from "next/image";
import Link from "next/link";

type AesopSectionProps = {
  variant?: "cream" | "sand" | "olive" | "charcoal";
  layout?: "split-right" | "split-left" | "full";
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  imageSrc?: string;
  ctaLabel?: React.ReactNode;
  ctaLink?: string;
  children?: React.ReactNode;
};

export function AesopSection({
  variant = "cream",
  layout = "split-right",
  title,
  subtitle,
  description,
  imageSrc,
  ctaLabel,
  ctaLink = "#",
  children,
}: AesopSectionProps) {
  const bg = `bg-aesop-${variant}`;
  const textClass =
    variant === "olive"
      ? "text-aesop-olive-foreground"
      : variant === "charcoal"
      ? "text-aesop-charcoal-foreground"
      : "text-ink";

  const container = "container mx-auto py-16 md:py-20";

  const TextBlock = (
    <div className="space-y-4">
      {subtitle && (
        <p className="uppercase tracking-[0.2em] text-xs md:text-sm opacity-80">
          {subtitle}
        </p>
      )}
      {title && <h2 className="text-2xl md:text-4xl font-serif">{title}</h2>}
      {description && (
        <p className="max-w-xl text-sm md:text-base opacity-90">
          {description}
        </p>
      )}
      {children}
      {ctaLabel && ctaLink && (
        <Link
          href={ctaLink}
          className="inline-block mt-4 px-6 py-3 rounded-lg bg-cta text-white hover:bg-cta-hover transition-colors text-sm font-medium"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );

  const ImageBlock =
    imageSrc != null ? (
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
        <Image src={imageSrc} fill alt="" className="object-cover" />
      </div>
    ) : null;

  return (
    <section className={`${bg} ${textClass}`}>
      <div
        className={
          layout === "full"
            ? `${container} text-center max-w-4xl`
            : `${container} grid gap-10 md:grid-cols-2 items-center`
        }
      >
        {layout === "split-left" && ImageBlock}
        {layout === "full" ? (
          <div className="mx-auto space-y-4">{TextBlock}</div>
        ) : (
          <>
            {TextBlock}
            {layout === "split-right" && ImageBlock}
          </>
        )}
      </div>
    </section>
  );
}

This component must be purely presentational and used to wrap existing content.

🌍 STEP 5 – APPLY VISUAL IMPROVEMENTS TO ALL PAGES

For every page file:
* `src/app/page.tsx`
* `src/app/about/page.tsx`
* `src/app/shop/page.tsx`
* `src/app/categories/page.tsx`
* `src/app/category/[slug]/page.tsx`
* `src/app/how-it-works/page.tsx`
* `src/app/contact/page.tsx`
* `src/app/sell/page.tsx`
* `src/app/faq/page.tsx`
* `src/app/shipping-returns/page.tsx`
* `src/app/payment/page.tsx`
* `src/app/privacy/page.tsx`
* `src/app/terms/page.tsx`
* `src/app/cookies/page.tsx`
* `src/app/cart/page.tsx`
* `src/app/checkout/page.tsx`
* `src/app/wishlist/page.tsx`
* `src/app/product/[slug]/page.tsx`
* `src/app/search/page.tsx`
* `src/app/login/page.tsx`
* `src/app/register/page.tsx`
* `src/app/account/page.tsx`
* (and any other `src/app/**/page.tsx`)

You must:

1. Keep all text exactly the same.
   * You can move it inside `<AesopSection>` or containers, but do not change the words.

2. Add visual structure using:
   * `AesopSection` for large top sections (heroes, intros, important blocks).
   * `section` + `section-spacing` + `container` classes for secondary blocks.
   * Backgrounds alternating: `bg-aesop-cream`, `bg-aesop-olive`, `bg-aesop-sand`, `bg-aesop-charcoal` for sections, but never altering text.

3. Example transformation (conceptual):

Do this kind of refactor WITHOUT changing any literal strings:

// Before (example)
export default function AboutPage() {
  return (
    <main>
      <h1>About Kollect-It</h1>
      <p>Some text...</p>
    </main>
  );
}

// After (visual-only refactor)
import { AesopSection } from "@/components/AesopSection";

export default function AboutPage() {
  return (
    <main>
      <AesopSection
        variant="cream"
        layout="split-right"
        title={<span>About Kollect-It</span>}
        description={
          <>
            {/* Existing text content reused verbatim */}
            <p>Some text...</p>
          </>
        }
      />
      {/* Additional sections wrapping existing content only */}
    </main>
  );
}

When wrapping content, you may convert existing text into JSX children, but you must not change the strings themselves.

✅ STEP 6 – CONSISTENCY & FINAL CHECK

After refactoring all pages:

* Ensure every page:
   * Uses the new palette and headings.
   * Has comfortable vertical spacing (`py-16` / `py-20`, or `section-spacing` if defined).
   * Uses cards/sections with visible contrast between background and card surfaces.

* Verify:
   * No route paths were changed.
   * No text content changed (compare against original git state).
   * Build still succeeds (`bun run build` or `npm run build`).

If you're unsure whether a change might alter content or logic, do not make that change.

🧾 FINAL BEHAVIOR SUMMARY (FOR YOU, THE AI)

* You are performing a global, visual-only refactor.
* You must iterate all `page.tsx` files under `src/app/**` automatically and apply consistent visual patterns.
* You must leave every text string exactly as it is.

When you're done, summarize:
1. Files modified.
2. Visual patterns applied (palette, headings, section layouts).
3. Any pages you intentionally skipped and why.
```

---

## 📋 HOW TO USE THIS PROMPT

### Step 1: Backup Your Code
```bash
# Create a git commit before starting
git add .
git commit -m "Before Aesop visual refactor"
```

### Step 2: Open Your AI Coding Assistant
- **Cursor:** Press `Cmd+K` (Mac) or `Ctrl+K` (Windows)
- **GitHub Copilot Chat:** Open chat panel
- **Claude in VS Code:** Open Claude panel

### Step 3: Paste the Entire Prompt
Copy everything from the "MASTER PROMPT FOR AI AGENT" section above and paste it into your AI assistant.

### Step 4: Let It Run
The AI will:
1. Add Aesop color palette to `globals.css`
2. Update `tailwind.config.ts`
3. Add Tenor Sans font to `layout.tsx`
4. Create `AesopSection.tsx` component
5. Update all page files with visual improvements
6. Maintain all your existing text and content

### Step 5: Review Changes
```bash
# See what files were changed
git status

# See detailed changes
git diff

# Only appearance files should be modified:
# - src/app/globals.css
# - tailwind.config.ts
# - src/app/layout.tsx
# - src/components/AesopSection.tsx
# - src/app/**/page.tsx (layout only)
```

### Step 6: Test Your Site
```bash
bun run dev
```

Open http://localhost:3000 and verify:
- ✅ All text is exactly the same
- ✅ Colors are now Aesop-inspired (cream, olive, sand, charcoal)
- ✅ Headings use Tenor Sans font
- ✅ Layout has better visual rhythm
- ✅ All links and navigation work
- ✅ No errors in console

### Step 7: Build Check
```bash
bun run build
```

Should complete without errors.

---

## 🎨 WHAT THE NEW DESIGN WILL LOOK LIKE

### Color Palette (Aesop-Inspired)
```
Cream:     #F7F5F0  (soft parchment backgrounds)
Sand:      #E8E3D9  (warm sand accents)
Olive:     #4A5545  (deep olive green sections)
Charcoal:  #242424  (dark charcoal headers/footer)
```

### Typography
```
Headings:  Tenor Sans (elegant, boutique)
Body:      Your existing fonts (unchanged)
```

### Layout Pattern
```
Section 1: Cream background
Section 2: Olive background with cream text
Section 3: Sand background
Section 4: Charcoal background with light text
(repeating pattern)
```

### Visual Elements
- Generous whitespace (py-16 to py-20)
- Split layouts (image left, text right OR text left, image right)
- Subtle shadows on cards
- Clean borders and separators
- Consistent spacing rhythm

---

## 🛡️ SAFETY GUARANTEES

### This Prompt Will NOT Change:
❌ Product titles, descriptions, prices  
❌ Category names  
❌ SEO metadata  
❌ URLs and routes  
❌ API endpoints  
❌ Database schema  
❌ Business logic  
❌ Any text content  

### This Prompt WILL ONLY Change:
✔ Background colors  
✔ Font families (not the text itself)  
✔ Spacing and padding  
✔ Layout structure  
✔ Visual components  
✔ CSS tokens  

### Verification Method:
```bash
# After running the prompt, check:
git diff src/app/page.tsx

# You should see changes like:
+ <section className="bg-aesop-cream py-20">
- <section>

# But NO changes to actual text strings:
# ✅ Same heading text
# ✅ Same paragraph text
# ✅ Same button labels
```

---

## 🚨 TROUBLESHOOTING

### Issue: AI Changed Some Text
**Solution:**
```bash
# Revert the specific file
git checkout -- src/app/[filename]/page.tsx

# Re-run the prompt with emphasis:
"DO NOT CHANGE ANY TEXT STRINGS. ONLY CHANGE LAYOUT AND STYLING."
```

### Issue: Build Errors After Refactor
**Solution:**
```bash
# Check what broke
bun run build

# Common fixes:
# - Missing import for AesopSection
# - Typo in color class names
# - Check tailwind.config.ts has aesop colors
```

### Issue: Colors Not Showing
**Solution:**
1. Verify `globals.css` has the Aesop variables
2. Verify `tailwind.config.ts` has the `aesop` color group
3. Restart dev server: `bun run dev`

### Issue: Font Not Loading
**Solution:**
1. Check `layout.tsx` has Tenor_Sans import
2. Verify `tenor.variable` is in the className
3. Check `globals.css` has the font-family rule for h1-h4

---

## 📊 EXPECTED RESULTS

### Before Visual Refactor:
- Colors: Gold (#C9A66B), Navy (#1E3A5F), Cream (#F5F3F0)
- Layout: Basic sections
- Typography: Mixed fonts
- Spacing: Inconsistent

### After Visual Refactor:
- Colors: Cream, Olive, Sand, Charcoal (Aesop-inspired)
- Layout: Alternating sections with clear visual rhythm
- Typography: Tenor Sans headings (elegant, boutique)
- Spacing: Consistent 80-100px vertical rhythm
- Components: Reusable `AesopSection` for consistency

### Visual Improvement Score:
- **Professional Appeal:** ⭐⭐⭐⭐⭐ (5/5)
- **Brand Consistency:** ⭐⭐⭐⭐⭐ (5/5)
- **Readability:** ⭐⭐⭐⭐⭐ (5/5)
- **Boutique Feel:** ⭐⭐⭐⭐⭐ (5/5)

---

## ✅ CHECKLIST AFTER RUNNING PROMPT

- [ ] All pages load without errors
- [ ] Text content is identical to before
- [ ] New color palette visible (cream, olive, sand, charcoal)
- [ ] Headings use Tenor Sans font
- [ ] Sections have alternating backgrounds
- [ ] Spacing is consistent across pages
- [ ] Mobile responsive (test on phone)
- [ ] Build succeeds: `bun run build`
- [ ] No TypeScript errors: `bun run typecheck`
- [ ] All links and navigation work
- [ ] Images still load correctly
- [ ] Forms still function
- [ ] Cart/checkout still work

---

## 🎯 NEXT STEPS AFTER VISUAL REFACTOR

Once the visual refactor is complete:

1. **Review the Changes**
   - Browse every page
   - Check mobile responsiveness
   - Verify all interactions work

2. **Commit the Changes**
   ```bash
   git add .
   git commit -m "Apply Aesop-inspired visual design system"
   ```

3. **Continue with Product Setup**
   - Add categories
   - Upload products
   - Test checkout

The visual design is now complete and professional!

---

**Last Updated:** November 21, 2025  
**Status:** Ready to apply to Kollect-It marketplace
