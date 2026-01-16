# Repository Cleanup Commit Plan

**Date:** December 2024  
**Purpose:** Safely clean historical clutter without losing information or breaking builds  
**Strategy:** Small, reversible commits with verification at each phase

---

## 🎯 Principles

- ✅ Small, focused commits
- ✅ Reversible at any point
- ✅ No history rewriting
- ✅ No force-push
- ✅ Verify after each phase

---

## 📋 Phase 1 — Non-Destructive Documentation Moves

### Commit 1: `docs(operations): relocate phase and checklist documentation`

**Actions:**
- Move root-level phase files → `docs/operations/phases/`
- Move root-level checklist files → `docs/operations/checklists/`
- Move deployment docs → `docs/operations/releases/`
- Move PROJECT_SAFETY.md → `docs/operations/`

**Files Affected:**
- PHASE*.md → `docs/operations/phases/`
- *CHECKLIST.md → `docs/operations/checklists/`
- PRODUCTION_DEPLOYMENT_CHECKLIST.md → `docs/operations/releases/`
- PROJECT_SAFETY.md → `docs/operations/`

**Verification:**
```bash
# Verify no root markdown files remain (except README.md)
git status --short | grep "\.md$" | grep -v "^docs/" | grep -v "README.md"

# Verify files moved correctly
ls docs/operations/phases/
ls docs/operations/checklists/
```

**Rollback:**
```bash
git revert HEAD
# Or manually move files back
```

---

## 📋 Phase 2 — Script Hygiene

### Commit 2: `chore(scripts): organize maintenance scripts`

**Actions:**
- Move root-level `.ps1` files → `scripts/maintenance/`
- Create `scripts/README.md` with documentation
- Add descriptions for each script

**Files Affected:**
- `EMERGENCY-REMOVE-CREDENTIALS-FROM-HISTORY.ps1` → `scripts/maintenance/`
- `Fix-Footer-Colors.ps1` → `scripts/maintenance/`
- `Fix-ProductCard-Colors.ps1` → `scripts/maintenance/`
- `commit-and-push.ps1` → `scripts/maintenance/`

**Verification:**
```bash
# Verify no root PowerShell scripts remain
git status --short | grep "\.ps1$" | grep -v "^scripts/"

# Verify scripts directory structure
ls scripts/maintenance/
cat scripts/README.md
```

**Rollback:**
```bash
git revert HEAD
```

---

## 📋 Phase 3 — Governance Lock-In

### Commit 3: `docs(governance): add repository governance and security ADR`

**Actions:**
- Add `docs/REPOSITORY_GOVERNANCE.md`
- Add `docs/REPOSITORY_CLEANUP_CHECKLIST.md`
- Add `docs/decisions/ADR-0004-credential-handling.md`
- Add `docs/operations/security.md`
- Update `docs/README.md` with new sections
- Create minimal root `README.md`

**Files Created:**
- `docs/REPOSITORY_GOVERNANCE.md`
- `docs/REPOSITORY_CLEANUP_CHECKLIST.md`
- `docs/decisions/ADR-0004-credential-handling.md`
- `docs/operations/security.md`
- Updated `docs/README.md`
- Updated root `README.md`

**Verification:**
```bash
# Verify governance docs exist
ls docs/REPOSITORY_GOVERNANCE.md
ls docs/decisions/ADR-0004-credential-handling.md

# Verify root README is minimal
wc -l README.md  # Should be < 15 lines
```

**Rollback:**
```bash
git revert HEAD
```

---

## 📋 Phase 4 — Pre-Commit Hook & Cursor Rules

### Commit 4: `chore(governance): add pre-commit hook and Cursor rules`

**Actions:**
- Add `.cursor/rules/kollect-it-repo-governance.mdc`
- Update `.husky/pre-commit` with governance checks
- Update `.gitignore` with scratch file patterns

**Files Modified:**
- `.husky/pre-commit` (enhanced)
- `.gitignore` (scratch patterns)
- `.cursor/rules/kollect-it-repo-governance.mdc` (new)

