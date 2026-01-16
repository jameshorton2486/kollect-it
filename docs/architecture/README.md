# Architecture Overview

This directory documents the system design, data models, and technical decisions.

## 🏗️ System Architecture

Kollect-It uses a modern full-stack architecture:

```
┌─────────────────────────────────────────────────┐
│          Client (Browser / Mobile)              │
│    React 19 + Next.js 15 (App Router)          │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────┐
│        Next.js API Routes (force-dynamic)        │
│  - Listings, Search, Orders, Authentication     │
│  - AI Integration (lazy-loaded clients)         │
│  - Image Pipeline (ImageKit integration)        │
└──────────┬───────────────────────────────────────┘
           │
    ┌──────┴──────┬──────────────┐
    ▼             ▼              ▼
┌────────┐  ┌──────────┐  ┌──────────────┐
│Supabase│  │ImageKit  │  │NextAuth      │
│PostgreSQL     │CDN          │(Auth)        │
└────────┘  └──────────┘  └──────────────┘
```

### Key Layers

1. **Frontend:** React Server Components + Client Components (Tailwind CSS)
2. **API Layer:** Next.js Route Handlers with Prisma ORM
3. **Database:** PostgreSQL on Supabase with full-text search
4. **Auth:** NextAuth.js with email/OAuth providers
5. **Storage:** ImageKit for image uploads, normalization, and CDN

## 📊 Data Model

See `prisma/schema.prisma` for the complete schema.

### Core Entities

- **Users:** Sellers, buyers, admins
- **Listings:** Marketplace items with SKU, category, condition
- **Categories:** Hierarchical taxonomy (Antiques, Collectibles, etc.)
- **Orders:** Purchase history with escrow status
- **Reviews:** Seller and item reviews
- **Images:** Item images with variants and CDN URLs

### Key Relationships

```
User (seller/buyer)
├── Listings (items they own/sell)
│   ├── Images (from ImageKit)
│   ├── Category (hierarchical)
│   └── Reviews (from buyers)
├── Orders (as seller or buyer)
│   └── Order Items (many-to-many)
└── Reviews (reputation)
```

## 🛣️ API Routes

All API routes are in `src/app/api/`.

### Marketplace Routes

- `GET /api/listings` – List marketplace items
- `POST /api/listings` – Create listing (authenticated seller)
- `GET /api/listings/[id]` – Get listing details
- `GET /api/categories` – List product categories
- `GET /api/search` – Full-text search

### Order Routes

- `POST /api/orders` – Create order
- `GET /api/orders/[id]` – Get order status
- `PATCH /api/orders/[id]` – Update order (escrow handling)

### Authentication

- `POST /api/auth/signin` – Sign in (NextAuth.js)
- `POST /api/auth/signup` – Register (NextAuth.js)
- `GET /api/auth/session` – Current user session

## 🎯 Design Patterns

### Server Components vs Client Components

**Server Components (preferred):**
- Fetch data directly
- Use Prisma in components
- No waterfall requests
- Example: Listing details page

**Client Components (when needed):**
- Real-time filtering
- Client-side search
- Image galleries
- Form interactions

### Data Fetching

```typescript
// ✅ Server Component
export default async function ListingPage({ params }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id }
  });
  return <ListingDetail listing={listing} />;
}

// ❌ Avoid: API + Client Fetch waterfall
// Use Server Component instead
```

### Lazy-Loaded AI Clients

```typescript
// ✅ Safe: Lazy load in request handler
import { getOpenAIClient } from "@/lib/ai/client";

export async function POST(req) {
  const client = await getOpenAIClient();
  // Use client...
}

// ❌ Never: Module-scope instantiation
// const client = new OpenAI(); // WRONG
```

## 🔐 Security Considerations

- **Authentication:** NextAuth.js prevents unauthorized access
- **Database:** Prisma ORM prevents SQL injection
- **Images:** ImageKit handles uploads securely
- **Secrets:** Never in code; use environment variables
- **CORS:** Configured for frontend domain only

## 🚀 Performance Optimizations

1. **Database Indexing:** Queries on `id`, `slug`, `category`
2. **Image CDN:** ImageKit provides automatic resizing and caching
3. **Server Components:** Reduce JS sent to client
4. **Revalidation:** ISR for frequently updated content
5. **Search:** PostgreSQL full-text search indexes

## 🔄 Deployment Architecture

- **Frontend:** Vercel (auto-deploy on push to main)
- **Database:** Supabase (managed PostgreSQL)
- **Images:** ImageKit CDN (global edge locations)
- **Auth:** NextAuth.js callbacks (serverless)

---

**Last Updated:** January 2026
**Maintained by:** Kollect-It Architecture Team
