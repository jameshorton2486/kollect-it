# NextAuth Configuration Check

**Status: Configured correctly.** The following were verified.

---

## 1. API route

- **File:** `src/app/api/auth/[...nextauth]/route.ts`
- **Exports:** `GET` and `POST` handlers from `NextAuth(authOptions)`.
- **Result:** NextAuth is mounted at `/api/auth/*` (signin, signout, session, csrf, etc.).

---

## 2. Auth config (`src/lib/auth.ts`)

- **Provider:** Credentials only (email + password).
- **Authorize flow:** Look up user by email → check password hash exists → `bcrypt.compare(credentials.password, user.password)` → return `{ id, email, name, role }`.
- **Callbacks:**
  - **jwt:** Adds `token.role` and `token.id` from the user.
  - **session:** Adds `session.user.role` and `session.user.id` from the token.
- **Session:** `strategy: "jwt"` (no DB session table).
- **Pages:** `signIn: "/admin/login"` (used when NextAuth redirects for sign-in, e.g. protected admin routes).
- **Secret:** `process.env.NEXTAUTH_SECRET`.
- **Logger:** Custom logger wired; errors/warnings point to NEXTAUTH_SECRET and NEXTAUTH_URL.

---

## 3. SessionProvider

- **File:** `src/components/SessionProvider.tsx` — wraps `next-auth/react`’s `SessionProvider`.
- **Layout:** `src/app/layout.tsx` wraps the app with `<SessionProvider>` so `useSession()` and client-side auth work everywhere.

---

## 4. Middleware

- **File:** `middleware.ts`
- **Behavior:** Uses `getToken({ req, secret: process.env.NEXTAUTH_SECRET })`. For paths under `/admin` (except `/admin/login`), redirects to `/admin/login` if there is no token or `token.role !== "admin"`.
- **Result:** Admin routes are protected; unauthenticated or non-admin users are sent to the admin login page.

---

## 5. TypeScript types

- **File:** `src/types/next-auth.d.ts`
- **Session:** `session.user` has `id`, `email`, `name?`, `role`.
- **JWT:** `id` and `role` on the token.
- **User:** `id` and `role` on the user object.
- **Result:** No type errors when using `session.user.role`, `session.user.id`, etc.

---

## 6. Login pages

- **Main site:** `/login` — `signIn("credentials", { email, password, redirect: false })` → on success, `router.push("/account")`.
- **Admin:** `/admin/login` — same `signIn("credentials", ...)` → on success, `router.push("/admin/dashboard")`.
- Both use the same Credentials provider and same auth config.

---

## 7. API route protection

- Admin and account APIs use `getServerSession(authOptions)` and check `session?.user?.role === "admin"` (or equivalent). Consistent with the same auth config.

---

## What you must have at runtime

1. **NEXTAUTH_SECRET**  
   Required. Must be set in `.env` / `.env.local` (local) and in Vercel (production). At least 32 characters. Used to sign JWTs and in middleware.

2. **NEXTAUTH_URL** (recommended for production)  
   Optional in code but recommended on Vercel. Set to your production URL (e.g. `https://kollect-it.com`). NextAuth uses it for callbacks and redirects. For credentials-only, login can work without it in some cases, but setting it avoids subtle redirect/cookie issues.

3. **DATABASE_URL**  
   Required for the Credentials provider to look up users and verify passwords (Prisma + bcrypt).

---

## Quick runtime check

- **Local:** Ensure `.env` or `.env.local` has `NEXTAUTH_SECRET` (32+ chars) and `DATABASE_URL`. Run `bun run dev`, open `/login` or `/admin/login`, sign in with a user that exists and has a password set. You should land on `/account` or `/admin/dashboard`.
- **Production:** In Vercel, set `NEXTAUTH_SECRET` and `NEXTAUTH_URL` (e.g. `https://kollect-it.com`). Same sign-in test on the deployed site.

If login still fails, see `docs/LOGIN-TROUBLESHOOTING.md` (same DB, exact email, local vs production).