**Verification:**
```bash
# Test pre-commit hook
echo "# Test" > test.md
git add test.md
git commit -m "test"  # Should fail
git reset test.md
rm test.md

# Verify hook is executable
ls -la .husky/pre-commit
```

**Rollback:**
```bash
git revert HEAD
```

---

## 📋 Phase 5 — Documentation Structure

### Commit 5: `docs(structure): create domain and image documentation`

**Actions:**
- Create `docs/domain/` with category, SKU, condition, provenance docs
- Create `docs/images/` with requirements, pipeline, CDN docs
- Create `docs/decisions/` with ADR-0001, ADR-0002, ADR-0003
- Update `docs/README.md` with navigation

**Files Created:**
- `docs/domain/categories.md`
- `docs/domain/sku-standards.md`
- `docs/domain/condition-grading.md`
- `docs/domain/provenance.md`
- `docs/images/image-requirements.md`
- `docs/images/processing-pipeline.md`
- `docs/images/cdn-strategy.md`
- `docs/decisions/ADR-0001-repo-structure.md`
- `docs/decisions/ADR-0002-image-pipeline.md`
- `docs/decisions/ADR-0003-sku-format.md`

**Verification:**
```bash
# Verify structure
ls docs/domain/
ls docs/images/
ls docs/decisions/

# Verify docs/README.md has links
grep -i "domain\|images\|decisions" docs/README.md
```

**Rollback:**
```bash
git revert HEAD
```

---

## 📋 Phase 6 — Final Verification

### Commit 6: `chore(repo): verify repository governance compliance`

**Actions:**
- Run cleanup checklist
- Verify no root markdown (except README.md)
- Verify pre-commit hook works
- Verify documentation structure complete
- Create `docs/operations/CLEANUP_SUMMARY.md`

**Verification Commands:**
```bash
# Root directory check
ls *.md  # Should only show README.md

# Root scripts check
ls *.ps1  # Should show nothing

# Pre-commit hook test
echo "# Test" > test.md
git add test.md
git commit -m "test"  # Should fail
git reset test.md
rm test.md

# Documentation structure
ls docs/operations/phases/
ls docs/operations/checklists/
ls scripts/maintenance/
```

**Final Status:**
- ✅ Root directory clean
- ✅ Documentation organized
- ✅ Scripts organized
- ✅ Governance enforced
- ✅ Pre-commit hook active

---

## 🚫 DO NOT

- ❌ Rewrite git history
- ❌ Squash commits
- ❌ Combine cleanup with refactors
- ❌ Fix image pipeline in this cleanup
- ❌ Refactor `/lib` during cleanup
- ❌ Force-push to main branch

---

## 🔄 Rollback Strategy

If any phase fails:

1. **Immediate:** `git revert HEAD` (reverts last commit)
2. **Selective:** `git revert <commit-hash>` (reverts specific commit)
3. **Full:** `git reset --hard <before-cleanup-commit>` (nuclear option)

**Before starting cleanup:**
```bash
# Create safety branch
git checkout -b cleanup/repo-organization
git push origin cleanup/repo-organization

# Tag current state
git tag before-cleanup
git push origin before-cleanup
```

---

## ✅ Success Criteria

After all phases:

- [ ] Root directory contains only README.md and config files
- [ ] All documentation under `/docs`
- [ ] All scripts under `/scripts`
- [ ] Pre-commit hook blocks violations
- [ ] Documentation structure complete
- [ ] No broken links
- [ ] Build still passes
- [ ] Tests still pass

---

## 📝 Post-Cleanup

1. **Review moved files** - Archive obsolete docs if needed
2. **Update any broken links** - Search codebase for references
3. **Document lessons learned** - Update cleanup checklist
4. **Schedule quarterly review** - Use `docs/REPOSITORY_CLEANUP_CHECKLIST.md`

---

**Last Updated:** December 2024
