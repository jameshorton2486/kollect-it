# PHASE 6: Launch Readiness & Final Verification
## Cursor AI Prompts for Kollect-It

**Important:** Each prompt includes git commit and push commands at the end. Run these after reviewing and approving any changes.

---

## Prompt 6.1 — Pre-Launch Checklist Generation

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Generate a comprehensive pre-launch checklist and verify all critical systems are ready.

# CONTEXT
- Project: Kollect-It (luxury antiques marketplace)
- Deployment: Vercel
- Database: Supabase (PostgreSQL)
- Payments: Stripe
- Target: Production launch

# VERIFICATION AREAS

## 1. Code Quality
- [ ] TypeScript compiles with zero errors in src/
- [ ] Build passes successfully
- [ ] No console.log in production client code
- [ ] Design system consistently applied

## 2. Functionality (Critical Paths)
- [ ] Homepage loads correctly
- [ ] Product listing pages work
- [ ] Product detail pages work
- [ ] Search functionality works
- [ ] Add to cart works
- [ ] Checkout flow completes
- [ ] User registration works
- [ ] User login works
- [ ] Password reset works

## 3. SEO
- [ ] All pages have metadata
- [ ] Product pages have JSON-LD
- [ ] sitemap.xml generates
- [ ] robots.txt configured
- [ ] OG images present

## 4. Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Color contrast adequate

## 5. Performance
- [ ] Images optimized (next/image)
- [ ] No blocking resources
- [ ] Lazy loading implemented
- [ ] Build size reasonable

## 6. Security
- [ ] Environment variables not exposed
- [ ] Admin routes protected
- [ ] API routes authenticated where needed
- [ ] HTTPS enforced (Vercel default)

## 7. Infrastructure
- [ ] Vercel project configured
- [ ] Environment variables set in Vercel
- [ ] Database connection works
- [ ] Stripe keys configured (live mode)
- [ ] Domain DNS configured
- [ ] SSL certificate active

# OUTPUT FORMAT
```markdown
# Kollect-It Pre-Launch Checklist
**Generated:** [Date]
**Status:** [READY / NOT READY / READY WITH CAVEATS]

## Executive Summary
- Blocking issues: [count]
- Warnings: [count]
- All systems: [GO / NO-GO]

## Code Quality ✅/❌
| Check | Status | Notes |
|-------|--------|-------|
| TypeScript (src/) | ✅/❌ | |
| Build passes | ✅/❌ | |
| Design system | ✅/❌ | |
| Console cleanup | ✅/❌ | |

## Critical User Flows ✅/❌
| Flow | Status | Notes |
|------|--------|-------|
| Browse products | ✅/❌ | |
| View product | ✅/❌ | |
| Add to cart | ✅/❌ | |
| Checkout | ✅/❌ | |
| User auth | ✅/❌ | |

## SEO ✅/❌
| Check | Status | Notes |
|-------|--------|-------|
| Metadata | ✅/❌ | X pages covered |
| JSON-LD | ✅/❌ | Product schema |
| Sitemap | ✅/❌ | |
| Robots.txt | ✅/❌ | |

## Accessibility ✅/❌
| Check | Status | Notes |
|-------|--------|-------|
| Keyboard nav | ✅/❌ | |
| Focus states | ✅/❌ | |
| Alt text | ✅/❌ | |
| Form labels | ✅/❌ | |

## Infrastructure ✅/❌
| Check | Status | Notes |
|-------|--------|-------|
| Vercel deployed | ✅/❌ | |
| Env vars set | ✅/❌ | |
| Database | ✅/❌ | |
| Stripe | ✅/❌ | |
| Domain | ✅/❌ | |

## Blocking Issues
[List any issues that MUST be fixed before launch, or "None"]

## Post-Launch Tasks
[Items that can be addressed after launch]

## Sign-Off
- [ ] Code review complete
- [ ] Testing complete
- [ ] Stakeholder approval
- [ ] Monitoring configured
- [ ] Rollback plan documented
```

