# 🚀 Automated ImageKit Sync Setup

**Professional, fully-automated setup system for Google Drive to ImageKit syncing**

---

## What This Does

Completely automates your Google Drive to ImageKit image synchronization with:

✅ **Interactive Setup Wizard** - Guides you through every step  
✅ **Automatic Validation** - Checks credentials before proceeding  
✅ **Dependency Management** - Installs required packages automatically  
✅ **Environment Configuration** - Creates `.env.local` automatically  
✅ **First Sync Execution** - Uploads your first batch of images  
✅ **Status Monitoring** - Shows sync results and statistics  
✅ **Built-in Help** - Comprehensive troubleshooting guide  

---

## Getting Started (5 minutes)

### 1. Install Dependencies
```bash
bun add imagekit googleapis dotenv
```

### 2. Run Setup Wizard
```bash
bun run setup:imagekit
```

That's it! The wizard handles the rest.

---

## What You Need Beforehand

### Google Cloud
- [ ] Google account
- [ ] Google Drive folder with product images
- [ ] Access to Google Cloud Console

### ImageKit  
- [ ] ImageKit account (https://imagekit.io)
- [ ] Your API credentials from Settings > API Keys

---

## Available Commands

### Setup & Configuration
```bash
# Interactive setup wizard (run once)
bun run setup:imagekit

# View comprehensive help and troubleshooting
bun run sync-help
```

### Syncing Operations
```bash
# Sync images from Drive to ImageKit
bun run sync-images

# Watch mode - auto-sync on changes
bun run sync-images:watch

# Check last sync results
bun run sync-status
```

---

## How the Setup Wizard Works

When you run `bun run setup:imagekit`, it will:

### Step 1: Check Dependencies
- Verifies all required packages are installed
- Installs missing packages automatically

### Step 2: Google Cloud Configuration
- Guides you to Google Cloud Console
- Explains service account creation
- Validates folder ID format

### Step 3: ImageKit Configuration
- Prompts for ImageKit credentials
- Validates API key format
- Confirms URL endpoint

### Step 4: Webhook Security
- Creates secure webhook secret
- Validates secret strength (min 32 chars)

### Step 5: Service Account Key
- Verifies `google-credentials.json` exists
- Provides download instructions
- Confirms file is in correct location

### Step 6: Environment Setup
- Automatically creates `.env.local`
- Sets all configuration variables
- Never commits secrets to Git

### Step 7: First Sync
- Optionally runs first sync
- Shows progress with emoji indicators
- Displays upload statistics

---

## File Structure

```
kollect-it-marketplace/
├── setup-imagekit-sync.ts           ← Run this first!
├── scripts/
│   ├── sync-drive-to-imagekit.ts    (Main sync logic)
│   ├── sync-status.ts               (Check results)
│   └── sync-help.ts                 (Comprehensive help)
├── types/
│   └── imagekit.ts                  (Type definitions)
├── src/
│   ├── components/
│   │   └── ProductImage.tsx         (React components)
│   └── app/api/
│       └── sync-images/
│           └── route.ts             (Webhook endpoint)
├── .env.local                       (Created automatically)
├── google-credentials.json          (You provide this)
└── sync-results.json                (Created after each sync)
```

---

## Usage Examples

### First Time Setup
```bash
# Run the interactive wizard
bun run setup:imagekit

# Follow the prompts - wizard guides you through:
# 1. Install dependencies
# 2. Google Cloud setup
# 3. ImageKit credentials  
# 4. Webhook security
# 5. Service account key verification
# 6. .env.local creation
# 7. First sync (optional)
```

### Regular Syncing
```bash
# Sync new images
bun run sync-images

# Check what was synced
bun run sync-status

# Auto-sync whenever Drive changes
bun run sync-images:watch
```

### Getting Help
```bash
# Show comprehensive help
bun run sync-help

# View full setup guide
cat docs/IMAGEKIT-SETUP.md

# Quick reference
cat docs/QUICK-START.md
```

---

## Configuration Details

### What Gets Created

**`.env.local`** (automatically created, never committed)
```env
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/yoursubdomain
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
WEBHOOK_SECRET=your_webhook_secret
```

**`google-credentials.json`** (you provide this)
- Download from Google Cloud Console
- Save in project root
- Never commit to Git (in .gitignore)

**`sync-results.json`** (created after each sync)
- Detailed sync statistics
- List of uploaded/skipped files
- Any errors that occurred

---

## Key Features

### 🎯 Zero Configuration Friction
- Wizard walks you through every step
- Automatically installs dependencies
- Creates `.env.local` without manual editing
- Validates everything before proceeding

### 🔐 Security First
- Credentials stored in `.env.local` (not committed)
- Webhook endpoint protected by secret
- Service account has viewer-only permissions
- Automatic .gitignore protection

### 📊 Comprehensive Monitoring
- Progress logged with emoji indicators
- Detailed sync statistics
- Error tracking and reporting
- Status checking anytime

### 🚀 Production Ready
- Handles large image batches
- Duplicate detection (skip re-uploads)
- Rate limiting (500ms between uploads)
- Comprehensive error recovery

---

## Troubleshooting

### "Module not found" errors
```bash
bun install
bun run build
```

### Setup wizard stuck
Press `Ctrl+C` and run again:
```bash
bun run setup:imagekit
```

### Credentials not working
1. Re-run setup wizard: `bun run setup:imagekit`
2. Double-check credentials in `.env.local`
3. Verify Drive folder is shared correctly
4. Check ImageKit dashboard for API key status

### Sync shows 0 files
1. Verify Drive folder ID is correct
2. Check that service account email is in folder share
3. Wait 30 seconds for Drive permissions to propagate
4. Try sync again: `bun run sync-images`

### Need more help?
```bash
bun run sync-help
# Shows comprehensive guide with all commands and troubleshooting
```

---

## What Happens After Setup

1. **First Sync Runs** (optional during setup)
   - Downloads all images from Drive
   - Uploads to ImageKit CDN
   - Creates `sync-results.json` with results

2. **You Can Now Use ProductImage**
   ```tsx
   import { ProductImage } from '@/components/ProductImage';
   
   <ProductImage
     path="/products/item.jpg"
     alt="Product"
     width={400}
     height={300}
   />
   ```

3. **Automate Future Syncs**
   ```bash
   # Manual sync
   bun run sync-images
   
   # Watch mode (auto-sync)
   bun run sync-images:watch
   
   # API endpoint for webhooks
   POST http://localhost:3000/api/sync-images
   ```

---

## Performance

| Operation | Time |
|-----------|------|
| Setup wizard | ~15-20 minutes |
| First sync (50 images) | ~5-10 minutes |
| Subsequent syncs (new images only) | ~1-2 minutes |
| Status check | <1 second |

---

## Security Checklist

- ✅ Private keys protected in `.env.local`
- ✅ `.env.local` excluded from Git
- ✅ `google-credentials.json` in `.gitignore`
- ✅ Webhook endpoint requires secret
- ✅ Service account has viewer-only permissions
- ✅ All credentials stored as environment variables
- ✅ Automatic key rotation capable

---

## Support & Documentation

**Quick Start:** `docs/QUICK-START.md`  
**Complete Setup:** `docs/IMAGEKIT-SETUP.md`  
**Quick Reference:** `docs/IMAGEKIT-QUICK-REFERENCE.md`  
**Implementation Details:** `docs/IMAGEKIT-IMPLEMENTATION-SUMMARY.md`

**Commands:**
- `bun run sync-help` - Comprehensive guide
- `bun run sync-status` - Check last sync results

---

## Next Steps

1. **Run Setup Wizard**
   ```bash
   bun run setup:imagekit
   ```

2. **Verify First Sync**
   - Check ImageKit dashboard for uploaded images
   - Run `bun run sync-status` for details

3. **Start Using Images**
   - Import ProductImage in your pages
   - Set image paths to ImageKit files

4. **Automate Syncing**
   - Set up scheduled syncs (cron, webhooks)
   - Monitor with `bun run sync-status`

---

**Ready to get started?**

```bash
bun run setup:imagekit
```

This command will guide you through everything! 🚀

---

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** November 5, 2025
