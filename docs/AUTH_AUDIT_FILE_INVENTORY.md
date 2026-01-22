# Authentication & Authorization — File Inventory

**Prepared for Codex Auth Audit**  
**Date:** 2026-01-21

---

## 📁 Core Authentication Files

### NextAuth Configuration
- **`src/lib/auth.ts`** - Main NextAuth configuration
  - Credentials provider setup
  - Password hashing with bcrypt
  - Session callbacks
  - JWT callbacks
  - Comprehensive logging

### NextAuth API Route
- **`src/app/api/auth/[...nextauth]/route.ts`** - NextAuth API handler
  - GET and POST handlers
  - Exports NextAuth handler

### Registration
- **`src/app/api/auth/register/route.ts`** - User registration endpoint
  - Email/password validation
  - Password hashing
  - User creation

---

## 🔐 Admin Authentication Helpers

### Admin Auth Utilities
- **`src/lib/auth-admin.ts`** - Admin-specific auth helpers
  - `requireAdminAuth()` - Throws if not admin
  - `withAdminAuth()` - Wrapper for admin routes

### General Auth Helpers
- **`src/lib/auth-helpers.ts`** - General auth utilities
  - `checkAdminAuth()` - Returns auth status object

---

## 🛡️ Type Definitions

### NextAuth Type Extensions
- **`src/types/next-auth.d.ts`** - TypeScript type extensions
  - User interface (adds `id`, `role`)
  - Session interface (adds `id`, `role`)
  - JWT interface (adds `id`, `role`)

---

## 🚧 Middleware

### Request Middleware
- **`middleware.ts`** - Next.js middleware
  - Currently: Request logging only
  - **Note:** Does NOT enforce authentication (client-side checks only)

---

## 📄 Admin Pages (Client-Side Protection)

All admin pages use client-side authentication checks:

### Pattern Used:
```typescript
const { data: session, status } = useSession();

useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/admin/login");
  } else if (status === "authenticated" && session?.user?.role !== "admin") {
    router.push("/");
  }
}, [status, session, router]);
```

### Admin Pages (19 files):
1. `src/app/admin/dashboard/page.tsx`
2. `src/app/admin/login/page.tsx`
3. `src/app/admin/products/page.tsx`
4. `src/app/admin/products/new/page.tsx`
5. `src/app/admin/products/[id]/edit/page.tsx`
6. `src/app/admin/orders/page.tsx`
7. `src/app/admin/orders/[id]/page.tsx`
8. `src/app/admin/categories/page.tsx`
9. `src/app/admin/customers/page.tsx`
10. `src/app/admin/sellers/page.tsx`
11. `src/app/admin/analytics/page.tsx`
12. `src/app/admin/analytics/sales/page.tsx`
13. `src/app/admin/analytics/traffic/page.tsx`
14. `src/app/admin/analytics/products/page.tsx`
15. `src/app/admin/analytics/customers/page.tsx`
16. `src/app/admin/email/page.tsx`
17. `src/app/admin/reports/page.tsx`
18. `src/app/admin/settings/page.tsx`
19. `src/app/admin/settings/email/page.tsx`

---

## 🔌 Admin API Routes (Server-Side Protection)

### Protected Routes Using `requireAdminAuth()`:
- `src/app/api/admin/products/route.ts`
- `src/app/api/admin/products/create/route.ts`
- `src/app/api/admin/products/[id]/route.ts`
- `src/app/api/admin/products/approve/route.ts`
- `src/app/api/admin/products/bulk-approve/route.ts`
- `src/app/api/admin/products/ingest/route.ts`
- `src/app/api/admin/products/analyze/route.ts`
- `src/app/api/admin/products/next-sku/route.ts`
- `src/app/api/admin/orders/route.ts`
- `src/app/api/admin/orders/[id]/route.ts`
- `src/app/api/admin/categories/route.ts`
- `src/app/api/admin/categories/[id]/route.ts`
- `src/app/api/admin/categories/upload-image/route.ts`
- `src/app/api/admin/analytics/route.ts`
- `src/app/api/admin/analytics/sales/route.ts`
- `src/app/api/admin/analytics/traffic/route.ts`
- `src/app/api/admin/analytics/products/route.ts`
- `src/app/api/admin/analytics/customers/route.ts`
- `src/app/api/admin/settings/route.ts`
- `src/app/api/admin/email/*` routes
- `src/app/api/admin/reports/*` routes
- `src/app/api/admin/sellers/*` routes
- `src/app/api/admin/performance/route.ts`

### Protected Routes Using `checkAdminAuth()`:
- `src/app/api/products/route.ts` (POST only)

---

## 🗄️ Database Schema

### User Model
- **`prisma/schema.prisma`** - User model definition
  - `id` - CUID primary key
  - `email` - Unique, required
  - `password` - Optional (nullable for OAuth users)
  - `role` - String, default "user"
  - `name`, `image`, `phone`, `address`, etc.

---

## 🧪 Testing & Utilities

### Admin Creation Scripts
- **`scripts/create-admin.ts`** - Secure admin user creation
- **`scripts/fix-admin-auth.ts`** - Quick password reset (just added)
- **`scripts/create-all-admins.ts`** - Bulk admin creation
- **`scripts/setup-james-admin.ts`** - Specific admin setup

### Auth Testing
- **`tests/middleware/auth.test.ts`** - Auth middleware tests
- **`scripts/test-logins.ts`** - Login flow testing

---

## 🔍 Hooks & Components

### Auth Hooks
- **`src/hooks/useAdminAuth.tsx`** - Admin auth hook
  - `useAdminAuth()` - Returns session, loading state
  - `withAdminAuth()` - HOC for admin pages

### Session Provider
- **`src/components/SessionProvider.tsx`** - NextAuth session provider wrapper

---

## ⚠️ Security Observations

### Current Protection Pattern:
1. **Admin Pages:** Client-side checks only (useSession + useEffect redirect)
2. **Admin API Routes:** Server-side checks (requireAdminAuth/checkAdminAuth)
3. **Middleware:** Does NOT enforce authentication

### Potential Issues:
- ⚠️ Admin pages rely on client-side redirects (can be bypassed)
- ⚠️ No server-side page protection (SSR checks)
- ✅ API routes are properly protected server-side
- ✅ Password hashing uses bcrypt (secure)

---

## 📋 Files to Review in Codex Audit

### Priority 1 (Core Auth):
1. `src/lib/auth.ts`
2. `src/lib/auth-admin.ts`
3. `src/lib/auth-helpers.ts`
4. `src/app/api/auth/[...nextauth]/route.ts`
5. `src/app/api/auth/register/route.ts`

### Priority 2 (Type Safety):
6. `src/types/next-auth.d.ts`

### Priority 3 (Protection):
7. `middleware.ts`
8. Sample admin pages (dashboard, orders, products)
9. Sample admin API routes

### Priority 4 (Database):
10. `prisma/schema.prisma` (User model)

---

**Ready for Codex Audit** ✅
