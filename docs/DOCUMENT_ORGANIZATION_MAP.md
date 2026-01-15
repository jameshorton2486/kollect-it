# Document Organization Map

**Status: REFERENCE ONLY** – This map documents the governance structure for organizing documentation within `/docs/`.

## 📁 Migration Plan

### ✅ Already Organized (Keep in `/docs/`)

These files are documented in their proper locations:
- `docs/README.md` – Single source of truth (main entry point)
- `docs/CONTRIBUTING.md` – Collaboration guidelines
- `docs/operations/README.md` – Operations procedures
- `docs/architecture/README.md` – System architecture
- `docs/marketplace/README.md` – Marketplace features
- `docs/design/README.md` – Design system
- `docs/seo/README.md` – SEO strategy
- `docs/integrations/README.md` – Third-party integrations
- `docs/qa/README.md` – QA procedures

### 📋 Existing Root Files to Organize

**Status: PENDING MIGRATION**

#### QA & Testing Documents

These belong in `docs/qa/` and `docs/checklists/`:

Root file → Target location
- `QA_TEST_CHECKLIST.md` → `docs/qa/QA_TEST_CHECKLIST.md`
- `QA_VERIFICATION_PLAN.md` → `docs/qa/QA_VERIFICATION_PLAN.md`
- `QA_VERIFICATION_REPORT.md` → `docs/qa/QA_VERIFICATION_REPORT.md`
- `QA_RISK_REGISTER.md` → `docs/qa/QA_RISK_REGISTER.md`

#### Deployment & Release Checklists

These belong in `docs/checklists/`:

- `PRODUCTION_DEPLOYMENT_CHECKLIST.md` → `docs/checklists/PRODUCTION_DEPLOYMENT_CHECKLIST.md`
- `PRODUCTION_DEPLOY_CHECKLIST.md` → `docs/checklists/PRODUCTION_DEPLOY_CHECKLIST.md`
- `RELEASE_READINESS_REPORT.md` → `docs/checklists/RELEASE_READINESS_REPORT.md`

#### Product & Project Checklists

These belong in `docs/checklists/`:

- `PRODUCT_POSTING_CHECKLIST.md` → `docs/checklists/PRODUCT_POSTING_CHECKLIST.md`
- `PRE_LAUNCH_IMPLEMENTATION_COMPLETE.md` → `docs/checklists/PRE_LAUNCH_IMPLEMENTATION_COMPLETE.md`
- `PRE_LAUNCH_IMPLEMENTATION_STATUS.md` → `docs/checklists/PRE_LAUNCH_IMPLEMENTATION_STATUS.md`

#### Security & Safety

These belong in `docs/operations/`:

- `PROJECT_SAFETY.md` → `docs/operations/PROJECT_SAFETY.md`

#### Verification & Post-Deployment

These belong in `docs/checklists/`:

- `VERIFICATION_MATRIX.md` → `docs/checklists/VERIFICATION_MATRIX.md`
- `POST_RENAME_VERIFICATION_CHECKLIST.md` → `docs/checklists/POST_RENAME_VERIFICATION_CHECKLIST.md`
- `PRE_RENAME_BACKUP_CHECKLIST.md` → `docs/checklists/PRE_RENAME_BACKUP_CHECKLIST.md`

#### Development Phase Documentation

These are historical records of development phases (can be archived):

- `PHASE2_CHANGES.md` → Archive or `docs/archive/`
- `PHASE2_UNRESOLVED.md` → Archive or `docs/archive/`
- `PHASE3_THREADING_REVIEW.md` → Archive or `docs/archive/`
- `PHASE4_ERROR_HANDLING.md` → Archive or `docs/archive/`
- `PHASE5_OUTPUT_VALIDATION.md` → Archive or `docs/archive/`
- `PHASES_COMPLETE_SUMMARY.md` → Archive or `docs/archive/`

---

## 🔧 Next Steps

To complete the migration:

1. **Root README.md** ✅ Already updated (minimal entry point)
2. **Move QA files** → Run `git mv` commands or copy to `docs/qa/`
3. **Move checklist files** → Copy to `docs/checklists/`
4. **Move safety file** → Copy to `docs/operations/PROJECT_SAFETY.md`
5. **Archive phase files** → Move to `archive/` folder
6. **Delete root .md files** → After moving, run `git rm` to remove from root
7. **Update links** → Anywhere pointing to root files, update to `/docs/` paths

---

## 🚫 Prevention Going Forward

The `.gitignore` now blocks:

```
*_notes.md
*_draft.md
*_scratch.md
*_debug.md
*_temp.md
TEMP_*.md
DEBUG_*.md
```

**Governance Rule:** All markdown documentation MUST go in `/docs/` or be added to `.gitignore`.

---

**Last Updated:** January 2026
**Status:** Migration guidance provided
