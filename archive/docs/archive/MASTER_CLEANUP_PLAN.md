# 🧹 MASTER CLEANUP PLAN - KOLLECT-IT PROJECT

## Overview
This document outlines the systematic cleanup of the Kollect-It codebase to remove duplicates, fix colors, and consolidate structure.

**Date:** Generated
**Status:** Ready for Execution

---

## ✅ HIGH-PRIORITY CLEANUP (Execute First)

### 1️⃣ BACKUP FOLDERS CONSOLIDATION

**Current State:**
- `backup-phase1-20251125-100434/` - Contains 3 backup files
- `design-backups/20251125-095246/` - Contains old design files
- `archive/` - Already exists with archived docs

**Action:**
- Move `backup-phase1-20251125-100434/` → `_archive/backups/`
- Move `design-backups/` → `_archive/design-backups/`
- Keep `archive/` for documentation (already there)

**Status:** ⚠️ Ready to execute

---

### 2️⃣ GLOBALS.CSS VERIFICATION

**Current State:**
- ✅ `src/app/globals.css` - **ACTIVE** (keep this)
- ❌ `design-backups/20251125-095246/globals.css` - Archive
- ❌ `backup-phase1-20251125-100434/src_app_globals.css` - Archive

**Action:**
- Verify `src/app/globals.css` is the only active version
- Move others to `_archive/` (already handled in step 1)

**Status:** ✅ Only one active file exists

---

### 3️⃣ COLOR CLEANUP STATUS

**Email Templates (KEEP AS IS):**
- ✅ Email templates in `src/emails/` use hex colors - **CORRECT** (needed for Outlook)
- Colors like `#B1874C`, `#c9a961`, `#f6f0ee` are intentional for email compatibility

**Admin Components:**
- ✅ Already fixed in previous refactor
- All use official gold palette

**UI Components:**
- Need to verify no remaining bad colors in:
  - `src/components/` (non-admin)
  - `src/app/` pages

**Status:** ⚠️ Need final verification scan

---

### 4️⃣ ROUTING STRUCTURE

**Current State:**
- `/sell` → Redirects to `/consign`
- `/consign` → Active page

**Action:**
- ✅ `/sell` is just a redirect - this is fine
- No cleanup needed

**Status:** ✅ Correct structure

---

### 5️⃣ REPORT SENDER EMAIL TEMPLATE

**Current State:**
- ✅ Already fixed - uses gold gradient: `linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)`
- ✅ Uses hex colors for email compatibility

**Status:** ✅ Already correct

---

## 📋 MEDIUM-PRIORITY CLEANUP

### 6️⃣ INLINE STYLES CHECK

**Files to Review:**
- Components with mixed inline styles + Tailwind
- Need to identify and convert

**Status:** ⚠️ Needs scan

---

### 7️⃣ UNUSED FILES

**Potential Candidates:**
- `MD Work Files/` - May contain old work files
- Old scripts in root

**Status:** ⚠️ Needs review

---

## 🎯 CLEANUP EXECUTION ORDER

1. **Move backup folders to `_archive/`**
2. **Verify globals.css structure**
3. **Final color scan (excluding emails)**
4. **Create completion report**

---

## 📊 EXPECTED OUTCOMES

After cleanup:
- ✅ Single `_archive/` folder for all backups
- ✅ Only one active `globals.css`
- ✅ All UI code uses proper color tokens
- ✅ Email templates retain hex colors (for Outlook)
- ✅ Clean, organized structure

---

**Ready to execute cleanup procedures!**
