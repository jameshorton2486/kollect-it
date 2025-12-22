# 🎨 KOLLECT-IT COLOR SYSTEM CLEANUP - FULL PATCH LIST

## Generated: $(date)

---

## 📋 SUMMARY

This document contains all color replacements needed to migrate from non-brand hex colors to approved Kollect-It design tokens.

**Total Files to Modify:** 5 files
**Total Replacements:** 12 instances

---

## ✅ PATCH ENTRIES

### File: src/lib/email/reportSender.ts

**Line: 33**
- **FOUND:** `background: linear-gradient(135deg, #D4AF37 0%, #B1874C 100%)`
- **REPLACE WITH:** `background: linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%)`
- **TAILWIND OPTION:** N/A (inline CSS in email template)
- **REASON:** Replace non-standard gold gradient with official gold palette tokens

---

**Line: 34**
- **FOUND:** `background: #f9f9f9`
- **REPLACE WITH:** `background: var(--surface-50)`
- **TAILWIND OPTION:** N/A (inline CSS)
- **REASON:** Replace light gray with official surface token

---

**Line: 37**
- **FOUND:** `background: #f0f0f0`
- **REPLACE WITH:** `background: var(--surface-50)`
- **TAILWIND OPTION:** N/A (inline CSS)
- **REASON:** Replace light gray with official surface token

---

**Line: 40**
- **FOUND:** `background: #667eea`
- **REPLACE WITH:** `background: var(--gold-500)`
- **TAILWIND OPTION:** N/A (inline CSS)
- **REASON:** Replace non-brand purple button with official gold accent

---

### File: src/components/Header.tsx

**Line: 49**
- **FOUND:** `bg-[#0D0D0D]/95`
- **REPLACE WITH:** `bg-lux-black/95`
- **TAILWIND OPTION:** `bg-lux-black/95`
- **REASON:** Replace dark hex with official lux-black token

---

**Line: 50**
- **FOUND:** `bg-[#0D0D0D]`
- **REPLACE WITH:** `bg-lux-black`
- **TAILWIND OPTION:** `bg-lux-black`
- **REASON:** Replace dark hex with official lux-black token

---

**Line: 189**
- **FOUND:** `bg-[#0D0D0D]`
- **REPLACE WITH:** `bg-lux-black`
- **TAILWIND OPTION:** `bg-lux-black`
- **REASON:** Replace dark hex with official lux-black token

---

### File: src/app/payment/page.tsx

**Line: 54**
- **FOUND:** `backgroundColor: "#3A3A3A"`
- **REPLACE WITH:** `backgroundColor: "var(--surface-800)"`
- **TAILWIND OPTION:** `bg-surface-800` (convert to className)
- **REASON:** Replace dark gray with official surface token

---

**Line: 54**
- **FOUND:** `color: "#FFFFFF"`
- **REPLACE WITH:** `color: "var(--lux-white)"`
- **TAILWIND OPTION:** `text-lux-white` (convert to className)
- **REASON:** Replace white hex with official lux-white token

---

**Line: 55**
- **FOUND:** `color="#C9A66B"`
- **REPLACE WITH:** `color="var(--gold-500)"`
- **TAILWIND OPTION:** N/A (SVG icon prop)
- **REASON:** Replace non-standard gold with official gold-500 token

---

**Line: 56**
- **FOUND:** `color: "#C9A66B"`
- **REPLACE WITH:** `color: "var(--gold-500)"`
- **TAILWIND OPTION:** `text-gold-500` (convert to className)
- **REASON:** Replace non-standard gold with official gold-500 token

---

### File: src/components/admin/charts/RevenueByCategory.tsx

**Line: 28**
- **FOUND:** `const COLORS = ["#D4AF37", "#A17D2F", "#CD7F32", "#C0C0C0", "#FFD700"];`
- **REPLACE WITH:** `const COLORS = ["var(--gold-500)", "var(--gold-600)", "var(--gold-700)", "var(--lux-silver)", "var(--gold-300)"];`
- **TAILWIND OPTION:** N/A (chart library requires CSS vars or hex)
- **REASON:** Replace hex color array with official color tokens for chart

---

**Line: 57**
- **FOUND:** `fill="#D4AF37"`
- **REPLACE WITH:** `fill="var(--gold-500)"`
- **TAILWIND OPTION:** N/A (chart library prop)
- **REASON:** Replace hex with official gold-500 token

---

## 📊 BREAKDOWN BY COLOR TYPE

### Gold Variants (3 instances)
- `#D4AF37` → `var(--gold-500)` (3 instances)
- `#B1874C` → `var(--gold-600)` (1 instance)
- `#C9A66B` → `var(--gold-500)` (2 instances)

### Dark Grays (3 instances)
- `#0D0D0D` → `bg-lux-black` (3 instances)
- `#3A3A3A` → `var(--surface-800)` (1 instance)

### Light Grays (2 instances)
- `#f0f0f0` → `var(--surface-50)` (1 instance)
- `#f9f9f9` → `var(--surface-50)` (1 instance)

### Non-Brand Colors (1 instance)
- `#667eea` → `var(--gold-500)` (1 instance - purple button)

### Other Colors (2 instances)
- `#FFFFFF` → `var(--lux-white)` (1 instance)
- Chart colors array cleanup (1 instance)

---

## 🔍 NOTES

1. **Email Templates:** All colors in `src/emails/**` are INTENTIONALLY EXCLUDED as per requirements
2. **Chart Libraries:** Some hex values are required by chart libraries (Recharts). CSS variables can be used where supported.
3. **Inline Styles:** Some replacements may benefit from conversion to Tailwind classes instead of CSS variables.

---

## ✅ VERIFICATION CHECKLIST

After applying patches, verify:
- [ ] No remaining `#D3AF37`, `#B1874C`, `#c9a961` in allowed folders
- [ ] No remaining `#1a1a1a`, `#2C2C2C`, `#6b6b6b` in allowed folders
- [ ] No remaining `#f0f0f0`, `#f6f0ee`, `#f9f9f9` in allowed folders
- [ ] No remaining `#764ba2` (purple gradient) anywhere
- [ ] All email templates remain untouched
- [ ] Build succeeds without errors

---

**END OF PATCH LIST**
