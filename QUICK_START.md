# 🚀 Kollect-It Audit System - Quick Start Guide

**For people who want to start immediately without reading the full docs!**

---

## ⚡ TL;DR - 30 Second Setup

```powershell
# 1. Navigate to your project
cd C:\Users\james\kollect-it-marketplace-1

# 2. Run the audit (that's literally it!)
.\RUN_AUDIT.ps1

# 3. Walk away! Come back in 5-30 minutes
# 4. Read: audit-output\AUDIT_SUMMARY.md
```

**Done!** Skip to "Reading Results" below.

---

## 📋 First Time Setup (One-Time)

### Step 1: Check Prerequisites

Open PowerShell and run these commands:

```powershell
# Check if you have everything needed
git --version    # Should show: git version X.X.X
node --version   # Should show: vX.X.X (need v18+)
npm --version    # Should show: X.X.X
```

**If any command fails:**

- Git: [Download here](https://git-scm.com/download/win)
- Node.js: [Download here](https://nodejs.org/) (get LTS version)

### Step 2: Put Files in Your Project

Copy these 3 files to your project root:

1. `RUN_AUDIT.ps1` ← The main script
2. `AUDIT_SYSTEM_README.md` ← Full documentation
3. `AUDIT_MASTER_PROMPT.md` ← For Claude AI (optional)

Your project should look like:

```
C:\Users\james\kollect-it-marketplace-1\
├── RUN_AUDIT.ps1              ← New file
├── AUDIT_SYSTEM_README.md     ← New file
├── AUDIT_MASTER_PROMPT.md     ← New file
├── src\
├── package.json
├── ...
```

### Step 3: Test Run

```powershell
# Navigate to your project
cd C:\Users\james\kollect-it-marketplace-1

# Run the audit
.\RUN_AUDIT.ps1
```

**If you get "execution policy" error:**

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\RUN_AUDIT.ps1
```

---

## 🎮 Basic Usage

### Run Full Audit (with auto-fixes)

```powershell
.\RUN_AUDIT.ps1
```

**What happens:**

- Creates a new branch automatically
- Analyzes your entire codebase
- Fixes safe issues (formatting, linting, etc.)
- Generates reports
- Takes 5-30 minutes depending on project size

### Run Audit (reports only, no fixes)

```powershell
.\RUN_AUDIT.ps1 -SkipAutoFix
```

**Use this when:**

- You just want to see what's wrong
- You don't want any automated changes
- You're running on someone else's code

### Specify Project Location

```powershell
.\RUN_AUDIT.ps1 -ProjectPath "C:\path\to\your\project"
```

**Use this when:**

- Script can't auto-detect your project
- You want to audit a different project
- You're not in the project directory

---

## 📊 Reading Results

### Step 1: Open the Summary

```powershell
# After audit completes, open this:
code audit-output\AUDIT_SUMMARY.md

# Or in any text editor:
notepad audit-output\AUDIT_SUMMARY.md
```

**This tells you everything:**

- How many issues found
- What got fixed automatically
- What needs your attention
- Next steps

### Step 2: Check Critical Issues FIRST

```powershell
# Look in this folder:
cd audit-output\reports\CRITICAL\

# Open any .md files you find
code SECURITY_CRITICAL.md
code ENV_SECRETS.md
```

**If you have critical issues:**
🚨 **FIX THEM TODAY** - These are security problems!

### Step 3: Browse Other Reports

```powershell
# High priority (fix this week)
cd audit-output\reports\HIGH\

# Medium priority (plan to fix)
cd audit-output\reports\MEDIUM\

# Low priority (nice to have)
cd audit-output\reports\LOW\
```

### Step 4: Follow the Action Plan

```powershell
# This tells you exactly what to do and when
code audit-output\ACTION_PLAN.md
```

---

## 🔄 After the Audit

### If Everything Looks Good

```powershell
# 1. Test your app
npm run dev
# Open browser, click around, make sure nothing broke

# 2. If it works, merge the changes
git checkout main
git merge automated-audit-TIMESTAMP

# 3. Push to GitHub
git push origin main

# 4. Clean up the audit branch
git branch -d automated-audit-TIMESTAMP
```

### If Something Broke

```powershell
# Go back to main branch
git checkout main

# Delete the audit branch
git branch -D automated-audit-TIMESTAMP

# Run audit again without auto-fixes
.\RUN_AUDIT.ps1 -SkipAutoFix
```

---

## 🎯 What to Do About Issues

### 🔴 Critical (Do TODAY)

- Hardcoded API keys → Move to `.env.local`
- Security vulnerabilities → Run `npm audit fix`
- Exposed secrets → Remove and rotate keys
- Unprotected API routes → Add authentication

### 🟠 High (Do THIS WEEK)

- TypeScript errors → Fix type issues
- Missing authentication → Add auth checks
- Performance problems → Optimize queries/components
- Outdated packages → Update with `npm update`

### 🟡 Medium (Do THIS SPRINT)

- Code quality issues → Refactor messy code
- Duplicate code → Create shared utilities
- Missing indexes → Add to Prisma schema
- Orphaned files → Delete if truly unused

### 🟢 Low (Do EVENTUALLY)

- Missing documentation → Add README sections
- TODO comments → Resolve or remove
- Console.log statements → Remove or use proper logging
- Commented code → Delete (you have git history!)

---

## ⚙️ Common Tasks

### Run Audit Weekly

**Option 1: Manual (recommended while learning)**

```powershell
# Every Monday morning
.\RUN_AUDIT.ps1
```

**Option 2: Scheduled Task (set it and forget it)**

```powershell
# Run this once to set up weekly audit on Sundays at 2 AM
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\Users\james\kollect-it-marketplace-1\RUN_AUDIT.ps1"
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 2am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "Kollect-It Weekly Audit"
```

### Check What Changed

```powershell
# See all changes the audit made
git diff main...automated-audit-TIMESTAMP

# See just the commit messages
git log main..automated-audit-TIMESTAMP --oneline
```

### Run Audit Before Deployment

```powershell
# Always audit before pushing to production
.\RUN_AUDIT.ps1

# Check for critical issues
ls audit-output\reports\CRITICAL\

# If no critical issues, deploy!
```

---

## 🐛 Troubleshooting

### "Cannot find RUN_AUDIT.ps1"

**Problem:** You're not in the right directory

**Solution:**

```powershell
# Navigate to your project first
cd C:\Users\james\kollect-it-marketplace-1

# Then run
.\RUN_AUDIT.ps1
```

### "Execution policy" error

**Problem:** Windows blocking unsigned scripts

**Solution:**

```powershell
# Allow this session to run scripts
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Then try again
.\RUN_AUDIT.ps1
```

### "Git command not found"

**Problem:** Git not installed

**Solution:**

1. Go to https://git-scm.com/download/win
2. Download and install Git for Windows
3. Restart PowerShell
4. Try again

### "npm command not found"

**Problem:** Node.js not installed

**Solution:**

1. Go to https://nodejs.org/
2. Download LTS version
3. Install it
4. Restart PowerShell
5. Try again

### Audit Finds Nothing

**Problem:** Might not be detecting your code correctly

**Solution:**

```powershell
# Check if you have a src directory
ls src\

# If no src directory, audit might skip files
# Run with verbose logging to see what it's doing
.\RUN_AUDIT.ps1 -VerboseLogging
```

### Audit Takes Forever

**Normal:** Large projects can take 10-30 minutes

**Solution:**

- ✅ Let it run (it's fully autonomous)
- ✅ Run overnight
- ✅ Make coffee ☕
- ✅ Come back later

---

## 💡 Pro Tips

### Tip 1: Always Test After Audit

```powershell
# Before merging, always test
npm run dev
# Click around your app
# Make sure nothing broke
```

### Tip 2: Review Changes Before Merging

```powershell
# Look at what changed
git diff main...automated-audit-TIMESTAMP
# Read through it, understand the changes
```

### Tip 3: Keep Audit Branches

```powershell
# Don't delete immediately after merging
# Keep for a week in case you need to reference
git branch -d automated-audit-TIMESTAMP  # Only do this after you're SURE
```

### Tip 4: Track Improvements

```powershell
# Save summaries to see progress
copy audit-output\AUDIT_SUMMARY.md audit-history\summary-$(date +%Y%m%d).md
```

### Tip 5: Run Before Every PR

```powershell
# Always audit your code before submitting PR
git checkout your-feature-branch
.\RUN_AUDIT.ps1 -SkipAutoFix
# Fix critical issues before creating PR
```

---

## 📞 Getting Help

### Check the Docs

```powershell
# Read the full documentation
code AUDIT_SYSTEM_README.md
```

### Check the Logs

```powershell
# If something went wrong, check the log
code audit-output\logs\audit-TIMESTAMP.log
```

### Ask for Help

- Open an issue on GitHub
- Contact the Kollect-It team
- Check the troubleshooting section above

---

## 🎓 Next Steps

### Now that you've run your first audit:

1. **Read the full README**

   ```powershell
   code AUDIT_SYSTEM_README.md
   ```

2. **Set up weekly audits**
   - Use Task Scheduler (see above)
   - Or run manually every Monday

3. **Fix critical issues**
   - Start with `CRITICAL/` reports
   - Work through `HIGH/` reports
   - Plan for `MEDIUM/LOW`

4. **Make it a habit**
   - Audit before each deployment
   - Audit after major changes
   - Track improvement over time

---

## ✅ Checklist for Success

After your first audit, you should:

- [ ] Run `.\RUN_AUDIT.ps1` successfully
- [ ] Open and read `AUDIT_SUMMARY.md`
- [ ] Check `CRITICAL/` folder for urgent issues
- [ ] Test your app (`npm run dev`)
- [ ] Understand the severity levels
- [ ] Know how to merge changes
- [ ] Schedule weekly audits

**Got all checkmarks? You're ready to go! 🚀**

---

## 🎉 You're Done!

**You now have:**

- ✅ Automated code auditing
- ✅ Reports organized by severity
- ✅ Actionable improvement plans
- ✅ Continuous code health monitoring

**Keep your codebase healthy!**

Run audits regularly, fix issues promptly, and track your progress over time.

---

**Questions?** Read the full documentation in `AUDIT_SYSTEM_README.md`

**Problems?** Check the troubleshooting section above

**Ready for more?** Explore advanced usage in the full README

---

**Happy coding! 🎊**
