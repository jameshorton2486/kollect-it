# 📋 MANUAL TASKS REQUIRED - KOLLECT-IT MARKETPLACE

**Generated:** November 16, 2025  
**Post-Automation Review**

---

## 🔧 DEPLOYMENT CONFIGURATION

### 1. Database Connection (Supabase)
**Priority:** HIGH  
**Action Required:** If using Supabase with connection pooling:
- Uncomment `directUrl = env("DIRECT_URL")` in `prisma/schema.prisma` 
- Set `DIRECT_URL` environment variable in production
- `DIRECT_URL` should be the direct database connection (port 5432)
- `DATABASE_URL` should be the pooled connection (port 6543)

### 2. Domain & DNS Setup
**Priority:** HIGH  
**Action Required:** Configure custom domain in Vercel dashboard
- **Dependencies:** Access to domain registrar (Bluehost)
- **Estimated Time:** 15 minutes

### 3. Production Environment Variables
**Priority:** HIGH  
**Action Required:** Copy `.env.local` contents to Vercel environment variables
- **Dependencies:** Vercel dashboard access
- **Estimated Time:** 10 minutes

### 4. Stripe Live Mode
**Priority:** MEDIUM (when ready for payments)  
**Action Required:** Update Stripe keys to live mode
- **Dependencies:** Stripe dashboard access
- **Estimated Time:** 5 minutes

### 5. Email Provider Setup
**Priority:** MEDIUM  
**Action Required:** Configure production SMTP settings
- **Dependencies:** Email provider credentials (Resend/SendGrid)
- **Estimated Time:** 15 minutes

### 6. Real Product Images
**Priority:** LOW (cosmetic)  
**Action Required:** Upload actual product photos to ImageKit
- **Dependencies:** Product photography and ImageKit access
- **Estimated Time:** Variable (content creation)

---

## 🛡️ SECURITY NOTES

**CRITICAL SECURITY AUDIT FINDINGS:**

### ❌ Admin API Authentication Inconsistency (FIXED SAMPLES)
- **Issue:** Admin API routes have inconsistent authentication patterns
- **Risk:** Some routes only check for session existence, not admin role
- **Action Required:** Systematically update remaining `/api/admin/**` routes to use the `requireAdminAuth()` helper from `src/lib/auth-admin.ts`
- **Progress:** Created auth utility and fixed 2 sample routes
- **Remaining Work:** Apply consistent auth pattern to ~68 remaining admin API routes

### ✅ Color Token Migration (COMPLETED)
- **Issue:** Legacy color tokens and deprecated classes found in codebase
- **Action Taken:** Migrated all `var(--color-*)` and `brand-*` classes to semantic tokens
- **Files Updated:** ProductCard.tsx, ContactForm.tsx, CTA.tsx, CategoryFilters.tsx, and others
- **Result:** Consistent semantic color system applied across all components

### ✅ Security Measures Properly Implemented
- [x] No hardcoded secrets in repository
- [x] Admin UI pages protected with authentication  
- [x] Password hashing with bcrypt
- [x] Environment variables properly configured
- [x] XSS protection implemented
- [x] CORS properly secured (no wildcard origins)
- [x] Database schema properly configured

---

*Updated by verification audit - November 16, 2025*