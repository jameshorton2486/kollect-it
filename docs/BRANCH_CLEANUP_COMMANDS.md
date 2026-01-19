# Branch Cleanup Commands

**Date:** January 19, 2026  
**Status:** ✅ **READY TO EXECUTE**

---

## Safe Cleanup Commands

All branches listed below have been verified as:
- ✅ Merged to main, OR
- ✅ PR closed (not merged), OR
- ✅ No longer needed

---

## Step 1: Delete Local Branches

```powershell
# Delete all stale local branches
git branch -D a
git branch -D chore/pre-hardening-sync
git branch -D chore/sync-local-changes
git branch -D fix/ci-stability-clean
git branch -D fix/core-invariants-and-env
git branch -D fix/homepage-images-contrast
git branch -D fix/typescript-production-errors
git branch -D lux-palette-docs-39246
```

**Or as a single command:**
```powershell
git branch -D a chore/pre-hardening-sync chore/sync-local-changes fix/ci-stability-clean fix/core-invariants-and-env fix/homepage-images-contrast fix/typescript-production-errors lux-palette-docs-39246
```

---

## Step 2: Delete Remote Branches

```powershell
# Delete all stale remote branches
git push origin --delete chore/pre-hardening-sync
git push origin --delete chore/sync-local-changes
git push origin --delete copilot/update-env-local-file
git push origin --delete fix/ci-stability-clean
git push origin --delete fix/core-invariants-and-env
git push origin --delete fix/homepage-images-contrast
git push origin --delete fix/typescript-production-errors
git push origin --delete lux-palette-docs-39246
```

**Or as a single command:**
```powershell
git push origin --delete chore/pre-hardening-sync chore/sync-local-changes copilot/update-env-local-file fix/ci-stability-clean fix/core-invariants-and-env fix/homepage-images-contrast fix/typescript-production-errors lux-palette-docs-39246
```

---

## Verification After Cleanup

```powershell
# Check local branches (should only show main)
git branch

# Check remote branches (should show main + codex/audit)
git branch -r

# Verify main is clean
git status
```

---

## Expected Results

### Before Cleanup
- **Local branches:** 9
- **Remote branches:** 11

### After Cleanup
- **Local branches:** 1 (main)
- **Remote branches:** 2 (main, codex/run-comprehensive-codebase-audit)

---

## Branches Being Deleted

### Local (8 branches)
1. `a` - Unknown single-letter branch
2. `chore/pre-hardening-sync` - PR #10 CLOSED
3. `chore/sync-local-changes` - PR #9 CLOSED
4. `fix/ci-stability-clean` - PR #12 MERGED
5. `fix/core-invariants-and-env` - PR #11 CLOSED
6. `fix/homepage-images-contrast` - PR #7 MERGED
7. `fix/typescript-production-errors` - Just merged
8. `lux-palette-docs-39246` - Merged (commit 25859f9)

### Remote (8 branches)
1. `origin/chore/pre-hardening-sync` - PR #10 CLOSED
2. `origin/chore/sync-local-changes` - PR #9 CLOSED
3. `origin/copilot/update-env-local-file` - PR #1 CLOSED
4. `origin/fix/ci-stability-clean` - PR #12 MERGED
5. `origin/fix/core-invariants-and-env` - PR #11 CLOSED
6. `origin/fix/homepage-images-contrast` - PR #7 MERGED
7. `origin/fix/typescript-production-errors` - Just merged
8. `origin/lux-palette-docs-39246` - Merged (commit 25859f9)

---

## Branches Being Kept

### Local
- ✅ `main` - Production branch

### Remote
- ✅ `origin/main` - Production branch
- ✅ `origin/codex/run-comprehensive-codebase-audit` - Reference only (PR #14 OPEN)

---

## Safety Notes

✅ **All deletions are safe:**
- All merged branches have their content in main
- All closed PRs were intentionally closed
- No active work will be lost

⚠️ **If you want to be extra cautious:**
- Run the commands one at a time
- Verify after each deletion
- Check `git log main` to confirm content is present

---

*Commands ready for execution on January 19, 2026*
