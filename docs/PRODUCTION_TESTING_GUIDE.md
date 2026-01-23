# Production Testing Guide - Login & Product Posting

**Production URL:** https://kollect-it.com

---

## 🔐 Step 1: Reset Admin Password (If Needed)

### Option A: Using Script (Requires DATABASE_URL)

If your `.env.local` has a valid `DATABASE_URL`:

```powershell
cd C:\Users\james\kollect-it
npx tsx scripts/fix-admin-auth.ts
```

**After running, login with:**
- Email: `admin@kollect-it.com`
- Password: `KollectIt2024!`

### Option B: Check Current Password

Try logging in first - the password might already be set:
- Email: `admin@kollect-it.com`
- Password: `KollectIt2024!`

If login fails, use Option A or Option C.

### Option C: Via Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/xqrroyyqrgdytzpcckwk/editor
2. Open **User** table
3. Find `admin@kollect-it.com`
4. Check if user exists and has `role: "admin"`

**Note:** You can't easily set password hash via dashboard (requires bcrypt). Use Option A instead.

---

## 🌐 Step 2: Login to Production

### Login URL:
**https://kollect-it.com/admin/login**

### Credentials:
- **Email:** `admin@kollect-it.com`
- **Password:** `KollectIt2024!` (after running fix script)

### After Login:
You'll be redirected to: **https://kollect-it.com/admin/dashboard**

---

## 📋 Step 3: Test Admin Pages

### Core Pages to Test:

1. **Admin Dashboard**
   - URL: https://kollect-it.com/admin/dashboard
   - Features: Overview, stats, quick actions

2. **Products List**
   - URL: https://kollect-it.com/admin/products
   - Features: View all products, search, filter, delete

3. **Create New Product**
   - URL: https://kollect-it.com/admin/products/new
   - Features: Manual product creation form

4. **Edit Product**
   - URL: https://kollect-it.com/admin/products/[id]/edit
   - Features: Edit existing products

5. **Orders**
   - URL: https://kollect-it.com/admin/orders
   - Features: View and manage orders

6. **Categories**
   - URL: https://kollect-it.com/admin/categories
   - Features: Manage product categories

7. **Analytics**
   - URL: https://kollect-it.com/admin/analytics
   - Features: Sales, traffic, product analytics

---

## 📦 Step 4: Post Products

### Method 1: Manual Creation (Admin Panel)

1. **Go to:** https://kollect-it.com/admin/products/new

2. **Fill out the form:**
   - Title (required)
   - Description (required)
   - Price (required)
   - Category (required)
   - Condition
   - Year, Artist, Medium, Period (optional)
   - Image URL (optional)

3. **Choose status:**
   - **Draft:** Not visible to public
   - **Active:** Visible to public

4. **Click "Create Product"**

### Method 2: Desktop App (Ingest API)

If you have the desktop app configured:

**Endpoint:** `POST https://kollect-it.com/api/admin/products/ingest`

**Headers:**
```
Content-Type: application/json
x-api-key: [YOUR_PRODUCT_INGEST_API_KEY]
```

**Payload:**
```json
{
  "sku": "MILI-2026-0001",
  "title": "Product Title",
  "description": "Product description",
  "price": 299.99,
  "category": "Militaria",
  "condition": "Good",
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "type": "main"
    }
  ],
  "origin": "United States",
  "source": "desktop-app"
}
```

**Note:** Products from ingest API are created as **drafts** and need admin approval.

---

## ✅ Testing Checklist

### Authentication
- [ ] Can access login page
- [ ] Can log in with admin credentials
- [ ] Redirected to dashboard after login
- [ ] Session persists on page refresh
- [ ] Can log out

### Admin Pages
- [ ] Dashboard loads and shows stats
- [ ] Products page loads and shows products
- [ ] Can navigate between admin pages
- [ ] All admin pages require authentication

### Product Management
- [ ] Can view products list
- [ ] Can create new product manually
- [ ] Can edit existing product
- [ ] Can delete product
- [ ] Can search/filter products
- [ ] Draft products don't appear in public listings
- [ ] Active products appear in public listings

### Product Creation
- [ ] Form validates required fields
- [ ] SKU is auto-generated
- [ ] Can select category
- [ ] Can upload/add images
- [ ] Can save as draft
- [ ] Can publish as active

---

## 🐛 Troubleshooting

### Login Fails

**Error:** "Invalid email or password"

**Solutions:**
1. Run password reset script: `npx tsx scripts/fix-admin-auth.ts`
2. Check Vercel logs for auth errors
3. Verify `NEXTAUTH_SECRET` is set in Vercel
4. Verify `DATABASE_URL` is correct in Vercel

### Can't Access Admin Pages

**Error:** Redirected to login

**Solutions:**
1. Verify you're logged in (check session)
2. Verify user has `role: "admin"` in database
3. Clear browser cookies and try again

### Products Don't Appear

**Issue:** Created products not showing

**Solutions:**
1. Check product status (must be "active", not "draft")
2. Check `isDraft` field (must be `false`)
3. Verify products API filters correctly
4. Check browser console for errors

### Database Connection Errors

**Error:** "Can't reach database server"

**Solutions:**
1. Verify `DATABASE_URL` in Vercel is correct
2. Check Supabase project is active (not paused)
3. Verify database password is correct
4. Check Vercel logs for connection errors

---

## 🔍 Quick Verification Commands

### Check Production Deployment
```powershell
vercel ls
```

### Check Vercel Logs
```powershell
vercel logs https://kollect-it.com
```

### Test Database Connection
```powershell
npx tsx scripts/test-db-connection.ts
```

---

## 📝 Notes

- **Draft Products:** Created via ingest API are drafts and won't appear publicly
- **Active Products:** Must have `status: "active"` AND `isDraft: false`
- **SKU Format:** New format is `PREFIX-YYYY-NNNN` (e.g., `MILI-2026-0001`)
- **Images:** Can use ImageKit URLs or external image URLs

---

**Ready to test!** Start with Step 1 (reset password if needed), then proceed to login and testing.
