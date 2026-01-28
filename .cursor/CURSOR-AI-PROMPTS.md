# Kollect-It: Cursor AI Prompts

# Copy-paste these prompts into Cursor AI to apply fixes

---

## PROMPT 1: Fix Last Gray Class (CRITICAL)

```
Fix the last remaining non-standard gray class in the codebase.

FILE: src/app/admin/dashboard/page.tsx
LINE: 447

CURRENT CODE:
<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
  Draft
</span>

REPLACE WITH:
<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-lux-cream text-lux-gray-dark">
  Draft
</span>

CONTEXT: This is a status badge showing "Draft" for products. The lux-* tokens are part of our luxury design system:
- bg-lux-cream = soft cream background
- text-lux-gray-dark = dark gray text for readability

After this fix, there should be ZERO instances of text-gray-* or bg-gray-* in the src/ directory.
```

---

## PROMPT 2: Fix Desktop App Env Template (CRITICAL)

```
Fix the environment variable naming inconsistency in the desktop app template.

FILE: desktop-app-env-template.txt
LINE: 15

CURRENT:
SERVICE_API_KEY=kollect-it-product-service-2025

REPLACE WITH:
PRODUCT_INGEST_API_KEY=kollect-it-product-service-2025

REASON: The actual code uses PRODUCT_INGEST_API_KEY:
- website_publisher.py line 40: os.getenv("PRODUCT_INGEST_API_KEY")
- ingest/route.ts line 11: process.env.PRODUCT_INGEST_API_KEY

This mismatch would cause authentication failures when the desktop app tries to publish products.
```

---

## PROMPT 3: Fix Website Env Template (CRITICAL)

```
Fix the environment variable naming in the website template.

FILE: env_vars_template.txt

Find all instances of SERVICE_API_KEY and replace with PRODUCT_INGEST_API_KEY.

This includes:
1. Line 32: The variable definition
2. The Python code template section (around line 56)

The variable name must match what the actual code expects:
- src/app/api/admin/products/ingest/route.ts uses PRODUCT_INGEST_API_KEY
```

---

## PROMPT 4: Add Organization Schema (SEO Enhancement)

```
Add Organization JSON-LD schema to the homepage for better Google rich results.

FILE: src/app/page.tsx

Add this schema object (place near the top of the file, after imports):

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Kollect-It",
  "url": "https://kollect-it.com",
  "logo": "https://kollect-it.com/logo.png",
  "description": "Curated marketplace for fine art, rare books, militaria, and collectibles",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "info@kollect-it.com"
  }
};

Then add this script tag in the component's return, right after the opening tags:

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
/>

This improves the site's appearance in Google Knowledge Panel and provides SEO signals.
```

---

## PROMPT 5: Enable Package Import Optimization (Performance)

```
Re-enable package optimization in Next.js config for better bundle size.

FILE: next.config.js

FIND (around lines 128-137):
experimental: {
  // optimizePackageImports: [
  //   "lucide-react",
  //   "framer-motion",
  //   "clsx",
  //   "tailwind-merge",
  // ],
  // serverActions: {
  //   bodySizeLimit: "2mb",
  // },
},

REPLACE WITH:
experimental: {
  optimizePackageImports: [
    "lucide-react",
    "framer-motion",
    "recharts",
  ],
},

NOTE: This was previously disabled due to timeout issues. If problems occur after enabling:
1. Run `bun run build` and check for errors
2. If timeouts occur, re-comment the section
3. Consider removing recharts from the list first (it's the largest)

Expected benefit: 50-100KB reduction in gzipped bundle size.
```

---

## PROMPT 6: Audit for Remaining Gray Classes (Verification)

```
Search the entire src/ directory for any remaining non-standard gray classes.

Run this search:
- Pattern: text-gray- or bg-gray-
- Include: *.tsx, *.ts files
- Exclude: node_modules

Report:
1. Total count of matches
2. File paths and line numbers for any matches found
3. Suggested replacements using the lux-* design system:
   - text-gray-300 → text-lux-gray-light
   - text-gray-500 → text-lux-gray
   - text-gray-600 → text-ink-600
   - text-gray-700 → text-lux-gray-dark
   - text-gray-800 → text-lux-black
   - bg-gray-50 → bg-lux-pearl
   - bg-gray-100 → bg-lux-cream
   - bg-gray-800 → bg-surface-900
   - bg-gray-900 → bg-lux-charcoal

Expected result after all fixes: 0 matches
```

---

## PROMPT 7: Review Email Configuration (Configuration Check)

```
Review the email configuration and verify it's ready for production.

FILE: src/lib/email.ts

Check:
1. Is EMAIL_ENABLED correctly detecting environment variables?
2. Are all email templates imported?
3. Is the retry logic properly configured?

Required environment variables for email to work:
- EMAIL_HOST (default: smtp.gmail.com)
- EMAIL_PORT (default: 587)
- EMAIL_USER (the sender email address)
- EMAIL_PASSWORD (app password, not regular password)
- EMAIL_FROM (display name and email)
- ADMIN_EMAIL (for admin notifications)

List any missing templates or configuration issues.
```

