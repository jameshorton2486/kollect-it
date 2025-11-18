# 🤖 MASTER AGENT AUTONOMOUS DEPLOYMENT PROMPT
## Kollect-It Marketplace - Complete Production Deployment

**EXECUTION INSTRUCTIONS:**
1. Copy this ENTIRE document
2. Open VS Code at: `C:\Users\james\kollect-it-marketplace-1`
3. Open Copilot Chat (Ctrl+Shift+I or Ctrl+L)
4. Paste entire prompt
5. Add: "Execute all phases autonomously. Report completion status after each phase."
6. Monitor 6-8 hour execution

---

## 🎯 CRITICAL CONTEXT FOR AI AGENT

**Project Type:** Next.js 15.5.6 e-commerce marketplace (Bun runtime)  
**Database:** Supabase PostgreSQL (already connected, tables exist)  
**Auth:** NextAuth.js (configured, admin user exists)  
**Payments:** Stripe (test mode keys configured)  
**Images:** ImageKit CDN (credentials configured)  
**Current Status:** Development complete, ready for production deployment

**Environment Variables (Already Configured in .env.local):**
```
DATABASE_URL=postgresql://postgres:KITexas7234*@db.xqrroyyqrgdytzpcckwk.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres:KITexas7234*@db.xqrroyyqrgdytzpcckwk.supabase.co:5432/postgres
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_VXQqaBamg3i1ic8FzAFrQa78=
IMAGEKIT_PRIVATE_KEY=private_3E7KSDvS2hdYlhqDbfOga4VTR2I=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit
```

**Key Files:**
- Main config: `next.config.js`
- Database schema: `prisma/schema.prisma`
- Auth setup: `src/auth.ts` or `src/app/api/auth/[...nextauth]/route.ts`
- Admin routes: `src/app/api/admin/**`

---

## 🚀 AUTONOMOUS EXECUTION PHASES

You are an expert full-stack developer with DevOps expertise. Execute ALL phases below autonomously. Only stop if you encounter a critical error that requires user credentials you cannot access.

---

## PHASE 1: SECURITY LOCKDOWN (60 minutes)

### Task 1.1: Admin Route Authentication Audit & Auto-Fix

**Objective:** Ensure ALL admin API routes are properly secured with role-based authentication.

**Step 1: Find all admin routes**
```bash
# Search for admin API routes
find src/app/api/admin -name "route.ts" -o -name "route.js"
```

**Step 2: Create standardized auth helper (if not exists)**

Create file: `src/lib/auth-helpers.ts`
```typescript
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function requireAdminAuth() {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    )
  }
  
  if (session.user.role !== "ADMIN" && session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    )
  }
  
  return null // No error, user is authorized
}

export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    )
  }
  
  return null // No error, user is authenticated
}
```

**Step 3: Auto-fix ALL admin routes**

For EACH file in `src/app/api/admin/**`:

**Required Pattern:**
```typescript
import { requireAdminAuth } from "@/lib/auth-helpers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // REQUIRED: Check auth first
  const authError = await requireAdminAuth()
  if (authError) return authError
  
  // Rest of route logic...
  try {
    // ... existing logic ...
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Repeat for POST, PUT, PATCH, DELETE handlers
```

**Action:** Systematically update EVERY admin route file to include:
1. Import `requireAdminAuth`
2. Call it at the start of each handler
3. Return immediately if auth fails
4. Wrap remaining logic in try-catch

**DO NOT skip any routes. Update ALL of them.**

---

### Task 1.2: NextAuth Production Security

**Check file:** Find NextAuth configuration (likely in `src/auth.ts` or `src/app/api/auth/[...nextauth]/route.ts`)

**Required configurations:**

```typescript
// Ensure these settings exist
export const authOptions: NextAuthOptions = {
  // ... existing providers ...
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: {
    signIn: "/login",
    error: "/error",
  },
  
  // Production-ready cookie settings
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token" 
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  }
}
```

**Action:** Update NextAuth config to match the above if any settings are missing.

---

### Task 1.3: Security Headers Configuration

**Update `next.config.js` with production security headers:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config ...
  
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

**Action:** Add or update the headers section in `next.config.js`.

---

### PHASE 1 COMPLETION REPORT

Output this when Phase 1 is complete:
```
✅ PHASE 1 COMPLETE - SECURITY LOCKDOWN

Admin Routes Secured: [count] routes updated
Auth Helper Created: ✅
NextAuth Config: ✅ Production-ready
Security Headers: ✅ Configured

Critical Issues Found: [count]
Critical Issues Fixed: [count]

NEXT: Proceeding to Phase 2 - Image System Setup
```

---

## PHASE 2: IMAGEKIT + GOOGLE DRIVE SETUP (45 minutes)

### Task 2.1: Google Drive Folder Structure Setup Guide

**Create file:** `docs/GOOGLE-DRIVE-SETUP.md`

```markdown
# Google Drive Product Image Structure

## Folder Hierarchy

Create this structure in your Google Drive:

```
📁 Kollect-It Product Images/
│
├── 📁 01-Antique-Books/
│   ├── 📁 [SKU-001]-first-edition-hemingway/
│   │   ├── 📷 main.jpg (primary listing photo)
│   │   ├── 📷 cover-detail.jpg
│   │   ├── 📷 spine.jpg
│   │   ├── 📷 signature-page.jpg
│   │   └── 📄 METADATA.txt (optional: notes)
│   │
│   └── 📁 [SKU-002]-signed-twain-collection/
│       └── ...
│
├── 📁 02-Fine-Art/
│   ├── 📁 [SKU-101]-french-impressionist-landscape/
│   │   ├── 📷 main.jpg
│   │   ├── 📷 signature-detail.jpg
│   │   ├── 📷 frame-detail.jpg
│   │   ├── 📷 back-provenance.jpg
│   │   └── 📷 uv-light-analysis.jpg
│   │
│   └── ...
│
├── 📁 03-Collectibles/
│   ├── 📁 [SKU-201]-vintage-rolex-submariner/
│   │   ├── 📷 main.jpg
│   │   ├── 📷 face-detail.jpg
│   │   ├── 📷 case-back.jpg
│   │   ├── 📷 movement.jpg
│   │   └── 📷 papers-certificate.jpg
│   │
│   └── ...
│
└── 📁 04-Militaria/
    ├── 📁 [SKU-301]-wwii-medal-collection/
    │   ├── 📷 main.jpg
    │   ├── 📷 individual-medals.jpg
    │   ├── 📷 ribbon-detail.jpg
    │   └── 📷 documentation.jpg
    │
    └── ...
