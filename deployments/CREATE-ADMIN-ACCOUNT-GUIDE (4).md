# 👤 CREATE ADMIN ACCOUNT - STEP BY STEP

## Method 1: Using the API Endpoint (Recommended)

### Step 1: Ensure Dev Server is Running
```bash
bun run dev
```
Server should start at: http://localhost:3000

### Step 2: Use PowerShell or Command Prompt

**Open PowerShell and run:**
```powershell
# Create admin user via API
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/create-users" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    users = @(
      @{
        name = "Your Name"
        email = "admin@kollect-it.com"
        password = "YourSecurePassword123!"
        role = "admin"
      }
    )
  } | ConvertTo-Json -Depth 3)
```

**Replace these values:**
- `"Your Name"` → Your actual name
- `"admin@kollect-it.com"` → Your email
- `"YourSecurePassword123!"` → A strong password (use a password manager!)

### Step 3: Verify Creation
You should see a response like:
```json
{
  "success": true,
  "created": [
    {
      "email": "admin@kollect-it.com",
      "name": "Your Name",
      "role": "admin"
    }
  ]
}
```

### Step 4: Test Login
1. Go to: http://localhost:3000/admin/login
2. Enter your email and password
3. You should be redirected to the admin dashboard

---

## Method 2: Using cURL (Mac/Linux)

```bash
curl -X POST http://localhost:3000/api/admin/create-users \
  -H "Content-Type: application/json" \
  -d '{
    "users": [
      {
        "name": "Your Name",
        "email": "admin@kollect-it.com",
        "password": "YourSecurePassword123!",
        "role": "admin"
      }
    ]
  }'
```

---

## Method 3: Using Prisma Studio (Visual Interface)

### Step 1: Open Prisma Studio
```bash
bun x prisma studio
```
This opens a web interface at: http://localhost:5555

### Step 2: Navigate to User Model
- Click on "User" in the left sidebar

### Step 3: Add New Record
- Click "Add record" button
- Fill in these fields:
  - **name:** Your Name
  - **email:** admin@kollect-it.com
  - **password:** (See note below about hashing)
  - **role:** admin
  - **emailVerified:** (leave empty or set current date)
- Click "Save 1 change"

**⚠️ PASSWORD NOTE:** Passwords must be bcrypt hashed. If using this method, you'll need to hash your password first:

```bash
# Install bcrypt-cli if needed
npm install -g bcrypt-cli

# Hash your password
bcrypt-cli "YourSecurePassword123!" 10
# Copy the output hash
```

Then paste the hash (starts with `$2b$10$...`) into the password field.

---

## Method 4: Using a Script (Easiest for Multiple Users)

### Create a script file: `create-admin.ts`

```typescript
// create-admin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('YourSecurePassword123!', 10);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Your Name',
      email: 'admin@kollect-it.com',
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date(),
    },
  });
  
  console.log('✅ Admin user created:', admin.email);
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Run the script:
```bash
bun run create-admin.ts
```

---

## 🔑 IMPORTANT: Password Security

### Use a Strong Password:
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Don't use common words or patterns
- Use a password manager (1Password, Bitwarden, LastPass)

### Example Strong Passwords:
```
K0ll3ct!tAdm1n#2025$Tx
S@nAnt0ni0*Antiqu3s!9
V1nt@g3&Tr3@sur3s#2025
```

---

## 🚨 TROUBLESHOOTING

### Error: "Email already exists"
The email is already in the database. Either:
1. Use a different email
2. Delete the existing user in Prisma Studio
3. Update the existing user's role to "admin"

### Error: "Cannot connect to database"
- Check your `DATABASE_URL` in `.env.local`
- Verify your Supabase database is running
- Run: `bun run test:env` to check configuration

### Error: "404 Not Found" on API endpoint
- Make sure dev server is running: `bun run dev`
- Check you're using the correct URL: `http://localhost:3000`
- Verify the API route exists: `src/app/api/admin/create-users/route.ts`

### Login Not Working
- Verify email and password are correct
- Check `NEXTAUTH_SECRET` is set in `.env.local`
- Try password reset if available
- Check browser console for errors (F12)

---

## ✅ VERIFICATION CHECKLIST

After creating your admin account:

- [ ] Admin account created successfully
- [ ] Can login at `/admin/login`
- [ ] Redirected to `/admin/dashboard` after login
- [ ] Can see admin navigation menu
- [ ] Can access `/admin/products` page
- [ ] Can access `/admin/categories` page
- [ ] Can access `/admin/orders` page

**If all checked → You're ready to start adding categories and products!**

---

## 🔄 NEED TO CREATE MORE ADMIN USERS?

### Multiple Admins Script:

```powershell
# Create multiple users at once
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/create-users" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    users = @(
      @{
        name = "Primary Admin"
        email = "james@kollect-it.com"
        password = "SecurePassword1!"
        role = "admin"
      },
      @{
        name = "Manager User"
        email = "manager@kollect-it.com"
        password = "SecurePassword2!"
        role = "admin"
      },
      @{
        name = "Test Customer"
        email = "customer@test.com"
        password = "TestPassword123!"
        role = "user"
      }
    )
  } | ConvertTo-Json -Depth 3)
```

---

## 📝 NEXT STEPS AFTER ADMIN CREATION

1. ✅ Login to admin dashboard
2. ✅ Create all 9 main categories
3. ✅ Add category images and descriptions
4. ✅ Create your first 5-10 products
5. ✅ Test the checkout process
6. ✅ Customize content pages

**You're now ready to manage your marketplace!** 🎉

---

**Need Help?**
- Run: `bun run health-check` to diagnose issues
- Check: `04-TROUBLESHOOTING.md` in project root
- Review: `.env.example` for required variables
