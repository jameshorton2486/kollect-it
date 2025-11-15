# How to Regenerate Google Cloud Service Account Keys

**Date:** November 6, 2025  
**Purpose:** Fix JWT Signature error by creating new service account keys

---

## Problem

Both existing service account keys are failing with:

```
error: invalid_grant: Invalid JWT Signature
```

This means the keys are likely **disabled** or **revoked** in Google Cloud Console.

---

## Solution: Regenerate New Keys

### Step 1: Go to Google Cloud Console

1. **Open:** https://console.cloud.google.com/
2. **Sign in** with your Google account (the one that owns the kollect-it-imagekit project)

---

### Step 2: Select the Project

1. Click on the **project selector** at the top left
2. Search for and select: **kollect-it-imagekit**

---

### Step 3: Navigate to Service Accounts

1. In the left sidebar, go to: **APIs & Services**
2. Click on: **Credentials**
3. You should see your service account: `imagekit-sync@kollect-it-imagekit.iam.gserviceaccount.com`
4. **Click on it** to open the service account details

---

### Step 4: Check Service Account Status

1. You're now on the service account details page
2. Look at the top - verify the service account is **ENABLED** (not disabled)
3. If it says "Disabled", click the **Enable** button

---

### Step 5: Delete Old Keys

1. Click on the **KEYS** tab
2. You should see the old keys:
   - `700dc99af5fe6f9482ee2f012167076b6bf33340`
   - `90240cec2f199621cde8a6a55229cea7e3ffa3bd`
3. For each key, click the **three dots menu** (⋮) and select **Delete**
4. Confirm deletion

---

### Step 6: Create New Service Account Key

1. Still on the **KEYS** tab
2. Click **+ CREATE KEY**
3. Select: **JSON**
4. Click **Create**
5. **A JSON file will download** - this is your new `google-credentials.json`
   - ⚠️ **IMPORTANT:** Keep this file secure! It contains your private key!

---

### Step 7: Update Your Project

Once you have the new JSON file:

1. **Open the downloaded JSON file** in a text editor
2. **Copy the entire contents**
3. Go back to your terminal/project and do ONE of the following:

#### Option A: Copy File Directly (Recommended)

```powershell
# If the file downloaded to Downloads:
Copy-Item -Path "c:\Users\james\Downloads\kollect-it-imagekit-*.json" -Destination "c:\Users\james\kollect-it-marketplace-1\google-credentials.json" -Force

# Verify it worked:
Get-Content "c:\Users\james\kollect-it-marketplace-1\google-credentials.json" | ConvertFrom-Json | Select-Object type, project_id, client_email
```

#### Option B: Paste JSON Content

1. In VS Code, open `google-credentials.json`
2. Select all and delete current content
3. Paste the new JSON content
4. Save file (Ctrl+S)

---

### Step 8: Verify the New Key Works

Run this command:

```bash
cd c:\Users\james\kollect-it-marketplace-1
bun run sync-images
```

**Expected output:**

```
🚀 Starting Google Drive to ImageKit Sync
📁 Drive Folder ID: [REDACTED-FOLDER-ID]
🖼️  ImageKit Folder: /products
✅ Found X images in Google Drive
[Uploading files...]
```

If you see this, the new key is working! ✅

---

### Troubleshooting

**Still getting "Invalid JWT Signature"?**

Check:

1. ✅ Service account is ENABLED in Google Cloud Console
2. ✅ Service account has access to the Google Drive folder
3. ✅ You copied the NEWEST key (not an old one)
4. ✅ `google-credentials.json` has valid JSON (no markdown code blocks)

**Need to grant permissions?**

1. Go to the Google Drive folder: https://drive.google.com/drive/folders/[REDACTED-FOLDER-ID]
2. Right-click → Share
3. Paste the service account email: `imagekit-sync@kollect-it-imagekit.iam.gserviceaccount.com`
4. Set permission to **Editor**
5. Click Share

---

## Summary

| Step | Action                                  |
| ---- | --------------------------------------- |
| 1    | Go to Google Cloud Console              |
| 2    | Select kollect-it-imagekit project      |
| 3    | Go to APIs & Services → Credentials     |
| 4    | Click on imagekit-sync service account  |
| 5    | Verify it's ENABLED                     |
| 6    | Delete old keys                         |
| 7    | Create new JSON key                     |
| 8    | Copy new key to google-credentials.json |
| 9    | Run `bun run sync-images` to test       |

Once the new key is working, the sync will upload all images from Google Drive to ImageKit! 🎉
