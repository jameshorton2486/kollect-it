# Stripe Webhook Setup Guide

**Last Updated:** December 2024  
**Purpose:** Step-by-step guide to configure Stripe webhooks for Kollect-It

---

## ✅ Overview

Kollect-It uses **ONE webhook endpoint** that handles all Stripe events. This is the correct and recommended approach.

**Webhook Endpoint:**
```
https://kollect-it.com/api/webhooks/stripe
```

**For Vercel Preview:**
```
https://your-preview-url.vercel.app/api/webhooks/stripe
```

---

## 🎯 Required Events

Your webhook handler supports these events:

### **REQUIRED (Must Subscribe)**
- ✅ `checkout.session.completed` - When customer completes checkout
- ✅ `payment_intent.succeeded` - When payment is successful
- ✅ `payment_intent.payment_failed` - When payment fails

### **OPTIONAL (Recommended)**
- ✅ `charge.refunded` - When a charge is refunded
- ✅ `charge.dispute.created` - When a chargeback/dispute is created

---

## 📋 Setup Steps

### Step 1: Access Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in the correct mode:
   - **Test Mode** for development/testing
   - **Live Mode** for production

⚠️ **IMPORTANT:** You need separate webhooks for Test Mode and Live Mode. Each mode has its own signing secret.

### Step 2: Navigate to Webhooks

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **➕ Add endpoint** (or **Add webhook endpoint**)

### Step 3: Configure Webhook Endpoint

**Endpoint URL:**
```
https://kollect-it.com/api/webhooks/stripe
```

For Vercel Preview deployments:
```
https://your-preview-url.vercel.app/api/webhooks/stripe
```

**Description (optional):**
```
Kollect-It Marketplace - Main Webhook Handler
```

### Step 4: Select Events

Click **Select events** and choose:

**Required Events:**
- [x] `checkout.session.completed`
- [x] `payment_intent.succeeded`
- [x] `payment_intent.payment_failed`

**Optional Events (Recommended):**
- [x] `charge.refunded`
- [x] `charge.dispute.created`

**⚠️ DO NOT select "Send all events"** - Only select the events listed above.

### Step 5: Save Webhook

1. Click **Add endpoint** (or **Save**)
2. Stripe will create the webhook and generate a **Signing Secret**

### Step 6: Copy Signing Secret

1. After creating the webhook, click on it to view details
2. In the **Signing secret** section, click **Reveal** or **Click to reveal**
3. Copy the secret (starts with `whsec_...`)

**Example:**
```
whsec_1234567890abcdefghijklmnopqrstuvwxyz
```

### Step 7: Add Secret to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **kollect-it-marketplace-1**
3. Go to **Settings** → **Environment Variables**
4. Add new variable:

   **Name:**
   ```
   STRIPE_WEBHOOK_SECRET
   ```

   **Value:**
   ```
   whsec_... (paste the secret you copied)
   ```

5. Select environments:
   - ✅ **Production** (for live mode)
   - ✅ **Preview** (for test mode / preview deployments)
   - ✅ **Development** (optional, for local testing)

6. Click **Save**

### Step 8: Redeploy (if needed)

If your app is already deployed, you may need to trigger a redeploy for the new environment variable to take effect:

1. Go to **Deployments** in Vercel
2. Click **⋯** on the latest deployment
3. Click **Redeploy**

Or simply push a new commit to trigger a new deployment.

---

## 🧪 Testing Your Webhook

### Test Mode (Development)

1. Make sure you're in **Test Mode** in Stripe Dashboard
2. Use Stripe CLI for local testing:

```bash
# Install Stripe CLI (if not installed)
# https://stripe.com/docs/stripe-cli

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will:
- Create a temporary webhook endpoint
- Show you the signing secret (starts with `whsec_`)
- Forward all events to your local server

3. Trigger a test event:

```bash
# Trigger a test checkout session
stripe trigger checkout.session.completed

