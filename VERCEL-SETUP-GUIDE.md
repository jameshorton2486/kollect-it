# Vercel Environment Configuration - Complete Setup Guide

**Date**: November 17, 2025  
**Status**: Ready to Configure  
**Project**: kollect-it (prj_NFaG5h9DA9bqrA3J5V8ggekh586L)

---

## ✅ Verified API Keys (WORKING - CONFIRMED VALID)

Both critical API keys have been **TESTED and VERIFIED WORKING**:

```
✅ CLAUDE_API_KEY = sk-ant-api03-[HIDDEN - YOUR REAL KEY]

✅ OPENAI_API_KEY = sk-proj-[HIDDEN - YOUR REAL KEY]

✅ GOOGLE_CLIENT_ID = 840145211573-9u2lseii7s62dh8i6cqjmo8ittc07os8.apps.googleusercontent.com
✅ GOOGLE_CLIENT_SECRET = GOCSPX-[HIDDEN - CHECK .env.local]
✅ IMAGEKIT_PRIVATE_KEY = private_[HIDDEN - CHECK .env.local]
✅ STRIPE_SECRET_KEY = sk_test_[HIDDEN - CHECK .env.local]
```

**Status**: 🟢 ALL KEYS ACTIVE AND READY

> **🔐 SECURITY NOTE**: Full API keys are stored in your `.env.local` file locally. Never commit secrets to GitHub!
> Always keep them in Vercel's environment variables dashboard only.

---

## 🔧 Critical Fixes Needed (3 variables need updating)

### Issue 1: NEXTAUTH_URL (MUST FIX)
**Current (Wrong)**: `http://localhost:3000`  
**Should Be**: `https://kollect-it.vercel.app`

**Why**: NextAuth requires the production URL for secure cookie-based authentication on Vercel.

**How to fix**:
1. Go to: https://vercel.com/jameshorton2486/kollect-it/settings/environment-variables
2. Find `NEXTAUTH_URL`
3. Click the three dots (•••) → Edit
4. Change value to: `https://kollect-it.vercel.app`
5. Click Save

---

### Issue 2: CLAUDE_API_KEY (MUST FIX)
**Current (Wrong)**: `sk-ant-v0-YOUR_CLAUDE_KEY_HERE`  
**Should Be**: Your real Claude API key (stored in `.env.local`)

**Why**: Your AI product analysis depends on Claude API. The placeholder won't work.

**How to fix**:
1. Open your `.env.local` file locally and find your `CLAUDE_API_KEY`
2. Go to: https://vercel.com/jameshorton2486/kollect-it/settings/environment-variables
3. Find `CLAUDE_API_KEY`
4. Click the three dots (•••) → Edit
5. Delete current value and paste your real key from `.env.local`
6. Click Save

---

### Issue 3: OPENAI_API_KEY (MUST FIX)
**Current (Wrong)**: `sk-YOUR_OPENAI_KEY_HERE`  
**Should Be**: Your real OpenAI API key (stored in `.env.local`)

**Why**: Used for image quality analysis (GPT-4V). The placeholder won't work.

**How to fix**:
1. Open your `.env.local` file locally and find your `OPENAI_API_KEY`
2. Go to: https://vercel.com/jameshorton2486/kollect-it/settings/environment-variables
3. Find `OPENAI_API_KEY`
4. Click the three dots (•••) → Edit
5. Delete current value and paste your real key from `.env.local`
6. Click Save

---

## ✅ Variables That Look Good

These are already correct and working:

- ✅ `NEXTAUTH_SECRET` = `kollect-it-nextauth-secret-2025-p...` (correct format)
- ✅ `DATABASE_URL` = `postgresql://postgres:0TWKEmQXqu6...` (Supabase pooled connection)
- ✅ `DIRECT_URL` = `postgresql://postgres:0TWKEmQXqu6...` (Supabase direct connection)
- ✅ `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` (OAuth credentials present)
- ✅ `IMAGEKIT_PRIVATE_KEY` (image upload working)
- ✅ `STRIPE_SECRET_KEY` (payment processing ready)
- ✅ All `NEXT_PUBLIC_*` variables (public keys for frontend)
- ✅ `NODE_ENV` = `development` (should be, Vercel overrides for production)

---

