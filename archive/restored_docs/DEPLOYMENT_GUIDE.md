# 🚀 Deployment Guide - Making Your Site Live

## Quick Answer

**Yes, you need to push to GitHub** (if using Vercel with GitHub integration), and then **Vercel will automatically deploy** your site within 1-2 minutes.

---

## 📋 Step-by-Step Deployment Process

### Step 1: Test Build Locally (IMPORTANT!)

Before deploying, make sure everything builds correctly:

```powershell
# Test the build locally
bun run build
```

If this fails, fix any errors before proceeding. **A failed local build will fail on Vercel too.**

---

### Step 2: Commit and Push to GitHub

```powershell
# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "Complete site rebuild: Phases 1-14 - UI, SEO, Performance, Accessibility"

# Push to GitHub (main branch)
git push origin main

# OR if you're on a different branch:
git push origin [your-branch-name]
```

**Note:** Make sure your GitHub repository is connected to Vercel (see Step 4 if not set up yet).

---

### Step 3: Verify Your Changes Are Pushed

Check GitHub to confirm your latest commit is there:
- Go to `https://github.com/[your-username]/kollect-it-marketplace-1`
- Verify the latest commit shows your changes

---

### Step 4: Vercel Deployment (Automatic)

If Vercel is already connected to your GitHub repo:

1. **Automatic Deployment** - Vercel detects the push within ~30 seconds
2. **Building** - Takes 2-3 minutes
3. **Live** - Your site updates automatically at `https://kollect-it.vercel.app` (or your custom domain)

**Check Deployment Status:**
- Go to: https://vercel.com/dashboard
- Click on your `kollect-it` project
- Watch the deployment progress in real-time

---

### Step 5: Set Environment Variables in Vercel

**⚠️ CRITICAL:** If this is your first deployment or you added new env vars, you MUST add them in Vercel:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add all these variables:

#### Required Environment Variables:

```env
# Database (PostgreSQL - Supabase or similar)
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth Authentication
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://kollect-it.vercel.app

# Stripe Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...

# ImageKit (if using)
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...

# Email Service (Resend - if using)
RESEND_API_KEY=re_...

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Drive API (if using for image sync)
GOOGLE_DRIVE_CLIENT_ID=...
GOOGLE_DRIVE_CLIENT_SECRET=...
GOOGLE_DRIVE_REFRESH_TOKEN=...

# OpenAI/Claude (if using AI features)
OPENAI_API_KEY=sk-... (or ANTHROPIC_API_KEY=...)
```

**How to Generate NEXTAUTH_SECRET:**
```powershell
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**OR using OpenSSL (if installed):**
```bash
openssl rand -base64 32
```

3. **Important:** After adding env vars, you need to **redeploy**:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**

---

## 🔍 Troubleshooting Deployment

### Build Fails?

1. **Check Build Logs** in Vercel Dashboard
2. **Common Issues:**
   - Missing environment variables → Add them in Vercel Settings
   - TypeScript errors → Run `bun run typecheck` locally
   - Database connection → Verify `DATABASE_URL` is correct
   - Prisma schema issues → Run `bun x prisma generate` locally first

### Site Works But Features Don't?

- Check environment variables are set correctly
- Verify database migrations ran: `bun run db:migrate:deploy` (if needed)
- Check Vercel Function Logs for API errors

### Changes Not Showing?

1. **Hard refresh** browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Clear browser cache**
3. Check deployment status - might still be building
4. Verify the correct branch is deployed (check Vercel project settings)

---

## 🎯 Quick Deployment Checklist

Before pushing to GitHub:

- [ ] `bun run build` succeeds locally
- [ ] `bun run typecheck` passes
- [ ] All environment variables documented
- [ ] Test key features locally (cart, checkout, product pages)

After pushing:

- [ ] Verified push to GitHub successful
- [ ] Vercel deployment started automatically
- [ ] Build completed successfully
- [ ] Environment variables added in Vercel
- [ ] Site loads at production URL
- [ ] Test key features on live site

---

## 🔄 Manual Deployment (Alternative)

If GitHub integration isn't set up, you can deploy manually:

1. **Install Vercel CLI:**
   ```powershell
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```powershell
   vercel login
   ```

3. **Deploy:**
   ```powershell
   vercel --prod
   ```

**Note:** Manual deployment still requires environment variables to be set in Vercel Dashboard.

---

## 📍 After Deployment

1. **Test Your Site:**
   - Visit your production URL
   - Test product pages
   - Test cart and checkout (use Stripe test mode first!)
   - Test search functionality
   - Verify images load correctly

2. **Set Up Custom Domain** (Optional):
   - Go to Vercel Project → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed
   - Update `NEXTAUTH_URL` to your custom domain

3. **Monitor:**
   - Check Vercel Analytics (if enabled)
   - Monitor error logs in Vercel Dashboard
   - Set up error tracking (Sentry, etc.)

---

## 🆘 Need Help?

**Vercel Dashboard:** https://vercel.com/dashboard  
**Vercel Docs:** https://vercel.com/docs  
**Your Project:** Check your Vercel dashboard for the exact URL

**Common Commands:**
```powershell
# Test build
bun run build

# Check types
bun run typecheck

# Test production build locally
bun run build
bun run start
# Then visit http://localhost:3000
```

---

## ✅ You're Live!

Once deployment completes, your site is live at:
- **Vercel URL:** `https://kollect-it.vercel.app` (or your custom domain)
- All pages are accessible
- Changes will auto-deploy on future pushes to main branch

**🎉 Congratulations! Your Kollect-It marketplace is now live!**
