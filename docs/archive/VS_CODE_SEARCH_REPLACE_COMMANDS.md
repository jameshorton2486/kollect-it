# VS CODE SEARCH/REPLACE COMMANDS (SAFE)

## ⚠️ IMPORTANT NOTES

1. **Scope:** Only apply these in the following folders:
   - `src/app/**`
   - `src/components/**`
   - `src/lib/**` (EXCEPT `src/lib/email/reportSender.ts` - handle manually)
   - `src/styles/**`

2. **DO NOT apply to:**
   - `src/emails/**` (email templates stay untouched)
   - `design-backups/**`
   - `backup-phase**/`

3. **Use VS Code Find & Replace (Ctrl+Shift+H)**
   - Enable regex mode for pattern matching
   - Review each match before replacing
   - Test after each replacement batch

---

## 🎯 GOLD FIXES

### Replacement 1: #D3AF37 → var(--gold-500)
```
Find: #D3AF37
Replace: var(--gold-500)
```
**Scope:** Files in allowed folders only
**Note:** Check context - may prefer Tailwind class `text-gold-500` or `bg-gold-500`

---

### Replacement 2: #B1874C → var(--gold-600)
```
Find: #B1874C
Replace: var(--gold-600)
```
**Scope:** Files in allowed folders only

---

### Replacement 3: #c9a961 → var(--gold-400) or var(--gold-500)
```
Find: #c9a961
Replace: var(--gold-500)
```
**Scope:** Files in allowed folders only
**Note:** Use gold-500 as primary replacement, gold-400 if lighter variant needed

---

## 🎯 DARK GRAY FIXES

### Replacement 4: #1a1a1a → var(--ink-900)
```
Find: #1a1a1a
Replace: var(--ink-900)
```
**Scope:** Files in allowed folders only
**Tailwind Alternative:** `text-ink-900` or `bg-ink-900`

---

### Replacement 5: #2C2C2C → var(--lux-charcoal)
```
Find: #2C2C2C
Replace: var(--lux-charcoal)
```
**Scope:** Files in allowed folders only
**Tailwind Alternative:** `bg-lux-charcoal` or `text-lux-charcoal`

---

### Replacement 6: #6b6b6b → var(--ink-600)
```
Find: #6b6b6b
Replace: var(--ink-600)
```
**Scope:** Files in allowed folders only
**Tailwind Alternative:** `text-ink-600`

---

### Replacement 7: #0D0D0D → var(--lux-black) or bg-lux-black
```
Find: bg-\[#0D0D0D\]
Replace: bg-lux-black
```
**Scope:** Tailwind class contexts
**Regex Mode:** Enabled

```
Find: #0D0D0D
Replace: var(--lux-black)
```
**Scope:** Inline style contexts

---

## 🎯 LIGHT GRAY FIXES

### Replacement 8: #f0f0f0 → var(--surface-50)
```
Find: #f0f0f0
Replace: var(--surface-50)
```
**Scope:** Files in allowed folders only
**Tailwind Alternative:** `bg-surface-50`

---

### Replacement 9: #f6f0ee → var(--lux-cream) or var(--surface-100)
```
Find: #f6f0ee
Replace: var(--lux-cream)
```
**Scope:** Files in allowed folders only
**Tailwind Alternative:** `bg-lux-cream`

---

### Replacement 10: #f9f9f9 → var(--surface-50)
```
Find: #f9f9f9
Replace: var(--surface-50)
```
**Scope:** Files in allowed folders only
**Tailwind Alternative:** `bg-surface-50`

---

## 🎯 NON-BRAND COLORS (MUST REMOVE)

### Replacement 11: #764ba2 → var(--gold-500)
```
Find: #764ba2
Replace: var(--gold-500)
```
**Scope:** Files in allowed folders only
**Special Case:** In `src/lib/email/reportSender.ts` line 33, replace entire gradient

---

### Replacement 12: #667eea → var(--gold-500)
```
Find: #667eea
Replace: var(--gold-500)
```
**Scope:** Files in allowed folders only
**Note:** Purple button color - replace with gold

---

## 🎯 ADDITIONAL FIXES

### Replacement 13: #3A3A3A → var(--surface-800)
```
Find: #3A3A3A
Replace: var(--surface-800)
```
**Scope:** Files in allowed folders only
**Tailwind Alternative:** `bg-surface-800`

---

### Replacement 14: #FFFFFF → var(--lux-white)
```
Find: #FFFFFF
Replace: var(--lux-white)
```
**Scope:** Files in allowed folders only
**Tailwind Alternative:** `text-lux-white` or `bg-lux-white`

---

## 📝 MANUAL FIXES REQUIRED

### File: src/lib/email/reportSender.ts

**Line 33 - Gradient:**
```css
/* BEFORE */
.header { background: linear-gradient(135deg, #D4AF37 0%, #B1874C 100%); ... }

/* AFTER */
.header { background: linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%); ... }
```

**Line 40 - Button:**
```css
/* BEFORE */
.button { display: inline-block; background: #667eea; ... }

/* AFTER */
.button { display: inline-block; background: var(--gold-500); ... }
```

---

## ✅ VERIFICATION STEPS

After running all replacements:

1. **Search for remaining hex colors:**
   ```
   Find: #[0-9a-fA-F]{6}
   ```
   (In allowed folders only)

2. **Check for Tailwind hex classes:**
   ```
   Find: bg-\[#|text-\[#|border-\[#
   ```

3. **Verify email templates untouched:**
   - All files in `src/emails/**` should still have their original hex colors

4. **Run build test:**
   ```bash
   npm run build
   ```

---

## 🚨 SAFETY CHECKLIST

Before applying:
- [ ] Back up current branch
- [ ] Review each search result
- [ ] Exclude email templates from search
- [ ] Test one file first

After applying:
- [ ] Verify no email templates were modified
- [ ] Check build succeeds
- [ ] Visual regression test key pages
- [ ] Verify color appearance matches design system

---

**END OF SEARCH/REPLACE COMMANDS**
