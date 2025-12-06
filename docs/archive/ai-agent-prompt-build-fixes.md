# Kollect-It Build Fix Prompt - For VS Code AI Agent

## Context
The Kollect-It Next.js 15 application has TypeScript errors preventing successful build. Apply the following fixes to resolve all source code errors.

---

## Fix 1: Replace Corrupted EmptyState.tsx

**File:** `src/components/EmptyState.tsx`

Replace the entire file contents with:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <Icon className="w-16 h-16 mx-auto mb-4 text-lux-gray" />
      <h3 className="text-xl font-serif font-semibold text-lux-black mb-2">
        {title}
      </h3>
      <p className="text-lux-gray-dark max-w-md mx-auto mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
```

---

## Fix 2: Install Missing Package

Run this command:
```bash
npm install @supabase/ssr --save
```

---

## Fix 3: Fix Supabase Server for Next.js 15 Async Cookies

**File:** `src/lib/supabase/server.ts`

Replace the entire file contents with:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

---

## Fix 4: Fix Auth.ts Spread Types Error

**File:** `src/lib/auth.ts`

Find this code around line 176-180:
```typescript
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        logger.debug("NextAuth debug", { code, ...metadata });
      }
    },
```

Replace with:
```typescript
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        logger.debug("NextAuth debug", { code, ...(metadata && typeof metadata === 'object' ? metadata : {}) });
      }
    },
```

---

## Fix 5: Add Stripe Null Checks to Checkout Routes

### File: `src/app/api/checkout/create-order/route.ts`

Find the POST function start:
```typescript
export async function POST(request: Request) {
  try {
    const { paymentIntentId } = await request.json();
```

Replace with:
```typescript
export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Payment processing is not configured" },
        { status: 503 },
      );
    }

    const { paymentIntentId } = await request.json();
```

### File: `src/app/api/checkout/create-payment-intent/route.ts`

Find the POST function start:
```typescript
export async function POST(request: NextRequest) {
  try {
    // Apply enhanced security for payment endpoint
```

Replace with:
```typescript
export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: "Payment processing is not configured" },
        { status: 503 },
      );
    }

    // Apply enhanced security for payment endpoint
```

### File: `src/app/api/webhooks/stripe/route.ts`

Find:
```typescript
export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const body = await request.text();
```

Replace with:
```typescript
export async function POST(request: Request) {
  const requestId = getRequestId(request);
  
  // Check if Stripe is configured
  if (!stripe) {
    logger.error("Stripe not configured", { requestId });
    return NextResponse.json(
      { error: "Payment processing is not configured", requestId },
      { status: 503 },
    );
  }

  const body = await request.text();
```

---

## Fix 6: Add Missing SKU Field to Product Creation

### File: `src/app/api/admin/products/approve/route.ts`

Find the product creation section (around line 54-70):
```typescript
    // Generate slug
    const slug = aiProduct.aiTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const product = await prisma.product.create({
      data: {
        title: aiProduct.aiTitle,
        slug: slug + "-" + Math.random().toString(36).substring(7),
        description: aiProduct.aiDescription,
        price: finalPrice,
        categoryId: category.id,
        condition: aiProduct.aiCondition,
        status: "active",
      },
    });
```

Replace with:
```typescript
    // Generate slug
    const slug = aiProduct.aiTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Generate SKU: YYYY-XXXXX format (year + 5 digit random)
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const sku = `${year}-${randomNum}`;

    const product = await prisma.product.create({
      data: {
        sku: sku,
        skuYear: year,
        skuNumber: randomNum,
        title: aiProduct.aiTitle,
        slug: slug + "-" + Math.random().toString(36).substring(7),
        description: aiProduct.aiDescription,
        price: finalPrice,
        categoryId: category.id,
        condition: aiProduct.aiCondition,
        status: "active",
      },
    });
```

### File: `src/app/api/admin/products/bulk-approve/route.ts`

Find the product creation section (around line 88-108):
```typescript
        // Generate slug
        const slug =
          aiProduct.aiTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") +
          "-" +
          Math.random().toString(36).substring(7);

        // Create product
        const product = await prisma.product.create({
          data: {
            title: aiProduct.aiTitle,
            slug,
            description: aiProduct.aiDescription,
            price: finalPrice,
            categoryId,
            condition: aiProduct.aiCondition || "Good",
            status: "active",
          },
        });
```

Replace with:
```typescript
        // Generate slug
        const slug =
          aiProduct.aiTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") +
          "-" +
          Math.random().toString(36).substring(7);

        // Generate SKU: YYYY-XXXXX format (year + 5 digit random)
        const year = new Date().getFullYear();
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const sku = `${year}-${randomNum}`;

        // Create product
        const product = await prisma.product.create({
          data: {
            sku: sku,
            skuYear: year,
            skuNumber: randomNum,
            title: aiProduct.aiTitle,
            slug,
            description: aiProduct.aiDescription,
            price: finalPrice,
            categoryId,
            condition: aiProduct.aiCondition || "Good",
            status: "active",
          },
        });
```

### File: `src/app/api/products/route.ts`

Find the product creation section (around line 124-156):
```typescript
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: parseFloat(price),
        categoryId,
        condition,
        year,
        artist,
        medium,
        period,
        featured: featured || false,
        images: {
          create:
            (images as ImageInput[] | undefined)?.map((img, index) => ({
              url: img.url,
              alt: img.alt || title,
              order: index,
            })) || [],
        },
      },
      include: {
        images: true,
        category: true,
      },
    });
```

Replace with:
```typescript
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Generate SKU: YYYY-XXXXX format (year + 5 digit random)
    const skuYear = new Date().getFullYear();
    const skuNumber = Math.floor(10000 + Math.random() * 90000);
    const sku = `${skuYear}-${skuNumber}`;

    const product = await prisma.product.create({
      data: {
        sku,
        skuYear,
        skuNumber,
        title,
        slug,
        description,
        price: parseFloat(price),
        categoryId,
        condition,
        year,
        artist,
        medium,
        period,
        featured: featured || false,
        images: {
          create:
            (images as ImageInput[] | undefined)?.map((img, index) => ({
              url: img.url,
              alt: img.alt || title,
              order: index,
            })) || [],
        },
      },
      include: {
        images: true,
        category: true,
      },
    });
```

---

## Fix 7: Remove Unused Import

**File:** `src/components/admin/ProductUploadForm.tsx`

Find line 4:
```typescript
import { Upload, Loader, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
```

Replace with:
```typescript
import { Loader, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
```

---

## Verification

After applying all fixes, run:

```bash
# Generate Prisma client
npx prisma generate

# Check TypeScript
npx tsc --noEmit

# Build
npm run build
```

The source code errors should be resolved. Any remaining warnings will be in the `scripts/` directory (development utilities) which don't affect the production build.