# Trigger a test payment intent
stripe trigger payment_intent.succeeded
```

### Production Testing

1. Make sure you're in **Live Mode** in Stripe Dashboard
2. Use Stripe's test card: `4242 4242 4242 4242`
3. Complete a test checkout on your site
4. Check Stripe Dashboard → **Webhooks** → Your webhook → **Recent events**
5. Verify events show as **Succeeded** (green checkmark)

---

## 🔍 Verifying Webhook Configuration

### Check 1: Webhook Endpoint URL

Your webhook should be accessible at:
```
https://kollect-it.com/api/webhooks/stripe
```

Test with curl (should return 400 - missing signature, which is expected):
```bash
curl https://kollect-it.com/api/webhooks/stripe
```

### Check 2: Environment Variable

Verify `STRIPE_WEBHOOK_SECRET` is set in Vercel:
1. Vercel Dashboard → Settings → Environment Variables
2. Confirm `STRIPE_WEBHOOK_SECRET` exists
3. Value should start with `whsec_`

### Check 3: Webhook Events in Stripe

1. Stripe Dashboard → Developers → Webhooks
2. Click on your webhook
3. Scroll to **Events** section
4. Verify the 5 events are listed:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `charge.dispute.created`

### Check 4: Recent Events

1. In Stripe Dashboard → Your webhook
2. Check **Recent events** tab
3. After a test transaction, you should see events with status **Succeeded**

---

## 🚨 Troubleshooting

### Webhook Returns 400 "Missing signature"

**Cause:** Request not from Stripe  
**Solution:** This is normal for direct browser/curl requests. Only Stripe can send valid webhooks.

### Webhook Returns 400 "Invalid signature"

**Cause:** Signing secret mismatch  
**Solution:**
1. Verify `STRIPE_WEBHOOK_SECRET` in Vercel matches the secret from Stripe Dashboard
2. Make sure you're using the correct secret for the correct mode (Test vs Live)
3. Redeploy your app after updating the secret

### Webhook Returns 503 "Webhook secret not configured"

**Cause:** `STRIPE_WEBHOOK_SECRET` environment variable not set  
**Solution:**
1. Add `STRIPE_WEBHOOK_SECRET` to Vercel environment variables
2. Redeploy your app

### Events Not Being Processed

**Check:**
1. Stripe Dashboard → Webhooks → Recent events
2. Look for events with status **Failed** (red X)
3. Click on failed event to see error details
4. Check your application logs in Vercel

### Duplicate Events

**This should NOT happen** - Your webhook handler has idempotency protection:
- Events are stored in `StripeWebhookEvent` table
- Duplicate events are detected and skipped
- Check database if you suspect duplicates

---

## 📝 Important Notes

### One Webhook Per Mode

- **Test Mode** = 1 webhook with test mode secret
- **Live Mode** = 1 webhook with live mode secret

You do NOT need:
- ❌ Multiple webhooks for different events
- ❌ Separate webhooks for admin vs public
- ❌ Separate webhooks for different products

### Webhook Secret Security

- ⚠️ **NEVER** commit `STRIPE_WEBHOOK_SECRET` to Git
- ⚠️ **NEVER** expose the secret in logs or error messages
- ✅ Store only in Vercel environment variables
- ✅ Use different secrets for Test and Live modes

### Switching Between Test and Live

When switching from Test Mode to Live Mode:

1. Create a **new webhook** in Live Mode
2. Copy the **new signing secret** (different from test mode)
3. Update `STRIPE_WEBHOOK_SECRET` in Vercel (or use separate env vars)
4. Redeploy your app

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] Webhook endpoint created in Stripe Dashboard (Live Mode)
- [ ] Endpoint URL: `https://kollect-it.com/api/webhooks/stripe`
- [ ] All 5 events subscribed (3 required + 2 optional)
- [ ] Signing secret copied from Stripe Dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` added to Vercel environment variables
- [ ] Environment variable set for Production environment
- [ ] App redeployed after adding secret
- [ ] Test transaction completed successfully
- [ ] Webhook events show as "Succeeded" in Stripe Dashboard
- [ ] Order created/updated correctly in database

---

## 🔗 Related Documentation

- [Production Deployment Checklist](../PRODUCTION_DEPLOY_CHECKLIST.md)
- [Stripe Webhook Handler Code](../../src/app/api/webhooks/stripe/route.ts)
- [Stripe Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)

---

## 📞 Support

If you encounter issues:

1. Check Stripe Dashboard → Webhooks → Recent events for error details
2. Check Vercel logs for application errors
3. Verify environment variables are set correctly
4. Test with Stripe CLI in local development first

---

**Last Updated:** December 2024

