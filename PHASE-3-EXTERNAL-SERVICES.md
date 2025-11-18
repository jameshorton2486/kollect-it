# 🚀 PHASE 3: EXTERNAL SERVICES & LIVE DEPLOYMENT

**Status**: Ready to Deploy  
**Date**: November 18, 2025  
**Current URL**: https://kollect-it.vercel.app (temporary)  
**Target URL**: https://kollect-it.com (your custom domain)

---

## 📋 PHASE 3 CHECKLIST

Your tasks in order:

- [ ] **Step 1**: Commit final changes (DONE ✅)
- [ ] **Step 2**: Connect Vercel to GitHub (5 min)
- [ ] **Step 3**: Add environment variables in Vercel (10 min)
- [ ] **Step 4**: Deploy on Vercel (3 min)
- [ ] **Step 5**: Test on Vercel URL (5 min)
- [ ] **Step 6**: Configure custom domain at Bluehost (10 min)
- [ ] **Step 7**: Update DNS records (10 min)
- [ ] **Step 8**: Wait for DNS propagation (1-24 hours)
- [ ] **Step 9**: Configure Stripe webhooks (10 min)
- [ ] **Step 10**: Set up email service (Resend) (15 min)
- [ ] **Step 11**: Production testing (30 min)
- [ ] **Step 12**: Security audit (5 min)

**Total Active Work**: ~90 minutes spread over 1-2 days

---

## ✅ STEP 1: GIT COMMIT (COMPLETE)

```
✅ Working tree clean
✅ All changes committed
✅ Repository up to date
```

---

## 🔧 STEP 2: VERIFY YOU HAVE THESE CREDENTIALS

Before we start, make sure you have:

### Database Credentials ✅
```
DATABASE_URL: postgresql://postgres:KITexas7234*@db.xqrroyyqrgdytzpcckwk.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL: postgresql://postgres:KITexas7234*@db.xqrroyyqrgdytzpcckwk.supabase.co:5432/postgres
```

### API Keys ✅
```
CLAUDE_API_KEY: sk-ant-api03-...
OPENAI_API_KEY: sk-proj-...
IMAGEKIT_PUBLIC_KEY: public_VXQqaBamg3i1ic8FzAFrQa78=
IMAGEKIT_PRIVATE_KEY: private_3E7KSDvS2hdYlhqDbfOga4VTR2I=
```

### Accounts You Should Have ✅
```
Vercel Account: (GitHub login)
Bluehost Account: (for your domain)
Stripe Account: (for payments)
Optional: Resend Account (for emails)
```

---

## 🚀 STEP 3: SET UP VERCEL DEPLOYMENT

### Your Project Status:
```
✅ Code: Complete
✅ Database: Connected
✅ Admin Users: Created
✅ Build: Verified (0 errors)
✅ Git: Committed
```

### What Happens Next:
Vercel will:
1. Clone your GitHub repository
2. Install dependencies
3. Run `next build`
4. Deploy to production
5. Give you a temporary URL

### Current Temporary URL:
```
https://kollect-it.vercel.app
```

This should already be deployed from earlier. **Check it now:**
- Go to: https://kollect-it.vercel.app/admin/login
- Try login with: admin@kollect-it.com / admin@KI-2025

---

## 📊 ENVIRONMENT VARIABLES FOR VERCEL

You need to add these to Vercel's environment settings.

### Step 3A: Go to Vercel Dashboard

1. Login to: https://vercel.com
2. Find your project: "kollect-it" or "kollect-it-marketplace-1"
3. Click: Settings → Environment Variables

### Step 3B: Add These Variables

**Database (copy from your .env):**
```
Name: DATABASE_URL
Value: postgresql://postgres:KITexas7234*@db.xqrroyyqrgdytzpcckwk.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1

Name: DIRECT_URL
Value: postgresql://postgres:KITexas7234*@db.xqrroyyqrgdytzpcckwk.supabase.co:5432/postgres
```

**NextAuth:**
```
Name: NEXTAUTH_URL
Value: https://kollect-it.vercel.app
(We'll update this to kollect-it.com after domain setup)

Name: NEXTAUTH_SECRET
Value: kollect-it-secret-2025
(Or generate new if you prefer)
```

**ImageKit:**
```
Name: NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
Value: public_VXQqaBamg3i1ic8FzAFrQa78=

Name: IMAGEKIT_PRIVATE_KEY
Value: private_3E7KSDvS2hdYlhqDbfOga4VTR2I=

Name: NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
Value: https://ik.imagekit.io/kollectit
```

