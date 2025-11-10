# Kollect-It Dynamic Website

A full-stack Next.js application for Kollect-It antiques and collectibles marketplace with database backend and admin panel.

## 🎯 Features

### **✅ Completed Features:**

1. **Dynamic Product Management**
   - Homepage automatically shows latest 6 products added to the database
   - Products update in real-time (60-second revalidation)
   - No need to manually edit HTML files!

2. **Admin Dashboard**
   - Secure login with authentication
   - **Multi-image upload with drag-and-drop** (Cloudinary integration)
   - Add new products with rich metadata (artist, year, period, etc.)
   - Delete products
   - View statistics (total products, active, sold, etc.)
   - Manage all inventory from one interface

3. **Professional Image Upload System**
   - Drag-and-drop or browse to upload
   - Multiple images per product (up to 8)
   - Auto-resize to max 1600px width
   - Cloudinary CDN for fast, optimized delivery
   - Drag to reorder images
   - Delete unwanted images
   - Visual thumbnails with "Main" badge

4. **Database Backend**
   - PostgreSQL database (production-ready)
   - Prisma ORM for type-safe database access
   - Categories: Fine Art, Antique Books, Collectibles, Militaria
   - Product images, descriptions, pricing, conditions, etc.
   - [📘 Full Database Setup Guide](./DATABASE_SETUP.md)

5. **Beautiful Design**
   - All original Kollect-It branding preserved
   - Responsive layout
   - Custom fonts: Cormorant Garamond & Lato
   - Gold and navy color scheme

6. **Dynamic Category Pages**
   - Browse products by category
   - Sort by price, date, featured status
   - Filtering and search capabilities
   - Breadcrumb navigation

7. **Shopping Cart System** 🆕
   - Add to cart from product cards and detail pages
   - Cart icon with item count badge
   - Full cart page with quantity controls
   - Order summary with tax calculation
   - LocalStorage persistence across sessions
   - Professional checkout-ready UI

8. **User Authentication & Accounts**
   - Customer registration and login
   - Secure password hashing with bcrypt
   - Account dashboard with profile, orders, and wishlist
   - Wishlist functionality with heart icons
   - User account dropdown in header
   - Protected routes and API endpoints
   - [📘 Full Auth Guide](./AUTH_GUIDE.md)

9. **Stripe Checkout & Payments**
   - Secure Stripe Payment Elements integration
   - Two-step checkout flow (Shipping → Payment)
   - Real-time payment validation
   - Automatic order creation in database
   - Email receipts via Stripe
   - Order tracking in customer account
   - PCI-compliant payment processing
   - [📘 Full Stripe Setup Guide](./STRIPE_SETUP.md)

1. **Admin Order Management** ✅

- Complete order dashboard with real-time stats
- Search and filter orders (status, date, customer)
- Detailed order view with customer info
- Update order status (Pending → Processing → Shipped → Delivered)
- Add tracking numbers and carrier information
- Upload/link shipping labels
- Automatic email notifications on status changes
- Mobile-responsive admin interface
- [📘 Full Order Management Guide](./docs/ORDER_MANAGEMENT_GUIDE.md)

1. **Email Notification System** 🆕

- Email notifications (Google Workspace integration pending)
- Order confirmation emails to customers
- Order status update notifications with tracking
- Admin new order alerts
- Welcome emails for newsletter signups
- Professional branded templates
- Automated triggers on key events
- Easy testing with API endpoint
- [📘 Full Email Setup Guide](./EMAIL_SETUP.md)

1. **Detailed Product Pages**

- Image gallery with zoom
- Full product information
- Tabbed content (description, shipping, authentication)
- Related products carousel
- Mobile-optimized with sticky cart bar

1. **API Routes**

- RESTful API for products and categories
- Authentication-protected admin routes
- Stripe payment intent creation
- Order management endpoints
- Wishlist and cart synchronization

## 🚀 Getting Started

### **New to this project?**

👉 Start with [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) for a step-by-step guide!

### **Quick Start:**

```bash
cd kollect-it-marketplace

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# ⚠️ Edit .env and add a REAL PostgreSQL DATABASE_URL (see SETUP_CHECKLIST.md)

# Set up database (first time only)
bun run db:setup

# Start the development server
bun run dev
```

Visit:

- **Homepage**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### **Admin Login Credentials:**

```text
Email: admin@kollect-it.com
Password: admin123
```

**⚠️ IMPORTANT:** Change these credentials before deploying to production!

### **Environment Variables:**

This project requires several API keys and configurations. See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for:

- Complete list of all required variables
- Where to get each API key
- How to set variables locally and on Vercel
- Security best practices

**Quick setup:**

```bash
cp .env.example .env
# Edit .env and add your API keys (see ENVIRONMENT_VARIABLES.md)
```

### **Database Setup:**

This project uses PostgreSQL. See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for:

