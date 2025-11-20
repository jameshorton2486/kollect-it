# ⚡ KOLLECT-IT QUICK REFERENCE CARD

**Keep this open while working - your essential commands and info**

---

## 🚨 CRITICAL COMMANDS

```powershell
# System health check (run anytime)
bun run health-check

# Build test (before deploying)
bun run build

# Type check (verify no errors)
bun run typecheck

# Full production verification
bun run verify-production

# Start local dev server
bun run dev

# Generate Prisma client
bun x prisma generate

# Apply database migrations
bun x prisma migrate deploy

# Open database browser
bun x prisma studio

# Check error logs
bun run error-summary

# Verify no bunx commands remain
.\scripts\verify-bun-commands.ps1
```

---

## 🔑 KEY ENVIRONMENT VARIABLES

### Local Development (.env.local)
```
NEXTAUTH_URL="http://localhost:3000"
```

### Production (Vercel)
```
NEXTAUTH_URL="https://kollect-it.com"
```

### Both Must Have:
- DATABASE_URL (Supabase pooled - port 6543)
- DIRECT_URL (Supabase direct - port 5432)
- NEXTAUTH_SECRET (generated secret)
- STRIPE keys (test or live)
- STRIPE_WEBHOOK_SECRET (**different** for local vs production!)
- IMAGEKIT keys
- RESEND_API_KEY

---

## 📂 KEY FILE LOCATIONS

```
C:\Users\james\kollect-it-marketplace-1\
├── .env.local              # ⚠️ Your secrets (NEVER commit!)
├── .env.example            # Template
├── package.json            # Dependencies & scripts
├── vercel.json             # Vercel configuration
├── prisma/schema.prisma    # Database schema
├── src/lib/auth.ts         # Authentication
├── src/app/api/            # API routes
│   ├── webhooks/stripe/    # Stripe webhook handler
│   └── health/             # Health check endpoint
├── logs/                   # Error logs
├── scripts/                # Utility scripts
└── docs/                   # Documentation
```

---

## 🎯 COMMON ISSUES & INSTANT FIXES

### Issue: `bunx: command not found`
**Fix:** Use `bun x` instead (not `bunx`)
```powershell
bun x prisma generate
```

### Issue: Database connection fails
**Test connection:**
```powershell
bun x prisma db pull
```
**Check:** DATABASE_URL and DIRECT_URL in .env.local

### Issue: Build fails
**Diagnose:**
```powershell
bun run typecheck        # Check TypeScript errors
bun x tsc --noEmit      # Detailed TypeScript check
bun x prisma generate   # Regenerate Prisma client
bun run build           # Try build again
```

### Issue: Admin login doesn't work
**Create admin:**
```powershell
bun run scripts/create-admin.ts
```
**Credentials:**
- Email: admin@kollect-it.com
- Password: KollectIt@2025Admin

**Verify exists:**
```powershell
bun x prisma studio
# Check User table for admin@kollect-it.com
```

### Issue: Images not loading
**Test ImageKit:**
```powershell
bun run scripts/test-imagekit.ts
```
**Check:** ImageKit credentials in .env.local

### Issue: Emails not sending
**Check:** RESEND_API_KEY in .env.local  
**Dashboard:** https://resend.com/dashboard → Logs

### Issue: Port 3000 in use
**Find process:**
```powershell
netstat -ano | findstr :3000
```
**Kill process:**
```powershell
taskkill /PID [PID_NUMBER] /F
```

---

## 🔐 CREDENTIALS & TEST DATA

### Admin Credentials
- **Email:** admin@kollect-it.com
- **Password:** KollectIt@2025Admin

### Stripe Test Card
- **Number:** 4242 4242 4242 4242
- **Expiry:** 12/25 (any future date)
- **CVC:** 123 (any 3 digits)
- **ZIP:** 12345 (any 5 digits)

### Stripe Test Scenarios
- **Successful:** 4242 4242 4242 4242
- **Declined:** 4000 0000 0000 0002
- **Requires Auth:** 4000 0027 6000 3184

