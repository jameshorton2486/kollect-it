# COPILOT MASTER PROMPT - Product System Implementation

## How to Use This Prompt

1. **Open VS Code** in your kollect-it project
2. **Open GitHub Copilot Chat** (Ctrl+Alt+I or Cmd+Alt+I)
3. **Copy this ENTIRE prompt** and paste it into Copilot Chat
4. **Review each change** Copilot makes before accepting
5. **Test incrementally** - don't accept all changes at once

---

## THE PROMPT (Copy Everything Below)

```
I need to implement a comprehensive product management system for my Next.js/Prisma marketplace. This is a PRODUCTION implementation, so be careful and precise.

# CONTEXT
- Project: Kollect-It marketplace for authenticated collectibles
- Stack: Next.js 15, TypeScript, Prisma, Supabase PostgreSQL, ImageKit CDN
- Currently: Basic product creation with single image
- Goal: SKU system + multi-image upload + enhanced AI analysis

# REQUIREMENTS

## 1. DATABASE SCHEMA (Prisma)
Update `prisma/schema.prisma`:

For Product model ADD:
- sku: String @unique (format: SKU-YYYY-XXX)
- skuYear: Int? (for filtering)
- skuNumber: Int? (sequential tracking)
- productNotes: String? @db.Text (raw notes from user)
- appraisalUrls: String[] @default([]) (PDF links)
- Add indexes: @@index([sku]) and @@index([skuYear, skuNumber])

For Image model ADD:
- imageType: String? (values: "main", "condition", "signature", "detail", "provenance")
- Add index: @@index([productId, order])

After updating schema, tell me to run:
npx prisma migrate dev --name add_sku_and_enhanced_images

## 2. UTILITY FUNCTIONS
Create `src/lib/utils/image-parser.ts` with:

Functions needed:
1. parseImageMetadata(filename: string) -> returns {type, order, suggestedAlt}
   - Detect "main", "condition", "signature", "detail", "provenance" from filename
   - Assign smart ordering: main=0, signature=10+, condition=20+, provenance=30+, detail=40+
   - Generate descriptive alt text

2. validateSKU(sku: string) -> returns {valid, error?, parsed?}
   - Check format: SKU-YYYY-XXX
   - Validate year (2020 to current+1)
   - Validate number (001-999)

3. formatSKU(year: number, number: number) -> returns string
   - Format: "SKU-2025-012" with zero-padding

4. extractNumber(filename: string) -> returns number
   - Helper to extract number from filenames like "condition-01.jpg"

## 3. API ROUTES

### A. Create `src/app/api/admin/products/next-sku/route.ts`
GET endpoint that:
- Requires admin authentication
- Accepts ?year= query parameter (default: current year)
- Finds highest skuNumber for that year in database
- Returns { suggestedSKU, year, nextNumber }

### B. Update `src/app/api/admin/products/analyze/route.ts`
Modify POST handler to:
- Accept new parameter: notes (optional string)
- Pass notes to generateProductAnalysis()

### C. Update `src/app/api/admin/products/create/route.ts`
Modify POST handler to:
- Accept: sku, imageUrls (array), productNotes, appraisalUrls
- Validate SKU format using validateSKU()
- Check SKU uniqueness
- Parse skuYear and skuNumber from SKU
- Create product with multiple images using imageUrls array
- Each image should have: url, alt, imageType, order

## 4. COMPONENTS

### A. Create `src/components/admin/MultiImageUpload.tsx`
React component with:
- File input accepting multiple images
- Preview grid showing thumbnails
- Parse metadata from each filename using parseImageMetadata()
- Upload all to ImageKit (use existing /api/imagekit-auth)
- Display upload progress per image
- Allow removing images before upload
- Sort by order after parsing
- Call onImagesUploaded callback with array of {url, type, alt, order}

Props:
- onImagesUploaded: (images: Array<{url, type, alt, order}>) => void
- maxImages?: number (default 30)

### B. Update `src/components/admin/ProductUploadForm.tsx`
Major changes:
1. Add multi-step wizard: setup → upload → analyze → edit → success
2. Step 1 (setup): SKU input, category, notes textarea, appraisal URLs
3. Step 2 (upload): Use MultiImageUpload component
4. Step 3 (analyze): Button to run AI with images + notes
5. Step 4 (edit): Review AI suggestions, edit fields
6. Add auto-SKU suggestion on mount (fetch from /api/admin/products/next-sku)
7. Add SKU validation with real-time feedback
8. Add notes textarea (10 rows) with helpful placeholder
9. Add appraisal URL input (press Enter to add multiple)
10. Update product creation to send all new fields

## 5. AI ENHANCEMENTS

### Update `src/lib/ai/product-generator.ts`
- Add notes parameter to generateProductAnalysis()
- Pass notes to analyzeProductImageWithClaude()
- Log whether notes were provided

### Update `src/lib/ai/claude-product-analyzer.ts`
- Add notes parameter to analyzeProductImageWithClaude()
- Update prompt to use notes when provided
- Incorporate seller's notes into analysis context
- If notes include pricing comparables, reference them in priceReasoning

# IMPORTANT GUIDELINES
1. Preserve all existing functionality
2. Use existing auth patterns (getServerSession, authOptions)
3. Use existing Prisma client import patterns
4. Match existing code style and conventions
5. Add proper TypeScript types
6. Include error handling
7. Add console.log statements for debugging
8. Use existing UI components and styles (Tailwind classes)

# VALIDATION RULES
- SKU must be unique
- SKU format must be SKU-YYYY-XXX
- At least 1 image required
- Main image should have order=0
- All images need alt text

# TESTING HINTS
After implementation, I should be able to:
1. Auto-suggest next SKU
2. Manually override SKU if needed
3. Paste product notes in textarea
4. Upload 5-20 images at once
5. See images automatically ordered by type
6. Run AI analysis with notes context
7. Review and edit AI suggestions
8. Create product with all images and metadata

# FILES TO CREATE/UPDATE
CREATE:
- src/lib/utils/image-parser.ts
- src/app/api/admin/products/next-sku/route.ts
- src/components/admin/MultiImageUpload.tsx

UPDATE:
- prisma/schema.prisma (add fields and indexes)
- src/app/api/admin/products/analyze/route.ts (add notes param)
- src/app/api/admin/products/create/route.ts (handle SKU and multi-image)
- src/components/admin/ProductUploadForm.tsx (major enhancement)
- src/lib/ai/product-generator.ts (add notes param)
- src/lib/ai/claude-product-analyzer.ts (add notes param)

Please implement these changes step by step. After each major change (like creating a new file), show me the code and wait for my confirmation before proceeding to the next file.

Start with the Prisma schema changes first.
```