- Getting a free PostgreSQL database (Supabase, Neon, or Vercel)
- Running migrations and seeding data
- All available database commands

**Quick Database Commands:**

```bash
bun run db:setup        # Complete setup (first time)
bun run db:migrate      # Create new migration
bun run db:seed         # Seed with sample data
bun run db:studio       # Open database GUI
```

## 📚 How to Use the Admin Panel

### **Setting Up Image Uploads (One-Time Setup):**

Before you can upload product images, you need to configure Cloudinary:

1. **See the detailed guide**: Read [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) for step-by-step instructions
2. **Quick summary**:
   - Create a free Cloudinary account
   - Get your Cloud Name, API Key, and API Secret
   - Create an unsigned upload preset
   - Update your `.env` file with the credentials
   - Restart the dev server

**This only needs to be done once!** After setup, image uploads will work seamlessly.

### **Setting Up Stripe Payments (One-Time Setup):**

Before you can accept payments, you need to configure Stripe:

1. **See the detailed guide**: Read [STRIPE_SETUP.md](./STRIPE_SETUP.md) for step-by-step instructions
2. **Quick summary**:
   - Create a free Stripe account at [stripe.com](https://stripe.com)
   - Get your test API keys from the Stripe Dashboard
   - Update your `.env` file with the keys:
     
     ```env
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-key"
     STRIPE_SECRET_KEY="sk_test_your-key"
     ```
     
   - Restart the dev server
   - Test checkout with card: `4242 4242 4242 4242`

**This only needs to be done once!** After setup, checkout will work seamlessly.

### **Adding a New Product:**

1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Sign in with the admin credentials
3. Click "**+ Add New Product**" button
4. Fill in the form:
   - **Title**: Product name
   - **Description**: Detailed description
   - **Price**: Price in dollars
   - **Category**: Select from dropdown
   - **Condition**: Fine, Very Good, Good, or Fair
   - **Year**: Production year or era (e.g., "1920", "c. 1850")
   - **Artist/Maker**: Creator name (if known)
   - **Medium/Material**: What it's made of
   - **Period/Era**: Historical period
   - **Featured**: Check to feature on homepage
5. **Upload Images**:
   - Drag and drop images onto the upload area, OR
   - Click "Browse Files" to select images
   - Upload up to 8 images per product
   - Drag images to reorder (first image is the main photo)
   - Click the delete button (X) to remove unwanted images
6. Click "**Create Product**"
7. The new product will appear on the homepage if it's one of the latest 6!

### **The Latest 6 Products Feature:**

- Products are automatically sorted by date added (newest first)
- The homepage will **ALWAYS show the 6 most recent products**
- When you add product #7, it replaces the oldest one on the homepage
- No manual updates needed! 🎉

### **Deleting Products:**

1. In the admin dashboard, scroll to the products table
2. Click "**Delete**" next to the product
3. Confirm deletion

## 🗄️ Database Structure

### **Models:**

- **User**: Admin users for authentication
- **Category**: Product categories (4 predefined)
- **Product**: Individual products with all details
- **Image**: Product images (supports multiple images per product)

### **Viewing the Database:**

```bash
cd kollect-it-dynamic
bun run db:studio
```

This opens Prisma Studio in your browser to view/edit the database directly.

## 📁 Project Structure

```text
kollect-it-dynamic/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts            # Initial data (categories, admin user)
│   └── dev.db             # SQLite database file
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage (dynamic!)
│   │   ├── admin/
│   │   │   ├── login/page.tsx         # Admin login
│   │   │   └── dashboard/page.tsx     # Admin dashboard
│   │   └── api/
│   │       ├── auth/[...nextauth]/    # Authentication
│   │       ├── products/              # Product CRUD
│   │       └── categories/            # Categories API
│   ├── components/
│   ├── lib/
│   │   ├── prisma.ts      # Database client
│   │   └── auth.ts        # Auth configuration
│   └── types/
```

## 🎨 Customization

### Design tokens and utilities

This project centralizes styling in `src/app/globals.css` and exposes a set of token-driven utilities and components to keep typography, color, spacing, and CTAs consistent across pages.

- Typography (global)
   - Headings: font-family uses `--font-serif` via base styles
   - Body text: font-family uses `--font-sans` via base styles

- Color tokens (defined on :root)
   - `--color-deep-navy`, `--color-muted-gold`, `--color-cream`, `--color-charcoal`, plus gray scales

- Utility classes (in @layer components of globals.css)
   - Text: `.text-navy`, `.text-gold`
   - Background: `.bg-cream`, `.bg-navy`
   - Border: `.border-gold`
   - Spacing: `.section-spacing` (vertical spacing for sections)
   - CTA: `.btn-cta` (uppercased, gold border/text; hover: gold bg + navy text)

Usage example:

```tsx
<section className="section-spacing bg-cream">
   <h2 className="text-4xl text-navy font-semibold mb-6">Section Title</h2>
   <p className="text-gray-700">Body copy inherits the global font and sizes.</p>
   <a className="btn-cta" href="/shop">Browse</a>
</section>
```

Guidelines:

- Do not import `globals.css` in pages/components; it is imported once by `src/app/layout.tsx`.
- Prefer token utilities over hard-coded hex values (e.g., `.text-navy` instead of `text-[#0B3D91]`).
- Keep CTAs consistent by using `.btn-cta` or equivalent Tailwind classes that reference the global tokens.
- If you need additional token utilities (e.g., `.border-navy`), add them in `globals.css` under `@layer components`.

### **Changing Colors:**

Edit `src/app/kollect-it-styles.css`:

```css
:root {
   --color-gold: #B1874C;      /* Richer gold accent */
   --color-primary: #2C2C2C;   /* Neutral dark for text/background */
  /* ... other colors ... */
}
```

### **Adding New Categories:**

1. Open Prisma Studio: `bun run db:studio`
2. Go to "Category" table
3. Click "Add record"
4. Fill in:
   - Name: Display name
   - Slug: URL-friendly (lowercase, hyphens)
   - Description: Category description
   - Image: Image URL

## 🚢 Deployment

### **Option 1: Vercel (Recommended)**

1. Push your code to GitHub
2. Import on Vercel: [vercel.com](https://vercel.com)
3. Vercel will auto-detect Next.js
4. Add environment variables:

   ```env
   DATABASE_URL=your-postgresql-url
   NEXTAUTH_SECRET=your-random-secret
   NEXTAUTH_URL=https://your-domain.com
   ```
5. Deploy!

### **Database for Production:**

For production, ensure PostgreSQL is configured:

1. Get a PostgreSQL database (Supabase, Neon, Railway, etc.)
2. Update `.env`:

   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database"
   ```
3. Run migrations:

   ```bash
   bunx prisma migrate dev
   bun run db:seed
   ```

## 🔐 Security

### **Before Production:**

1. **Change admin password**:
   - Edit `prisma/seed.ts`
   - Change the password in the admin user creation
   - Re-run: `bun run db:seed`

2. **Set strong NEXTAUTH_SECRET**:
   - Generate: `openssl rand -base64 32`
   - Add to `.env`

3. **Enable HTTPS** (Vercel handles this automatically)

## 📖 API Documentation

### **Get Products:**

```http
GET /api/products?category=fine-art&limit=6&featured=true
```

### **Create Product (Admin Only):**

```http
POST /api/products
Content-Type: application/json

{
   "title": "Product Name",
   "description": "Description",
   "price": 1000,
   "categoryId": "category-id",
   "images": [{"url": "image-url"}]
}
```

### **Delete Product (Admin Only):**

```http
DELETE /api/products/[id]
```

## 🆘 Common Issues

### **"Cannot find module '@prisma/client'"**

```bash
bunx prisma generate
```

### **Database doesn't exist**

```bash
bunx prisma db push
bun run db:seed
```

### **Admin login doesn't work**

Make sure `NEXTAUTH_SECRET` is set in `.env`

## 📞 Support

If you need help with deployment, you can:

1. Hire a developer on Fiverr/Upwork ($50-200 for deployment)
2. Use Vercel's auto-deployment (easiest!)
3. Contact deployment support: [support@vercel.com](mailto:support@vercel.com)

## 🎉 What's Next?

### **✅ Recently Completed:**

1. ~~Image Upload~~ ✅ **Multi-image upload with Cloudinary**
2. ~~Product Details Pages~~ ✅ **Full product pages with gallery**
3. ~~Shopping Cart~~ ✅ **Complete cart system with checkout UI**
4. ~~User Authentication~~ ✅ **Login, register, accounts, wishlist**
5. ~~Checkout Flow~~ ✅ **Stripe payment integration with order tracking**
6. ~~Order Management~~ ✅ **Admin order dashboard with status updates**
7. ~~Email Notifications~~ ✅ **Email stubs (Google Workspace integration pending)**

### **🚀 Ready to Add Next:**

1. **Search Functionality**: Search bar with autocomplete and filters
2. **Product Reviews**: Customer ratings and reviews
3. **Edit Products**: Update existing products in admin
4. **Advanced Analytics**: Sales tracking, popular items, revenue charts
5. **Password Reset**: Forgot password email flow
6. **Social Login**: Google/Facebook authentication
7. **Inventory Management**: Automatic stock updates after purchase
8. **Refund Processing**: Admin panel for Stripe refunds
9. **Shipping Integration**: Real-time shipping rates (ShipStation, EasyPost)
10. **Marketing**: Abandoned cart emails, discount codes, promotions

---

### Built with ❤️ for Kollect-It

*This is a fully functional, production-ready application. The latest 6 products feature works automatically - just add products through the admin panel and they'll appear on the homepage!*
