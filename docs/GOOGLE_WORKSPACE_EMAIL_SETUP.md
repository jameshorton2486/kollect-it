# Google Workspace SMTP Configuration Guide

## Email Notification System Setup

---

## Overview

Configure Google Workspace SMTP to send transactional emails from your Kollect-It marketplace.

**Use Cases:**

- Order confirmations
- Shipping notifications
- Password resets
- Admin alerts
- Seller inquiry responses

---

## Prerequisites

- ✅ Google Workspace account
- ✅ Custom domain configured in Google Workspace
- ✅ Admin access to Google Workspace

---

## Step 1: Enable SMTP in Google Workspace

### For Workspace Admins

1. **Go to Admin Console:** https://admin.google.com
2. **Navigate to:** Apps → Google Workspace → Gmail → Advanced settings
3. **Scroll to:** SMTP relay service
4. **Configure:**
   - Allow: All senders
   - Authentication: Require SMTP authentication
   - Encryption: TLS encryption
5. **Save changes**

---

## Step 2: Generate App Password

### For Your Email Account

1. **Go to:** https://myaccount.google.com/security
2. **Enable 2-Step Verification** (if not already enabled):
   - Click "2-Step Verification"
   - Follow setup wizard
   - Recommended: Use authenticator app

3. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter name: **Kollect-It Marketplace**
   - Click **Generate**
   - **Copy the 16-character password** (spaces optional)

**Example:** `abcd efgh ijkl mnop`

---

## Step 3: Configure Environment Variables

### Add to Vercel (Production)

In Vercel Dashboard → Settings → Environment Variables:

```bash
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=noreply@your-domain.com
EMAIL_SERVER_PASSWORD=abcdefghijklmnop
EMAIL_FROM=Kollect-It <noreply@your-domain.com>
```

### Add to .env.local (Development)

```bash
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="noreply@your-domain.com"
EMAIL_SERVER_PASSWORD="abcdefghijklmnop"
EMAIL_FROM="Kollect-It <noreply@your-domain.com>"
```

**⚠️ Important:**

- Use your Google Workspace email (not personal Gmail)
- Use App Password, NOT your regular password
- Port 587 (TLS) is recommended
- Remove spaces from App Password if copying

---

## Step 4: Verify Email Configuration

### Test Email Function

Create test file: `scripts/test-email.ts`

```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: "your-test-email@domain.com",
      subject: "Test Email from Kollect-It",
      html: "<h1>Email Configuration Successful!</h1><p>Your email system is working correctly.</p>",
    });
    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Email failed:", error);
  }
}

testEmail();
```

### Run Test

```bash
bun run scripts/test-email.ts
```

---

## Step 5: Configure Email Templates

### Update Email Templates in Admin

1. **Login to Admin Dashboard:** `/admin/emails`
2. **Configure Templates:**
   - Order Confirmation
   - Shipping Notification
   - Password Reset
   - Admin Alerts
   - Seller Inquiry Response

3. **Customize:**
   - From name
   - Subject lines
   - Email body (HTML)
   - Footer information

---

## Step 6: SPF & DKIM Configuration (Recommended)

### Prevent Emails Going to Spam

#### SPF Record (Required)

Add to your domain's DNS:

```dns
TXT @ "v=spf1 include:_spf.google.com ~all"
```

**Verification:**

```bash
nslookup -type=txt your-domain.com
```

#### DKIM (Recommended)

1. **Google Workspace Admin Console**
2. **Apps → Google Workspace → Gmail → Authenticate email**
3. **Generate DKIM key**
4. **Add TXT record to DNS:**
   - Name: `google._domainkey`
   - Value: [provided by Google]

#### DMARC (Optional but Recommended)

```dns
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:postmaster@your-domain.com"
```

---

## Step 7: Email Sending Limits

### Google Workspace Limits

- **Free Gmail:** 500 emails/day
- **Workspace Starter:** 2,000 emails/day
- **Workspace Business:** 10,000 emails/day

