# PHASE 5: Accessibility Verification
## Cursor AI Prompts for Kollect-It

**Important:** Each prompt includes git commit and push commands at the end. Run these after reviewing and approving any changes.

---

## Prompt 5.1 — Accessibility Baseline Audit

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Perform a targeted accessibility audit focusing on critical issues that would block users with disabilities.

# CONTEXT
- Project: Kollect-It (luxury antiques marketplace)
- Target audience includes older demographic
- Must support keyboard navigation
- Focus on WCAG 2.1 Level A compliance
- Not a full WCAG audit — targeted quick wins only

# SCOPE — Priority Components
- src/components/Header.tsx
- src/components/Footer.tsx
- src/components/ProductCard.tsx
- src/components/forms/ContactForm.tsx
- src/components/Search.tsx
- src/components/ui/button.tsx
- src/components/AddToCartButton.tsx

# VERIFICATION CHECKLIST

1. **Interactive Elements**
   - [ ] All buttons have accessible names (text content or aria-label)
   - [ ] All links have descriptive text (not "click here" or "read more")
   - [ ] Form inputs have associated <label> elements
   - [ ] Icon-only buttons have aria-label
   - [ ] Click targets are at least 44x44px (touch-friendly)

2. **Keyboard Navigation**
   - [ ] Focus states visible (focus: or focus-visible: classes)
   - [ ] Focus ring uses design system (ring-lux-gold)
   - [ ] No keyboard traps (can tab through and escape)
   - [ ] Tab order follows visual order
   - [ ] Interactive elements are focusable

3. **Images**
   - [ ] All <img> tags have alt attributes
   - [ ] next/image components have alt text
   - [ ] Decorative images have alt="" (empty)
   - [ ] Product images have descriptive alt text

4. **Color & Contrast**
   - [ ] Text on lux-gold background meets 4.5:1 ratio
   - [ ] Text on lux-charcoal background meets 4.5:1 ratio
   - [ ] lux-gray text on lux-pearl background is readable
   - [ ] Error states don't rely on color alone

5. **Semantic HTML**
   - [ ] One <main> element per page
   - [ ] <nav> wraps navigation
   - [ ] <header> and <footer> landmarks present
   - [ ] Headings in logical order (h1 → h2 → h3)
   - [ ] Lists use <ul>/<ol> appropriately

6. **ARIA Usage**
   - [ ] aria-label not redundant with visible text
   - [ ] aria-hidden="true" on decorative icons
   - [ ] aria-expanded on toggles/dropdowns
   - [ ] aria-live for dynamic content (cart updates, etc.)

# OUTPUT FORMAT
```markdown
## Accessibility Audit Report

### Executive Summary
- Critical issues: [count]
- Warnings: [count]
- Passing checks: [count]

### Critical Issues (Must Fix)
| Component | Issue | WCAG Criterion | Fix |
|-----------|-------|----------------|-----|
| [file] | [description] | [e.g., 1.1.1] | [specific fix] |

### Warnings (Should Fix)
| Component | Issue | WCAG Criterion | Fix |
|-----------|-------|----------------|-----|

### Passing Checks ✅
- [List verified items]

### Quick Wins (Provide Code Fixes)
For each issue, provide the exact code change:

#### Fix 1: [Component] — [Issue]
```typescript
// File: [path]
// Line: [number]

// BEFORE
[current code]

// AFTER
[fixed code]
```
```

# AFTER REVIEW — Apply fixes, then run:
```powershell
git add -A
git commit -m "fix(a11y): baseline accessibility improvements - WCAG 2.1 Level A"
git push
```

