# Supabase API Key Migration Audit - Complete Report

**Date:** 2026-01-22  
**Project:** Kollect-It  
**Project ID:** `xqrroyyqrgdytzpcckwk`

---

## ✅ Executive Summary

**Status:** **READY FOR MIGRATION** - No code changes required

Your codebase is already fully compatible with new opaque keys. The `@supabase/ssr` package automatically handles both legacy JWT and new opaque key formats.

**Critical Finding:** The Supabase client files exist but are **NOT actively used** in your application. Your app uses Prisma for database access, not Supabase client.

---

## 📋 Deliverable 1: Files That Need Changes

### ✅ **NO CODE CHANGES REQUIRED**

**Reason:** Your Supabase integration uses `@supabase/ssr` which automatically handles both legacy JWT and new opaque keys. The SDK detects the key format and uses the appropriate headers.

**Files Verified (No Changes Needed):**
- ✅ `src/lib/supabase/client.ts` - Uses `createBrowserClient` (auto-compatible)
- ✅ `src/lib/supabase/server.ts` - Uses `createServerClient` (auto-compatible)
- ✅ `middleware.ts` - No Supabase interaction
- ✅ All API routes - No direct REST calls found

### 📝 Optional: Environment Variable Validation (Already Completed)

**Files Updated (Optional Enhancement):**
- ✅ `src/lib/env/schema.ts` (lines 73-80) - Added Supabase vars to client schema
- ✅ `src/lib/env/validate.ts` (lines 57-58) - Added Supabase vars to validation map
- ✅ `.env.example` - Added Supabase env var placeholders

**Why Optional:** These validate env vars exist but don't affect key format compatibility.

---

## 📋 Deliverable 2: Specific Code Changes

### **NO CODE CHANGES NEEDED**

The `@supabase/ssr` package automatically:
- Detects key format (JWT vs opaque)
- Uses correct headers (`Authorization: Bearer` for JWT, `apikey` for opaque)
- Handles authentication transparently

**Your current code is already correct:**

```typescript
// src/lib/supabase/client.ts (lines 3-7)
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createBrowserClient(supabaseUrl, supabaseAnonKey)  // ✅ Auto-compatible
}

// src/lib/supabase/server.ts (lines 7-9)
return createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { cookies: {...} }  // ✅ Auto-compatible
)
```

**No changes required** - SDK handles everything automatically.

---

## 📋 Deliverable 3: Package Updates Needed

### ✅ **NONE REQUIRED**

**Current Versions:**
- `@supabase/supabase-js`: `^2.45.0` (requires >= 2.39.0) ✅
- `@supabase/ssr`: `^0.5.2` ✅

**Status:** Both packages fully support new opaque keys.

**Action:** No package updates needed.

---

## 📋 Deliverable 4: Environment Variable Changes

### **Update Values Only (Not Names)**

**Keep these variable names (no change):**
- `NEXT_PUBLIC_SUPABASE_URL` (no change)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (no change)

**Update the values:**

#### Local Development (`.env.local`):
```env
# OLD (Legacy JWT - ~217 chars, starts with eyJ)
NEXT_PUBLIC_SUPABASE_URL=https://xqrroyyqrgdytzpcckwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NEW (Opaque - ~47 chars, starts with sb_publishable_)
NEXT_PUBLIC_SUPABASE_URL=https://xqrroyyqrgdytzpcckwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_your_new_opaque_key_here
```

#### Vercel Production:
1. Go to: Vercel Dashboard → Project → Settings → Environment Variables
2. Find `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Click "Edit"
4. Paste new `sb_publishable_...` key
5. Select "Production" environment
6. Save
7. **Redeploy:** Deployments → Latest → "..." → "Redeploy"

**Where to get new keys:**
- Supabase Dashboard → Project Settings → API
- Copy "Publishable anon key" (starts with `sb_publishable_`)

---

## 📋 Deliverable 5: Deployment Considerations (Vercel)

### Steps:

1. **Update Environment Variables:**
   - Vercel Dashboard → Settings → Environment Variables
   - Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` with new opaque key
   - Ensure "Production" environment is selected

2. **Redeploy:**
   ```powershell
   vercel --prod
   ```
   Or use Vercel dashboard: Deployments → Latest → "..." → "Redeploy"

3. **Verify Deployment:**
   - Check Vercel logs for Supabase errors
   - Test production URLs
   - Verify browser console has no Supabase errors

### Important Notes:

- ✅ **No code changes needed** - SDK handles opaque keys automatically
- ✅ **No build changes needed** - Same build process
- ✅ **Backward compatible** - Can switch back to legacy keys if needed (during transition)
- ✅ **No downtime** - Just update env vars and redeploy

### If You Add Edge Functions Later:

If you deploy Supabase Edge Functions, use:
```bash
supabase functions deploy --no-verify-jwt
```

This flag is required for opaque keys.

---

## 📋 Deliverable 6: Testing Checklist

### Pre-Migration

- [x] Verify SDK versions (>= 2.39.0) ✅
- [x] Verify no direct REST calls ✅
- [x] Verify client/server setup uses SDK ✅
- [x] Verify middleware doesn't interact with Supabase ✅

### Migration Steps

