# VS CODE AI AGENT PROMPT – KOLLECT-IT NAVIGATION AUDIT & FIX

## MISSION

Audit and fix ALL navigation inconsistencies, broken links, and user flow issues across entire site.

---

## PART 1: SCAN PROJECT

Scan these files to find navigation issues:

### Navigation Components to Check

- src/components/Header.tsx
- src/components/Footer.tsx
- src/components/Breadcrumbs.tsx
- src/components/home/ShopByCategoriesClient.tsx

### Pages to Check

- src/app/page.tsx (Homepage)
- src/app/shop/page.tsx (Shop all)
- src/app/category/[slug]/page.tsx (Categories)
- src/app/product/[slug]/page.tsx (Product detail)
- src/app/cart/page.tsx (Shopping cart)
- src/app/checkout/page.tsx (Checkout)
- src/app/login/page.tsx (Login)
- src/app/account/page.tsx (Account)
- src/app/admin/dashboard/page.tsx (Admin)

---

## PART 2: CREATE NAVIGATION CONFIG

### Step 1: Create src/lib/navigation.ts

```typescript
import { Palette, Gem, Book, Shield, Home, ShoppingBag } from 'lucide-react';

export interface NavLink {
  href: string;
  label: string;
  icon?: any;
}

// Main navigation
export const mainNavigation: NavLink[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Shop All', icon: ShoppingBag },
];

// Categories
export const categoryNavigation: NavLink[] = [
  { href: '/category/fine_art', label: 'Fine Art', icon: Palette },
  { href: '/category/collectibles', label: 'Collectibles', icon: Gem },
  { href: '/category/books_and_manuscripts', label: 'Books & Manuscripts', icon: Book },
  { href: '/category/militaria_and_historical', label: 'Militaria & Historical', icon: Shield },
];

// Footer navigation
export const footerNavigation = [
  {
    title: 'Shop',
    links: [
      { href: '/shop', label: 'Browse All' },
      { href: '/category/fine_art', label: 'Fine Art' },
      { href: '/category/collectibles', label: 'Collectibles' },
      { href: '/category/books_and_manuscripts', label: 'Books & Manuscripts' },
      { href: '/category/militaria_and_historical', label: 'Militaria' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact' },
      { href: '/shipping-returns', label: 'Shipping & Returns' },
    ],
  },
  {
    title: 'About',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/sell', label: 'Sell With Us' },
    ],
  },
];
```

---

## PART 3: FIX COMPONENTS

### Step 2: Update Header.tsx

1. Import: `import { categoryNavigation } from '@/lib/navigation';`
2. Replace hardcoded category links with:

```typescript
{categoryNavigation.map((item) => (
  <Link key={item.href} href={item.href}>
    {item.label}
  </Link>
))}
```

3. Ensure all links use Next.js `<Link>` (not `<a>` tags)
4. Check mobile menu has same links as desktop

### Step 3: Update Footer.tsx

1. Import: `import { footerNavigation } from '@/lib/navigation';`
2. Replace with:

```typescript
{footerNavigation.map((section) => (
  <div key={section.title}>
    <h4 className="font-serif text-ink mb-4">{section.title}</h4>
    <ul className="space-y-2">
      {section.links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="text-ink-light hover:text-accent-gold">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
))}
```

---

## PART 4: FIX PAGES

### Step 4: Homepage (src/app/page.tsx)

- Add "Shop All" button → /shop
- Add category cards → /category/[slug]
- Verify product cards → /product/[slug]

### Step 5: Shop Page (src/app/shop/page.tsx)

- Add breadcrumb: Home > Shop
- Each product → /product/[slug]

### Step 6: Category Page (src/app/category/[slug]/page.tsx)

- Add breadcrumb: Home > [Category] > Products
- Each product → /product/[slug]

### Step 7: Product Detail (src/app/product/[slug]/page.tsx)

- Add breadcrumb: Home > [Category] > Product
- Related products → /product/[slug]
- "Continue Shopping" → /shop

### Step 8: Cart (src/app/cart/page.tsx)

- Product links → /product/[slug]
- "Continue Shopping" → /shop
- "Proceed to Checkout" → /checkout

### Step 9: Checkout (src/app/checkout/page.tsx)

- Add breadcrumb: Home > Cart > Checkout
- "Back to Cart" → /cart

### Step 10: Account (src/app/account/page.tsx)

- Add breadcrumb: Home > My Account
- Order items → /product/[slug]

---

## PART 5: VERIFY

Run these tests:

```bash
# Check no <a> tags that should be <Link>
grep -r "<a href" src/components/ src/app/ | grep -v external

# Test build
bun run lint
bun run build

# Start dev server
bun run dev
```

---

## PART 6: BROWSER TESTING

Test in `http://localhost:3000`:

- [ ] Homepage loads, categories show
- [ ] Click "Shop All" → /shop works
- [ ] Click category → /category/[slug] works
- [ ] Click product → /product/[slug] works
- [ ] Cart page shows products linked correctly
- [ ] Checkout page has navigation
- [ ] All breadcrumbs display correctly
- [ ] Mobile menu matches desktop

---

## PART 7: COMMIT

```bash
git add src/lib/navigation.ts src/components/ src/app/
git commit -m "fix: Navigation audit and fixes - centralized config, consistent links"
git push origin main
```

---

## SUCCESS CRITERIA

- ✅ All links use navigation.ts config
- ✅ No hardcoded navigation links
- ✅ All links are `<Link>` (not `<a>`)
- ✅ No broken links
- ✅ Mobile and desktop nav match
- ✅ All breadcrumbs work
- ✅ `bun run lint` passes
- ✅ `bun run build` succeeds

---

## 📊 WHAT YOU COMPLETED (Phase 1)

- ✅ TypeScript errors removed
- ✅ Environment validation added
- ✅ Route protection (middleware) added
- ✅ .env.local configured
- ✅ Build now works

**Status:** Build-ready ✅

---

## 🎯 PHASE 2 OVERVIEW

What you'll do now:

- Create centralized navigation config
- Fix all hardcoded links
- Update Header, Footer, all pages
- Test all user flows
- Verify mobile & desktop match

**Result:** Production-ready navigation ✅

---

## ⏱️ ESTIMATED TIME

**2-3 hours** for complete Phase 2 execution

After Phase 2 is done, tell me and I'll provide the Phase 3 prompt (Email, Wishlist, Advanced Features).

---

## 🚀 HOW TO USE THIS PROMPT

1. **Copy everything** from "# VS CODE AI AGENT PROMPT" to the end
2. **Open VS Code** to your project
3. **Press Ctrl + I** to open AI Agent
4. **Paste the prompt**
5. **Press Enter** and follow the AI's guidance

---

## 📋 NEXT STEPS

After completing Phase 2:

1. Run `bun run dev` to start dev server
2. Test all navigation flows in browser
3. Verify mobile responsiveness
4. Proceed to Phase 3 (Email, Wishlist, Advanced Features)
