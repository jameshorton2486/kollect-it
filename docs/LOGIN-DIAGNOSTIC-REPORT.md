# Login diagnostic report — info@kollect-it.com

**Date:** Run after pulling production env (`vercel env pull .env.local --environment=production`).

---

## Phase 1 results (diagnostics)

### Step 1.1: Database connection
- **Script:** `npx tsx scripts/diagnose-db-connection.ts`
- **Expected:** `✅ Database is working correctly!`
- **Result:** Connection successful; Users table accessible (5 users).

### Step 1.2: User audit
- **Script:** `npx tsx scripts/audit-users.ts`
- **info@kollect-it.com:** FOUND
  - Email: `info@kollect-it.com` (lowercase ✅)
  - Role: `admin` ✅
  - Password: present, bcrypt hash `$2b$12$...` (60 chars) ✅
  - Email verified: set

### Step 1.3: NextAuth config
- **Script:** `npx tsx scripts/check-nextauth-config.ts`
- NEXTAUTH_SECRET: set (32+ chars) ✅
- NEXTAUTH_URL: set (trimmed value used for check) ✅
- DATABASE_URL: present ✅

If you see a warning about NEXTAUTH_URL, ensure in Vercel it has no trailing space and is exactly `https://kollect-it.com`.

### Step 1.4: Email case fix
- **Script:** `npx tsx scripts/fix-user-email-case.ts`
- **Result:** 0 users updated (all emails were already lowercase).

---

## Phase 2: Create/reset admin (if needed)

If you need to **reset the password** for info@kollect-it.com:

```powershell
$env:ADMIN_EMAIL = "info@kollect-it.com"
$env:ADMIN_NAME = "James"
$env:ADMIN_PASSWORD = "YourNewPassword"   # 8+ chars, remember it
npx tsx scripts/create-admin.ts
```

Then verify the password was saved:

```powershell
$env:TEST_EMAIL = "info@kollect-it.com"
npx tsx scripts/verify-password.ts
```

Enter the same password when prompted. Expected: `✅ PASSWORD IS CORRECT`.

---

## Phase 3: Test login locally

1. `npm run dev`
2. Open http://localhost:3000/login
3. Email: `info@kollect-it.com`
4. Password: (the one you set)
5. Sign In

If it fails, check the terminal for auth logs (login attempt, user not found, password incorrect, etc.).

---

## Phase 4: Production

After login works locally:

1. Commit any script/docs changes:
   `git add . && git commit -m "fix(auth): login diagnostics and case-insensitive email" && git push origin main`
2. Deploy: `vercel --prod`
3. Test at https://kollect-it.com/login with the same email and password.

---

## Phase 5: If production login still fails

1. **Vercel logs:** `vercel logs --follow` then attempt login and watch for errors.
2. **Confirm user in production DB:**
   Ensure `.env.local` has production vars (`vercel env pull .env.local --environment=production`), then:
   ```powershell
   npx tsx scripts/check-production-user.ts
   ```
   If it says USER NOT FOUND, the script is not using the production database; fix DATABASE_URL and try again.

---

## Code changes made (for this fix)

1. **Auth (case-insensitive email):** `src/lib/auth.ts` now looks up the user by email using **case-insensitive** match (`email.trim().toLowerCase()` and Prisma `mode: "insensitive"`). This avoids "user not found" when the DB has `Info@...` and the user types `info@...`.

2. **New scripts:**
   - `scripts/audit-users.ts` — list all users, password presence, role, email case.
   - `scripts/check-nextauth-config.ts` — NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL.
   - `scripts/fix-user-email-case.ts` — normalize all user emails to lowercase.
   - `scripts/verify-password.ts` — verify a user’s password (TEST_EMAIL + prompt).
   - `scripts/check-production-user.ts` — confirm info@kollect-it.com exists in current DB.

---

## Verification checklist

- [ ] `audit-users.ts` shows info@kollect-it.com with password hash and role admin
- [ ] Email is lowercase: info@kollect-it.com
- [ ] `verify-password.ts` says PASSWORD IS CORRECT for your chosen password
- [ ] Local login works at http://localhost:3000/login
- [ ] Production login works at https://kollect-it.com/login
