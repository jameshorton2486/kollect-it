# 📋 REBRAND IMPLEMENTATION GUIDE

**Everything you need to execute the rebrand successfully.**

---

## ✅ PRE-EXECUTION CHECKLIST

Before you start, verify:

- [ ] All 4 PHASE-4 reference docs in repo root
- [ ] Git status is clean: `git status` shows no unexpected changes
- [ ] VS Code open with Kollect-It project
- [ ] Copilot Chat works (Ctrl+Shift+I)
- [ ] `bun run dev` can start successfully
- [ ] You have 1-2 hours available
- [ ] You've reviewed REBRAND-COPY-PAGES.md (optional but recommended)

---

## 🚀 EXECUTION STEPS

### **STEP 1: Copy the Master Prompt (2 min)**

1. Open: `REBRAND-MASTER-PROMPT.md`
2. Find: The section between the backticks (starts with "You are an autonomous coding agent...")
3. Copy: Everything from start to end (including all 10 steps)
4. **Don't copy:** The backticks themselves or the text OUTSIDE the backticks

**Verify:** Your clipboard contains all 10 steps with clear formatting.

---

### **STEP 2: Paste into Copilot Chat (2 min)**

1. Open VS Code
2. Press: **Ctrl+Shift+I** (open Copilot Chat)
3. Click: In the input box at the bottom
4. Paste: **Ctrl+V** (your copied prompt)
5. Scroll through: Verify entire prompt is pasted (all 10 steps visible)
6. Press: **Enter**

**Expected:** Agent says "I understand" or asks clarifying questions. Let it proceed.

---

### **STEP 3: Monitor Execution (30-60 min)**

**What happens:**

Agent will systematically update each page:
- Step 1: Homepage hero (reads/updates text)
- Step 2: Four-pillar tagline (finds and replaces)
- Step 3-10: Continues through all sections

**What you do:**

