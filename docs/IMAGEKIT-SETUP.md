# ImageKit Integration & Google Drive Sync Setup Guide

Complete setup guide for integrating Google Drive image syncing with ImageKit for the Kollect-It marketplace.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Google Cloud Console Setup](#google-cloud-console-setup)
3. [Service Account Creation](#service-account-creation)
4. [Google Drive API Configuration](#google-drive-api-configuration)
5. [ImageKit Configuration](#imagekit-configuration)
6. [Environment Variables](#environment-variables)
7. [Running Your First Sync](#running-your-first-sync)
8. [API Usage](#api-usage)
9. [Using ProductImage Component](#using-productimage-component)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- ✅ A Google Cloud Project (or create a new one at https://console.cloud.google.com/)
- ✅ An ImageKit account (https://imagekit.io)
- ✅ Admin access to a Google Drive folder with product images
- ✅ Bun package manager installed
- ✅ Node.js 18+ (for TypeScript support)

---

## Google Cloud Console Setup

### Step 1: Create or Select a Project

1. Go to https://console.cloud.google.com/
2. Click the project selector dropdown at the top
3. Click "NEW PROJECT"
4. Name it: **Kollect-It ImageKit Sync**
5. Click "CREATE"
6. Wait for the project to be created (this takes ~60 seconds)
7. Select the new project from the dropdown

### Step 2: Enable Required APIs

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"Google Drive API"**
3. Click on it and press **"ENABLE"**
4. Go back to API Library
5. Search for **"Service Account"** (you'll use it next)

---

## Service Account Creation

### Step 3: Create a Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"Service Account"**
3. Fill in the form:
   - **Service account name:** `imagekit-sync`
   - **Service account ID:** `imagekit-sync` (auto-filled)
   - **Description:** "Service account for syncing Google Drive images to ImageKit"
4. Click **"CREATE AND CONTINUE"**
5. Skip the optional steps by clicking **"CONTINUE"**
6. Click **"DONE"**

### Step 4: Generate Service Account Key

1. In the Credentials page, find your service account under "Service Accounts"
2. Click on the service account name: `imagekit-sync@[project-id].iam.gserviceaccount.com`
3. Go to the **"KEYS"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Choose **JSON** format
6. Click **"CREATE"**
7. A JSON file will download automatically - **keep this safe!**

### Step 5: Add Service Account to Google Drive

1. Rename the downloaded JSON file to `google-credentials.json`
2. Place it in your project root: `./google-credentials.json`
3. Extract the `client_email` from the JSON file (looks like: `imagekit-sync@[project-id].iam.gserviceaccount.com`)
4. Go to your Google Drive folder containing product images
5. Right-click → **"Share"**
6. Paste the `client_email` into the share dialog
7. Give it **"Viewer"** permissions (no need for Editor)
8. Click **"Share"** (no need to send notification)

---

## Google Drive API Configuration

### Step 6: Get Your Google Drive Folder ID

1. Open your Google Drive folder with product images in a browser
2. Look at the URL - it should look like: `https://drive.google.com/drive/folders/[FOLDER_ID]`
3. Copy the `[FOLDER_ID]` part
4. **Save this** - you'll need it for environment variables

---

## ImageKit Configuration

### Step 7: Get ImageKit Credentials

1. Go to https://imagekit.io and sign in (or create account)
2. Go to **Settings** → **API Keys**
3. Copy these values:
   - **Public Key** (starts with `public_`)
   - **Private Key** (long string)
   - **URL Endpoint** (looks like `https://ik.imagekit.io/[subdomain]`)

**Note:** For Kollect-It, we already have:
- URL Endpoint: `https://ik.imagekit.io/kollectit`
- Public Key: `public_1MwR2t3I95qAJXc72h1DzbbLLZU=`
- Private Key: Get from ImageKit console

---

## Environment Variables

### Step 8: Update .env.local

Create or update `.env.local` in your project root:

```env
# ImageKit Configuration
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_1MwR2t3I95qAJXc72h1DzbbLLZU=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit
IMAGEKIT_PUBLIC_KEY=public_1MwR2t3I95qAJXc72h1DzbbLLZU=
IMAGEKIT_PRIVATE_KEY=your_private_key_here_from_step_7
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit

# Google Drive Configuration
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_from_step_6
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# Optional: Webhook Security (for API sync endpoint)
WEBHOOK_SECRET=your_random_secret_here_change_this_to_random_string
```

### Important Notes

- ⚠️ **NEVER commit** `google-credentials.json` or `.env.local` to Git
- ✅ These files are already in `.gitignore`
- 🔒 Keep private keys confidential
- 🔄 For production, use a secrets manager (e.g., AWS Secrets Manager, Vercel Secrets)

---

## Running Your First Sync

### Step 9: Install Dependencies

```bash
bun add imagekit googleapis dotenv
bun add -d @types/node
```

### Step 10: Run the Sync Script

```bash
bun run sync-images
```

This will:
1. ✅ Connect to Google Drive
2. ✅ List all images in the specified folder
3. ✅ Check if each image already exists in ImageKit
4. ✅ Skip existing files (to save API calls)
5. ✅ Upload new images to ImageKit
6. ✅ Generate a detailed report in `sync-results.json`

### What to Expect

- Initial sync takes ~5-10 minutes depending on image count
- Each upload has a 500ms delay to avoid rate limiting
- Progress is logged with emojis (📁, ⬇️, ⬆️, ✅, ❌)
- Results are saved to `sync-results.json`

### Example Output

```
🚀 Starting Google Drive to ImageKit Sync
📁 Drive Folder ID: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
🖼️  ImageKit Folder: /products
⏭️  Skip Existing: true

📂 Fetching images from Google Drive folder...
✅ Found 42 images in Google Drive

[1/42] Processing: antique-vase-001.jpg
⬇️  Downloading from Google Drive...
⬆️  Uploading to ImageKit...
✅ Successfully uploaded: antique-vase-001.jpg

... (continues for all 42 images)

============================================================
📊 SYNC SUMMARY
============================================================
📁 Files Found:     42
✅ Files Uploaded:  38
⏭️  Files Skipped:   4
❌ Files Failed:    0
💾 Total Bytes:     256.42 MB
⏱️  Duration:        542.15s
============================================================
💾 Results saved to: sync-results.json
```

---

## API Usage

### Trigger Sync via API

You can trigger a sync programmatically via the `/api/sync-images` endpoint:

```bash
curl -X POST http://localhost:3000/api/sync-images \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your_webhook_secret",
    "skipExisting": true
  }'
```

### Response

```json
{
  "status": "syncing",
  "message": "Image sync started in background",
  "syncId": "sync_1730750000000_abc123",
  "estimatedDuration": "5-10 minutes"
}
```

### Check Sync Status

```bash
curl http://localhost:3000/api/sync-images?syncId=sync_1730750000000_abc123
```

### Response

```json
{
  "syncId": "sync_1730750000000_abc123",
  "status": "running",
  "startTime": "2025-11-05T10:30:00.000Z",
  "elapsedSeconds": 45
}
```

---

## Using ProductImage Component

### Basic Usage

```tsx
import { ProductImage } from '@/components/ProductImage';

export default function ProductPage() {
  return (
    <ProductImage
      path="/products/antique-vase.jpg"
      alt="Beautiful antique vase from 1800s"
      width={400}
      height={300}
    />
  );
}
```

### Image Grid

```tsx
import { ProductImageGrid } from '@/components/ProductImage';

const images = [
  { path: '/products/vase-1.jpg', alt: 'Vase angle 1' },
  { path: '/products/vase-2.jpg', alt: 'Vase angle 2' },
  { path: '/products/vase-3.jpg', alt: 'Vase angle 3' },
];

export default function ProductGallery() {
  return (
    <ProductImageGrid
      images={images}
      imageSize="medium"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    />
  );
}
```

### Responsive Image

```tsx
import { ResponsiveProductImage } from '@/components/ProductImage';

export default function HeroImage() {
  return (
    <ResponsiveProductImage
      path="/products/featured-item.jpg"
      alt="Featured collectible"
      sizes="full"
    />
  );
}
```

### Features

- ✅ Automatic WebP conversion
- ✅ Responsive sizing
- ✅ Lazy loading
- ✅ Quality optimization (default: 80)
- ✅ Error handling with fallback UI
- ✅ Loading states with skeleton
- ✅ Dark theme compatible

---

## Troubleshooting

### Common Issues

#### 1. "GOOGLE_APPLICATION_CREDENTIALS not found"

**Problem:** Script can't find the service account JSON file

**Solution:**
```bash
# Make sure google-credentials.json is in project root
ls google-credentials.json

# Check .env.local has correct path
cat .env.local | grep GOOGLE_APPLICATION_CREDENTIALS
```

#### 2. "Service account doesn't have access to folder"

**Problem:** "403 Forbidden" when accessing Google Drive

**Solution:**
1. Open `google-credentials.json`
2. Copy the `client_email` field
3. Go to your Drive folder
4. Share it with that email (Viewer permissions)
5. Wait 30 seconds, then retry

#### 3. "ImageKit authentication failed"

**Problem:** Wrong public/private keys

**Solution:**
```bash
# Double-check credentials in ImageKit console
# Settings → API Keys

# Verify in .env.local
cat .env.local | grep IMAGEKIT
```

#### 4. "Rate limit exceeded"

**Problem:** Too many uploads too fast

**Solution:**
- Script already includes 500ms delays between uploads
- For large migrations, increase delay in sync script
- Check `sync-results.json` for failed uploads
- Re-run sync (it will skip existing files)

#### 5. "Image not appearing after upload"

**Problem:** Image uploaded but not visible

**Solution:**
1. Check `sync-results.json` for upload status
2. Wait 60 seconds (CDN propagation)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check ImageKit dashboard for uploaded files
5. Verify image path matches

#### 6. "Script crashes with "Cannot find module" errors"

**Problem:** TypeScript/module resolution issues

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .bun
bun install

# Try running directly
bun run scripts/sync-drive-to-imagekit.ts
```

#### 7. "Watch mode hangs or doesn't update"

**Problem:** File watching issues

**Solution:**
```bash
# Kill existing processes
lsof -ti :3000 | xargs kill -9

# Clear build cache
rm -rf .next

# Restart dev server
bun run dev
```

---

## Best Practices

### Security

1. ✅ Never commit credentials to Git
2. ✅ Use `.gitignore` for sensitive files
3. ✅ Rotate service account keys quarterly
4. ✅ Use strong webhook secrets (min 32 characters)
5. ✅ Monitor API usage and set billing alerts

### Performance

1. ✅ Batch uploads during off-peak hours
2. ✅ Use skip-existing to avoid re-uploads
3. ✅ Keep image sizes under 50MB
4. ✅ Use WebP format for better compression
5. ✅ Enable CDN caching in ImageKit

### Maintenance

1. ✅ Review sync results regularly
2. ✅ Delete unused images from ImageKit
3. ✅ Archive old Google Drive backups
4. ✅ Test image paths in templates
5. ✅ Monitor error logs

---

## Additional Resources

- 📚 [ImageKit Documentation](https://docs.imagekit.io/)
- 📚 [Google Drive API Guide](https://developers.google.com/drive/api/guides/about-sdk)
- 📚 [Google Cloud Service Accounts](https://cloud.google.com/docs/authentication/getting-started)
- 📚 [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

## Support

For issues or questions:

1. Check `sync-results.json` for detailed error messages
2. Review troubleshooting section above
3. Check ImageKit console dashboard
4. Verify all credentials in `.env.local`
5. Check Google Cloud Console for API quotas

---

**Last Updated:** November 5, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
