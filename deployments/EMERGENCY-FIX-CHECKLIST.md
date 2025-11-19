# EMERGENCY FIX CHECKLIST
## Kollect-It Marketplace - Manual Recovery Procedure

**Use this checklist when automated scripts fail or you prefer manual control**

---

## 📋 PRE-FLIGHT CHECK

Before starting, verify:

- [ ] Node.js installed: `node --version` (v20.x or v22.x)
- [ ] npm installed: `npm --version` (v9.x or v10.x)
- [ ] PowerShell or Terminal open
- [ ] In project directory: `C:\Users\james\kollect-it-marketplace-1`
- [ ] Have backup of important files (optional but recommended)

---

## 🔧 PHASE 1: CLEANUP (10 minutes)

### Step 1.1: Remove Orphaned Files

**Action**: Delete incomplete command file
```powershell
# PowerShell
Remove-Item "# Create the images directory if it.txt" -Force

# Bash
rm "# Create the images directory if it.txt"
```

- [ ] File deleted successfully
- [ ] No errors displayed

---

### Step 1.2: Remove Backup Files

**Action**: Clean up backup files in project root
```powershell
# PowerShell
Remove-Item package.json.backup -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json.backup -Force -ErrorAction SilentlyContinue

# Bash
rm -f package.json.backup package-lock.json.backup
```

- [ ] Backup files removed
- [ ] Project root is clean

---

## 📦 PHASE 2: FIX PACKAGE.JSON (15 minutes)

### Step 2.1: Open package.json in VS Code

**Action**: 
```powershell
code package.json
```

- [ ] File opened in editor

---

### Step 2.2: Update Next.js Version

**Find** (around line 64):
```json
"next": "14.2.33"
```

**Replace with**:
```json
"next": "^15.0.0"
```

- [ ] Line found
- [ ] Change made
- [ ] No syntax errors (check for commas)

---

### Step 2.3: Move Prisma to devDependencies

**In "dependencies" section** (around line 68), **FIND and DELETE**:
```json
"prisma": "^6.18.0",
```

**In "devDependencies" section** (around line 79), **ADD**:
```json
"prisma": "^6.18.0",
```

**Result should look like**:
```json
"devDependencies": {
  "@biomejs/biome": "1.9.4",
  "@eslint/eslintrc": "^3.3.1",
  "@next/bundle-analyzer": "^15.0.0",
  "@playwright/test": "^1.56.1",
  "@types/bcryptjs": "^3.0.0",
  "@types/node": "^24.10.1",
  "@types/react": "^19.2.6",
  "@types/react-dom": "^19.2.3",
  "eslint": "^9.39.1",
  "eslint-plugin-import": "^2.32.0",
  "postcss": "^8.5.3",
  "prisma": "^6.18.0",          <-- ADDED THIS LINE
  "tailwindcss": "^3.4.17",
  "typescript": "^5.8.3"
}
```

- [ ] Prisma removed from dependencies
- [ ] Prisma added to devDependencies
- [ ] Comma placement correct

---

### Step 2.4: Remove Platform-Specific Scripts

**In "scripts" section** (around lines 40-42), **DELETE these three lines**:
```json
"logs:view": "Get-Content logs\\*.log | Select-Object -Last 50",
"logs:errors": "Get-Content logs\\error-*.log | Select-Object -Last 50",
"logs:watch": "Get-Content logs\\*.log -Wait -Tail 10"
```

**Important**: After deleting, check the comma on the line before. It should look like:
```json
"error-summary:today": "bun run scripts/generate-error-summary.ts --last=24h"
  },  <-- COMMA SHOULD BE HERE (NOT after the removed lines)
  "dependencies": {
```

- [ ] All three log scripts removed
- [ ] Comma placement verified (no trailing commas before closing brace)
- [ ] JSON syntax still valid

---

### Step 2.5: Save and Validate

**Action**: Save file (Ctrl+S) and validate JSON

```powershell
# Test if package.json is valid JSON
Get-Content package.json | ConvertFrom-Json | Out-Null
# If no error appears, JSON is valid
```

