# =====================================================

# Kollect-It Testing Checklist & Verification Guide

# =====================================================

# Complete testing before marking deployment as successful

## 🎯 TESTING OVERVIEW

**Total Testing Time:** ~45-60 minutes
**Critical Tests:** 15 must-pass items
**Nice-to-Have Tests:** 10 additional checks

---

## 📋 PRE-DEPLOYMENT TESTING (Local)

### ✅ Phase 1: Build & Start (5 minutes)

```powershell
# Clean build
npm run build

# Check for errors in output
# Look for: "Compiled successfully"
# Red flags: TypeScript errors, missing modules
```

**Checklist:**

- [ ] Build completes without errors
- [ ] No TypeScript warnings
- [ ] All pages compile successfully
- [ ] Bundle size reasonable (<5MB)

```powershell
# Start dev server
npm run dev

# Server should start on http://localhost:3000
```

**Checklist:**

- [ ] Server starts without errors
- [ ] Port 3000 available
- [ ] Hot reload working

---

### ✅ Phase 2: Core Functionality (10 minutes)

#### Homepage Tests

1. Open: http://localhost:3000
   - [ ] Page loads in <3 seconds
   - [ ] No console errors (F12 → Console tab)
   - [ ] Navigation menu displays
   - [ ] Hero section renders
   - [ ] Footer visible

#### Authentication Tests

2. Navigate to: /auth/signin
   - [ ] Login form displays
   - [ ] Google OAuth button present
   - [ ] Can submit form
   - [ ] Validation errors show properly

3. Register new account: /auth/signup
   - [ ] Form displays all fields
   - [ ] Password strength indicator works
   - [ ] Email validation works
   - [ ] Can create account

4. Login with credentials
   - [ ] Login successful
   - [ ] Redirected to correct page
   - [ ] User session persists
   - [ ] Can logout

#### Product Listing Tests

5. Navigate to: /products
   - [ ] Products display in grid
   - [ ] Images load from ImageKit
   - [ ] Prices formatted correctly
   - [ ] Category filters work
   - [ ] Search functionality works

6. Click on product
   - [ ] Product detail page loads
   - [ ] All product info displays
   - [ ] Images gallery works
   - [ ] Add to cart button works

#### Shopping Cart Tests

7. Add products to cart
   - [ ] Item added confirmation
   - [ ] Cart icon updates
   - [ ] Cart page accessible
   - [ ] Can update quantities
   - [ ] Can remove items
   - [ ] Subtotal calculates correctly

#### Checkout Process

8. Navigate to checkout
   - [ ] Shipping form displays
   - [ ] Payment options available
   - [ ] Order summary correct
   - [ ] Can submit order (test mode)

---

### ✅ Phase 3: Admin Dashboard (15 minutes)

**Note:** Must be logged in as admin user

#### Dashboard Access

1. Navigate to: /admin
   - [ ] Admin login required
   - [ ] Non-admin users blocked
   - [ ] Dashboard loads

#### Metrics Display

2. Admin Dashboard: /admin/dashboard
   - [ ] Revenue card displays
   - [ ] Orders count shows
   - [ ] Products count shows
   - [ ] Users count shows
   - [ ] Charts render (if data exists)
   - [ ] No loading errors

#### Sales Analytics

3. Sales Analytics: /admin/sales
   - [ ] Sales chart renders
   - [ ] Date filters work
   - [ ] Export functionality present
   - [ ] Sales data accurate

#### Product Analytics

4. Product Analytics: /admin/products/analytics
   - [ ] Product performance data
   - [ ] Category breakdown
   - [ ] Top products list
   - [ ] Charts interactive

#### Order Management

5. Orders: /admin/orders
   - [ ] Orders list displays
   - [ ] Can filter by status
   - [ ] Can search orders
   - [ ] Can view order details
   - [ ] Can update order status

#### Product Management

6. Products: /admin/products
   - [ ] Products list displays
   - [ ] Can create new product
   - [ ] Can edit product
   - [ ] Can delete product
   - [ ] Image upload works

#### Settings Panel

