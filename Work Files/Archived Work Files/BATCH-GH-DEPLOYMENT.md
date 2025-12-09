# Batch G & H Deployment Guide

**Created:** December 9, 2025  
**Files:** 6 pages (4 auth + 2 checkout)

---

## Files Created

| Source File | Deploy To |
|-------------|-----------|
| `batch-gh/login-page.tsx` | `src/app/login/page.tsx` |
| `batch-gh/register-page.tsx` | `src/app/register/page.tsx` |
| `batch-gh/forgot-password-page.tsx` | `src/app/forgot-password/page.tsx` |
| `batch-gh/reset-password-page.tsx` | `src/app/reset-password/page.tsx` |
| `batch-gh/checkout-success-page.tsx` | `src/app/checkout/success/page.tsx` |
| `batch-gh/checkout-cancel-page.tsx` | `src/app/checkout/cancel/page.tsx` |

---

## Cursor Prompt

Copy and paste this into Cursor:

```
Please replace the following files with the updated versions from Work-Files/batch-gh/:

BATCH G (Authentication):
1. src/app/login/page.tsx ← Work-Files/batch-gh/login-page.tsx
2. src/app/register/page.tsx ← Work-Files/batch-gh/register-page.tsx
3. src/app/forgot-password/page.tsx ← Work-Files/batch-gh/forgot-password-page.tsx
4. src/app/reset-password/page.tsx ← Work-Files/batch-gh/reset-password-page.tsx

BATCH H (Checkout Flow):
5. src/app/checkout/success/page.tsx ← Work-Files/batch-gh/checkout-success-page.tsx
6. src/app/checkout/cancel/page.tsx ← Work-Files/batch-gh/checkout-cancel-page.tsx

Replace the existing files completely with the new versions.
```

---

## Design System Applied

### Auth Pages (Login, Register, Forgot/Reset Password)

**Layout:**
- `min-h-screen bg-lux-pearl` — full page pearl background
- Centered auth card with `max-w-md`
- Card: `bg-lux-white rounded-2xl border border-lux-silver-soft p-10 md:p-14 shadow-soft`

**Typography:**
- `heading-page` — main title
- `lead` — subtitle/description
- `text-label text-lux-gray-dark` — input labels

**Form Inputs:**
- Consistent input styling with gold focus ring
- Error states with red border and background
- Password show/hide toggles
- Password strength indicators (Register, Reset)

**Buttons:**
- `btn-primary w-full rounded-full` — main CTA
- Gold accent with charcoal text

**States:**
- Loading spinners in buttons
- Success states with green checkmarks
- Error states with red AlertCircle icons

---

### Checkout Pages (Success, Cancel)

**Layout:**
- `min-h-[60vh] bg-lux-pearl`
- Centered card with `max-w-2xl`

**Success Page Features:**
- Gold checkmark icon on cream circle
- Order number display
- Order summary with items
- Shipping address
- "What's Next" section with trust badges (Package, Shield, Award icons)
- Two action buttons (View Order Status, Continue Browsing)

**Cancel Page Features:**
- Neutral RotateCcw icon
- Reassuring messaging
- Three CTAs (Return to Cart, Retry Checkout, Continue Browsing)
- Help contact link

---

## Testing Checklist

### Batch G — Authentication

- [ ] **Login Page**
  - [ ] Form validates email format
  - [ ] Password show/hide works
  - [ ] "Forgot?" link navigates correctly
  - [ ] Submit shows loading spinner
  - [ ] Error messages display properly
  - [ ] Successful login redirects to /account

- [ ] **Register Page**
  - [ ] All fields validate
  - [ ] Password requirements show check/uncheck
  - [ ] Confirm password matching works
  - [ ] Submit shows loading spinner
  - [ ] Successful registration auto-logs in

- [ ] **Forgot Password Page**
  - [ ] Email validation works
  - [ ] Success state shows after submission
  - [ ] "Try again" button resets form
  - [ ] Back to Login links work

- [ ] **Reset Password Page**
  - [ ] Loading state shows while verifying token
  - [ ] Invalid token shows error with CTA
  - [ ] Password strength bar updates
  - [ ] Success state shows and redirects

### Batch H — Checkout Flow

- [ ] **Checkout Success Page**
  - [ ] Loading state displays
  - [ ] Order details populate correctly
  - [ ] Order number displays
  - [ ] Items and total show
  - [ ] Shipping address displays
  - [ ] Trust badges visible
  - [ ] Both action buttons work

- [ ] **Checkout Cancel Page**
  - [ ] Message is reassuring (not alarming)
  - [ ] All three buttons work
  - [ ] Contact link works

---

## Dependencies

These pages rely on:

**Auth Pages:**
- `next-auth/react` (signIn)
- `next/navigation` (useRouter, useSearchParams)
- `lucide-react` icons (AlertCircle, Eye, EyeOff, Check, ArrowLeft, etc.)
- API routes: `/api/auth/register`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/verify-reset-token`

**Checkout Success:**
- `@/lib/currency` (formatUSD)
- API route: `/api/checkout/create-order`

---

## New Design Elements

**Gold Divider:**
```tsx
<div className="w-16 h-1 bg-lux-gold mx-auto mb-8" />
```

**Password Strength Bar:**
```tsx
<div className="h-1.5 bg-lux-cream rounded-full overflow-hidden">
  <div className={`h-full transition-all ${strengthColor}`} style={{ width: `${percentage}%` }} />
</div>
```

**Trust Badge Pattern:**
```tsx
<div className="w-10 h-10 rounded-full bg-lux-cream flex items-center justify-center">
  <Icon className="h-5 w-5 text-lux-gold" />
</div>
```

---

## Summary

| Batch | Pages | Status |
|-------|-------|--------|
| G | Login, Register, Forgot Password, Reset Password | ✅ Ready |
| H | Checkout Success, Checkout Cancel | ✅ Ready |

**Total files:** 6 pages ready for deployment
