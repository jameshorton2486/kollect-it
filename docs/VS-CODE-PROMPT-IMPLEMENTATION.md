# VS CODE AI AGENT PROMPT – KOLLECT-IT PHASE 1 FIXES

## MISSION

Fix all critical TypeScript errors and blockers preventing build.

## TASKS

### Task 1: Delete TypeScript Error File

**FILE:** docs/PRODUCTIMAGE-EXAMPLES.tsx  
**ACTION:** Delete this file (it has TypeScript errors)

```bash
rm docs/PRODUCTIMAGE-EXAMPLES.tsx
```

---

### Task 2: Create Environment Validation Module

**FILE:** Create `src/lib/env-validation.ts`

```typescript
interface EnvironmentConfig {
  required: string[];
  optional: string[];
}

const ENV_CONFIG: EnvironmentConfig = {
  required: [
    "DATABASE_URL",
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "IMAGEKIT_PRIVATE_KEY",
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
    "RESEND_API_KEY",
  ],
  optional: ["NEXT_PUBLIC_GA_ID", "GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY"],
};

export function validateEnvironment() {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const envVar of ENV_CONFIG.required) {
    if (!process.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }

  for (const envVar of ENV_CONFIG.optional) {
    if (!process.env[envVar]) {
      warnings.push(`Optional environment variable not set: ${envVar}`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function logValidationResults(result: any) {
  if (result.warnings.length > 0) {
    console.warn("⚠️  Environment Warnings:");
    result.warnings.forEach((w: string) => console.warn(`   ${w}`));
  }

  if (result.errors.length > 0) {
    console.error("❌ Environment Configuration Errors:");
    result.errors.forEach((e: string) => console.error(`   ${e}`));
    throw new Error("Environment validation failed.");
  }

  if (result.valid && result.warnings.length === 0) {
    console.log("✅ All environment variables validated");
  }
}
```

---

### Task 3: Update next.config.js

**FILE:** next.config.js  
**LOCATION:** Add after line 5 (after const declarations)

```javascript
// Environment validation at build time
const isCI = process.env.CI === "true";

if (isProduction || isCI) {
  try {
    const {
      validateEnvironment,
      logValidationResults,
    } = require("./src/lib/env-validation.ts");
    const result = validateEnvironment();
    logValidationResults(result);
  } catch (error) {
    if (isProduction) {
      throw error;
    }
    console.warn("Environment validation warning:", error.message);
  }
}
```

---

### Task 4: Ensure .env.local Exists

**FILE:** `.env.local` (in project root)  
**CONTENT:**

```
DATABASE_URL=postgresql://user:password@localhost:5432/kollect-it
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=kollect-it-nextauth-secret-2025-production-key-min-32-chars-long
STRIPE_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
IMAGEKIT_PRIVATE_KEY=3E7KSDvS2hdYlhqDbfOga4VTR2I=
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_VXQqaBamg3i1ic8FzAFrQa78=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit
RESEND_API_KEY=re_your_key
```

---

### Task 5: Create Middleware for Protected Routes

**FILE:** Create `src/middleware.ts`

```typescript
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export const middleware = withAuth(
  async function middleware(req: NextRequest & { nextauth: any }) {
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const token = req.nextauth.token;
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    if (req.nextUrl.pathname.startsWith("/account")) {
      const token = req.nextauth.token;
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    pages: { signIn: "/admin/login" },
    callbacks: { authorized: ({ token }) => true },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/api/admin/:path*"],
};
```

---

### Task 6: Test Build

**COMMANDS:**

```bash
bun run lint
bun run build
```

---

## ✅ SUCCESS CRITERIA

When complete:

- ✅ `bun run lint` shows 0 errors
- ✅ `bun run build` completes successfully
- ✅ `.env.local` exists with all vars
- ✅ All files created/updated

---

## 📥 HOW TO USE THIS PROMPT

1. **Open VS Code** to your project
2. **Press Ctrl + I** to open AI Agent
3. **Copy the entire prompt** from "# VS CODE AI AGENT PROMPT" to the end
4. **Paste into VS Code AI Agent**
5. **Press Enter** and follow the AI's guidance

---

## ⏱️ ESTIMATED TIME

**2-3 hours** for complete Phase 1 execution

After Phase 1 is done, tell me and I'll provide the Navigation Audit Prompt for Phase 2.

---

## 📋 NEXT STEPS

After completing Phase 1:

1. Run `bun run dev` to start dev server
2. Test the application in browser
3. Proceed to Phase 2 (Navigation Audit Fix)
