# 🏗️ Development vs Production Environment Variables

## Quick Answer

**Start with DEVELOPMENT credentials** in your `.env.local` file.

Production credentials go in **Vercel Environment Variables** (not in `.env.local`).

---

## 📁 Where to Put Credentials

### Development (Local Machine)

**File**: `.env.local` (at project root)

**Use**: Development/test credentials
- Stripe **test** keys (`pk_test_`, `sk_test_`)
- Development database
- Test email accounts
- `NEXTAUTH_URL=http://localhost:3000`

### Production (Vercel/Hosting Platform)

**Location**: Vercel Dashboard → Environment Variables

**Use**: Production/live credentials
- Stripe **live** keys (`pk_live_`, `sk_live_`)
- Production database
- Production email accounts
- `NEXTAUTH_URL=https://your-domain.com`

---

## 🚀 Step-by-Step Setup

### Step 1: Set Up Development (Now)

Fill in your `.env.local` with **development/test** credentials:

```env
# Development Database (test/development)
DATABASE_URL=postgresql://...dev-database...:6543/postgres?pgbouncer=true

# Development Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-new-for-dev>

# Stripe TEST keys (from Stripe Dashboard → Test mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxx

# Other services - use test/development credentials
```

### Step 2: Set Up Production (When Ready to Deploy)

Add production credentials to **Vercel Environment Variables**:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add each variable for "Production" environment

**Important**: 
- Don't put production credentials in `.env.local`
- Vercel uses its own environment variables for production

---

## 🔑 Key Differences

| Aspect | Development (.env.local) | Production (Vercel) |
|--------|-------------------------|---------------------|
| **Location** | `C:\Users\james\kollect-it-marketplace-1\.env.local` | Vercel Dashboard |
| **Stripe Keys** | Test keys (`pk_test_`, `sk_test_`) | Live keys (`pk_live_`, `sk_live_`) |
| **Database** | Development database | Production database |
| **NEXTAUTH_URL** | `http://localhost:3000` | `https://your-domain.com` |
| **When to Use** | Local development (`bun run dev`) | Deployed app (vercel.com) |

---

## ✅ Recommended Approach

### For Now (Development):

1. ✅ Fill in `.env.local` with **development/test** credentials
2. ✅ Use Stripe test mode keys
3. ✅ Use development database
4. ✅ Test everything locally first

### Later (Production):

1. ⏳ Set up production database
2. ⏳ Get Stripe live keys (when ready for real payments)
3. ⏳ Add all variables to Vercel Environment Variables
4. ⏳ Deploy to production

---

## 🎯 What Should You Do Right Now?

**Add DEVELOPMENT credentials** to your `.env.local`:

1. **Stripe**: Use **test keys** from Stripe Dashboard (test mode toggle)
2. **Database**: Use your **development/test** Supabase database
3. **NEXTAUTH_SECRET**: Generate a new one for development
4. **NEXTAUTH_URL**: Keep as `http://localhost:3000`
5. **All other services**: Use test/development credentials

---

## 📝 Example: Stripe Keys

### Development (.env.local)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEf...  # Test key
STRIPE_SECRET_KEY=sk_test_51AbCdEf...                    # Test key
```

### Production (Vercel)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51XyZwVu...  # Live key
STRIPE_SECRET_KEY=sk_live_51XyZwVu...                    # Live key
```

**Note**: You can have both - test keys in `.env.local` for development, live keys in Vercel for production.

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore` ✅
2. **Use different secrets** for dev and production
3. **Test keys for development** - Can't charge real cards
4. **Live keys only in production** - Vercel environment variables

---

## 🚦 Summary

| Question | Answer |
|----------|--------|
| **What to add now?** | Development/test credentials in `.env.local` |
| **What about production?** | Add later in Vercel Environment Variables |
| **Can I use production keys locally?** | Not recommended - use test keys |
| **When do I need production keys?** | Only when deploying to production |

---

**Bottom Line**: Fill in `.env.local` with **DEVELOPMENT credentials** now. Production credentials go in Vercel later when you're ready to deploy.

---

## 📚 Next Steps

1. Open `.env.local`
2. Fill in with **development/test** credentials
3. Test locally with `bun run dev`
4. Set up production credentials in Vercel when ready to deploy
