# ImageKit Integration - Completion Checklist

**Last Updated:** November 5, 2025  
**Status:** Ready for Manual Configuration & Execution

---

## 📋 Complete Step-by-Step Guide (Do These In Order)

### ✅ Step 1: Install Dependencies (2 minutes)

```bash
bun add imagekit googleapis dotenv
```

**What this does:** Installs the three packages needed:

- `imagekit` — ImageKit SDK for uploads
- `googleapis` — Google Drive API client
- `dotenv` — Environment variable loader

**Verify it worked:**

```bash
bun list | grep -E "imagekit|googleapis|dotenv"
```

---

### ✅ Step 2: Create Google Cloud Project (5 minutes)

1. Go to **https://console.cloud.google.com/**
2. Click the **project selector dropdown** (top-left)
3. Click **NEW PROJECT**
4. Enter name: `Kollect-It ImageKit Sync`
5. Click **CREATE**
6. Wait ~60 seconds for project to initialize
7. Select the new project from dropdown

**Note:** Keep this tab open — you'll need it for all remaining steps.

---

### ✅ Step 3: Enable Google Drive API (3 minutes)

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search: `Google Drive API`
3. Click on it
4. Click **ENABLE**
5. Wait for confirmation

**Verify:** Return to **APIs & Services** → **Library** and confirm "Google Drive API" shows status "Enabled"

---

### ✅ Step 4: Create Service Account (3 minutes)

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS**
3. Select **Service Account**
4. Fill in:
   - **Service account name:** `imagekit-sync`
   - **Service account ID:** (auto-filled, leave as is)
   - **Description:** `Service account for syncing Google Drive images to ImageKit`
5. Click **CREATE AND CONTINUE**
6. Skip optional grant section — click **CONTINUE**
7. Click **DONE**

**Verify:** Return to **Credentials** page and find your service account in the list.

---

### ✅ Step 5: Generate & Save Service Account Key (3 minutes)

1. On **Credentials** page, find **Service Accounts** section
2. Click on your service account: `imagekit-sync@[project-id].iam.gserviceaccount.com`
3. Go to **KEYS** tab
4. Click **Add Key** → **Create new key**
5. Choose **JSON** format
6. Click **CREATE**
7. A JSON file downloads automatically

**Important:**

- Rename it to: `google-credentials.json`
- Save to project root: `c:\Users\james\kollect-it-marketplace-1\google-credentials.json`
- **⚠️ NEVER commit this file** (already in `.gitignore`)

**Verify file exists:**

```bash
ls google-credentials.json
```

---

### ✅ Step 6: Share Google Drive Folder (2 minutes)

1. Open your Google Drive folder containing product images
2. Right-click the folder → **Share**
3. Open `google-credentials.json` in a text editor
4. Find the line: `"client_email": "imagekit-sync@project-id..."`
5. Copy that email address
6. Paste it into the Share dialog
7. Select **Viewer** permission (not Editor)
8. Click **Share**

**Verify:** You should see the service account email in the folder's sharing list with "Viewer" access.

---

### ✅ Step 7: Extract Google Drive Folder ID (1 minute)

1. Open your Drive folder in browser
2. Look at the URL bar
3. Copy the ID from the URL: `https://drive.google.com/drive/folders/[FOLDER_ID]`
4. The ID is the long string after `/folders/`

**Example:**

```
URL: https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
ID:  1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

**Save this ID** — you'll need it in Step 9.

---

### ✅ Step 8: Get ImageKit Private Key (2 minutes)

1. Sign in to **https://imagekit.io**
2. Go to **Settings** → **API Keys**
3. Copy your **Private Key** (long string starting with something like `private_...`)

**Verify:** The private key should be ~64 characters long.

---

### ✅ Step 9: Update .env.local (2 minutes)

Edit `c:\Users\james\kollect-it-marketplace-1\.env.local`:

```env
# ImageKit Configuration
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_1MwR2t3I95qAJXc72h1DzbbLLZU=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit
IMAGEKIT_PUBLIC_KEY=public_1MwR2t3I95qAJXc72h1DzbbLLZU=
IMAGEKIT_PRIVATE_KEY=your_private_key_from_step_8_here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit

# Google Drive Configuration
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_from_step_7_here
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# Webhook Security (for /api/sync-images endpoint)
WEBHOOK_SECRET=your_random_secret_min_32_chars_here
```

**For WEBHOOK_SECRET**, generate a random string:

```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -SetSeed (Get-Date).Millisecond -InputObject (1..128) | ForEach-Object {[char]$_}) -join ''))
```

Or just use any random 32+ character string.

**Verify:** `.env.local` exists and has no syntax errors.

---

### ✅ Step 10: Run First Sync (5-10 minutes)

```bash
bun run sync-images
```

**Expected output:**

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

... (continues for all images)

============================================================
📊 SYNC SUMMARY
============================================================
📁 Files Found:     42
✅ Files Uploaded:  42
⏭️  Files Skipped:   0
❌ Files Failed:    0
💾 Total Bytes:     256.42 MB
⏱️  Duration:        8 minutes 32 seconds
============================================================
💾 Results saved to: sync-results.json
```