**AI APIs (optional - you can add later):**
```
Name: CLAUDE_API_KEY
Value: sk-ant-api03-...

Name: OPENAI_API_KEY
Value: sk-proj-...
```

**Stripe (optional - can add later):**
```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_...

Name: STRIPE_SECRET_KEY
Value: sk_test_...

Name: STRIPE_WEBHOOK_SECRET
Value: (leave empty for now)
```

### Step 3C: Click Save

After each variable, click "Save" or "Add"

### Step 3D: Redeploy

Go to: Vercel Deployments tab
Click: "Redeploy" or wait for automatic redeploy

---

## 🌐 STEP 4: CONFIGURE CUSTOM DOMAIN

### Prerequisites:
- ✅ kollect-it.com is registered (at Bluehost)
- ✅ Vercel project is deployed
- ✅ You have Bluehost login access

### Step 4A: Add Domain in Vercel

1. Go to: Vercel Project → Settings → Domains
2. Click: "Add Domain"
3. Enter: `kollect-it.com`
4. Click: "Add"
5. Also add: `www.kollect-it.com`
6. Click: "Add"

**Vercel will show DNS records needed:**
```
Type: A
Host: @
Value: 76.76.21.21

Type: CNAME
Host: www
Value: cname.vercel-dns.com.
```

**Keep this page open!**

---

### Step 4B: Update DNS at Bluehost

1. Login to: https://my.bluehost.com
2. Go to: Domains → kollect-it.com
3. Click: "DNS" or "Advanced DNS"

**Delete old records:**
- Find any A records pointing to Bluehost
- Click delete
- Confirm

**Add new records from Vercel:**

**Record 1 (A Record):**
- Type: A
- Host: @ (or left blank)
- Points to: 76.76.21.21
- TTL: 14400
- Click "Add Record"

**Record 2 (CNAME Record):**
- Type: CNAME
- Host: www
- Points to: cname.vercel-dns.com.
- TTL: 14400
- Click "Add Record"

**Click: Save/Update**

---

### Step 4C: Wait for DNS Propagation

DNS changes take **1-24 hours** (usually 1-4 hours).

**Check status:** https://dnschecker.org
- Enter: kollect-it.com
- Look for: 76.76.21.21 (Vercel IP)
- When most locations show green: ✅ Ready!

**While waiting, you can:**
- Continue to Step 5 (Stripe)
- Continue to Step 6 (Email)
- Take a break ☕

---

### Step 4D: Update NEXTAUTH_URL (After DNS Works)

Once `kollect-it.com` is accessible:

1. Vercel → Settings → Environment Variables
2. Find: NEXTAUTH_URL
3. Click: Edit (three dots)
4. Change to: `https://kollect-it.com`
5. Click: Save

**Vercel auto-redeploys** (2-3 minutes)

---

## 💳 STEP 5: STRIPE WEBHOOKS

### Step 5A: Get Stripe Keys (if needed)

1. Login to: https://dashboard.stripe.com
2. Click: "Developers" → "API keys"
3. Make sure: "Test mode" is ON (top right)
4. Copy: **Publishable key** (pk_test_...)
5. Copy: **Secret key** (sk_test_...)

### Step 5B: Add to Vercel (if skipped earlier)

Vercel → Settings → Environment Variables

```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_...

Name: STRIPE_SECRET_KEY
Value: sk_test_...
```

Click: Save

---

### Step 5C: Create Webhook Endpoint

1. Stripe Dashboard → Developers → Webhooks
2. Click: "Add endpoint"
3. **Endpoint URL:**
   ```
   https://kollect-it.com/api/webhooks/stripe
   ```
   (Use `https://kollect-it.vercel.app/api/webhooks/stripe` if DNS not ready)

4. **Description:** "Kollect-It Production Webhook"
5. Click: "Select events"
6. **Check these events:**
   - checkout.session.completed
   - payment_intent.succeeded
   - payment_intent.payment_failed
7. Click: "Add events"
8. Click: "Add endpoint"

---

### Step 5D: Get Webhook Secret

1. Click on your new webhook endpoint
2. Find: "Signing secret"
3. Click: "Reveal"
4. Copy the secret (starts with `whsec_`)

**Add to Vercel:**
```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_...
```

Click: Save

---

### Step 5E: Test Webhook

1. Stripe Dashboard → Webhooks → Your endpoint
2. Click: "Send test webhook"
3. Select: `checkout.session.completed`
4. Click: "Send test webhook"

**Result:**
- ✅ Success: Webhook works!
- ❌ Failed: Check Vercel logs, verify URL

---

## 📧 STEP 6: EMAIL SERVICE (RESEND)

### Step 6A: Create Resend Account

