# Git Quick Start Guide

**For:** Kollect-It Repository
**Repository:** <https://github.com/jameshorton2486/kollect-it>

---

## 🚀 Quick Commands

### Commit and Push Current Changes

```bash
# 1. Stage all changes
git add .

# 2. Commit with message
git commit -m "fix: update email addresses to info@kollect-it.com and fix BOM character

- Updated all email references from james@kollect-it.com to info@kollect-it.com
- Fixed BOM character in email settings page causing build failures
- Added environment variable management scripts
- Added comprehensive documentation for email and env var setup"

# 3. Push to GitHub
git push origin main
```

### Using Cursor AI Shortcuts

Just type in Cursor chat:

- `@git-deploy` - Stage, commit, and push all changes
- `@git-save` - Stage and commit (local only)
- `@git-status` - Check current status

### Using PowerShell Script

```powershell
# Interactive (will prompt for confirmations)
.\scripts\github-sync.ps1

# Quick commit and push (skip confirmations)
.\scripts\github-sync.ps1 -Message "fix: update emails" -Force

# Or double-click: Sync-To-GitHub.bat
```

---

## 📋 Current Changes Summary

**Modified Files (19):**

- Email addresses updated across all pages
- Email service simplified
- BOM character fixed
- Documentation added

**New Files (17):**

- Environment variable scripts
- Documentation files
- Test files (now in .gitignore)

---

## ✅ Pre-Commit Checks

Your repository has automatic checks that run before commits:

1. ✅ No root-level markdown files (except README.md)
2. ✅ No scratch/temp files
3. ✅ No forbidden folders (`.next/`, `.vercel/`, etc.)
4. ✅ No merge conflict markers

---

## 🔒 GitHub Protection

**Active Workflows:**

- ✅ Domain Guardrails (blocks raw images, enforces SKU rules)
- ✅ Repo Guard (blocks forbidden folders)

**Triggers:** All pushes and pull requests to `main`

---

## 📝 Commit Message Format

Use **Conventional Commits**:

```
feat: add new feature
fix: bug fix
docs: documentation update
chore: maintenance task
refactor: code restructuring
```

**Example:**

```bash
git commit -m "fix: update email addresses and fix BOM character"
```

---

## 🎯 Ready to Commit?

Your changes are ready! Run:

```bash
git add .
git commit -m "fix: update email addresses to info@kollect-it.com and fix BOM character"
git push origin main
```

Or use: `@git-deploy` in Cursor chat!
