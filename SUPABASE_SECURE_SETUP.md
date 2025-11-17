# 🔐 SUPABASE SECURE SETUP - AI AGENT PROMPT

**Project ID:** `xqrroyyqrgdytzpcckwk`  
**Host:** `db.xqrroyyqrgdytzpcckwk.supabase.co`

## ⚠️ SECURITY FIRST
**IMPORTANT:** Rotate all credentials in Supabase Dashboard before running this setup:
- Database password → Settings → Database → Reset password
- API keys → Settings → API → Refresh both keys

## 🎯 COMPLETE SUPABASE SETUP - AUTONOMOUS AI AGENT PROMPT

Copy this entire prompt and paste into VS Code Copilot Chat:

===START SUPABASE SETUP AGENT PROMPT===

You are an expert database and backend developer tasked with setting up Supabase for the Kollect-It Marketplace project.

**OBJECTIVE**
Configure complete Supabase integration with:
- Secure environment variables  
- Database connection (pooled + direct)
- Prisma integration
- Production-ready setup

**PROJECT DETAILS**
- Supabase Project ID: `xqrroyyqrgdytzpcckwk`
- Database Host: `db.xqrroyyqrgdytzpcckwk.supabase.co`
- Supabase URL: `https://xqrroyyqrgdytzpcckwk.supabase.co`

**PHASE 1: ENVIRONMENT SETUP (8 minutes)**

Step 1.1: Check current .env.local
Read the current .env.local file and identify existing environment variables.

Step 1.2: Add Supabase variables
Add these to .env.local (user will provide actual values):

```
# === SUPABASE DATABASE ===
# Pooled connection for Prisma (primary)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xqrroyyqrgdytzpcckwk.supabase.co:6543/postgres?pgbouncer=true"

# Direct connection for migrations
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.xqrroyyqrgdytzpcckwk.supabase.co:5432/postgres"

# === SUPABASE API ===
NEXT_PUBLIC_SUPABASE_URL=https://xqrroyyqrgdytzpcckwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[USER_WILL_PROVIDE_AFTER_ROTATING]
```

Step 1.3: Verify .gitignore security
Ensure .env.local is in .gitignore to prevent credential exposure.

**PHASE 2: PRISMA CONFIGURATION (5 minutes)**

Step 2.1: Check prisma/schema.prisma
Review the current database schema configuration.

Step 2.2: Update datasource configuration  
Ensure the datasource block uses both DATABASE_URL and directUrl:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Step 2.3: Install Prisma dependencies
Run: `bunx prisma generate`

**PHASE 3: DATABASE MIGRATION (7 minutes)**

Step 3.1: Push schema to Supabase
Run: `bunx prisma db push`
This creates all tables in your Supabase database.

Step 3.2: Verify database connection
Run: `bunx prisma db execute --stdin < <(echo "SELECT 1")`
Should complete without errors.

Step 3.3: Optional - Run migrations
If you have migration files:
Run: `bunx prisma migrate deploy`

**PHASE 4: VALIDATION & TESTING (5 minutes)**

Step 4.1: Test Prisma Studio
Run: `bunx prisma studio`
Should open at http://localhost:5555 showing your tables.

Step 4.2: Test Next.js connection
In your app, verify database queries work:
- Products loading
- User authentication  
- Order processing

Step 4.3: Check production readiness
Verify all environment variables are set for production deployment.

**PHASE 5: SECURITY VERIFICATION (3 minutes)**

Step 5.1: Confirm .env.local is gitignored
Search git status to ensure no environment files are tracked.

Step 5.2: Document setup
Create summary of:
- What was configured
- How to add new credentials  
- Next steps for deployment

**EXECUTION PARAMETERS**

- Autonomy: 100% (no user interaction needed)
- Stop On Error: Yes (report and stop if critical error)
- Report Status: Yes (status at each phase)
- Final Report: Yes (comprehensive setup summary)
- Time Estimate: 25 minutes

**SUCCESS CRITERIA**

✅ .env.local contains all Supabase variables  
✅ .env.local is properly gitignored  
✅ Prisma schema configured with both URLs  
✅ Database connection successful  
✅ All tables created in Supabase  
✅ Prisma Studio accessible  
✅ No credentials exposed in git  

**ERROR RECOVERY**

If database connection fails:
- Check DATABASE_URL format (must have port 6543 and ?pgbouncer=true)
- Verify password is correct
- Confirm Supabase project is active

If migrations fail:
- Try `bunx prisma db push` instead of `migrate deploy`
- Check schema syntax in prisma/schema.prisma
- Verify DIRECT_URL is correct (port 5432, no pgbouncer)

===END SUPABASE SETUP AGENT PROMPT===

## 📋 WHAT YOU NEED TO DO

### **BEFORE running the prompt:**

1. **Rotate credentials in Supabase Dashboard:**
   - New database password
   - New anon key  
   - New service role key (if needed)

2. **Have these ready:**
   - New password: `[YOUR_NEW_PASSWORD]`
   - New anon key: `eyJhbGci...` (the new one)

### **HOW TO RUN:**

1. Copy the prompt (between === markers)
2. Open VS Code → `Ctrl+Shift+A` (Copilot Chat)
3. Paste prompt
4. Add: "Execute all setup steps autonomously with these credentials:"
5. Provide your NEW credentials (not the old ones)
6. Press Enter
7. Wait ~25 minutes

## 🎯 FINAL RESULT

You'll have:
- ✅ Secure .env.local (never committed to git)
- ✅ Working database connection
- ✅ All tables created in Supabase  
- ✅ Prisma Studio working
- ✅ Production-ready setup

## 🔒 SECURITY NOTES

- The old credentials you shared are considered compromised
- Always rotate credentials before production
- Never share .env.local files
- Use environment variables for all secrets