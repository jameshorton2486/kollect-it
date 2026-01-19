# Branch Audit Report

**Date:** January 19, 2026  
**Status:** 🔍 **AUDIT COMPLETE - CLEANUP RECOMMENDED**

---

## Summary

**Local Branches:** 9  
**Remote Branches:** 11  
**Open PRs:** 1 (reference only)  
**Merged PRs:** 7  
**Closed PRs:** 6  

---

## Local Branch Analysis

| Branch | Status | Action | Reason |
|--------|--------|--------|--------|
| `main` | ✅ Current | **KEEP** | Production branch |
| `a` | ⚠️ Unknown | **DELETE** | Single-letter branch, no clear purpose |
| `chore/pre-hardening-sync` | 🔴 Stale | **DELETE** | PR #10 CLOSED, not merged |
| `chore/sync-local-changes` | 🔴 Behind | **DELETE** | PR #9 CLOSED, local behind by 10 commits |
| `fix/ci-stability-clean` | ✅ Merged | **DELETE** | PR #12 MERGED to main |
| `fix/core-invariants-and-env` | 🔴 Closed | **DELETE** | PR #11 CLOSED (not merged) |
| `fix/homepage-images-contrast` | ✅ Merged | **DELETE** | PR #7 MERGED to main |
| `fix/typescript-production-errors` | ✅ Merged | **DELETE** | Just merged to main |
| `lux-palette-docs-39246` | ✅ Merged | **DELETE** | Merged to main (commit 25859f9) |

---

## Remote Branch Analysis

| Branch | PR Status | Action | Reason |
|--------|-----------|--------|--------|
| `origin/main` | ✅ | **KEEP** | Production branch |
| `origin/chore/pre-hardening-sync` | 🔴 CLOSED | **DELETE** | PR #10 closed, not merged |
| `origin/chore/sync-local-changes` | 🔴 CLOSED | **DELETE** | PR #9 closed, content merged via other PRs |
| `origin/codex/run-comprehensive-codebase-audit` | 🟡 OPEN #14 | **KEEP** | Reference-only, marked as review-only |
| `origin/copilot/update-env-local-file` | 🔴 CLOSED | **DELETE** | PR #1 closed, old WIP |
| `origin/fix/ci-stability-clean` | ✅ MERGED #12 | **DELETE** | Merged to main |
| `origin/fix/core-invariants-and-env` | 🔴 CLOSED #11 | **DELETE** | Closed, not merged |
| `origin/fix/homepage-images-contrast` | ✅ MERGED #7 | **DELETE** | Merged to main |
| `origin/fix/typescript-production-errors` | ✅ Merged | **DELETE** | Just merged to main |
| `origin/lux-palette-docs-39246` | ✅ Merged | **DELETE** | Merged to main (commit 25859f9) |

---

## Pull Request Status

### Open PRs (1)
- **PR #14:** `codex/run-comprehensive-codebase-audit` → **KEEP OPEN** (reference only)

### Merged PRs (7)
- ✅ PR #12: `fix/ci-stability-clean` → Merged
- ✅ PR #7: `fix/homepage-images-contrast` → Merged
- ✅ PR #6: `fix/homepage-images-contrast` → Merged (duplicate?)
- ✅ PR #5: `cleanup/security-fix` → Merged
- ✅ PR #4: `cleanup/security-fix` → Merged
- ✅ PR #13: `fix/guardrails-doc-exclusion` → Merged
- ✅ PR #2: `cleanup/repo-size-reduction` → Merged

### Closed PRs (6)
- 🔴 PR #11: `fix/core-invariants-and-env` → Closed (not merged)
- 🔴 PR #10: `chore/pre-hardening-sync` → Closed
- 🔴 PR #9: `chore/sync-local-changes` → Closed
- 🔴 PR #8: `fix/admin-email-dynamic` → Closed
- 🔴 PR #3: `chore/standardize-anthropic-api-key` → Closed
- 🔴 PR #1: `copilot/update-env-local-file` → Closed (WIP)

---

## Cleanup Recommendations

### High Priority (Safe to Delete)

**Local Branches:**
```bash
git branch -D a
git branch -D chore/pre-hardening-sync
git branch -D chore/sync-local-changes
git branch -D fix/ci-stability-clean
git branch -D fix/core-invariants-and-env
git branch -D fix/homepage-images-contrast
git branch -D fix/typescript-production-errors
```

**Remote Branches:**
```bash
git push origin --delete chore/pre-hardening-sync
git push origin --delete chore/sync-local-changes
git push origin --delete copilot/update-env-local-file
git push origin --delete fix/ci-stability-clean
git push origin --delete fix/core-invariants-and-env
git push origin --delete fix/homepage-images-contrast
git push origin --delete fix/typescript-production-errors
```

### ✅ Verified: `lux-palette-docs-39246`
- **Status:** Merged to main (commit `25859f9`)
- **Action:** Safe to delete both local and remote

---

## Branch Status Details

### Behind/Ahead Status

| Branch | Tracking | Status |
|--------|----------|--------|
| `main` | `origin/main` | ✅ Up to date |
| `chore/sync-local-changes` | `origin/chore/sync-local-changes` | 🔴 Behind 10 commits |
| `fix/core-invariants-and-env` | `origin/fix/core-invariants-and-env` | ✅ In sync |
| `fix/homepage-images-contrast` | `origin/fix/homepage-images-contrast` | ✅ In sync |
| `lux-palette-docs-39246` | `origin/lux-palette-docs-39246` | ✅ In sync |

### Orphan Branches (No Upstream)

- `a` - No tracking branch
- `chore/pre-hardening-sync` - No tracking branch
- `fix/ci-stability-clean` - No tracking branch
- `fix/typescript-production-errors` - No tracking branch

---

## Action Plan

### Step 1: Delete Local Branches (Safe)
```bash
git branch -D a chore/pre-hardening-sync chore/sync-local-changes \
  fix/ci-stability-clean fix/core-invariants-and-env \
  fix/homepage-images-contrast fix/typescript-production-errors \
  lux-palette-docs-39246
```

### Step 2: Delete Remote Branches (Safe)
```bash
git push origin --delete chore/pre-hardening-sync \
  chore/sync-local-changes copilot/update-env-local-file \
  fix/ci-stability-clean fix/core-invariants-and-env \
  fix/homepage-images-contrast fix/typescript-production-errors \
  lux-palette-docs-39246
```

---

## Expected Result After Cleanup

**Local Branches:** 2 (main + lux-palette if kept)  
**Remote Branches:** 3 (main + codex/audit + lux-palette if kept)  
**Open PRs:** 1 (codex/run-comprehensive-codebase-audit - reference only)

---

## Safety Notes

✅ **Safe to Delete:**
- All branches with CLOSED PRs
- All branches with MERGED PRs
- The `a` branch (unknown purpose)

✅ **Verified & Safe to Delete:**
- `lux-palette-docs-39246` - Merged to main (commit 25859f9)

🟡 **Keep:**
- `origin/codex/run-comprehensive-codebase-audit` - Reference only (PR #14)

---

*Report generated: January 19, 2026*