```

## Naming Conventions

### Folder Names
Format: `[SKU-###]-product-name-slug`

Examples:
- `[SKU-042]-signed-picasso-lithograph`
- `[SKU-137]-civil-war-officers-sword`
- `[SKU-299]-first-folio-shakespeare`

### Image File Names

**Required:**
- `main.jpg` - Primary product photo (ALWAYS required)

**Optional (standardized names):**
- `detail-01.jpg`, `detail-02.jpg`, etc. - Additional views
- `signature.jpg` - Artist/maker signature close-up
- `condition.jpg` - Condition/wear details
- `provenance.jpg` - Documentation/certificates
- `back.jpg` - Reverse side
- `hallmark.jpg` - Marks/stamps
- `measurements.jpg` - Size reference with ruler

## Image Requirements

### Technical Specs
- **Format:** JPG or PNG (JPG preferred for photos)
- **Resolution:** Minimum 1500px on longest side
- **File Size:** Under 10MB per image (ImageKit will optimize)
- **Color Space:** sRGB
- **Quality:** High quality, well-lit, neutral background preferred

### Photography Tips
1. **Natural lighting** - Avoid harsh shadows
2. **Neutral background** - White, gray, or black
3. **Multiple angles** - Front, back, sides, details
4. **Scale reference** - Include ruler for size context
5. **Signature/marks** - Close-ups of authentication details
6. **Condition** - Show any wear, damage, repairs clearly

## Manual Setup Steps (One-Time)

### Step 1: Create Root Folder
1. Open Google Drive (https://drive.google.com)
2. Create new folder: "Kollect-It Product Images"
3. Share with yourself (confirm access)

### Step 2: Create Category Folders
Create these 4 folders inside "Kollect-It Product Images":
- 01-Antique-Books
- 02-Fine-Art
- 03-Collectibles
- 04-Militaria

### Step 3: Connect ImageKit to Google Drive

**IN IMAGEKIT DASHBOARD:**
1. Go to: https://imagekit.io/dashboard
2. Navigate to: **External Storage** → **Add Origin**
3. Click: **Google Drive**
4. Authorize: Select your Google account
5. Grant permissions: Allow ImageKit to access Drive
6. Configure origin:
   - **Origin Name:** `google-drive-products`
   - **Root Path:** `/Kollect-It Product Images/`
   - **Include in URL:** No (keeps URLs clean)
7. Click **Save**

### Step 4: Test the Connection

Upload a test image:
1. Create test folder: `Kollect-It Product Images/TEST/`
2. Upload image: `main.jpg`
3. Wait 2-3 minutes for ImageKit sync
4. Test URL in browser:
```
https://ik.imagekit.io/kollectit/TEST/main.jpg
```

If image loads → ✅ Setup successful!

## ImageKit URL Structure

Once configured, images are automatically accessible:

```
Base URL: https://ik.imagekit.io/kollectit/

Category Folder/SKU Folder/Image Name

Examples:
https://ik.imagekit.io/kollectit/01-Antique-Books/SKU-001-hemingway/main.jpg
https://ik.imagekit.io/kollectit/02-Fine-Art/SKU-101-impressionist/signature-detail.jpg
https://ik.imagekit.io/kollectit/03-Collectibles/SKU-201-rolex/face-detail.jpg
```

## Automatic Optimizations (ImageKit)

ImageKit automatically provides:
- ✅ WebP/AVIF conversion for modern browsers
- ✅ Automatic compression (smaller file sizes)
- ✅ Global CDN delivery (fast loading)
- ✅ Responsive image sizes
- ✅ Lazy loading support
- ✅ 99.9% uptime SLA

## Adding New Products (Workflow)

1. **Photograph item** (multiple angles, high quality)
2. **Upload to Google Drive:**
   - Category folder → Create new SKU folder
   - Upload all images (main.jpg + details)
3. **In Admin Dashboard:**
   - Add new product
   - Enter SKU number
   - ImageKit automatically serves images from Drive
4. **Publish** → Images load instantly from CDN

## Troubleshooting

### "Images not loading from ImageKit"
- Wait 5-10 minutes after uploading to Drive (sync delay)
- Check folder path matches exactly (case-sensitive)
- Verify ImageKit origin is connected to correct Drive account
- Test URL directly in browser

### "Image quality poor"
- Re-upload higher resolution source files
- Ensure original is minimum 1500px
- ImageKit will optimize but needs good source material

### "Wrong image displaying"
- Check folder naming matches SKU exactly
- Verify `main.jpg` exists in SKU folder
- Clear ImageKit cache (Dashboard → Purge Cache)

---

**Next Steps:**
1. Create the folder structure in Google Drive (15 minutes)
2. Connect ImageKit to Google Drive (5 minutes)
3. Upload first test product with images (10 minutes)
4. Verify images load from ImageKit CDN (2 minutes)

**Total Time:** ~30 minutes one-time setup
```

**Action:** Create this comprehensive guide file.

---

### Task 2.2: ImageKit Configuration Verification

**Create test script:** `scripts/test-imagekit-connection.ts`

```typescript
import ImageKit from "imagekit"

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""
})

async function testImageKitConnection() {
  console.log("🔍 Testing ImageKit Connection...")
  console.log("━".repeat(50))
  
  // Test 1: List files
  console.log("\n📋 Test 1: Listing files from ImageKit...")
  try {
    const files = await imagekit.listFiles({
      limit: 5
    })
    console.log(`✅ Success! Found ${files.length} files`)
    if (files.length > 0) {
      console.log("First file:", files[0].name)
    }
  } catch (error) {
    console.error("❌ Failed to list files:", error)
  }
  
  // Test 2: Generate URL
  console.log("\n🔗 Test 2: Generating test URL...")
  try {
    const url = imagekit.url({
      path: "/TEST/main.jpg",
      transformation: [{
        width: "400",
        height: "300"
      }]
    })
    console.log("✅ Generated URL:", url)
  } catch (error) {
    console.error("❌ Failed to generate URL:", error)
  }
  
  console.log("\n" + "━".repeat(50))
  console.log("✨ ImageKit connection test complete!")
}

testImageKitConnection()
```

**Action:** 
1. Create this test script
2. Add to `package.json` scripts: `"test:imagekit": "bun run scripts/test-imagekit-connection.ts"`

---

### Task 2.3: Update Product Admin to Support ImageKit URLs

**Find the admin product form** (likely in `src/app/admin/products/new` or similar)

**Ensure it supports these image patterns:**
```typescript
// Image URL can be:
// 1. Full ImageKit URL: https://ik.imagekit.io/kollectit/01-Antique-Books/SKU-001/main.jpg
// 2. Relative path: /01-Antique-Books/SKU-001/main.jpg (will prepend IMAGEKIT_URL_ENDPOINT)
// 3. SKU-based lookup: Will auto-construct from SKU and category

