# Post-Launch Monitoring Guide

**Date:** January 19, 2026  
**Project:** Kollect-It Marketplace

---

## Current Implementation

| Monitoring Type | Tool | Status | Notes |
|-----------------|------|--------|-------|
| Error tracking | Vercel + Logger | ✅ | Structured logging in place |
| Performance | Web Vitals | ⚠️ | Implemented, needs analytics integration |
| Uptime | Vercel Status | ✅ | Automatic via Vercel |
| Analytics | Admin Dashboard | ✅ | Internal analytics available |
| Business Metrics | Custom | ✅ | Order tracking, user registration |

**Details:**

### Error Tracking ✅

**Current:**
- ✅ Centralized logger (`src/lib/logger.ts`)
- ✅ Error boundaries (`src/app/error.tsx`, `src/components/ErrorBoundary.tsx`)
- ✅ API error handling with `respondError()` helper
- ✅ Request IDs for tracing
- ✅ Vercel error logs (automatic)

**Logging Features:**
- Structured JSON logging
- Automatic redaction of sensitive data
- Request context tracking
- Error stack traces (dev only)

**Status:** ✅ **READY** - Error tracking infrastructure in place

### Performance Monitoring ⚠️

**Current:**
- ✅ Web Vitals tracking (`src/lib/web-vitals.ts`)
- ✅ Core Web Vitals: LCP, FID, CLS, FCP, TTFB
- ✅ Performance monitoring utilities
- ⚠️ **Needs:** Analytics provider integration

**Implementation:**
```typescript
// Web Vitals are tracked but need analytics integration
// Currently logs to console in development
// TODO: Integrate with analytics provider
```

**Status:** ⚠️ **PARTIAL** - Tracking implemented, needs analytics integration

### Uptime Monitoring ✅

**Current:**
- ✅ Vercel automatic uptime monitoring
- ✅ Health check endpoint (`/api/health`)
- ✅ Deployment status tracking

**Status:** ✅ **READY** - Vercel provides automatic uptime monitoring

### Analytics ✅

**Current:**
- ✅ Admin analytics dashboard (`/admin/analytics`)
- ✅ Custom analytics queries (`src/lib/analytics/queries.ts`)
- ✅ Business metrics tracking (orders, users, products)
- ⚠️ **Needs:** External analytics integration (Google Analytics, etc.)

**Status:** ✅ **READY** - Internal analytics available, external integration optional

---

## Recommended Setup

### Error Tracking

**Current Status:** ✅ **READY**

**Vercel Built-in:**
- Automatic error logging in Vercel dashboard
- Error grouping and deduplication
- Request/response logging

**Optional Enhancements:**

1. **Sentry Integration** (Recommended)
   ```typescript
   // Install: npm install @sentry/nextjs
   // Configure in next.config.js
   // Provides: Error tracking, performance monitoring, release tracking
   ```

2. **Enhanced Logging**
   - Current logger is excellent
   - Consider adding log aggregation service (Datadog, LogRocket)
   - Or use Vercel's built-in logging

**Action:** ✅ **No action required** - Current setup is sufficient

### Performance Monitoring

**Current Status:** ⚠️ **NEEDS INTEGRATION**

**Web Vitals Tracking:**
- ✅ Code implemented (`src/lib/web-vitals.ts`)
- ⚠️ Needs analytics provider integration

**Recommended Integration:**

#### Option 1: Vercel Analytics (Easiest)
```typescript
// Install: npm install @vercel/analytics
// Add to layout.tsx:
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### Option 2: Google Analytics
```typescript
// Add to layout.tsx:
import Script from 'next/script';

<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

#### Option 3: Custom Analytics Endpoint
```typescript
// Update sendMetricToAnalytics in web-vitals.ts:
async function sendMetricToAnalytics(metricName: string, value: number) {
  await fetch('/api/analytics/web-vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metric: metricName, value }),
  });
}
```

