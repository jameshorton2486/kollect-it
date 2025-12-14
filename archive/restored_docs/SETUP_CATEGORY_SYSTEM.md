# Category System Setup Guide

## ✅ Good News!

**The seed script already exists and is complete!** It's called `seed-categories.ts` (not `seed-subcategories.ts`) and it handles both categories AND subcategories in one script.

**Location:** `scripts/seed-categories.ts`

This script will seed:
- ✅ 4 main categories (Fine Art, Collectibles, Militaria, Rare Books)
- ✅ 25 subcategories (all properly linked)
- ✅ All with proper slugs and relationships

---

## 🔧 Step 1: Fix DIRECT_URL

This is the critical fix for database migrations.

### Instructions:

1. **Open `.env.local`** in your project root (near `package.json`)

2. **Find your `DATABASE_URL` line** - it should look something like:
   ```env
   DATABASE_URL="postgresql://user:password@host:6543/database"
   ```

3. **Copy that entire line** and paste it directly below

4. **Modify the new line:**
   - Change `DATABASE_URL` → `DIRECT_URL`
   - Change port `6543` → `5432`

### Example:

```env
# Pooled connection (for app queries) - KEEP THIS
DATABASE_URL="postgresql://james:password123@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Direct connection (for migrations) - ADD THIS
DIRECT_URL="postgresql://james:password123@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

### ⚠️ Important Note:

For **Supabase**, the hostname might be different:
- **Pooled (6543):** Usually `*.pooler.supabase.com`
- **Direct (5432):** Usually `*.supabase.co` (no "pooler")

Check your Supabase dashboard → Settings → Database for the correct direct connection string.

---

## 🧪 Step 2: Validate Your Setup

After updating `.env.local`, run this validation script:

```bash
npx tsx scripts/validate-category-setup.ts
```

This will check:
- ✅ DIRECT_URL is set
- ✅ DIRECT_URL uses port 5432
- ✅ Database connection works
- ✅ Category tables exist

---

## 📦 Step 3: Update Database Schema

```bash
# Generate Prisma client with new schema
npx prisma generate

# Push schema changes to database
npx prisma db push
```

If you see errors about DIRECT_URL, go back to Step 1.

---

## 🌱 Step 4: Seed Categories & Subcategories

**The seed script is ready!** Just run:

```bash
npx tsx scripts/seed-categories.ts
```

You should see output like:
```
🌱 Seeding categories and subcategories...

✅ Category: Fine Art
   └─ Subcategory: Paintings
   └─ Subcategory: Prints & Works on Paper
   └─ Subcategory: Photography
   ...
✅ Category: Collectibles
   └─ Subcategory: Coins & Currency
   └─ Subcategory: Sports Memorabilia
   ...

✨ Done! Categories and subcategories seeded.
```

---

## 🤖 Step 5: (Optional) Auto-Assign Existing Products

If you have existing products, automatically categorize them:

```bash
npx tsx scripts/auto-assign-categories.ts
```

This script will:
- Read all your products
- Analyze titles, descriptions, and notes
- Automatically assign categories and subcategories
- Show a summary of what was assigned

**Safe to run multiple times** - it only updates products that need changes.

---

## 📋 Complete Checklist

- [ ] Added `DIRECT_URL` to `.env.local` with port 5432
- [ ] Ran `npx tsx scripts/validate-category-setup.ts` - all checks pass
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma db push` - no errors
- [ ] Ran `npx tsx scripts/seed-categories.ts` - categories created
- [ ] (Optional) Ran `npx tsx scripts/auto-assign-categories.ts` - products categorized

---

## 🐛 Troubleshooting

### "DIRECT_URL is not set"
- Add DIRECT_URL to `.env.local` (see Step 1)

### "DIRECT_URL uses port 6543"
- Change port from 6543 to 5432 in DIRECT_URL

### "Database connection failed"
- Verify credentials in DIRECT_URL
- Check Supabase dashboard for correct direct connection string
- Make sure you're using port 5432, not 6543

### "Category not found" in admin
- Run the seed script: `npx tsx scripts/seed-categories.ts`

### "No categories found"
- Run the seed script
- Check database connection
- Verify seed script ran without errors

---

## 📁 Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `scripts/seed-categories.ts` | Seeds all categories & subcategories | ✅ Ready |
| `scripts/auto-assign-categories.ts` | Auto-categorizes existing products | ✅ Ready |
| `scripts/validate-category-setup.ts` | Validates setup | ✅ Ready |
| `prisma/schema.prisma` | Database schema with Subcategory model | ✅ Updated |
| `src/app/api/categories/route.ts` | API endpoint for categories | ✅ Created |
| `src/app/category/[slug]/page.tsx` | Category landing pages | ✅ Enhanced |
| `src/app/subcategory/[slug]/page.tsx` | Subcategory pages | ✅ Created |

---

## 🎯 What's Already Done

✅ Database schema updated (Subcategory model added)  
✅ Seed script created (handles categories + subcategories)  
✅ API routes created  
✅ Admin UI updated (subcategory dropdowns)  
✅ Public pages created (category & subcategory landing pages)  
✅ Auto-assignment script created  

**You just need to:**
1. Fix DIRECT_URL in `.env.local`
2. Run the setup commands above

---

## 💡 Quick Start (After Fixing DIRECT_URL)

```bash
# 1. Validate setup
npx tsx scripts/validate-category-setup.ts

# 2. Update database
npx prisma generate
npx prisma db push

# 3. Seed categories
npx tsx scripts/seed-categories.ts

# 4. (Optional) Auto-assign products
npx tsx scripts/auto-assign-categories.ts
```

That's it! Your category system will be fully operational. 🎉
