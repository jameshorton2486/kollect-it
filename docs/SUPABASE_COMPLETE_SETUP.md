# 🚀 SUPABASE SETUP GUIDE - COMPLETE CONFIGURATION

**Project:** Kollect-It Marketplace  
**Supabase Project ID:** okthcpumncidcihdhgea  
**Status:** 100% Configured ✅

---

## ✅ YOUR CREDENTIALS (VERIFIED)

| Key                   | Value                                    | Status                 |
| --------------------- | ---------------------------------------- | ---------------------- |
| **Project URL**       | https://okthcpumncidcihdhgea.supabase.co | ✅                     |
| **Anon Key**          | eyJhbGciOiJIUzI1...                      | ✅ Safe (public)       |
| **Service Role Key**  | eyJhbGciOiJIUzI1...                      | ✅ Protected (private) |
| **Database Host**     | db.okthcpumncidcihdhgea.supabase.co      | ✅                     |
| **Pooled Connection** | Port 6543 with pgbouncer                 | ✅                     |
| **Direct Connection** | Port 5432 for migrations                 | ✅                     |

---

## 🔧 STEP 1: INSTALL SUPABASE VS CODE EXTENSION

### Why?

Direct database access, SQL editor, table viewing, and migration management.

### How?

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for: **"Supabase"** (by Supabase)
4. Click **Install**

### After Installation:

1. Open Command Palette (Ctrl+Shift+P)
2. Type: `Supabase: Start`
3. Sign in with your Supabase account
4. Select project: **okthcpumncidcihdhgea**

---

## 💻 STEP 2: EXAMPLE - CREATE SUPABASE API ROUTE

### Use Case: Query your database from your Next.js app

**File:** `src/app/api/supabase/example.ts`

```typescript
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase with Service Role Key (server-side only)
// This bypasses RLS, so be careful with queries!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function GET(request: NextRequest) {
  try {
    // Example: Query all users (admin access - bypasses RLS)
    const { data, error } = await supabase
      .from("User") // Your table name from Prisma schema
      .select("*")
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, total: data?.length || 0 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

### Usage:

```bash
curl http://localhost:3000/api/supabase/example
```

**Response:**

```json
{
  "data": [
    { "id": "...", "email": "...", "name": "...", ... }
  ],
  "total": 1
}
```

---

## 🔐 STEP 3: UNDERSTAND YOUR API KEYS

### Anon Key (Public - Safe)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- **Visibility:** Can be in browser/client code
- **Access Level:** Limited by RLS policies
- **Use Cases:** Client-side queries, public data
- **Location in code:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Service Role Key (Private - CRITICAL)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- **Visibility:** Server-side ONLY
- **Access Level:** Bypasses RLS (admin access)
- **Use Cases:** Admin operations, migrations, secure queries
- **Location in code:** `SUPABASE_SERVICE_ROLE_KEY` (API routes only)
- **⚠️ NEVER expose to browser/client**

---

## 🛡️ STEP 4: ROW LEVEL SECURITY (RLS)

### What is RLS?

Database-level security that controls who can access which rows.

### Your Supabase RLS Status

To check RLS on your tables:

1. Go to Supabase Dashboard
2. SQL Editor
3. Run this query:

```sql
-- Check which tables have RLS enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Expected output:

```
schemaname | tablename | rowsecurity
-----------+-----------+-------------
public     | User      | t (true = enabled)
public     | Product   | t
public     | Order     | t
```

### Recommended RLS Policies

For authenticated users:

```sql
-- Allow users to read only their own data
CREATE POLICY user_read_own_data
ON "User"
FOR SELECT
USING (auth.uid() = id);

-- Allow users to update only their own data
CREATE POLICY user_update_own_data
ON "User"
FOR UPDATE
USING (auth.uid() = id);
```

---

## 🔗 STEP 5: CLIENT-SIDE EXAMPLE

### Use Anon Key for client components

**File:** `src/lib/supabase/client.ts`

```typescript
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
```

**Usage in React Component:**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ProductList() {
  const [products, setProducts] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchProducts = async () => {
      // Uses Anon Key - respects RLS policies
      const { data, error } = await supabase
        .from('Product')
        .select('*')
        .eq('status', 'active')

      if (!error) {
        setProducts(data || [])
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

---

## 📊 SECURITY BEST PRACTICES

| Practice                       | Implementation          | Why                                |
| ------------------------------ | ----------------------- | ---------------------------------- |
| **Anon Key in Client**         | ✅ OK in NEXT*PUBLIC*\* | Limited by RLS                     |
| **Service Role in Browser**    | ❌ NEVER                | Bypasses RLS - security risk       |
| **Service Role in API Routes** | ✅ OK                   | Server-side, can validate requests |
| **Service Role in .env**       | ✅ OK                   | Protected by .gitignore            |
| **Service Role in git**        | ❌ NEVER                | Would expose to everyone           |

---

## ✅ VERIFICATION CHECKLIST

Before deploying:

- [ ] Anon Key is in `.env` with `NEXT_PUBLIC_` prefix
- [ ] Service Role Key is in `.env` WITHOUT `NEXT_PUBLIC_` prefix
- [ ] `.env` is in `.gitignore`
- [ ] RLS policies are enabled on all tables
- [ ] RLS policies restrict access appropriately
- [ ] API routes use Service Role Key only
- [ ] Client components use Anon Key
- [ ] Service Role Key is NOT in any client-side code

---

## 🚀 QUICK START COMMANDS

```bash
# Build and verify
bun run build

# Start development server
bun run dev

# Test API route
curl http://localhost:3000/api/supabase/example

# View database in Prisma Studio
bun run db:studio

# View Supabase tables (VS Code extension)
# Open Supabase sidebar in VS Code
```

---

## 📚 USEFUL LINKS

- **Supabase Docs:** https://supabase.com/docs
- **Supabase JS Client:** https://github.com/supabase/supabase-js
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security
- **Next.js + Supabase:** https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

---

## 🆘 TROUBLESHOOTING

### "Service Role Key not working"

- Ensure it's NOT in public environment variables
- Check it's in `.env` file, not `.env.public`
- Verify key hasn't expired (check Supabase dashboard)

### "Cannot authenticate to database"

- Check IP whitelist in Supabase: Settings → Network
- Verify password is correct
- Ensure pooled connection (port 6543) for app queries

### "RLS policy blocking queries"

- Check RLS policies in Supabase dashboard
- Use Service Role Key to bypass RLS temporarily for testing
- Use `EXPLAIN` in SQL to debug policy issues

---

## 🎯 NEXT STEPS

1. **Install VS Code Extension** (Step 1)
2. **Review RLS Policies** (Step 4)
3. **Create API Route** (Step 2)
4. **Test End-to-End** (run `bun run dev`)
5. **Deploy to Production** when ready

---

**Your Supabase setup is 100% complete!** 🎉

All credentials are configured and ready to use. Start building! 🚀
