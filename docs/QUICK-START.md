# ImageKit Sync - Quick Start Guide

**Get your ImageKit + Google Drive sync working in 25 minutes!**

---

## ⚡ The Fastest Way to Start

### 1️⃣ Install Dependencies (1 minute)
```bash
bun add imagekit googleapis dotenv
```

### 2️⃣ Run Interactive Setup (15 minutes)
```bash
bun run setup:imagekit
```

This wizard will:
- ✅ Check dependencies
- ✅ Guide you through Google Cloud setup
- ✅ Collect your ImageKit credentials
- ✅ Create `.env.local` automatically
- ✅ Run your first sync
- ✅ Verify everything works

### 3️⃣ Done! Start Using Images (5 minutes)
```tsx
import { ProductImage } from '@/components/ProductImage';

<ProductImage
  path="/products/item.jpg"
  alt="Product"
  width={400}
  height={300}
/>
```

---

## 📋 What You Need

**Google Cloud:**
- Google account
- Google Drive folder with product images

**ImageKit:**
- ImageKit account (free tier works)
- Your API keys

---

## 🚀 Key Commands

```bash
# One-time setup
bun run setup:imagekit

# Sync images (run anytime)
bun run sync-images

# Check sync results
bun run sync-status

# Auto-sync on changes
bun run sync-images:watch

# Get help & troubleshooting
bun run sync-help
```

---

## 🔧 Manual Setup (If You Prefer)

### Step 1: Google Cloud Setup
1. Go to https://console.cloud.google.com/
2. Create new project: `Kollect-It ImageKit Sync`
3. Enable Google Drive API (APIs & Services > Library)
4. Create Service Account (APIs & Services > Credentials)
5. Create JSON Key and save as `google-credentials.json`
6. Share your Drive folder with the service account email

### Step 2: Get Your IDs
- **Google Drive Folder ID:** From URL after `/folders/`
- **ImageKit Public Key:** Settings > API Keys
- **ImageKit Private Key:** Settings > API Keys

### Step 3: Create `.env.local`
```env
IMAGEKIT_PUBLIC_KEY=public_xxx
IMAGEKIT_PRIVATE_KEY=private_xxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
WEBHOOK_SECRET=generate_random_32_chars
```

### Step 4: Run Sync
```bash
bun run sync-images
```

---

## ❌ Common Issues

**Problem:** `google-credentials.json not found`
- **Fix:** Download from Google Cloud Console and save in project root

**Problem:** `Service account doesn't have access`
- **Fix:** Share your Drive folder with the service account email

**Problem:** `ImageKit authentication failed`
- **Fix:** Verify private key in `.env.local` (no extra spaces)

**Problem:** `Module not found`
- **Fix:** Run `bun install` and `bun run build`

---

## 📚 Next Steps

1. **Documentation:** Read `docs/IMAGEKIT-SETUP.md` for details
2. **Examples:** Check `docs/IMAGEKIT-QUICK-REFERENCE.md` for usage patterns
3. **Help:** Run `bun run sync-help` for comprehensive guide
4. **Status:** Use `bun run sync-status` to check sync results

---

## ✅ Success Checklist

- [ ] Ran `bun run setup:imagekit`
- [ ] `.env.local` created with credentials
- [ ] `google-credentials.json` in project root
- [ ] First sync completed successfully
- [ ] Images visible in ImageKit dashboard
- [ ] Using ProductImage component in pages

---

**That's it!** You're ready to use ImageKit for your product images! 🎉

For more help: `bun run sync-help`
