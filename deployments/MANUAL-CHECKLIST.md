# 📋 KOLLECT-IT MANUAL TASKS CHECKLIST

**Purpose:** Complete these tasks that cannot be automated. Each task has exact steps and verification.

**Status:** Check off `[ ]` as you complete each item.

---

## 🚨 **CRITICAL - MUST DO BEFORE GITHUB PUSH**

### Task 1: Rotate Leaked Secrets

**Why:** Your GitHub push is blocked because these secrets were committed in `f4cb3f`:
- Google OAuth Client ID
- Google OAuth Client Secret  
- Anthropic API Key

**Steps:**

#### 1A. Rotate Google OAuth Credentials

1. Go to: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your Kollect-It project
3. Find the OAuth 2.0 Client ID that matches the leaked one
4. **Delete it completely** (don't just regenerate - DELETE)
5. Click **"+ CREATE CREDENTIALS" → "OAuth 2.0 Client ID"**
6. Application type: **Web application**
7. Name: `Kollect-It Production OAuth`
8. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://kollect-it.vercel.app/api/auth/callback/google
   https://www.kollect-it.com/api/auth/callback/google
   ```
9. Click **CREATE**
10. Copy the new **Client ID** and **Client Secret**
11. Update in `.env`:
    ```env
    GOOGLE_CLIENT_ID=your-new-client-id.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=your-new-client-secret
    ```

**Verification:**
- [ ] Old OAuth client deleted from Google Cloud
- [ ] New credentials in `.env`
- [ ] New credentials added to Vercel environment variables

---

#### 1B. Rotate Anthropic API Key

1. Go to: [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Find the API key that matches `sk-ant-api03-...` from the leak
3. Click the **trash icon** to delete it
4. Click **"+ Create Key"**
5. Name: `Kollect-It Production`
6. Copy the new key (starts with `sk-ant-api03-...`)
7. Update in `.env`:
   ```env
   CLAUDE_API_KEY=sk-ant-api03-your-new-key
   ```

**Verification:**
- [ ] Old API key deleted from Anthropic Console
- [ ] New key in `.env`
- [ ] New key added to Vercel environment variables

---

#### 1C. Unblock GitHub Push

After rotating secrets above:

**Option A: Use GitHub's Unblock Links (Easiest)**
1. Open the three URLs from your terminal output:
   - [Unblock Google OAuth Client ID](https://github.com/jameshorton2486/kollect-it/security/secret-scanning/unblock-secret/35bwQnI5p1m6dwUx1zMU5OLhoLk)
   - [Unblock Google OAuth Client Secret](https://github.com/jameshorton2486/kollect-it/security/secret-scanning/unblock-secret/35bwQn03nVCTTfPiApYZZzueauD)
   - [Unblock Anthropic API Key](https://github.com/jameshorton2486/kollect-it/security/secret-scanning/unblock-secret/35bwQnNJznUCtoXdlT9slKXSEO2)

2. For each link, confirm that:
   - You have rotated the secret ✅
   - You want to allow this commit ✅

3. Try pushing again:
   ```powershell
   git push origin main
   ```

**Option B: Clean Git History (Advanced - if Option A doesn't work)**
```powershell
# Install git-filter-repo (if not installed)
# Download from: https://github.com/newren/git-filter-repo

# Backup first
git clone . ../kollect-it-backup

# Remove the file from all history
git filter-repo --path deployment-automation/7-DEPLOY-GUIDE.md --invert-paths --force

# Force push
git push origin main --force
```

**Verification:**
- [ ] `git push origin main` succeeds without secret scanning errors
- [ ] Secrets are ONLY in `.env` and Vercel, not in repo files or history

---

## 🔐 **EXTERNAL SERVICES CONFIGURATION**

### Task 2: Supabase Database Setup

1. Go to: [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Kollect-It project (or create one)
3. Go to **Settings → Database**
4. Copy the **Connection String** (transaction mode)
5. Update `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres"
   ```

6. Test connection:
   ```powershell
   bunx prisma db pull
   ```
   
   Should show: "Introspecting based on your Prisma schema..."

7. Run migrations:
   ```powershell
   bunx prisma migrate deploy
   ```

**Verification:**
- [ ] Database connection successful
- [ ] Migrations deployed without errors
- [ ] Can see tables in Supabase Dashboard → Table Editor

---

### Task 3: Stripe Setup

1. Go to: [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test Mode** (toggle in top right)
3. Copy **Publishable key** and **Secret key**
4. Update `.env`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

5. Set up webhook (for order processing):
   - Go to **Developers → Webhooks**
   - Click **+ Add endpoint**
   - Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy the **Signing secret** (starts with `whsec_`)
   - Add to `.env`:
     ```env
     STRIPE_WEBHOOK_SECRET=whsec_...
     ```

**Verification:**
- [ ] Stripe test keys in `.env`
- [ ] Webhook endpoint created
- [ ] Webhook secret in `.env`

---

### Task 4: ImageKit Setup

1. Go to: [ImageKit Dashboard](https://imagekit.io/dashboard)
2. Go to **Developer Options → API Keys**
3. Copy:
   - **Public Key**
   - **Private Key**
   - **URL Endpoint** (e.g., `https://ik.imagekit.io/yourid`)

4. Update `.env`:
   ```env
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_...
   IMAGEKIT_PRIVATE_KEY=private_...
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/yourid
   ```

5. Test upload:
   ```powershell
   bun run test-imagekit
   ```

**Verification:**
- [ ] ImageKit credentials in `.env`
- [ ] Test upload script succeeds
- [ ] Can see uploaded file in ImageKit Media Library

---

### Task 5: NextAuth Configuration

1. Generate a secure secret:
   ```powershell
   # In PowerShell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   ```

2. Update `.env`:
   ```env
   NEXTAUTH_SECRET=your-generated-secret-here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. For production (Vercel), set:
   ```env
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

**Verification:**
- [ ] NEXTAUTH_SECRET is set (32+ characters)
- [ ] NEXTAUTH_URL matches your domain

---

## 🔧 **CODE FIXES (AI AGENT)**

### Task 6: Run AI Agent Code Fixes

1. Open VS Code in project root
2. Open the file: `AI-AGENT-PROMPT.md`
3. Copy the entire prompt
4. Open VS Code Copilot Chat (or your AI assistant)
5. Paste the prompt
6. Let the AI agent implement all fixes

**The AI will fix:**
- [ ] ImageKit env variable names (NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT)
- [ ] Environment variable alignment in `.env.example`
- [ ] Diagnostic endpoint validation
- [ ] Email configuration structure
- [ ] Stripe soft-fail in development mode

**Verification:**
- [ ] AI agent reports "All fixes completed"
- [ ] Run `bun run typecheck` - should pass
- [ ] Run `bun run build` - should succeed

---

## 🚀 **DEPLOYMENT PREPARATION**

### Task 7: Vercel Setup

1. Go to: [Vercel Dashboard](https://vercel.com/new)
2. Import your GitHub repository: `jameshorton2486/kollect-it`
3. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `bun run build`
   - Output Directory: `.next`

4. Add all environment variables from `.env` to Vercel:
   - Go to **Settings → Environment Variables**
   - Add each variable from your `.env` file
   - Make sure to set **Production** and **Preview** environments

5. Deploy:
   ```
   git push origin main
   ```
   Vercel will auto-deploy

**Verification:**
- [ ] Vercel project created and linked to GitHub
- [ ] All environment variables added to Vercel
- [ ] First deployment succeeds
- [ ] Site loads at `https://your-project.vercel.app`

---

### Task 8: Domain Configuration (Optional)

If you have a custom domain (e.g., `kollect-it.com`):

1. In Vercel, go to **Settings → Domains**
2. Add your domain: `kollect-it.com` and `www.kollect-it.com`
3. Copy the DNS records shown
4. Go to your domain registrar (GoDaddy, Namecheap, etc.)
5. Add the DNS records:
   - `A` record: `76.76.21.21` (Vercel IP)
   - `CNAME` for www: `cname.vercel-dns.com`

6. Wait 5-60 minutes for DNS propagation

**Verification:**
- [ ] Domain added in Vercel
- [ ] DNS records configured
- [ ] Site loads at your custom domain

---

## ✅ **FINAL TESTING & QA**

### Task 9: Manual QA Checklist

Test these flows in production (or Vercel preview):

#### Authentication
- [ ] Can sign up with email/password
- [ ] Can sign in with email/password
- [ ] Can sign in with Google OAuth
- [ ] Can sign out
- [ ] Password reset email sends and works

#### Product Catalog
- [ ] Homepage loads all products
- [ ] Product images load via ImageKit
- [ ] Product detail page shows all info
- [ ] Search works
- [ ] Filters work

#### Shopping Cart
- [ ] Can add product to cart
- [ ] Cart persists across pages
- [ ] Can update quantity
- [ ] Can remove items
- [ ] Cart total calculates correctly

#### Checkout
- [ ] Checkout page loads
- [ ] Stripe payment form loads
- [ ] Test card works: `4242 4242 4242 4242`
- [ ] Order confirmation page shows
- [ ] Order appears in Supabase database
- [ ] Confirmation email sends (if configured)

#### Admin Panel (if applicable)
- [ ] Can access admin dashboard
- [ ] Can view orders
- [ ] Can update product inventory
- [ ] Can manage users

#### Performance
- [ ] Homepage loads in < 3 seconds
- [ ] Product page loads in < 2 seconds
- [ ] No console errors in browser DevTools
- [ ] Lighthouse score > 80 for Performance

**Verification:**
- [ ] All critical flows tested and working
- [ ] No major bugs found
- [ ] Performance is acceptable

---

## 📊 **GO-LIVE DECISION**

### Task 10: Final Checklist Review

Before going live, confirm ALL of these are complete:

**Environment:**
- [ ] All secrets rotated and secure
- [ ] GitHub push works without blocks
- [ ] All environment variables set in Vercel
- [ ] Database migrations deployed to production

**Services:**
- [ ] Supabase database accessible
- [ ] Stripe in test mode (switch to live after testing)
- [ ] ImageKit serving images correctly
- [ ] Email sending works (if configured)

**Code Quality:**
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Build succeeds locally and in Vercel
- [ ] No critical security warnings

**Testing:**
- [ ] Manual QA completed (Task 9)
- [ ] All critical user flows work
- [ ] Performance acceptable
- [ ] Mobile responsive

**Documentation:**
- [ ] README updated with setup instructions
- [ ] Environment variables documented
- [ ] Deployment process documented

---

## 🎯 **GO-LIVE COMMAND**

When everything above is complete:

```powershell
# Final commit
git add .
git commit -m "Production-ready: All fixes applied and tested"
git push origin main

# Vercel will auto-deploy to production
# Monitor at: https://vercel.com/your-project/deployments
```

**Post-Launch:**
- [ ] Monitor Vercel logs for errors
- [ ] Check Stripe dashboard for test transactions
- [ ] Monitor Sentry/error tracking (if configured)
- [ ] Test live site one more time

---

## 📞 **SUPPORT & TROUBLESHOOTING**

If you encounter issues:

1. **Build fails in Vercel:**
   - Check Vercel build logs
   - Verify all environment variables are set
   - Check if build works locally: `bun run build`

2. **Database connection fails:**
   - Verify DATABASE_URL in Vercel environment variables
   - Check Supabase project status
   - Test connection locally: `bunx prisma db pull`

3. **Stripe payments fail:**
   - Verify webhook endpoint is accessible
   - Check Stripe webhook logs
   - Ensure STRIPE_WEBHOOK_SECRET is correct

4. **Images don't load:**
   - Check ImageKit dashboard for uploaded files
   - Verify NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is correct
   - Check browser console for CORS errors

---

## ✨ **COMPLETION**

When all tasks are checked off:

**You are ready for production launch! 🚀**

Save this file as your deployment record. You can reference it for future updates and maintenance.

**Total Estimated Time:** 2-4 hours (depending on experience with external services)
