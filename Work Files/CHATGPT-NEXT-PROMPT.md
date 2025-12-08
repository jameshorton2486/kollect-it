# NEXT PROMPT FOR CHATGPT
## Homepage Wireframe Request

Copy and paste this into ChatGPT after you've implemented the design system:

---

## PROMPT START

I've implemented the Design System you created:

✅ **Fonts installed:** Cormorant Garamond (serif) + Inter (sans) via next/font  
✅ **Typography classes added:** .heading-page, .heading-section, .heading-subsection, .text-label, .text-muted  
✅ **Batch 1 components fixed:** Footer, ProductCard, ProductReviews, RelatedProducts, AesopSection, ContactForm  

Now I need a **detailed homepage wireframe/layout** that I can hand to Claude for implementation.

**Please create:**

### 1. Homepage Section-by-Section Specification

For each section, specify:
- Exact HTML structure (semantic tags)
- Tailwind/CSS classes using the design system
- Content placeholders
- Responsive behavior (mobile → desktop)

### 2. Sections I Need Designed:

Based on the design system, my homepage should have:

1. **Hero Section**
   - Background: cream (bg-lux-cream)
   - Headline using .heading-page
   - Subtitle using .lead
   - CTA button
   - Featured product preview or collection image

2. **Recent Additions** (Product Grid)
   - 4-8 products
   - Uses ProductCard component
   - "View All" link

3. **Category Grid** (2×2)
   - Fine Art
   - Rare Books
   - Collectibles
   - Militaria
   - Square images with serif titles
   - Gold underline on hover

4. **Trust/Value Bar**
   - 3-4 trust signals (authentication, shipping, expertise)
   - Simple icons + text

5. **Consignment Teaser**
   - Brief call-to-action for sellers
   - Link to consignment page

6. **Footer** (already fixed)

### 3. What I Need From You:

- **Visual wireframe** (ASCII or markdown diagram)
- **Exact Tailwind classes** for layout (grid, spacing, responsive)
- **Any component structure** (if new components needed)
- **Mobile-first breakpoint guidance**

### 4. Technical Context:

- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS
- Existing classes available:
  - `.heading-page`, `.heading-section`, `.heading-subsection`
  - `.text-label`, `.text-muted`, `.lead`
  - `.section-tight`, `.section-normal`, `.section-grand`
  - `bg-lux-pearl`, `bg-lux-cream`, `bg-lux-charcoal`
  - `text-lux-gold`, `text-lux-black`, `text-lux-gray-light`

### 5. Design Constraints:

- Quiet luxury aesthetic (not loud or flashy)
- Generous whitespace (museum/gallery feel)
- Gold (#D4AF37) used sparingly as accent
- Focus on products, not decoration

Please provide a complete homepage specification that Claude can implement directly.

---

## PROMPT END

---

## WHY THIS PROMPT WORKS

This prompt:
1. **Confirms what's done** - ChatGPT knows the foundation is in place
2. **Requests specific deliverables** - Not vague, asks for exact classes
3. **Provides technical context** - ChatGPT knows your stack
4. **Lists available design tokens** - Can reference your actual system
5. **Sets constraints** - Reinforces the luxury aesthetic

---

## WHAT TO DO WITH CHATGPT'S RESPONSE

Once ChatGPT provides the homepage specification:
1. Share it with me (Claude)
2. I'll implement the exact layout
3. You review in browser
4. Iterate as needed
