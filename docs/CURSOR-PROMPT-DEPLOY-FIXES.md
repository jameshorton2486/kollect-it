# Cursor AI Prompt: Kollect-It Critical Fixes Deployment

## Context
I have critical fixes for my Kollect-It marketplace that need to be applied. The fix files are currently in my Downloads folder at `C:\Users\james\Downloads`. My project is located at `C:\projects\kollect-it` (or wherever you find it).

## Fix Files in Downloads
These files need to be moved to the correct locations:

| Source File (in Downloads) | Destination |
|---------------------------|-------------|
| `ingest-route.ts.fixed` | `src/app/api/admin/products/ingest/route.ts` |
| `products-route.ts.fixed` | `src/app/api/products/route.ts` |
| `image-parser.ts.fixed` | `src/lib/utils/image-parser.ts` |
| `sku-validation.ts` | `src/lib/sku-validation.ts` (NEW FILE) |
| `apply-critical-fixes.ps1` | Project root (optional, for reference) |
| `CRITICAL_FIXES_SUMMARY*.md` | `docs/CRITICAL_FIXES_SUMMARY.md` |

## What These Fixes Do
1. **Draft Visibility Bug**: Changes `status: 'active'` to `status: 'draft'` in the ingest API so draft products don't appear publicly
2. **SKU Format Mismatch**: Updates validation to accept `PREFIX-YYYY-NNNN` format (e.g., MILI-2025-0001) instead of only `KOL-YYYY-NNNN`

## Tasks to Complete

### Phase 1: Preparation
1. Find my kollect-it project directory (likely `C:\projects\kollect-it` or search for `kollect-it-main`)
2. Verify I'm on the `main` branch
3. Pull latest changes: `git pull origin main`
4. Create timestamped backup folder: `backups/critical-fixes-{timestamp}/`

### Phase 2: Backup Original Files
Before replacing anything, copy these originals to the backup folder:
- `src/app/api/admin/products/ingest/route.ts`
- `src/app/api/products/route.ts`
- `src/lib/utils/image-parser.ts`

### Phase 3: Apply Fixes
1. Copy `C:\Users\james\Downloads\ingest-route.ts.fixed` → `src/app/api/admin/products/ingest/route.ts`
2. Copy `C:\Users\james\Downloads\products-route.ts.fixed` → `src/app/api/products/route.ts`
3. Copy `C:\Users\james\Downloads\image-parser.ts.fixed` → `src/lib/utils/image-parser.ts`
4. Copy `C:\Users\james\Downloads\sku-validation.ts` → `src/lib/sku-validation.ts` (new file)
5. Copy `C:\Users\james\Downloads\CRITICAL_FIXES_SUMMARY*.md` → `docs/CRITICAL_FIXES_SUMMARY.md`

### Phase 4: Verify Build
```powershell
npm install
npm run build
```
If build fails, stop and report the errors.

### Phase 5: Verify Fixes Were Applied
Check these specific lines to confirm fixes are in place:

**In `src/app/api/admin/products/ingest/route.ts`:**
- Line ~323 should have `status: 'draft'` (NOT `status: 'active'`)
- The SKU validation function should accept pattern `/^([A-Z]{3,4})-(\d{4})-(\d{4})$/`

**In `src/app/api/products/route.ts`:**
- The `where` clause should include `isDraft: false`

**In `src/lib/sku-validation.ts`:**
- File should exist and export `validateSKU` and `formatSKU` functions

### Phase 6: Commit and Push
```powershell
git add .
git status
git commit -m "fix: Draft visibility bug + SKU format standardization

CRITICAL FIXES:
- Changed ingested products status from 'active' to 'draft' 
- Added isDraft:false filter to public product listings
- Unified SKU validation to accept PREFIX-YYYY-NNNN format
- Added new sku-validation.ts module

Fixes #draft-visibility #sku-format"

git push origin main
```

### Phase 7: Cleanup Downloads (Optional)
After successful deployment, these files can be deleted from Downloads:
- `ingest-route.ts.fixed`
- `products-route.ts.fixed`
- `image-parser.ts.fixed`
- `sku-validation.ts`
- `apply-critical-fixes.ps1`
- `CRITICAL_FIXES_SUMMARY*.md`
- `kollect-it-critical-fixes.zip`

### Phase 8: Post-Deployment Verification
1. Check Vercel deployment status (should auto-deploy from main)
2. Once deployed, test the ingest API endpoint: `https://kollect-it.com/api/admin/products/ingest` (GET request with auth header should return status and SKU format info)

## Important Notes
- Do NOT modify any files other than the ones listed
- Create backups BEFORE replacing any files
- Stop immediately if the build fails
- The `.fixed` extension is just for identification - remove it when copying

## Success Criteria
- [ ] All 4 files copied to correct locations
- [ ] Build succeeds with no errors
- [ ] Changes committed to git
- [ ] Pushed to GitHub main branch
- [ ] Vercel deployment triggered

## If Something Goes Wrong
Restore from backups:
```powershell
Copy-Item backups/critical-fixes-{timestamp}/* src/ -Recurse -Force
```

---

Please proceed step by step, confirming each phase before moving to the next. Start with Phase 1.
