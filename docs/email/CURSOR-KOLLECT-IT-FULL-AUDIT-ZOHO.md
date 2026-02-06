# Kollect-It Complete Production Audit & Email Migration

> **For:** Cursor AI with @Codebase
> **Project:** Kollect-It (C:\Users\james\kollect-it)
> **Domain:** kollect-it.com
> **Date:** January 2026

---

## OVERVIEW

This is a comprehensive audit and cleanup for Kollect-It, a luxury antiques marketplace built with:
- Next.js 16
- TypeScript
- Prisma ORM
- Supabase PostgreSQL
- Stripe Payments
- ImageKit CDN
- Vercel Hosting

### Goals:
1. Complete production-readiness audit
2. Remove ALL Resend email references
3. Remove ALL Google Workspace references
4. Configure Zoho Mail SMTP
5. Fix any bugs, security issues, or incomplete code
6. Ensure build passes

---

# PART 1: REMOVE RESEND COMPLETELY

## TASK 1.1: Uninstall Resend Package

```bash
npm uninstall resend
```

Verify removal:
```bash
grep "resend" package.json
```
Should return nothing.

---

## TASK 1.2: Find All Resend References

```bash
grep -rn "resend\|Resend\|RESEND" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.env*" --include="*.md" .
```

Document every file found.

---

## TASK 1.3: Remove Resend from Source Files

For EVERY file in src/ containing Resend:

**Remove imports:**
```typescript
// DELETE:
import { Resend } from "resend";
import Resend from "resend";
const { Resend } = require("resend");
```

**Remove initialization:**
```typescript
// DELETE:
const resend = new Resend(process.env.RESEND_API_KEY);
```

**Remove API calls:**
```typescript
// DELETE:
await resend.emails.send({...});
await resend.domains.list();
```

---

## TASK 1.4: Remove Resend from Scripts

Search and clean scripts folder:
```bash
grep -rn "resend\|Resend\|RESEND" --include="*.ts" --include="*.js" --include="*.ps1" scripts/
```

**Files likely affected:**
- scripts/verify-production.ts
- scripts/test-services.ts
- scripts/health-check.ts
- scripts/verify-env.ts
- scripts/verify-env-file.js
- scripts/diagnose-database.ts
- scripts/env-status.js
- scripts/check-env.ts
- scripts/generate-error-summary.ts

**For each file:**
- Remove `RESEND_API_KEY` from required/optional env arrays
- Remove Resend import statements
- Remove Resend test sections
- Replace with Nodemailer/SMTP checks if needed

---

## TASK 1.5: Remove Resend from Env Schema

**File:** src/lib/env/schema.ts

**Remove:**
```typescript
RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
```

**Remove from required arrays:**
```typescript
'RESEND_API_KEY',
```

---

## TASK 1.6: Remove Resend from Tests

**File:** tests/invariants/env-security.test.ts

**Remove:**
```typescript
'RESEND_API_KEY',
```

**Add:**
```typescript
'EMAIL_PASSWORD',
```

---

## TASK 1.7: Remove Resend from API Diagnostics

**File:** src/app/api/diagnostics/check-env/route.ts

**Remove:**
```typescript
'RESEND_API_KEY'
```

**Add:**
```typescript
'EMAIL_HOST',
'EMAIL_USER',
'EMAIL_FROM',
'ADMIN_EMAIL'
```

---

# PART 2: REMOVE GOOGLE WORKSPACE REFERENCES

## TASK 2.1: Find Google Workspace References

```bash
grep -rn "smtp.gmail.com\|google.com/apppasswords\|Google Workspace\|Gmail SMTP" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.env*" .
```

---

## TASK 2.2: Update SMTP Defaults

In any file with Gmail SMTP settings, change:

**From:**
```typescript
host: process.env.EMAIL_HOST || "smtp.gmail.com",
```

**To:**
```typescript
host: process.env.EMAIL_HOST || "smtp.zoho.com",
```

---

## TASK 2.3: Update Documentation

Search and update any docs:
```bash
grep -rn "gmail\|Google Workspace\|myaccount.google.com" --include="*.md" docs/
```

Replace Google Workspace instructions with Zoho Mail instructions.

---

# PART 3: CONFIGURE ZOHO MAIL

## TASK 3.1: Verify Email Service Uses Nodemailer

**File:** src/lib/email.ts

This file should use Nodemailer (NOT Resend). Verify it contains:

```typescript
import nodemailer from "nodemailer";
```

