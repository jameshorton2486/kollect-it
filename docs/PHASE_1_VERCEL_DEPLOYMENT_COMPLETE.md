# PHASE 1: VERCEL DEPLOYMENT GUIDE - COMPLETE ✅

**Date:** November 9, 2025  
**Estimated Time:** 2-3 hours  
**Outcome:** Live marketplace with custom domain  

---

## 🎯 Quick Overview

What you're doing:
1. ✅ Choose PostgreSQL provider (Neon recommended)
2. ✅ Create Vercel account and connect GitHub
3. ✅ Deploy marketplace live
4. ✅ Update domain at Bluehost to point to Vercel
5. ✅ Test everything works
6. ✅ Launch! 🚀

**Current Status:** Code is ready ✅ | GitHub synced ✅

---

## STEP 1: Choose & Setup PostgreSQL ⚙️

### Option A: Neon (RECOMMENDED) - Free tier is perfect

**Why Neon?**
- Free tier: 10 GB storage, unlimited queries
- No credit card for free tier
- Instant setup (< 5 minutes)
- Auto-scales
- Perfect for marketplace

**Setup:**

1. Go to https://neon.tech
2. Click "Sign up"
3. Choose "Continue with GitHub"
4. Authorize Neon to access your GitHub
5. You'll see project creation screen

**Create Database:**

1. Click "Create project"
2. Give it a name: `kollect-it-marketplace`
3. Choose region closest to you (e.g., us-east-1)
4. Click "Create project"

**Get Connection String:**

1. Once created, you'll see a database named `neondb`
2. Click on it
3. You'll see a "Connection string" section
4. Under "Pooled connection", copy the entire URL that looks like:
   ```
   postgresql://user:password@ep-xxxxx.neon.tech/neondb?sslmode=require
   ```
5. **Save this** - you'll need it in Step 3

**Get Direct Connection String:**

1. Under "Direct connection", copy the URL (same but without pooling parameters)
2. **Save this separately** - needed for migrations

---

### Option B: Supabase - Good alternative

1. Go to https://supabase.com
2. Sign up with GitHub
3. Create new project
4. Go to Settings → Database → Connection Pooling
5. Copy the "URI" connection string
6. Save both pooled and direct versions

---

### Option C: Railway - Simple alternative

1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → PostgreSQL
4. Copy connection string from database details
5. Save it

---

## STEP 2: Push to GitHub ✅ (Already Done)

Your code is already pushed! Verify:

```powershell
# Check current status
git status
# Should show: "On branch main, nothing to commit, working tree clean"

# View recent commits
git log --oneline -5
```

**If NOT pushed yet:**
```powershell
git add -A
git commit -m "feat: complete marketplace setup ready for deployment

- All core features implemented
- Stripe payment integration
- NextAuth authentication
- Email notifications
- ImageKit CDN
- Admin dashboard
- Production-ready"

git push origin main
```

Verify on GitHub: https://github.com/jameshorton2486/kollect-it-marketplace

---

## STEP 3: Create Vercel Account & Deploy 🚀

### 3.1 Create Vercel Account

