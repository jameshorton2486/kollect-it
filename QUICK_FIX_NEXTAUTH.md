# Quick Fix: Add NEXTAUTH_URL to Vercel

## Step-by-Step Instructions

### Step 1: Add NEXTAUTH_URL

Run this command in your terminal:

```powershell
vercel env add NEXTAUTH_URL production
```

**When prompted:**
1. **Value:** Type: `https://kollect-it-marketplace-1.vercel.app`
2. **Apply to:** Select `Production` (press Enter or type `production`)

### Step 2: Verify It Was Added

```powershell
vercel env ls | Select-String "NEXTAUTH"
```

You should see:
```
NEXTAUTH_URL    production    https://kollect-it-marketplace-1.vercel.app
```

### Step 3: Redeploy Production

```powershell
vercel --prod
```

Wait for deployment to complete (usually 1-2 minutes).

### Step 4: Test Production

Visit: https://kollect-it-marketplace-1.vercel.app

The authentication should now work correctly!

---

## Troubleshooting

**If the command doesn't work:**
- Make sure you're logged into Vercel: `vercel login`
- Check you're in the correct project directory
- Try: `vercel env add NEXTAUTH_URL` (without "production" first, then select environment)

**If you need to update the value:**
```powershell
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production
```

**For localhost:**
Make sure `.env.local` has:
```env
NEXTAUTH_URL=http://localhost:3000
```
(Note: Use port **3000**, not 300)

---

**After completing these steps, your production site will have working authentication!** ✅
