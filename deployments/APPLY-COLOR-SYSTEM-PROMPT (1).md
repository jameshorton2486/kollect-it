# AUTONOMOUS PROMPT: Apply Kollect-It Color System Globally

## OBJECTIVE
Update all components, pages, and styles across the Kollect-It codebase to use the official design system color tokens defined in `globals.css`. Remove all hardcoded colors and ensure consistent brand presentation.

## CONTEXT
- Project: Kollect-It antiques marketplace (Next.js 15, TypeScript, Tailwind CSS)
- Design system is defined in: `src/app/globals.css`
- Color tokens use HSL format with Tailwind utility classes
- 41 pages, 73 components need to be updated

## COLOR SYSTEM TO APPLY

### Text Colors (Use these classes)
- `text-ink-900` - Primary text (#1E1E1E)
- `text-ink-700` - Body secondary text (#5A5A5A)
- `text-ink-600` - Secondary/muted text (#737373)
- `text-ink-500` - Very muted text (#8C8C8C)
- `text-ink-400` - Placeholder text (#A6A6A6)

### Background Colors (Use these classes)
- `bg-surface-0` - Pure white cards (#FFFFFF)
- `bg-surface-50` - Lightest cream/main background (#F9F8F6)
- `bg-surface-100` - Light cream (#F5F3F0)
- `bg-surface-200` - Elevated elements (#F0EDE9)
- `bg-surface-300` - Borders/dividers (#E8E5E1)
- `bg-surface-800` - Dark surface (#333333)
- `bg-surface-900` - Darkest (#1E1E1E)

### Accent Colors (Use these classes)
- `text-gold-500` or `bg-gold-500` - Primary gold (#C5A264)
- `text-gold-600` or `bg-gold-600` - Dark gold (#A58642)
- `text-gold-400` or `bg-gold-400` - Medium gold (#CEAE70)
- `text-gold-300` or `bg-gold-300` - Light gold (#D4B882)

### CTA Colors (Use these classes)
- `bg-cta-600` - Primary CTA button (#1E3A5F)
- `hover:bg-cta-700` - CTA hover state (#1A3050)
- `bg-cta-500` - Secondary CTA (#24426C)
- `text-cta-600` - CTA text color

### Border Colors (Use these classes)
- `border-border-300` - Default border (#E0DDD9)
- `border-border-200` - Light border (#E8E5E1)
- `border-gold-500` - Gold accent border

### Semantic Colors (Use these classes)
- `text-semantic-error-500` or `bg-semantic-error-500` - Errors (#E53E3E)
- `text-semantic-success-500` or `bg-semantic-success-500` - Success (#38A169)
- `text-semantic-warning-500` or `bg-semantic-warning-500` - Warnings (#ED8936)
- `text-semantic-info-500` - Info messages (#5C7BA0)

## TASKS TO COMPLETE

### 1. AUDIT CURRENT COLOR USAGE
```
Scan all files in these directories:
- src/app/**/*.tsx
- src/components/**/*.tsx
- src/lib/**/*.ts

Find and list all instances of:
- Hardcoded hex colors (e.g., #FFFFFF, #000000)
- RGB/RGBA colors (e.g., rgb(255,255,255))
- Hardcoded HSL colors not using CSS variables
- Inline style colors
- className colors not using design tokens
```

### 2. REPLACE HARDCODED COLORS

#### Text Colors - Replace these patterns:
```
FIND: text-black, text-gray-900, text-[#000000], text-[#1E1E1E]
REPLACE WITH: text-ink-900

FIND: text-gray-700, text-gray-600, text-[#5A5A5A], text-[#737373]
REPLACE WITH: text-ink-700 or text-ink-600

FIND: text-gray-500, text-gray-400
REPLACE WITH: text-ink-500 or text-ink-400

FIND: text-white
REPLACE WITH: text-surface-0 (when on dark backgrounds)
```

#### Background Colors - Replace these patterns:
```
FIND: bg-white, bg-[#FFFFFF]
REPLACE WITH: bg-surface-0

FIND: bg-gray-50, bg-[#F9F8F6], bg-[#F5F3F0], bg-[#F7F6F2]
REPLACE WITH: bg-surface-50

FIND: bg-gray-100, bg-[#F0EDE9]
REPLACE WITH: bg-surface-100 or bg-surface-200

FIND: bg-black, bg-gray-900, bg-[#1E1E1E]
REPLACE WITH: bg-surface-900
```

#### Accent Colors - Replace these patterns:
```
FIND: bg-yellow-600, bg-amber-600, text-yellow-600, bg-[#C9A66B], bg-[#C5A264]
REPLACE WITH: bg-gold-500 or text-gold-500

FIND: hover:bg-yellow-700, hover:bg-amber-700, hover:bg-[#B88D50], hover:bg-[#A58642]
REPLACE WITH: hover:bg-gold-600
```

#### CTA/Button Colors - Replace these patterns:
```
FIND: bg-blue-600, bg-blue-700, bg-navy-600, bg-[#1E3A5F]
REPLACE WITH: bg-cta-600

FIND: hover:bg-blue-700, hover:bg-navy-700, hover:bg-[#1A3050]
REPLACE WITH: hover:bg-cta-700
```

#### Border Colors - Replace these patterns:
```
FIND: border-gray-200, border-gray-300, border-[#E0DDD9], border-[#E8E5E1]
REPLACE WITH: border-border-300 or border-border-200
```

### 3. UPDATE SPECIFIC COMPONENTS

#### Header Component (src/components/Header.tsx)
```
- Background: bg-surface-0
- Text: text-ink-900
- Links: text-ink-700 hover:text-gold-500
- Mobile menu: bg-surface-0
- Borders: border-border-300
```

#### Footer Component (src/components/Footer.tsx)
```
- Background: bg-surface-900
- Text: text-surface-50
- Links: text-surface-100 hover:text-gold-400
- Dividers: border-surface-800
```

#### Button Components
```
Primary buttons:
- bg-cta-600 hover:bg-cta-700 text-surface-0

Secondary buttons:
- bg-transparent border-2 border-cta-600 text-cta-600 hover:bg-cta-600 hover:text-surface-0

Gold accent buttons:
- bg-gold-500 hover:bg-gold-600 text-surface-0

Text buttons:
- text-cta-600 hover:text-cta-700
```

#### Card Components
```
- Background: bg-surface-0
- Border: border border-border-300
- Shadow: shadow-md
- Hover: hover:shadow-lg
- Text: text-ink-900
- Secondary text: text-ink-600
```

#### Form Inputs
```
- Background: bg-surface-0
- Border: border border-border-300 focus:border-cta-600
- Text: text-ink-900
- Placeholder: placeholder:text-ink-400
- Labels: text-ink-700
- Error states: border-semantic-error-500 text-semantic-error-500
```

#### Product Cards
```
- Card background: bg-surface-0
- Price text: text-ink-900 font-semibold
- Category text: text-ink-600
- Hover state: hover:shadow-lg
- Border: border-border-200
```

#### Admin Pages
```
- Sidebar: bg-surface-900 text-surface-50
- Content area: bg-surface-50
- Cards: bg-surface-0
- Active nav items: bg-cta-600 text-surface-0
- Inactive nav items: text-surface-100 hover:bg-surface-800
```

### 4. UPDATE PAGE BACKGROUNDS

```
All page files (src/app/**/page.tsx):
- Main container: bg-surface-50 or bg-surface-100
- Hero sections: bg-surface-0 or bg-surface-100
- Alternating sections: bg-surface-50 and bg-surface-100
```

### 5. ENSURE NO INLINE STYLES WITH COLORS

```
Find and remove/replace any:
- style={{ color: '#000000' }}
- style={{ backgroundColor: '#FFFFFF' }}
- style={{ borderColor: '#E0DDD9' }}

Replace with appropriate Tailwind classes.
```

### 6. UPDATE SHADCN/UI COMPONENTS

```
All shadcn/ui components (src/components/ui/*):
- Should already use CSS variables from globals.css
- Verify they're using: bg-background, text-foreground, border-border
- These map to our design tokens automatically
```

## VERIFICATION CHECKLIST

After making changes, verify:

✅ All hardcoded hex colors are removed
✅ All text uses `text-ink-*` classes
✅ All backgrounds use `bg-surface-*` classes
✅ All buttons use `bg-cta-*` or `bg-gold-*` classes
✅ All borders use `border-border-*` classes
✅ Header and Footer use correct colors
✅ Product cards have consistent styling
✅ Admin pages use correct colors
✅ Forms use correct input styling
✅ No inline color styles remain
✅ All pages have proper background colors

## OUTPUT REQUIREMENTS

Provide a summary report with:
1. Number of files updated
2. Number of color replacements made
3. List of any colors that couldn't be mapped to design tokens
4. Any components that need manual review
5. Before/after examples of major changes

## SPECIAL NOTES

- Preserve all existing functionality
- Maintain responsive design classes
- Keep all accessibility attributes
- Don't change component logic, only styling
- Test that hover states still work
- Ensure dark mode compatibility (if implemented)

---

## EXECUTION INSTRUCTIONS

1. Start with globals.css verification (ensure all CSS variables are defined)
2. Update utility components first (Button, Card, Input)
3. Then update layout components (Header, Footer)
4. Then update page components
5. Finally update admin components
6. Run TypeScript check: `npm run type-check`
7. Test in browser: `npm run dev`

Execute this prompt and provide a complete report when finished.
