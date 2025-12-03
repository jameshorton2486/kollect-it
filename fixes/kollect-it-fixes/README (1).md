# Kollect-It Pre-Launch Fixes

This package contains all the files needed to fix critical issues before launching Kollect-It.

## Quick Start

### Step 1: Copy Files to Your Project

Copy these folders from this package to your `kollect-it` project root:

```
src/
prisma/
scripts/
```

The folder structure matches your project, so files will go to the correct locations.

### Step 2: Run Database Migration

**Option A - Supabase SQL Editor (Recommended):**
1. Go to your Supabase Dashboard → SQL Editor
2. Open `prisma/migrations/add_auth_contact_newsletter.sql`
3. Copy the entire contents and run it

**Option B - Prisma CLI:**
```powershell
bun x prisma db push
bun x prisma generate
```

### Step 3: Verify Installation

```powershell
# Check all new files exist
Get-ChildItem src/app/forgot-password/page.tsx
Get-ChildItem src/app/reset-password/page.tsx
Get-ChildItem src/app/api/auth/forgot-password/route.ts
Get-ChildItem src/app/api/contact/route.ts
Get-ChildItem src/emails/PasswordResetEmail.tsx
```

### Step 4: Test Locally

```powershell
bun run dev
```

Then test:
- http://localhost:3000/forgot-password
- http://localhost:3000/contact (submit form)
- Newsletter signup in footer

### Step 5: Deploy

```powershell
git add -A
git commit -m "feat: Add password reset, contact form, and newsletter functionality"
git push origin main
```

---

## Files Included

### New Pages
| File | Description |
|------|-------------|
| `src/app/forgot-password/page.tsx` | Password reset request form |
| `src/app/reset-password/page.tsx` | New password entry form |

### New API Routes
| File | Description |
|------|-------------|
| `src/app/api/auth/forgot-password/route.ts` | Generates reset token, sends email |
| `src/app/api/auth/reset-password/route.ts` | Validates token, updates password |
| `src/app/api/auth/verify-reset-token/route.ts` | Checks if token is valid |
| `src/app/api/contact/route.ts` | Stores contact form submissions |

### Updated Files (Replace Existing)
| File | Changes |
|------|---------|
| `src/app/api/newsletter/subscribe/route.ts` | Now stores in database |
| `src/app/api/admin/reports/route.ts` | Added admin auth check |
| `src/lib/email.ts` | Added password reset + contact email functions |
| `src/components/forms/ContactForm.tsx` | Now calls API instead of simulating |

### New Email Templates
| File | Description |
|------|-------------|
| `src/emails/PasswordResetEmail.tsx` | Password reset instructions |
| `src/emails/PasswordChangedEmail.tsx` | Confirmation of password change |
| `src/emails/ContactNotificationEmail.tsx` | Admin notification for contact form |
| `src/emails/NewsletterWelcomeEmail.tsx` | Welcome email for subscribers |

### Database Updates
| File | Description |
|------|-------------|
| `prisma/schema.prisma` | Added User reset fields, NewsletterSubscriber, ContactSubmission |
| `prisma/migrations/add_auth_contact_newsletter.sql` | SQL to run in Supabase |

### Scripts
| File | Description |
|------|-------------|
| `scripts/deploy-prelaunch-fixes.ps1` | Guided deployment script |

---

## Environment Variables Required

Add these to your `.env.local` and Vercel environment:

```env
# Email Service (Required for password reset emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kollect-it.com
EMAIL_PASSWORD=your-google-app-password
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL=james@kollect-it.com
```

**Note:** If email is not configured, reset URLs will be logged to console for development.

---

## Testing Checklist

After deployment, verify these features work:

- [ ] **Forgot Password Page** (`/forgot-password`)
  - [ ] Form validates email
  - [ ] Submitting shows success message
  - [ ] Email received OR URL logged in console

- [ ] **Reset Password Page** (`/reset-password?token=xxx`)
  - [ ] Invalid token shows error
  - [ ] Valid token shows password form
  - [ ] New password saves correctly
  - [ ] Redirects to login

- [ ] **Contact Form** (`/contact`)
  - [ ] Form validates all fields
  - [ ] Submission creates database record
  - [ ] Admin receives notification email (if configured)

- [ ] **Newsletter** (Footer)
  - [ ] Email validates
  - [ ] Subscription creates database record
  - [ ] Duplicate emails handled gracefully

- [ ] **Admin Reports** (`/api/admin/reports`)
  - [ ] Requires admin login (401 if not)
  - [ ] Returns reports for logged-in admin

---

## Troubleshooting

### "Module not found" errors
Run `bun x prisma generate` after updating schema.prisma

### Password reset email not received
1. Check console logs for the reset URL
2. Verify EMAIL_* environment variables are set
3. Check spam folder

### Contact form returns 500 error
1. Ensure database migration ran successfully
2. Check that `ContactSubmission` table exists in Supabase

### Newsletter signup fails
1. Ensure `NewsletterSubscriber` table exists
2. Check for unique constraint on email

---

## Support

If you encounter issues, check:
1. Vercel deployment logs
2. Supabase database logs
3. Browser console for client-side errors

---

*Generated: December 2025*
