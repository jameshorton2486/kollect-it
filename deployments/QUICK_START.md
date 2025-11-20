# QUICK START REFERENCE
## Kollect-It Marketplace - Fix It NOW (5-Minute Guide)

**Problem:** Dev server won't start (EPERM error)  
**Solution:** Follow these 3 steps

---

## 🚨 STEP 1: Fix EPERM Error (2 minutes)

Open PowerShell in your project directory:
```powershell
cd C:\Users\james\kollect-it-marketplace-1
```

Run the emergency fix script:
```powershell
.\FIX-EPERM-IMMEDIATE.ps1
```

**What it does:**
- Stops all Node.js processes
- Deletes .next directory
- Frees port 3000
- Cleans temporary files

---

## ⚡ STEP 2: Start Dev Server (1 minute)

```powershell
npm run dev
```

**Expected output:**
```
✓ Starting...
✓ Ready on http://localhost:3000
```

**If you see errors:**
- Check if .env.local exists
- Verify DATABASE_URL is set
- Run: `npm run typecheck` to see TypeScript errors

---

## ✅ STEP 3: Verify Everything Works (2 minutes)

### Test Homepage:
1. Open: http://localhost:3000
2. Should see navigation and products
3. Check browser console (F12) for errors

### Test Navigation:
- Click header links (should work)
- Click footer links (should work)
- Navigate between pages

### Test Admin Login:
1. Go to: http://localhost:3000/admin/login
2. If no admin user:
   ```powershell
   bun run scripts/create-admin.ts
   ```
3. Log in with created credentials

---

## 🔧 IF STILL NOT WORKING

### Nuclear Option (5 minutes):
```powershell
# Stop everything
Get-Process node | Stop-Process -Force

# Delete everything
Remove-Item .\.next -Recurse -Force
Remove-Item .\node_modules -Recurse -Force

# Reinstall
npm install
npm run db:generate
npm run dev
```

---

## 📁 FULL DOCUMENTATION

**You have 5 comprehensive documents:**

1. **EXECUTIVE_SUMMARY.md** - Start here for overview
2. **CRITICAL_ISSUES.md** - Immediate fixes and diagnostics
3. **CLEANUP_PLAN.md** - Code quality improvements
4. **OPTIMIZATION_RECOMMENDATIONS.md** - Performance & security
5. **AUTOMATED_FIXES.ps1** - Safe automated cleanup script

---

## 🎯 WHAT TO DO AFTER FIXING

### Today (30 minutes):
- Run `AUTOMATED_FIXES.ps1` for cleanup
- Test all main functionality
- Commit your working state to git

### This Week (2-3 hours):
- Review CLEANUP_PLAN.md
- Remove duplicate files
- Replace console.logs with structured logger

### Next Week (4-6 hours):
- Review OPTIMIZATION_RECOMMENDATIONS.md
- Add database indexes
- Fix 'any' types in API routes
- Add rate limiting

---

## 📞 EMERGENCY CONTACTS

**If nothing works:**
1. Check TROUBLESHOOTING section in EXECUTIVE_SUMMARY.md
2. Review CRITICAL_ISSUES.md for detailed diagnostics
3. Check logs: `cat logs/error.log | Select-String "Error"`

**Backup restoration:**
```powershell
# Find latest backup
Get-ChildItem .\deployments\backup-* | Sort-Object CreationTime -Descending | Select-Object -First 1

# Restore from backup
Copy-Item -Path ".\deployments\backup-TIMESTAMP\src" -Destination ".\src" -Recurse -Force
```

---

**REMEMBER:** All scripts create backups before making changes. You can always rollback!

**START HERE:** Run `FIX-EPERM-IMMEDIATE.ps1` now!
