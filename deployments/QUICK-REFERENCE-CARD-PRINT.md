# 📋 KOLLECT-IT QUICK REFERENCE CARD
**Print this page and keep it handy!**

---

## 🎯 YOUR LAUNCH PATH

**Path 2 (Boutique Launch) - RECOMMENDED**
- Day 1: Setup + Refactor + Categories (5 hours)
- Day 2: Products (6 hours)
- Day 3: Content + Testing (4 hours)
- Day 4: LAUNCH! 🚀

---

## ✅ CRITICAL TASKS CHECKLIST

### Setup (30 min)
- [ ] `cp .env.example .env.local`
- [ ] Fill in DATABASE_URL, NEXTAUTH_SECRET, STRIPE keys, IMAGEKIT keys
- [ ] `bun x prisma migrate deploy`
- [ ] `bun run dev` → Test at http://localhost:3000

### Admin (5 min)
- [ ] Create admin account (see CREATE-ADMIN-ACCOUNT-GUIDE.md)
- [ ] Login at http://localhost:3000/admin/login

### Visual Refactor (30 min) - OPTIONAL
- [ ] Backup: `git commit -am "Before refactor"`
- [ ] Open Cursor (Cmd+K) or Copilot
- [ ] Paste prompt from AESOP-VISUAL-REFACTOR-PROMPT.md
- [ ] Test: `bun run dev` + `bun run build`

### Categories (2 hours)
- [ ] Create 9 main categories
- [ ] Create 30-35 subcategories
- [ ] Add descriptions (100-150 words)
- [ ] Upload images (500×500px)

### Products (6 hours for 25)
- [ ] Title, Price, Category, Condition
- [ ] Description (200-300 words)
- [ ] 4-6 images per product
- [ ] Status: Published

### Content (2 hours)
- [ ] About, Contact, FAQ
- [ ] Shipping & Returns, Terms, Privacy

### Testing (1 hour)
- [ ] Complete checkout (test mode)
- [ ] Test mobile responsive
- [ ] `bun run build` succeeds

### Launch
- [ ] `git push origin main`
- [ ] Deploy to Vercel
- [ ] Test production site
- [ ] GO LIVE! 🎉

---

## 🔧 ESSENTIAL COMMANDS

```bash
# Development
bun run dev              # Start dev server
bun run build            # Test production build
bun run health-check     # Verify system

# Database
bun x prisma migrate deploy  # Run migrations
bun x prisma studio      # Visual DB browser

# Git
git add .
git commit -m "message"
git push origin main

# Troubleshooting
bun run test:env         # Check env vars
bun run error-summary    # View errors
git status               # See changes
git diff                 # See detailed changes
git reset --hard HEAD~1  # UNDO everything
```

---

## 🎨 AESOP REFACTOR QUICK START

**1. Backup:**
```bash
git commit -am "Before Aesop refactor"
```

**2. Open Cursor (free):**
- Download: https://cursor.sh
- Open project folder
- Press: Cmd+K (Mac) or Ctrl+K (Win)

**3. Paste This:**
Open `AESOP-VISUAL-REFACTOR-PROMPT.md` → Copy master prompt → Paste

**4. Let AI Run:** (2-5 minutes)

**5. Test:**
```bash
bun run dev           # Check http://localhost:3000
bun run build         # Verify build works
```

**6. Keep or Revert:**
```bash
# KEEP: git commit -am "Applied Aesop design"
# REVERT: git reset --hard HEAD~1
```

---

## 🚨 TROUBLESHOOTING

**Site won't load:**
```bash
# Check env vars
bun run test:env

# Regenerate client
bun x prisma generate

# Restart
bun run dev
```

**Build fails:**
```bash
bun run typecheck    # See TS errors
bun x prisma generate
bun run build
```

**Images not showing:**
- Check IMAGEKIT credentials in `.env.local`
- Restart dev server

**Can't login to admin:**
- Verify admin account created
- Check NEXTAUTH_SECRET set
- Try password reset

**Colors not showing (after refactor):**
- Save all files (Cmd+S / Ctrl+S)
- Restart dev server
- Check `globals.css` has Aesop variables
- Check `tailwind.config.ts` has aesop colors