---

## 🌐 KEY URLS

### Local Development
- **Dev Server:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
- **Admin Dashboard:** http://localhost:3000/admin/dashboard
- **Prisma Studio:** http://localhost:5555
- **Health Check:** http://localhost:3000/api/health

### Production
- **Live Site:** https://kollect-it.com
- **Admin Login:** https://kollect-it.com/admin/login
- **Admin Dashboard:** https://kollect-it.com/admin/dashboard
- **Health Check:** https://kollect-it.com/api/health

### Service Dashboards
- **Vercel:** https://vercel.com/dashboard
- **Supabase:** https://supabase.com/dashboard
- **Stripe:** https://dashboard.stripe.com
- **ImageKit:** https://imagekit.io/dashboard
- **Resend:** https://resend.com/dashboard
- **GitHub:** https://github.com/jameshorton2486/kollect-it

---

## 📋 QUICK VERIFICATION CHECKLISTS

### Before Local Testing
- [ ] Bun installed (`bun --version`)
- [ ] Dependencies installed (`bun install`)
- [ ] .env.local exists and populated
- [ ] Database migrated (`bun x prisma migrate deploy`)
- [ ] Admin user created
- [ ] Stripe CLI running (for webhooks)

### Before Production Deploy
- [ ] `bun run health-check` ✅
- [ ] `bun run typecheck` ✅
- [ ] `bun run build` ✅
- [ ] Admin login works locally
- [ ] Test payment works locally
- [ ] No console errors
- [ ] All changes committed to Git
- [ ] Vercel environment variables set
- [ ] Production Stripe webhook created

### After Production Deploy
- [ ] Site loads at https://kollect-it.com
- [ ] SSL certificate valid (🔒)
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] Test payment processes
- [ ] Webhook events received
- [ ] No console errors
- [ ] Lighthouse score > 90

---

## 🔧 TROUBLESHOOTING WORKFLOW

**Step-by-step debugging:**

1. **Check System Health**
   ```powershell
   bun run health-check
   ```

2. **Review Error Logs**
   ```powershell
   Get-Content logs\error-*.log -Tail 20
   bun run error-summary
   ```

3. **Verify Environment**
   ```powershell
   # Local: Check http://localhost:3000/api/diagnostics/check-env
   # Or manually check .env.local
   ```

4. **Test Database**
   ```powershell
   bun x prisma studio  # Visual database browser
   bun x prisma db pull  # Test connection
   ```

5. **Check TypeScript**
   ```powershell
   bun run typecheck
   ```

6. **Test Build**
   ```powershell
   bun run build
   ```

7. **Check Service Status**
   - Vercel: https://www.vercel-status.com
   - Supabase: https://status.supabase.com
   - Stripe: https://status.stripe.com

---

## 💾 BACKUP & RESTORE

### Create Backup
```powershell
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item "C:\Users\james\kollect-it-marketplace-1" `
          "C:\Users\james\kollect-it-backup-$timestamp" `
          -Recurse
```

### Restore from Backup
```powershell
# Stop dev server first (Ctrl+C)
Remove-Item "C:\Users\james\kollect-it-marketplace-1" -Recurse -Force
Copy-Item "C:\Users\james\kollect-it-backup-[TIMESTAMP]" `
          "C:\Users\james\kollect-it-marketplace-1" `
          -Recurse
```

---

## 🚀 DEPLOY WORKFLOW

### Quick Deploy
```powershell
# 1. Final checks
git status
bun run health-check
bun run build

# 2. Commit and push
git add .
git commit -m "Production ready - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push origin main

# 3. Monitor at: https://vercel.com/dashboard
```

### Full Verification Deploy
```powershell
# Run all checks
bun run verify-production

# If all pass, deploy
git add .
git commit -m "Verified production ready"
git push origin main
```

---

## 📱 COPY-PASTE SNIPPETS

