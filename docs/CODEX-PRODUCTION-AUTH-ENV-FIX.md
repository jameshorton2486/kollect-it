# 🔐 KOLLECT-IT PRODUCTION AUTH & ENV FIX — CODEX CLI PROMPT

## CODEX CLI EXECUTION COMMAND

```bash
# Run from the kollect-it project root with full permissions
codex --full-auto --dangerously-skip-permissions "$(cat docs/CODEX-PRODUCTION-AUTH-ENV-FIX.md)"
```

**Or for interactive mode (recommended for production):**
```bash
codex --approval-mode suggest "$(cat docs/CODEX-PRODUCTION-AUTH-ENV-FIX.md)"
```

---

## ROLE & PERMISSIONS

You are a senior production engineer with **FULL READ/WRITE ACCESS** to:
- All files in this repository
- Execute shell commands (bash, PowerShell equivalents)
- Run Node.js/TypeScript scripts via `npx tsx`
- Read environment variable references in code
- Create new files and scripts

You **DO NOT** have access to:
- Vercel dashboard (output instructions for manual steps)
- Production database directly (output scripts to run locally with DATABASE_URL)
- External services (Zoho, Stripe, ImageKit dashboards)

---

## PROJECT CONTEXT

| Item | Value |
|------|-------|
| App | Kollect-It |
| Framework | Next.js 16 + TypeScript |
| Auth | NextAuth.js (Credentials Provider) + Prisma |
| Database | PostgreSQL via Prisma ORM |
| Hosting | Vercel |
| Email | Zoho Mail SMTP (working) |
| Domain | https://kollect-it.com |
| Repo | kollect-it-marketplace-1 |

**CRITICAL EXCLUSIONS — DO NOT TOUCH:**
- WordPress (not part of this project)
- Bluehost (not part of this project)
- DNS records
- Any secrets rotation

---

## 🎯 OBJECTIVES — EXECUTE IN ORDER

---

### 1️⃣ ENVIRONMENT VARIABLE CONSISTENCY AUDIT

**Goal:** Verify URL consistency for NextAuth cookies, redirects, and production routing.

**REQUIRED STATE — These must exist and match exactly:**
```env
NEXT_PUBLIC_SITE_URL=https://kollect-it.com
NEXT_PUBLIC_APP_URL=https://kollect-it.com
NEXTAUTH_URL=https://kollect-it.com
```

**TASKS:**

1. Scan codebase for all environment variable usage:
```bash
# Find all env var references
grep -rn "process.env\." --include="*.ts" --include="*.tsx" --include="*.js" src/ | grep -E "(SITE_URL|APP_URL|NEXTAUTH_URL)" | head -50

# Check .env.example for expected vars
cat .env.example | grep -E "(SITE_URL|APP_URL|NEXTAUTH_URL)"
```

2. Check NextAuth configuration:
```bash
cat src/lib/auth.ts | head -100
```

3. Check for URL inconsistencies in middleware:
```bash
cat middleware.ts
```

**OUTPUT REQUIRED:**
- List any code references expecting different URL formats
- Produce exact Vercel dashboard instructions if changes needed
- Confirm whether redeploy is required

---

### 2️⃣ FULL ENVIRONMENT VARIABLE AUDIT

**Goal:** Identify unused/legacy env vars without breaking production.

**PROTECTED — DO NOT RECOMMEND DELETION:**
```
DATABASE_URL
DIRECT_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_APP_URL
IMAGEKIT_PUBLIC_KEY
IMAGEKIT_PRIVATE_KEY
IMAGEKIT_URL_ENDPOINT
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
EMAIL_HOST
EMAIL_PORT
EMAIL_USER
EMAIL_PASSWORD
EMAIL_FROM
ADMIN_EMAIL
ANTHROPIC_API_KEY
OPENAI_API_KEY
```

**TASKS:**

