# Environment Variable Sync Status

**Date:** 2026-01-27
**Status:** ⚠️ Production environment missing critical keys

---

## 🔍 Current Status

### Desktop App `.env`

- ✅ **PRODUCT_INGEST_API_KEY**: Present (75 characters, no trailing spaces)
  - Value: `kollect-it-FLLkdujgZVJeJuClg502hThAvGxuqfi7FNaxsHt1xVZDXPgJlU34CmkY3r73C-Gx`
- ✅ **File cleaned**: Trailing whitespace removed, LF line endings normalized
- ❌ **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Not present (desktop app may not need this)

### Vercel Production Environment

- ❌ **PRODUCT_INGEST_API_KEY**: **NOT FOUND in production**
- ❌ **NEXT_PUBLIC_SUPABASE_ANON_KEY**: **NOT FOUND in production**
- ❌ **SUPABASE_SERVICE_ROLE_KEY**: **NOT FOUND in production**
- ✅ **NEXTAUTH_URL**: Present (recently fixed to `https://kollect-it.com`)

---

## ⚠️ Critical Issue

**PRODUCT_INGEST_API_KEY is missing from Vercel production environment!**

This explains why you might be getting 401 errors. The desktop app has the key, but Vercel production doesn't have it set.

---

## 🔧 Required Actions

### 1. Add PRODUCT_INGEST_API_KEY to Vercel Production

The desktop app has this key, but it needs to be added to Vercel:

```bash
vercel env add PRODUCT_INGEST_API_KEY production
# When prompted, paste: kollect-it-FLLkdujgZVJeJuClg502hThAvGxuqfi7FNaxsHt1xVZDXPgJlU34CmkY3r73C-Gx
```

**Important:** Make sure there are no trailing spaces or hidden characters when pasting.

### 2. Check Other Environments

The keys might be in `development` or `preview` environment instead of `production`. Check:

```bash
# List all environments
vercel env ls

# Pull from development
vercel env pull .env.local --environment=development

# Pull from preview
vercel env pull .env.local --environment=preview
```

### 3. Add Supabase Keys (if needed)

If your app uses Supabase, add these keys to production:

```bash
# Get values from Supabase Dashboard → Settings → API
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

**Check the format:**

- **Legacy format**: Starts with `eyJ` (JWT token)
- **New Opaque format**: Starts with `sb_` (Opaque token)

If you see `sb_` format, Supabase has migrated to Opaque Tokens.

---

## 📋 Verification Steps

After adding keys to Vercel:

1. **Pull updated values:**

   ```bash
   vercel env pull .env.local --environment=production
   ```

2. **Verify sync:**

   ```bash
   .\scripts\sync-desktop-env.ps1
   ```

3. **Test desktop app connection:**
   - Try publishing a product from the desktop app
   - Should no longer get 401 Unauthorized

---

## 🔍 Supabase Key Format Check

**Question:** What do your Supabase keys start with?

- **`eyJ`** = Legacy JWT format (old)
- **`sb_`** = New Opaque Token format (migrated)

To check, look at your Supabase Dashboard → Settings → API:

- If keys start with `eyJ`, you're on legacy format
- If keys start with `sb_`, Supabase has migrated to Opaque Tokens

**If you see `sb_` format**, you may need to:

1. Update your connection strings in Vercel
2. Ensure your Prisma/Database code handles the new format
3. Check if any code references the old JWT format

---

## 📝 Next Steps

1. ✅ Desktop app `.env` is cleaned and ready
2. ⚠️ **Add PRODUCT_INGEST_API_KEY to Vercel production** (critical)
3. ⚠️ Check if keys exist in development/preview environments
4. ⚠️ Add Supabase keys if your app uses them
5. Test desktop app connection after syncing

---

## 🛠️ Quick Commands

```bash
# Add PRODUCT_INGEST_API_KEY to production
vercel env add PRODUCT_INGEST_API_KEY production

# Check what's in other environments
vercel env ls
vercel env pull .env.local --environment=development

# Sync desktop app after updating Vercel
.\scripts\sync-desktop-env.ps1
```