1. Go to: https://resend.com/signup
2. Sign up with your email
3. Verify email
4. ✅ Logged in

---

### Step 6B: Get API Key

1. Click: "API Keys" in sidebar
2. Click: "Create API Key"
3. Name: "Kollect-It Production"
4. Click: "Add"
5. **Copy the key** (starts with `re_`)

---

### Step 6C: Add to Vercel

```
Name: RESEND_API_KEY
Value: re_...

Name: EMAIL_FROM
Value: Kollect-It <orders@kollect-it.com>

Name: ADMIN_EMAIL
Value: admin@kollect-it.com
```

Click: Save

---

### Step 6D: Verify Domain (Optional)

For production, verify your email domain:

1. Resend → Domains
2. Click: "Add Domain"
3. Enter: `kollect-it.com`
4. Click: "Add"
5. Copy DNS record provided
6. Bluehost DNS → Add TXT record
7. Back in Resend: Click "Verify"

**Note:** Optional. Emails will send without this, but may go to spam.

---

## ✅ STEP 7: PRODUCTION TESTING

### 7A: Test Homepage
```
URL: https://kollect-it.com (or Vercel URL if DNS not ready)

Check:
☐ Page loads without errors
☐ Images display correctly
☐ Navigation works
☐ Mobile view works (resize browser)
```

### 7B: Test Admin Access
```
URL: https://kollect-it.com/admin/login

Login: admin@kollect-it.com / admin@KI-2025

Check:
☐ Login successful
☐ Dashboard loads
☐ Can navigate to Products
☐ Can see products list
```

### 7C: Test Product Creation
```
Click: Products → Add New Product

Fill in:
☐ SKU (auto-fills)
☐ Title: "Test Product"
☐ Category: Any
☐ Price: $100
☐ Upload test image

Click: Create/Save

Check:
☐ Success message appears
☐ Product in list
☐ Can view on frontend
☐ Image displays
```

### 7D: Test Checkout (Optional)

```
On frontend:
1. Find a product
2. Click "Add to Cart"
3. Go to Cart
4. Click "Checkout"

Fill in test info:
☐ Name: Test User
☐ Email: test@example.com
☐ Address: 123 Test St
☐ City: Test City
☐ State: TX
☐ ZIP: 12345

Use Stripe test card:
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits

Click: Pay

Check:
☐ Payment succeeds
☐ Order confirmation shows
☐ Email received (check spam)
☐ Order in admin panel
```

---

## 🔐 STEP 8: SECURITY AUDIT

### 8A: Admin Protection
```
Incognito window
Try: https://kollect-it.com/admin/products
Expected: Redirected to login
✅ Routes protected!
```

### 8B: HTTPS
```
Visit: https://kollect-it.com
Look for: 🔒 Lock icon
Click lock → Check certificate valid
✅ SSL working!
```

### 8C: Security Headers
```
DevTools (F12)
Network tab
Refresh page
Click first request
Headers tab
Look for:
☐ Strict-Transport-Security
☐ X-Frame-Options
☐ X-Content-Type-Options
✅ Headers present!
```

---

## 🎉 COMPLETION CHECKLIST

When everything is done:

```
✅ Vercel deployment active
✅ Custom domain configured
✅ DNS propagated (kollect-it.com works)
✅ Admin login works
✅ Product creation works
✅ Images upload
✅ Stripe webhooks configured
✅ Email service ready
✅ Security verified
✅ All tests passed
```

---

## 📞 NEXT ACTIONS

### Immediate:
1. Change admin password from default
2. Delete test products/orders
3. Create 5-10 real products

### This Week:
1. Add 20-30 more products
2. Test thoroughly
3. Share with friends/beta testers

### When Ready (Live Payments):
1. Switch Stripe to live mode
2. Test with real card
3. Open to public

---

## 🆘 TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Vercel deployment fails | Check build logs, verify NODE_ENV not set to something wrong |
| Domain not resolving | Wait 1-4 hours, check dnschecker.org, verify DNS records match |
| Login doesn't work | Check NEXTAUTH_URL matches domain, clear browser cache |
| Stripe webhook fails | Verify URL is correct, check endpoint is enabled in Stripe |
| Emails go to spam | Add Resend domain verification (optional but recommended) |

---

**Phase 3 Status**: Ready to Begin  
**Estimated Time**: 90 minutes active + 1-24 hours waiting for DNS  
**Next Step**: Start with Step 2 - Add environment variables to Vercel

Report back with:
- ✅ When each step is complete
- ❌ Any errors you encounter
- ✅ Final "All done!" when complete

Good luck! 🚀