1. Extract all env vars referenced in codebase:
```bash
# Get unique env var names
grep -rhoP "process\.env\.(\w+)" --include="*.ts" --include="*.tsx" --include="*.js" src/ | sort -u > /tmp/used-env-vars.txt
cat /tmp/used-env-vars.txt
```

2. Check Prisma schema for env references:
```bash
grep -n "env(" prisma/schema.prisma
```

3. Check .env.example for declared vars:
```bash
cat .env.example | grep -v "^#" | grep -v "^$" | cut -d'=' -f1 | sort -u
```

4. Cross-reference and identify:
   - **UNUSED**: In .env.example but never referenced in code
   - **LEGACY**: Supabase-auth vars (if NextAuth is sole auth)
   - **DUPLICATED**: Same value under different names

**OUTPUT REQUIRED:**
Two lists in markdown table format:
1. **SAFE TO DELETE** (high confidence — not referenced anywhere)
2. **VERIFY BEFORE DELETE** (referenced but possibly legacy)

---

### 3️⃣ AUTH FAILURE ROOT CAUSE ANALYSIS

**Observed Errors:**
- "Invalid email or password"
- "Password reset temporarily unavailable"

**TASKS:**

1. Inspect NextAuth authorize function:
```bash
cat src/lib/auth.ts
```

2. Check password reset API route:
```bash
cat src/app/api/auth/forgot-password/route.ts
cat src/app/api/auth/reset-password/route.ts
```

3. Verify Prisma User model:
```bash
grep -A 30 "model User" prisma/schema.prisma
```

4. Check if any Supabase auth remnants exist:
```bash
grep -rn "supabase" --include="*.ts" --include="*.tsx" src/lib/ | grep -i auth
```

**OUTPUT REQUIRED:**
Plain-English explanation (3-5 paragraphs) documenting:
- How authentication actually works in this app
- Why "Invalid email or password" occurs
- Why password reset might fail
- Confirmation that Prisma User table is the source of truth

---

### 4️⃣ ADMIN USER CREATION VERIFICATION

**Goal:** Ensure admin creation script is production-ready.

**TASKS:**

1. Inspect the admin creation script:
```bash
cat scripts/create-admin.ts
```

2. Verify it includes:
   - [ ] Secure password hashing (bcrypt)
   - [ ] Upsert by email (not duplicate on re-run)
   - [ ] Sets `role: "admin"`
   - [ ] Works with `npx tsx` (no Bun dependency)

3. Check for any existing admin scripts:
```bash
ls -la scripts/ | grep -i admin
```

**OUTPUT REQUIRED:**

If script is valid, output this exact PowerShell block:
```powershell
# ============================================
# KOLLECT-IT: CREATE ADMIN USER (PRODUCTION)
# Run from project root in PowerShell
# ============================================

# 1. Set required environment variables
$env:DATABASE_URL="<PASTE_YOUR_PRODUCTION_DATABASE_URL_HERE>"
$env:ADMIN_EMAIL="jameshorton2486@gmail.com"
$env:ADMIN_PASSWORD="<CHOOSE_A_STRONG_PASSWORD>"

# 2. Run the admin creation script
npx tsx scripts/create-admin.ts

# 3. Clean up sensitive env vars from session
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
Remove-Item Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue

Write-Host "✅ Admin creation complete. Test login at https://kollect-it.com/login" -ForegroundColor Green
```

If script needs fixes, create a corrected version.

---

### 5️⃣ ADMIN LOGIN & ROUTING VERIFICATION

**Goal:** Confirm admin can access protected routes after creation.

**TASKS:**

1. Check middleware for role-based protection:
```bash
cat middleware.ts | grep -A 20 -B 5 "admin"
```

2. Find admin routes:
```bash
find src/app/admin -name "page.tsx" | head -20
```

3. Check admin auth hook if exists:
```bash
cat src/hooks/useAdminAuth.tsx 2>/dev/null || echo "No useAdminAuth hook found"
```