# CONSTRAINTS
- Focus on blocking issues only
- Provide specific, copy-paste code fixes
- Don't audit admin pages (internal only)
- Skip theoretical issues — focus on real user impact
```

---

## Prompt 5.2 — Form Accessibility Audit

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Ensure all forms are fully accessible with proper labels, error handling, and keyboard support.

# CONTEXT
- Forms are critical for conversions (contact, checkout, newsletter)
- Must be usable with screen readers
- Must have clear error messages
- Must support keyboard-only navigation

# FILES TO ANALYZE
- src/components/forms/ContactForm.tsx
- src/app/checkout/page.tsx
- src/app/login/page.tsx
- src/app/register/page.tsx
- src/components/Footer.tsx (newsletter signup)
- src/components/Search.tsx (search form)

# VERIFICATION CHECKLIST

1. **Labels**
   - [ ] Every input has an associated <label>
   - [ ] Labels use htmlFor matching input id
   - [ ] OR inputs have aria-label/aria-labelledby
   - [ ] Placeholder text is NOT the only label

2. **Required Fields**
   - [ ] Required fields marked with aria-required="true"
   - [ ] Visual indicator for required (asterisk with sr-only text)
   - [ ] Required validation provides clear feedback

3. **Error Handling**
   - [ ] Errors linked with aria-describedby
   - [ ] Error messages are specific (not just "invalid")
   - [ ] Errors announced to screen readers (aria-live or role="alert")
   - [ ] Focus moves to first error on submission

4. **Input Types**
   - [ ] Email inputs use type="email"
   - [ ] Phone inputs use type="tel"
   - [ ] Password inputs use type="password"
   - [ ] Autocomplete attributes present where appropriate

5. **Buttons**
   - [ ] Submit buttons have clear text ("Send Message" not "Submit")
   - [ ] Disabled state communicated (aria-disabled or disabled attribute)
   - [ ] Loading state announced (aria-busy or status text)

6. **Keyboard Support**
   - [ ] Can tab through all fields in order
   - [ ] Enter submits form
   - [ ] Escape closes any modals
   - [ ] No focus traps

# OUTPUT FORMAT
```markdown
## Form Accessibility Audit

### Forms Analyzed
1. ContactForm.tsx
2. Checkout form
3. Login/Register
4. Newsletter signup
5. Search

### Issues by Form

#### ContactForm.tsx
| Issue | WCAG | Current | Fix |
|-------|------|---------|-----|
| [issue] | [criterion] | [current code] | [fixed code] |

#### [Other forms...]

### Code Fixes

#### Fix 1: [Form] — [Issue]
```typescript
// File: [path]

// BEFORE
[current code]

// AFTER  
[fixed code]
```

### Verification Commands
After fixes, test with:
- Tab through form (keyboard only)
- Use with screen reader (NVDA/VoiceOver)
- Submit empty form (error handling)
- Submit invalid data (validation messages)
```

# AFTER REVIEW — Apply fixes, then run:
```powershell
git add -A
git commit -m "fix(a11y): form accessibility - labels, errors, keyboard support"
git push
```

# CONSTRAINTS
- Every form input MUST have a label
- Error messages MUST be linked to inputs
- Provide complete, working code fixes
```

---

## Prompt 5.3 — Navigation & Focus Accessibility

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Ensure keyboard users and screen reader users can navigate the site effectively.

# CONTEXT
- Header navigation is critical for all users
- Mobile menu must be accessible
- Focus management on route changes
- Skip links help keyboard users

# FILES TO ANALYZE
- src/components/Header.tsx
- src/components/Footer.tsx
- src/app/layout.tsx
- src/components/ui/button.tsx
- Any modal/dialog components

# VERIFICATION CHECKLIST

1. **Skip Link**
   - [ ] Skip to main content link exists
   - [ ] Visually hidden until focused
   - [ ] Links to #main-content or <main>
   - [ ] First focusable element on page

2. **Header Navigation**
   - [ ] <nav> element with aria-label="Main navigation"
   - [ ] Current page indicated (aria-current="page")
   - [ ] Dropdown menus accessible (arrow keys, Escape to close)
   - [ ] Mobile menu toggle has aria-expanded

3. **Mobile Menu**
   - [ ] Toggle button has aria-label
   - [ ] Menu state uses aria-expanded
   - [ ] Focus trapped inside when open
   - [ ] Escape closes menu
   - [ ] Focus returns to toggle on close

4. **Focus Indicators**
   - [ ] All interactive elements have visible focus
   - [ ] Focus ring color meets contrast requirements
   - [ ] Focus ring uses design system (focus-visible:ring-lux-gold)
   - [ ] No outline:none without replacement

5. **Focus Management**
   - [ ] Modal focus trapped when open
   - [ ] Focus returns to trigger on close
   - [ ] Route changes don't lose focus unexpectedly

