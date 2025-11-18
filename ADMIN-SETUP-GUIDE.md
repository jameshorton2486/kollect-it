# Admin User Setup Guide

**Status**: Your authentication system is ready, but needs an admin user created  
**Date**: November 17, 2025

---

## 🔐 How Authentication Works

Your system uses **email + password** login (NOT Google OAuth).

To use the admin dashboard, you need to:
1. ✅ Create an admin user in the database
2. ✅ Set a password for that user
3. ✅ Login at https://kollect-it.vercel.app/admin/login

---

## 🚀 Quick Setup (2 minutes)

### Option A: Create Admin User Locally (Recommended)

**Step 1: Run the local development server**
```bash
bun run dev
```

**Step 2: Create the admin account**
```bash
# Open another terminal in the same directory and run:
bun run tsx scripts/create-admin.ts
```

**Step 3: You'll be prompted for:**
- Email: `admin@kollect-it.com`
- Password: (create a strong password, remember it!)
- Name: `Admin` (or your name)

**Step 4: Login**
- Go to: http://localhost:3000/admin/login
- Email: `admin@kollect-it.com`
- Password: (the one you just created)

---

### Option B: Create Admin User Script (if Option A doesn't work)

Create a new file: `scripts/create-admin.ts`

```typescript
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@kollect-it.com";
  const password = "your-secure-password-here"; // CHANGE THIS!
  const name = "Admin";

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create or update the user
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      password: hashedPassword,
      name,
      role: "admin",
    },
  });

  console.log("✅ Admin user created/updated:", user.email);
  console.log("📧 Email:", user.email);
  console.log("🔐 Use your password to login");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Then run:
```bash
bun run tsx scripts/create-admin.ts
```

---

## 📝 Database Schema (User Table)

Your system uses this user structure:

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String?   // Hashed password
  name      String?
  role      String    @default("user") // "admin" or "user"
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

---

## ✅ After Creating Admin User

### Test Locally First
```bash
bun run dev
```
- Go to: http://localhost:3000/admin/login
- Login with: `admin@kollect-it.com` / your-password
- Should see dashboard ✅

### Then Test on Production
1. Make sure deployment shows "Ready" at: https://vercel.com/jameshorton2486/kollect-it/deployments
2. Go to: https://kollect-it.vercel.app/admin/login
3. Login with same credentials
4. Should work on production too! ✅

---

## 🔑 Login Credentials

After setup, use these to login:

```
Email: admin@kollect-it.com
Password: [YOUR CHOSEN PASSWORD - KEEP THIS SECURE]
```

**Store this somewhere safe!** (Password manager recommended)

---

## 🚨 If You Forget Your Password

If you forget your admin password, you can:

1. **Option 1: Reset in Database** (Supabase)
   - Go to: https://supabase.com/dashboard
   - Select your project: `kollect-it`
   - Go to **SQL Editor**
   - Run: `DELETE FROM "User" WHERE email = 'admin@kollect-it.com';`
   - Then create a new admin user using the script above

2. **Option 2: Create New Admin User**
   - Run the create-admin script with a different email
   - Then use that to login

---

## 📋 Complete Checklist

- [ ] Run `bun run dev` locally
- [ ] Execute admin creation script
- [ ] Test login at http://localhost:3000/admin/login
- [ ] Verify dashboard loads
- [ ] Go to https://kollect-it.vercel.app/admin/login
- [ ] Test production login
- [ ] Create your first product using the 5-step wizard ✨

---

## 🎯 Next Steps After Login

Once you're logged in to the admin dashboard:

1. **Create Your First Product**
   - Click "Create Product" or "Add New Product"
   - Follow the 5-step wizard:
     - Step 1: Setup (SKU, category, notes)
     - Step 2: Upload (10-20 images)
     - Step 3: Analyze (AI generates description)
     - Step 4: Edit (review suggestions)
     - Step 5: Success (confirmation)

2. **Bulk Add 300 Products**
   - Each product takes ~5-10 minutes with manual review
   - Total time: 2-3 hours for all 300 products

3. **Monitor Performance**
   - Watch API usage (Claude, OpenAI, ImageKit)
   - Check Vercel logs for errors
   - Verify database performance

---

## 🆘 Troubleshooting

### Script doesn't find bcryptjs?
```bash
bun add bcryptjs
bun run tsx scripts/create-admin.ts
```

### Can't access Supabase?
- Go to: https://supabase.com/dashboard
- Select your project
- Check if credentials are correct in `.env.local`

### Still can't login?
1. Check browser console for errors (F12)
2. Verify admin user exists in Supabase
3. Verify password was hashed correctly
4. Check `NEXTAUTH_URL` is correct for your environment

---

**Document Version**: 1.0  
**Last Updated**: November 17, 2025  
**Status**: Ready to Execute