- [ ] File saved
- [ ] No JSON syntax errors
- [ ] Changes confirmed

---

## 🔄 PHASE 3: INSTALL DEPENDENCIES (20 minutes)

### Step 3.1: Clean Cache and Old Files

```powershell
# Clear npm cache
npm cache clean --force

# Remove old node_modules and lock file (if they exist)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
```

- [ ] Cache cleared
- [ ] Old files removed
- [ ] Ready for fresh install

---

### Step 3.2: Install Dependencies

```powershell
npm install --legacy-peer-deps
```

**This will take 10-15 minutes. Watch for:**
- Progress updates
- No critical errors
- "added X packages" message at end

**If installation fails**, try:
```powershell
# Option 1: Force install
npm install --force

# Option 2: Use older npm
npm install --legacy-peer-deps --legacy-ssl
```

- [ ] Installation started
- [ ] No critical errors
- [ ] Installation completed
- [ ] node_modules directory exists
- [ ] package-lock.json created

---

### Step 3.3: Verify Installation

```powershell
# Count installed packages
(Get-ChildItem node_modules -Directory).Count
# Should show 45+ packages
```

- [ ] 45+ packages installed
- [ ] No UNMET DEPENDENCY messages

---

### Step 3.4: Generate Prisma Client

```powershell
npm run db:generate
```

**Expected output**: "Generated Prisma Client"

- [ ] Prisma generation successful
- [ ] No errors

---

## 🔀 PHASE 4: GIT INITIALIZATION (5 minutes)

### Step 4.1: Check Git Status

```powershell
# Check if .git directory exists
Test-Path .git
```

**If returns FALSE**, proceed with initialization
**If returns TRUE**, skip to Phase 5

- [ ] Git status checked

---

### Step 4.2: Initialize Git Repository

```powershell
git init
```

- [ ] Git initialized
- [ ] ".git" directory created

---

### Step 4.3: Create Initial Commit

```powershell
# Add all files
git add .

# Create commit
git commit -m "chore: initial commit after cleanup and fixes"
```

- [ ] Files added
- [ ] Commit created
- [ ] No errors

---

## ⚙️ PHASE 5: ENVIRONMENT SETUP (10 minutes)

### Step 5.1: Check for .env.local

```powershell
Test-Path .env.local
```

**If returns FALSE**, proceed with creation
**If returns TRUE**, verify contents

- [ ] Status checked

---

### Step 5.2: Create .env.local from Template

```powershell
Copy-Item .env.example .env.local
```

- [ ] File created
- [ ] No errors

---

### Step 5.3: Edit .env.local

**Action**: Open .env.local and fill in required values

```powershell
code .env.local
```

**REQUIRED Variables** (must fill in):

```env
# Database (from Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/[DATABASE]?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/[DATABASE]"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[GENERATE WITH: openssl rand -base64 32]"

# Stripe (from Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ImageKit (from ImageKit Dashboard)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_..."
IMAGEKIT_PRIVATE_KEY="private_..."
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/[YOUR_ID]"
```

**OPTIONAL Variables** (fill if available):

```env
# Email
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="noreply@kollect-it.com"

# AI Services
CLAUDE_API_KEY="sk-ant-api03-..."
OPENAI_API_KEY="sk-..."

# Admin
ADMIN_EMAIL="admin@kollect-it.com"
```

- [ ] .env.local opened
- [ ] All REQUIRED variables filled
- [ ] File saved

---

## ✅ PHASE 6: VERIFICATION (15 minutes)

### Step 6.1: TypeScript Type Check

```powershell
npm run typecheck
```

**Expected**: Completes with 0 errors (or only env-related warnings)

- [ ] Command completed
- [ ] No blocking errors
- [ ] TypeScript compilation successful

**If errors appear**:
- Note the error messages
- Check if they're related to missing env vars
- Fix any actual code errors

---

### Step 6.2: ESLint Check

```powershell
npm run lint
```

