# Kollect-It Product Ingestion - Operator Runbook

**Version:** 1.0  
**Last Updated:** January 2026  
**Audience:** Internal administrators and operators

---

## 1. Purpose

### What This Tool Is

The Kollect-It Product Application is a desktop tool for internal administrators to safely ingest new products into the Kollect-It marketplace. It provides:

- AI-powered product description generation
- Automated image processing and optimization
- Secure product data submission to the website
- Draft-first workflow for admin review

### Who Is Allowed to Use It

- Internal administrators with access to the main Kollect-It repository
- Operators authorized by the development team
- Staff members with admin credentials

### What It Does NOT Do

- It does NOT publish products directly to the public website
- It does NOT modify existing products
- It does NOT expose or store API keys locally
- It does NOT work without proper configuration

---

## 2. Prerequisites

### Admin Access Required

You must have:
- Access to the main Kollect-It repository at `C:\Users\james\kollect-it`
- Read access to the `.env.local` file in the repository root
- Administrator privileges on your Windows machine

### Environment Configuration

The application reads all secrets from the main repository's `.env.local` file. This file must contain:

**Required API Keys:**
- `PRODUCT_INGEST_API_KEY` - Authentication for product ingestion API
- `IMAGEKIT_PUBLIC_KEY` - ImageKit CDN public key
- `IMAGEKIT_PRIVATE_KEY` - ImageKit CDN private key
- `ANTHROPIC_API_KEY` - Anthropic Claude API key for AI features

**Location:** `C:\Users\james\kollect-it\.env.local`

**Important:** Do NOT create a local `.env` file in the application directory. The app is configured to read from the main repository only.

### System Requirements

- Windows 10 or later
- Stable internet connection
- Sufficient disk space for image processing

---

## 3. Starting the Application

### How to Launch

1. Navigate to the application directory
2. Double-click `KollectItProductApp.exe`
3. Wait for the application window to appear

### Successful Startup

A successful startup will show:
- Application window opens without errors
- No error dialogs appear
- The main interface displays correctly
- You can see the image drop zone and controls

### Common Startup Errors

**"Environment not properly configured"**

- **Cause:** Required API keys are missing from `.env.local`
- **Action:** Contact your administrator to verify `.env.local` contains all required keys
- **Do NOT:** Create a local `.env` file as a workaround

**"Python not found" or "Module not found"**

- **Cause:** Application dependencies are missing or corrupted
- **Action:** Contact the development team for a fresh build
- **Do NOT:** Attempt to install Python or dependencies manually

**Application window does not appear**

- **Cause:** Application may be running in background or crashed
- **Action:** Check Windows Task Manager for `KollectItProductApp.exe`
- **Action:** If found, end the process and try again
- **Action:** If not found, check Windows Event Viewer for errors

---

## 4. Safe Product Ingestion Workflow

### Overview

The ingestion process follows these steps:
1. Prepare product images
2. Load images into the application
3. Run AI analysis
4. Review and edit product details
5. Verify SKU is unique
6. Upload images to CDN
7. Publish product as draft
8. Review in admin panel

### Step-by-Step Process

#### Step 1: Prepare Images

**Before starting:**
- Collect all product images in a single folder
- Ensure images are clear and well-lit
- Recommended: 5-10 images per product
- Formats supported: JPG, PNG, WebP

**Best practices:**
- Use high-resolution images (minimum 1200px width)
- Include multiple angles
- Show any damage or wear clearly
- Remove background clutter if possible

#### Step 2: Load Images

1. Click the "Select Images" or drag-and-drop area
2. Navigate to your product image folder
3. Select all relevant images
4. Click "Open"

**What happens:**
- Images are loaded into the application
- Thumbnails appear in the image grid
- First image becomes the primary image

**Safety check:**
- Verify all images loaded correctly
- Ensure primary image is appropriate for public display

#### Step 3: Run AI Analysis

1. Select the product category from the dropdown
2. Click "Analyze Images" or "Generate Description"
3. Wait for AI processing to complete (may take 30-60 seconds)

**What happens:**
- AI analyzes images and generates:
  - Product title
  - Detailed description
  - Suggested price range
  - Category-specific attributes
  - SEO metadata

