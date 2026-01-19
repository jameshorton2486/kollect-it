# Archived Documentation

This folder contains old documentation files that are no longer actively needed but are kept for reference.

## Files to Archive

The following files should be moved here (they may still be in root or subdirectories):

### Root Directory Files:
- `PRE_DEPLOYMENT_REPORT.md` - Old pre-deployment report template
- `PHASES_9-14_COMPLETE_IMPLEMENTATION.md` - Old implementation summary
- `PHASES_9-14_FINAL_IMPLEMENTATION.md` - Old implementation summary
- `COMPLETE_IMPLEMENTATION_SUMMARY.md` - Old summary
- `PHASE_6-8_IMPLEMENTATION_SUMMARY.md` - Old phase summary
- `PHASE_1-5_IMPLEMENTATION_SUMMARY.md` - Old phase summary
- `AI_AGENT_TASKS.md` - Old AI agent tasks
- `KOLLECT-IT_REWRITE_PLAN.md` - Old rewrite plan

### Subdirectory Files:
- `fixes/kollect-it-fixes/IMPLEMENTATION_COMPLETE.md` → `IMPLEMENTATION_COMPLETE.md`
- `fixes/kollect-it-fixes/REVIEW_REPORT.md` → `REVIEW_REPORT.md`
- `fixes/kollect-it-fixes/README (1).md` → `README_fixes.md`
- `fixes/kollect-it-fixes/PRE-LAUNCH-REVIEW (1).md` → `PRE-LAUNCH-REVIEW.md`
- `scripts/test-features.md` → `test-features.md`
- `MD Work Files/DEPLOYMENT-INSTRUCTIONS.md` → `DEPLOYMENT-INSTRUCTIONS.md`
- `design/ai-agent-prompt-build-fixes.md` → `ai-agent-prompt-build-fixes.md`
- `logs/error-messages.md` → `error-messages.md`

## Active Documentation (Keep in Root)

The following files should remain in the root directory:

- `README.md` - Main project documentation
- `DEPLOYMENT_GUIDE.md` - Current deployment guide
- `PRODUCTION_TEST_REPORT.md` - Production testing results
- `PRE_LAUNCH_FIXES_COMPLETE.md` - Pre-launch fixes summary
- `ENV_VARIABLES_FOR_PASSWORD_RESET.md` - Environment variables guide

## How to Archive

Run the archive script:
```powershell
.\scripts\archive-md-files.ps1
```

Or manually move files when they're not in use (may be locked by editor).

---

**Created:** 2025-01-27  
**Purpose:** Clean up outdated documentation files
