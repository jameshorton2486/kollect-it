# Quick Reference: Fix Google Cloud Service Account Keys

## The Problem

```
error: invalid_grant: Invalid JWT Signature
```

This means your service account keys are **disabled or revoked**.

---

## The Solution (3 Quick Steps)

### 1️⃣ Generate New Keys in Google Cloud

```
https://console.cloud.google.com/
  → Select: kollect-it-imagekit
  → APIs & Services → Credentials
  → Click: imagekit-sync@kollect-it-imagekit.iam.gserviceaccount.com
  → KEYS tab
  → + CREATE KEY → JSON → Create
  → File downloads
```

### 2️⃣ Update Your Project

**Option A: Automatic (Recommended)**

```powershell
cd c:\Users\james\kollect-it-marketplace-1
.\scripts\update-credentials.ps1
```

**Option B: Manual**

```powershell
Copy-Item -Path "c:\Users\james\Downloads\kollect-it-imagekit-*.json" `
          -Destination "c:\Users\james\kollect-it-marketplace-1\google-credentials.json" -Force
```

### 3️⃣ Test It

```bash
bun run sync-images
```

---

## Expected Success Output

```
🚀 Starting Google Drive to ImageKit Sync
📁 Drive Folder ID: [REDACTED-FOLDER-ID]
🖼️  ImageKit Folder: /products
✅ Found 5 images in Google Drive
📤 Uploading...
  [============================] 100%
✅ Sync Complete!
📊 Files Uploaded: 5
💾 Results: sync-results.json
```

---

## If Still Getting Error

**Check these:**

- [ ] Service account is **ENABLED** (not grayed out)
- [ ] You downloaded the **NEW** key (not old one)
- [ ] File is **valid JSON** (no markdown code blocks)
- [ ] Service account has **access** to Drive folder

**To grant access:**

1. Open: https://drive.google.com/drive/folders/[REDACTED-FOLDER-ID]
2. Right-click → Share
3. Add: `imagekit-sync@kollect-it-imagekit.iam.gserviceaccount.com`
4. Permission: **Editor**
5. Share

---

## Files Involved

| File                             | Purpose                                        |
| -------------------------------- | ---------------------------------------------- |
| `google-credentials.json`        | Service account key (in project root)          |
| `scripts/update-credentials.ps1` | Helper script to update credentials            |
| `.env.local`                     | Already has GOOGLE_APPLICATION_CREDENTIALS set |

---

## Need Help?

Full guide: `docs/GOOGLE-CLOUD-SERVICE-ACCOUNT-REGENERATE.md`
