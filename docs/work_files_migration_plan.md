# Work Files Migration Plan

**Date:** January 19, 2026  
**Purpose:** Review, migrate, and clean up work_files directory

---

## Phase 1: Root-Level Files Review

### Fixed Code Files (Already Integrated)
- ✅ `robots-fixed.ts` - Current version is better (cleaner format)
- ✅ `Footer-fixed.tsx` - Identical to current Footer.tsx
- ✅ `admin-login-page-fixed (1).tsx` - Identical to current admin login
- ⚠️ `ProductReviews-fixed.tsx` - Need to verify differences

**Action:** Verify ProductReviews, then delete all fixed files (already integrated)

### Documentation Files (To Archive)
- `PHASE-3-CURSOR-PROMPTS.md` - Original prompts (work complete)
- `PHASE-4-SEO-CURSOR-PROMPTS.md` - Original prompts (work complete)
- `PHASE-5-ACCESSIBILITY-CURSOR-PROMPTS.md` - Original prompts (work complete)
- `PHASE-6-LAUNCH-READINESS-CURSOR-PROMPTS.md` - Original prompts (work complete)
- `CURSOR-AI-PROMPTS-KOLLECT-IT (2).md` - Old prompts
- `CURSOR-AI-PROMPTS-KOLLECT-IT (3).md` - Old prompts
- `PHASE-4-5-AUDIT-RESULTS.md` - Audit results (already in docs/)
- `KOLLECT-IT-AUDIT-REPORT-UPDATED (1).md` - Old audit
- `KOLLECT-IT-DESIGN-SYSTEM-REFERENCE-UPDATED (1).md` - Old reference
- `VISUAL-SPOT-CHECK-GUIDE (1).md` - Old guide

**Action:** Move to `archive/work_files_prompts/` or delete if already documented

### Scripts
- `deploy-fixed-files.ps1` - Deployment script (may be useful, keep in scripts/)

**Action:** Move to `scripts/maintenance/` if useful, or archive

---

## Phase 2: work_files/src Review

**Status:** Need to compare with main `src/` directory

**Action:** 
- Compare files systematically
- Identify any unique fixes or improvements
- Apply if needed, then delete work_files/src

---

## Phase 3: work_files/archive Review

**Structure:**
- `archive/backups/` - Old backup files
- `archive/docs/archive/` - Old documentation
- `archive/md-work-files/` - Old component files
- `archive/restored_docs/` - Restored documentation

**Action:**
- Move to main `archive/` directory if not already there
- Consolidate with existing archive structure

---

## Execution Plan

1. **Phase 1:** Review and verify root-level files
2. **Phase 2:** Compare work_files/src with main src
3. **Phase 3:** Move archive content to proper location
4. **Phase 4:** Apply any necessary fixes
5. **Phase 5:** Move documentation to proper locations
6. **Phase 6:** Delete work_files subdirectories after confirmation
