# PHASE 1 DEPLOYMENT - QUICK START CARD

**Estimated Time:** 2-3 hours  
**Outcome:** Live marketplace on yourdomain.com with HTTPS  

---

## ⚡ 5-Minute Setup Checklist

```
☐ Step 1: Choose PostgreSQL (Neon recommended)
  → Go to https://neon.tech
  → Sign up with GitHub
  → Copy connection strings (save both DATABASE_URL and DIRECT_URL)

☐ Step 2: Push to GitHub (already done ✅)
  → Code is ready on main branch

☐ Step 3: Deploy to Vercel
  → Go to https://vercel.com/signup
  → Sign up with GitHub
  → Import kollect-it-marketplace repo
  → Add environment variables (see table below)
  → Deploy

☐ Step 4: Update Bluehost DNS
  → Get Vercel nameservers from project settings
  → Go to Bluehost
  → Change nameservers to Vercel's
  → Wait 24-48 hours for propagation

☐ Step 5: Verify
  → Visit https://yourdomain.com
  → Test login, cart, checkout
  → Check database initialized
  → Check emails sending

☐ Step 6: Launch! 🚀
```

---

## 🔐 Environment Variables Quick Reference

**Copy these from your .env.local** → **Paste into Vercel**

```
DATABASE_URL = [from Neon - pooled connection]
DIRECT_URL = [from Neon - direct connection]
NEXTAUTH_SECRET = [run: openssl rand -hex 32]
NEXTAUTH_URL = https://yourdomain.com
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT = [from .env.local]
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY = [from .env.local]
IMAGEKIT_PRIVATE_KEY = [from .env.local]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = [from .env.local]
STRIPE_SECRET_KEY = [from .env.local]
STRIPE_WEBHOOK_SECRET = [from .env.local]
RESEND_API_KEY = [from .env.local]
EMAIL_FROM = Kollect-It <noreply@yourdomain.com>
ADMIN_EMAIL = your-email@gmail.com
NODE_ENV = production
```

---

## 🧪 Post-Deployment Testing

**Test everything works:**

| Feature | Test | Expected |
|---------|------|----------|
| **Website** | Visit https://yourdomain.com | Homepage loads in <3s |
| **Products** | Go to /shop | Products display with images |
| **Cart** | Add product, go to /cart | Product visible in cart |
| **Checkout** | Use card 4242 4242 4242 4242 | Order completes ✅ |
| **Email** | Go to /api/email/test | Email arrives in inbox |
| **Admin** | Visit /admin with admin credentials | Dashboard loads |
| **SSL** | Check URL bar | Green lock 🔒 shows |

---

## 📊 Vercel Dashboard Commands

```powershell
# After deployment, run these locally to initialize database:

# Generate Prisma client
bun run db:generate

# Run migrations
bun run db:migrate:deploy

# Seed with test data
bun run db:seed
```

---

## ❌ If Something Goes Wrong

| Problem | Solution |
|---------|----------|
| Build failed | Check Vercel logs → find error → fix locally → git push |
| Database won't connect | Verify DATABASE_URL correct, add IP whitelist |
| Domain not working | Check DNS propagation (nslookup yourdomain.com) |
| Emails not sending | Verify RESEND_API_KEY, check ADMIN_EMAIL |
| Payment fails | Use test card (4242...), verify STRIPE_SECRET_KEY |

**Full troubleshooting:** See PHASE_1_VERCEL_DEPLOYMENT_COMPLETE.md

---

## 🎯 Your Timeline

```
Now:     Set up Neon (10 min)
+10 min: Deploy to Vercel (20 min)
+30 min: Update Bluehost DNS (5 min) + wait
+36 min: Initialize database (5 min)
+41 min: Test everything (30-60 min)
+75 min: LIVE! 🚀

Total: ~1.5-2 hours active time + 24h DNS wait
```

---

## ✅ Success Looks Like This

```
✓ https://yourdomain.com loads
✓ SSL certificate works (green lock)
✓ Homepage displays correctly
✓ Products show with images
✓ Login works
✓ Checkout processes test payments
✓ Admin dashboard accessible
✓ Emails send
✓ No console errors
✓ Mobile responsive
```

---

## 📝 Important Files

- **Full guide:** `docs/PHASE_1_VERCEL_DEPLOYMENT_COMPLETE.md`
- **Detailed review:** `docs/KOLLECT_IT_PROJECT_REVIEW_AND_DEPLOYMENT_PLAN.md`
- **Executive summary:** `docs/00_EXECUTIVE_SUMMARY_AND_ROADMAP.md`

---

## 🚀 Ready?

1. Open: `docs/PHASE_1_VERCEL_DEPLOYMENT_COMPLETE.md`
2. Follow each step sequentially
3. Use this card for quick reference
4. Check troubleshooting if stuck

**You've got everything you need. Let's go live! 🎉**
