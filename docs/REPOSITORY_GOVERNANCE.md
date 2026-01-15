# 🏛️ Kollect-It Repository Governance

**Cursor / VS Code AI — Master Prompt (WordPress-Free)**

---

## 🎯 Objective

Apply professional repository hygiene, structure discipline, and AI guardrails to the Kollect-It codebase.

This prompt governs:
- Repository structure
- Documentation placement
- AI behavior
- Collaboration standards
- Long-term scalability

**This prompt does NOT assume or reference:**
- WordPress
- CMS templates
- Page builders
- Theme systems

Kollect-It is treated as a custom software product and marketplace platform, not a CMS site.

---

## 📁 Required Repository Structure (Strict)

```
kollect-it/
├── app/                    # Application routes / pages
├── components/             # Reusable UI components
├── lib/                    # Core logic, domain services, helpers
├── styles/                 # Global styling system
├── public/                 # Static assets
├── scripts/                # Automation, maintenance, migrations
├── docs/                   # ALL documentation (mandatory)
│   ├── README.md
│   ├── architecture/
│   ├── domain/
│   ├── marketplace/
│   ├── seo/
│   ├── images/
│   ├── operations/
│   └── decisions/
├── tests/
├── .github/
├── .env.example
├── package.json
└── README.md               # Minimal entry point only
```

⚠️ **No additional top-level folders may be created without explicit approval.**

---

## 📘 Documentation Rules (Non-Negotiable)

### 1️⃣ Root README.md (Intentionally Thin)

The root `README.md` must contain **ONLY**:
- Project name
- One-paragraph description
- Link to `docs/README.md`

❌ **No architecture**  
❌ **No setup guides**  
❌ **No design notes**  
❌ **No roadmaps**

### 2️⃣ docs/README.md (Single Source of Truth)

Create and maintain `docs/README.md` with:
- Auto-linked Table of Contents
- Links to all documentation sections
- Clear navigation hierarchy

**All documentation must live under `/docs`.**

---

## 🚫 Absolute Prohibitions

### ❌ Root-Level Markdown Files

AI must **never** create `.md` files in the repository root (except the thin `README.md`).

**If documentation is requested → it goes in `/docs`.**

### ❌ Scratch / Temporary Files

AI must not generate or commit:
- Planning notes
- Debug documents
- Scratch markdown
- Temporary scripts
- Experimental files
- One-off utilities without approval

---

## 🛡️ .gitignore Enforcement

Ensure `.gitignore` blocks:

```gitignore
# OS / Editor
.DS_Store
Thumbs.db
.idea/
.vscode/

# Logs & temp
*.log
*.tmp

# AI scratch
*_notes.md
*_draft.md
*_scratch.md

# Environment
.env
.env.local
.env.production
```

---

## 🤖 AI Behavior Rules (Hard Constraints)

When operating in this repository, the AI must:

- ✅ Ask before introducing new directories
- ✅ Never invent architecture
- ✅ Reuse existing patterns
- ✅ Prefer refactors over rewrites
- ✅ Keep commits small and intentional
- ✅ Never leave commented-out code
- ✅ Never bypass linting, typing, or formatting rules
- ✅ Never commit unused or speculative code

---

## 🧭 Kollect-It Domain Rules

Kollect-It is a **curated collectibles & antiques marketplace**, not a generic store.

AI must respect:
- Strong domain boundaries
- SKU discipline
- Stable category taxonomy
- Image processing pipelines
- Provenance & condition accuracy
- SEO-friendly but data-driven content
- Seller and buyer trust mechanics

**No assumptions about:**
- CMS workflows
- Page builders
- Manual content editing
- Theme-based layouts

---

## 🤝 Contribution Standards

Create `/docs/CONTRIBUTING.md` enforcing:
- Folder discipline
- Documentation placement rules
- Commit message standards

**PR checklist:**
- ✅ No root clutter
- ✅ No unused files
- ✅ Docs updated when behavior changes
- ✅ No speculative or "future" code

---

## 🧠 Required AI Self-Check (Before Responding)

Before proposing or applying changes, the AI must internally verify:

1. ✅ Does this add files?
   - Are they in the correct directory?
2. ✅ Does this duplicate existing logic?
3. ✅ Does this belong in `/docs`?
4. ✅ Is this aligned with Kollect-It's marketplace domain?

**If any uncertainty exists → ASK FIRST**

---

## 📋 Quick Reference

| Action | Location |
|--------|----------|
| Documentation | `/docs` |
| Architecture docs | `/docs/architecture/` |
| Domain logic | `/docs/domain/` |
| Marketplace features | `/docs/marketplace/` |
| Operations guides | `/docs/operations/` |
| SEO documentation | `/docs/seo/` |
| Setup instructions | `/docs/README.md` |
| Root README | `/README.md` (thin, links to docs) |

---

**Last Updated:** December 2024  
**Version:** 1.0
