# 🧹 Kollect-It Repository Cleanup Checklist

Use this checklist **once now**, then **quarterly** to maintain repository hygiene.

**Last Audit:** _______________  
**Next Audit Due:** _______________

---

## 🧹 Root Directory

- [ ] Only one `README.md` exists (minimal, links to `/docs`)
- [ ] No extra `.md` files in root (move to `/docs` if needed)
- [ ] No temp scripts in root (move to `/scripts` or delete)
- [ ] No unused config files
- [ ] No planning/scratch markdown files

**Files to Review:**
- `PRODUCTION_DEPLOY_CHECKLIST.md` → Move to `docs/checklists/`
- `PHASES_COMPLETE_SUMMARY.md` → Move to `docs/decisions/` or archive
- Any other root-level `.md` files → Move to appropriate `/docs` subfolder

---

## 📁 Documentation (`/docs`)

- [ ] All markdown lives under `/docs`
- [ ] `docs/README.md` exists and links all sections
- [ ] No duplicate documentation
- [ ] No outdated docs (check dates, remove obsolete content)
- [ ] Decisions are logged in `/docs/decisions/` (not lost in chat)
- [ ] Architecture docs are current
- [ ] Domain rules are documented

**Structure Check:**
```
docs/
├── README.md ✅
├── architecture/ ✅
├── domain/ ✅
├── marketplace/ ✅
├── images/ ✅
├── seo/ ✅
├── operations/ ✅
├── decisions/ ✅
└── CONTRIBUTING.md ✅
```

---

## 🧠 Code Quality

- [ ] No commented-out code (search for `// TODO`, `// REMOVE`, `// TEMP`)
- [ ] No unused exports (run `bun run lint` to check)
- [ ] No duplicate domain logic (check `/lib` for duplicates)
- [ ] Shared logic lives in `/lib` (not duplicated in components)
- [ ] One concern per file
- [ ] Files have descriptive names (not generic `utils.ts`)

**Commands to Run:**
```bash
# Check for unused code
bun run lint

# Search for commented code
grep -r "// TODO\|// REMOVE\|// TEMP" src/

# Check for duplicate logic
# Review /lib directory structure
```

---

## 🧪 Scripts (`/scripts`)

- [ ] Scripts are documented (comments or README)
- [ ] No experimental scripts committed
- [ ] Naming is explicit and intentional
- [ ] Scripts have clear purpose
- [ ] No one-off utilities without approval

**Review:**
- List all files in `/scripts`
- Verify each has a clear purpose
- Document or remove unclear scripts

---

## 🧾 Git Hygiene

- [ ] `.gitignore` blocks env, logs, scratch files
- [ ] Commits are small and descriptive
- [ ] No accidental editor or OS files committed
- [ ] No `.env` files in history
- [ ] No large binary files committed

**Check:**
```bash
# Verify .gitignore is working
git status --ignored

# Check for large files
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | awk '/^blob/ {print substr($0,6)}' | sort --numeric-sort --key=2 | tail -10
```

---

## 📋 Documentation Structure Audit

### Required Folders (Create if missing):

- [ ] `docs/architecture/` - System design, data models, API contracts
- [ ] `docs/domain/` - Categories, SKU standards, condition grading
- [ ] `docs/marketplace/` - Seller/buyer workflows, listing lifecycle
- [ ] `docs/images/` - Image requirements, processing pipeline
- [ ] `docs/seo/` - Metadata standards, structured data
- [ ] `docs/operations/` - Environments, deployments, backups
- [ ] `docs/decisions/` - Architecture Decision Records (ADRs)

### Required Files (Create if missing):

- [ ] `docs/README.md` - Main documentation index with TOC
- [ ] `docs/CONTRIBUTING.md` - Contribution guidelines
- [ ] `docs/REPOSITORY_GOVERNANCE.md` - Governance rules
- [ ] `docs/decisions/ADR-0001-repo-structure.md`
- [ ] `docs/decisions/ADR-0002-image-pipeline.md`
- [ ] `docs/decisions/ADR-0003-sku-format.md`

---

## 🔍 Pre-Commit Hook Verification

- [ ] `.husky/pre-commit` exists and is executable
- [ ] Hook blocks root-level markdown files
- [ ] Hook blocks scratch/temp files
- [ ] Hook warns about commented code
- [ ] Test the hook: `git add test.md` (should fail)

**Test:**
```bash
# Make hook executable
chmod +x .husky/pre-commit

# Test with a dummy root markdown
echo "# Test" > test.md
git add test.md
# Should fail with error
git reset test.md
rm test.md
```

---

## ✅ Final Sign-Off

- [ ] All root-level `.md` files moved to `/docs`
- [ ] All scratch/temp files removed or moved
- [ ] Documentation structure is complete
- [ ] Pre-commit hook is working
- [ ] Code quality checks pass
- [ ] Git history is clean

**Auditor:** _______________  
**Date:** _______________  
**Notes:** _______________

---

**Next Audit Due:** _______________ (3 months from today)
