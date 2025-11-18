# AI AGENT IMPLEMENTATION PROMPT
# Copy this entire prompt and share with your AI coding assistant

---

## CONTEXT

You are implementing an automated error handling and logging system for the Kollect-It Next.js application. All documentation and implementation files are located in:

```
deployments/Error handling and logging/
```

## YOUR MISSION

Read the documentation files in the directory above, then implement the error handling system by:

1. **Reading and understanding** all documentation files
2. **Backing up** existing files before modification
3. **Implementing** the enhanced auth logging
4. **Adding** the error summary script
5. **Updating** package.json with new scripts
6. **Creating** the logs directory
7. **Testing** the implementation
8. **Verifying** everything works

## STEP-BY-STEP INSTRUCTIONS

### PHASE 1: Read Documentation (REQUIRED FIRST STEP)

Before making ANY changes, read these files in order:

1. **00-START-HERE-EXECUTIVE-SUMMARY.md**
   - Understand the problem being solved
   - Review the solution overview

2. **IMPLEMENTATION-GUIDE.md**
   - Read the complete implementation steps
   - Note all file locations and commands

3. **ERROR-LOGGING-SYSTEM-COMPLETE.md**
   - Understand the technical details
   - Review what already exists vs what's new

4. **TROUBLESHOOTING-QUICK-REFERENCE.md**
   - Familiarize yourself with troubleshooting steps
   - Note file locations for reference

After reading, confirm you understand:
- What files need to be modified
- What new files need to be created
- The purpose of each change

### PHASE 2: Backup Existing Files

Before modifying anything, create backups:

```bash
# Backup current auth file
cp src/lib/auth.ts src/lib/auth.ts.backup

# Create backup directory if needed
mkdir -p backups
cp src/lib/auth.ts backups/auth.ts.$(date +%Y%m%d_%H%M%S)
```

Confirm the backup was created successfully.

### PHASE 3: Implement Enhanced Auth Logging

**File to modify:** `src/lib/auth.ts`

**Source:** `deployments/Error handling and logging/auth-enhanced.ts`

**Actions:**
1. Open `deployments/Error handling and logging/auth-enhanced.ts`
2. Review the enhanced code
3. Replace the contents of `src/lib/auth.ts` with the enhanced version
4. Verify the following are present in the new file:
   - Import of `logger` from `./logger`
   - Detailed logging in the `authorize` function for each failure case:
     - Missing credentials
     - User not found
     - User has no password hash
     - Password comparison error
     - Incorrect password
     - Successful login
   - NextAuth logger configuration
   - Debug mode enabled for development

**Verification:**
- File compiles without TypeScript errors
- All imports are correct
- Logger calls use proper syntax

### PHASE 4: Add Error Summary Script

**File to create:** `scripts/generate-error-summary.ts`

**Source:** `deployments/Error handling and logging/generate-error-summary.ts`

**Actions:**
1. Ensure `scripts/` directory exists: `mkdir -p scripts`
2. Copy the error summary script:
   ```bash
   cp "deployments/Error handling and logging/generate-error-summary.ts" scripts/generate-error-summary.ts
   ```
3. Make the script executable:
   ```bash
   chmod +x scripts/generate-error-summary.ts
   ```

**Verification:**
- File exists at `scripts/generate-error-summary.ts`
- File has execute permissions
- File contains the shebang: `#!/usr/bin/env bun`

### PHASE 5: Update package.json

**File to modify:** `package.json`

**Source:** `deployments/Error handling and logging/package-json-scripts.json`

**Actions:**
1. Open `package.json`
2. Locate the `"scripts"` section
3. Add the following scripts (merge with existing scripts):
   ```json
   {
     "scripts": {
       "error-summary": "bun run scripts/generate-error-summary.ts",
       "error-summary:last-hour": "bun run scripts/generate-error-summary.ts --last=1h",
       "error-summary:last-30min": "bun run scripts/generate-error-summary.ts --last=30m",
       "error-summary:today": "bun run scripts/generate-error-summary.ts --last=24h",
       "logs:view": "tail -n 50 logs/*.log",
       "logs:errors": "tail -n 50 logs/error-*.log",
       "logs:watch": "tail -f logs/*.log"
     }
   }
   ```