1. Go to https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel (you'll see permissions screen)
4. Click "Authorize Vercel"
5. You'll be taken to Vercel dashboard

### 3.2 Import Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find `kollect-it-marketplace` in your list
4. Click **"Import"**

### 3.3 Configure Environment Variables

On the import screen, you'll see "Environment Variables" section.

**Click to expand it and add these variables:**

| Variable | Value | Where from |
|----------|-------|-----------|
| `DATABASE_URL` | postgresql://user:password@host/dbname | From Neon (pooled connection) |
| `DIRECT_URL` | postgresql://user:password@host/dbname | From Neon (direct connection) |
| `NEXTAUTH_SECRET` | (generate below) | Generate new |
| `NEXTAUTH_URL` | https://yourdomain.com | Your actual domain (after DNS update) |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | https://ik.imagekit.io/your_id | From .env.local |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | public_xxxxx | From .env.local |
| `IMAGEKIT_PRIVATE_KEY` | private_xxxxx | From .env.local |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_live_xxxxx | From .env.local |
| `STRIPE_SECRET_KEY` | sk_live_xxxxx | From .env.local |
| `STRIPE_WEBHOOK_SECRET` | whsec_xxxxx | From .env.local |
| `RESEND_API_KEY` | re_xxxxx | From .env.local |
| `EMAIL_FROM` | Kollect-It <noreply@yourdomain.com> | From .env.local |
| `ADMIN_EMAIL` | your-email@gmail.com | Your admin email |
| `NODE_ENV` | production | Leave as is |

**Generate NEXTAUTH_SECRET:**

```powershell
# Copy and run this in PowerShell:
openssl rand -hex 32

# You'll see output like:
# 8f7a2c9e5b1d4f6a3e8c2b9d5f1a7c4e

# Copy that entire string and paste into NEXTAUTH_SECRET field in Vercel
```

**How to add variables in Vercel:**

1. See text box under each variable name
2. Paste the value
3. Press Enter or click next field
4. Repeat for all variables

### 3.4 Deploy

1. Review all settings (should show Next.js framework detected)
2. Click **"Deploy"** button
3. Watch the build progress (takes 2-5 minutes)

**Expected output:**
```
✓ Deployment complete
✓ Your production URL: https://kollect-it-marketplace.vercel.app
```

**Save this temporary URL** - it's your backup domain.

---

## STEP 4: Test Vercel Deployment ✅

### 4.1 Visit Your Site

1. Click the deployment URL from Vercel
2. Should see your homepage with:
   - ✅ Hero section with "Browse Collections" button
   - ✅ Trust strip with 6 trust badges
   - ✅ Latest arrivals products
   - ✅ Featured collection (Rare Books)
   - ✅ Shop by categories
   - ✅ Testimonials
   - ✅ Process overview

### 4.2 Test Core Features

**Test 1: Login**
```
URL: https://your-vercel-url/login
Email: admin@example.com
Password: (check your .env.local for admin password)
Should redirect to admin dashboard
```

**Test 2: Browse Products**
```
URL: https://your-vercel-url/shop
Should see all products
Filter by category should work
Search should work
```

**Test 3: Cart Functionality**
```
Click on a product
Click "Add to Cart"
Go to /cart
Should see product in cart
Can adjust quantity
Can remove items
```

**Test 4: Images Loading**
```
Right-click on product image → Open DevTools (F12)
Network tab → filter by "img"
Images should load from ik.imagekit.io (ImageKit CDN)
Images should be optimized (usually < 50KB)
```

### 4.3 Check Browser Console

1. Press F12 (Developer Tools)
2. Go to "Console" tab
3. Should show NO errors (maybe warnings, that's OK)
4. Check for any red error messages

**If you see errors:**
- Note the error message
- Go to Step 5.3 (Troubleshooting)

---

## STEP 5: Update Domain at Bluehost 🔗

### 5.1 Get Vercel Nameservers

**In Vercel Project Settings:**

1. Go to Vercel dashboard
2. Click your project
3. Go to "Settings" → "Domains"
4. Click **"Add Domain"**
5. Enter your domain: `yourdomain.com` (without www)
6. Select **"Use Vercel Nameservers"** (recommended)
7. You'll see nameservers like:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
8. Copy these (write them down)

### 5.2 Update Bluehost

**Login to Bluehost:**

1. Go to https://bluehost.com
2. Click "Log in"
3. Enter your Bluehost credentials
4. Click "Hosting" (left menu)
5. Click "Manage" next to your hosting plan

**Change Nameservers:**

1. Find "Domain" section (or search for "Nameservers")
2. Click "Change Nameservers"
3. You'll see current nameservers (probably Bluehost's)
4. Select **"Use custom nameservers"**
5. Enter Vercel nameservers:
   ```
   Nameserver 1: ns1.vercel-dns.com
   Nameserver 2: ns2.vercel-dns.com
   ```
6. Click "Save"

**DNS Propagation Timeline:**
- Immediate: Changes registered
- 15-30 minutes: Most DNS resolvers updated
- 24-48 hours: 100% propagated (worst case)

### 5.3 Verify DNS Propagation

**Check Status:**

```powershell
# In PowerShell, run:
nslookup yourdomain.com

# Should show nameservers pointing to Vercel:
# Non-authoritative answer:
# nameserver = ns1.vercel-dns.com
# nameserver = ns2.vercel-dns.com
```

**Or use online tool:**
- https://whatsmydns.net
- Enter your domain
- Should show Vercel nameservers globally

### 5.4 Verify in Vercel

1. Go back to Vercel project
2. Go to Settings → Domains
3. Your domain should show: **"Valid Configuration"** ✅
4. SSL certificate will auto-generate (takes 5-10 min)
5. You'll see a green lock icon 🔒

**Access your domain:**
```
https://yourdomain.com ✅
https://www.yourdomain.com ✅
```

Both should work and show your marketplace!

---

## STEP 6: Initialize Database 📊

One-time setup to populate your database:

```powershell
# Navigate to project
cd c:\Users\james\kollect-it-marketplace-1

# Generate Prisma client
bun run db:generate

# Run migrations against Vercel's database
bun run db:migrate:deploy

# Seed with initial data (categories + test products)
bun run db:seed
```

**Expected output:**
```
✓ Database migrated successfully
✓ Seed data created:
  - 4 categories (Antique Books, Fine Art, Collectibles, Militaria)
  - 16 products (4 per category)
```

### Verify Data Exists

```powershell
# Open Prisma Studio (shows database contents)
bun run db:studio

# Opens at http://localhost:5555
# You should see:
# - categories table with 4 rows
# - products table with 16 rows
```

---

## STEP 7: Verify All Services 🔍

### 7.1 Email Service (Resend)

**Test endpoint:**
1. Go to: `https://yourdomain.com/api/email/test`
2. You should see: `{"success": true, "messageId": "..."}`
3. Check your email inbox for test email

**If email doesn't arrive:**
- Check spam folder
- Verify RESEND_API_KEY in Vercel
- Check that ADMIN_EMAIL is correct

### 7.2 Payment Processing (Stripe)

**Test checkout (test mode):**
1. Go to product page
2. Click "Add to Cart"
3. Go to `/cart`
4. Click "Checkout"
5. Use Stripe test card:
   ```
   Card number: 4242 4242 4242 4242
   Expiry: 12/25 (any future date)
   CVC: 123
   ```
6. Should complete successfully
7. Should show order confirmation

### 7.3 Images (ImageKit CDN)

**Verify images load fast:**
1. Go to any product page
2. Right-click on product image → "Inspect"
3. DevTools opens → Network tab
4. Look for image request
5. Should come from: `ik.imagekit.io`
6. File size should be small (< 50KB typically)
7. Load time < 1 second

### 7.4 Authentication (NextAuth)

**Test login/logout:**
1. Go to `/login`
2. Try admin credentials:
   ```
   Email: admin@example.com
   Password: (from your .env.local or test with any password)
   ```
3. Should show login error or redirect to dashboard
4. If success, go to `/admin`
5. Should see admin dashboard
6. Logout should clear session

---

## ✅ PRE-LAUNCH CHECKLIST

### Infrastructure (Required)
- [ ] Vercel deployment successful (no errors)
- [ ] Domain pointing to Vercel
- [ ] SSL certificate active (green lock 🔒)
- [ ] Database connected and migrated
- [ ] All environment variables set in Vercel

### Core Features (Required)
- [ ] Homepage loads correctly
- [ ] Category pages display
- [ ] Product pages work
- [ ] Cart functions
- [ ] Checkout completes (test with 4242 card)
- [ ] Order confirmation email received

### Admin Features (Required)
- [ ] Can login to admin dashboard
- [ ] Can view products
- [ ] Can view orders
- [ ] Can view analytics

### Security (Critical)
- [ ] HTTPS working (https://yourdomain.com)
- [ ] No red errors in browser console
- [ ] No database errors in Vercel logs
- [ ] Admin routes protected (can't access /admin without login)

### Performance (Recommended)
- [ ] Pages load in < 3 seconds
- [ ] Images load from ImageKit CDN
- [ ] No console errors
- [ ] Mobile responsive (test on phone)

### Content (Recommended)
- [ ] 4 categories created
- [ ] Products display in each category
- [ ] Product descriptions are professional
- [ ] Images look good

---

## 📊 MONITORING DASHBOARD

### Access Vercel Analytics

1. Go to Vercel dashboard
2. Click your project
3. Go to "Analytics" tab
4. You'll see:
   - Page load times
   - Error rates
   - Visitor counts
   - Core Web Vitals

### Monitor in Real-Time

Watch the first week:
- Peak traffic times
- Error patterns
- Performance issues
- User behavior

---

## 🆘 TROUBLESHOOTING

### Build Failed on Vercel

**Error: "Module not found"**
- Cause: Missing environment variable
- Fix: Go to Vercel project → Settings → Environment Variables → Add missing variable

**Error: "TypeScript error"**
- Cause: Code error in your files
- Fix: Run `bun run lint` locally, fix errors, commit, and Vercel will rebuild

**Error: "Database connection failed"**
- Cause: DATABASE_URL is wrong or whitelist missing
- Fix:
  1. Test connection locally: `bun run db:studio`
  2. Verify DATABASE_URL in Vercel
  3. Add whitelist to database (allow all IPs: 0.0.0.0)

### Domain Not Working

**Domain doesn't resolve:**
```powershell
# Check DNS propagation
nslookup yourdomain.com

# Should show Vercel nameservers
# If not, wait 24-48 hours and try again
```

**Issue: "This domain is not configured"**
- Solution: Go to Vercel project → Settings → Domains
- Verify domain shows "Valid Configuration"
- If not, add it again and select "Use Vercel Nameservers"

**HTTPS not working:**
- Solution: Wait 10 minutes for SSL certificate to generate
- Then refresh browser

### Slow Performance

**Pages loading slowly:**
1. Check Vercel Analytics for bottlenecks
2. Images might be too large:
   - Use ImageKit image transformation: `?tr=w:400,q:80`
3. Database queries might be slow:
   - Add pagination (limit products to 10 per page)
   - Add indexes in Prisma schema

### Email Not Arriving

**Resend email not working:**
1. Verify RESEND_API_KEY in Vercel
2. Check ADMIN_EMAIL is correct
3. Go to Resend dashboard: https://resend.com/emails
4. Should see your test emails in dashboard
5. If there, check spam folder
6. If not there, check error message in Vercel logs

### Stripe Payment Failing

**Payment processing error:**
1. Verify you're using TEST keys (starts with `pk_test_` not `pk_live_`)
2. Use test card: 4242 4242 4242 4242
3. Check STRIPE_SECRET_KEY in Vercel
4. Check Stripe webhook configured (see detailed guide)

---

## 🚀 LAUNCH CHECKLIST

When everything passes verification:

### 1. Announce Launch

**Email existing customers:**
```
Subject: Introducing Kollect-It Marketplace

Dear Collectors,

We're thrilled to announce the launch of Kollect-It - 
a luxury marketplace for authenticated antiques and collectibles.

Browse our curated collections:
- Antique Books & Manuscripts
- Fine Art & Paintings
- Collectibles & Memorabilia
- Militaria & Historical Artifacts

Visit: https://yourdomain.com

Every piece is authenticated, documented, and ready to treasure.

Happy collecting!
- The Kollect-It Team
```

### 2. Social Media

- Instagram: Share hero image with link
- Facebook: Post announcement with categories
- Twitter/X: Quick launch announcement
- LinkedIn: If B2B angle

**Use hashtags:**
#Collectibles #Marketplace #AntiquBooks #FineArt #Militaria #Authenticated

### 3. Google Search Console

1. Go to https://search.google.com/search-console
2. Add your domain
3. Submit sitemap: https://yourdomain.com/sitemap.xml
4. Takes 1-4 weeks to index fully

---

## 📈 FIRST WEEK MONITORING

### Daily Checklist

- ✅ Check Vercel Analytics dashboard
- ✅ Look for any error emails
- ✅ Verify homepage loads
- ✅ Test one product page
- ✅ Monitor site speed

### Weekly Tasks

- Review analytics
- Check error logs
- Test checkout with real payment
- Backup database
- Review customer feedback

---

## ✨ You're Deployed! 🎉

**What you've accomplished:**
- ✅ Production database in the cloud
- ✅ Marketplace live on Vercel
- ✅ Custom domain pointing to site
- ✅ SSL certificate active (HTTPS)
- ✅ All features working
- ✅ Ready for customers!

**Next Phase (Optional):**
- Phase 2: Add AI-powered product creation system
- See: `PHASE_2_DETAILED_IMPLEMENTATION_GUIDE.md`

---

## 📞 GETTING HELP

### Service Support
- **Vercel Issues:** https://vercel.com/support
- **Neon (Database):** https://neon.tech/docs
- **Stripe Issues:** https://support.stripe.com
- **ImageKit:** https://imagekit.io/contact-support
- **Resend:** https://resend.com/support

### Documentation
- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **NextAuth:** https://next-auth.js.org

---

## 🎯 Success Indicators

Your deployment is successful when:

✅ Domain works: `https://yourdomain.com`  
✅ SSL certificate active: Green lock 🔒  
✅ Homepage loads in < 3 seconds  
✅ Products display with images  
✅ Login works  
✅ Cart functions  
✅ Checkout completes  
✅ Email notifications arrive  
✅ Admin dashboard accessible  
✅ No console errors  
✅ Mobile responsive  

---

**You're ready to launch! 🚀**

Start with Step 1: Choose PostgreSQL provider  
Then follow steps sequentially  
If you get stuck, check Troubleshooting section  
You've got this!

---

**Questions?** Refer to:
- This guide's troubleshooting section
- Service documentation (links above)
- Vercel deployment logs (most helpful!)

**Next:** Deploy to Vercel now! ⏱️