- ✅ Keep VS Code open
- ✅ Keep Copilot Chat visible (optional to watch)
- ✅ Let it run (don't interrupt)
- ✅ Check progress files if you want (see below)

**Optional: Check Progress**

```powershell
# In new PowerShell terminal, watch for changes:
cd C:\Users\james\kollect-it-marketplace-1

# See files being modified:
git status

# Or refresh every 10 sec:
while ($true) { git diff --name-only; Start-Sleep 10 }
```

---

### **STEP 4: Verify Locally (15 min)**

Once agent finishes (watch for final message in chat):

```powershell
# Start dev server
bun run dev

# In browser, navigate to:
# http://localhost:3000 (homepage)
# Check: New copy is visible, no layout broken
# Check: Hero says "Collectibles Worth Collecting"
# Check: No "luxury" or "white glove" language

# Check other pages:
# /shop (categories updated?)
# /category/rare-books (new category description?)
# /about (About page created or updated?)

# Check console (F12 → Console)
# Should have no red errors (warnings OK)

# Check mobile (Ctrl+Shift+M in DevTools)
# Text should be readable, no weird wrapping
```

**If something looks wrong:**
- Take a screenshot
- Note which page/section
- Check REBRAND-COPY-PAGES.md for expected copy
- Manual fix if needed (simple find/replace)

---

### **STEP 5: Build Test (5 min)**

```powershell
# Stop dev server (Ctrl+C if running)

# Build for production
bun run build

# Expected output:
# ✓ 58 routes compiled successfully
# ✓ Zero TypeScript errors
```

**If build fails:**
- Check error message
- Usually it's a syntax error in updated copy (extra quotes, etc.)
- Find and fix the problematic text
- Run `bun run build` again

---

### **STEP 6: Git Commit (2 min)**

```powershell
# Check what changed
git diff --name-only

# Should see files like:
# src/app/page.tsx
# src/app/category/...
# src/app/about/page.tsx
# etc.

# Stage all changes
git add .

# Commit with clear message
git commit -m "rebrand: Complete messaging overhaul to professional, honest tone

- Updated homepage hero and tagline
- Replaced posh language with honest, approachable copy
- Added 'Sell Your Items' section and call-to-action
- Updated all category descriptions and pricing
- Added/updated About page with story and mission
- Improved authentication, shipping, and trust messaging
- All changes are content-only (no layout/design changes)
- Build: passing, zero TypeScript errors"

# Verify commit succeeded
git status
# Should show: "nothing to commit, working tree clean"
```

---

### **STEP 7: Push to Production (2 min)**

```powershell
# Push to GitHub (Vercel auto-deploys)
git push origin main

# Expected output:
# [main ...] rebrand: Complete messaging overhaul...
# X files changed...
```

**Then:**

1. Wait 2-5 minutes for Vercel to build
2. Check Vercel dashboard: https://vercel.com/dashboard
3. Should show green checkmark and "Deployed"

---

### **STEP 8: Test Production URL (5 min)**

1. Open your production URL in browser
2. Verify:
   - [ ] Homepage loads with new copy
   - [ ] Hero reads "Collectibles Worth Collecting"
   - [ ] No "luxury" or "white glove" language
   - [ ] "Sell Your Items" CTA visible
   - [ ] Category pages work and show new descriptions
   - [ ] Checkout flow still works (test adding item to cart)
   - [ ] Admin dashboard still works (if you have access)

3. Check console (F12 → Console):
   - [ ] No red errors
   - [ ] Page loads quickly

---

## 🎯 SUCCESS CRITERIA

**Phase 4 Rebrand is complete when:**

✅ Homepage, categories, and about page use new tone
✅ No mentions of "white glove," "museums," "luxury" remain
✅ Authentication, pricing, and shipping described honestly
✅ "Sell Your Items" is visible with clear contact path
✅ All pages load without console errors
✅ Build passes: `bun run build` succeeds
✅ Production URL works and shows all updates
✅ Mobile view is responsive and readable

---

## ⚠️ TROUBLESHOOTING

### **Agent doesn't start**
- Verify Copilot Chat is open (Ctrl+Shift+I)
- Verify you pasted ENTIRE prompt (all 10 steps)
- Try refreshing VS Code (Ctrl+K Ctrl+Q)

### **Agent gets stuck (no messages for 10+ min)**
- Close Copilot Chat
- Check if files were modified: `git diff --name-only`
- If yes, agent is working slowly (continue waiting or restart)
- If no, agent failed (check for error)

### **Build fails after rebranding**
- Error message will show file and line
- Usually: mismatched quotes or syntax error in updated copy
- Fix: Open file in VS Code, find line, correct syntax
- Retry: `bun run build`

### **Wrong copy on a page**
- Compare to REBRAND-COPY-PAGES.md
- If copy is wrong, manually find and replace
- Simplest: Find old phrase, replace with new
- Test: `bun run dev`, check page, then commit

### **Categories not updated**
- Check: Does /category/[slug] route exist?
- May need to update multiple component files
- If stuck, email/contact me with specific file names

### **Need to rollback**
```powershell
# Undo last commit (keeps changes in files)
git reset --soft HEAD~1

# Or revert entire commit (undoes changes)
git revert HEAD

# Or restore to previous state
git checkout HEAD~1 -- <filename>
```

---

## 📊 TYPICAL TIMELINE

| Task | Typical Time |
|------|---|
| Copy prompt | ~2 min |
| Paste into Copilot | ~2 min |
| Agent runs | ~30-60 min (hands-off) |
| Verify locally | ~15 min |
| Build test | ~5 min |
| Commit + push | ~5 min |
| Wait for Vercel | ~2-5 min |
| Test production | ~5 min |
| **TOTAL** | **~1.5-2 hours** |

**This is hands-off time mostly.** You don't need to watch it all.

---

## ✅ AFTER REBRAND IS LIVE

Once production shows new copy:

1. **Tell your team / stakeholders:** "New messaging is live"
2. **Start social media:** Use prompts from SOCIAL-MEDIA-STRATEGY.md
3. **Update navigation:** If you added "Sell Your Items" to nav, verify link works
4. **Monitor feedback:** Watch for messages about unclear language
5. **Next: Phase 5 planning** (design improvements, new features)

---

## 🎯 YOUR MOVE

**1. Review REBRAND-COPY-PAGES.md** (optional but helpful)
   - Read through all the new copy
   - Make any small tweaks you want
   - Or approve as-is

**2. When ready: Execute**
   - Copy REBRAND-MASTER-PROMPT.md
   - Paste into Copilot Chat
   - Let it run
   - Follow this guide

**3. Questions?**
   - Check REBRAND-COPY-PAGES.md for exact copy
   - Check this guide for troubleshooting
   - Most issues are minor and fixable

---

**Ready? Let's rebrand Kollect-It.** 🚀
