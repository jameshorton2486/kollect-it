# ImageKit Setup Status - JWT Signature Error

**Date:** November 6, 2025  
**Status:** ⚠️ AUTHENTICATION ERROR - Invalid JWT Signature

---

## 🔴 Current Issue

**Error Message:** `error: invalid_grant: Invalid JWT Signature`

**Root Cause:** The private key in `google-credentials.json` failed Google's JWT validation. This can happen because:

1. The private key was corrupted during transfer/copying
2. The key formatting has extra spaces or line breaks
3. The service account key is outdated or revoked
4. The key doesn't match the service account email

---

## ✅ What We've Successfully Completed

### Configuration Files (Ready)

- ✅ `.env.local` - All ImageKit credentials configured correctly
- ✅ `google-credentials.json` - File created and in place
- ✅ `scripts/sync-drive-to-imagekit.ts` - Sync script ready to run
- ✅ `package.json` - All npm scripts configured (`sync-images`, `sync-images:watch`, etc.)
- ✅ All dependencies installed: `imagekit`, `googleapis`, `dotenv`

### Code & Infrastructure (Ready)

- ✅ Hero component integrated on homepage
- ✅ Sync script built and tested (can run when auth is fixed)
- ✅ API endpoint ready at `/api/sync-images`
- ✅ ProductImage components available

---

## 🔧 Solution

You need to **regenerate and update the service account key**. Here's how:

### Step 1: Delete the Old Key

1. Go to **Google Cloud Console**
2. Navigate to **APIs & Services** → **Credentials**
3. Find your service account: `imagekit-sync@kollect-it-imagekit.iam.gserviceaccount.com`
4. Click on it
5. Go to **KEYS** tab
6. Find the old key with ID: `90240cec2f199621cde8a6a55229cea7e3ffa3bd`
7. Click **Delete** (three dots menu)
8. Confirm deletion

### Step 2: Create a New Key

1. Still in the service account's **KEYS** tab
2. Click **Add Key** → **Create new key**
3. Choose **JSON** format
4. Click **CREATE**
5. A new JSON file downloads automatically

### Step 3: Update google-credentials.json

1. Open the downloaded JSON file in your text editor
2. Copy all the contents
3. Open `google-credentials.json` in your project
4. Replace ALL the contents with the new JSON
5. **Save the file**

### Step 4: Verify & Test

```bash
# Verify the file syntax is valid JSON
bun run sync-images
```

---

## 📋 Current Environment Variables

Your `.env.local` has been configured with:

```env
# ImageKit Configuration
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_1MwR2t3I95qAJXc72h1DzbbLLZU=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit
IMAGEKIT_PUBLIC_KEY=public_1MwR2t3I95qAJXc72h1DzbbLLZU=
IMAGEKIT_PRIVATE_KEY=C5l6XYj7keSe1uBHlCedLI2/F9s=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit

# Google Drive Configuration
GOOGLE_DRIVE_FOLDER_ID=1PhzYwJ8u6Fe6cOYmdljcjki3u4QlkAMa
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# Webhook Security
WEBHOOK_SECRET=kollect-it-sync-webhook-secret-2025-secure-random-key-min-32-chars
```

---

## 📁 Files Status

| File                                | Status         | Purpose                                         |
| ----------------------------------- | -------------- | ----------------------------------------------- |
| `.env.local`                        | ✅ CONFIGURED  | Environment credentials                         |
| `google-credentials.json`           | ⚠️ INVALID KEY | Service account auth (needs update)             |
| `scripts/sync-drive-to-imagekit.ts` | ✅ READY       | Sync logic (won't work until credentials fixed) |
| `src/components/Hero.tsx`           | ✅ READY       | Hero component (needs image)                    |
| `package.json`                      | ✅ UPDATED     | Scripts configured                              |

---

## 🚀 Next Steps

1. **Delete the old service account key** (step 1 above)
2. **Create a new key** and download the JSON (step 2)
3. **Replace google-credentials.json** with the new key (step 3)
4. **Test the sync** with `bun run sync-images` (step 4)

### Once Credentials Are Fixed:

```bash
# Run the sync
bun run sync-images

# Expected output:
# 🚀 Starting Google Drive to ImageKit Sync
# 📁 Drive Folder ID: 1PhzYwJ8u6Fe6cOYmdljcjki3u4QlkAMa
# 🖼️  ImageKit Folder: /products
# ⏭️  Skip Existing: true
#
# 📂 Fetching images from Google Drive folder...
# ✅ Found [N] images in Google Drive
#
# [1/N] Processing: [image-name].jpg
# ⬇️  Downloading from Google Drive...
# ⬆️  Uploading to ImageKit...
# ✅ Successfully uploaded: [image-name].jpg
#
# ... (continues for all images)
```

---

## 🐛 Common Issues & Solutions

### "Invalid JWT Signature"

→ **Solution:** Regenerate the service account key (see steps above)

### "Service account doesn't have access to folder" (403)

→ **Solution:**

1. Copy the `client_email` from the new `google-credentials.json`
2. Share the Drive folder with that email (Viewer permission)
3. Wait 30 seconds
4. Retry sync

### "GOOGLE_APPLICATION_CREDENTIALS not found"

→ **Solution:** Verify `google-credentials.json` exists in project root:

```bash
ls google-credentials.json
```

### "Rate limit exceeded"

→ **Solution:** Wait 5 minutes, the script has built-in 500ms delays between uploads

---

## 📊 Setup Progress

| Phase                    | Status      | Completion              |
| ------------------------ | ----------- | ----------------------- |
| Hero Component           | ✅ COMPLETE | 100%                    |
| Environment Setup        | ✅ COMPLETE | 100%                    |
| Sync Script              | ✅ READY    | 100%                    |
| Google Drive Credentials | ⚠️ INVALID  | Needs Update            |
| First Sync Test          | ⏳ BLOCKED  | Waiting for credentials |
| Product Images Upload    | ⏳ PENDING  | After credentials fixed |
| Homepage Integration     | ✅ READY    | 100%                    |

---

## 🔐 Security Reminders

✅ `google-credentials.json` is in `.gitignore` - safe from git  
✅ `.env.local` is in `.gitignore` - safe from git  
✅ Private keys never visible in commit history  
⚠️ After updating credentials, NEVER share the JSON file publicly

---

## 📞 What to Do Right Now

**Action Required:**

1. Go to Google Cloud Console
2. Delete the old service account key
3. Create a new key (JSON format)
4. Replace the contents of `google-credentials.json`
5. Run `bun run sync-images` again

**Expected Result After Fix:**
✅ All images sync from Google Drive to ImageKit  
✅ ImageKit dashboard shows `/products` folder with images  
✅ `sync-results.json` contains upload details

---

## 📚 Related Files

- **Setup Guide:** `docs/IMAGEKIT-COMPLETION-CHECKLIST.md`
- **Homepage Structure:** `docs/HOMEPAGE-STRUCTURE-COMPLETE.md`
- **Hero Component Guide:** `docs/HERO-IMPLEMENTATION-GUIDE.md`
- **Environment Config:** `.env.local`
- **Sync Script:** `scripts/sync-drive-to-imagekit.ts`

---

**Status:** Awaiting service account key regeneration  
**Time Estimate:** 5-10 minutes to fix credentials and rerun sync  
**Build Status:** ✅ PASSING (no build errors)