6. **Landmarks**
   - [ ] <header> for site header
   - [ ] <nav> for navigation (with aria-label if multiple)
   - [ ] <main> for primary content
   - [ ] <footer> for site footer
   - [ ] <aside> for sidebars (if any)

# SKIP LINK IMPLEMENTATION
If missing, add to layout.tsx:
```typescript
// Add as first element inside <body>
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-lux-gold focus:text-lux-black focus:rounded-lg focus:font-semibold"
>
  Skip to main content
</a>

// Add id to main element
<main id="main-content" className="...">
```

# OUTPUT FORMAT
```markdown
## Navigation Accessibility Audit

### Skip Link
- Present: ✅/❌
- Implementation: [correct/needs fix]
- Fix: [code if needed]

### Header Navigation
| Check | Status | Notes |
|-------|--------|-------|
| <nav> with aria-label | ✅/❌ | |
| aria-current on active | ✅/❌ | |
| Keyboard accessible | ✅/❌ | |

### Mobile Menu
| Check | Status | Notes |
|-------|--------|-------|
| aria-expanded | ✅/❌ | |
| Focus trap | ✅/❌ | |
| Escape closes | ✅/❌ | |

### Focus Indicators
| Component | Has Focus Style | Meets Contrast |
|-----------|-----------------|----------------|
| Buttons | ✅/❌ | ✅/❌ |
| Links | ✅/❌ | ✅/❌ |
| Inputs | ✅/❌ | ✅/❌ |

### Code Fixes
[Provide specific fixes]
```

# AFTER REVIEW — Apply fixes, then run:
```powershell
git add -A
git commit -m "fix(a11y): navigation accessibility - skip link, focus management, landmarks"
git push
```

# CONSTRAINTS
- Skip link is highly recommended for keyboard users
- Focus indicators must be visible
- Mobile menu must be keyboard accessible
```

---

## Prompt 5.4 — Image Alt Text Audit

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Ensure all images have appropriate alt text for screen reader users.

# CONTEXT
- Product images need descriptive alt text for SEO and accessibility
- Decorative images should have empty alt=""
- Icons used as buttons need aria-label instead

# FILES TO SEARCH
- src/components/**/*.tsx
- src/app/**/*.tsx (exclude api/)

# SEARCH PATTERNS

1. **Find all image elements:**
   - `<img` tags
   - `<Image` (next/image) components
   - Background images used for content (rare, but check)

2. **Categorize each image:**
   - **Informative**: Needs descriptive alt text
   - **Decorative**: Needs alt="" (empty)
   - **Functional**: Icons in buttons need aria-label on button

# VERIFICATION CHECKLIST

1. **Product Images**
   - [ ] Alt text includes product name
   - [ ] Alt text is unique per image (not "product image" repeated)
   - [ ] Pattern: `alt={product.title}` or similar

2. **Hero/Banner Images**
   - [ ] Decorative backgrounds: alt=""
   - [ ] Images with text overlay: alt describes the message

3. **Icons**
   - [ ] Icon-only buttons have aria-label on button, not img
   - [ ] Decorative icons inside text have aria-hidden="true"
   - [ ] Lucide icons: usually don't need alt (handled by parent)

4. **User-Uploaded Images**
   - [ ] Review images have descriptive alt (we fixed this earlier)
   - [ ] Category images have alt={category.name}

# OUTPUT FORMAT
```markdown
## Image Alt Text Audit

### Summary
- Total images found: X
- With proper alt: X
- Missing/improper alt: X
- Decorative (alt=""): X

### Issues Found
| File | Line | Current Alt | Recommended Alt |
|------|------|-------------|-----------------|
| [path] | [line] | [current] | [recommendation] |

### Code Fixes

#### Fix 1: [File] — [Issue]
```typescript
// BEFORE
<Image src={...} alt="image" />

// AFTER
<Image src={...} alt={`${product.title} - ${product.category}`} />
```

### Decorative Images (Verify alt="")
| File | Line | Status |
|------|------|--------|
| [path] | [line] | ✅ Correct / ⚠️ Needs alt="" |
```

# AFTER REVIEW — Apply fixes, then run:
```powershell
git add -A
git commit -m "fix(a11y): image alt text improvements for screen readers"
git push
```

# CONSTRAINTS
- Never use "image of" or "picture of" in alt text
- Alt text should be concise but descriptive
- Decorative images MUST have alt="" not missing alt
```

