# Manual Feature Testing Guide

Use this guide to manually test key features before deployment.

## Prerequisites

1. Start the development server:
   ```powershell
   bun run dev
   ```

2. Open browser: http://localhost:3000

---

## 1. Shopping Cart Testing

### Test Steps:
1. Navigate to homepage: http://localhost:3000
2. Click on a product to view details
3. Click "Add to Cart" button
4. Verify cart icon shows item count
5. Navigate to `/cart`
6. Verify product appears in cart
7. Test quantity increase/decrease
8. Test remove item
9. Refresh page - cart should persist
10. Test empty cart state

### Expected Results:
- ✅ Products can be added to cart
- ✅ Cart persists across page refreshes
- ✅ Quantity updates work
- ✅ Remove item works
- ✅ Total price calculates correctly
- ✅ Empty cart shows proper message

---

## 2. Checkout Flow Testing

### Test Steps:
1. Add items to cart
2. Navigate to `/cart`
3. Click "Proceed to Checkout"
4. Fill in shipping information:
   - Name
   - Email
   - Address
   - City, State, ZIP
   - Phone
5. Click "Continue to Payment"
6. Fill in billing information (if different)
7. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
8. Click "Complete Order"
9. Verify redirect to success page
10. Check order confirmation

### Test Cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### Expected Results:
- ✅ Shipping form validates correctly
- ✅ Billing form validates correctly
- ✅ Stripe Payment Elements render
- ✅ Payment processes successfully
- ✅ Order is created in database
- ✅ Redirect to success page works
- ✅ Error handling works for declined cards

---

## 3. Admin Dashboard Testing

### Login:
1. Navigate to `/admin/login`
2. Use credentials:
   - Email: `admin@kollect-it.com`
   - Password: `admin123`
3. Click "Sign In"

### Product Management:
1. Navigate to `/admin/dashboard`
2. Click "Products" or "Add New Product"
3. Test creating a product:
   - Fill in all required fields
   - Upload images (drag & drop)
   - Save product
4. Test editing a product:
   - Click on existing product
   - Modify fields
   - Save changes
5. Test deleting a product:
   - Click delete button
   - Confirm deletion

### Order Management:
1. Navigate to `/admin/orders`
2. View orders list
3. Click on an order to view details
4. Test updating order status
5. Verify order information displays correctly

### Expected Results:
- ✅ Admin login works
- ✅ Dashboard loads with metrics
- ✅ Products can be created/edited/deleted
- ✅ Image upload works
- ✅ Orders list displays
- ✅ Order details work
- ✅ Order status can be updated

---

## 4. Product Pages Testing

### Test Steps:
1. Navigate to homepage
2. Click on a product
3. Verify product detail page loads
4. Check:
   - Product images display
   - Product information is correct
   - "Add to Cart" button works
   - Related products section (if present)
   - Breadcrumbs work
   - Mobile view is responsive

### Expected Results:
- ✅ Product pages load correctly
- ✅ Images display properly
- ✅ Add to cart works
- ✅ Related products show
- ✅ Mobile responsive
- ✅ SEO metadata present

---

## 5. Navigation Testing

### Test All Links:
- [ ] Homepage (`/`)
- [ ] Browse (`/browse`)
- [ ] Categories (`/categories`)
- [ ] Category pages (`/category/[slug]`)
- [ ] About (`/about`)
- [ ] FAQ (`/faq`)
- [ ] Contact (`/contact`)
- [ ] Shipping & Returns (`/shipping-returns`)
- [ ] Authentication (`/authentication`)
- [ ] Privacy Policy (`/privacy`)
- [ ] Terms of Service (`/terms`)
- [ ] Cookie Policy (`/cookies`)

### Mobile Menu:
- [ ] Mobile menu opens/closes
- [ ] All links work in mobile menu
- [ ] Cart icon works on mobile

### Expected Results:
- ✅ All links work
- ✅ No 404 errors
- ✅ Mobile menu functional
- ✅ Footer links work

---

## 6. Search & Filtering

### Test Steps:
1. Navigate to `/browse`
2. Test search functionality
3. Test category filters
4. Test sorting options
5. Verify results update correctly

### Expected Results:
- ✅ Search works
- ✅ Filters apply correctly
- ✅ Sorting works
- ✅ Results display properly

---

## 7. Error Handling

### Test:
- [ ] Navigate to non-existent page (e.g., `/test-404`)
- [ ] Verify 404 page displays
- [ ] Test error boundary (if applicable)
- [ ] Test API error responses

### Expected Results:
- ✅ 404 page works
- ✅ Error messages are user-friendly
- ✅ No console errors (check DevTools)

---

## 8. Performance Check

### Using Chrome DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check:
   - Page load time
   - Resource sizes
   - Number of requests
5. Go to Performance tab
6. Record page load
7. Check for:
   - Long tasks
   - Layout shifts
   - Render blocking

### Expected Results:
- ✅ Page loads in < 3 seconds
- ✅ Images optimized
- ✅ No unnecessary requests
- ✅ Smooth scrolling

---

## 9. Accessibility Check

### Using Chrome DevTools:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run Accessibility audit
4. Check:
   - ARIA labels present
   - Color contrast
   - Keyboard navigation
   - Screen reader compatibility

### Manual Checks:
- [ ] Tab through all interactive elements
- [ ] Verify focus states visible
- [ ] Test with keyboard only
- [ ] Check alt text on images

### Expected Results:
- ✅ Accessibility score > 90
- ✅ All interactive elements keyboard accessible
- ✅ Focus states visible
- ✅ Images have alt text

---

## 10. Browser Compatibility

### Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Expected Results:
- ✅ Site works in all browsers
- ✅ No layout issues
- ✅ Features function correctly

---

## Issues Found:

_Record any issues discovered during testing_

---

## Sign-off:

- [ ] All features tested
- [ ] No critical bugs found
- [ ] Performance acceptable
- [ ] Accessibility verified
- [ ] Ready for deployment

**Tested by:** _______________  
**Date:** _______________