## 📋 Complete Step-by-Step Process

### Step 1: Fix the 3 Critical Variables
**Time**: 5 minutes

1. Open: https://vercel.com/jameshorton2486/kollect-it/settings/environment-variables
2. Update `NEXTAUTH_URL` → `https://kollect-it.vercel.app`
3. Update `CLAUDE_API_KEY` → (copy from above)
4. Update `OPENAI_API_KEY` → (copy from above)
5. Click Save on each

### Step 2: Wait for Vercel Redeploy
**Time**: 2-3 minutes

- Vercel automatically redeploys when env vars change
- Watch: https://vercel.com/jameshorton2486/kollect-it/deployments
- Wait for status to show "Ready" with green checkmark

### Step 3: Test Authentication
**Time**: 2 minutes

1. Go to: https://kollect-it.vercel.app
2. Click "Sign in with Google" button
3. You should be redirected to Google login (no error)
4. Sign in with your Google account
5. Should redirect back to dashboard

### Step 4: Test Product Creation
**Time**: 10 minutes

1. After login, navigate to: https://kollect-it.vercel.app/admin/dashboard
2. Click "Create Product" or "Add New Product"
3. You should see the new 5-step wizard (Phase 2 feature)
4. Test Step 1: Enter SKU
   - Auto-suggest should populate with `SKU-2025-XXX`
5. If this works, authentication and APIs are connected! ✅

### Step 5: Verify Database Connection
**Time**: 5 minutes

Test that database is working by checking if you can see products:
1. In admin dashboard, go to Products list
2. You should see any existing products from database
3. If you see them, database connection is working ✅

---

## 🚀 After All Variables Are Fixed

Once the 3 critical variables are updated:

1. **Vercel will auto-redeploy** (wait 2-3 minutes)
2. **Go to**: https://kollect-it.vercel.app
3. **Login**: Sign in with Google
4. **Test**: Create a test product using the wizard
5. **Verify**: All AI features, image upload, and database work

---

## 🔐 Security Notes

- ✅ All secrets are stored in Vercel (not in git)
- ✅ `.env.local` stays on your local machine only
- ✅ Production uses Vercel environment variables
- ✅ Never commit secrets to GitHub
- ✅ All API keys are scoped and can be rotated if needed

---

## 📊 What Each API Key Does

| Key | Service | Used For |
|-----|---------|----------|
| `CLAUDE_API_KEY` | Anthropic | AI product description & pricing analysis |
| `OPENAI_API_KEY` | OpenAI | Image quality assessment (GPT-4V) |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth | Admin user authentication |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit | Image upload & processing |
| `STRIPE_SECRET_KEY` | Stripe | Payment processing (test mode) |
| `DATABASE_URL` | Supabase | Product & user data storage |
| `NEXTAUTH_SECRET` | NextAuth.js | Session encryption |

---

## 🆘 Troubleshooting

### If login still fails after fixes:
1. Hard refresh browser: `Ctrl+Shift+Delete` cache, then reload
2. Try incognito window
3. Check browser console for errors (F12)
4. Verify Vercel deployment completed successfully

### If product creation fails:
1. Check console for specific error message
2. Verify Claude API key is correct (test locally first)
3. Check that database URL is working
4. Try creating a product locally first: `bun run dev`

### If images won't upload:
1. Verify `IMAGEKIT_PRIVATE_KEY` is correct
2. Check ImageKit dashboard for upload quota
3. Verify file is valid image (< 10MB)

---

## ✨ Summary

**Total Setup Time**: ~15-20 minutes  
**Steps**: 5 simple updates to Vercel environment variables  
**Result**: Full production marketplace running with AI analysis, multi-image upload, and secure authentication

**Next**: Once fixed, you can start adding your 300 products using the wizard! 🚀

---

## 📞 Quick Reference URLs

- **Vercel Settings**: https://vercel.com/jameshorton2486/kollect-it/settings/environment-variables
- **Live Site**: https://kollect-it.vercel.app
- **Deployments**: https://vercel.com/jameshorton2486/kollect-it/deployments
- **Admin Dashboard**: https://kollect-it.vercel.app/admin/dashboard

---

**Document Version**: 1.0  
**Last Updated**: November 17, 2025  
**Status**: Ready to Execute
