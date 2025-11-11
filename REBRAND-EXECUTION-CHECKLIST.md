# ✅ REBRAND EXECUTION CHECKLIST

**Print this. Use this. Check off as you go.**

**Timeline: ~2 hours total**

---

## 🔥 30 MINUTES BEFORE YOU START

- [ ] Close all unnecessary apps (browser tabs, Slack, email)
- [ ] Silence phone notifications
- [ ] Make coffee/have water nearby
- [ ] Open VS Code with Kollect-It project
- [ ] Verify repo is clean: `git status` shows no unexpected changes
- [ ] Test that `bun run dev` works (starts without errors)
- [ ] Read this checklist all the way through (yes, all the way)

---

## 🚀 EXECUTION CHECKLIST

### STEP 1: Prepare the Master Prompt (5 min)

**Location:** `REBRAND-MASTER-PROMPT.md`

- [ ] Open the file `REBRAND-MASTER-PROMPT.md` in VS Code
- [ ] Find the section between the three backticks (```)
- [ ] Starts with: "You are an autonomous coding agent..."
- [ ] Ends with: "REBRAND COMPLETE! 🎉"
- [ ] Copy entire prompt (Ctrl+A inside the backticks, then Ctrl+C)
- [ ] Verify clipboard has all 10 steps (scroll through to check)

**What you should NOT copy:**
- ❌ The backticks themselves (just the text inside)
- ❌ Any text before "You are an autonomous coding agent..."
- ❌ The section title or instructions above the backticks

**Verification:** Paste into a notepad (Ctrl+V) and verify all 10 steps are there, then copy again to clipboard.

---

### STEP 2: Open Copilot Chat (2 min)

**In VS Code:**

- [ ] Press: **Ctrl+Shift+I** (opens Copilot Chat on right side)
- [ ] Wait for chat window to load (2-3 seconds)
- [ ] Click in the input box at the bottom of the chat
- [ ] Type one character (verify input works)
- [ ] Delete that character

**Ready to paste:** Cursor should be in the chat input box, waiting.

---

### STEP 3: Paste the Prompt (2 min)

- [ ] In Copilot Chat input box, paste: **Ctrl+V**
- [ ] Scroll through the pasted text to verify all steps appeared
- [ ] Verify you see:
  - [ ] "STEP 1: Homepage Hero Section"
  - [ ] "STEP 2: Four-Pillar Tagline Section"
  - [ ] "STEP 3: Trust & Security Section"
  - [ ] ... all the way through...
  - [ ] "STEP 10: Global CTA Updates"
  - [ ] "FINAL CHECKS"
  - [ ] "COMPLETION STATUS"

**If paste failed or looks incomplete:**
- [ ] Clear the input (Ctrl+A, Delete)
- [ ] Re-copy from REBRAND-MASTER-PROMPT.md
- [ ] Try again

**When ready:** Press **Enter** to start the agent.

---

### STEP 4: Agent Execution (30-60 min - HANDS OFF)

**What happens:**
- Agent will start with "I understand the task..."
- Will work through 10 steps systematically
- Will modify files in your project
- Will run tests and verify changes
- Will provide progress updates in chat

**What you do:**
- [ ] Watch Copilot Chat (optional - can minimize)
- [ ] Let it run without interrupting
- [ ] Resist the urge to "help" or click around
- [ ] Keep VS Code open and in focus
- [ ] No other dev tasks (let agent focus)

**Optional: Monitor Progress**

If you want to see files being changed:

```powershell
# In NEW PowerShell terminal (don't close the other one):
cd C:\Users\james\kollect-it-marketplace-1
# or your correct project path

# Check which files changed:
git status

# See actual changes:
git diff src/app/page.tsx
# (replace with any file you want to inspect)

# Refresh every 10 seconds to see live changes:
while ($true) { Clear-Host; git status; Start-Sleep 10 }
```

**Agent completion indicators:**
- [ ] Chat shows "All steps completed"
- [ ] Chat suggests committing changes
- [ ] No red errors in the chat (warnings OK)

---

### STEP 5: Local Verification (15 min)

**Once agent finishes:**

```powershell
# Start dev server (if not already running)
bun run dev

# Expected output:
# ✓ Compiled successfully
# ✓ Ready in XXms
# ✓ Local: http://localhost:3000
```

- [ ] Wait for "Ready" message
- [ ] Open browser to **http://localhost:3000**

**Check homepage:**
- [ ] Page loads without 404 or errors
- [ ] Hero section reads: "Collectibles Worth Collecting"
- [ ] Subheadline is about "professionally valued, fairly priced"
- [ ] No "luxury" or "white glove" visible
- [ ] "Sell Your Items" CTA visible somewhere on page
- [ ] Layout looks correct (no broken text or styling)

**Check categories:**
```
- [ ] /category/rare-books loads
- [ ] Description mentions "First editions, signed copies"
- [ ] /category/fine-art loads
- [ ] /category/collectibles loads
- [ ] /category/militaria loads
```

**Check mobile view:**
- [ ] Ctrl+Shift+M (toggle device toolbar)
- [ ] Text is readable (not cramped)
- [ ] Hero doesn't overflow
- [ ] CTA buttons are clickable-sized
- [ ] No weird line breaks

**Check console for errors:**
- [ ] F12 (open DevTools)
- [ ] Click "Console" tab
- [ ] Should see NO red errors
- [ ] Warnings are OK (ignore them)

**If something is wrong:**
- [ ] Take a screenshot
- [ ] Note which page and section
- [ ] Don't panic—most issues are minor
- [ ] Check REBRAND-COPY-PAGES.md for expected copy
- [ ] You can manually fix afterward if needed

---

### STEP 6: Production Build Test (5 min)

```powershell
# Stop dev server (Ctrl+C in the PowerShell where it's running)

# Build for production
bun run build

# Expected output:
# ✓ 58 routes compiled successfully
# ✓ Successfully optimized...
# ✓ Exported to .next...
```

- [ ] Build completes without errors
- [ ] See green checkmarks
- [ ] No TypeScript errors reported

**If build fails:**
- [ ] Read the error message carefully
- [ ] Usually it's a syntax error in updated copy (missing quote, etc.)
- [ ] Find the file mentioned in the error
- [ ] Fix the syntax error
- [ ] Run `bun run build` again
- [ ] Contact me if you can't find the issue

---

### STEP 7: Git Commit (3 min)

```powershell
# Check what files changed
git diff --name-only

# Should see files like:
# src/app/page.tsx
# src/app/category/[slug]/page.tsx
# src/app/about/page.tsx
# etc.

# Verify changes look reasonable:
git status

# Stage all changes
git add .

# Commit with message
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
```

**Expected final output:**
```
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean
```

- [ ] You see "nothing to commit, working tree clean"
- [ ] This means commit succeeded

---

### STEP 8: Push to Production (2 min)

```powershell
# Push to GitHub (Vercel auto-deploys)
git push origin main

# Expected output:
# [main xxxxxxx] rebrand: Complete messaging overhaul...
# X files changed, Y insertions(+), Z deletions(-)
```

- [ ] You see the branch update message
- [ ] No errors about authentication

**What happens next:**
- [ ] Vercel automatically builds from GitHub
- [ ] Takes 2-5 minutes to deploy
- [ ] Your site will be live with new copy

---

### STEP 9: Wait for Vercel Deployment (5 min)

```powershell
# Open Vercel dashboard in browser:
# https://vercel.com/dashboard

# Or go directly to your project URL
```

- [ ] Log in to Vercel (if needed)
- [ ] Find your Kollect-It project
- [ ] Look for deployment status
- [ ] Wait for green checkmark and "Ready"

**Timeline:**
- Pushing code: 30 seconds
- Vercel building: 2-3 minutes
- Deployment: 1-2 minutes
- Total: ~5 minutes

**During this time:**
- [ ] Grab a snack
- [ ] Check your phone
- [ ] Celebrate a bit (you're almost done!)

---

### STEP 10: Test Production URL (5 min)

**Once Vercel shows "Ready":**

```powershell
# Go to your production URL in browser
# Example: https://kollect-it-marketplace.vercel.app
# Or: https://your-custom-domain.com
```

- [ ] Homepage loads
- [ ] Hero reads "Collectibles Worth Collecting"
- [ ] No "luxury" or "posh" language visible
- [ ] "Sell Your Items" CTA is visible
- [ ] Category pages load with new descriptions
- [ ] Console has no red errors (F12 â†' Console)
- [ ] Mobile view is responsive (Ctrl+Shift+M)
- [ ] Buttons click and links work

**Specific checks:**

- [ ] Homepage hero: ✅ "Collectibles Worth Collecting"
- [ ] Four-pillar tagline: ✅ "Collectibles to Militaria"
- [ ] Trust section: ✅ No "museums" mentioned
- [ ] "Sell Your Items" section: ✅ Visible with CTA
- [ ] Category pages: ✅ All 4 have new descriptions
- [ ] Authentication section: ✅ Mentions "we listen and adjust"
- [ ] Shipping: ✅ Clear timeline (3-4 days)

---

## ✅ SUCCESS CRITERIA

**Rebrand is complete when:**

- [ ] Homepage displays new copy without errors
- [ ] All four categories have updated descriptions
- [ ] About page exists and tells your story
- [ ] "Sell Your Items" is visible and linkable
- [ ] Zero "luxury," "museum," "white glove" language remains
- [ ] Build passes: `bun run build` ✓
- [ ] Git commit successful: ✓
- [ ] Vercel deployment shows "Ready": ✓
- [ ] Production URL works: ✓
- [ ] Mobile view is responsive: ✓
- [ ] Console is clean (no red errors): ✓

**All 11 checkboxes done = REBRAND LIVE** 🎉

---

## 🆘 TROUBLESHOOTING QUICK REFERENCE

| Problem | Solution | Time |
|---------|----------|------|
| **Copilot Chat won't open** | Ctrl+Shift+I, or click Copilot icon in sidebar | 1 min |
| **Agent gets stuck** | Wait 5+ min, check git status, try refreshing VS Code | 5 min |
| **Build fails** | Read error, find file, fix syntax (usually quotes), retry | 5-10 min |
| **Wrong copy on page** | Reference REBRAND-COPY-PAGES.md, manually fix if needed | 5 min |
| **Category not updated** | Check if route exists, may need manual update | 10 min |
| **Vercel deployment stuck** | Refresh Vercel dashboard, check GitHub status | 2 min |
| **Mobile view broken** | Check browser console (F12), may be CSS issue | 10 min |

**For any other issues:** Check REBRAND-IMPLEMENTATION-GUIDE.md for detailed troubleshooting.

---

## 📋 FINAL HANDOFF CHECKLIST

**Before you call this "done":**

- [ ] Production URL shows all new copy ✓
- [ ] No errors in browser console ✓
- [ ] Mobile view looks good ✓
- [ ] Git log shows your commit ✓
- [ ] You can access production site and browse it ✓

**Post-rebrand next steps:**

- [ ] Tell your team/stakeholders rebrand is live
- [ ] Update social media profiles (use SOCIAL-MEDIA-STRATEGY.md)
- [ ] Generate images for social (use IMAGE-PROMPTS-COMPLETE.md)
- [ ] Monitor feedback for unclear messaging
- [ ] Plan Phase 5 next (design improvements, new features)

---

## 📞 KEY REFERENCE FILES (Keep Handy)

During execution, have these open/nearby:

1. **REBRAND-MASTER-PROMPT.md** — The prompt you're running
2. **REBRAND-IMPLEMENTATION-GUIDE.md** — Detailed step-by-step guide
3. **REBRAND-COPY-PAGES.md** — Expected copy for verification
4. This checklist — To stay on track

---

## ⏱ TIMELINE AT A GLANCE

```
START: Print this checklist, take a breath

00:00 - 00:07  Prepare prompt + open Copilot Chat
00:07 - 00:09  Paste prompt, press Enter
00:09 - 01:00  Agent runs (you're hands-off) ✋
01:00 - 01:15  Local verification (bun run dev, check pages)
01:15 - 01:20  Build test (bun run build)
01:20 - 01:23  Git commit
01:23 - 01:25  Git push
01:25 - 01:30  Wait for Vercel (grab coffee!)
01:30 - 01:35  Test production URL

TOTAL: ~95 minutes (~1.5 hours)
STATUS: REBRAND LIVE ✅

(Times may vary slightly depending on build speed)
```

---

## 🎯 YOU'VE GOT THIS

This is a straightforward execution of a well-tested process.

**You're:**
- Copying a proven prompt ✓
- Letting an agent do the work ✓
- Verifying it worked ✓
- Pushing it live ✓

**Common concern:** "What if something goes wrong?"

**Answer:** Worst case, you rollback one commit:
```powershell
git revert HEAD
git push origin main
# Site is back to previous version (takes 5 min)
```

**You cannot break anything permanently.** Git has your back.

---

## ✍️ NOTES

**Jot down any issues during execution below:**

```
Issue #1: 
Description: 
Solution: 

Issue #2:
Description:
Solution:

Issue #3:
Description:
Solution:
```

---

## 🚀 READY?

- [ ] Printed this checklist
- [ ] Have all 6 rebrand files ready
- [ ] Have 1-2 hours available
- [ ] Phone silenced
- [ ] Coffee nearby

**Then:**

1. Start with STEP 1 above
2. Check off as you go
3. When you reach the bottom, rebrand is LIVE

---

**Questions before you start? Reference REBRAND-IMPLEMENTATION-GUIDE.md or wait until after Step 3.**

**Let's go.** 🚀
