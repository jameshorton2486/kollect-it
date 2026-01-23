# Supabase API Key Migration Guide

**Project:** Kollect-It  
**Project ID:** `xqrroyyqrgdytzpcckwk`  
**Migration Date:** 2026-01-22

---

## ✅ Audit Results Summary

### Current State: **READY FOR MIGRATION**

Your codebase is already compatible with new opaque keys. The `@supabase/ssr` package handles the key format automatically.

---

## 📋 Pre-Migration Checklist

- [x] **SDK Versions:** `@supabase/supabase-js@2.45.0` (>= 2.39.0) ✓
- [x] **SSR Package:** `@supabase/ssr@0.5.2` ✓
- [x] **Client Setup:** Uses `createBrowserClient` from `@supabase/ssr` ✓
- [x] **Server Setup:** Uses `createServerClient` from `@supabase/ssr` ✓
- [x] **No Direct REST Calls:** No manual `fetch()` to Supabase REST API ✓
- [x] **Middleware:** No Supabase auth interaction ✓
- [x] **Edge Functions:** None found ✓

---

## 🔧 Required Changes

### 1. Update Environment Variables

#### Local Development (`.env.local`)

```env
# OLD (Legacy JWT keys - ~217 chars, starts with eyJ)
NEXT_PUBLIC_SUPABASE_URL=https://xqrroyyqrgdytzpcckwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NEW (Opaque keys - ~47 chars, starts with sb_publishable_)
NEXT_PUBLIC_SUPABASE_URL=https://xqrroyyqrgdytzpcckwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_your_new_opaque_key_here
```

**Where to get new keys:**
1. Go to: https://supabase.com/dashboard/project/xqrroyyqrgdytzpcckwk/settings/api
2. Under "Project API keys", find "Publishable anon key"
3. Copy the new `sb_publishable_...` key
4. Replace `NEXT_PUBLIC_SUPABASE_ANON_KEY` value

#### Vercel Production

1. Go to: https://vercel.com/dashboard
2. Select project: `kollect-it-marketplace-1`
3. Settings → Environment Variables
4. Find `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Edit"
6. Paste new `sb_publishable_...` key
7. Select "Production" environment
8. Save
9. **Redeploy:** Go to Deployments → Latest → "..." → "Redeploy"

---

### 2. Environment Variable Validation (Optional but Recommended)

The following files have been updated to validate Supabase env vars:

- ✅ `src/lib/env/schema.ts` - Added Supabase vars to client schema
- ✅ `src/lib/env/validate.ts` - Added Supabase vars to validation

**No code changes needed** - the SDK handles opaque keys automatically.

---

## 🚫 What You DON'T Need to Change

### ✅ Already Compatible

1. **Supabase Client Files:**
   - `src/lib/supabase/client.ts` - Uses `createBrowserClient` (auto-compatible)
   - `src/lib/supabase/server.ts` - Uses `createServerClient` (auto-compatible)

2. **No Manual Headers:**
   - No `Authorization: Bearer` headers in your code
   - SDK handles `apikey` header automatically

3. **No Direct REST Calls:**
   - No `fetch()` calls to Supabase REST API found
   - All access via SDK (which handles new keys)

4. **Middleware:**
   - `middleware.ts` only logs requests
   - No Supabase auth interaction

---

## 🧪 Testing Checklist

After updating environment variables:

### 1. Local Testing

```powershell
# 1. Update .env.local with new keys
# 2. Restart dev server
bun run dev

# 3. Test Supabase client initialization
# Open browser console and check for errors
```

**Expected:** No errors, Supabase client initializes successfully

### 2. Verify Client-Side Usage

```typescript
// In any component or page
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
// Should work without errors
```

### 3. Verify Server-Side Usage

```typescript
// In any API route or server component
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
// Should work without errors
```

### 4. Production Testing

1. **Deploy to Vercel:**
   ```powershell
   vercel --prod
   ```

2. **Test Production URLs:**
   - Homepage: https://kollect-it.com
   - Check browser console for Supabase errors
   - Test any features that use Supabase

3. **Check Vercel Logs:**
   ```powershell
   vercel logs https://kollect-it.com
   ```
   Look for Supabase-related errors

---

## 🔍 Troubleshooting

### Error: "Invalid API key"

**Cause:** Still using old JWT key format

**Fix:**
1. Verify you copied the new `sb_publishable_...` key (not the old `eyJ...` key)
2. Check key length: new keys are ~47 chars, old keys are ~217 chars
3. Restart dev server after updating `.env.local`

### Error: "Failed to fetch" or Network Error

**Cause:** Key format mismatch or incorrect URL

**Fix:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` starts with `sb_publishable_`
3. Check Vercel environment variables are updated

### Error: "Unauthorized" or 401

**Cause:** Using service role key instead of anon key

**Fix:**
- Ensure you're using the **anon** key (publishable), not service role key
- Anon key: `sb_publishable_...`
- Service role key: `sb_secret_...` (server-only, not for client)

---

## 📝 Migration Steps (Summary)

1. ✅ **Get new keys** from Supabase dashboard
2. ✅ **Update `.env.local`** with new `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. ✅ **Update Vercel** environment variables
4. ✅ **Test locally** - restart dev server, check for errors
5. ✅ **Deploy to production** - `vercel --prod`
6. ✅ **Test production** - verify no errors in logs

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

**Migration Status:** Ready to migrate - just update environment variables!