4. Verify login page exists:
```bash
ls -la src/app/login/
cat src/app/login/page.tsx | head -50
```

**OUTPUT REQUIRED:**
- Confirm login URL: `https://kollect-it.com/login`
- List all admin routes discovered
- Confirm role check mechanism
- Note any issues with admin routing

---

### 6️⃣ PRODUCTION SAFETY VERIFICATION

**MANDATORY CHECKS — Run these:**

```bash
# 1. No hardcoded secrets in codebase
grep -rn "sk_live\|sk_test\|password.*=" --include="*.ts" --include="*.tsx" src/ | grep -v "process.env" | head -20

# 2. No .env files committed
git ls-files | grep -E "^\.env$|^\.env\.local$|^\.env\.production$"

# 3. .gitignore includes env files
grep "\.env" .gitignore

# 4. No console.log with sensitive data
grep -rn "console.log.*password\|console.log.*secret\|console.log.*token" --include="*.ts" --include="*.tsx" src/ | head -10
```

**OUTPUT REQUIRED:**
- ✅ or ❌ for each check
- Remediation steps if any failures

---

## 7️⃣ FINAL OUTPUT FORMAT

Generate a single markdown report with these sections:

```markdown
# KOLLECT-IT PRODUCTION AUDIT REPORT
Generated: [DATE]

## 1. URL CONSISTENCY STATUS
- [ ] NEXT_PUBLIC_SITE_URL: ✅/❌
- [ ] NEXT_PUBLIC_APP_URL: ✅/❌
- [ ] NEXTAUTH_URL: ✅/❌
- **Action Required:** [Yes/No] — [Details]

## 2. ENVIRONMENT VARIABLE AUDIT

### SAFE TO DELETE (High Confidence)
| Variable | Reason |
|----------|--------|
| ... | ... |

### VERIFY BEFORE DELETE (Low Confidence)
| Variable | Reason | Where Referenced |
|----------|--------|------------------|
| ... | ... | ... |

## 3. AUTH SYSTEM DOCUMENTATION
[Plain English explanation]

## 4. ADMIN CREATION STATUS
- Script Location: `scripts/create-admin.ts`
- Validation: ✅/❌
- Ready for Use: Yes/No

### PowerShell Command Block
[Include the block from section 4]

## 5. ADMIN ROUTES CONFIRMED
| Route | Protected | Role Required |
|-------|-----------|---------------|
| /admin | Yes/No | admin |
| ... | ... | ... |

## 6. SECURITY CHECKLIST
- [ ] No hardcoded secrets
- [ ] .env files gitignored
- [ ] No sensitive console.logs
- [ ] Passwords properly hashed

## 7. GO-LIVE CHECKLIST
- [ ] Environment variables verified in Vercel
- [ ] Admin user created and can log in
- [ ] Email sending confirmed (Zoho SMTP)
- [ ] Password reset flow tested
- [ ] All admin routes accessible
- [ ] No TypeScript build errors
- [ ] Redeploy triggered after env changes

---

## VERDICT: 🟢 SYSTEM READY / 🔴 NOT READY

[One sentence summary]
```

---

## EXECUTION NOTES FOR CODEX

1. **Run all bash commands** — don't just suggest them
2. **Create the final report** as `docs/PRODUCTION_AUDIT_REPORT_[DATE].md`
3. **If you find issues**, fix them in code where safe, otherwise document exact manual steps
4. **Be conservative** — when in doubt, add to "VERIFY BEFORE DELETE" not "SAFE TO DELETE"
5. **Do not modify** any files in `prisma/migrations/`
6. **Do not run** any database migrations — only audit

---

## SUCCESS CRITERIA

This task is complete when:
1. All 7 sections have been audited
2. Final report is generated and saved
3. Any fixable code issues are resolved
4. Manual steps for Vercel are clearly documented
5. Admin creation command is verified and ready to copy-paste
