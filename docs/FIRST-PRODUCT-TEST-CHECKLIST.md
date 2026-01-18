# Kollect-It: First Product Test Checklist

**Purpose:** Verify end-to-end product flow before going live  
**Time Required:** ~30 minutes  
**Prerequisites:** All Day 1 fixes applied, Vercel env vars configured

---

## Phase 1: Pre-Test Setup

### Environment Verification
- [ ] Desktop app `.env` file exists with all required variables
- [ ] `PRODUCT_INGEST_API_KEY` is set in desktop app `.env`
- [ ] `PRODUCT_INGEST_API_KEY` matches in Vercel environment
- [ ] `IMAGEKIT_PUBLIC_KEY` is set
- [ ] `IMAGEKIT_PRIVATE_KEY` is set
- [ ] `ANTHROPIC_API_KEY` is set (for AI features)

### Quick API Test
```bash
# Test the ingest API is responding (replace with your actual API key)
curl -X GET https://kollect-it.com/api/admin/products/ingest \
  -H "Authorization: Bearer YOUR_PRODUCT_INGEST_API_KEY"

# Expected response: {"status":"ok","version":"1.0.0","categories":[...]}
```

---

## Phase 2: Desktop App Test

### Step 2.1: Launch Application
- [ ] Open terminal/PowerShell in desktop-app directory
- [ ] Run: `python main.py`
- [ ] Application window opens without errors
- [ ] Status bar shows "Ready"

### Step 2.2: Load Test Product
- [ ] Prepare a folder with 3-5 product images
- [ ] Drag folder onto drop zone
- [ ] Verify all images load in the grid
- [ ] Check image count matches expected

### Step 2.3: AI Analysis
- [ ] Click "Analyze Images" button
- [ ] Wait for AI to process (30-60 seconds)
- [ ] Verify title is generated
- [ ] Verify description is generated
- [ ] Verify era/period is suggested
- [ ] Verify rarity assessment appears

### Step 2.4: AI Valuation
- [ ] Click "Get Valuation" button
- [ ] Wait for AI to process
- [ ] Verify price range appears (Low/High/Recommended)
- [ ] Verify confidence level is shown
- [ ] Review pricing reasoning

### Step 2.5: Edit & Finalize
- [ ] Review/edit title if needed
- [ ] Review/edit description if needed
- [ ] Adjust price if needed
- [ ] Select correct category
- [ ] Select correct subcategory (if applicable)
- [ ] SKU is auto-generated (format: KOL-YYYY-NNNN)

---

## Phase 3: ImageKit Upload

### Step 3.1: Upload Images
- [ ] Click "Upload to Cloud" button
- [ ] Progress bar shows upload progress
- [ ] All images upload successfully
- [ ] URL list appears in output area

### Step 3.2: Verify in ImageKit
- [ ] Open ImageKit dashboard: https://imagekit.io/dashboard
- [ ] Navigate to your folder
- [ ] Verify all images are present
- [ ] Verify WebP conversion occurred
- [ ] Check image URLs are accessible

---

## Phase 4: Publish to Website

### Step 4.1: Publish Product
- [ ] Click "Publish to Website" button
- [ ] Wait for API response
- [ ] Success message appears
- [ ] Product ID is returned
- [ ] Admin URL is provided

### Step 4.2: Expected Response
```json
{
  "success": true,
  "message": "Product created as draft",
  "product": {
    "id": "clxxx...",
    "sku": "KOL-2026-0001",
    "title": "...",
    "isDraft": true
  },
  "urls": {
    "admin": "/admin/products/clxxx.../edit",
    "adminFull": "https://kollect-it.com/admin/products/clxxx.../edit"
  },
  "nextStep": "Review and publish in admin panel"
}
```

---

## Phase 5: Admin Review

### Step 5.1: Access Admin Panel
- [ ] Open admin URL from publish response
- [ ] Login if prompted
- [ ] Product edit page loads correctly

### Step 5.2: Verify Product Data
- [ ] Title matches what was entered
- [ ] Description matches
- [ ] Price is correct
- [ ] Category is correct
- [ ] Images display properly
- [ ] SKU is shown

### Step 5.3: Approve Product
- [ ] Review all fields one more time
- [ ] Click "Publish" or "Approve" button
- [ ] Confirm `isDraft` changes to `false`
- [ ] Product status shows "Active"

---

## Phase 6: Public Verification

### Step 6.1: View Public Product Page
- [ ] Navigate to public product URL
- [ ] Page loads without errors
- [ ] Images display correctly
- [ ] Price is shown
- [ ] "Add to Cart" button is visible

### Step 6.2: Verify SEO/Structured Data
- [ ] View page source (Ctrl+U or Cmd+Option+U)
- [ ] Search for "application/ld+json"
- [ ] Verify JSON-LD contains:
  - `@type: "Product"`
  - Correct product name
  - Correct price
  - SKU
  - Availability status

### Step 6.3: Check Sitemap
- [ ] Visit https://kollect-it.com/sitemap.xml
- [ ] New product URL should appear (may take up to 60 seconds)

---

## Phase 7: Checkout Test

### Step 7.1: Add to Cart
- [ ] Click "Add to Cart" on product page
- [ ] Cart icon updates
- [ ] Navigate to cart page
- [ ] Product appears in cart with correct price

### Step 7.2: Proceed to Checkout
- [ ] Click "Checkout" button
- [ ] Checkout page loads
- [ ] Order summary is correct

### Step 7.3: Complete Test Payment
Use Stripe test card:
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

- [ ] Enter test card details
- [ ] Fill shipping information
- [ ] Submit payment
- [ ] Success page appears
- [ ] Order number is generated

### Step 7.4: Verify Order
- [ ] Check Stripe Dashboard for test payment
- [ ] Check admin orders page
- [ ] Order appears with correct status
- [ ] If email configured: confirmation email received

---

## Success Criteria

All boxes checked = **READY FOR PRODUCTION** 🚀

If any step fails:
1. Note the exact error message
2. Check browser console for JavaScript errors
3. Check Vercel logs for API errors
4. Check desktop app console output

---

## Common Issues & Solutions

### "Unauthorized" when publishing
- Verify `PRODUCT_INGEST_API_KEY` matches in both environments
- Check for extra spaces in the env var value

### Images don't upload
- Verify ImageKit credentials
- Check if images are valid formats (JPG, PNG, WebP)
- Check ImageKit dashboard for quota limits

### AI analysis fails
- Verify `ANTHROPIC_API_KEY` is set
- Check API key has sufficient credits
- Try with a smaller/different image

### Checkout fails
- Verify Stripe keys are set (use test keys for testing)
- Check Stripe webhook is registered
- Review Stripe Dashboard for error details

---

*Checklist version 1.0 • January 2026*