- [ ] Get new keys from Supabase dashboard
- [ ] Update `.env.local` with new `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Restart local dev server
- [ ] Test local Supabase client initialization (if used)
- [ ] Update Vercel environment variables
- [ ] Redeploy to production

### Post-Migration Testing

#### Local Testing:
- [ ] Dev server starts without errors
- [ ] No Supabase errors in browser console
- [ ] Supabase client initializes successfully (if used)
- [ ] Any Supabase features work (if used)

#### Production Testing:
- [ ] Production deployment successful
- [ ] No Supabase errors in Vercel logs
- [ ] No Supabase errors in browser console (production)
- [ ] All Supabase features work (if used)

### Verification Commands:

```powershell
# Check local env vars
Get-Content .env.local | Select-String "SUPABASE"

# Test local dev
bun run dev
# Open browser console, check for Supabase errors

# Check Vercel logs
vercel logs https://kollect-it.com
```

---

## 🔍 Detailed Findings

### 1. Supabase Client Initialization ✅

**Files Found:**
- `src/lib/supabase/client.ts` - Browser client (lines 1-8)
- `src/lib/supabase/server.ts` - Server client (lines 1-36)

**Status:** Both use `@supabase/ssr` which automatically handles opaque keys. No changes needed.

**Usage:** ⚠️ **NOT ACTIVELY USED** - These files exist but are not imported anywhere in the codebase. Your app uses Prisma for database access.

### 2. Environment Variable Usage ✅

**Current Usage:**
- `NEXT_PUBLIC_SUPABASE_URL` - Referenced in client/server files (but not actively used)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Referenced in client/server files (but not actively used)

**Status:** Variable names are correct. Only values need updating.

**Note:** Since Supabase client isn't actively used, these env vars are optional but should be set for future use.

### 3. API Route Authentication ✅

**Search Results:** No direct REST API calls to Supabase found.

**Status:** All Supabase access (if any) would be via SDK, which handles headers automatically.

**Finding:** Your 500 errors in `/api/wishlist` and `/api/orders` are **NOT related to Supabase**. They use Prisma directly and are likely database connection issues (DATABASE_URL).

### 4. SDK Version ✅

**Current:** `@supabase/supabase-js@2.45.0`  
**Required:** `>= 2.39.0`

**Status:** Compatible ✅

### 5. Edge Functions ✅

**Search Results:** No Edge Functions found in codebase.

**Status:** N/A - If you add them later, use `--no-verify-jwt` flag.

### 6. Middleware ✅

**File:** `middleware.ts` (lines 1-28)

**Status:** Only logs requests. No Supabase interaction. No changes needed.

### 7. Direct REST API Calls ✅

**Search Results:** No direct `fetch()` calls to Supabase REST API found.

**Status:** All access (if any) would be via SDK. No manual header updates needed.

---

## 🎯 Key Insights

### ⚠️ Important Discovery

**The Supabase client files exist but are NOT actively used:**

- ✅ Client files: `src/lib/supabase/client.ts` and `server.ts` exist
- ❌ **No imports found:** No code imports or uses these files
- ✅ **App uses Prisma:** All database access is via Prisma ORM
- ✅ **500 errors are NOT Supabase-related:** They're Prisma/database connection issues

### What This Means

1. **Migration is safe:** Since Supabase client isn't used, updating env vars won't break anything
2. **500 errors are separate:** Your `/api/wishlist` and `/api/orders` 500 errors are from Prisma/database connection, not Supabase keys
3. **Future-proof:** Setting up env vars now prepares for future Supabase features

---

## 🚨 About Your 500 Errors

### The Real Issue

Your 500 errors in `/api/wishlist` and `/api/orders` are **NOT related to Supabase key migration**.

**These routes:**
- Use Prisma directly (not Supabase client)
- Query PostgreSQL via `DATABASE_URL`
- Fail due to database connection issues

**Likely causes:**
1. `DATABASE_URL` is incorrect or missing in Vercel
2. Database password was reset but Vercel wasn't updated
3. Database connection pool exhausted
4. Network/firewall blocking connection

**Fix:** See `docs/FIX_DATABASE_CONNECTION.md` for database connection troubleshooting.

---

## 📝 Migration Steps (Summary)

1. ✅ **Get new keys** from Supabase dashboard
2. ✅ **Update `.env.local`** with new `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. ✅ **Update Vercel** environment variables
4. ✅ **Test locally** - restart dev server, check for errors
5. ✅ **Deploy to production** - `vercel --prod`
6. ✅ **Test production** - verify no errors in logs

**Estimated Time:** 5-10 minutes  
**Risk Level:** Low (backward compatible, can rollback)

---

## 🔐 Security Notes

### Key Types

- **Publishable Anon Key** (`sb_publishable_...`):
  - ✅ Safe for client-side use
  - ✅ Used in `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - ✅ Can be exposed in browser

- **Secret Key** (`sb_secret_...`):
  - ❌ **NEVER** use in client-side code
  - ❌ **NEVER** expose in browser
  - ✅ Server-only (if you need it later)

### Current Usage

Your app only uses the **anon key** (publishable), which is correct and safe.

---

## 📚 References

- [Supabase API Key Migration Docs](https://supabase.com/docs/guides/api/api-keys)
- [Supabase JS SDK Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase SSR Package](https://supabase.com/docs/guides/auth/server-side/creating-a-client)

---

## ✅ Post-Migration Verification

After migration, verify:

- [ ] Local dev server starts without errors
- [ ] No Supabase errors in browser console
- [ ] No Supabase errors in Vercel logs
- [ ] All Supabase features work (if any are used)
- [ ] Production deployment successful

---

**Migration Status:** ✅ Ready to migrate - just update environment variables!

**Next Action:** Get new keys from Supabase dashboard and update environment variables.
