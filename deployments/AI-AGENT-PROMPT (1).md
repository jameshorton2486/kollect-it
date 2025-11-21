# 🤖 KOLLECT-IT NAVIGATION FIX - AI AGENT PROMPT
## Paste this into Cursor or GitHub Copilot Chat

---

```
You are the AI Lead Developer fixing the Kollect-It Next.js navigation system.

CRITICAL ISSUES TO FIX:

1. HEADER NAVIGATION (src/components/Header.tsx):
   - Line 12: Change "/products" to "/shop"
   - All other navigation links are correct

2. FOOTER NAVIGATION (src/components/Footer.tsx):
   - Line 9: Change "/products" to "/shop"
   - Lines 10-13: Change "/categories/" to "/category/" for all category links
   - Line 24: Change "/shipping" to "/shipping-returns"

3. CREATE MISSING PAGES:

CREATE: src/app/categories/page.tsx
- Overview page listing all 9 main categories
- Grid layout, 3 columns
- Each category links to /category/[slug]
- Include: Antiques, Fine Art, Jewelry & Timepieces, Home Décor, Collectibles, Clothing & Accessories, Books & Media, Toys & Games, Sports Memorabilia
- Use inline styles only (no custom CSS)
- Match Kollect-It brand colors: #F7F6F2 (bg), #EAE6DD (secondary), #C9A66B (gold), #3A3A3A (text)
- Include metadata for SEO

CREATE: src/app/how-it-works/page.tsx
- Explain 5-step buying process
- Include buyer benefits section (6 benefits)
- Include seller benefits section (6 benefits)
- CTA button linking to /sell
- Use inline styles matching brand
- Include metadata for SEO

CREATE: src/app/payment/page.tsx
- List 4 payment methods: Credit Cards, PayPal, Bank Transfer, Installment Plans
- Include features for each method
- Security section at bottom
- Use inline styles matching brand
- Include metadata for SEO

CREATE: src/app/privacy/page.tsx
- Standard privacy policy sections:
  1. Information We Collect
  2. How We Use Your Information
  3. Information Sharing
  4. Data Security
  5. Your Rights
  6. Cookies
  7. Contact Us
- Professional layout with proper spacing
- Use inline styles matching brand
- Include metadata for SEO

CREATE: src/app/terms/page.tsx
- Standard terms of service sections:
  1. Acceptance of Terms
  2. User Accounts
  3. Buying and Selling
  4. Fees and Payments
  5. Returns and Refunds
  6. Intellectual Property
  7. Limitation of Liability
  8. Contact Information
- Professional layout
- Use inline styles matching brand
- Include metadata for SEO

CREATE: src/app/cookies/page.tsx
- Cookie policy explaining:
  - What cookies are
  - Types we use (Essential, Analytics, Functionality, Marketing)
  - How to manage cookies
- Professional layout
- Use inline styles matching brand
- Include metadata for SEO

REQUIREMENTS FOR ALL PAGES:
- Use Next.js 14+ App Router conventions
- Include proper TypeScript types
- Add Metadata export for SEO
- Use ONLY inline styles (style={{ ... }})
- NO custom CSS classes
- NO custom fonts (use system fonts: serif for headings, default for body)
- Match Kollect-It brand colors:
  - Background: #F7F6F2
  - Secondary: #EAE6DD
  - Gold accent: #C9A66B
  - Gold hover: #B88D50
  - Text: #3A3A3A
- Responsive design (mobile-first)
- Proper semantic HTML
- Accessibility (ARIA labels where needed)

AFTER COMPLETING ALL FIXES:
1. Verify all imports are correct
2. Check no TypeScript errors
3. Ensure all files compile
4. Confirm routing paths match Next.js App Router conventions

DO NOT:
- Add any external dependencies
- Use custom CSS files
- Create any lib/ or utils/ files
- Modify any other files besides the ones specified

EXECUTE ALL FIXES NOW.
```

---

## 📋 HOW TO USE THIS PROMPT

### For Cursor:
1. Open Cursor
2. Press Cmd+L (Mac) or Ctrl+L (Windows)
3. Paste the entire prompt above
4. Press Enter
5. Let Cursor make all the changes
6. Review changes before accepting

### For GitHub Copilot Chat:
1. Open VS Code
2. Open Copilot Chat panel
3. Paste the entire prompt above
4. Press Enter
5. Copilot will create/modify files
6. Review and accept changes

### For Claude in VS Code:
1. Open command palette (Cmd+Shift+P)
2. Type "Claude"
3. Paste prompt
4. Let Claude implement fixes

---

## ✅ AFTER AI COMPLETES

Run these commands:

```bash
# Clear cache
rm -rf .next

# Start dev server
npm run dev

# Test in browser
open http://localhost:3000
```

Test all navigation links:
- Header: Browse, Categories, How It Works, About, Contact, Sell With Us
- Footer: All Shop links, Company links, Support links
- Verify no 404 errors

---

## 🔧 IF AI GETS STUCK

If AI asks questions or seems confused:

**For "Where should I put these files?"**
Response: "In src/app/ following Next.js App Router conventions. Each page needs its own folder with page.tsx inside."

**For "What styling framework?"**
Response: "Use inline styles only. No Tailwind, no CSS modules, no styled-components. Just style={{}} prop."

**For "What about fonts?"**
Response: "Use browser defaults. For headings use fontFamily: 'serif', for body text use default system font."

**For "Need more details on X?"**
Response: "Keep it simple and professional. Match the tone of existing pages. Focus on clarity and usability."

---

## 🎯 SUCCESS VERIFICATION

AI implementation is complete when:
- [ ] All 6 new pages created
- [ ] Header.tsx updated
- [ ] Footer.tsx updated
- [ ] No TypeScript errors
- [ ] All files compile successfully
- [ ] Dev server runs without errors

Then manually test:
- [ ] All links work
- [ ] Pages display correctly
- [ ] Mobile responsive
- [ ] No console errors

---

**Ready to paste and execute!** 🚀