// Helper function to construct ImageKit URLs
function getProductImageUrl(category: string, sku: string, imageName: string = "main.jpg"): string {
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
  const categorySlug = category.toLowerCase().replace(/\s+/g, "-")
  return `${endpoint}/${categorySlug}/${sku}/${imageName}`
}
```

**Action:** Add this helper function to `src/lib/imagekit-helpers.ts` and use it in product forms.

---

### PHASE 2 COMPLETION REPORT

```
✅ PHASE 2 COMPLETE - IMAGE SYSTEM SETUP

Google Drive Guide: ✅ Created (docs/GOOGLE-DRIVE-SETUP.md)
ImageKit Test Script: ✅ Created
Image Helper Functions: ✅ Added
Admin Product Form: ✅ Updated for ImageKit

Manual Step Required (User):
- Create Google Drive folder structure (15 min)
- Connect ImageKit to Google Drive (5 min)
- Upload first test product (10 min)

NEXT: Proceeding to Phase 3 - Database Optimization
```

---

## PHASE 3: DATABASE OPTIMIZATION (30 minutes)

### Task 3.1: Performance Indexes

**Create SQL script:** `sql-scripts/production-indexes.sql`

```sql
-- Production Performance Indexes for Kollect-It Marketplace
-- Execute after initial deployment for optimal query performance

-- Products table optimizations
CREATE INDEX IF NOT EXISTS idx_products_category_status 
  ON "Product"("categoryId", "status");

CREATE INDEX IF NOT EXISTS idx_products_featured_status 
  ON "Product"("featured", "status", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS idx_products_search 
  ON "Product" USING gin(to_tsvector('english', title || ' ' || description));

-- Orders table optimizations
CREATE INDEX IF NOT EXISTS idx_orders_user_status 
  ON "Order"("userId", "status", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS idx_orders_email 
  ON "Order"("customerEmail");

-- AI Generated Products
CREATE INDEX IF NOT EXISTS idx_ai_products_status_date 
  ON "AIGeneratedProduct"("status", "createdAt" DESC);

-- Cart and Wishlist performance
CREATE INDEX IF NOT EXISTS idx_cart_user_updated 
  ON "CartItem"("userId", "updatedAt" DESC);

CREATE INDEX IF NOT EXISTS idx_wishlist_user_created 
  ON "WishlistItem"("userId", "createdAt" DESC);

-- Reviews performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_rating 
  ON "Review"("productId", "rating" DESC, "createdAt" DESC);

-- Full-text search for products (PostgreSQL specific)
CREATE INDEX IF NOT EXISTS idx_products_fulltext 
  ON "Product" 
  USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));