And uses these environment variables:
- EMAIL_HOST (default: smtp.zoho.com)
- EMAIL_PORT (default: 587)
- EMAIL_USER
- EMAIL_PASSWORD
- EMAIL_FROM
- ADMIN_EMAIL

---

## TASK 3.2: Update Email Service Default Host

If src/lib/email.ts exists, ensure the default host is Zoho:

```typescript
transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.zoho.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

---

## TASK 3.3: Update .env.example

**Remove any Resend or Google Workspace email sections.**

**Add this section:**

```env
# ===============================
# EMAIL (Zoho Mail SMTP)
# ===============================
# Free tier: https://www.zoho.com/mail/zohomail-pricing.html
# App Password: Zoho Mail → Settings → Security → App Passwords
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_USER=info@kollect-it.com
EMAIL_PASSWORD=your-zoho-app-password
EMAIL_FROM="Kollect-It <info@kollect-it.com>"
ADMIN_EMAIL=info@kollect-it.com
```

---

## TASK 3.4: Add Zoho Email Variables to Env Schema

**File:** src/lib/env/schema.ts

Add if not present:

```typescript
// Email Configuration (Zoho Mail)
EMAIL_HOST: z.string().optional().default('smtp.zoho.com'),
EMAIL_PORT: z.string().optional().default('587'),
EMAIL_USER: z.string().optional(),
EMAIL_PASSWORD: z.string().optional(),
EMAIL_FROM: z.string().optional(),
ADMIN_EMAIL: z.string().email().optional(),
```

---

## TASK 3.5: Update Report Sender

**File:** src/lib/email/reportSender.ts

Update comments from "Google Workspace migration pending" to "Zoho Mail SMTP":

```typescript
/**
 * Report Email Sender
 * Email service uses Zoho Mail SMTP
 */
```

Remove any TODO comments about Google Workspace migration.

---

# PART 4: SECURITY AUDIT

## TASK 4.1: Scan for Exposed Secrets

```bash
# API keys in code
grep -rn "sk_live_\|sk_test_\|pk_live_\|pk_test_" --include="*.ts" --include="*.tsx" src/

# Database passwords
grep -rn "postgresql://.*:.*@" --include="*.ts" --include="*.tsx" src/

# Hardcoded secrets
grep -rn "password.*=.*['\"]" --include="*.ts" --include="*.tsx" src/
grep -rn "secret.*=.*['\"]" --include="*.ts" --include="*.tsx" src/
grep -rn "apikey.*=.*['\"]" --include="*.ts" --include="*.tsx" src/
```

**If ANY secrets found in code:** Report as CRITICAL and remove them.

---

## TASK 4.2: Verify Admin Routes Are Protected

Check these files have authentication:

**Admin pages (src/app/admin/*):**
```typescript
// Must have session check:
const session = await getServerSession(authOptions);
if (!session || session.user.role !== 'admin') {
  redirect('/login');
}
```

**Admin API routes (src/app/api/admin/*):**
```typescript
// Must have session check:
const session = await getServerSession(authOptions);
if (!session || session.user.role !== 'admin') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

## TASK 4.3: Verify Draft Products Are Filtered

Public queries must exclude draft products:

```typescript
// CORRECT:
where: { isDraft: false, status: 'active' }

// WRONG (exposes drafts):
where: { status: 'active' }
```

**Files to check:**
- src/app/shop/page.tsx
- src/app/browse/page.tsx
- src/app/category/[slug]/page.tsx
- src/app/search/page.tsx
- src/app/api/products/route.ts

---

# PART 5: CODE QUALITY AUDIT

## TASK 5.1: Find Incomplete Code

```bash
# TODO/FIXME comments
grep -rn "TODO\|FIXME\|HACK\|XXX" --include="*.ts" --include="*.tsx" src/

# Empty functions
grep -rn "() => {}" --include="*.ts" --include="*.tsx" src/

# Console statements (should be removed for production)
grep -rn "console.log\|console.error" --include="*.ts" --include="*.tsx" src/app/
```

Report all findings.

---

## TASK 5.2: Check for Unused Imports

```bash
npx tsc --noEmit 2>&1 | grep -E "is declared but|is defined but never used"
```

---

## TASK 5.3: Verify TypeScript Compiles

```bash
npx tsc --noEmit
```

Fix any errors.

---

# PART 6: DATABASE AUDIT

## TASK 6.1: Validate Prisma Schema

```bash
npx prisma validate
```

---

