# Kollect-It GitHub Sync - Quick Reference

## 📁 Save Location
Save `github-sync.ps1` to: `C:\Users\james\kollect-it\scripts\`

---

## 🚀 How to Use

### Option 1: Interactive Mode (Recommended)
```powershell
cd C:\Users\james\kollect-it
.\scripts\github-sync.ps1
```
The script will:
1. Show current status
2. Ask for confirmation at each step
3. Prompt for commit message
4. Push to GitHub

### Option 2: Quick Mode (With Message)
```powershell
.\scripts\github-sync.ps1 -Message "Fix product card styling"
```

### Option 3: Force Mode (No Confirmations)
```powershell
.\scripts\github-sync.ps1 -Message "Quick fix" -Force
```

### Option 4: Skip Pull
```powershell
.\scripts\github-sync.ps1 -Message "My changes" -NoPull
```

---

## 📋 What the Script Does

| Step | Action | What Happens |
|------|--------|--------------|
| 0 | Navigate | Goes to project folder |
| 1 | Status | Shows changed files |
| 2 | Stage | Adds all changes (`git add -A`) |
| 3 | Commit | Creates commit with your message |
| 4 | Pull | Gets latest from GitHub (rebase) |
| 5 | Push | Sends to GitHub |
| 6 | Deploy | Shows Vercel deployment status |

---

## ⚡ One-Liner Commands

### Full sync with message:
```powershell
cd C:\Users\james\kollect-it; .\scripts\github-sync.ps1 -Message "Update" -Force
```

### Check status only:
```powershell
cd C:\Users\james\kollect-it; git status
```

### View recent commits:
```powershell
cd C:\Users\james\kollect-it; git log --oneline -10
```

---

## 🔧 Manual Git Commands (If Needed)

### Stage all changes:
```bash
git add -A
```

### Commit:
```bash
git commit -m "Your message here"
```

### Pull latest:
```bash
git pull --rebase origin main
```

### Push to GitHub:
```bash
git push origin main
```

### Check what will be pushed:
```bash
git log origin/main..main --oneline
```

---

## ⚠️ Troubleshooting

### "Merge conflict" error:
1. Open the conflicting files
2. Look for `<<<<<<<` markers
3. Edit to resolve conflicts
4. Run: `git add -A`
5. Run: `git rebase --continue`
6. Then push

### "Push rejected" error:
```powershell
git pull --rebase origin main
git push origin main
```

### "Detached HEAD" error:
```powershell
git checkout main
```

### Reset to match remote (⚠️ DELETES LOCAL CHANGES):
```powershell
git fetch origin
git reset --hard origin/main
```

---

## 🌐 After Pushing to Main

- Vercel auto-deploys in 1-3 minutes
- Check status: https://vercel.com/dashboard
- Production site: https://kollect-it.com

---

## 📞 Quick Links

- **GitHub Repo**: https://github.com/[your-repo]/kollect-it
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Production Site**: https://kollect-it.com
- **Admin Panel**: https://kollect-it.com/admin

---

*Last Updated: January 2026*
