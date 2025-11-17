# MASTER DEPLOYMENT AGENT PROMPT
## Complete Autonomous Deployment for Kollect-It Marketplace

**Purpose:** Execute complete production deployment in 6-8 hours with minimal human intervention
**Target:** Production-ready Kollect-It Marketplace with full e-commerce functionality
**Execution:** Paste entire prompt into VS Code Copilot Chat for autonomous execution

---

## EXECUTION INSTRUCTIONS

1. **Copy entire prompt** (scroll to bottom for complete prompt between === markers)
2. **Open VS Code** at project root: `C:\Users\james\kollect-it-marketplace-1`
3. **Press:** `Ctrl+Shift+A` (Copilot Chat)
4. **Paste:** Complete prompt
5. **Add:** "Execute all phases autonomously. Report status at each phase completion."
6. **Press:** Enter
7. **Monitor:** 6-8 hour autonomous execution

---

## DEPLOYMENT PHASES OVERVIEW

### Phase 0: Environment Initialization (30 min)
- Project structure analysis
- Environment variable validation
- Dependency verification

### Phase 1: Security Audit & Lockdown (60 min)
- Admin route authentication verification
- Role-based access control validation
- Security header configuration

### Phase 2: Image System Consolidation (45 min)
- Cloudinary cleanup and standardization
- ImageKit integration verification
- Image optimization validation

### Phase 3: Database Optimization (30 min)
- Prisma schema validation
- Database connection testing
- Performance optimization

### Phase 4: Build & Performance (45 min)
- Production build optimization
- Bundle analysis and optimization
- Performance testing

### Phase 5: API Integration Testing (60 min)
- Stripe payment integration testing
- Email system validation
- External API connectivity

### Phase 6: Production Deployment (90 min)
- Environment variable setup
- Deployment to production
- Health checks and monitoring

### Phase 7: Post-Deployment Validation (60 min)
- Functional testing
- Security validation
- Performance monitoring setup

---

## ===START COMPLETE AGENT PROMPT===

You are an expert full-stack developer and DevOps engineer tasked with completing the production deployment of the Kollect-It Marketplace. Execute all phases autonomously, reporting status at each completion.

## CRITICAL PROJECT CONTEXT

**Project:** Kollect-It Marketplace (Next.js 15.5.6, Bun runtime)
**Database:** Supabase PostgreSQL with Prisma ORM
**Authentication:** NextAuth.js
**Payments:** Stripe integration
**Images:** ImageKit CDN with some legacy Cloudinary references
**Deployment Target:** Production-ready e-commerce platform

**Current Status:** 
- TypeScript compilation: ✅ PASSING
- Production build: ✅ PASSING  
- Basic environment: ✅ CONFIGURED
- Security audit: ❌ PENDING
- Image system: ❌ NEEDS CLEANUP
- Production deployment: ❌ PENDING

---

## PHASE 0: ENVIRONMENT INITIALIZATION (30 minutes)

### Step 0.1: Project Structure Analysis

**Task:** Verify project structure and key files

**Commands to execute:**
```powershell
# Verify project structure
Get-ChildItem -Name | Where-Object { $_ -match "(src|pages|public|prisma)" }

# Check critical files exist
Test-Path package.json, next.config.js, tsconfig.json, .env.local, "prisma/schema.prisma"

# Verify Node.js and Bun versions
bun --version
node --version
```

**Expected Results:**
- All critical directories present
- All config files exist
- Bun runtime operational
- Node.js v20+ installed

**If any issues found:** Fix immediately before proceeding

### Step 0.2: Environment Variable Validation

**Task:** Validate all required environment variables

**Check these critical variables in .env.local:**
```
DATABASE_URL (Supabase connection)
DIRECT_URL (Supabase direct connection)
NEXTAUTH_URL (should be localhost:3001 for dev)
NEXTAUTH_SECRET (minimum 32 chars)
STRIPE_SECRET_KEY (sk_test_ prefix for test mode)
IMAGEKIT_PRIVATE_KEY (should be set)
```

