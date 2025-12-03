# Kollect-It Pre-Launch Review
## Comprehensive Site Audit - December 2025

---

## Executive Summary

After a thorough review of the Kollect-It codebase, I've identified items across several categories that need attention before going live. The site has solid foundations with working authentication, checkout with Stripe, database schema, and a luxury design system. However, there are critical gaps, incomplete features, and quality improvements needed.

---

## 🔴 CRITICAL - Must Fix Before Launch

### 1. Forgot Password Page Missing
**Status:** ❌ NOT IMPLEMENTED  
**Impact:** High - Users cannot recover accounts

The login page (`/login`) has a "Forgot?" link pointing to `/forgot-password`, but this page and its associated functionality do not exist.

**Files Affected:**
- `src/app/login/page.tsx` (line 148) - Links to `/forgot-password`
- Missing: `src/app/forgot-password/page.tsx`
- Missing: `src/app/api/auth/forgot-password/route.ts`
- Missing: `src/app/api/auth/reset-password/route.ts`
- Missing: Password reset email template in `src/emails/`

**What's Needed:**
- [ ] Create `/forgot-password` page with email input form
- [ ] Create `/reset-password` page to handle reset tokens
- [ ] Add `resetToken` and `resetTokenExpiry` fields to User model in Prisma
- [ ] Create API route to generate reset token and send email
- [ ] Create API route to verify token and update password
- [ ] Create `PasswordResetEmail.tsx` email template
- [ ] Add `sendPasswordResetEmail()` function to `src/lib/email.ts`

---

### 2. Contact Form Not Functional
**Status:** ❌ SIMULATED ONLY  
**Impact:** High - Customer inquiries lost

The contact form in `src/components/forms/ContactForm.tsx` (line 54) has a `// 🚨 REPLACE THIS WITH YOUR ACTUAL API CALL` comment and only simulates submission with a timeout.

**What's Needed:**
- [ ] Create `/api/contact/route.ts` to receive form submissions
- [ ] Either store in database OR send via email to admin
- [ ] Consider using Resend (already in dependencies) for sending

---

### 3. Newsletter Signup Not Storing Data
**Status:** ⚠️ LOGGING ONLY  
**Impact:** Medium - Losing potential subscribers

`src/app/api/newsletter/subscribe/route.ts` only logs submissions to console (line 12-13). The footer newsletter form also lacks proper form handling.

**What's Needed:**
- [ ] Create `NewsletterSubscriber` model in Prisma schema
- [ ] Store email addresses in database
- [ ] Add email verification flow (recommended)
- [ ] Connect footer newsletter form to API properly

---

### 4. Admin Reports Missing Auth Check
**Status:** ⚠️ SECURITY CONCERN  
**Impact:** High - Potential unauthorized access

`src/app/api/admin/reports/route.ts` has `// TODO: Add auth check for admin` comments on lines 11 and 38.

**What's Needed:**
- [ ] Add `requireAdminAuth()` call from `src/lib/auth-admin.ts` to both GET and POST handlers

---

## 🟡 IMPORTANT - Should Fix Before Launch

### 5. Email Service Configuration
**Status:** ⚠️ PARTIALLY CONFIGURED  
**Impact:** Medium - No transactional emails

Email service in `src/lib/email.ts` is well-architected but requires environment variables that may not be set:

**Required Environment Variables:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kollect-it.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL=james@kollect-it.com
```

**What's Needed:**
- [ ] Set up Google Workspace or alternative SMTP
- [ ] Generate App Password for Gmail SMTP
- [ ] Configure all email environment variables in Vercel
- [ ] Test email sending in production

---

### 6. Missing Admin Products Page
**Status:** ⚠️ NOT FOUND  
**Impact:** Medium - Admin workflow gap

There's no `/admin/products` page for managing products directly, though there are:
- Product approval queue (`ApprovalQueue.tsx`)
- Product upload form (`ProductUploadForm.tsx`)
- Various product API routes

**What's Needed:**
- [ ] Create `/admin/products/page.tsx` for product listing/management
- [ ] Include edit, delete, and status change capabilities

---

### 7. Social Media Links Placeholder
**Status:** ⚠️ NON-FUNCTIONAL  
**Impact:** Low - Poor UX

Footer social icons (`src/components/Footer.tsx` lines 78-85) link to `#` instead of actual profiles.

**What's Needed:**
- [ ] Update Instagram, Facebook, Twitter links to actual profiles
- [ ] Or remove icons if no social presence yet

---

### 8. TODO Items in Production Code
**Status:** ⚠️ INCOMPLETE  
**Impact:** Varies - Missing functionality

Found 27+ TODO comments across the codebase:

| File | Issue |
|------|-------|
| `src/lib/cache.ts` | Replace with Redis for production |
| `src/lib/rate-limit.ts` | Replace with Redis for multi-instance |
| `src/lib/websocket/server.ts` | Multiple analytics calculations missing |
| `src/lib/email/reportSender.ts` | Google Workspace SMTP pending |
| `src/app/api/admin/reports/route.ts` | Auth check missing |
| `src/app/api/admin/analytics/products/route.ts` | View tracking not implemented |

---