7. Settings: /admin/settings
   - [ ] All tabs accessible
   - [ ] Store settings editable
   - [ ] Payment config displays
   - [ ] Shipping zones work
   - [ ] Can save changes

---

### ✅ Phase 4: Mobile Responsiveness (10 minutes)

**Test on mobile device or use browser DevTools (F12 → Device Toolbar)**

#### Breakpoints to Test:

- Mobile: 375px (iPhone SE)
- Mobile Large: 414px (iPhone Plus)
- Tablet: 768px (iPad)
- Desktop: 1920px (Full HD)

#### Mobile Checks:

1. Homepage
   - [ ] Hamburger menu works
   - [ ] Text readable (not too small)
   - [ ] Images scale properly
   - [ ] No horizontal scroll

2. Product Pages
   - [ ] Images swipeable
   - [ ] Add to cart button accessible
   - [ ] Text not overlapping

3. Admin Dashboard (Mobile)
   - [ ] Sidebar becomes drawer
   - [ ] Tables switch to cards
   - [ ] Touch targets ≥44px
   - [ ] All features accessible

4. Forms
   - [ ] Input fields large enough
   - [ ] Buttons tappable
   - [ ] Virtual keyboard doesn't break layout

---

## 🚀 POST-DEPLOYMENT TESTING (Production)

### ✅ Phase 5: Deployment Verification (10 minutes)

#### Vercel Deployment

1. Check Vercel Dashboard
   - [ ] Build completed successfully
   - [ ] No build errors
   - [ ] Deployment URL active
   - [ ] Domain configured (if custom)

#### Health Checks

```powershell
# Replace YOUR-APP with your Vercel URL

# API Health
curl https://YOUR-APP.vercel.app/api/health

# Expected: {"status":"ok","timestamp":"..."}
```

**Checklist:**

- [ ] API responds
- [ ] Status = "ok"
- [ ] Response time <500ms

```powershell
# Database Connection
curl https://YOUR-APP.vercel.app/api/admin/dashboard/metrics

# Expected: {"revenue":..., "orders":..., "products":...}
# Or 401 if not authenticated (which is correct)
```

**Checklist:**

- [ ] Database connection works
- [ ] Metrics return or auth required
- [ ] No 500 errors

---

### ✅ Phase 6: Production Functionality (15 minutes)

**Repeat all Phase 2 & 3 tests on production URL**

Critical Production Tests:

1. Homepage loads
   - [ ] https://YOUR-APP.vercel.app
   - [ ] No errors in browser console
   - [ ] All assets load (images, fonts)

2. User can register/login
   - [ ] OAuth works (Google)
   - [ ] Email/password works
   - [ ] Sessions persist

3. Products display
   - [ ] Images load from ImageKit
   - [ ] Data from database correct

4. Admin dashboard accessible
   - [ ] Can login as admin
   - [ ] All pages load
   - [ ] Data displays correctly

5. Email notifications
   - [ ] Test order confirmation email
   - [ ] Check spam folder if missing
   - [ ] Verify sender address

6. Stripe webhooks
   - [ ] Test payment in test mode
   - [ ] Webhook events received
   - [ ] Order status updates

---

### ✅ Phase 7: Performance Testing (10 minutes)

#### Page Speed Test

1. Go to: https://pagespeed.web.dev/
2. Enter your production URL
3. Run test

**Target Scores:**

- [ ] Performance: >80
- [ ] Accessibility: >90
- [ ] Best Practices: >90
- [ ] SEO: >80

#### Load Time Monitoring

```powershell
# Measure page load time
curl -w "@curl-format.txt" -o /dev/null -s https://YOUR-APP.vercel.app

# Create curl-format.txt with:
# time_namelookup: %{time_namelookup}\n
# time_connect: %{time_connect}\n
# time_starttransfer: %{time_starttransfer}\n
# time_total: %{time_total}\n
```

**Target Times:**

- [ ] Homepage: <2 seconds
- [ ] Product page: <2.5 seconds
- [ ] Admin dashboard: <3 seconds
- [ ] API responses: <500ms

#### Database Query Performance

