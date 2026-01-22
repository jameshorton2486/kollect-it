# Fix Database Connection - Step by Step Guide

**Problem:** SASL authentication failed - database password is incorrect or expired.

---

## Step 1: Reset Database Password in Supabase

1. **Go to Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/xqrroyyqrgdytzpcckwk/settings/database
   - Or navigate: Project → Settings → Database

2. **Reset Password:**
   - Click "Reset Database Password"
   - Generate a new secure password
   - **COPY THE PASSWORD** - you'll need it for the next steps

---

## Step 2: Update Local .env.local

1. **Open `.env.local` file:**
   ```
   C:\Users\james\kollect-it\.env.local
   ```

2. **Update DATABASE_URL:**
   ```env
   DATABASE_URL="postgresql://postgres.xqrroyyqrgdytzpcckwk:[YOUR_NEW_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
   - Replace `[YOUR_NEW_PASSWORD]` with the password from Step 1
   - **Keep the quotes** around the entire string

3. **Update DIRECT_URL:**
   ```env
   DIRECT_URL="postgresql://postgres.xqrroyyqrgdytzpcckwk:[YOUR_NEW_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
   ```
   - Replace `[YOUR_NEW_PASSWORD]` with the same password
   - **Keep the quotes** around the entire string
   - Note: Port 5432 (no pgbouncer parameter)

4. **Save the file**

---

## Step 3: Update Vercel Environment Variables

### Option A: Using Vercel CLI (Recommended)

```powershell
# Set DATABASE_URL for production
vercel env add DATABASE_URL production

# When prompted, paste your DATABASE_URL:
# postgresql://postgres.xqrroyyqrgdytzpcckwk:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Set DIRECT_URL for production
vercel env add DIRECT_URL production

# When prompted, paste your DIRECT_URL:
# postgresql://postgres.xqrroyyqrgdytzpcckwk:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Option B: Using Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your project: `kollect-it`
3. Go to: Settings → Environment Variables
4. **Update DATABASE_URL:**
   - Find `DATABASE_URL`
   - Click "Edit"
   - Paste the new connection string
   - Select "Production" environment
   - Save

5. **Update DIRECT_URL:**
   - Find `DIRECT_URL`
   - Click "Edit"
   - Paste the new connection string
   - Select "Production" environment
   - Save

6. **Redeploy:**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

## Step 4: Test Database Connection

```powershell
cd C:\Users\james\kollect-it

# Test connection
npx tsx scripts/test-db-connection.ts
```

**Expected output:**
```
✅ Database connection successful!
✅ Prisma client initialized
✅ Can query database
```

---

## Step 5: Reset Admin Password

Once the database connection works:

```powershell
npx tsx scripts/fix-admin-auth.ts
```

**After running, login with:**
- Email: `admin@kollect-it.com`
- Password: `KollectIt2024!`

---

## Troubleshooting

### Error: "Can't reach database server"

**Check:**
1. Password is correct (no typos)
2. Connection string format is correct
3. Network/firewall isn't blocking connection

**Fix:**
- Double-check password in Supabase dashboard
- Verify connection string format matches exactly

### Error: "SASL authentication failed"

**Cause:** Password is incorrect or expired

**Fix:**
1. Reset password in Supabase again
2. Update both `.env.local` and Vercel
3. Test connection again

### Error: "Connection timeout"

**Cause:** Network issue or wrong host/port

**Fix:**
- Verify you're using the correct Supabase project
- Check port numbers (6543 for pooled, 5432 for direct)
- Try direct connection first (DIRECT_URL)

---

## Quick Reference: Connection String Format

### DATABASE_URL (Pooled - Port 6543)
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### DIRECT_URL (Direct - Port 5432)
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

**Your Project:**
- Project Ref: `xqrroyyqrgdytzpcckwk`
- Region: `us-east-1` (verify in Supabase dashboard)

---

## Next Steps After Fixing

1. ✅ Database connection works
2. ✅ Admin password reset
3. ✅ Test login at https://kollect-it.com/admin/login
4. ✅ Verify Vercel deployment is working

---

**Need Help?** Check Supabase dashboard for exact connection strings:
https://supabase.com/dashboard/project/xqrroyyqrgdytzpcckwk/settings/database
