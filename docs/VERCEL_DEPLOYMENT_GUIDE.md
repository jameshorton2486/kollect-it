# 🚀 Vercel Deployment Guide - Kollect-It Marketplace

## 📋 Pre-Deployment Checklist

### **✅ Code Readiness:**
- [ ] All TypeScript errors resolved
- [ ] ESLint passes without errors
- [ ] Production build succeeds (`bun run build`)
- [ ] Environment variables configured
- [ ] Database schema deployed to Supabase
- [ ] ImageKit CDN configured
- [ ] Stripe test/live keys ready

### **✅ Required Services:**
- [ ] Supabase PostgreSQL database
- [ ] ImageKit CDN account
- [ ] Stripe payment account
- [ ] GitHub repository (public/private)
- [ ] Vercel account (free tier available)

---

## 🌐 Step 1: Prepare Your Repository

### **1.1 Push to GitHub:**
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Production ready Kollect-It marketplace"

# Add remote and push
git remote add origin https://github.com/yourusername/kollect-it-marketplace.git
git branch -M main
git push -u origin main
```

### **1.2 Verify Build:**
```bash
# Final verification
bun run lint
bun run type-check
bun run build
bun run start  # Test production build locally
```

---

## 🚢 Step 2: Deploy to Vercel

### **2.1 Create Vercel Account:**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

### **2.2 Import Project:**
1. Click "**New Project**"
2. Import your GitHub repository
3. Vercel auto-detects Next.js configuration
4. Click "**Deploy**" (will fail initially - this is expected)

### **2.3 Configure Environment Variables:**

In Vercel dashboard → Settings → Environment Variables, add:

```env
# Database
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# Authentication
NEXTAUTH_SECRET=your-secure-random-string-minimum-32-chars
NEXTAUTH_URL=https://your-app-name.vercel.app

