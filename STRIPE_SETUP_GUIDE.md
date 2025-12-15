# 🔐 Stripe Keys Setup Guide

## ⚠️ **CRITICAL: Your Keys Are Invalid**

The keys you provided don't match Stripe's format:

- ❌ `mk_1SVEOm2S5gMz990a4obbuG4p` - Invalid (should start with `pk_` or `sk_`)
- ❌ `mk_1SVEk12S5gMz990aLGfyCnAX` - Invalid (should start with `pk_` or `sk_`)
- ✅ `pk_live_51SVEOj2S5gMz990aFW1rKsR3VoBdXJQLGLkusApOrB6ejmHTwBnBsvXHRHqiIFk0cGdEAjgCmH17PhOUWjqRX2uG007EtPSUJb` - Valid publishable key

## 📋 **How to Get Correct Stripe Keys**

### Step 1: Get Test Keys (for Development)

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...` - click "Reveal test key")

### Step 2: Add Test Keys to `.env.local`

Open `c:\Users\james\kollect-it-marketplace-1\.env.local` and add:

```env
# Stripe - TEST Keys (for local development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_ACTUAL_KEY_HERE"
STRIPE_SECRET_KEY="sk_test_YOUR_ACTUAL_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET_HERE"  # Optional for now
```

**⚠️ Replace `YOUR_ACTUAL_KEY_HERE` with your real keys from Stripe Dashboard**

### Step 3: Get Live Keys (for Production)

**⚠️ Only do this when ready for real payments!**

1. Go to: https://dashboard.stripe.com/apikeys (make sure you're in **Live mode** - toggle in top right)
2. Copy:
   - **Publishable key** (starts with `pk_live_...`)
   - **Secret key** (starts with `sk_live_...`)

### Step 4: Add Live Keys to Vercel

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add these for **Production** environment:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_YOUR_KEY`
   - `STRIPE_SECRET_KEY` = `sk_live_YOUR_KEY`
   - `STRIPE_WEBHOOK_SECRET` = `whsec_YOUR_KEY` (get from Webhooks section)

3. Click **Save** and **Redeploy**

---

## ✅ **Verification**

After adding keys, test locally:

```bash
# Restart dev server
bun run dev

# Test Stripe connection
bun run scripts/test-services.ts
```

You should see: `✅ Connected to Stripe`

---

## 🚨 **Security Reminders**

1. ❌ **Never commit `.env.local`** - it's already in `.gitignore`
2. ❌ **Never paste keys in chat/email** - they're now exposed, rotate them
3. ✅ **Use test keys for development**
4. ✅ **Use live keys only in Vercel production environment**

---

## 🔄 **If Keys Were Exposed**

If you think these keys were exposed in chat/commits:

1. Go to Stripe Dashboard → Developers → API keys
2. Click "Reset" or "Roll key" next to each exposed key
3. Update `.env.local` and Vercel with new keys
