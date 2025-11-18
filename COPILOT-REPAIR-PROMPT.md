# VS CODE COPILOT - AUTONOMOUS REPAIR MASTER PROMPT
## Kollect-It Marketplace Recovery

---

## 🎯 MISSION
You are an AI agent tasked with autonomously repairing the Kollect-It Marketplace Next.js application. Your goal is to fix all identified issues and restore the project to a fully functional development state.

---

## 📋 CONTEXT

### Project Information
- **Name**: Kollect-It Marketplace
- **Tech Stack**: Next.js 15, TypeScript, Prisma, Supabase, Stripe
- **Status**: Multiple configuration issues preventing development
- **Target**: Production-ready development environment

### Issues Identified (10 Total)
See DIAGNOSTIC-REPORT.md for complete details

---

## 🤖 EXECUTION INSTRUCTIONS

### Phase 1: Environment Setup (5 minutes)

**Step 1.1**: Verify Prerequisites
```bash
# Check Node.js version (should be v20.x or v22.x)
node --version

# Check npm version
npm --version

# Verify we're in correct directory
pwd
# Expected: C:\Users\james\kollect-it-marketplace-1
```

**Step 1.2**: Clean Orphaned Files
```bash
# Remove incomplete command file
rm "# Create the images directory if it.txt"

# Remove backup files
rm package.json.backup
rm package-lock.json.backup
```

---

### Phase 2: Package Configuration Fix (10 minutes)

**Step 2.1**: Update package.json

Open `package.json` and make these changes:

**Change 1: Update Next.js version**
```json
// FIND (line 64):
"next": "14.2.33"

// REPLACE WITH:
"next": "^15.0.0"
```

**Change 2: Move Prisma to devDependencies**
```json
// FIND in "dependencies" section (line 68):
"prisma": "^6.18.0",

// DELETE this line from dependencies

// ADD to "devDependencies" section:
"prisma": "^6.18.0",
```

**Change 3: Remove platform-specific scripts**
```json
// DELETE these lines from "scripts" section (lines 40-42):
"logs:view": "Get-Content logs\\*.log | Select-Object -Last 50",
"logs:errors": "Get-Content logs\\error-*.log | Select-Object -Last 50",
"logs:watch": "Get-Content logs\\*.log -Wait -Tail 10"
```

**Step 2.2**: Save package.json

After making changes, save the file.

---

### Phase 3: Install Dependencies (15-20 minutes)

**Step 3.1**: Clear npm cache
```bash
npm cache clean --force
```

**Step 3.2**: Delete node_modules and package-lock.json if they exist
```bash
# PowerShell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Bash/Linux
rm -rf node_modules
rm -f package-lock.json
```

**Step 3.3**: Install all dependencies
```bash
npm install --legacy-peer-deps
```

**Expected Output**: 
- Installation should complete successfully
- ~45+ packages should be installed
- No UNMET DEPENDENCY errors

**Step 3.4**: Generate Prisma Client
```bash
npm run db:generate
```

---

### Phase 4: Git Initialization (2 minutes)

**Step 4.1**: Initialize Git (if not already initialized)
```bash
# Check if .git exists
# If not, run:
git init

# Add all files
git add .

# Create initial commit
git commit -m "chore: initial commit after cleanup and fixes"
```

---

### Phase 5: Environment Configuration (5 minutes)

**Step 5.1**: Create .env.local
```bash
# If .env.local doesn't exist
cp .env.example .env.local
```

**Step 5.2**: Display environment setup reminder
```
⚠️  IMPORTANT: Edit .env.local with actual values

Required variables to fill in:
- DATABASE_URL (Supabase PostgreSQL connection)
- DIRECT_URL (Supabase direct connection)
- NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
- STRIPE_SECRET_KEY (from Stripe dashboard)
- STRIPE_WEBHOOK_SECRET (from Stripe dashboard)
- IMAGEKIT_PRIVATE_KEY (from ImageKit dashboard)
- NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY (from ImageKit dashboard)
- NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT (from ImageKit dashboard)
```

---

### Phase 6: Verification (10 minutes)

**Step 6.1**: Type Check
```bash
npm run typecheck
```
Expected: Should pass or only have errors related to missing env vars