## 🟢 RECOMMENDED - Nice to Have

### 9. Security Headers Enhancement
**Status:** ✅ BASIC IMPLEMENTED  
**Current:** X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy

**Recommended Additions:**
- [ ] Add Content-Security-Policy header
- [ ] Add Strict-Transport-Security (HSTS)
- [ ] Add Permissions-Policy header

---

### 10. Image Optimization Disabled
**Status:** ⚠️ WORKAROUND IN PLACE  
**Location:** `next.config.js` line 64

```javascript
unoptimized: true, // Temporarily disable image optimization to prevent timeout crashes
```

**What's Needed:**
- [ ] Investigate and resolve the timeout issues
- [ ] Re-enable image optimization for production performance

---

### 11. Debug Mode in Production
**Status:** ⚠️ SHOULD DISABLE  
**Location:** `src/lib/auth.ts` line 184

```javascript
debug: process.env.NODE_ENV === "development",
```

This is correctly environment-gated, but ensure `NODE_ENV=production` in Vercel.

---

### 12. Missing Error Boundary Pages
**Status:** ✅ BASIC EXISTS  
**Files:** `src/app/error.tsx`, `src/app/not-found.tsx`

Consider adding:
- [ ] Custom 500 error page styling matching luxury theme
- [ ] Add retry/refresh functionality to error page

---

## 📋 Pre-Launch Checklist

### Environment & Configuration
- [ ] All production environment variables set in Vercel
- [ ] `NEXTAUTH_SECRET` is unique and secure (32+ chars)
- [ ] `NEXTAUTH_URL` set to `https://kollect-it.com`
- [ ] Stripe keys are live mode (not test mode)
- [ ] Database URLs using production Supabase credentials
- [ ] Email service fully configured and tested

### Security
- [ ] Admin routes protected with `requireAdminAuth()`
- [ ] API rate limiting working (`src/lib/rate-limit.ts`)
- [ ] CSRF protection (handled by NextAuth)
- [ ] Input validation on all forms
- [ ] SQL injection protection (Prisma handles this)

### Functionality
- [ ] User registration works
- [ ] User login works
- [ ] **Forgot password works** (IMPLEMENT FIRST)
- [ ] **Contact form sends messages** (IMPLEMENT)
- [ ] **Newsletter captures emails** (IMPLEMENT)
- [ ] Product browsing works
- [ ] Add to cart works
- [ ] Checkout flow completes
- [ ] Order confirmation emails send
- [ ] Admin dashboard accessible
- [ ] Admin can manage orders

### Content
- [ ] All placeholder images replaced
- [ ] Social media links updated
- [ ] Legal pages reviewed (Privacy, Terms, Cookies)
- [ ] Contact information accurate
- [ ] About page content finalized

### Performance
- [ ] Run Lighthouse audit (target 90+ scores)
- [ ] Test on mobile devices
- [ ] Test on slow connections
- [ ] Verify CDN/ImageKit working

### SEO
- [ ] `robots.ts` configured for production
- [ ] `sitemap.ts` generating correct URLs
- [ ] OpenGraph images set
- [ ] Meta descriptions on all pages
- [ ] Structured data (JSON-LD) validated

---

## Quick Wins - Can Do Today

1. **Add auth to admin reports API** - 5 minutes
2. **Update social links or remove icons** - 5 minutes  
3. **Set EMAIL_* env vars in Vercel** - 10 minutes
4. **Add Content-Security-Policy header** - 15 minutes

---

## Estimated Implementation Times

| Task | Estimated Time |
|------|----------------|
| Forgot Password Flow | 3-4 hours |
| Contact Form API | 1 hour |
| Newsletter Storage | 1-2 hours |
| Admin Products Page | 2-3 hours |
| Email Service Setup | 1-2 hours |
| Security Headers | 30 minutes |
| Testing All Flows | 2-3 hours |
| **Total** | **~12-15 hours** |

---

## Files to Create

```
src/app/forgot-password/
└── page.tsx

src/app/reset-password/
└── page.tsx

src/app/api/auth/
├── forgot-password/
│   └── route.ts
└── reset-password/
    └── route.ts

src/app/api/contact/
└── route.ts

src/emails/
└── PasswordResetEmail.tsx

src/app/admin/products/
└── page.tsx
```

---

## Prisma Schema Updates Needed

```prisma
model User {
  // Add these fields for password reset
  resetToken        String?
  resetTokenExpiry  DateTime?
  
  // ... existing fields
}

model NewsletterSubscriber {
  id           String   @id @default(cuid())
  email        String   @unique
  confirmedAt  DateTime?
  createdAt    DateTime @default(now())
  
  @@index([email])
}

model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  
  @@index([createdAt])
  @@index([read])
}
```

---

## Conclusion

The Kollect-It marketplace has a solid technical foundation. The most critical items to address before launch are:

1. **Forgot Password functionality** - Users will need this
2. **Contact Form** - Primary way customers reach you
3. **Email Service** - Required for order confirmations
4. **Admin auth on reports** - Security requirement

Once these are implemented, the site will be ready for soft launch. The remaining items can be addressed iteratively.

---

*Generated: December 3, 2025*  
*Codebase Version: kollect-it-main*