Check in Supabase Dashboard:

- [ ] Query time <200ms (p95)
- [ ] No slow queries (>1s)
- [ ] Indexes being used

---

## 🔍 ANALYTICS VERIFICATION

### Google Analytics Setup

1. Go to: https://analytics.google.com/
2. Select your property
3. Real-Time report

**Test:**

- [ ] Visit your site in incognito window
- [ ] Should see 1 active user in GA
- [ ] Page views tracked
- [ ] Events tracked (if configured)

### Vercel Analytics

1. Vercel Dashboard → Analytics
2. Check:
   - [ ] Page views tracked
   - [ ] Performance metrics
   - [ ] Web Vitals data

---

## 🚨 ERROR MONITORING

### Check Logs

1. Vercel Dashboard → Deployments → Your deployment
2. Click "View Function Logs"

**Look for:**

- [ ] No 500 errors
- [ ] No database connection errors
- [ ] No authentication errors
- [ ] API response times normal

### Error Boundaries

Test error handling:

1. Navigate to non-existent page
   - [ ] 404 page displays
   - [ ] Not generic Vercel error

2. Trigger validation error
   - [ ] Error message displays
   - [ ] Form doesn't break
   - [ ] Can recover

---

## 📊 MONITORING SETUP (Post-Launch)

### Week 1 Monitoring

Daily checks:

- [ ] Uptime (should be >99%)
- [ ] Error rate (should be <1%)
- [ ] Page load times
- [ ] User registrations
- [ ] Order conversions

### Alerts to Set Up

Configure in Vercel:

- [ ] Deployment failures
- [ ] High error rate (>5%)
- [ ] Slow response times (>2s)
- [ ] Build failures

---

## 📝 TEST RESULTS TEMPLATE

```
==============================================
KOLLECT-IT DEPLOYMENT TEST RESULTS
==============================================
Date: [Date]
Tester: [Name]
Environment: [Local/Production]
URL: [URL]

PRE-DEPLOYMENT TESTS:
✓ Build & Start: [PASS/FAIL]
✓ Core Functionality: [PASS/FAIL]
✓ Admin Dashboard: [PASS/FAIL]
✓ Mobile Responsive: [PASS/FAIL]

POST-DEPLOYMENT TESTS:
✓ Deployment: [PASS/FAIL]
✓ Production Functionality: [PASS/FAIL]
✓ Performance: [PASS/FAIL]
✓ Analytics: [PASS/FAIL]

PERFORMANCE METRICS:
- Homepage Load: [X]s
- PageSpeed Score: [X]/100
- API Response: [X]ms

ISSUES FOUND:
1. [Issue description]
2. [Issue description]

DEPLOYMENT STATUS: [GO/NO-GO]
==============================================
```

---

## 🎯 QUICK TEST SCRIPT

Save as `test-deployment.ps1`:

```powershell
# Quick deployment test script
param([string]$Url = "http://localhost:3000")

Write-Host "Testing Kollect-It Deployment..." -ForegroundColor Cyan

# Test endpoints
$endpoints = @(
    "/",
    "/api/health",
    "/products",
    "/admin"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$Url$endpoint" -Method GET -UseBasicParsing
        $status = $response.StatusCode

        if ($status -eq 200 -or $status -eq 401) {
            Write-Host "✓ $endpoint - OK" -ForegroundColor Green
        } else {
            Write-Host "✗ $endpoint - Status: $status" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ $endpoint - Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
```

---

## ✅ DEPLOYMENT SIGN-OFF

Before marking deployment complete, ensure:

- [ ] All critical tests pass
- [ ] Performance meets targets
- [ ] Analytics tracking
- [ ] Monitoring configured
- [ ] Team trained on admin dashboard
- [ ] Documentation updated
- [ ] Backup plan in place

**Deployment approved by:** **\*\***\_\_\_**\*\***  
**Date:** **\*\***\_\_\_**\*\***

---

## 📞 TROUBLESHOOTING CONTACTS

- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
- Next.js Docs: https://nextjs.org/docs
- Project Issues: [Your GitHub Issues URL]
