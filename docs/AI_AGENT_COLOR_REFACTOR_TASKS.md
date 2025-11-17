# AI Agent Tasks – Kollect-It Color System

## Goal

Help maintain and extend the new semantic color system without
reintroducing hard-coded hex colors or legacy token names.

## Context

- Global tokens defined in: `src/app/globals.css`
- Tailwind config in: `tailwind.config.ts`
- React components in: `src/components/` and `src/components/home/`
- Deprecated tokens documented in: `docs/DEPRECATED_TOKENS.md`
- Testing checklist in: `docs/TESTING_CHECKLIST.md`

## Rules

1. **Never** add raw hex colors into components.
   - If a new color is truly needed, propose:
     - a token name in `globals.css`
     - a matching entry in `tailwind.config.ts`
2. When you see classes or variables listed in
   `docs/DEPRECATED_TOKENS.md`, refactor them to the new tokens.
3. After making changes, always:
   - Run `npm run lint`
   - Run `npm run build`
   - Summarize any errors and where they occur.

## Tasks You May Perform

1. **Audit for legacy colors**
   - Search for:
     - `text-accent-gold`, `bg-accent-gold`, `border-accent-gold`
     - `var(--color-gold)`, `--color-accent-gold`, etc.
   - Suggest or perform replacements using the mapping in
     `docs/DEPRECATED_TOKENS.md`.

2. **Normalize component styles**
   - Ensure headings use `text-ink` or `text-ink-secondary`.
   - Body text uses `text-ink-secondary` or `text-ink-muted`.
   - Backgrounds use `bg-white`, `bg-surface-1`, or `bg-surface-2`
     instead of random colors.

3. **Add new semantic tokens (only when necessary)**
   - If a design needs a new variant (e.g. softer gold):
     - Propose a name like `--gold-400`
     - Add it to `globals.css` and `tailwind.config.ts`
     - Update the component to use `text-gold-soft` or similar.

4. **Verify consistency**
   - Check the homepage hero, header, footer, and product cards to
     ensure:
     - No mixed legacy + new tokens
     - Contrast is accessible (dark text on light background, etc.)

## When in Doubt

Ask for clarification in natural language and propose the change
before applying it. Always keep the design intent:

> "High-end, 1stdibs-inspired marketplace with neutral base,
> warm gold accents, and gallery-like cream surfaces."

## Quick Verification Commands

```powershell
# Scan for deprecated tokens
.\scripts\verify-refactor.ps1

# Clean up any found issues
.\scripts\clean-color-tokens.ps1

# Test the result
npm run build
```

## Example Usage

When working with components, always prefer:

```tsx
// ✅ GOOD - Semantic tokens
<h1 className="text-ink font-serif text-4xl">
<p className="text-ink-secondary leading-relaxed">
<button className="bg-gold text-ink hover:bg-gold-dark">

// ❌ BAD - Hard-coded colors
<h1 className="text-[#1E1E1E] font-serif text-4xl">
<p className="text-[#666666] leading-relaxed">
<button className="bg-[#B1874C] text-black hover:bg-[#9A7340]">
```