# ImageKit CDN
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_your_imagekit_key
IMAGEKIT_PRIVATE_KEY=private_your_imagekit_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_your_key
STRIPE_SECRET_KEY=sk_live_or_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_endpoint_secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Admin
ADMIN_EMAIL=admin@kollect-it.com
ADMIN_PASSWORD=your-secure-admin-password
```

**⚠️ Environment Types:**
- Set all variables for **Production**
- Optionally set for **Preview** (staging)
- Leave **Development** empty (use local `.env.local`)

---

## 🗄️ Step 3: Database Configuration

### **3.1 Verify Supabase Connection:**
1. Go to [supabase.com](https://supabase.com) → Your project
2. Settings → Database → Connection String
3. Copy the **Transaction** connection string
4. Replace `[YOUR-PASSWORD]` with your actual password
5. Update `DATABASE_URL` in Vercel environment variables

### **3.2 Deploy Database Schema:**
```bash
# From your local project
bun run db:generate
bun run db:push
bun run db:seed
```

### **3.3 Verify Database in Production:**
- Check Supabase dashboard for tables: `Category`, `Product`, `Image`, `User`, `Account`, `Order`, etc.
- Verify admin user exists with correct credentials

---

## 🔄 Step 4: Redeploy with Environment Variables

### **4.1 Trigger New Deployment:**
1. In Vercel dashboard → Deployments
2. Click "**Redeploy**" on the failed deployment
3. Or push a new commit to trigger auto-deployment

### **4.2 Monitor Deployment:**
- Watch build logs in real-time
- Check for any compilation errors
- Verify successful deployment status

---

## 🧪 Step 5: Production Testing

### **5.1 Basic Functionality Test:**
```bash
# Test these URLs in production:
https://your-app.vercel.app/                    # Homepage
https://your-app.vercel.app/products           # Products page
https://your-app.vercel.app/admin/login        # Admin login
https://your-app.vercel.app/api/health         # Health check
```

### **5.2 Admin Panel Test:**
1. Login with admin credentials
2. Try adding a product with images
3. Verify product appears on homepage
4. Test order management features

### **5.3 Customer Flow Test:**
1. Browse products as customer
2. Add items to cart
3. Complete checkout process (use Stripe test cards)
4. Verify order creation and email notifications

---

## 🔧 Step 6: Custom Domain (Optional)

### **6.1 Add Custom Domain:**
1. Vercel dashboard → Settings → Domains
2. Add your domain (e.g., `kollect-it.com`)
3. Configure DNS records as shown
4. Wait for SSL certificate provisioning

### **6.2 Update Environment Variables:**
```env
NEXTAUTH_URL=https://kollect-it.com
```

### **6.3 Update Service Configurations:**
- **Stripe**: Update webhook endpoints and redirect URLs
- **ImageKit**: Update CORS origins if needed
- **Supabase**: Update redirect URLs for auth

---

## 📈 Step 7: Performance & Monitoring

### **7.1 Enable Analytics:**
- Vercel dashboard → Analytics
- Monitor Core Web Vitals
- Track page performance and errors

### **7.2 Set up Monitoring:**
- Configure uptime monitoring
- Set up error tracking (Sentry integration available)
- Monitor database performance in Supabase

### **7.3 Optimize Images:**
- Verify ImageKit CDN is working
- Check image loading performance
- Monitor CDN usage and costs

---

## 🛡️ Step 8: Security & Production Hardening

### **8.1 Security Headers:**
Vercel automatically adds security headers, but verify:
- HTTPS enforcement
- Content Security Policy
- HSTS headers

### **8.2 Environment Security:**
- [ ] All production secrets use secure, random values
- [ ] Default admin password changed
- [ ] Database credentials are production-specific
- [ ] Stripe keys are appropriate for environment (test/live)

### **8.3 Access Controls:**
- [ ] Admin routes protected
- [ ] API endpoints authenticated
- [ ] Database access restricted to application
- [ ] CORS configured properly

---

## 🚨 Troubleshooting Common Issues

### **Build Failures:**

**TypeError in build:**
```bash
# Check TypeScript errors locally
bun run type-check
bun run build
```

**Missing environment variables:**
```bash
# Verify all required vars are set in Vercel
# Check spelling and formatting
# Ensure no trailing spaces
```

**Database connection issues:**
```bash
# Verify DATABASE_URL format
# Check Supabase project is active
# Test connection from local environment
```

### **Runtime Errors:**

**500 Internal Server Error:**
1. Check Vercel Function Logs
2. Verify all environment variables
3. Check database connectivity
4. Review API route implementations

**Authentication not working:**
1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your domain
3. Ensure callback URLs are configured

**Image uploads failing:**
1. Verify ImageKit credentials
2. Check CORS settings in ImageKit dashboard
3. Test API endpoints directly

---

## 📊 Step 9: Post-Deployment Checklist

### **✅ Functional Verification:**
- [ ] Homepage loads with products
- [ ] Admin login works
- [ ] Product creation with images works
- [ ] Shopping cart functions properly
- [ ] Checkout flow completes successfully
- [ ] Order management dashboard functional
- [ ] Email notifications sending (if configured)

### **✅ Performance Verification:**
- [ ] Page load times under 3 seconds
- [ ] Images load from CDN
- [ ] Mobile responsiveness verified
- [ ] SEO metadata present

### **✅ Security Verification:**
- [ ] HTTPS enforced
- [ ] Admin routes protected
- [ ] Default credentials changed
- [ ] Error messages don't expose sensitive data

---

## 📞 Support & Next Steps

### **If You Need Help:**
1. **Vercel Support**: [vercel.com/support](https://vercel.com/support)
2. **Supabase Support**: [supabase.com/support](https://supabase.com/support)
3. **Developer Community**: GitHub Discussions or Issues

### **Ongoing Maintenance:**
1. **Monitor performance** in Vercel Analytics
2. **Update dependencies** regularly with `bun update`
3. **Backup database** regularly from Supabase
4. **Monitor costs** for CDN and database usage
5. **Review security** with dependency audits

### **Feature Development:**
Your marketplace is now production-ready! Consider these enhancements:
- Advanced search and filtering
- Customer reviews and ratings
- Email marketing automation
- Advanced analytics dashboard
- Multi-vendor support
- Inventory management

---

## 🎉 Congratulations!

Your Kollect-It marketplace is now live on Vercel with:
- ✅ Production-grade hosting
- ✅ Automatic HTTPS and CDN
- ✅ Database connectivity
- ✅ Image optimization
- ✅ Payment processing
- ✅ Admin management system
- ✅ Customer authentication

**🌐 Your live marketplace is ready for business!**