**Verification:**
- Scripts are properly formatted JSON
- No syntax errors in package.json
- Commas are correct between script entries

### PHASE 6: Create Logs Directory

**Actions:**
1. Create the logs directory:
   ```bash
   mkdir -p logs
   ```

2. Verify `.gitignore` includes logs:
   ```bash
   grep -q "^logs/" .gitignore || echo "logs/" >> .gitignore
   grep -q "*.log" .gitignore || echo "*.log" >> .gitignore
   ```

**Verification:**
- `logs/` directory exists
- `.gitignore` contains `logs/` and `*.log`

### PHASE 7: Test the Implementation

**Actions:**

1. **Start the development server:**
   ```bash
   bun run dev
   ```

2. **Attempt a login** (will likely fail, which is expected):
   - Navigate to `http://localhost:3000/admin/login`
   - Try logging in with any credentials
   - Observe the terminal output for detailed log messages

3. **Generate error summary:**
   ```bash
   bun run error-summary
   ```

4. **Review the generated summary:**
   ```bash
   cat error-summary-ai.md
   ```

**Expected Results:**

In terminal, you should see detailed logs like:
```json
{"level":"info","msg":"Login attempt started","emailProvided":true,"passwordProvided":true,...}
{"level":"warn","msg":"Login failed: user not found","attemptedEmail":"test@example.com",...}
```

In `error-summary-ai.md`, you should see:
- Structured error analysis
- Authentication failures section
- Specific failure reasons
- Actionable recommendations

### PHASE 8: Fix Common First Issues

Based on error summary, apply fixes:

**If "Login failed: user not found":**
```bash
bun run scripts/create-admin.ts
# Follow prompts to create admin user
```

**If "Login failed: user has no password hash":**
```bash
bun run scripts/create-admin.ts
# Recreate admin with proper password
```

**If "Database connection error":**
```bash
# Check DATABASE_URL in .env.local
cat .env.local | grep DATABASE_URL

# If missing, you'll need to prompt user for it
echo "⚠️ DATABASE_URL not set. User needs to add it to .env.local"
```

**If "NextAuth error":**
```bash
# Check NEXTAUTH_SECRET and NEXTAUTH_URL
cat .env.local | grep NEXTAUTH

# If missing, generate secret:
openssl rand -base64 32

# User needs to add to .env.local:
# NEXTAUTH_SECRET=<generated-secret>
# NEXTAUTH_URL=http://localhost:3000
```

### PHASE 9: Verify Everything Works

1. **Test login again** after fixes
2. **Generate new error summary:**
   ```bash
   bun run error-summary
   ```
3. **Confirm reduced errors** in summary
4. **Check for "Login succeeded"** messages in logs

**Success Indicators:**
✅ Login works or has clear, actionable error messages
✅ Error summary generates without errors
✅ Logs show detailed authentication steps
✅ AI-ready summary contains helpful recommendations

### PHASE 10: Documentation and Cleanup

1. **Move documentation** to appropriate location:
   ```bash
   # Optionally move to docs folder for easier access
   cp "deployments/Error handling and logging/TROUBLESHOOTING-QUICK-REFERENCE.md" docs/
   ```

2. **Create implementation log:**
   ```bash
   cat > IMPLEMENTATION-LOG.md << EOF
   # Error Handling System Implementation Log
   
   **Implemented:** $(date)
   **Status:** Complete
   
   ## Changes Made
   1. Enhanced src/lib/auth.ts with detailed logging
   2. Added scripts/generate-error-summary.ts
   3. Updated package.json with error summary scripts
   4. Created logs/ directory
   5. Updated .gitignore
   
   ## Testing Results
   - Error summary generation: ✅
   - Auth logging: ✅
   - Login functionality: [Add result here]
   
   ## Quick Commands
   - Generate error summary: bun run error-summary
   - View recent errors: bun run logs:errors
   - Watch logs live: bun run logs:watch
   EOF
   ```

