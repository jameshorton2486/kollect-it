# Archive Instructions

**Date:** 2025-01-27

## Files to Archive

The following markdown files are outdated and should be moved to the `archive/` folder:

### Root Directory (8 files):
1. `PRE_DEPLOYMENT_REPORT.md`
2. `PHASES_9-14_COMPLETE_IMPLEMENTATION.md`
3. `PHASES_9-14_FINAL_IMPLEMENTATION.md`
4. `COMPLETE_IMPLEMENTATION_SUMMARY.md`
5. `PHASE_6-8_IMPLEMENTATION_SUMMARY.md`
6. `PHASE_1-5_IMPLEMENTATION_SUMMARY.md`
7. `AI_AGENT_TASKS.md`
8. `KOLLECT-IT_REWRITE_PLAN.md`

### From Subdirectories (8 files):
1. `fixes/kollect-it-fixes/IMPLEMENTATION_COMPLETE.md` → `archive/IMPLEMENTATION_COMPLETE.md`
2. `fixes/kollect-it-fixes/REVIEW_REPORT.md` → `archive/REVIEW_REPORT.md`
3. `fixes/kollect-it-fixes/README (1).md` → `archive/README_fixes.md`
4. `fixes/kollect-it-fixes/PRE-LAUNCH-REVIEW (1).md` → `archive/PRE-LAUNCH-REVIEW.md`
5. `scripts/test-features.md` → `archive/test-features.md`
6. `MD Work Files/DEPLOYMENT-INSTRUCTIONS.md` → `archive/DEPLOYMENT-INSTRUCTIONS.md`
7. `design/ai-agent-prompt-build-fixes.md` → `archive/ai-agent-prompt-build-fixes.md`
8. `logs/error-messages.md` → `archive/error-messages.md`

## Keep These Files (Active Documentation):

- ✅ `README.md` - Main project documentation
- ✅ `DEPLOYMENT_GUIDE.md` - Current deployment guide
- ✅ `PRODUCTION_TEST_REPORT.md` - Production testing results
- ✅ `PRE_LAUNCH_FIXES_COMPLETE.md` - Pre-launch fixes summary
- ✅ `ENV_VARIABLES_FOR_PASSWORD_RESET.md` - Environment variables guide

## How to Archive

### Option 1: Run the Script
```powershell
.\scripts\archive-md-files.ps1
```

### Option 2: Manual Archive
1. Close any editors that might have these files open
2. Run the archive script, or
3. Manually move files to `archive/` folder

### Option 3: Use Git (if files are tracked)
```powershell
git mv PRE_DEPLOYMENT_REPORT.md archive/
git mv PHASES_9-14_COMPLETE_IMPLEMENTATION.md archive/
# ... etc
```

## Note

If files won't move, they may be:
- Open in your editor (Cursor/VS Code)
- Locked by another process
- In use by a file watcher

Close the files and try again.

---

**Total Files to Archive:** 16 files  
**Archive Location:** `archive/` folder
