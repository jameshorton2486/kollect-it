# ImageKit Integration - Quick Reference Card

**Cheat Sheet for Developers | November 5, 2025 | Status: ✅ Production Ready**

## ⚡ Quick Start (2 minutes)

### 1. Copy & Update Env File
```bash
# Download google-credentials.json from Google Cloud Console
# Place in project root

# Edit .env.local with your credentials:
IMAGEKIT_PRIVATE_KEY=your_private_key
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
WEBHOOK_SECRET=generate_strong_random_string
```

### 2. Install & Run
```bash
bun add imagekit googleapis dotenv
bun run sync-images
```

### 3. Done! ✅
Results saved to `sync-results.json`

---

## 🎯 Commands

```bash
# Run sync once
bun run sync-images

# Watch mode (auto-run on changes)
bun run sync-images:watch

# Trigger via API
curl -X POST http://localhost:3000/api/sync-images \
  -H "Content-Type: application/json" \
  -d '{"secret": "your_webhook_secret"}'

# Check sync status
curl http://localhost:3000/api/sync-images?syncId=sync_123456
```

---

## 🖼️ Using ProductImage Component

```tsx
import { ProductImage } from '@/components/ProductImage';

<ProductImage
  path="/products/item.jpg"
  alt="Product description"
  width={400}
  height={300}
/>
```

---

## 📁 File Structure

```
types/
  └── imagekit.ts              (16 TypeScript interfaces)

scripts/
  └── sync-drive-to-imagekit.ts  (Main sync script)

src/
  ├── components/
  │   └── ProductImage.tsx     (3 React components)
  └── app/api/
      └── sync-images/
          └── route.ts         (API endpoint)

docs/
  ├── IMAGEKIT-SETUP.md        (Complete setup guide)
  ├── IMAGEKIT-IMPLEMENTATION-COMPLETE.md  (This overview)
  └── PRODUCTIMAGE-EXAMPLES.tsx  (6 usage examples)
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `IMAGEKIT_PRIVATE_KEY` | ✅ | From ImageKit dashboard |
| `IMAGEKIT_PUBLIC_KEY` | ✅ | From ImageKit dashboard |
| `IMAGEKIT_URL_ENDPOINT` | ✅ | `https://ik.imagekit.io/kollectit` |
| `GOOGLE_DRIVE_FOLDER_ID` | ✅ | From Google Drive URL |
| `GOOGLE_APPLICATION_CREDENTIALS` | ✅ | Path to `google-credentials.json` |
| `WEBHOOK_SECRET` | ⚠️ | For API security (recommended) |

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Credentials not found | Check files in project root |
| Access denied (403) | Share Drive folder with service account |
| Auth failed | Verify private key in .env.local |
| Rate limit | Wait 5 min, script includes delays |
| Build errors | Run `bun install && bun run build` |

See `docs/IMAGEKIT-SETUP.md` for detailed troubleshooting.

---

## 📊 What Gets Synced

- ✅ All JPEG, PNG, WebP, GIF images
- ✅ From specified Google Drive folder
- ✅ Auto-detects and skips duplicates
- ✅ Preserves original filenames
- ✅ Adds tags for organization

---

## 📝 Output Files

**sync-results.json** - Created after each sync:
```json
{
  "summary": {
    "filesFound": 42,
    "filesUploaded": 38,
    "filesSkipped": 4,
    "filesFailed": 0,
    "totalBytes": 256420000,
    "duration": "8 minutes 45 seconds"
  },
  "results": [
    {
      "fileName": "item.jpg",
      "status": "success",
      "message": "Uploaded successfully",
      "imagekitUrl": "https://ik.imagekit.io/..."
    }
  ]
}
```

---

## 🔄 Sync Flow

1. **Scan** Drive folder for images
2. **Check** if already in ImageKit (skip duplicates)
3. **Download** new images as buffers
4. **Upload** to ImageKit CDN
5. **Report** results to sync-results.json

---

## 💡 Tips

- ✅ Run syncs during off-peak hours
- ✅ Check sync-results.json after each run
- ✅ Rotate credentials quarterly
- ✅ Keep google-credentials.json in .gitignore (already done)
- ✅ Use webhook secret for API security
- ✅ Monitor ImageKit dashboard for usage

---

## 📚 Documentation

- **Setup Guide:** `docs/IMAGEKIT-SETUP.md`
- **Implementation Details:** `docs/IMAGEKIT-IMPLEMENTATION-COMPLETE.md`
- **Code Examples:** `docs/PRODUCTIMAGE-EXAMPLES.tsx`
- **Type Definitions:** `types/imagekit.ts`

---

## ✅ Status

- ✅ System implemented and ready
- ✅ Build verified (all TypeScript compiles)
- ✅ Committed to Git (commit 0071c69)
- ✅ Documentation complete
- ✅ Examples provided

**Next Step:** Download google-credentials.json and update .env.local

---

**Version:** 1.0.0  
**Last Updated:** November 5, 2025  
**Status:** ✅ Production Ready
