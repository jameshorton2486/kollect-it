# Next Prompt for ChatGPT

Copy and paste this into ChatGPT to get the homepage wireframe:

---

## PROMPT:

I've implemented your Design System Specification. Claude has created:

1. ✅ Updated `layout.tsx` with Inter font (replacing Lato)
2. ✅ Updated `globals.css` with new typography utilities:
   - `.heading-page` (gold H1)
   - `.heading-section` (gold H2)
   - `.heading-subsection` (charcoal H3)
   - `.text-label` (uppercase small)
   - `.text-muted` (secondary text)
   - `.lead` (intro paragraphs)
3. ✅ Fixed Batch 1 components (Footer, ProductCard, ProductReviews, RelatedProducts, AesopSection, ContactForm)

**Now I need:**

Please generate a **detailed homepage wireframe** for Kollect-It that follows the design system we created. Include:

1. **Hero Section** (cream background)
   - Serif H1 headline
   - Lead subtitle text
   - Primary CTA button (gold)
   - Featured product card preview

2. **Recent Additions Grid** (4-8 items)
   - Using ProductCard component
   - Section title with `.heading-section`

3. **Category Grid** (2x2 for our 4 categories)
   - Fine Art
   - Rare Books
   - Collectibles
   - Militaria
   - Square images, serif titles, gold hover underline

4. **Value/Trust Bar**
   - Authentication guarantee
   - Expert descriptions
   - Secure checkout
   - Icons with brief text

5. **Consignment Teaser**
   - One sentence pitch
   - CTA to consign page

**Format your response as:**
- ASCII wireframe layout showing structure
- Specific Tailwind classes to use
- Component hierarchy

Remember to use:
- `bg-lux-cream` for hero
- `bg-lux-pearl` for page background
- `.heading-page` for main title
- `.heading-section` for section titles
- `text-lux-gold` for accents
- `bg-lux-charcoal` for dark sections

---

*End of ChatGPT prompt*