**Important:**
- AI suggestions are starting points only
- Always review and edit AI-generated content
- Verify accuracy of all details

#### Step 4: Review and Edit Details

**Required fields to verify:**
- **Title:** Clear, descriptive, accurate
- **Description:** Complete, accurate, no errors
- **Category:** Correct category selected
- **Subcategory:** Appropriate subcategory (if applicable)
- **Price:** Reasonable and competitive
- **Condition:** Accurate condition description
- **SKU:** Unique and follows format (e.g., KOL-2026-0001)

**Optional fields to complete:**
- Era/Period
- Origin/Provenance
- Artist/Maker
- Materials/Medium
- Dimensions
- Rarity notes

**Safety warnings:**
- **Never reuse an existing SKU** - This will cause a duplicate error
- **Always verify category** - Wrong category affects product visibility
- **Review price carefully** - Incorrect pricing affects sales

#### Step 5: Verify SKU

**SKU Format:**
- Format: `KOL-YYYY-NNNN` (e.g., `KOL-2026-0001`)
- Prefix: `KOL` (fixed)
- Year: Current year (4 digits)
- Number: Sequential (4-6 digits)

**SKU Uniqueness:**
- The application will check for duplicates before publishing
- If a duplicate is detected, you will receive an error
- Generate a new SKU if duplicate is found

**How to generate SKU:**
- Use the "Generate SKU" button if available
- Or manually create following the format
- Ensure it's unique in your records

#### Step 6: Upload Images to CDN

1. Click "Upload to ImageKit" or "Upload Images"
2. Wait for upload progress to complete
3. Verify all images uploaded successfully

**What happens:**
- Images are uploaded to ImageKit CDN
- URLs are generated for each image
- Images are optimized for web delivery

**If upload fails:**
- Check internet connection
- Verify ImageKit credentials in `.env.local`
- Retry upload (images are not lost)
- Contact administrator if persistent failures

#### Step 7: Publish Product as Draft

1. Review all product information one final time
2. Click "Publish to Website" or "Submit Product"
3. Wait for confirmation message

**What happens:**
- Product data is sent to the website API
- Product is created as a DRAFT (not publicly visible)
- You receive an admin review URL

**Important:**
- Products are ALWAYS created as drafts first
- This allows review before public publication
- Never skip the review step

#### Step 8: Review in Admin Panel

1. Click the admin review URL provided after publishing
2. Or navigate to: `https://kollect-it.com/admin/products/{product-id}/edit`
3. Review all product details
4. Make any final edits if needed
5. Click "Publish" to make the product public

**Final safety check:**
- Verify all images display correctly
- Check product description for accuracy
- Confirm pricing is correct
- Ensure SEO metadata is appropriate
- Verify category and tags are correct

---

## 5. Error Handling & Recovery

### Duplicate SKU (409 Error)

**What it means:**
- A product with this SKU already exists in the system
- The system prevents duplicate SKUs to maintain data integrity

**What to do:**
1. Note the existing product ID from the error message
2. Generate a new, unique SKU
3. Update the SKU in the application
4. Retry publishing

**Prevention:**
- Always verify SKU uniqueness before publishing
- Keep a record of used SKUs
- Use the SKU generation feature if available

### Missing API Key (401 Error)

**What it means:**
- The `PRODUCT_INGEST_API_KEY` is missing or invalid
- Authentication to the website API failed

**What to do:**
1. Verify `.env.local` exists in the main repository
2. Check that `PRODUCT_INGEST_API_KEY` is present
3. Verify the key value matches the website configuration
4. Contact administrator if key needs to be regenerated

**Do NOT:**
- Create a local `.env` file
- Share API keys via email or chat
- Attempt to bypass authentication

### Network Failure

**What it means:**
- Connection to the website API failed
- Internet connectivity issues
- API server temporarily unavailable

**What to do:**
1. Check your internet connection
2. Verify the website is accessible: `https://kollect-it.com`
3. Wait a few minutes and retry
4. If persistent, check with development team for API status

**Recovery:**
- Product data is not lost
- Images remain uploaded to CDN
- Simply retry the publish operation

### Image Upload Failure

**What it means:**
- ImageKit CDN upload failed
- Image processing error
- Network timeout during upload