**Action:** ⚠️ **RECOMMENDED** - Integrate Web Vitals with analytics provider

### Uptime Monitoring

**Current Status:** ✅ **READY**

**Vercel Automatic:**
- ✅ Automatic uptime monitoring
- ✅ Deployment status tracking
- ✅ Build status notifications

**Optional External Monitoring:**

1. **UptimeRobot** (Free tier available)
   - Monitor: https://kollect-it.com
   - Check interval: 5 minutes
   - Alert: Email/SMS on downtime

2. **Pingdom** (Paid)
   - More advanced features
   - Global monitoring points
   - Detailed performance metrics

**Action:** ✅ **Optional** - Vercel monitoring is sufficient

### Business Metrics

**Current Status:** ✅ **READY**

**Tracked Metrics:**
- ✅ Order completion
- ✅ User registration
- ✅ Product views
- ✅ Search usage
- ✅ Checkout conversion

**Available in:**
- Admin dashboard (`/admin/analytics`)
- API endpoints (`/api/admin/analytics/*`)

**Action:** ✅ **No action required** - Metrics tracking in place

---

## Alerts to Configure

### 1. Error Spike Alert

**Trigger:** If errors > 10 per minute  
**Channel:** Email/SMS  
**Action:** Review error logs, check for patterns

**Setup:**
- Vercel dashboard → Settings → Notifications
- Configure error threshold alerts
- Or use external service (Sentry, Datadog)

### 2. Downtime Alert

**Trigger:** If site unreachable > 1 minute  
**Channel:** Email/SMS  
**Action:** Check Vercel status, verify deployment

**Setup:**
- Vercel automatic (built-in)
- Or external service (UptimeRobot)

### 3. Performance Alert

**Trigger:** If LCP > 2.5s (poor threshold)  
**Channel:** Email  
**Action:** Review performance, check images/CDN

**Setup:**
- Requires analytics integration (see above)
- Or manual monitoring via Vercel Analytics

### 4. Payment Failure Alert

**Trigger:** If payment failures > 5% of attempts  
**Channel:** Email  
**Action:** Check Stripe dashboard, verify API keys

**Setup:**
- Monitor Stripe dashboard
- Set up webhook alerts in Stripe
- Track via admin analytics

---

## First 24 Hours Checklist

- [ ] Monitor error logs hourly
  - Check Vercel dashboard → Logs
  - Look for 500 errors
  - Check for payment failures

- [ ] Check Vercel deployment status
  - Verify deployment successful
  - Check build logs for warnings
  - Verify all routes accessible

- [ ] Verify checkout flow working
  - Test with small payment
  - Verify order creation
  - Check email notifications

- [ ] Check email notifications sending
  - Order confirmations
  - Password resets
  - Contact form submissions

- [ ] Monitor database performance
  - Check Supabase dashboard
  - Monitor query performance
  - Check connection pool usage

- [ ] Check Stripe dashboard
  - Verify payments processing
  - Check webhook deliveries
  - Monitor payment success rate

---

## First Week Checklist

- [ ] Review error trends
  - Identify common errors
  - Fix any recurring issues
  - Optimize error-prone paths

- [ ] Check Core Web Vitals
  - LCP should be < 2.5s
  - CLS should be < 0.1
  - FID should be < 100ms

- [ ] Review user feedback
  - Check contact form submissions
  - Monitor support requests
  - Address common issues

- [ ] Check search analytics
  - Review search queries
  - Identify popular products
  - Optimize search results

- [ ] Monitor conversion rate
  - Track checkout completion
  - Identify drop-off points
  - Optimize conversion funnel

---

## Incident Response

### If Issues Detected

**Step 1: Check Vercel Deployment Logs**
- Go to Vercel dashboard → Deployments
- Review latest deployment logs
- Check for build errors or runtime errors

**Step 2: Check Supabase Database Status**
- Go to Supabase dashboard
- Verify database is accessible
- Check connection pool status
- Review query performance