---

## Prompt 5.5 — Color Contrast Verification

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Verify text color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for normal text, 3:1 for large text).

# CONTEXT
- Design system uses warm, muted colors
- Gold accent on various backgrounds
- Need to verify key combinations

# COLOR COMBINATIONS TO CHECK

Based on the lux-* design system, verify these combinations:

1. **Primary Text on Light Backgrounds**
   | Text Color | Background | Expected Ratio |
   |------------|------------|----------------|
   | lux-black (#1a1d23) | lux-pearl (#f0ede8) | Should pass |
   | lux-ink (#1e2128) | lux-cream (#ebe6df) | Should pass |
   | ink-600 (#675f55) | lux-white (#faf8f5) | Check |

2. **Gold Accent**
   | Text Color | Background | Expected Ratio |
   |------------|------------|----------------|
   | lux-gold (#d4af37) | lux-white (#faf8f5) | May fail for small text |
   | lux-gold (#d4af37) | lux-charcoal (#282c35) | Should pass |
   | lux-black (#1a1d23) | lux-gold (#d4af37) | Should pass |

3. **Light Text on Dark Backgrounds**
   | Text Color | Background | Expected Ratio |
   |------------|------------|----------------|
   | lux-cream (#ebe6df) | lux-charcoal (#282c35) | Should pass |
   | lux-gray-light (#ccc7c0) | lux-charcoal (#282c35) | Check |

4. **Muted/Secondary Text**
   | Text Color | Background | Expected Ratio |
   |------------|------------|----------------|
   | lux-gray (#999189) | lux-pearl (#f0ede8) | Check |
   | lux-gray-light (#ccc7c0) | lux-white (#faf8f5) | Likely fails |
   | lux-gray-dark (#5c554c) | lux-pearl (#f0ede8) | Should pass |

# TOOLS FOR VERIFICATION
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools: Inspect element → Color picker shows contrast ratio

# OUTPUT FORMAT
```markdown
## Color Contrast Audit

### Methodology
- Used [tool] for verification
- WCAG 2.1 AA requires:
  - 4.5:1 for normal text (<18px or <14px bold)
  - 3:1 for large text (≥18px or ≥14px bold)

### Results

#### ✅ Passing Combinations
| Text | Background | Ratio | Use Case |
|------|------------|-------|----------|
| lux-black | lux-pearl | X:1 | Body text |

#### ❌ Failing Combinations
| Text | Background | Ratio | Required | Fix |
|------|------------|-------|----------|-----|
| [color] | [color] | X:1 | 4.5:1 | [recommendation] |

### Recommendations
1. [Specific fix with code]

### Code Changes Required
```typescript
// File: [path]
// Issue: lux-gray-light text fails contrast on lux-white

// BEFORE
className="text-lux-gray-light"

// AFTER (use darker gray for better contrast)
className="text-lux-gray"
```
```

# AFTER REVIEW — Apply fixes, then run:
```powershell
git add -A
git commit -m "fix(a11y): improve color contrast ratios for WCAG AA compliance"
git push
```

# CONSTRAINTS
- Don't change the design system colors themselves
- Fix by using different existing tokens
- Large text (headings) have lower requirements
- Focus on text, not decorative elements
```

---

## Quick Reference: Phase 5 Prompts

| Prompt | Purpose | Priority | Commit Message |
|--------|---------|----------|----------------|
| **5.1** | Baseline accessibility audit | High | `fix(a11y): baseline accessibility improvements` |
| **5.2** | Form accessibility | High | `fix(a11y): form accessibility - labels, errors` |
| **5.3** | Navigation & focus | Medium | `fix(a11y): navigation accessibility - skip link, focus` |
| **5.4** | Image alt text | Medium | `fix(a11y): image alt text improvements` |
| **5.5** | Color contrast | Medium | `fix(a11y): improve color contrast ratios` |

**Recommended order:** 5.1 → 5.2 → 5.3 → 5.4 → 5.5

**After each prompt:** Review changes, then run the git commands provided.

---

*Copy each prompt individually into Cursor AI. Commit and push after each set of fixes.*