**What to do:**
1. Check internet connection
2. Verify ImageKit credentials in `.env.local`
3. Retry upload for failed images
4. If specific images fail repeatedly, check file format and size

**Recovery:**
- Failed images are not lost
- Retry upload for specific images
- Contact administrator if all uploads fail

### Validation Error (400 Error)

**What it means:**
- Product data failed validation
- Required fields are missing
- Data format is incorrect

**What to do:**
1. Read the error message carefully
2. Identify which field(s) are problematic
3. Correct the data in the application
4. Retry publishing

**Common validation issues:**
- Missing required fields (title, description, price, category)
- Invalid price format (must be a number)
- Missing images (at least one image required)
- Invalid category name

---

## 6. What NOT to Do

### Do NOT Share the Application

- This application is for internal use only
- Do NOT distribute to unauthorized users
- Do NOT post on public repositories or websites
- Do NOT share executable files via email or cloud storage

### Do NOT Embed Secrets

- Do NOT create local `.env` files
- Do NOT hardcode API keys in any file
- Do NOT store secrets in configuration files
- All secrets must come from main repo `.env.local`

### Do NOT Bypass Draft Flow

- Products are created as drafts for a reason
- Always review products in admin panel before publishing
- Do NOT attempt to publish directly to public
- Draft review catches errors before public exposure

### Do NOT Upload Unverified Items

- Always verify product information before publishing
- Do NOT trust AI-generated content without review
- Do NOT skip the review step
- Verify images, descriptions, and pricing accuracy

### Do NOT Reuse SKUs

- Each product must have a unique SKU
- Reusing SKUs causes data integrity issues
- Always generate new SKUs for new products
- Keep records of used SKUs to avoid conflicts

### Do NOT Modify Source Code

- If you encounter bugs, report them
- Do NOT attempt to fix code yourself
- Do NOT modify application files
- Contact development team for issues

---

## 7. Support & Escalation

### Who to Contact

**For technical issues:**
- Development team
- System administrator

**For API key issues:**
- Repository administrator
- Development team lead

**For product data questions:**
- Content manager
- Operations team

### Information to Collect Before Requesting Help

**For application errors:**
- Exact error message text
- What you were doing when the error occurred
- Screenshot of the error (if possible)
- Application version (if visible)

**For API errors:**
- Error code (401, 400, 409, 500, etc.)
- Error message text
- Product SKU (if applicable)
- Time when error occurred

**For upload failures:**
- Which images failed (file names)
- Error message text
- Internet connection status
- Image file sizes and formats

**For configuration issues:**
- Confirmation that `.env.local` exists
- List of API keys present (names only, not values)
- Location of `.env.local` file
- Error message from startup

### Escalation Process

1. **First attempt:** Review this runbook for solutions
2. **Second attempt:** Collect information listed above
3. **Contact support:** Provide all collected information
4. **Follow up:** If issue persists, escalate to development team

### Emergency Contacts

**Critical issues (system down, data loss):**
- Contact development team immediately
- Provide detailed error information
- Do NOT attempt workarounds that may cause data loss

**Non-critical issues:**
- Document the issue
- Continue with other products if possible
- Submit support request during business hours

---

## Appendix A: Quick Reference

### Required API Keys
- `PRODUCT_INGEST_API_KEY`
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `ANTHROPIC_API_KEY`

### SKU Format
- Format: `KOL-YYYY-NNNN`
- Example: `KOL-2026-0001`

### Supported Image Formats
- JPG / JPEG
- PNG
- WebP

### Product Status Flow
1. Created as DRAFT
2. Reviewed in admin panel
3. Published to public website

### Common Error Codes
- `401` - Authentication failed (check API keys)
- `400` - Validation error (check required fields)
- `409` - Duplicate SKU (generate new SKU)
- `500` - Server error (retry or contact support)

---

## Appendix B: Troubleshooting Checklist

Before requesting support, verify:

- [ ] `.env.local` exists in main repository
- [ ] All required API keys are present in `.env.local`
- [ ] Internet connection is stable
- [ ] Website is accessible (`https://kollect-it.com`)
- [ ] Product images are in supported format
- [ ] SKU follows correct format and is unique
- [ ] All required fields are completed
- [ ] Application version is current

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Maintained By:** Development Team
