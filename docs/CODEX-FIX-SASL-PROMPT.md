# Codex CLI prompt: Fix SASL authentication failed when creating admin

**Copy everything below the line into Codex CLI (or Cursor) so it can fix or guide the fix.**

---

When I run `npx tsx scripts/create-admin.ts` after `vercel env pull .env.local --environment=production`, I get:

```
Error creating admin user: PrismaClientInitializationError:
Invalid prisma.user.upsert() invocation in scripts/create-admin.ts
Error querying the database: FATAL: SASL authentication failed
```

**Context:**
- The project uses Prisma + Supabase Postgres. SASL authentication failed usually means `DATABASE_URL` is the **Supabase connection pooler** (port 6543 / pooler.supabase.com) instead of the **direct** Postgres connection (port 5432).
- Prisma requires the direct connection string for this script and for the app runtime.

**Please do the following:**

1. **If the script doesn’t already:** Add a fail-fast check in `scripts/create-admin.ts` that runs before any Prisma call: if `process.env.DATABASE_URL` looks like a pooler URL (contains `pooler.supabase.com`, `:6543`, or `pgbouncer`), print a clear error and exit with code 1, telling the user to use the direct Supabase connection (port 5432) and to update Vercel and run `vercel env pull .env.local --environment=production` again. Reference `docs/PRODUCTION_DATABASE_SETUP.md`.

2. **Docs:** In `docs/LOGIN-TROUBLESHOOTING.md`, in the section about authentication failure / wrong database credentials, add a short subsection “SASL authentication failed” that says: this usually means `DATABASE_URL` is the pooler URL; use the **direct** Supabase connection (port 5432) from Supabase Dashboard → Settings → Database; update `DATABASE_URL` in Vercel (Production) with that direct URL, then run `vercel env pull .env.local --environment=production` and run the create-admin script again. Link to `docs/PRODUCTION_DATABASE_SETUP.md`.

3. **User fix (if I still see SASL):** Tell me exactly what to do: go to Supabase Dashboard → Settings → Database, copy the **direct** connection string (port 5432, not the Session pooler 6543), update `DATABASE_URL` in Vercel Production environment variables, run `vercel env pull .env.local --environment=production` from the repo root, then run `npx tsx scripts/create-admin.ts` again.