**Expected**: Completes with 0 errors (warnings acceptable)

- [ ] Command completed
- [ ] 0 errors (or acceptable warnings)

**If errors appear**:
- Note the error messages
- Fix critical linting errors
- Warnings can be addressed later

---

### Step 6.3: Development Server Test

```powershell
npm run dev
```

**Expected output**:
```
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 3.2s
```

- [ ] Server started
- [ ] No critical errors
- [ ] Local URL displayed

---

### Step 6.4: Browser Test

**Action**: Open browser to http://localhost:3000

**Verify**:
- [ ] Homepage loads
- [ ] No console errors (F12)
- [ ] Images load (or placeholders show)
- [ ] Navigation works

**If page doesn't load**:
1. Check terminal for errors
2. Verify .env.local has required variables
3. Check browser console for errors
4. Try hard refresh (Ctrl+F5)

---

## 📊 FINAL VERIFICATION

### Checklist Summary

- [ ] All orphaned files removed
- [ ] package.json updated (Next 15, Prisma in devDeps)
- [ ] node_modules populated (45+ packages)
- [ ] Prisma client generated
- [ ] Git initialized with commit
- [ ] .env.local created and configured
- [ ] TypeScript check passes
- [ ] Lint check passes
- [ ] Dev server starts
- [ ] Homepage loads in browser

---

## 🎉 SUCCESS CRITERIA

**If all items checked above**, you have successfully restored the project!

### Next Steps:
1. Test key features:
   - [ ] Browse products
   - [ ] View product details
   - [ ] Add to cart (if products exist)
   - [ ] Test authentication flow

2. Check admin panel:
   - [ ] Navigate to /admin
   - [ ] Verify dashboard loads

3. Review logs:
   - [ ] Check for warnings in terminal
   - [ ] Note any non-critical issues

---

## 🆘 TROUBLESHOOTING

### Dev Server Won't Start

**Check 1**: Verify port 3000 is available
```powershell
netstat -ano | findstr :3000
# If port is in use, kill the process or use different port
```

**Check 2**: Verify DATABASE_URL is correct
```powershell
# Test database connection
npm run db:generate
```

**Check 3**: Check for syntax errors
```powershell
npm run typecheck
```

---

### Build Fails

**Error**: "Module not found"
```powershell
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps
```

**Error**: "Prisma client not generated"
```powershell
npm run db:generate
```

**Error**: Environment variable errors
- Verify .env.local has all required variables
- Check for typos in variable names
- Ensure values are properly quoted

---

### TypeScript Errors

**Error**: "Cannot find module '@/...'"
```powershell
# Check tsconfig.json paths are correct
# Should have: "@/*": ["./src/*"]
```

**Error**: Type errors in code
- Review the specific error message
- Check if it's related to missing types
- May need to add type definitions

---

## 📞 SUPPORT

If issues persist after following this checklist:

1. **Review logs**:
   - Check terminal output
   - Check browser console (F12)
   - Check logs/ directory

2. **Verify environment**:
   - Node.js version: `node --version`
   - npm version: `npm --version`
   - Git version: `git --version`

3. **Check documentation**:
   - See docs/ folder for specific guides
   - Review DIAGNOSTIC-REPORT.md
   - Check README.md

4. **Restore from backup**:
   - If automated backup was created
   - Copy backup files back to project

---

## 🔄 ROLLBACK PROCEDURE

If you need to undo changes:

### Option 1: Restore from Backup (if created)
```powershell
# Copy backup files back
Copy-Item .backup-YYYYMMDD-HHmmss\* . -Force
```

### Option 2: Git Reset (if committed)
```powershell
# Reset to previous commit
git log --oneline  # Find commit before fixes
git reset --hard [COMMIT_HASH]
```

### Option 3: Manual Restore
1. Restore original package.json
2. Run `npm install`
3. Start over with checklist

---

**Checklist Version**: 1.0  
**Last Updated**: November 18, 2025  
**Estimated Time**: 60-75 minutes  
**Difficulty**: Easy-Medium
