# Git Workflow Commands for Cursor AI

> **How to use:** Open Cursor chat (Ctrl+L) and type any command below.
> Example: `@git-deploy` or just paste the command name.

---

## Quick Commands Reference

| Command | What it does |
|---------|--------------|
| `@git-save` | Add, commit with auto-generated message |
| `@git-deploy` | Add, commit, push to current branch |
| `@git-pr` | Create a pull request to main |
| `@git-sync` | Pull latest, merge, push |
| `@git-feature` | Create new feature branch |
| `@git-hotfix` | Create hotfix branch and deploy |
| `@git-status` | Show current git status summary |
| `@git-undo` | Undo last commit (keep changes) |

---

## @git-save

**Say:** "Save my changes with an appropriate commit message"

```
Look at all my current changes (git diff) and:
1. Run: git add .
2. Generate a concise, descriptive commit message following conventional commits format (feat:, fix:, docs:, style:, refactor:, test:, chore:)
3. Run: git commit -m "[your generated message]"
4. Show me what was committed
```

---

## @git-deploy

**Say:** "Deploy my changes to the current branch"

```
Deploy my current changes:
1. Run: git add .
2. Look at the changes and generate an appropriate commit message using conventional commits (feat:, fix:, docs:, etc.)
3. Run: git commit -m "[generated message]"
4. Run: git push origin [current-branch-name]
5. Show me the result
```

---

## @git-deploy-vercel

**Say:** "Deploy to Vercel production"

```
Deploy to production:
1. Run: git add .
2. Generate commit message from changes
3. Run: git commit -m "[generated message]"
4. Run: git push origin main
5. Run: vercel --prod
6. Show me the deployment URL
```

---

## @git-pr

**Say:** "Create a pull request to main"

```
Create a pull request:
1. Run: git add .
2. Generate commit message from changes
3. Run: git commit -m "[generated message]"
4. Run: git push origin [current-branch-name]
5. Run: gh pr create --base main --head [current-branch-name] --title "[generated title]" --body "[summary of changes]"
   - If gh CLI not available, provide the GitHub URL to create PR manually
6. Show me the PR link
```

---

## @git-feature

**Say:** "Create a new feature branch called [name]"

```
Create a new feature branch:
1. Run: git checkout main
2. Run: git pull origin main
3. Run: git checkout -b feature/[branch-name]
4. Confirm the new branch is created
```

---

## @git-hotfix

**Say:** "Create and deploy a hotfix"

```
Create and deploy a hotfix:
1. Run: git checkout main
2. Run: git pull origin main
3. Run: git checkout -b hotfix/[describe-fix]
4. [Wait for me to make changes]
5. After changes: git add .
6. Run: git commit -m "hotfix: [description]"
7. Run: git push origin hotfix/[branch-name]
8. Run: gh pr create --base main --title "Hotfix: [description]"
```

---

## @git-sync

**Say:** "Sync my branch with main"

```
Sync current branch with main:
1. Run: git fetch origin
2. Run: git pull origin main
3. If conflicts exist, list them and wait for resolution
4. If no conflicts: git push origin [current-branch]
5. Show sync status
```

---

## @git-status

**Say:** "Show me my git status"

```
Show comprehensive git status:
1. Run: git status
2. Run: git log --oneline -5 (last 5 commits)
3. Run: git branch (show current branch)
4. Summarize: files changed, current branch, commits ahead/behind
```

---

## @git-undo

**Say:** "Undo my last commit but keep the changes"

```
Undo last commit:
1. Run: git reset --soft HEAD~1
2. Run: git status
3. Confirm changes are preserved but uncommitted
```

---

## @git-clean

**Say:** "Discard all my local changes"

```
⚠️ WARNING: This will delete uncommitted changes!
1. Confirm with user before proceeding
2. Run: git checkout .
3. Run: git clean -fd
4. Run: git status
5. Confirm working directory is clean
```

---

## @git-stash

**Say:** "Stash my current changes"

```
Stash changes:
1. Run: git stash push -m "[description based on changes]"
2. Run: git stash list
3. Show how to restore: git stash pop
```

---

## @git-release

**Say:** "Create a release with version [X.X.X]"

```
Create a release:
1. Run: git checkout main
2. Run: git pull origin main
3. Run: git tag -a v[version] -m "Release v[version]"
4. Run: git push origin v[version]
5. Run: gh release create v[version] --title "Release v[version]" --notes "[changelog]"
```

---

## Conventional Commits Reference

Use these prefixes for commit messages:

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no code change |
| `refactor:` | Code change, no new feature or fix |
| `test:` | Adding tests |
| `chore:` | Maintenance, dependencies |
| `perf:` | Performance improvement |
| `ci:` | CI/CD changes |
| `build:` | Build system changes |
| `hotfix:` | Urgent production fix |
| `audit:` | Security or code audit |

**Examples:**
- `feat: add user wishlist functionality`
- `fix: resolve Prisma relation name mismatch`
- `docs: update API documentation`
- `chore: update dependencies`
- `hotfix: fix checkout payment flow`

---

## Setup Requirements

### GitHub CLI (optional, for PR creation)
```bash
# Install GitHub CLI
winget install GitHub.cli

# Authenticate
gh auth login
```

### Vercel CLI (optional, for deployments)
```bash
npm install -g vercel
vercel login
```

---

## Usage Examples

### Example 1: Quick save and push
```
@git-deploy
```
Cursor will: add all files → generate commit message → push to current branch

### Example 2: Create PR for review
```
@git-pr
```
Cursor will: commit → push → create PR to main

### Example 3: Start new feature
```
@git-feature user-notifications
```
Cursor will: checkout main → pull → create feature/user-notifications branch

### Example 4: Deploy to production
```
@git-deploy-vercel
```
Cursor will: commit → push → deploy to Vercel production

---

## Troubleshooting

### "Permission denied" on push
```bash
git remote set-url origin https://github.com/USERNAME/REPO.git
# Or use SSH:
git remote set-url origin git@github.com:USERNAME/REPO.git
```

### "Branch is behind"
```
@git-sync
```

### "Merge conflicts"
```
Show me the merge conflicts and help me resolve them
```

---

*Save this file in your project's docs folder for easy reference.*
*Last updated: January 2026*
