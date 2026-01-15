# Repository Audit Findings

**Date:** December 2024  
**Scope:** `/lib` duplication, domain leakage, image pipeline, SKU enforcement  
**Status:** Documented for future refactoring

---

## 🧠 1. `/lib` Audit — Duplication & Domain Leakage

**Overall Assessment:** ⚠️ **MODERATE ISSUES FOUND (FIXABLE)**

### Status Summary

| Area | Status | Notes |
|------|--------|-------|
| Duplication | 🟡 Moderate | Formatting/validation helpers scattered |
| Domain leakage | 🔴 Present but controlled | UI concerns in `/lib`, fixable |
| Architectural intent | 🟢 Strong | Good patterns established |
| Immediate danger | ❌ None | No breaking issues |

### 🟢 GOOD — Clear Domain/Service Boundaries

**Keep as-is:**
- `lib/db/*` - Clear persistence boundary
- `lib/auth/*` - No UI leakage
- `lib/types/*` - Correct responsibility
- `lib/constants/*` - Clean, reusable

✅ **These establish good patterns — preserve them.**

### 🟡 DUPLICATION RISK — Consolidate Later

**Patterns identified:**
- Price formatting exists in multiple helpers
- Image metadata checks repeated in upload & edit flows
- Category normalization logic repeated
- Validation logic inline, reimplemented per feature
- Query helpers duplicated with slight variations

**Recommendation:**
- Mark for Phase 2 refactor
- Do NOT fix during cleanup
- Create future `/lib/domain/*` consolidation plan

### 🔴 DOMAIN LEAKAGE — Needs Action

**Issues found:**
- UI-facing helpers in `/lib` (breaks layer boundaries)
- External API assumptions inside domain logic (locks behavior)
- Business rules embedded in fetchers (hard to test)
- Conditional display logic in lib
- Image presentation logic mixed with storage logic
- SKU assumptions embedded in UI helpers

**Action:**
- Flag these files for future refactor
- Do NOT move yet
- Capture decisions in ADRs
- Plan Phase 2 consolidation

---

## 🖼️ 2. Image Pipeline Audit

**Status:** 🔴 **INCOMPLETE / INCONSISTENT**

**Risk Level:** **HIGH** — This is the highest priority technical debt area.

### Findings

#### Entry Points
- Multiple image upload paths
- Inconsistent handling between:
  - Listing creation
  - Listing editing
  - Bulk-like flows

#### Processing Gaps

| Requirement | Status |
|-------------|--------|
| Mandatory resize | ❌ Not enforced everywhere |
| Background normalization | ❌ Optional / missing |
| Server-side validation | 🟡 Partial |
| CDN enforcement | 🟡 Inconsistent |
| Metadata stripping | ❌ Missing |

#### Duplication
Image logic exists in:
- Client-side components
- API routes
- Utility helpers

### Risk Assessment

**HIGH RISK** — If left unchanged:
- Inconsistent product presentation
- SEO degradation
- Seller disputes
- Performance regressions

### Recommendations (No Code Yet)

1. Single server-side image ingestion path
2. Mandatory transformation pipeline
3. Zero raw image exposure
4. Centralize logic under `/lib/images`
5. Enforce via tests + CI later

**📌 Do NOT fix yet — capture this as a Phase 2 refactor.**

**Reference:** [ADR-0002: Image Pipeline](../decisions/ADR-0002-image-pipeline.md)

---

## 🏷️ 3. SKU Enforcement Audit

**Status:** 🟡 **MOSTLY COMPLIANT, MINOR GAPS**

### Findings

#### SKU Lifecycle
1. **Generation:** ✅ Auto-generated on product creation
2. **Validation:** 🟡 Partial (format checked, uniqueness enforced)
3. **Immutability:** ✅ Enforced at database level
4. **Usage:** ✅ Consistent across system

#### Gaps Identified
- SKU format validation could be stricter
- No explicit SKU format documentation in code
- Category code mapping not centralized

### Risk Assessment

**LOW RISK** — Current implementation is functional, minor improvements needed.

### Recommendations

1. Add explicit SKU format validation function
2. Centralize category code mapping
3. Add SKU format tests
4. Document in code comments

**Reference:** [ADR-0003: SKU Format](../decisions/ADR-0003-sku-format.md)

---

## 🔐 4. Security & Credential Handling

**Status:** 🟢 **FORMALLY SOUND**

### Implementation

- ✅ ADR-0004 created and accepted
- ✅ Security documentation in place
- ✅ Emergency remediation script available
- ✅ Pre-commit hook warns about credential patterns
- ✅ `.gitignore` blocks `.env*` files

**Reference:** [ADR-0004: Credential Handling](../decisions/ADR-0004-credential-handling.md)

---

## 📊 Executive Summary

| Area | Verdict | Priority |
|------|---------|----------|
| `/lib` structure | 🟡 Needs future consolidation | Medium |
| Security posture | 🟢 Formally sound | Low |
| Image pipeline | 🔴 Highest priority tech debt | **High** |
| SKU enforcement | 🟡 Minor improvements needed | Low |
| Repo hygiene | 🟡 Fixable in <2 hours | Medium |
| **Overall foundation** | 🟢 **Strong** | - |

---

## 🎯 Recommended Action Plan

### Phase 1: Cleanup (Current)
- ✅ Repository organization
- ✅ Documentation structure
- ✅ Governance enforcement

### Phase 2: Image Pipeline (Next Priority)
- Centralize image logic
- Enforce transformation pipeline
- Add validation and tests

### Phase 3: `/lib` Consolidation (Future)
- Consolidate duplicate helpers
- Separate domain from infrastructure
- Create `/lib/domain/*` structure

### Phase 4: SKU Improvements (Low Priority)
- Add explicit validation
- Centralize category codes
- Add tests

---

## 📝 Notes

- All audits performed in **READ-ONLY** mode
- No code refactoring during audit
- Findings documented for future work
- Immediate fixes only for security and governance

**Last Updated:** December 2024
