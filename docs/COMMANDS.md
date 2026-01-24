# Git Commands Quick Reference

> **Type these in Cursor AI chat (Ctrl+L)**

## Most Used

| Type This | What Happens |
|-----------|--------------|
| `@git-deploy` | Commit + push to current branch |
| `@git-deploy-vercel` | Commit + push + deploy to Vercel |
| `@git-pr` | Commit + push + create Pull Request |
| `@git-save` | Just commit (no push) |

## Branch Management

| Type This | What Happens |
|-----------|--------------|
| `@git-feature [name]` | Create new feature branch |
| `@git-sync` | Sync with main branch |
| `@git-status` | Show git status summary |

## Undo / Fix

| Type This | What Happens |
|-----------|--------------|
| `@git-undo` | Undo last commit (keep changes) |
| `@git-stash` | Stash current changes |
| `@git-clean` | ⚠️ Discard all changes |

---

## Examples

```
# Deploy your work
@git-deploy

# Create a PR for review  
@git-pr

# Start a new feature
@git-feature add-user-reviews

# Deploy to production
@git-deploy-vercel
```

---

**Full documentation:** See `docs/GIT_WORKFLOW_COMMANDS.md`