## TASK 6.2: Check for N+1 Query Patterns

Search for potential N+1 queries:

```typescript
// BAD - N+1 pattern:
const products = await prisma.product.findMany();
for (const product of products) {
  const images = await prisma.image.findMany({ where: { productId: product.id } });
}

// GOOD - Use include:
const products = await prisma.product.findMany({
  include: { images: true }
});
```

---

# PART 7: DESIGN SYSTEM CONSISTENCY

## TASK 7.1: Find Non-Standard Color Classes

```bash
grep -rn "text-gray-\|bg-gray-\|border-gray-" --include="*.tsx" src/
```

These should use the lux-* design tokens instead:
- text-gray-300 → text-lux-gray-light
- text-gray-500 → text-lux-gray
- text-gray-700 → text-lux-gray-dark
- bg-gray-50 → bg-lux-pearl
- bg-gray-100 → bg-lux-cream
- bg-gray-900 → bg-lux-charcoal

---

# PART 8: BUILD VERIFICATION

## TASK 8.1: Run Build

```bash
npm run build
```

Must complete with NO errors.

---

## TASK 8.2: Final Verification Commands

```bash
# 1. No Resend anywhere
grep -rn "resend\|RESEND" --include="*.ts" --include="*.tsx" --include="*.js" .

# 2. No Google Workspace SMTP
grep -rn "smtp.gmail.com" --include="*.ts" --include="*.tsx" .

# 3. Package.json clean
grep "resend" package.json

# 4. TypeScript compiles
npx tsc --noEmit

# 5. Build passes
npm run build
```

ALL grep commands should return empty.

---

# OUTPUT FORMAT

## ✅ COMPLETED

### Resend Removal
- [ ] Package uninstalled
- [ ] All imports removed
- [ ] All API calls removed
- [ ] Scripts cleaned
- [ ] Env schema updated
- [ ] Tests updated
- [ ] .env.example updated

### Google Workspace Removal
- [ ] SMTP defaults changed to Zoho
- [ ] Documentation updated

### Zoho Mail Configuration
- [ ] Email service uses smtp.zoho.com
- [ ] Env variables documented
- [ ] .env.example has Zoho settings

### Security Audit
- [ ] No exposed secrets
- [ ] Admin routes protected
- [ ] Draft products filtered

### Code Quality
- [ ] TODO items documented
- [ ] TypeScript compiles
- [ ] Build passes

---

## 📝 FILES MODIFIED

List every file changed:
```
- package.json
- src/lib/email.ts
- src/lib/env/schema.ts
- .env.example
- scripts/verify-production.ts
- scripts/test-services.ts
- (etc.)
```

---

## 🔴 CRITICAL ISSUES

List any security or breaking issues found:
```
FILE: path/to/file.ts:LINE
ISSUE: Description
FIX: What was done or needs to be done
```

---

## 🟡 WARNINGS

List non-critical issues:
```
FILE: path/to/file.ts:LINE
ISSUE: Description
RECOMMENDATION: Suggested fix
```

---

## 🟢 OPTIMIZATIONS

List improvement suggestions:
```
FILE: path/to/file.ts
SUGGESTION: What could be improved
```

---

## ⚠️ MANUAL STEPS REQUIRED

After this audit, the user must:

1. **Update .env.local with Zoho credentials:**
```env
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_USER=info@kollect-it.com
EMAIL_PASSWORD=zoho-app-password-here
EMAIL_FROM="Kollect-It <info@kollect-it.com>"
ADMIN_EMAIL=info@kollect-it.com
```

2. **Test email sending:**
```bash
bun run dev
# Visit http://localhost:3000/forgot-password
# Submit form and check inbox
```

3. **Commit changes:**
```bash
git add .
git commit -m "chore: remove Resend, configure Zoho Mail, production audit"
git push origin main
```

---

## IMPORTANT RULES

1. **REMOVE** all Resend code completely - leave nothing
2. **REMOVE** all Google Workspace/Gmail SMTP references
3. **KEEP** Nodemailer - it's the correct email library
4. **KEEP** email templates in src/emails/ - don't modify
5. **DEFAULT** to smtp.zoho.com for email host
6. **MAKE** all email env vars optional (graceful fallback)
7. **BUILD** must pass when complete
8. Do NOT modify:
   - Database schema (prisma/schema.prisma)
   - Email templates (src/emails/*)
   - Core auth logic (unless fixing security issues)

---

*End of Kollect-It Production Audit & Email Migration Prompt*