### Rate Limiting in Code

Already implemented in Phase 6:

- Batch processing for bulk emails
- Queue system for large sends
- Retry logic for failed sends

---

## Step 8: Monitoring Email Delivery

### Check Email Logs

1. **Google Workspace Admin:**
   - Reports → Email log search
   - Filter by sender email
   - Check delivery status

2. **Admin Dashboard:**
   - `/admin/emails` → Email Logs
   - View sent emails
   - Check delivery status
   - Monitor bounce rates

---

## Troubleshooting

### Common Issues

#### 1. "Invalid credentials" Error

**Solutions:**

- ✅ Verify App Password is correct (no spaces)
- ✅ Ensure 2-Step Verification is enabled
- ✅ Regenerate App Password if needed
- ✅ Check `EMAIL_SERVER_USER` matches Google Workspace email

#### 2. "Connection timeout" Error

**Solutions:**

- ✅ Verify port 587 is not blocked by firewall
- ✅ Try port 465 with `secure: true`
- ✅ Check Google Workspace SMTP settings

#### 3. Emails Going to Spam

**Solutions:**

- ✅ Configure SPF record
- ✅ Enable DKIM
- ✅ Add DMARC policy
- ✅ Warm up IP (send gradually increasing volumes)
- ✅ Use professional email templates

#### 4. "Daily limit exceeded" Error

**Solutions:**

- ✅ Upgrade Google Workspace plan
- ✅ Implement email queue system
- ✅ Use third-party service (SendGrid) for high volume

---

## Alternative: SendGrid (If Google Workspace Limits Too Low)

### SendGrid Setup (Optional)

If you need to send >10,000 emails/day:

```bash
# Install SendGrid
bun add @sendgrid/mail

# Environment variables
SENDGRID_API_KEY="SG.xxxxxxxxxxxxx"
```

**Code Example:**

```typescript
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: "customer@example.com",
  from: process.env.EMAIL_FROM!,
  subject: "Order Confirmation",
  html: "<strong>Your order has been confirmed!</strong>",
});
```

---

## Email Template Examples

### Order Confirmation

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Order Confirmation</title>
  </head>
  <body
    style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"
  >
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
      <h1 style="color: #333;">Order Confirmed!</h1>
      <p>Hi {{customerName}},</p>
      <p>Thank you for your order. We're preparing your items for shipment.</p>

      <div
        style="background: white; padding: 15px; border-radius: 4px; margin: 20px 0;"
      >
        <h2 style="color: #555; font-size: 18px;">Order Details</h2>
        <p><strong>Order Number:</strong> {{orderNumber}}</p>
        <p><strong>Order Date:</strong> {{orderDate}}</p>
        <p><strong>Total:</strong> ${{orderTotal}}</p>
      </div>

      <div
        style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;"
      >
        <p style="color: #666; font-size: 12px;">
          Kollect-It Marketplace<br />
          Questions? Contact us at support@your-domain.com
        </p>
      </div>
    </div>
  </body>
</html>
```

---

## Production Checklist

### Before Going Live

- [ ] App Password generated and configured
- [ ] Test email sent successfully
- [ ] SPF record added to DNS
- [ ] DKIM enabled (optional but recommended)
- [ ] Email templates customized
- [ ] From address verified in Google Workspace
- [ ] Rate limiting configured
- [ ] Email logs monitored
- [ ] Bounce handling implemented

---

## Success! ✅

Your email system is now configured and ready for production.

**Test thoroughly before launch:**

1. Send test order confirmation
2. Send test shipping notification
3. Verify emails not going to spam
4. Check all links work correctly
5. Test on multiple email clients (Gmail, Outlook, Apple Mail)

**Need Help?**

- Google Workspace Support: https://support.google.com/a
- Nodemailer Docs: https://nodemailer.com/
- Admin Dashboard: `/admin/emails`