**If errors occur**, check the console output for specific error messages (permissions, auth, rate limits).

---

### ✅ Step 11: Verify Sync Results (2 minutes)

1. **Check sync-results.json:**

   ```bash
   cat sync-results.json
   ```

   Look for:
   - `filesUploaded` > 0
   - `filesFailed` = 0 (or low count)
   - Array of uploaded files with URLs

2. **Check ImageKit Dashboard:**
   - Go to https://imagekit.io/dashboard
   - Navigate to **Media Library**
   - Look for a `/products` folder
   - Confirm images are there with correct URLs

3. **Test a URL (optional):**
   ```
   https://ik.imagekit.io/kollectit/products/[image-name].jpg
   ```
   Should load the image in your browser.

---

## 🚀 Using ProductImage Component (After Sync Complete)

Once images are synced to ImageKit, use them in your pages:

```tsx
import { ProductImage } from "@/components/ProductImage";

export default function ProductPage() {
  return (
    <ProductImage
      path="/products/antique-vase.jpg"
      alt="Beautiful antique vase"
      width={400}
      height={300}
    />
  );
}
```

---

## 📊 Expected Results After Completion

| Metric            | Expected Value                                            |
| ----------------- | --------------------------------------------------------- |
| Images Synced     | All images in your Drive folder                           |
| ImageKit Folder   | `/products` containing all images                         |
| ImageKit URLs     | `https://ik.imagekit.io/kollectit/products/[name].jpg`    |
| sync-results.json | Complete report with per-file details                     |
| Build Status      | ✅ All TypeScript compiles                                |
| Components Ready  | ✅ ProductImage, ProductImageGrid, ResponsiveProductImage |

---

## 🐛 Troubleshooting

### "GOOGLE_APPLICATION_CREDENTIALS not found"

- **Solution:** Verify `google-credentials.json` exists in project root
  ```bash
  ls google-credentials.json
  ```

### "Service account doesn't have access to folder" (403 error)

- **Solution:**
  1. Copy `client_email` from `google-credentials.json`
  2. Share Drive folder with that email (Viewer permission)
  3. Wait 30 seconds, retry sync

### "ImageKit authentication failed"

- **Solution:**
  1. Verify `IMAGEKIT_PRIVATE_KEY` in `.env.local`
  2. Go to imagekit.io → Settings → API Keys
  3. Copy the correct private key (not public key)
  4. Update `.env.local` and retry

### "No images found in Google Drive folder"

- **Solution:**
  1. Verify `GOOGLE_DRIVE_FOLDER_ID` is correct
  2. Confirm folder has supported images (jpg, png, webp, gif)
  3. Check folder was shared with service account

### "Rate limit exceeded"

- **Solution:** Script includes 500ms delays. Wait 5 minutes, then retry.

### "sync-results.json shows failures"

- **Solution:** Check error details in `sync-results.json`
  ```bash
  cat sync-results.json | grep -A 5 "failed"
  ```

---

## 🔒 Security Reminders

✅ **DO:**

- Keep `google-credentials.json` in `.gitignore`
- Keep `.env.local` in `.gitignore`
- Use strong `WEBHOOK_SECRET` (32+ characters)
- Rotate credentials quarterly

❌ **DON'T:**

- Commit `google-credentials.json` to Git
- Commit `.env.local` to Git
- Share private keys in code or messages
- Use weak webhook secrets

---

## 📞 Commands Reference

```bash
# Install dependencies
bun add imagekit googleapis dotenv

# Run sync (uploads all images from Drive to ImageKit)
bun run sync-images

# Check status (if you added sync:status script)
bun run sync:status

# Check results file
cat sync-results.json

# View env variables (verify they loaded)
echo $IMAGEKIT_PRIVATE_KEY
echo $GOOGLE_DRIVE_FOLDER_ID
```

---

## ✅ Final Verification Checklist

Before you consider this complete, verify:

- [ ] Dependencies installed: `bun add imagekit googleapis dotenv`
- [ ] Google Cloud project created
- [ ] Google Drive API enabled
- [ ] Service account created (`imagekit-sync`)
- [ ] Service account key downloaded and saved as `google-credentials.json`
- [ ] Drive folder shared with service account (Viewer permission)
- [ ] Folder ID extracted and saved
- [ ] ImageKit private key copied
- [ ] `.env.local` updated with all credentials
- [ ] `bun run sync-images` executed successfully
- [ ] `sync-results.json` shows successful uploads
- [ ] ImageKit dashboard shows `/products` folder with images
- [ ] Test ProductImage component loads images correctly

---

## 🎉 Success!

Once all steps are complete:

1. ✅ Images are hosted on ImageKit CDN
2. ✅ ProductImage component can load them
3. ✅ Full-featured sync script available for future updates
4. ✅ API endpoint ready for webhook-triggered syncs

**Next Steps:**

- Integrate ProductImage into product pages
- Set up scheduled syncs (optional)
- Monitor ImageKit usage and costs

---

**Status:** Ready for execution  
**Estimated Time:** ~45 minutes (mostly waiting for Google Cloud setup)  
**Last Updated:** November 5, 2025
