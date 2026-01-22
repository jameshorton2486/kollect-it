# Kollect-It Authentication Audit & Fix Prompt

## Context

This is a Next.js 16 luxury marketplace application (Kollect-It) using:
- **Framework:** Next.js 16 with App Router
- **Database:** Supabase PostgreSQL (used as database only, NOT for auth)
- **ORM:** Prisma
- **Authentication:** NextAuth.js (credentials + Google OAuth)
- **Deployment:** Vercel

## Current Problem

1. User registration shows "User with this email already exists" for admin@kollect-it.com
2. Unable to log in with existing credentials
3. Confusion between NextAuth and Supabase Auth (we want NextAuth ONLY)
4. Need complete verification that auth is properly configured end-to-end

## Your Task

Perform a complete authentication audit and fix any issues. Follow this systematic approach:

---

## PHASE 1: File Inventory & Analysis

### 1.1 Locate and review ALL auth-related files:

```
src/app/api/auth/[...nextauth]/route.ts   # NextAuth API route
src/app/api/auth/register/route.ts        # Registration endpoint
src/app/(auth)/login/page.tsx             # Login page
src/app/(auth)/register/page.tsx          # Registration page
src/lib/auth.ts                           # Auth configuration
src/lib/prisma.ts                         # Database client
prisma/schema.prisma                      # Database schema
middleware.ts                             # Route protection
```

### 1.2 Check environment variables are properly referenced:

```env
# Required for NextAuth
NEXTAUTH_URL=https://kollect-it.com
NEXTAUTH_SECRET=<32+ character secret>

# Required for database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Optional: Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## PHASE 2: Database Schema Verification

### 2.1 Verify Prisma schema has correct NextAuth models:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?   // For credentials auth
  role          String    @default("user") // user, admin, seller
  accounts      Account[]
  sessions      Session[]
  // ... other relations
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### 2.2 Check if database tables exist and match schema:

```bash
npx prisma db pull    # Pull current DB state
npx prisma migrate status  # Check migration status
```

---

## PHASE 3: NextAuth Configuration Audit

### 3.1 Verify NextAuth route handler (App Router format):

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 3.2 Verify auth options configuration:

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    // Google OAuth (if configured)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt", // IMPORTANT: Use JWT for credentials provider
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};
```

### 3.3 CRITICAL: Session Strategy

When using CredentialsProvider, you MUST use `session: { strategy: "jwt" }`. The database adapter with credentials provider requires JWT sessions because credentials don't create OAuth accounts.

---

## PHASE 4: Registration Endpoint Audit

### 4.1 Verify registration API:

```typescript
// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## PHASE 5: Login Flow Verification

### 5.1 Verify login page uses NextAuth signIn:

```typescript
// src/app/(auth)/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/account");
      router.refresh();
    }
  }

  return (
    // ... form JSX
  );
}
```

---

## PHASE 6: TypeScript Types

### 6.1 Extend NextAuth types:

```typescript
// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
  }
}
```

---

## PHASE 7: Middleware for Route Protection

### 7.1 Verify middleware.ts:

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
```

---

## PHASE 8: Testing & Verification

### 8.1 Create a test script to verify auth flow:

```typescript
// scripts/test-auth.ts
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function testAuth() {
  console.log("🔍 Testing authentication setup...\n");

  // 1. Test database connection
  try {
    await prisma.$connect();
    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return;
  }

  // 2. Check for admin user
  const adminEmail = "admin@kollect-it.com";
  const admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (admin) {
    console.log("✅ Admin user exists:", {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      hasPassword: !!admin.password,
    });
  } else {
    console.log("⚠️  Admin user does not exist");
  }

  // 3. List all users
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true },
  });
  console.log("\n📋 All users:", users);

  // 4. Check required tables exist
  const tables = ["User", "Account", "Session"];
  for (const table of tables) {
    try {
      await prisma.$queryRawUnsafe(`SELECT 1 FROM "${table}" LIMIT 1`);
      console.log(`✅ Table "${table}" exists`);
    } catch {
      console.log(`❌ Table "${table}" missing`);
    }
  }

  await prisma.$disconnect();
}

testAuth();
```

### 8.2 Reset admin password if needed:

```typescript
// scripts/reset-admin-password.ts
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function resetAdminPassword() {
  const email = "admin@kollect-it.com";
  const newPassword = "Admin123!"; // Change this!

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.update({
    where: { email },
    data: { 
      password: hashedPassword,
      role: "admin" // Ensure admin role
    },
  });

  console.log("✅ Password reset for:", user.email);
  console.log("   New password:", newPassword);
  console.log("   Role:", user.role);

  await prisma.$disconnect();
}

resetAdminPassword();
```

---

## PHASE 9: Deliverables

After completing the audit, provide:

1. **Issue Report:** List of all problems found
2. **Fixed Files:** Complete corrected versions of any files with issues
3. **Migration Commands:** Any database commands needed
4. **Environment Checklist:** Verified env vars needed
5. **Test Results:** Output from test script
6. **Login Instructions:** Step-by-step to verify auth works

---

## PHASE 10: Quick Fixes Checklist

Before deep diving, check these common issues:

- [ ] `NEXTAUTH_SECRET` is set and 32+ characters
- [ ] `NEXTAUTH_URL` matches actual deployment URL
- [ ] Session strategy is "jwt" (required for credentials)
- [ ] Password field exists in User model
- [ ] bcrypt/bcryptjs is installed and imported correctly
- [ ] PrismaAdapter is from `@auth/prisma-adapter` (not old package)
- [ ] Prisma client is generated (`npx prisma generate`)
- [ ] Database tables exist (`npx prisma db push`)
- [ ] No Supabase Auth code interfering with NextAuth

---

## Files to Provide to Codex

Please share these files for the audit:

```
src/app/api/auth/[...nextauth]/route.ts
src/app/api/auth/register/route.ts
src/lib/auth.ts
src/lib/prisma.ts
prisma/schema.prisma
middleware.ts
src/types/next-auth.d.ts (if exists)
package.json (dependencies section)
.env.example (NOT .env.local with real secrets)
```

---

## Expected Outcome

After this audit, you should be able to:

1. Register new users at /register
2. Login with email/password at /login
3. Login with Google OAuth (if configured)
4. Access protected routes (/account, /admin)
5. Admin users can access /admin routes
6. Sessions persist correctly across page loads