---

## After Running This Prompt

### What Copilot Will Do:
1. Show you the Prisma schema updates
2. Wait for your confirmation
3. Create the utility functions file
4. Create the new API route
5. Update existing API routes
6. Create the MultiImageUpload component
7. Update the ProductUploadForm component
8. Update the AI functions

### What YOU Should Do:
1. **Review each change carefully** before accepting
2. **Run the migration** after schema changes:
   ```powershell
   npx prisma migrate dev --name add_sku_and_enhanced_images
   ```
3. **Test incrementally** - don't wait until everything is done
4. **Save/commit to Git** after each successful step
5. **Check the browser** for compile errors

### If Copilot Makes Mistakes:
- Tell it specifically what's wrong
- Ask it to "fix the error in [filename]"
- Reference the complete code from IMPLEMENTATION-GUIDE-COMPLETE-CODE.md

### Expected Timeline:
- Schema + migration: 5 minutes
- Utility functions: 10 minutes
- API routes: 15 minutes
- Components: 30 minutes
- AI updates: 10 minutes
- Testing: 30 minutes
**Total: ~1.5-2 hours** (with review and testing)

---

## Alternative: Manual Implementation

If Copilot struggles, use the complete code files from:
**IMPLEMENTATION-GUIDE-COMPLETE-CODE.md**

Simply copy-paste each file in the order listed.

---

## Verification Commands

After implementation, run these to verify:

```powershell
# Check TypeScript compilation
npm run build

# Check for errors
npm run dev

# Open Prisma Studio to verify schema
npx prisma studio

# Check migration history
npx prisma migrate status
```

---

## Common Issues and Fixes

### Issue: "Module not found"
**Fix**: Create the missing file using code from IMPLEMENTATION-GUIDE-COMPLETE-CODE.md

### Issue: Prisma Client out of sync
**Fix**: 
```powershell
npx prisma generate
```

### Issue: Migration fails
**Fix**: 
```powershell
# Check current state
npx prisma migrate status

# Reset if needed (ONLY on dev database)
npx prisma migrate reset
```

### Issue: TypeScript errors
**Fix**: Make sure all imported types exist and Prisma Client is regenerated

---

This prompt is designed for autonomous implementation with minimal supervision. Good luck!