### Generate NEXTAUTH_SECRET
```powershell
$bytes = [System.Byte[]]::new(32)
$rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
$rng.GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

### Check DNS Propagation
```powershell
nslookup kollect-it.com
```

### Test Homepage Response
```powershell
curl -I https://kollect-it.com
# Should return: 200 OK
```

### View Recent Logs
```powershell
Get-Content logs\error-*.log -Tail 20
```

### Kill Process on Port 3000
```powershell
$port = netstat -ano | findstr :3000
# Find PID in last column
taskkill /PID [PID] /F
```

### Start Stripe CLI Webhook Listener
```powershell
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the webhook signing secret (whsec_...)
```

---

## ⏱️ TYPICAL TIMING

- **Full backup:** 2 minutes
- **Install Bun:** 5 minutes
- **Install dependencies:** 3-5 minutes
- **Run migrations:** 2 minutes
- **Create admin:** 1 minute
- **Start dev server:** 30 seconds
- **Run health check:** 10 seconds
- **Build test:** 1-2 minutes
- **Deploy to Vercel:** 3-5 minutes
- **DNS propagation:** 5-60 minutes

**Total first-time setup:** 2-3 hours  
**Subsequent deploys:** 5-10 minutes

---

## 🎯 SUCCESS INDICATORS

### Local Development Ready
- [ ] `bun run health-check` - All checks ✅
- [ ] `bun run dev` - Starts without errors
- [ ] http://localhost:3000 - Loads homepage
- [ ] Admin login works
- [ ] No console errors

### Production Ready
- [ ] `bun run verify-production` - All checks ✅
- [ ] https://kollect-it.com - Loads homepage
- [ ] SSL certificate valid (🔒)
- [ ] Admin login works in production
- [ ] Test payment processes
- [ ] Lighthouse score > 90

---

## 📞 EMERGENCY CONTACTS

### If Completely Stuck:

1. **Check Detailed Troubleshooting**
   - Open: 04-TROUBLESHOOTING.md

2. **Review Service Status Pages**
   - Vercel: https://www.vercel-status.com
   - Supabase: https://status.supabase.com
   - Stripe: https://status.stripe.com

3. **Check Deployment Logs**
   - Vercel Dashboard → Deployments → Click deployment → Build Logs

4. **Restore from Backup**
   ```powershell
   # If all else fails
   Copy-Item "C:\Users\james\kollect-it-backup-[TIMESTAMP]" `
             "C:\Users\james\kollect-it-marketplace-1" `
             -Recurse -Force
   ```

---

## 📚 REFERENCE DOCUMENTS

- **00-START-HERE-MASTER-INDEX.md** - Overview & strategy
- **01-MANUAL-PLAN.md** - Step-by-step manual execution (3-4 hours)
- **02-AUTONOMOUS-PLAN.md** - AI agent tasks (45-60 minutes)
- **03-QUICK-REFERENCE.md** - This document
- **04-TROUBLESHOOTING.md** - Detailed problem solving

---

## 💡 PRO TIPS

1. **Always backup before major changes**
2. **Use `bun x` not `bunx` throughout**
3. **Test locally before deploying**
4. **Check health after any changes**
5. **Keep Stripe in test mode until ready to launch**
6. **Monitor Vercel logs during deployment**
7. **Use Prisma Studio to verify database changes**
8. **Check browser console for client-side errors**
9. **Review error logs regularly**
10. **Commit frequently with descriptive messages**

---

## 🎓 LEARNING RESOURCES

### Next.js 15
- Docs: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app

### Bun
- Docs: https://bun.sh/docs
- CLI: https://bun.sh/docs/cli

### Prisma
- Docs: https://www.prisma.io/docs
- Studio: `bun x prisma studio`

### Stripe
- Docs: https://stripe.com/docs
- Testing: https://stripe.com/docs/testing

### Supabase
- Docs: https://supabase.com/docs
- Dashboard: https://supabase.com/dashboard

---

**Keep this card handy during development and deployment! 🚀**