**Commands:**
```powershell
# Check .env.local exists and is in .gitignore
Get-Content .env.local | Select-String "DATABASE_URL|STRIPE_SECRET_KEY|IMAGEKIT_PRIVATE_KEY"
git check-ignore .env.local
```

**Expected:** All critical env vars present, .env.local protected by git

**Fix any issues:** Update missing variables, ensure proper formatting

### Step 0.3: Dependency Verification

**Task:** Ensure all dependencies are installed and up-to-date

**Commands:**
```powershell
# Install/verify dependencies
bun install

# Check for security vulnerabilities
bun audit

# Verify TypeScript compilation
bun run typecheck
```

**Expected:** Clean install, no critical vulnerabilities, TypeScript passes

**Report Phase 0 Status:**
```
✓ PHASE 0 COMPLETE
- Project structure: [PASS/FAIL]
- Environment variables: [PASS/FAIL] 
- Dependencies: [PASS/FAIL]
- TypeScript: [PASS/FAIL]
```

---

## PHASE 1: SECURITY AUDIT & LOCKDOWN (60 minutes)

### Step 1.1: Admin Route Authentication Audit

**Critical Task:** Verify ALL /api/admin/* routes are properly secured

**Search Strategy:**
1. Find all admin API routes
2. Verify each has authentication
3. Check role-based access control

**Commands:**
```powershell
# Find all admin routes
Get-ChildItem -Path "src/app/api/admin" -Recurse -Name "route.ts" | ForEach-Object { "src/app/api/admin/$_" }
```

**For each admin route file found:**

**Required Security Pattern:**
Each route.ts file must have this at the top of request handlers:
```typescript
import { auth } from "@/auth" // or your auth import
import { redirect } from "next/navigation"

export async function GET/POST/PUT/DELETE() {
  const session = await auth()
  
  if (!session || session.user.role !== 'ADMIN') {
    return new Response("Unauthorized", { status: 403 })
  }
  
  // ... rest of route logic
}
```

**Audit Process:**
1. Open each admin route file
2. Check for auth import
3. Verify session check exists
4. Confirm role validation (ADMIN role required)
5. Test unauthorized access returns 403

**Auto-fix any missing security:**
If any admin route lacks proper auth:
1. Add auth import if missing
2. Add session check at route start
3. Add role validation
4. Ensure proper error response

### Step 1.2: NextAuth Configuration Validation

**Task:** Verify NextAuth is properly configured for production security

**Check file:** `src/app/api/auth/[...nextauth]/route.ts` or equivalent

**Required configurations:**
```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    // Verify secure provider configuration
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      // Verify role is included in JWT
      if (user) token.role = user.role
      return token
    },
    session: ({ session, token }) => {
      // Verify role is included in session
      session.user.role = token.role
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/authentication'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Production security settings
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
}
```

**Validation checklist:**
- [ ] JWT strategy configured
- [ ] Role callbacks implemented
- [ ] Secure cookie settings
- [ ] Proper session management
- [ ] Error pages configured

### Step 1.3: Database Security Validation

**Task:** Verify database access patterns and security

**Commands:**
```powershell
# Test database connection
bunx prisma db execute '1'

# Verify schema is up to date
bunx prisma db push --dry-run
```

**Check Prisma client usage:**
1. Search for `prisma.` usage in admin routes
2. Verify proper error handling
3. Check for SQL injection vulnerabilities
4. Validate input sanitization

**Security checklist:**
- [ ] Database credentials secured in env vars
- [ ] Prisma client properly initialized
- [ ] No raw SQL queries without parameterization
- [ ] Proper error handling (no data exposure)

**Report Phase 1 Status:**
```
✓ PHASE 1 COMPLETE - SECURITY AUDIT
- Admin routes secured: [count] of [total]
- NextAuth configuration: [PASS/FAIL]
- Database security: [PASS/FAIL]
- Critical vulnerabilities: [count found/fixed]
```

---

## PHASE 2: IMAGE SYSTEM CONSOLIDATION (45 minutes)

### Step 2.1: Cloudinary Reference Audit

**Task:** Find and consolidate all Cloudinary references to prevent conflicts with ImageKit

**Search commands:**
```powershell
# Find all Cloudinary references
Get-ChildItem -Path src -Recurse -Include "*.ts", "*.tsx" | Select-String "cloudinary|CLOUDINARY" | Group-Object Filename
```

**Specifically search for:**
- `transformCloudinary` function usage
- `CLOUDINARY_HOST` constant definitions
- Import statements from Cloudinary
- Any hardcoded Cloudinary URLs

**Expected findings:**
- `src/lib/image.ts` - Should contain transformCloudinary function
- Multiple component files importing/using it
- Possible duplicate CLOUDINARY_HOST definitions

### Step 2.2: Standardize Image Handling

**Current image system analysis:**
Your project uses ImageKit as primary CDN, but has legacy Cloudinary references.

**Consolidation strategy:**
1. **Keep ImageKit** as primary (already configured in .env.local)
2. **Cleanup Cloudinary** references to prevent confusion
3. **Standardize** on single image transformation approach

**Implementation:**

**A) Update src/lib/image.ts:**
Ensure clean, single image handling function:
```typescript
// Single source of truth for image transformations
export const IMAGE_CDN_BASE = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ''

export function transformImage(
  imagePath: string, 
  options: {
    width?: number
    height?: number
    quality?: number
    format?: string
  } = {}
): string {
  if (!imagePath || !IMAGE_CDN_BASE) return imagePath
  
  const params = new URLSearchParams()
  if (options.width) params.set('w', options.width.toString())
  if (options.height) params.set('h', options.height.toString())
  if (options.quality) params.set('q', options.quality.toString())
  if (options.format) params.set('f', options.format)
  
  const queryString = params.toString()
  return `${IMAGE_CDN_BASE}${imagePath}${queryString ? `?${queryString}` : ''}`
}

// Legacy Cloudinary support (deprecate gradually)
export function transformCloudinary(url: string, transformations?: string): string {
  console.warn('transformCloudinary is deprecated, use transformImage instead')
  return transformImage(url)
}
```

**B) Update components using transformCloudinary:**
1. Find all components importing transformCloudinary
2. Replace with transformImage calls
3. Update import statements

### Step 2.3: Next.js Image Configuration

**Task:** Verify next.config.js has proper image domains configured

**Check next.config.js:**
```javascript
const nextConfig = {
  images: {
    domains: [
      'ik.imagekit.io', // ImageKit primary
      'res.cloudinary.com', // Legacy Cloudinary (if needed)
      // Add any other image domains
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/kollectit/**',
      }
    ]
  },
  // ... other config
}
```

**Ensure:**
- ImageKit domain is configured
- Proper remote patterns for security
- No unnecessary domains

**Report Phase 2 Status:**
```
✓ PHASE 2 COMPLETE - IMAGE SYSTEM
- Cloudinary references found: [count]
- Components updated: [count]
- Image domains configured: [PASS/FAIL]
- Single image function: [IMPLEMENTED/FAILED]
```

---

## PHASE 3: DATABASE OPTIMIZATION (30 minutes)

### Step 3.1: Prisma Schema Validation

**Task:** Ensure database schema is production-ready

**Commands:**
```powershell
# Generate latest Prisma client
bunx prisma generate

# Check schema formatting
bunx prisma format

# Validate schema
bunx prisma validate
```

**Schema review checklist:**
1. All tables have proper indexes
2. Required fields are marked correctly
3. Relationships are properly defined
4. No missing migrations

### Step 3.2: Database Connection Testing

**Task:** Verify robust database connectivity

**Test commands:**
```powershell
# Test connection with environment variables
$env:DATABASE_URL="postgresql://postgres:KITexas7234*@db.xqrroyyqrgdytzpcckwk.supabase.co:6543/postgres?pgbouncer=true"
$env:DIRECT_URL="postgresql://postgres:KITexas7234*@db.xqrroyyqrgdytzpcckwk.supabase.co:5432/postgres"

# Test basic connectivity
bunx prisma db execute '1'

# Verify tables exist
bunx prisma db execute 'SELECT tablename FROM pg_tables WHERE schemaname = '"'"'public'"'"';'
```

**Expected results:**
- Connection successful
- All Prisma-generated tables present
- No connection timeouts or errors

### Step 3.3: Database Security Check

**Task:** Validate database security settings

**Security validations:**
1. **Connection strings** use environment variables (never hardcoded)
2. **Password strength** meets requirements
3. **SSL connections** enforced (check connection string has sslmode)
4. **Database user** has minimal required permissions

**Check current connection security:**
- Verify DATABASE_URL uses SSL
- Confirm credentials are properly secured
- Test connection pooling works properly

**Report Phase 3 Status:**
```
✓ PHASE 3 COMPLETE - DATABASE
- Schema validation: [PASS/FAIL]
- Connection testing: [PASS/FAIL]
- Security check: [PASS/FAIL]
- Performance: [OPTIMIZED/NEEDS_WORK]
```

---

## PHASE 4: BUILD & PERFORMANCE OPTIMIZATION (45 minutes)

### Step 4.1: Production Build Testing

**Task:** Ensure consistent, optimized production builds

**Commands:**
```powershell
# Clear any cached builds
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue

# Run clean build
bun run build
```

**Expected results:**
- Build completes without errors
- All pages compile successfully
- Bundle size is reasonable
- No missing dependencies

**Monitor build output for:**
- Build time (should be under 2 minutes)
- Bundle size warnings
- Missing optimizations
- Page generation success

### Step 4.2: Bundle Analysis

**Task:** Analyze and optimize bundle size

**Commands:**
```powershell
# If bundle analyzer is available
bun run analyze

# Check bundle composition
Get-ChildItem .next/static -Recurse | Measure-Object -Property Length -Sum
```

**Optimization checklist:**
- [ ] Tree shaking is working
- [ ] Unused dependencies removed
- [ ] Code splitting implemented
- [ ] Image optimization enabled

### Step 4.3: Performance Validation

**Task:** Test application performance

**Test areas:**
1. **Page load times** - Check initial page load
2. **API response times** - Test key API endpoints
3. **Database query performance** - Check slow queries
4. **Image loading** - Verify ImageKit optimization

**Commands:**
```powershell
# Start dev server for testing
bun dev
```

**Manual testing checklist:**
- [ ] Home page loads < 3 seconds
- [ ] Product pages load < 2 seconds
- [ ] Admin dashboard loads < 5 seconds
- [ ] API responses < 1 second
- [ ] Images load with proper optimization

**Report Phase 4 Status:**
```
✓ PHASE 4 COMPLETE - BUILD & PERFORMANCE
- Production build: [PASS/FAIL]
- Bundle size: [OPTIMIZED/LARGE]
- Performance: [FAST/SLOW]
- Critical issues: [count]
```

---

## PHASE 5: API INTEGRATION TESTING (60 minutes)

### Step 5.1: Stripe Payment Integration

**Task:** Verify Stripe integration is production-ready

**Test checklist:**
1. **API keys** are properly configured (test mode for now)
2. **Webhook endpoints** are defined
3. **Payment flows** work correctly
4. **Error handling** is robust

**Validation commands:**
```powershell
# Check Stripe configuration
Get-Content .env.local | Select-String "STRIPE"
```

**Required Stripe env vars:**
- `STRIPE_SECRET_KEY` - Should start with sk_test_ (for testing)
- `STRIPE_WEBHOOK_SECRET` - Should be configured
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Should start with pk_test_

**Test Stripe integration:**
1. Check `/api/checkout/create-payment-intent` endpoint exists
2. Verify webhook handler at `/api/webhooks/stripe`
3. Test payment form functionality
4. Validate error handling

### Step 5.2: Email System Validation

**Task:** Ensure email functionality is working

**Check email configuration:**
Look for email-related environment variables:
- SMTP configuration
- Email service API keys
- From/reply-to addresses

**Test email endpoints:**
```powershell
# Check for email-related API routes
Get-ChildItem -Path "src/app/api" -Recurse -Include "*email*", "*mail*"
```

**Email functionality checklist:**
- [ ] Welcome emails
- [ ] Order confirmations
- [ ] Password resets
- [ ] Admin notifications

### Step 5.3: External API Connectivity

**Task:** Test all external service integrations

**Services to test:**
1. **Supabase** - Database connectivity
2. **ImageKit** - Image upload/optimization
3. **Google Drive** - If used for product sync
4. **Stripe** - Payment processing

**Commands:**
```powershell
# Test API health endpoints
# (These would need to be created if they don't exist)
```

**Create basic health check if needed:**
Create `/api/health` endpoint to test all integrations.

**Report Phase 5 Status:**
```
✓ PHASE 5 COMPLETE - API INTEGRATION
- Stripe integration: [PASS/FAIL]
- Email system: [PASS/FAIL]  
- External APIs: [count passed] of [total]
- Critical failures: [count]
```

---

## PHASE 6: PRODUCTION DEPLOYMENT PREPARATION (90 minutes)

### Step 6.1: Environment Variable Audit

**Task:** Prepare environment variables for production

**Current .env.local review:**
1. **Development URLs** - Change localhost to production domain
2. **API keys** - Verify all are set and valid
3. **Security keys** - Ensure production-strength secrets
4. **Database URLs** - Confirm production-ready

**Production environment preparation:**
Create `.env.production.example` with template:
```bash
# Production Environment Variables Template
# Copy to .env.local and update values for production

# Application Configuration  
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com
NODE_ENV=production

# Database (Supabase Production)
DATABASE_URL="postgresql://postgres:PROD_PASSWORD@db.xqrroyyqrgdytzpcckwk.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:PROD_PASSWORD@db.xqrroyyqrgdytzpcckwk.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL=https://xqrroyyqrgdytzpcckwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key

# Authentication
NEXTAUTH_SECRET=GENERATE_NEW_PRODUCTION_SECRET_32_CHARS_MINIMUM

# Payments (Switch to live keys)
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY

# Images
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit

# Other services...
```

### Step 6.2: Security Headers Configuration

**Task:** Configure production security headers

**Update next.config.js with security headers:**
```javascript
const nextConfig = {
  // ... existing config
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://ik.imagekit.io https://res.cloudinary.com; font-src 'self' data:; connect-src 'self' https://api.stripe.com https://xqrroyyqrgdytzpcckwk.supabase.co;",
          },
        ],
      },
    ]
  },
}
```

### Step 6.3: Deployment Scripts

**Task:** Create deployment scripts for easy production deployment

**Create `deploy.ps1`:**
```powershell
#!/usr/bin/env pwsh
# Production Deployment Script for Kollect-It Marketplace

Write-Output "🚀 Starting Kollect-It Marketplace Deployment"

# Pre-deployment checks
Write-Output "📋 Running pre-deployment checks..."

# TypeScript check
bunx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Error "TypeScript errors found. Fix before deploying."
    exit 1
}

# Linting
bun run lint
if ($LASTEXITCODE -ne 0) {
    Write-Error "Linting errors found. Fix before deploying."
    exit 1
}

# Build test
bun run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed. Cannot deploy."
    exit 1
}

Write-Output "✅ Pre-deployment checks passed"

# Deploy to Vercel
Write-Output "🌐 Deploying to Vercel..."
vercel --prod

Write-Output "🎉 Deployment complete!"
```

**Report Phase 6 Status:**
```
✓ PHASE 6 COMPLETE - DEPLOYMENT PREP
- Environment template: [CREATED/FAILED]
- Security headers: [CONFIGURED/FAILED]
- Deployment scripts: [CREATED/FAILED]
- Production readiness: [READY/NOT_READY]
```

---

## PHASE 7: FINAL VALIDATION & DOCUMENTATION (60 minutes)

### Step 7.1: Comprehensive Testing

**Task:** Final end-to-end testing of all functionality

**Test scenarios:**
1. **User Registration/Login Flow**
2. **Product Browsing and Search**
3. **Shopping Cart Functionality**
4. **Checkout Process (Test Mode)**
5. **Admin Dashboard Access**
6. **Order Management**
7. **Email Notifications**

**Commands:**
```powershell
# Start application for testing
bun dev

# In another terminal, run any automated tests
bun test
```

### Step 7.2: Performance Final Check

**Task:** Final performance validation

**Performance checklist:**
- [ ] Home page Lighthouse score > 90
- [ ] Product pages load < 2 seconds
- [ ] Search functionality responsive
- [ ] Admin dashboard loads efficiently
- [ ] Mobile responsiveness confirmed

### Step 7.3: Documentation Creation

**Task:** Create final deployment documentation

**Create comprehensive README for production:**
Update README.md with:
- Production deployment instructions
- Environment variable setup
- Monitoring and maintenance
- Troubleshooting guide
- Contact information

### Step 7.4: Security Final Audit

**Task:** Final security verification

**Security checklist:**
- [ ] All admin routes protected
- [ ] Environment variables secured
- [ ] HTTPS enforced in production
- [ ] No sensitive data in client-side code
- [ ] Input validation implemented
- [ ] SQL injection prevention verified

**Report Phase 7 Status:**
```
✓ PHASE 7 COMPLETE - FINAL VALIDATION
- End-to-end testing: [PASS/FAIL]
- Performance: [OPTIMIZED/NEEDS_WORK]
- Documentation: [COMPLETE/INCOMPLETE]
- Security audit: [SECURE/VULNERABILITIES_FOUND]
```

---

## FINAL DEPLOYMENT READINESS REPORT

**Generate comprehensive report:**
```
🎉 KOLLECT-IT MARKETPLACE DEPLOYMENT COMPLETE

OVERALL STATUS: [PRODUCTION_READY/NEEDS_WORK]

PHASE SUMMARY:
✓ Phase 0 - Environment: [PASS/FAIL]
✓ Phase 1 - Security: [PASS/FAIL] 
✓ Phase 2 - Images: [PASS/FAIL]
✓ Phase 3 - Database: [PASS/FAIL]
✓ Phase 4 - Performance: [PASS/FAIL]
✓ Phase 5 - Integrations: [PASS/FAIL]
✓ Phase 6 - Deployment Prep: [PASS/FAIL]
✓ Phase 7 - Final Validation: [PASS/FAIL]

CRITICAL ISSUES FOUND: [count]
CRITICAL ISSUES RESOLVED: [count]

NEXT STEPS:
1. Review any remaining critical issues
2. Update production environment variables
3. Configure production domain
4. Deploy to production
5. Monitor and maintain

PRODUCTION READINESS SCORE: [X]/100

RECOMMENDATION: [DEPLOY_NOW/FIX_ISSUES_FIRST/MAJOR_ISSUES_FOUND]
```

## ===END COMPLETE AGENT PROMPT===

---

## POST-EXECUTION MANUAL STEPS

After AI agent completes all phases:

1. **Review the final report** - Address any remaining issues
2. **Update production environment variables** - Use the .env.production.example template
3. **Configure production domain** - Set up DNS and SSL
4. **Deploy to production** - Run the deployment script or use Vercel
5. **Monitor application** - Set up logging and error tracking

**Estimated total time:** 6-8 hours autonomous + 2-3 hours manual setup