# AFTER GENERATING — Save checklist, then run:
```powershell
# Save the checklist to project docs
# (Copy Cursor output to docs/PRE_LAUNCH_CHECKLIST.md)

git add docs/PRE_LAUNCH_CHECKLIST.md
git commit -m "docs: add pre-launch checklist"
git push
```

# CONSTRAINTS
- Be honest about status — don't mark things as done if uncertain
- Blocking issues must be resolved before launch
- Warnings can be documented for post-launch
```

---

## Prompt 6.2 — Environment Variables Verification

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Verify all required environment variables are documented and properly configured for production.

# CONTEXT
- Local development uses .env.local
- Production uses Vercel environment variables
- Must not expose sensitive values in code

# FILES TO ANALYZE
- .env.example or .env.sample (if exists)
- src/lib/env.ts (environment validation)
- All files that use process.env

# REQUIRED VARIABLES CHECKLIST

## Database
- [ ] DATABASE_URL — Supabase connection string
- [ ] DIRECT_URL — Direct database connection (for migrations)

## Authentication
- [ ] NEXTAUTH_URL — Production URL (https://kollect-it.com)
- [ ] NEXTAUTH_SECRET — Random secret (32+ chars)

## Stripe
- [ ] STRIPE_SECRET_KEY — Live secret key (sk_live_...)
- [ ] STRIPE_WEBHOOK_SECRET — Webhook signing secret
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — Live publishable (pk_live_...)

## ImageKit
- [ ] IMAGEKIT_PRIVATE_KEY — Private key
- [ ] NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY — Public key
- [ ] NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT — CDN endpoint

## Email (if using)
- [ ] RESEND_API_KEY — Email service API key

## Optional
- [ ] ADMIN_EMAIL — Admin notification email
- [ ] NEXT_PUBLIC_APP_URL — Public app URL

# SEARCH FOR USAGE
Find all process.env references:
```bash
grep -r "process.env" src/ --include="*.ts" --include="*.tsx" | grep -v node_modules
```

# OUTPUT FORMAT
```markdown
## Environment Variables Audit

### Required Variables
| Variable | Used In | Required | Has Default | Status |
|----------|---------|----------|-------------|--------|
| DATABASE_URL | prisma | Yes | No | ✅/❌ |
| NEXTAUTH_SECRET | auth | Yes | No | ✅/❌ |
| STRIPE_SECRET_KEY | checkout | Yes | No | ✅/❌ |
...

### Client-Exposed Variables (NEXT_PUBLIC_*)
| Variable | Purpose | Sensitive? |
|----------|---------|------------|
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe.js | No (safe) |
| NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY | Image CDN | No (safe) |
...

### Missing from .env.example
[List any variables used but not documented]

### Security Check
- [ ] No secrets in NEXT_PUBLIC_* variables
- [ ] No hardcoded API keys in source code
- [ ] .env files in .gitignore

### Vercel Configuration Required
Copy these to Vercel → Settings → Environment Variables:

```
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_URL=https://kollect-it.com
NEXTAUTH_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
IMAGEKIT_PRIVATE_KEY=
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
```
```

# AFTER REVIEW — Update .env.example if needed, then run:
```powershell
git add .env.example
git commit -m "docs: update environment variables documentation"
git push
```

# CONSTRAINTS
- NEVER commit actual secrets
- Only document variable names, not values
- Verify NEXT_PUBLIC_ vars are safe to expose
```

---

## Prompt 6.3 — Error Handling & Edge Cases

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Verify error handling is implemented for critical user flows and edge cases.

# CONTEXT
- Users should never see raw error messages
- Failed operations should provide helpful feedback
- Critical flows: checkout, auth, cart operations