```

**Action:** Create this SQL file.

---

### Task 3.2: Database Health Check Script

**Create:** `scripts/check-database-health.ts`

```typescript
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function checkDatabaseHealth() {
  console.log("🏥 Database Health Check")
  console.log("━".repeat(50))
  
  try {
    // Test 1: Connection
    console.log("\n1️⃣ Testing connection...")
    await prisma.$connect()
    console.log("✅ Connected to database")
    
    // Test 2: Count records
    console.log("\n2️⃣ Counting records...")
    const [users, products, categories, orders] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count()
    ])
    
    console.log(`   Users: ${users}`)
    console.log(`   Products: ${products}`)
    console.log(`   Categories: ${categories}`)
    console.log(`   Orders: ${orders}`)
    
    // Test 3: Check admin user exists
    console.log("\n3️⃣ Checking admin user...")
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    })
    console.log(admin ? "✅ Admin user exists" : "⚠️  No admin user found")
    
    // Test 4: Recent activity
    console.log("\n4️⃣ Recent activity...")
    const recentProducts = await prisma.product.findMany({
      take: 1,
      orderBy: { createdAt: "desc" }
    })
    if (recentProducts.length > 0) {
      console.log(`   Latest product: ${recentProducts[0].title}`)
    }
    
    // Test 5: Database size estimate
    console.log("\n5️⃣ Performance check...")
    const start = Date.now()
    await prisma.product.findMany({ take: 10 })
    const end = Date.now()
    console.log(`   Query time: ${end - start}ms`)
    
    console.log("\n" + "━".repeat(50))
    console.log("✨ Database health check complete!")
    
  } catch (error) {
    console.error("❌ Database health check failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabaseHealth()
```

**Action:** 
1. Create this script
2. Add to package.json: `"db:health": "bun run scripts/check-database-health.ts"`
3. Run it to verify current database state

---

### Task 3.3: Seed Data Verification

**Update:** `prisma/seed.ts` to be idempotent (safe to run multiple times)

```typescript
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")
  console.log("⚠️  Running in development mode only")
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { email: "admin@kollect-it.com" }
  })
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10)
    await prisma.user.create({
      data: {
        email: "admin@kollect-it.com",
        password: hashedPassword,
        name: "Admin User",
        role: "ADMIN"
      }
    })
    console.log("✅ Admin user created: admin@kollect-it.com")
  } else {
    console.log("ℹ️  Admin user already exists")
  }
  
  // Check and create categories
  const categories = [
    {
      name: "Antique Books",
      slug: "antique-books",
      description: "Rare first editions, signed copies, and collectible manuscripts",
      image: "/images/categories/antique-books.jpg"
    },
    {
      name: "Fine Art",
      slug: "fine-art",
      description: "Original paintings, prints, and sculptures from recognized artists",
      image: "/images/categories/fine-art.jpg"
    },
    {
      name: "Collectibles",
      slug: "collectibles",
      description: "Vintage watches, jewelry, coins, and other valuable collectibles",
      image: "/images/categories/collectibles.jpg"
    },
    {
      name: "Militaria",
      slug: "militaria",
      description: "Historical military artifacts, medals, and memorabilia",
      image: "/images/categories/militaria.jpg"
    }
  ]
  
  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug }
    })
    
    if (!existing) {
      await prisma.category.create({ data: category })
      console.log(`✅ Category created: ${category.name}`)
    } else {
      console.log(`ℹ️  Category already exists: ${category.name}`)
    }
  }
  
  console.log("✨ Seed complete!")
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**Action:** Update seed.ts to be idempotent (won't fail if data already exists).

---

### PHASE 3 COMPLETION REPORT

```
✅ PHASE 3 COMPLETE - DATABASE OPTIMIZATION

Performance Indexes: ✅ SQL script created
Health Check Script: ✅ Created
Seed Data: ✅ Updated (idempotent)
Database Status: [X] users, [Y] products, [Z] categories

NEXT: Proceeding to Phase 4 - Build & Performance
```

---

## PHASE 4: BUILD & PERFORMANCE OPTIMIZATION (45 minutes)

### Task 4.1: Production Build Configuration

**Update `next.config.js` for optimal production builds:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/kollectit/**"
      }
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"]
    } : false
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"]
  },
  
  // Security headers (from Phase 1)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
        ]
      }
    ]
  },
  
  // Redirect configuration
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/dashboard",
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
```

**Action:** Update next.config.js with these optimizations.

---

### Task 4.2: Performance Testing Script

**Create:** `scripts/test-performance.ts`

```typescript
async function testPerformance() {
  console.log("⚡ Performance Test Suite")
  console.log("━".repeat(50))
  
  const tests = [
    { name: "Homepage", url: "/" },
    { name: "Products Listing", url: "/products" },
    { name: "Product Detail", url: "/products/first-product" },
    { name: "Cart Page", url: "/cart" },
    { name: "Admin Login", url: "/admin/login" }
  ]
  
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  
  for (const test of tests) {
    console.log(`\n📊 Testing: ${test.name}`)
    const start = Date.now()
    
    try {
      const response = await fetch(`${baseUrl}${test.url}`)
      const end = Date.now()
      const time = end - start
      
      const status = time < 500 ? "✅" : time < 1000 ? "⚠️" : "❌"
      console.log(`   ${status} ${time}ms (Status: ${response.status})`)
      
    } catch (error) {
      console.log(`   ❌ Failed: ${error}`)
    }
  }
  
  console.log("\n" + "━".repeat(50))
  console.log("✨ Performance tests complete!")
}

testPerformance()
```

**Action:** Create this script and add to package.json.

---

### Task 4.3: Production Build Test

**Create:** `scripts/build-and-verify.ps1`

```powershell
#!/usr/bin/env pwsh
# Production Build Verification Script

Write-Host "🔨 Production Build Verification" -ForegroundColor Cyan
Write-Host "=" * 50

# Step 1: Clean previous builds
Write-Host "`n1️⃣ Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "   ✅ Cleaned .next directory" -ForegroundColor Green
}

# Step 2: Run TypeScript check
Write-Host "`n2️⃣ TypeScript check..." -ForegroundColor Yellow
bunx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ TypeScript errors found!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ TypeScript passed" -ForegroundColor Green

# Step 3: Run linting
Write-Host "`n3️⃣ Linting check..." -ForegroundColor Yellow
bunx eslint . --max-warnings=0
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Linting errors found!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Linting passed" -ForegroundColor Green

# Step 4: Build for production
Write-Host "`n4️⃣ Building for production..." -ForegroundColor Yellow
$buildStart = Get-Date
bun run build
$buildEnd = Get-Date
$buildTime = ($buildEnd - $buildStart).TotalSeconds

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Build successful in $buildTime seconds" -ForegroundColor Green

# Step 5: Check build output size
Write-Host "`n5️⃣ Analyzing build output..." -ForegroundColor Yellow
$buildSize = (Get-ChildItem -Path ".next" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "   📦 Build size: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Cyan

Write-Host "`n" + "=" * 50
Write-Host "✨ Build verification complete!" -ForegroundColor Green
Write-Host "`nReady for production deployment! 🚀" -ForegroundColor Cyan
```

**Action:** Create this PowerShell script for build verification.

---

### PHASE 4 COMPLETION REPORT

```
✅ PHASE 4 COMPLETE - BUILD & PERFORMANCE

Next.js Config: ✅ Optimized for production
Performance Tests: ✅ Script created
Build Verification: ✅ Script created
Production Build: ✅ [X] seconds, [Y] MB

NEXT: Proceeding to Phase 5 - Deployment Preparation
```

---

## PHASE 5: PRODUCTION DEPLOYMENT SETUP (90 minutes)

### Task 5.1: Environment Variables Production Template

**Create:** `.env.production.template`

```bash
# ============================================
# PRODUCTION ENVIRONMENT VARIABLES TEMPLATE
# ============================================
# Copy this file and update with PRODUCTION values
# DO NOT commit the actual .env.production file!

# ============================================
# APPLICATION
# ============================================
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://kollect-it.com
NEXTAUTH_URL=https://kollect-it.com

# ============================================
# NEXTAUTH SECRET (Generate new for production!)
# ============================================
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=GENERATE_NEW_SECRET_HERE_32_CHARS_MINIMUM

# ============================================
# DATABASE (Supabase Production)
# ============================================
# Pooled connection for app queries (port 6543)
DATABASE_URL="postgresql://postgres:YOUR_PROD_PASSWORD@db.xqrroyyqrgdytzpcckwk.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct connection for migrations (port 5432)
DIRECT_URL="postgresql://postgres:YOUR_PROD_PASSWORD@db.xqrroyyqrgdytzpcckwk.supabase.co:5432/postgres"

# ============================================
# STRIPE (SWITCH TO LIVE KEYS!)
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_WEBHOOK_SECRET

# ============================================
# IMAGEKIT (Same as development)
# ============================================
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_VXQqaBamg3i1ic8FzAFrQa78=
IMAGEKIT_PRIVATE_KEY=private_3E7KSDvS2hdYlhqDbfOga4VTR2I=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit

# ============================================
# EMAIL (Choose: Resend OR Google Workspace)
# ============================================

# Option 1: Resend (Recommended for transactional)
RESEND_API_KEY=re_YOUR_API_KEY_HERE
EMAIL_FROM="Kollect-It <orders@kollect-it.com>"
ADMIN_EMAIL="admin@kollect-it.com"

# Option 2: Google Workspace SMTP (Alternative)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=orders@kollect-it.com
# SMTP_PASSWORD=your_app_specific_password
# EMAIL_FROM="Kollect-It <orders@kollect-it.com>"
# ADMIN_EMAIL="admin@kollect-it.com"

# ============================================
# GOOGLE DRIVE (Optional - for product sync)
# ============================================
GOOGLE_DRIVE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=your_drive_folder_id

# ============================================
# ANALYTICS & MONITORING (Optional)
# ============================================
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

**Action:** Create this template file.

---

### Task 5.2: Vercel Deployment Guide

**Create:** `docs/VERCEL-DEPLOYMENT-GUIDE.md`

```markdown
# Vercel Production Deployment Guide

## Prerequisites Checklist

Before deploying, ensure you have:

- [x] GitHub repository with latest code
- [x] Vercel account (sign up at https://vercel.com)
- [x] Production environment variables ready
- [x] Domain DNS access (kollect-it.com)
- [x] Stripe account with live keys (if going live immediately)

## Step-by-Step Deployment

### Step 1: Prepare GitHub Repository

```powershell
# Ensure all changes are committed
git add .
git commit -m "Production ready - deploying to Vercel"
git push origin main
```

### Step 2: Connect Vercel to GitHub

1. Go to: https://vercel.com/signup
2. Choose: **Continue with GitHub**
3. Authorize Vercel to access your repositories

### Step 3: Import Project

1. Click: **Add New... → Project**
2. Find: `kollect-it-marketplace-1` (or your repo name)
3. Click: **Import**

### Step 4: Configure Project

**Framework Preset:** Next.js (should auto-detect)

**Root Directory:** Leave as `.` (root)

**Build Settings:** (Auto-configured, but verify)
- Build Command: `bun run build` or `next build`
- Output Directory: `.next`
- Install Command: `bun install` or `npm install`

**Environment Variables:** Click **Add** for each variable from `.env.production.template`

**CRITICAL VARIABLES TO ADD:**

```
NODE_ENV=production
NEXTAUTH_URL=https://your-project.vercel.app (temporary, update after domain)
NEXTAUTH_SECRET=[generate new with: openssl rand -base64 32]
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_ for testing)
STRIPE_SECRET_KEY=sk_live_... (or sk_test_)
STRIPE_WEBHOOK_SECRET=whsec_... (get from Stripe after setup)
IMAGEKIT_PRIVATE_KEY=private_...
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_...
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit
RESEND_API_KEY=re_... (if using Resend)
EMAIL_FROM=Kollect-It <orders@kollect-it.com>
ADMIN_EMAIL=admin@kollect-it.com
```

### Step 5: Deploy

1. Click: **Deploy**
2. Wait 2-3 minutes for build
3. ✅ Your site is live at: `https://your-project.vercel.app`

### Step 6: Test Deployment

Visit your Vercel URL and test:
- Homepage loads
- Products page works
- Admin login accessible (https://your-project.vercel.app/admin/login)
- Images load from ImageKit

### Step 7: Configure Custom Domain (kollect-it.com)

**Option A: DNS Only (Faster - Recommended First)**

1. In Vercel Dashboard: **Settings** → **Domains**
2. Add domain: `kollect-it.com`
3. Add www subdomain: `www.kollect-it.com`
4. Vercel provides DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

5. **At Bluehost DNS Manager:**
   - Login to Bluehost
   - Go to: Domains → kollect-it.com → DNS Management
   - **Delete old A records** pointing to Bluehost servers
   - **Add new records** from Vercel (above)
   - Save changes

6. **Wait for DNS propagation:** 1-24 hours (usually < 1 hour)

7. **Update Vercel environment variables:**
   - Change `NEXTAUTH_URL` from `https://your-project.vercel.app` to `https://kollect-it.com`
   - Save and redeploy (automatic)

**Option B: Full Domain Transfer (Later)**

After DNS pointing works:
1. Unlock domain at Bluehost
2. Get EPP/Auth code from Bluehost
3. In Vercel: Settings → Domains → Transfer
4. Enter EPP code
5. Wait 5-7 days for transfer
6. Cancel Bluehost after transfer completes

### Step 8: Configure Stripe Webhooks

1. Go to: https://dashboard.stripe.com/webhooks
2. Click: **Add endpoint**
3. Endpoint URL: `https://kollect-it.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click: **Add endpoint**
6. Copy webhook signing secret (starts with `whsec_`)
7. Update Vercel environment variable: `STRIPE_WEBHOOK_SECRET`

### Step 9: Test Production

**Critical Tests:**
- [ ] Homepage loads
- [ ] Product browsing works
- [ ] Search functionality
- [ ] Add to cart
- [ ] Checkout flow (use test card: 4242 4242 4242 4242)
- [ ] Order confirmation email sent
- [ ] Admin login works
- [ ] Admin dashboard accessible
- [ ] Images load from ImageKit CDN

### Step 10: Switch to Stripe Live Mode (When Ready)

⚠️ **Only do this when fully tested and ready for real payments!**

1. Get live keys from: https://dashboard.stripe.com/apikeys
2. Update Vercel environment variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
   - `STRIPE_SECRET_KEY=sk_live_...`
3. Update webhook to live mode endpoint
4. Test with real card (small amount)
5. ✅ Go live!

## Troubleshooting

### "Build failed"
- Check Vercel build logs for specific error
- Verify all environment variables are set
- Ensure DATABASE_URL is accessible from Vercel (check Supabase IP whitelist)

### "Images not loading"
- Verify ImageKit environment variables
- Check ImageKit dashboard for usage/limits
- Ensure images exist in Google Drive folder

### "Database connection failed"
- Verify DATABASE_URL and DIRECT_URL are correct
- Check Supabase connection pooler is enabled
- Ensure Vercel IP is whitelisted in Supabase (or use "Allow all" for ease)

### "Checkout not working"
- Verify Stripe keys are correct (test vs live)
- Check webhook secret is configured
- View Stripe dashboard logs for errors

### "Custom domain not working"
- Wait 24 hours for DNS propagation
- Check DNS records are correctly configured
- Use https://dnschecker.org to verify propagation

## Production Maintenance

### Viewing Logs
- Vercel Dashboard → Your Project → Deployments → [Latest] → Logs

### Rolling Back
- Vercel Dashboard → Deployments → [Previous Working] → Promote to Production

### Updating Environment Variables
- Settings → Environment Variables → Edit → Save (triggers redeploy)

### Monitoring
- Vercel Dashboard → Analytics (free tier)
- Consider: Sentry for error tracking

---

**Total Deployment Time:** ~30 minutes (excluding DNS propagation wait)
```

**Action:** Create this comprehensive deployment guide.

---

### Task 5.3: Pre-Deployment Checklist

**Create:** `PRODUCTION-DEPLOYMENT-CHECKLIST.md`

```markdown
# 🚀 Production Deployment Checklist

Use this checklist before deploying to production.

## Phase 1: Code Quality ✅

- [ ] All TypeScript errors resolved (`bun run typecheck`)
- [ ] All ESLint warnings resolved (`bun run lint`)
- [ ] Production build succeeds (`bun run build`)
- [ ] No console.log statements in production code
- [ ] All TODO comments addressed or documented

## Phase 2: Security 🔒

- [ ] All admin routes have authentication checks
- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] No secrets committed to Git
- [ ] .env.local is in .gitignore
- [ ] Security headers configured in next.config.js
- [ ] CORS properly configured (no wildcard origins)
- [ ] Rate limiting implemented on sensitive endpoints

## Phase 3: Database 🗄️

- [ ] Prisma schema is up to date
- [ ] Migrations are applied (`bunx prisma migrate deploy`)
- [ ] Admin user exists in production database
- [ ] Categories seeded
- [ ] Database backups configured (Supabase automatic)
- [ ] Performance indexes created (run sql-scripts/production-indexes.sql)

## Phase 4: External Services 🔌

### Stripe
- [ ] Stripe account verified
- [ ] Test mode keys working
- [ ] Webhooks configured (test mode)
- [ ] Live mode keys ready (for when going live)
- [ ] Webhook endpoint secured

### ImageKit
- [ ] ImageKit account active
- [ ] Google Drive connected to ImageKit
- [ ] Test images loading from CDN
- [ ] Bandwidth limits understood (20GB/month free)

### Email (Resend)
- [ ] Resend account verified
- [ ] API key obtained
- [ ] Domain verified in Resend (for production emails)
- [ ] Test email sent successfully
- [ ] From address configured

### Google Drive (Optional)
- [ ] Service account created
- [ ] Drive API enabled
- [ ] Credentials configured in .env
- [ ] Test folder access working

## Phase 5: Environment Variables 🔧

- [ ] All required variables in Vercel
- [ ] NEXTAUTH_URL set to production domain
- [ ] DATABASE_URL uses connection pooling (port 6543)
- [ ] DIRECT_URL uses direct connection (port 5432)
- [ ] Stripe keys appropriate for environment
- [ ] No test/placeholder values in production

## Phase 6: Domain & DNS 🌐

- [ ] Domain ownership confirmed
- [ ] DNS access available
- [ ] SSL certificate will auto-provision (Vercel handles this)
- [ ] www subdomain configured
- [ ] DNS records ready to update

## Phase 7: Testing 🧪

- [ ] Homepage loads correctly
- [ ] Product browsing works
- [ ] Search functionality operational
- [ ] Cart operations successful
- [ ] Checkout flow complete (test mode)
- [ ] Order confirmation emails sent
- [ ] Admin login accessible
- [ ] Admin dashboard functional
- [ ] Mobile responsive verified
- [ ] Performance acceptable (Lighthouse > 80)

## Phase 8: Documentation 📚

- [ ] README.md updated with production info
- [ ] API documentation current
- [ ] Deployment guide accessible
- [ ] Troubleshooting guide available
- [ ] Contact information updated

## Phase 9: Monitoring & Backups 📊

- [ ] Error tracking configured (Sentry, LogRocket, or Vercel)
- [ ] Analytics setup (Google Analytics, Plausible, etc.)
- [ ] Database backups automated (Supabase)
- [ ] Uptime monitoring (optional: UptimeRobot, Pingdom)

## Phase 10: Go Live 🎉

- [ ] Final code review completed
- [ ] Stakeholders notified of deployment
- [ ] Support channels ready
- [ ] Rollback plan documented
- [ ] Post-deployment monitoring plan

---

## Quick Pre-Deploy Command Sequence

Run these in order:

```powershell
# 1. Clean install
bun install

# 2. Generate Prisma client
bunx prisma generate

# 3. Type check
bunx tsc --noEmit

# 4. Lint
bunx eslint . --max-warnings=0

# 5. Build test
bun run build

# 6. Database health check
bun run db:health

# 7. Run tests (if you have them)
bun test

# If all pass → Ready to deploy! 🚀
```

---

## Post-Deployment Verification

After deploying:

```powershell
# Test production URL
curl https://kollect-it.com

# Check admin access
# Visit: https://kollect-it.com/admin/login

# Test API endpoint
curl https://kollect-it.com/api/health

# Monitor logs
# Vercel Dashboard → Logs
```

---

## Emergency Rollback

If something goes wrong:

1. **Vercel Dashboard** → Deployments
2. Find last working deployment
3. Click **"..."** → **Promote to Production**
4. Verify rollback successful
5. Investigate issue before re-deploying

---

**Remember:** Better to catch issues before deployment than debug in production!
```

**Action:** Create this comprehensive checklist.

---

### PHASE 5 COMPLETION REPORT

```
✅ PHASE 5 COMPLETE - DEPLOYMENT PREPARATION

Environment Template: ✅ Created (.env.production.template)
Vercel Guide: ✅ Created (docs/VERCEL-DEPLOYMENT-GUIDE.md)
Pre-Deploy Checklist: ✅ Created
Production Scripts: ✅ Ready

Manual Steps Required (User):
1. Create Vercel account (5 min)
2. Import GitHub repository (3 min)
3. Add environment variables (10 min)
4. Deploy and test (15 min)
5. Configure domain DNS (5 min + propagation wait)

NEXT: Proceeding to Phase 6 - Final Documentation
```

---

## PHASE 6: FINAL DOCUMENTATION & AUTOMATION (30 minutes)

### Task 6.1: Master Deployment Script

**Create:** `scripts/deploy-to-production.ps1`

```powershell
#!/usr/bin/env pwsh
# Master Production Deployment Script
# Automates pre-deployment checks and guides through deployment

param(
    [switch]$SkipTests,
    [switch]$SkipBuild
)

Write-Host "🚀 Kollect-It Production Deployment" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""

# Step 1: Verify we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: Not in project root directory!" -ForegroundColor Red
    exit 1
}

# Step 2: Verify Git is clean
Write-Host "1️⃣ Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  Warning: Uncommitted changes detected!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Uncommitted files:"
    git status --short
    Write-Host ""
    $response = Read-Host "Continue anyway? (yes/no)"
    if ($response -ne "yes") {
        Write-Host "Deployment cancelled." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ✅ Git status clean" -ForegroundColor Green
}

# Step 3: Install dependencies
Write-Host "`n2️⃣ Installing dependencies..." -ForegroundColor Yellow
bun install
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Dependency installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Dependencies installed" -ForegroundColor Green

# Step 4: Generate Prisma client
Write-Host "`n3️⃣ Generating Prisma client..." -ForegroundColor Yellow
bunx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Prisma generation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Prisma client generated" -ForegroundColor Green

# Step 5: Type checking
if (!$SkipTests) {
    Write-Host "`n4️⃣ Running TypeScript check..." -ForegroundColor Yellow
    bunx tsc --noEmit
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ TypeScript errors found!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Fix TypeScript errors before deploying." -ForegroundColor Red
        exit 1
    }
    Write-Host "   ✅ TypeScript check passed" -ForegroundColor Green
}

# Step 6: Linting
if (!$SkipTests) {
    Write-Host "`n5️⃣ Running linter..." -ForegroundColor Yellow
    bunx eslint . --max-warnings=0
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ Linting errors found!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Fix linting errors before deploying." -ForegroundColor Red
        exit 1
    }
    Write-Host "   ✅ Linting passed" -ForegroundColor Green
}

# Step 7: Production build test
if (!$SkipBuild) {
    Write-Host "`n6️⃣ Testing production build..." -ForegroundColor Yellow
    $buildStart = Get-Date
    bun run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ Production build failed!" -ForegroundColor Red
        exit 1
    }
    $buildEnd = Get-Date
    $buildTime = [math]::Round(($buildEnd - $buildStart).TotalSeconds, 2)
    Write-Host "   ✅ Build successful in $buildTime seconds" -ForegroundColor Green
}

# Step 8: Database health check
Write-Host "`n7️⃣ Checking database health..." -ForegroundColor Yellow
bun run db:health
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ⚠️  Database health check failed (non-critical)" -ForegroundColor Yellow
}

# Step 9: Pre-deployment summary
Write-Host ""
Write-Host "=" * 60
Write-Host "✨ PRE-DEPLOYMENT CHECKS COMPLETE!" -ForegroundColor Green
Write-Host "=" * 60
Write-Host ""

Write-Host "📋 Ready for Production Deployment" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Commit and push to GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Production ready'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy to Vercel:" -ForegroundColor White
Write-Host "   • Visit: https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "   • Import your GitHub repository" -ForegroundColor Gray
Write-Host "   • Add environment variables (see .env.production.template)" -ForegroundColor Gray
Write-Host "   • Click Deploy" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Configure domain (kollect-it.com):" -ForegroundColor White
Write-Host "   • Add domain in Vercel settings" -ForegroundColor Gray
Write-Host "   • Update DNS records at Bluehost" -ForegroundColor Gray
Write-Host "   • Wait for DNS propagation (1-24 hours)" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Test production deployment:" -ForegroundColor White
Write-Host "   • Homepage loads" -ForegroundColor Gray
Write-Host "   • Admin login works" -ForegroundColor Gray
Write-Host "   • Checkout flow complete" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "• Full deployment guide: docs/VERCEL-DEPLOYMENT-GUIDE.md" -ForegroundColor Gray
Write-Host "• Deployment checklist: PRODUCTION-DEPLOYMENT-CHECKLIST.md" -ForegroundColor Gray
Write-Host ""

$response = Read-Host "Open deployment documentation now? (yes/no)"
if ($response -eq "yes") {
    code "docs/VERCEL-DEPLOYMENT-GUIDE.md"
}

Write-Host ""
Write-Host "🚀 Good luck with your deployment!" -ForegroundColor Green
```

**Action:** Create this master deployment automation script.

---

### Task 6.2: Quick Reference Guide

**Create:** `QUICK-REFERENCE.md`

```markdown
# ⚡ Quick Reference Guide

## Common Commands

### Development
```powershell
bun run dev              # Start dev server (localhost:3000)
bun run build            # Test production build
bun run start            # Start production server locally
```

### Database
```powershell
bunx prisma studio       # Open database GUI
bunx prisma generate     # Generate Prisma client
bunx prisma db push      # Push schema changes
bun run db:seed          # Seed database
bun run db:health        # Check database health
```

### Testing & Quality
```powershell
bunx tsc --noEmit        # Type check
bunx eslint .            # Lint code
bun test                 # Run tests (if configured)
```

### Deployment
```powershell
.\scripts\deploy-to-production.ps1    # Run pre-deploy checks
git push origin main                   # Deploy (if Vercel connected)
```

## Environment Variables

### Local Development (.env.local)
```bash
DATABASE_URL=postgresql://...   # Supabase pooled connection
DIRECT_URL=postgresql://...     # Supabase direct connection
NEXTAUTH_SECRET=...             # Generate: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...   # Test mode
IMAGEKIT_PRIVATE_KEY=private_...
```

### Production (Vercel)
Same as local but:
- NEXTAUTH_URL=https://kollect-it.com
- STRIPE_SECRET_KEY=sk_live_... (when ready for live payments)
- NODE_ENV=production

## Important URLs

### Development
- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login
- Prisma Studio: http://localhost:5555 (after `bunx prisma studio`)

### Production
- Site: https://kollect-it.com
- Admin: https://kollect-it.com/admin/login
- Vercel Dashboard: https://vercel.com/dashboard

### External Services
- Supabase: https://supabase.com/dashboard
- Stripe: https://dashboard.stripe.com
- ImageKit: https://imagekit.io/dashboard
- Resend: https://resend.com/dashboard

## Admin Credentials

### Development
- Email: admin@kollect-it.com
- Password: admin123

### Production
- Email: admin@kollect-it.com
- Password: [Set secure password in production!]

## Test Payment Card (Stripe Test Mode)

```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

## Troubleshooting

### "Module not found" errors
```powershell
rm -rf node_modules bun.lockb
bun install
bunx prisma generate
```

### "Database connection failed"
- Check DATABASE_URL in .env.local
- Verify Supabase database is running
- Check IP whitelist in Supabase

### "Build failed"
```powershell
bunx tsc --noEmit      # Check TypeScript errors
bunx eslint .          # Check linting errors
rm -rf .next           # Clear build cache
bun run build          # Try again
```

### "Images not loading"
- Check ImageKit environment variables
- Verify images exist in Google Drive
- Check ImageKit dashboard for errors

## File Locations

### Configuration
- next.config.js - Next.js configuration
- tsconfig.json - TypeScript configuration
- tailwind.config.ts - Tailwind CSS configuration
- prisma/schema.prisma - Database schema

### Key Directories
- src/app - Next.js app router pages
- src/components - React components
- src/lib - Utility functions
- src/app/api - API routes
- prisma - Database schema and migrations
- public - Static assets
- docs - Documentation

### Important Files
- .env.local - Local environment variables
- .gitignore - Git ignore rules
- package.json - Dependencies and scripts
- README.md - Project documentation

## Git Workflow

```powershell
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Pull latest
git pull origin main

# Create new branch
git checkout -b feature/new-feature

# Merge branch
git checkout main
git merge feature/new-feature
```

## Support

### Documentation
- Full docs: /docs directory
- Deployment guide: docs/VERCEL-DEPLOYMENT-GUIDE.md
- Environment vars: docs/ENVIRONMENT_VARIABLES.md

### Getting Help
- Check docs folder first
- Review error logs in Vercel dashboard
- Check external service dashboards (Stripe, Supabase, etc.)

---

**Pro Tip:** Bookmark this file for quick access to commands and URLs!
```

**Action:** Create this quick reference guide.

---

### PHASE 6 COMPLETION REPORT

```
✅ PHASE 6 COMPLETE - FINAL DOCUMENTATION

Master Deploy Script: ✅ Created (scripts/deploy-to-production.ps1)
Quick Reference: ✅ Created (QUICK-REFERENCE.md)
All Guides: ✅ Complete
All Scripts: ✅ Ready

READY FOR DEPLOYMENT! 🚀
```

---

## 🎉 FINAL AUTONOMOUS EXECUTION REPORT

When ALL phases are complete, output this comprehensive report:

```
╔══════════════════════════════════════════════════════════╗
║  🎉 KOLLECT-IT MARKETPLACE - DEPLOYMENT READY 🎉          ║
╚══════════════════════════════════════════════════════════╝

OVERALL STATUS: ✅ PRODUCTION READY

═══════════════════════════════════════════════════════════
PHASE COMPLETION SUMMARY:
═══════════════════════════════════════════════════════════

✅ Phase 1: Security Lockdown         [COMPLETE]
   • [X] admin routes secured
   • Auth helper created
   • NextAuth production-ready
   • Security headers configured

✅ Phase 2: Image System Setup         [COMPLETE]
   • Google Drive guide created
   • ImageKit integration documented
   • Test scripts created

✅ Phase 3: Database Optimization      [COMPLETE]
   • Performance indexes scripted
   • Health check created
   • Seed data made idempotent

✅ Phase 4: Build & Performance        [COMPLETE]
   • Next.js config optimized
   • Performance tests created
   • Build verification script ready

✅ Phase 5: Deployment Preparation     [COMPLETE]
   • Environment template created
   • Vercel deployment guide complete
   • Pre-deployment checklist ready

✅ Phase 6: Final Documentation        [COMPLETE]
   • Master deploy script created
   • Quick reference guide complete
   • All documentation finalized

═══════════════════════════════════════════════════════════
CRITICAL FILES CREATED:
═══════════════════════════════════════════════════════════

📄 Security:
   • src/lib/auth-helpers.ts
   • Updated: src/app/api/admin/**/route.ts (all files)

📄 Documentation:
   • docs/GOOGLE-DRIVE-SETUP.md
   • docs/VERCEL-DEPLOYMENT-GUIDE.md
   • PRODUCTION-DEPLOYMENT-CHECKLIST.md
   • QUICK-REFERENCE.md
   • .env.production.template

📄 Scripts:
   • scripts/test-imagekit-connection.ts
   • scripts/check-database-health.ts
   • scripts/test-performance.ts
   • scripts/build-and-verify.ps1
   • scripts/deploy-to-production.ps1

📄 Database:
   • sql-scripts/production-indexes.sql
   • Updated: prisma/seed.ts (idempotent)

═══════════════════════════════════════════════════════════
MANUAL STEPS REMAINING (~ 60 minutes total):
═══════════════════════════════════════════════════════════

1. 📁 Google Drive Setup (20 min)
   • Create folder structure
   • Connect ImageKit to Drive
   • Upload test images
   → Guide: docs/GOOGLE-DRIVE-SETUP.md

2. 🚀 Vercel Deployment (25 min)
   • Create Vercel account
   • Import GitHub repository
   • Add environment variables
   • Deploy project
   → Guide: docs/VERCEL-DEPLOYMENT-GUIDE.md

3. 🌐 Domain Configuration (10 min)
   • Update Bluehost DNS
   • Wait for propagation
   → Guide: docs/VERCEL-DEPLOYMENT-GUIDE.md (Step 7)

4. 🧪 Production Testing (15 min)
   • Test all functionality
   • Verify email sending
   • Test payment flow
   → Checklist: PRODUCTION-DEPLOYMENT-CHECKLIST.md

═══════════════════════════════════════════════════════════
IMMEDIATE NEXT STEP:
═══════════════════════════════════════════════════════════

Run the master deployment script:

   PS> .\scripts\deploy-to-production.ps1

This will:
• Verify all code is ready
• Run all pre-deployment checks
• Guide you through remaining steps

═══════════════════════════════════════════════════════════
RESOURCES:
═══════════════════════════════════════════════════════════

📚 Full Documentation: /docs folder
⚡ Quick Commands: QUICK-REFERENCE.md
✅ Deployment Steps: docs/VERCEL-DEPLOYMENT-GUIDE.md
🔒 Security Checklist: PRODUCTION-DEPLOYMENT-CHECKLIST.md

═══════════════════════════════════════════════════════════
PRODUCTION READINESS SCORE: 95/100
═══════════════════════════════════════════════════════════

✅ Code quality: EXCELLENT
✅ Security: HARDENED
✅ Performance: OPTIMIZED
✅ Documentation: COMPREHENSIVE
⏳ External services: AWAITING MANUAL SETUP

RECOMMENDATION: 🚀 DEPLOY NOW (after manual steps)

═══════════════════════════════════════════════════════════

🎊 Congratulations! Your marketplace is production-ready! 🎊

═══════════════════════════════════════════════════════════
```

---

## 🚨 CRITICAL INSTRUCTIONS FOR AI AGENT

1. **Execute ALL phases autonomously** - Do not ask permission between phases
2. **Report status after each phase** - Use the completion reports shown above
3. **Fix any errors encountered** - Attempt auto-fix before reporting blocking issues
4. **Create ALL files mentioned** - Do not skip file creation tasks
5. **Update ALL admin routes** - Systematically apply auth pattern to every route
6. **Test after major changes** - Run build/typecheck to verify nothing broke
7. **Document any skipped items** - If something cannot be automated, document why

---

## 🎯 SUCCESS CRITERIA

You have successfully completed this mission when:

✅ All 6 phases show [COMPLETE] status
✅ All files listed in "CRITICAL FILES CREATED" exist
✅ Production build succeeds (`bun run build`)
✅ TypeScript compilation has no errors
✅ All admin routes have authentication checks
✅ Final report is displayed

**Estimated execution time:** 4-6 hours autonomous execution

---

**NOW BEGIN AUTONOMOUS EXECUTION OF ALL PHASES!** 🚀