---

## 📚 DOCUMENT QUICK FINDER

**Getting Started:**
- `MASTER-SUMMARY-START-HERE.md` ← Start here

**Core Guides:**
- `LAUNCH-CHECKLIST-QUICK-REFERENCE.md` ← Daily tasks
- `KOLLECT-IT-SITE-READINESS-REVIEW.md` ← Complete review

**Visual Refactor:**
- `DESIGN-COMPARISON-CURRENT-VS-AESOP.md` ← See before/after
- `HOW-TO-USE-AI-CODING-ASSISTANT.md` ← Beginner guide
- `AESOP-VISUAL-REFACTOR-PROMPT.md` ← The actual prompt

**Setup:**
- `CREATE-ADMIN-ACCOUNT-GUIDE.md` ← Admin account
- `.env.example` (in project) ← Environment variables

---

## 🎯 MINIMUM VIABLE LAUNCH

**Absolute minimum to go live:**

1. Environment setup (30 min) ✅ CRITICAL
2. Admin account (5 min) ✅ CRITICAL
3. 9 main categories (1 hour) ✅ CRITICAL
4. 15 products with images (3 hours) ✅ CRITICAL
5. Customize About + Contact (30 min) ✅ CRITICAL
6. Test checkout once (15 min) ✅ CRITICAL

**Total: 5.5 hours** → Can launch same day!

---

## 📞 NEED HELP?

**Check These First:**
1. `04-TROUBLESHOOTING.md` (in project)
2. `bun run health-check`
3. `bun run error-summary`
4. Git status: `git status`

**Common Files:**
- Config: `.env.local`
- Design: `src/app/globals.css`
- Database: `prisma/schema.prisma`
- Admin: http://localhost:3000/admin/login

---

## ✅ LAUNCH VERIFICATION

Before going live, verify:

**Technical:**
- [ ] `bun run build` succeeds
- [ ] `bun run typecheck` no errors
- [ ] Site loads without console errors

**Content:**
- [ ] Categories visible
- [ ] Products visible
- [ ] Images load correctly
- [ ] About page customized

**Functionality:**
- [ ] Can add to cart
- [ ] Can checkout (test mode)
- [ ] Receive confirmation email
- [ ] Order shows in admin

**Mobile:**
- [ ] Test on phone
- [ ] Navigation menu works
- [ ] Images scale properly
- [ ] Buttons tappable

**If ALL checked → LAUNCH!** 🚀

---

## 💰 STRIPE TEST MODE

**Test Card:** 4242 4242 4242 4242  
**Expiry:** Any future date  
**CVC:** Any 3 digits  
**ZIP:** Any 5 digits  

**Before Launch:**
- Use test keys (pk_test_..., sk_test_...)
- Test complete checkout
- Verify order confirmation

**When Ready to Go Live:**
- Switch to live keys in Vercel
- Test with real card (small amount)
- You're LIVE!

---

## 🎨 COLOR PALETTE REFERENCE

**Current (Original):**
- Gold: #C5A264
- Navy: #1E3A5F
- Cream: #F5F3F0

**Aesop (After Refactor):**
- Cream: #F7F5F0
- Olive: #4A5545
- Sand: #E8E3D9
- Charcoal: #242424

---

## 📊 SUCCESS METRICS

**Track These (First Month):**
- Products listed: 50-100
- Page views: 1,000+
- Add-to-cart rate: 5%+
- Checkout completion: 50%+
- Return visitors: 20%+

**Where to Check:**
- Google Analytics (traffic)
- Admin Dashboard (sales)
- Stripe Dashboard (payments)

---

## 🎯 NEXT STEPS AFTER LAUNCH

**Week 1:**
- Monitor error logs daily
- Respond to customer inquiries
- Add 10-20 more products
- Post to social media

**Week 2:**
- SEO optimization
- Google Business Profile
- Email newsletter
- Product photography

**Month 2:**
- Marketing campaigns
- Customer reviews
- More categories
- 100+ products

---

**PRINT THIS PAGE AND KEEP IT HANDY!**

**Last Updated:** November 21, 2025  
**Version:** 1.0  
**Status:** ✅ Ready for Launch
