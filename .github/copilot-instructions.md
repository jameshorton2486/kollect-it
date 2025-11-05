# Kollect-It Marketplace - AI Coding Assistant Instructions

## Architecture Overview

This is a full-stack Next.js 15 marketplace application for antiques and collectibles with the following key components:

- **Frontend**: Next.js App Router with TypeScript, Tailwind CSS, and custom design system
- **Backend**: Next.js API routes with Prisma ORM and PostgreSQL
- **Authentication**: NextAuth.js with credentials provider and bcrypt password hashing
- **Payments**: Stripe integration with Payment Elements
- **Media**: Cloudinary for image uploads with drag-and-drop multi-image support
- **Email**: Resend for transactional emails with React Email templates
- **State Management**: React Context for cart/wishlist, localStorage persistence
- **Database**: PostgreSQL with Prisma schema including User, Product, Category, Order, Image models

## Key Patterns & Conventions

### File Organization
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Feature-organized components (admin/, checkout/, product/, etc.)
- `src/lib/` - Utilities, database client, auth helpers, Stripe integration
- `src/contexts/` - React Context providers for global state
- `prisma/` - Database schema, migrations, and seed data

### Import Aliases
```typescript
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-helpers';
import ProductCard from '@/components/ProductCard';
```

### Database Patterns
- Use Prisma Client for all database operations
- Include proper indexes on frequently queried fields (see `@@index` in schema.prisma)
- Store historical data in OrderItem (price/title at time of purchase)
- Use cascading deletes where appropriate

### API Route Patterns
```typescript
// Rate limiting implemented on public endpoints
const RATE_LIMIT_MAX = 60; // 60 req/min per IP

// Admin routes require authentication
import { checkAdminAuth } from '@/lib/auth-helpers';
const session = await checkAdminAuth();
```

### Authentication & Authorization
- Admin users have `role: "admin"` in User model
- Use `checkAdminAuth()` helper for protected admin routes
- Customer accounts for orders and wishlist functionality
- Default admin: `admin@kollect-it.com` / `admin123` (change in production)

### Component Patterns
- Client components marked with `'use client'` directive
- Custom hooks for reusable logic
- Context providers wrap the app in `layout.tsx`
- Error boundaries for graceful error handling

### Styling System
- CSS custom properties for design tokens in `globals.css`
- Tailwind utilities with semantic color mappings:
```css
/* Use semantic tokens instead of hardcoded colors */
.text-ink          /* var(--ink-900) - #2C2C2C */
.bg-surface-1      /* var(--surface-1) - #F5F3F0 */
.border-gold       /* var(--gold-500) - #B1874C */
```

### State Management
- Cart state persisted to localStorage with `CartContext`
- Wishlist managed via `WishlistContext` and database
- Server state handled through API routes and revalidation

## Critical Developer Workflows

### Development Setup
```bash
bun install                    # Install dependencies
cp .env.example .env          # Configure environment variables
bun run db:setup             # Initialize database and run migrations
bun run dev                  # Start development server on :3000
```

### Database Operations
```bash
bun run db:generate          # Generate Prisma client
bun run db:migrate           # Create and run migrations
bun run db:push              # Push schema changes (dev only)
bun run db:seed              # Populate with sample data
bun run db:studio            # Open database GUI
```

### Testing & Quality
```bash
bun run lint                 # TypeScript + ESLint checking
bun run format               # Code formatting with Biome
bun run test:e2e             # End-to-end tests with Playwright
bun run build                # Production build verification
```

### Deployment Preparation
- Update admin credentials in `prisma/seed.ts`
- Set strong `NEXTAUTH_SECRET` (32+ characters)
- Configure production PostgreSQL database
- Set up Stripe, Cloudinary, and Resend API keys

## Integration Points

### Stripe Checkout Flow
- Two-step process: shipping info → payment
- `PaymentIntent` created server-side with order total
- Webhook handler at `/api/webhooks/stripe` for payment confirmation
- Order status updates trigger email notifications

### Image Upload System
- Cloudinary unsigned uploads for client-side uploads
- Multi-image support with drag-and-drop reordering
- Auto-resize to max 1600px width
- Images stored with product relationships

### Email Notifications
- Resend API with React Email components
- Order confirmations, status updates, admin alerts
- Branded templates with Kollect-It styling

## Common Patterns & Gotchas

### Product Display Logic
- Homepage shows latest 6 products by `createdAt DESC`
- Products filtered by `status: "active"` and `featured` flag
- Category pages use slug-based routing

### Cart Implementation
- Client-side state with localStorage backup
- Tax calculation: 8% rate applied to subtotal
- Items include product metadata for display

### Admin Dashboard Features
- Real-time statistics and order management
- Product CRUD with image upload
- Order status updates with tracking integration
- Search and filtering across all entities

### Error Handling
- API routes use `respondError()` helper for consistent error responses
- Client components show user-friendly error messages
- Rate limiting prevents abuse on public endpoints

## Key Files to Reference

- `prisma/schema.prisma` - Complete data model and relationships
- `src/lib/auth.ts` - Authentication configuration
- `src/lib/stripe.ts` - Payment processing logic
- `src/contexts/CartContext.tsx` - Shopping cart implementation
- `src/app/globals.css` - Design system and CSS custom properties
- `tailwind.config.ts` - Tailwind configuration with custom colors
- `src/app/api/products/route.ts` - Example API route with rate limiting</content>
<parameter name="filePath">c:\Users\james\kollect-it-marketplace-1\.github\copilot-instructions.md