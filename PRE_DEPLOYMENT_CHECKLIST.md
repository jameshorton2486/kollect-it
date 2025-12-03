# Pre-Deployment Checklist

**Date:** 2025-01-27  
**Project:** Kollect-It Marketplace

---

## ✅ Automated Checks

Run these commands to verify your build is ready:

### 1. Build Test
```powershell
bun run build
```
**Expected:** Build completes without errors  
**Time:** 2-3 minutes

### 2. TypeScript Check
```powershell
bun run typecheck
```
**Expected:** No TypeScript errors

### 3. Environment Variables Check
```powershell
bun run test:env
```
**Expected:** All required variables are set

### 4. Run Pre-Deployment Script
```powershell
.\scripts\run-pre-deployment-checks.ps1
```
**Expected:** All checks pass

---

## 📋 Manual Checks

### Environment Variables (Required)

Verify these are set in `.env.local` and will be set in Vercel:

#### Application
- [ ] `NODE_ENV=production` (in production)
- [ ] `NEXTAUTH_URL=https://kollect-it.vercel.app` (your production URL)
- [ ] `NEXTAUTH_SECRET` (32+ characters)

#### Database
- [ ] `DATABASE_URL` (PostgreSQL connection string)
- [ ] `DIRECT_URL` (optional, for Prisma)

#### ImageKit
- [ ] `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
- [ ] `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
- [ ] `IMAGEKIT_PRIVATE_KEY`

#### Stripe
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with `pk_`)
- [ ] `STRIPE_SECRET_KEY` (starts with `sk_`)
- [ ] `STRIPE_WEBHOOK_SECRET`

#### Google OAuth
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`

#### Email
- [ ] `NEXT_PUBLIC_APP_EMAIL`

#### Optional
- [ ] `NEXT_PUBLIC_GA_ID` (Google Analytics)

---

## 🧪 Feature Testing

### Start Dev Server
```powershell
bun run dev
```

### Test Checklist

#### Shopping Cart (`/cart`)
- [ ] Add product to cart
- [ ] Cart persists on refresh
- [ ] Update quantity works
- [ ] Remove item works
- [ ] Total calculates correctly
- [ ] Empty cart state displays

#### Checkout (`/checkout`)
- [ ] Checkout page loads
- [ ] Shipping form validation
- [ ] Billing form validation
- [ ] Stripe Payment Elements render
- [ ] Test payment with card: `4242 4242 4242 4242`
- [ ] Order created after payment
- [ ] Success page redirects
- [ ] Error handling works

#### Admin Dashboard (`/admin`)
- [ ] Admin login works
- [ ] Dashboard loads
- [ ] Create product works
- [ ] Edit product works
- [ ] Delete product works
- [ ] Image upload works
- [ ] Orders list displays
- [ ] Order details work
- [ ] Order status update works

#### Product Pages
- [ ] Product pages load (`/product/[slug]`)
- [ ] Images display correctly
- [ ] Add to cart works
- [ ] Related products show
- [ ] Mobile responsive
- [ ] SEO metadata present

#### Navigation
- [ ] All header links work
- [ ] All footer links work
- [ ] Mobile menu works
- [ ] No 404 errors

---

## 🔍 Lighthouse Audit

### How to Run:
1. Build and start production server:
   ```powershell
   bun run build
   bun run start
   ```
2. Open Chrome DevTools (F12)
3. Go to **Lighthouse** tab
4. Select categories: Performance, Accessibility, Best Practices, SEO
5. Click "Analyze page load"
6. Test these pages:
   - Homepage (`/`)
   - Product page (`/product/[slug]`)
   - Cart page (`/cart`)
   - Checkout page (`/checkout`)

### Target Scores:
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 95+

### Key Metrics:
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.8s
- Cumulative Layout Shift (CLS) < 0.1
- Total Blocking Time (TBT) < 200ms

---

## 🔒 Security Checklist

- [ ] All environment variables set in Vercel
- [ ] `NEXTAUTH_SECRET` is strong (32+ chars)
- [ ] Stripe keys are production keys (not test)
- [ ] Database connection uses SSL
- [ ] Admin credentials changed from default
- [ ] API routes protected
- [ ] CORS configured correctly
- [ ] Security headers set (verified in `next.config.js`)

---

## 📊 Performance Checklist

### Already Configured:
- ✅ Image optimization (AVIF/WebP)
- ✅ Static asset caching (1 year)
- ✅ Code splitting enabled
- ✅ Console logs removed in production
- ✅ Bundle optimization enabled
- ✅ Standalone output for Vercel

### Verify:
- [ ] Bundle size reasonable
- [ ] Images optimized
- [ ] API responses fast
- [ ] No unnecessary re-renders

---

## 🔍 SEO Checklist

- [ ] All pages have `<title>` tags
- [ ] All pages have meta descriptions
- [ ] OpenGraph tags present
- [ ] Twitter card tags present
- [ ] Canonical URLs set
- [ ] Product pages have JSON-LD structured data
- [ ] `robots.txt` exists
- [ ] `sitemap.xml` exists (or dynamic)

---

## 🐛 Error Handling

- [ ] 404 page works (`/not-found`)
- [ ] Error page works (`/error`)
- [ ] API errors return proper status codes
- [ ] User-friendly error messages
- [ ] No console errors (check DevTools)

---

## 📝 Documentation

- [ ] `DEPLOYMENT_GUIDE.md` reviewed
- [ ] `PRE_DEPLOYMENT_REPORT.md` reviewed
- [ ] Environment variables documented
- [ ] API endpoints documented (if applicable)

---

## 🚀 Deployment Steps

Once all checks pass:

### 1. Commit Changes
```powershell
git add .
git commit -m "Pre-deployment: All checks passed"
```

### 2. Push to GitHub
```powershell
git push origin main
```

### 3. Verify Vercel Deployment
- Go to Vercel Dashboard
- Check deployment status
- Verify environment variables are set
- Wait for build to complete

### 4. Post-Deployment Testing
- [ ] Site loads at production URL
- [ ] Test checkout with real payment (test mode)
- [ ] Monitor error logs
- [ ] Run Lighthouse audit on production
- [ ] Test all key features on production

---

## 📋 Sign-off

- [ ] All automated checks passed
- [ ] All manual checks completed
- [ ] Environment variables verified
- [ ] Key features tested
- [ ] Lighthouse audit passed
- [ ] Security checklist complete
- [ ] Ready for deployment

**Checked by:** _______________  
**Date:** _______________  
**Time:** _______________

---

## Issues Found

_Record any issues discovered during checks:_

1. 
2. 
3. 

---

## Notes

_Additional notes or observations:_



