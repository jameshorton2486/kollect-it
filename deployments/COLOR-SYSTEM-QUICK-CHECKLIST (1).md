# COLOR SYSTEM - QUICK START CHECKLIST

## 🚀 5-MINUTE START

### Step 1: Run the Audit (2 minutes)
```bash
cd ~/kollect-it
node color-audit.js
```
→ This shows you what needs fixing

### Step 2: Open Cursor/VS Code (1 minute)
- Open your Kollect-It project
- Make sure you're on a clean git branch

### Step 3: Use the AI Prompt (2 minutes)
1. Open `APPLY-COLOR-SYSTEM-PROMPT.md`
2. Copy everything
3. Paste into Cursor Composer (Cmd+I)
4. Add: "Execute this now"
5. Press Enter

**⏸️ PAUSE HERE - Let AI work for 30-60 minutes**

---

## ✅ VERIFICATION CHECKLIST

After AI finishes, check these:

### Quick Checks (5 minutes)
- [ ] Run `node color-audit.js` again
- [ ] Should show 0 issues (or close to it)
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000

### Visual Spot Checks (10 minutes)
- [ ] Homepage - Looks good?
- [ ] Shop page - Products visible?
- [ ] Click a product - Details page OK?
- [ ] Header - Logo and links clear?
- [ ] Footer - Readable text?
- [ ] Admin (if you use it) - Dashboard OK?

### Color-Specific Checks (5 minutes)
- [ ] Text is dark enough to read
- [ ] Backgrounds are cream/white-ish
- [ ] Gold accents show up
- [ ] Buttons are navy blue
- [ ] Hover states work (buttons change color)

---

## 🔴 RED FLAGS - Stop & Fix These

If you see these, something went wrong:

❌ **STOP if:**
- Text is white on white (can't read)
- Buttons disappeared
- Everything looks black and white
- Site is completely broken
- TypeScript errors everywhere

**Fix:**
```bash
# Revert changes
git reset --hard HEAD

# Start over or ask for help
```

---

## ✅ GREEN LIGHTS - You're Good!

If you see these, you're done:

✅ **CONTINUE if:**
- Minor color differences (that's OK)
- Some components need tweaking (normal)
- 95% looks right (good enough to proceed)
- Audit shows <10 remaining issues (acceptable)

---

## 📋 PRIORITY ORDER

If you want to do this manually, fix in this order:

### Phase 1: Core (Most Important)
1. `src/app/globals.css` - Verify design tokens exist
2. `src/components/Header.tsx` - Site navigation
3. `src/components/Footer.tsx` - Bottom of every page
4. `src/app/page.tsx` - Homepage

### Phase 2: Shop (Customer-Facing)
5. `src/app/shop/page.tsx` - Shop page
6. `src/components/ProductCard.tsx` - Product listings
7. `src/app/products/[id]/page.tsx` - Product details
8. `src/app/cart/page.tsx` - Shopping cart

### Phase 3: Forms & UI
9. `src/components/ui/button.tsx` - All buttons
10. `src/components/ui/input.tsx` - All forms
11. `src/components/ui/card.tsx` - All cards
12. `src/app/checkout/page.tsx` - Checkout

### Phase 4: Admin (If Needed)
13. `src/app/admin/dashboard/page.tsx` - Admin home
14. `src/app/admin/**/page.tsx` - Other admin pages

### Phase 5: Everything Else
15. All remaining pages
16. All remaining components

---

## 🎯 SUCCESS = These 3 Things

1. **Audit Clean**
   ```bash
   node color-audit.js
   # Shows: "0 hardcoded colors found"
   ```

2. **Site Looks Good**
   - Open in browser
   - Colors match design system
   - Everything readable

3. **No Errors**
   ```bash
   npm run build
   # Should complete with no errors
   ```

---

## ⏱️ TIME ESTIMATES

| Task | Time | When |
|------|------|------|
| Run audit | 2 min | Now |
| AI prompt | 2 min | Now |
| AI processing | 30-60 min | Wait |
| Verification | 20 min | After AI |
| Manual fixes | 30-60 min | If needed |
| **TOTAL** | **1.5-2.5 hrs** | Today |

---

## 💾 SAVE YOUR WORK

After you're happy with results:

```bash
# Check what changed
git status

# Review changes (optional)
git diff

# Commit everything
git add .
git commit -m "Apply design system colors globally"

# Push to GitHub
git push

# Vercel will auto-deploy
```

---

## 📞 WHEN TO ASK FOR HELP

Ask for help if:
- Audit shows 100+ issues after AI pass
- Site is completely broken
- Colors look totally wrong
- You're stuck for >30 minutes
- Not sure what to do next

Otherwise, keep going - you've got this! 💪

---

## 📱 MOBILE CHECK

Don't forget to test on phone:
1. Open kollect-it.com on phone
2. Check these pages:
   - Homepage
   - Shop
   - Product detail
   - Cart
3. Make sure text is readable

---

## 🎨 COLOR REFERENCE (Quick Lookup)

| What | Old | New Class |
|------|-----|-----------|
| Black text | `text-black` | `text-ink-900` |
| Gray text | `text-gray-700` | `text-ink-700` |
| White bg | `bg-white` | `bg-surface-0` |
| Light bg | `bg-gray-50` | `bg-surface-50` |
| Gold | `bg-yellow-600` | `bg-gold-500` |
| Navy button | `bg-blue-600` | `bg-cta-600` |
| Border | `border-gray-300` | `border-border-300` |

---

Print this page and check boxes as you go! ✓