# FILES TO ANALYZE
- src/app/api/**/*.ts (API routes)
- src/components/forms/*.tsx
- src/app/checkout/page.tsx
- src/app/login/page.tsx
- src/app/register/page.tsx

# VERIFICATION CHECKLIST

## 1. API Routes
- [ ] All routes wrapped in try/catch
- [ ] Errors return appropriate HTTP status codes
- [ ] Error responses have consistent format
- [ ] No stack traces exposed to client
- [ ] Rate limiting on sensitive endpoints

## 2. Form Submissions
- [ ] Validation errors shown to user
- [ ] Network errors handled gracefully
- [ ] Loading states during submission
- [ ] Success confirmation shown

## 3. Authentication
- [ ] Invalid credentials show generic message (security)
- [ ] Session expiry handled
- [ ] Protected routes redirect to login

## 4. Checkout
- [ ] Payment failures show helpful message
- [ ] Out of stock handled
- [ ] Cart validation before payment
- [ ] Order confirmation or failure shown

## 5. Product Pages
- [ ] 404 for non-existent products
- [ ] Graceful handling of missing images
- [ ] Out of stock state shown

## 6. Global Error Handling
- [ ] Error boundary component exists
- [ ] 404 page customized
- [ ] 500 page exists (optional but good)

# ERROR RESPONSE FORMAT
Ensure API routes return consistent format:
```typescript
// Success
return NextResponse.json({ data: result }, { status: 200 });

// Client error
return NextResponse.json(
  { error: "Descriptive message for user" },
  { status: 400 }
);

// Server error
return NextResponse.json(
  { error: "Something went wrong. Please try again." },
  { status: 500 }
);
```

# OUTPUT FORMAT
```markdown
## Error Handling Audit

### API Routes
| Route | Try/Catch | Status Codes | Format | Status |
|-------|-----------|--------------|--------|--------|
| /api/products | ✅/❌ | ✅/❌ | ✅/❌ | |
| /api/cart | ✅/❌ | ✅/❌ | ✅/❌ | |
| /api/checkout/* | ✅/❌ | ✅/❌ | ✅/❌ | |
| /api/auth/* | ✅/❌ | ✅/❌ | ✅/❌ | |

### Forms
| Form | Validation | Network Error | Loading | Success |
|------|------------|---------------|---------|---------|
| Contact | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| Login | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| Checkout | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |

### Global
| Component | Status | Notes |
|-----------|--------|-------|
| ErrorBoundary | ✅/❌ | |
| 404 page | ✅/❌ | |
| 500 page | ✅/❌ | |

### Issues Found
| Location | Issue | Fix |
|----------|-------|-----|
| [file] | [description] | [code fix] |

### Code Fixes
[Provide specific fixes for any issues]
```

# AFTER REVIEW — Apply fixes, then run:
```powershell
git add -A
git commit -m "fix: improve error handling for production reliability"
git push
```

# CONSTRAINTS
- Never expose internal error details to users
- Always provide actionable error messages
- Log errors server-side for debugging
```

---

## Prompt 6.4 — Final Launch Report Generation

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Generate the final launch readiness report synthesizing all previous verification phases.

# CONTEXT
This is the culmination of:
- Phase 1-2: Design system verification
- Phase 3: Production readiness
- Phase 4: SEO audit
- Phase 5: Accessibility audit
- Phase 6.1-6.3: Infrastructure verification

# REPORT STRUCTURE

Generate a comprehensive report suitable for stakeholder review:

```markdown
# Kollect-It Launch Readiness Report

**Date:** [Current Date]
**Version:** 1.0
**Prepared By:** [Automated Audit System]
**Status:** [APPROVED FOR LAUNCH / CONDITIONAL APPROVAL / NOT READY]

---

## Executive Summary

[2-3 sentence summary of overall readiness]

### Key Metrics
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| TypeScript Errors (src/) | X | 0 | ✅/❌ |
| Build Status | Pass/Fail | Pass | ✅/❌ |
| Design Token Compliance | X% | 100% | ✅/❌ |
| SEO Coverage | X/Y pages | 100% | ✅/❌ |
| Accessibility (WCAG A) | X issues | 0 critical | ✅/❌ |

---

## 1. Code Quality

### 1.1 TypeScript
- Production errors: [0]
- Test file errors: [X — not blocking]
- Status: ✅ PASS

### 1.2 Build
- Compilation: ✅ Successful
- Static pages: [X]
- Dynamic routes: [X]
- API routes: [X]
- Status: ✅ PASS

### 1.3 Design System
- Proper token usage: [X] instances
- Legacy violations: [0]
- Status: ✅ PASS

---

## 2. User Experience

### 2.1 Critical User Flows
| Flow | Tested | Status |
|------|--------|--------|
| Browse → Product → Cart → Checkout | ✅/❌ | PASS/FAIL |
| Register → Login → Account | ✅/❌ | PASS/FAIL |
| Search → Results → Product | ✅/❌ | PASS/FAIL |
| Contact form submission | ✅/❌ | PASS/FAIL |

### 2.2 Responsive Design
| Breakpoint | Tested | Status |
|------------|--------|--------|
| Mobile (375px) | ✅/❌ | |
| Tablet (768px) | ✅/❌ | |
| Desktop (1440px) | ✅/❌ | |

---

## 3. SEO Readiness

### 3.1 Metadata Coverage
| Page Type | Coverage | Status |
|-----------|----------|--------|
| Static pages | X/Y | ✅/❌ |
| Product pages | Dynamic | ✅/❌ |
| Category pages | Dynamic | ✅/❌ |

### 3.2 Technical SEO
| Element | Status |
|---------|--------|
| sitemap.xml | ✅/❌ |
| robots.txt | ✅/❌ |
| JSON-LD (Product) | ✅/❌ |
| Canonical URLs | ✅/❌ |

---

## 4. Accessibility

### 4.1 WCAG 2.1 Compliance
| Level | Critical Issues | Status |
|-------|-----------------|--------|
| Level A | [0] | ✅/❌ |
| Level AA | [X — non-blocking] | ⚠️ |

### 4.2 Key Accessibility Features
- [x] Keyboard navigation functional
- [x] Focus states visible
- [x] Images have alt text
- [x] Forms have labels
- [ ] Skip link (recommended)

---

## 5. Infrastructure

### 5.1 Deployment
| Component | Status | Notes |
|-----------|--------|-------|
| Vercel project | ✅/❌ | |
| Production URL | ✅/❌ | kollect-it.com |
| SSL certificate | ✅/❌ | Auto via Vercel |
| CDN | ✅/❌ | Vercel Edge |

### 5.2 Environment
| Variable Category | Configured | Verified |
|-------------------|------------|----------|
| Database | ✅/❌ | ✅/❌ |
| Authentication | ✅/❌ | ✅/❌ |
| Payments (Stripe) | ✅/❌ | ✅/❌ |
| Images (ImageKit) | ✅/❌ | ✅/❌ |

### 5.3 Monitoring
| Tool | Status |
|------|--------|
| Vercel Analytics | ✅/❌ |
| Error tracking | ✅/❌ |
| Uptime monitoring | ✅/❌ |

---

## 6. Security

| Check | Status |
|-------|--------|
| No exposed secrets | ✅ |
| Admin routes protected | ✅ |
| API authentication | ✅ |
| Input validation | ✅ |
| HTTPS enforced | ✅ |

---

## 7. Outstanding Items

### Blocking (Must Fix)
[List any blocking issues, or "None"]

### Non-Blocking (Post-Launch OK)
1. [Item — can be addressed after launch]
2. [Item]

### Future Enhancements
1. [Nice to have]
2. [Future sprint]

---

## 8. Launch Approval

### Checklist
- [x] Code review complete
- [x] Build passes
- [x] Critical flows tested
- [x] SEO verified
- [x] Accessibility baseline met
- [x] Environment configured
- [ ] Stakeholder sign-off

### Recommendation
[PROCEED WITH LAUNCH / CONDITIONAL — Address [items] first / HOLD — Critical issues remain]

### Sign-Off
| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| Reviewer | | | |

---

*Report generated automatically. Manual verification recommended for critical paths.*
```

# AFTER GENERATING — Save report, then run:
```powershell
# Save the report
# (Copy Cursor output to docs/LAUNCH_READINESS_REPORT.md)

git add docs/LAUNCH_READINESS_REPORT.md
git commit -m "docs: add launch readiness report - APPROVED FOR LAUNCH"
git push
```

# CONSTRAINTS
- Be accurate — don't inflate status
- Clearly distinguish blocking vs non-blocking
- Include actionable recommendations
```

---

## Prompt 6.5 — Post-Launch Monitoring Setup

Copy everything below and paste into Cursor AI:

```
@workspace

# OBJECTIVE
Document and verify monitoring configuration for post-launch operations.

# CONTEXT
- Need to catch errors quickly after launch
- Track performance metrics
- Monitor uptime and availability

# MONITORING AREAS

## 1. Error Tracking
Options:
- Vercel's built-in error tracking
- Sentry (if integrated)
- Console error monitoring

Check for:
- [ ] Error boundary catches React errors
- [ ] API errors logged server-side
- [ ] Client errors reportable

## 2. Performance Monitoring
- [ ] Vercel Analytics enabled
- [ ] Core Web Vitals tracking
- [ ] API response time monitoring

## 3. Uptime Monitoring
Options:
- Vercel status
- UptimeRobot (free)
- Pingdom

## 4. Business Metrics
- [ ] Order completion tracking
- [ ] User registration tracking
- [ ] Search usage analytics

# CHECK EXISTING IMPLEMENTATION

Look for monitoring code:
- src/lib/web-vitals.ts
- src/app/layout.tsx (analytics scripts)
- Any Sentry configuration
- Vercel Analytics component

# OUTPUT FORMAT
```markdown
## Post-Launch Monitoring Guide

### Current Implementation
| Monitoring Type | Tool | Status | Notes |
|-----------------|------|--------|-------|
| Error tracking | [tool] | ✅/❌ | |
| Performance | [tool] | ✅/❌ | |
| Uptime | [tool] | ✅/❌ | |
| Analytics | [tool] | ✅/❌ | |

### Recommended Setup

#### Error Tracking
[Instructions or current status]

#### Performance Monitoring
[Instructions or current status]

#### Alerts to Configure
1. **Error spike alert** — If errors > X per minute
2. **Downtime alert** — If site unreachable > 1 minute
3. **Performance alert** — If LCP > 2.5s

### First 24 Hours Checklist
- [ ] Monitor error logs hourly
- [ ] Check Vercel deployment status
- [ ] Verify checkout flow working
- [ ] Check email notifications sending
- [ ] Monitor database performance

### First Week Checklist
- [ ] Review error trends
- [ ] Check Core Web Vitals
- [ ] Review user feedback
- [ ] Check search analytics
- [ ] Monitor conversion rate

### Incident Response
If issues detected:
1. Check Vercel deployment logs
2. Check Supabase database status
3. Check Stripe dashboard
4. Rollback if critical (Vercel instant rollback)

### Key URLs
- Vercel Dashboard: https://vercel.com/[team]/kollect-it
- Supabase Dashboard: https://app.supabase.com/project/[id]
- Stripe Dashboard: https://dashboard.stripe.com
- Domain DNS: [registrar dashboard]
```

# AFTER REVIEW — Save guide, then run:
```powershell
# Save the monitoring guide
# (Copy to docs/POST_LAUNCH_MONITORING.md)

git add docs/POST_LAUNCH_MONITORING.md
git commit -m "docs: add post-launch monitoring guide"
git push
```

# CONSTRAINTS
- Focus on practical, actionable monitoring
- Include specific alert thresholds
- Document incident response steps
```

---

## Quick Reference: Phase 6 Prompts

| Prompt | Purpose | Commit Message |
|--------|---------|----------------|
| **6.1** | Pre-launch checklist | `docs: add pre-launch checklist` |
| **6.2** | Environment variables | `docs: update environment variables documentation` |
| **6.3** | Error handling audit | `fix: improve error handling for production` |
| **6.4** | Final launch report | `docs: add launch readiness report` |
| **6.5** | Monitoring setup | `docs: add post-launch monitoring guide` |

**Recommended order:** 6.1 → 6.2 → 6.3 → 6.4 → 6.5

**After each prompt:** Review output, save to appropriate docs/ file, then run git commands.

---

## Final Git Commands Summary

After completing all Phase 6 prompts:

```powershell
# Verify all commits
git log --oneline -10

# Ensure everything is pushed
git push

# Tag the release (optional but recommended)
git tag -a v1.0.0 -m "Production launch release"
git push origin v1.0.0
```

---

*Copy each prompt individually into Cursor AI. Commit and push after each set of changes.*