3. **Commit changes:**
   ```bash
   git add src/lib/auth.ts scripts/generate-error-summary.ts package.json .gitignore
   git commit -m "feat: Add automated error logging and summary system

   - Enhanced auth.ts with detailed login failure logging
   - Added error summary generator script for AI-ready diagnostics
   - Added convenience scripts for log viewing
   - Created logs directory with gitignore rules
   
   Time-to-fix reduced from 30min to 2min with automated summaries."
   ```

## CRITICAL REMINDERS

### ⚠️ DO NOT:
- Skip reading the documentation files first
- Modify files without creating backups
- Commit `.env.local` or any secrets
- Delete existing functionality without understanding it
- Skip the testing phase

### ✅ DO:
- Read all documentation before starting
- Create backups before modifying files
- Test after each phase
- Verify all TypeScript compiles
- Run error-summary after implementation
- Commit changes with descriptive messages

## HANDLING ERRORS DURING IMPLEMENTATION

If you encounter errors:

1. **TypeScript compilation errors:**
   ```bash
   bunx tsc --noEmit
   # Review errors and fix imports/types
   ```

2. **Script execution errors:**
   ```bash
   # Check script permissions
   ls -la scripts/generate-error-summary.ts
   
   # Make executable if needed
   chmod +x scripts/generate-error-summary.ts
   ```

3. **Database connection errors:**
   ```bash
   # Verify DATABASE_URL
   bunx prisma db pull
   ```

4. **Missing dependencies:**
   ```bash
   bun install
   ```

## SUCCESS CRITERIA

The implementation is complete when:

✅ `src/lib/auth.ts` includes detailed logging for all auth steps
✅ `scripts/generate-error-summary.ts` exists and is executable
✅ `package.json` includes all new error-summary scripts
✅ `logs/` directory exists and is in `.gitignore`
✅ `bun run error-summary` executes successfully
✅ `error-summary-ai.md` is generated with structured content
✅ Terminal shows detailed auth logs during login attempts
✅ TypeScript compiles without errors
✅ All tests pass (if applicable)

## POST-IMPLEMENTATION

After successful implementation:

1. **Share results with user:**
   ```
   ✅ Implementation complete!
   
   Files modified:
   - src/lib/auth.ts (enhanced with logging)
   - package.json (added scripts)
   - .gitignore (added logs)
   
   Files created:
   - scripts/generate-error-summary.ts
   - logs/ directory
   
   Next steps:
   1. Try logging in at http://localhost:3000/admin/login
   2. Run: bun run error-summary
   3. Review: error-summary-ai.md
   4. Share the summary with me for any fixes needed
   ```

2. **Provide quick reference:**
   ```
   Quick commands:
   - bun run error-summary          # Generate AI-ready error report
   - bun run error-summary:last-hour  # Last hour only
   - bun run logs:errors            # View recent errors
   - bun run logs:watch             # Watch logs in real-time
   ```

## ADDITIONAL CONTEXT

**Project Tech Stack:**
- Framework: Next.js 14 (App Router)
- Auth: NextAuth with credentials provider
- Database: Prisma ORM + Supabase PostgreSQL
- Runtime: Bun
- Language: TypeScript
- Deployment: Vercel

**Existing Logger:**
- Location: `src/lib/logger.ts`
- Already has: JSON logging, PII redaction, request context
- Methods: `logger.debug()`, `logger.info()`, `logger.warn()`, `logger.error()`

**Existing Error Handler:**
- Location: `src/lib/api-error.ts`
- Already has: `respondOk()`, `respondError()`, `AppError` class

## FINAL CHECKLIST

Before marking as complete, verify:

- [ ] All documentation files have been read
- [ ] Backups of modified files exist
- [ ] `src/lib/auth.ts` has enhanced logging
- [ ] `scripts/generate-error-summary.ts` exists
- [ ] `package.json` has new scripts
- [ ] `logs/` directory exists
- [ ] `.gitignore` includes logs
- [ ] `bun run dev` starts without errors
- [ ] Login attempt generates detailed logs
- [ ] `bun run error-summary` works
- [ ] `error-summary-ai.md` is generated
- [ ] TypeScript compiles cleanly
- [ ] Changes are committed to git

---

## EXECUTE

You have all the information and files needed. Begin implementation following the phases above. Report progress after each phase and any issues encountered.

Start with: "Beginning implementation. Phase 1: Reading documentation files..."