**Step 3: Check Stripe Dashboard**
- Verify Stripe API is operational
- Check webhook delivery status
- Review payment processing logs

**Step 4: Rollback if Critical**
- Vercel instant rollback available
- Go to Deployments → Previous deployment → Promote
- Estimated time: < 2 minutes

**Step 5: Investigate Root Cause**
- Review error logs with request IDs
- Check environment variables
- Verify external service status

---

## Key URLs

### Monitoring Dashboards

- **Vercel Dashboard:** https://vercel.com/[team]/kollect-it
  - Deployments, logs, analytics, environment variables

- **Supabase Dashboard:** https://app.supabase.com/project/[id]
  - Database, logs, API status, connection pool

- **Stripe Dashboard:** https://dashboard.stripe.com
  - Payments, webhooks, logs, API status

- **Domain DNS:** [Your registrar dashboard]
  - DNS settings, SSL certificate status

### Health Check Endpoints

- **Application Health:** https://kollect-it.com/api/health
- **Environment Check:** https://kollect-it.com/api/diagnostics/env
- **Error Diagnostics:** Vercel dashboard → Logs

---

## Monitoring Tools Setup

### Vercel Analytics (Recommended)

**Setup:**
```bash
npm install @vercel/analytics
```

**Add to `src/app/layout.tsx`:**
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Benefits:**
- Automatic Core Web Vitals tracking
- Page view analytics
- Real-time monitoring
- No additional configuration needed

### Sentry (Optional - Error Tracking)

**Setup:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Benefits:**
- Advanced error tracking
- Performance monitoring
- Release tracking
- User context

### Google Analytics (Optional)

**Setup:**
- Create GA4 property
- Add measurement ID to environment variables
- Add tracking script to layout.tsx

**Benefits:**
- Comprehensive analytics
- User behavior tracking
- Conversion tracking
- Custom events

---

## Performance Monitoring Integration

### Update Web Vitals to Send to Analytics

**File:** `src/lib/web-vitals.ts`

**Current:**
```typescript
function sendMetricToAnalytics(metricName: string, value: number) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metricName}:`, `${Math.round(value)}ms`);
  }
  // TODO: Integrate with analytics provider
}
```

**Recommended Update (Vercel Analytics):**
```typescript
import { track } from '@vercel/analytics';

function sendMetricToAnalytics(metricName: string, value: number) {
  // Send to Vercel Analytics
  track('web-vital', {
    metric: metricName,
    value: Math.round(value),
  });
  
  // Also log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${metricName}:`, `${Math.round(value)}ms`);
  }
}
```

**Or Custom Endpoint:**
```typescript
async function sendMetricToAnalytics(metricName: string, value: number) {
  try {
    await fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metricName,
        value: Math.round(value),
        timestamp: Date.now(),
      }),
    });
  } catch (error) {
    // Fail silently - don't break user experience
  }
}
```

---

## Summary

**Current Monitoring Status:**
- ✅ Error tracking: Ready (Vercel + Logger)
- ⚠️ Performance: Needs analytics integration
- ✅ Uptime: Ready (Vercel automatic)
- ✅ Analytics: Ready (Admin dashboard)
- ✅ Business metrics: Ready (Custom tracking)

**Recommended Actions:**
1. ✅ **Immediate:** No action required (current setup sufficient)
2. ⚠️ **Recommended:** Integrate Web Vitals with Vercel Analytics
3. ⚠️ **Optional:** Set up external uptime monitoring (UptimeRobot)
4. ⚠️ **Optional:** Configure Sentry for advanced error tracking

**Priority:**
- **High:** Monitor error logs (automatic via Vercel)
- **Medium:** Integrate Web Vitals analytics
- **Low:** External monitoring services

---

**Status:** ✅ **READY FOR MONITORING**

*Current infrastructure is sufficient for launch. Enhancements can be added post-launch based on needs.*