---

## PROMPT 8: Generate Vercel Env Var List (Deployment Helper)

```
Generate a complete list of all required environment variables for Vercel deployment.

Scan these files:
- src/lib/email.ts
- src/lib/auth.ts
- src/lib/stripe.ts
- src/lib/imagekit.ts
- src/app/api/admin/products/ingest/route.ts
- prisma/schema.prisma

Output a markdown checklist format:
- [ ] VARIABLE_NAME - Description - Example value (redacted)

Group by category:
1. Database
2. Authentication
3. Stripe
4. ImageKit
5. Email
6. Desktop App Integration
7. AI (optional)
```

---

## PROMPT 9: Sync Vercel & Desktop Environment (CRITICAL)

```
I am experiencing a 401 Unauthorized error during product ingestion from the desktop app to the Vercel API.

TASK: Synchronize environment variables between Vercel production and the desktop app to fix authentication failures.

FILES TO CHECK:
1. .env.local (root directory - pull from Vercel if missing)
2. product-application/desktop-app/.env
3. product-application/web-app/.env (if exists)

STEPS:
1. First, ensure .env.local exists by running: `vercel env pull .env.local` in the terminal
   - If this fails, verify Vercel CLI is authenticated: `vercel login`
   - If still failing, manually check Vercel dashboard for environment variables

2. Read and compare PRODUCT_INGEST_API_KEY values:
   - Extract PRODUCT_INGEST_API_KEY from .env.local (Vercel production value)
   - Extract PRODUCT_INGEST_API_KEY from product-application/desktop-app/.env
   - If they differ, update the desktop .env to match Vercel EXACTLY (case-sensitive, no extra spaces)

3. Clean all .env files:
   - Remove any hidden \r\n (CRLF) line endings (convert to LF)
   - Strip trailing spaces from all keys and values
   - Ensure no duplicate variable definitions
   - Verify format: KEY=value (no spaces around =)

4. Verify critical variables are present in both files:
   - PRODUCT_INGEST_API_KEY (must match exactly)
   - NEXTAUTH_SECRET (should exist in .env.local)
   - STRIPE_SECRET_KEY (should exist in .env.local)
   - DATABASE_URL (should exist in .env.local)
   - DIRECT_URL (should exist in .env.local)

5. Check Supabase Database URLs for Opaque Token issues:
   - Verify DATABASE_URL format: should be `postgresql://postgres:[token]@[host]:6543/postgres?pgbouncer=true`
   - Verify DIRECT_URL format: should be `postgresql://postgres:[token]@[host]:5432/postgres`
   - If DATABASE_URL or DIRECT_URL contains a password that looks like a traditional password (short, simple) but connection fails:
     * This may indicate Supabase has migrated to "Opaque Tokens"
     * Check Supabase Dashboard → Settings → Database → Connection string
     * If connection string format has changed, update both DATABASE_URL and DIRECT_URL
     * Opaque tokens are longer and more complex than traditional passwords
   - Verify port numbers: DATABASE_URL uses 6543 (pooled), DIRECT_URL uses 5432 (direct)

6. If NEXTAUTH_SECRET or STRIPE_SECRET_KEY are missing from .env.local:
   - Add placeholder comments: # TODO: Run `vercel env add NEXTAUTH_SECRET`
   - Add placeholder comments: # TODO: Run `vercel env add STRIPE_SECRET_KEY`
   - Remind user to run these commands in terminal

7. Verify the desktop app .env has the correct API endpoint:
   - Check for NEXT_PUBLIC_API_URL or API_BASE_URL
   - Should point to: https://kollect-it.com (production) or your Vercel preview URL

8. Output a comparison report:
   - List all variables that differ between files
   - List all variables missing from desktop .env
   - Confirm PRODUCT_INGEST_API_KEY matches exactly (show first/last 4 chars only for security)
   - Report DATABASE_URL and DIRECT_URL status (ports correct, format valid)
   - If database URLs appear to use old password format, warn about potential Supabase Opaque Token migration

CONTEXT:
- The desktop app uses PRODUCT_INGEST_API_KEY to authenticate with the /api/admin/products/ingest endpoint. A mismatch causes 401 Unauthorized errors. The key must be identical in both Vercel production and the desktop app's .env file.
- Supabase has migrated to "Opaque Tokens" for database authentication. If database connection fails, the connection strings may need to be regenerated from the Supabase Dashboard to get the new opaque token format.

After syncing, test by attempting to publish a product from the desktop app.
```

---

## Usage Instructions

1. Open the relevant file in Cursor
2. Select the Cursor AI chat
3. Copy-paste the entire prompt block
4. Review the suggested changes
5. Apply with Cmd+Enter or click "Apply"

For batch operations, use the PowerShell scripts in the scripts/ folder instead.