**Step 6.2**: Lint Check
```bash
npm run lint
```
Expected: Should pass with 0 errors (warnings acceptable)

**Step 6.3**: Build Test
```bash
npm run build
```
Expected: Should complete successfully (may fail if env vars not set)

**Step 6.4**: Start Development Server
```bash
npm run dev
```
Expected: Server starts on http://localhost:3000

---

## 🎯 SUCCESS CRITERIA

### Must Complete Successfully:
- ✅ All orphaned files removed
- ✅ package.json updated (Next 15, Prisma in devDeps)
- ✅ All dependencies installed (no UNMET errors)
- ✅ Prisma client generated
- ✅ Git initialized with initial commit
- ✅ .env.local created from template

### Verification Tests:
- ✅ `npm run typecheck` completes
- ✅ `npm run lint` completes
- ✅ `npm run dev` starts server
- ✅ http://localhost:3000 is accessible

---

## 🚨 ERROR HANDLING

### If npm install fails:
```bash
# Try with different flags
npm install --force

# OR try with legacy SSL
npm install --legacy-peer-deps --legacy-ssl

# OR try clearing cache again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### If Prisma generation fails:
```bash
# Check DATABASE_URL in .env.local
# Try direct generation
npx prisma generate
```

### If build fails:
- Check that .env.local has all required variables
- Verify DATABASE_URL is correctly formatted
- Check for TypeScript errors: `npm run typecheck`

---

## 📝 LOGGING

Create a log of all actions taken:

```markdown
# Repair Log - [TIMESTAMP]

## Actions Completed:
1. [x] Removed orphaned files
2. [x] Updated package.json
3. [x] Installed dependencies
4. [x] Generated Prisma client
5. [x] Initialized Git
6. [x] Created .env.local

## Verification Results:
- TypeCheck: PASS/FAIL
- Lint: PASS/FAIL
- Build: PASS/FAIL
- Dev Server: PASS/FAIL

## Issues Encountered:
[None / List any issues]

## Resolution:
[Project restored to working state / Additional steps needed]
```

---

## 🎪 AUTONOMOUS EXECUTION MODE

When running in autonomous mode, follow this workflow:

1. **Read** DIAGNOSTIC-REPORT.md for complete context
2. **Execute** each phase sequentially
3. **Verify** after each phase
4. **Log** all actions and results
5. **Report** final status

**Do not stop for user input unless an error occurs that you cannot resolve.**

---

## 💡 TIPS FOR SUCCESS

1. **Always verify current state before making changes**
   - Check if file exists before deleting
   - Check if dependency already updated before changing

2. **Use terminal commands, not file operations**
   - Prefer `npm` commands over manual file edits
   - Use git commands for version control

3. **Be defensive**
   - Back up critical files before changes
   - Verify changes immediately after applying

4. **Think incrementally**
   - Complete one phase fully before moving to next
   - Don't skip verification steps

---

## 🚀 READY TO EXECUTE

To begin autonomous repair:

1. Open VS Code
2. Open integrated terminal
3. Paste this prompt into Copilot Chat
4. Say: "Execute autonomous repair following this master prompt"

Copilot will proceed through all phases automatically, providing updates at each step.

---

## 📊 ESTIMATED TIMELINE

| Phase | Duration | Complexity |
|-------|----------|------------|
| 1. Environment Setup | 5 min | LOW |
| 2. Package Config | 10 min | MEDIUM |
| 3. Install Deps | 20 min | LOW |
| 4. Git Init | 2 min | LOW |
| 5. Env Config | 5 min | LOW |
| 6. Verification | 10 min | MEDIUM |
| **TOTAL** | **~52 min** | **EASY** |

---

## ✅ FINAL CHECKLIST

After completion, verify:

- [ ] No files with "backup" in filename
- [ ] No orphaned .txt files in root
- [ ] node_modules directory exists and is populated
- [ ] package.json has Next.js ^15.0.0
- [ ] package.json has Prisma in devDependencies only
- [ ] .git directory exists
- [ ] .env.local exists
- [ ] npm run dev starts without errors
- [ ] http://localhost:3000 loads

---

*Generated: November 18, 2025*
*Target: VS Code GitHub Copilot*
*Execution Mode: Autonomous*
