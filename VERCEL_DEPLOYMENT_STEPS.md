# 🚀 Vercel Deployment Guide

## Step 1: Prepare Your Code

✅ Make sure all changes are committed:

```bash
git status
git add .
git commit -m "Configure Stripe keys and prepare for deployment"
```

## Step 2: Push to GitHub

```bash
git push origin main
```

Or if using a feature branch, merge it first via Pull Request.

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to**: https://vercel.com/new
2. **Import** your GitHub repository: `jameshorton2486/kollect-it`
3. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave default)
   - Build Command: `bun run build` (or auto-detected)
   - Output Directory: `.next` (auto-detected)
4. **Environment Variables** - Click "Add" and add ALL of these:

#### **Required Environment Variables:**

```env
# Database
DATABASE_URL=your_supabase_connection_string

# Authentication
NEXTAUTH_SECRET=your_32_character_secret
NEXTAUTH_URL=https://your-app.vercel.app

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/

# Stripe - LIVE Keys (Production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Admin
ADMIN_EMAIL=admin@kollect-it.com
ADMIN_PASSWORD=your_secure_password

# Optional: AI Services
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
```

**⚠️ Important:**
- Set environment for: **Production, Preview, Development** (or just Production if you prefer)
- Use **LIVE** Stripe keys (not test keys) for Production
- Get `NEXTAUTH_SECRET`: Run `openssl rand -base64 32` locally

5. **Click "Deploy"**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? Yes
# - Set up and deploy? Yes
# - Override settings? No (unless needed)
```

## Step 4: Configure Stripe Webhook

After deployment, set up Stripe webhook:

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"+ Add endpoint"**
3. **Endpoint URL**: `https://your-app.vercel.app/api/webhooks/stripe`
4. **Events to send**: Select:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_...`)
6. Add it to Vercel as `STRIPE_WEBHOOK_SECRET`
7. Redeploy if needed

## Step 5: Verify Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test:
   - ✅ Homepage loads
   - ✅ Admin login works
   - ✅ Product creation works
   - ✅ Image upload works
   - ✅ Checkout page loads (Stripe Elements)
   - ✅ Test payment with Stripe test card: `4242 4242 4242 4242`

## 🔧 **Troubleshooting**

### Build Fails

- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Check `package.json` build script

### Stripe Not Working

- Verify keys are LIVE keys (not test) in Production
- Check `STRIPE_SECRET_KEY` starts with `sk_live_`
- Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `pk_live_`

### Images Not Loading

- Verify ImageKit keys are set
- Check ImageKit URLs in browser console
- Verify `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` is correct

### Database Connection Issues

- Verify `DATABASE_URL` is correct Supabase connection string
- Check Supabase allows connections from Vercel IPs
- Test connection with `bun run scripts/test-db-connection.ts`

---

## 📋 **Quick Checklist**

Before deploying:

- [ ] All code committed and pushed to GitHub
- [ ] All environment variables documented
- [ ] Stripe LIVE keys ready (not test keys)
- [ ] Stripe webhook endpoint URL known
- [ ] `NEXTAUTH_SECRET` generated
- [ ] `DATABASE_URL` is production Supabase URL
- [ ] ImageKit keys configured

After deploying:

- [ ] Site loads at Vercel URL
- [ ] Admin login works
- [ ] Can create products
- [ ] Images upload and display
- [ ] Stripe checkout page loads
- [ ] Test payment completes successfully

---

## 🆘 **Need Help?**

- Vercel Docs: https://vercel.com/docs
- Stripe Docs: https://stripe.com/docs
- Check deployment logs in Vercel dashboard
