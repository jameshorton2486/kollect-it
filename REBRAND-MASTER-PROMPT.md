# 🎯 KOLLECT-IT REBRAND MASTER PROMPT

**Copy this entire section into VS Code Copilot Chat and press Enter.**

---

```
You are an autonomous coding agent for Kollect-It Phase 4 Rebrand.

MISSION:
Update all customer-facing copy on the Kollect-It website to shift from "luxury posh marketplace" 
to "professional, honest collector's marketplace for items $500-2K." Keep layouts and structure intact.

CORE PRINCIPLES:
✅ Professional but approachable tone
✅ Emphasize: accurate descriptions, fair pricing, personal touch (solo operator)
✅ No "luxury," "museums," "white glove," "connoisseurs," or posh language
✅ Be transparent about authentication approach
✅ Highlight "Sell Your Items" path (consignment/buy options)
✅ ALL changes are content-only (text, labels, messaging)
✅ Keep existing components and layouts unchanged
✅ Small styling tweaks OK if needed for readability (spacing, font-size)
✅ Simple "Sell Your Items" section only (no complex new flows)

KEY MESSAGING ANCHORS:
- "Professionally described, fairly priced, personally curated"
- "We authenticate, listen, and adjust if we're wrong"
- Skip auction house 25-50% fees. Sell directly.
- Items $500-$15,000 that deserve expert attention
- "Honesty is our foundation"

PAGES TO UPDATE (IN ORDER):

STEP 1: Homepage Hero Section (30 min)
File: src/app/page.tsx (or wherever homepage lives)
Task: Update hero section with new copy
Current: "Discover authenticated luxury collectibles curated for discerning connoisseurs"
New: "Collectibles Worth Collecting" (headline)
     "Professionally described, fairly priced, personally curated. Items from $500-$15,000 that deserve expert attention." (subheading)

ACTION: Find the hero text block in homepage component. Replace with new copy.
VERIFY: Hero should be clean, no "luxury" or "posh" words.

---

STEP 2: Four-Pillar Tagline Section (15 min)
File: src/app/page.tsx (or whatever shows the 4-pillar section)
Task: Replace current tagline
Current: "Fine Art to Rare Books • Furniture to Collectibles • Expert Authentication • Insured Shipping"
New: "Rare Books to Fine Art • Collectibles to Militaria • Professionally Authenticated • Insured & Tracked Shipping"

ACTION: Find the 4-pillar tagline block. Replace text. Verify layout stays the same.
VERIFY: "Furniture" removed, new order makes sense.

---

STEP 3: Trust & Security Section (15 min)
File: src/app/page.tsx or component file
Task: Simplify security messaging
Current: "Bank-level encryption. Your payment information is protected by industry-leading security standards."
New: "Your payment information is protected by industry-leading security standards."

ACTION: Find security message. Remove "Bank-level encryption" line. Keep single sentence.
VERIFY: Reads clean and straightforward.

---

STEP 4: Authentication Section (20 min)
File: Wherever authentication is described on homepage or /admin/settings/email or similar
Task: Rewrite authentication approach to be honest and transparent
Current: "Expert-vetted items with detailed descriptions, provenance documentation, and certification where applicable."
New: "AUTHENTICATION & VALUATION
We authenticate items using professional resources and valuation tools. If you believe we've made an error, 
contact us and we'll review and adjust our assessment. Honesty is our foundation.

✓ Professional valuations using industry-standard resources
✓ Transparent pricing between auction and retail value
✓ Error correction: We're open to discussion if you disagree
✓ Third-party appraisals available for high-value items ($5K+)"

ACTION: Find authentication block. Replace with new text structure (bulleted, honest tone).
VERIFY: Emphasizes willingness to correct mistakes, uses "we" not corporate speak.

---

STEP 5: Shipping & Returns Section (15 min)
File: Shipping policy section (might be on /checkout, /cart, or /about)
Task: Replace "white glove" messaging with practical shipping info
Current: "White glove service and authenticated luxury collectibles"
New: "SHIPPING
✓ Insured and tracked shipping
✓ Ships within 3-4 business days
✓ Professional packaging to ensure items arrive in condition

RETURNS
We encourage careful review of all photos and descriptions before purchasing. 
Returns are possible but discouraged. Contact us to discuss any concerns.
We want you to be confident in every purchase."

ACTION: Find shipping/returns section. Replace with new practical messaging.
VERIFY: No "white glove," clear expectations set.

---

STEP 6: Trust Builders / Why Choose Us Section (20 min)
File: Homepage trust section (if it exists) or create from template
Task: Replace "Trusted by museums" with actual value propositions
Current: "Trusted by museums and private collectors"
New: "WHY COLLECTORS CHOOSE KOLLECT-IT

✓ ACCURATE DESCRIPTIONS
Every item photographed from multiple angles with honest, detailed descriptions.
Questions? We'll send more photos or clarify anything.

✓ FAIR PRICING
We price between what auctions get and what retail costs.
You save compared to traditional auction houses.

✓ PROFESSIONAL VALUATION
We use industry-standard resources to value items accurately.
If you disagree, we'll review it.

✓ REAL COMMUNICATION
Direct contact with the owner. Real person, real answers.

✓ CAREFUL SHIPPING
Insured and tracked. Your items arrive the way they should."

ACTION: Find "Trusted by museums" section. Replace with new bulleted section.
VERIFY: Each point emphasizes accuracy, fairness, and personal communication.

---

STEP 7: Category Pages (30 min - 4 pages)
Files: src/app/category/[slug]/page.tsx or similar category components
Task: Update category names and descriptions
Current categories:
  - Antique Books
  - Fine Art
  - Collectibles
  - Militaria

New category structure:
  RARE BOOKS
  First editions, signed copies, historical texts, vintage finds
  Price range: $200-$8,000

  FINE ART
  Paintings, prints, photography, sculptures
  Price range: $500-$15,000

  COLLECTIBLES
  Vintage items, memorabilia, limited editions, sought-after finds
  Price range: $300-$10,000

  MILITARIA
  Historical uniforms, medals, patches, insignia, documents
  Price range: $200-$5,000

ACTION: For each category page:
  1. Find category title (e.g., "Antique Books")
  2. Update to new name (e.g., "Rare Books")
  3. Add/update description with sub-items and price range
  4. Verify layout handles new text length

VERIFY: All 4 categories updated, descriptions are clear and informative.

---

STEP 8: "Sell Your Items" Section (20 min)
File: Homepage or new simple page
Task: Add or enhance "Sell Your Items" call-out
New text:
"HAVE ITEMS TO SELL?

Whether you have a single valuable piece or a collection, 
we're interested in working with you.

For items $500-$15,000 that you want to sell:
✓ We'll evaluate your items professionally
✓ Options available: We buy outright or take on consignment
✓ Fair valuations, transparent process
✓ No 25-50% auction house commissions

Email us with photos and details. We'll get back to you within 24-48 hours.

[CTA Button: "Tell Us About Your Items" → links to contact email or /contact page]"

ACTION: 
  Option A: If homepage has space, add new section below featured products
  Option B: If "Sell Your Items" exists, replace copy with new version
  Option C: If doesn't exist, add link to /about or /contact explaining process

VERIFY: "Sell Your Items" is visible and prominent. CTA button works.

---

STEP 9: About Page (if exists) (20 min)
File: src/app/about/page.tsx or similar
Task: Create or update About section with honest story
New copy:
"ABOUT KOLLECT-IT

We started with a passion for collectibles and a frustration:
items worth $500-$15,000 fall through the cracks.

Auction houses have minimums around $10,000. Online marketplaces 
feel risky and impersonal. Private sales are hit-or-miss.

We built Kollect-It to fill that gap.

Our collection is personally curated. Every item is accurately described, 
professionally valued, and fairly priced—typically between auction value 
and retail price, so you get a better deal than traditional auctions.

We're a one-person operation committed to honesty. If you have questions, 
want additional photos, or disagree with our valuation, reach out. 
We'll listen and adjust if we're wrong.

Because the best collectibles deserve careful attention."

ACTION: Find About section or create new page. Add/replace with new copy.
VERIFY: Tone is personal, honest, and emphasizes unique value proposition.

---

STEP 10: Global CTA Updates (10 min)
Task: Check for CTAs that need updating
Current CTAs to check:
  - "Browse Collection" ✅ KEEP
  - "Discover Luxury" ❌ CHANGE to "Browse Collectibles"
  - "Register Now" ✅ KEEP (consider "Join Now" as alternative)
  - "Shop" ✅ KEEP
  - "Add to Cart" ✅ KEEP
  - "Sell Your Collection" ❌ CHANGE to "Sell Your Items"

ACTION: Search for old CTA phrases. Replace with new versions.
VERIFY: All CTAs are professional but approachable.

---

FINAL CHECKS:

□ Search entire project for: "luxury", "connoisseur", "white glove", "museum", "prestigious", "elite"
  → If found, replace with appropriate new language or remove
  
□ Check that "Sell Your Items" link/button exists and works (email or contact form)

□ Verify homepage loads correctly with all new copy

□ Run: bun run dev → Check dev server starts without errors

□ Click through pages and verify copy changes are live locally

□ Check mobile view (DevTools Ctrl+Shift+M) → text should be readable

□ Console check (F12 → Console) → Should be clean, no new red errors

---

COMPLETION STATUS:

Mark each step complete as you finish:

✅ Step 1: Homepage hero
✅ Step 2: Four-pillar tagline  
✅ Step 3: Security messaging
✅ Step 4: Authentication section
✅ Step 5: Shipping & returns
✅ Step 6: Trust builders
✅ Step 7: Category pages (all 4)
✅ Step 8: "Sell Your Items" section
✅ Step 9: About page
✅ Step 10: Global CTAs

When all steps are marked complete:

→ Run: bun run build (should compile successfully)
→ git add .
→ git commit -m "rebrand: Complete messaging overhaul to professional, honest tone"
→ git push origin main
→ Verify production URL works

REBRAND COMPLETE! 🎉
```

---

**THAT'S THE MASTER PROMPT. Copy everything between the backticks (starting with "You are an autonomous coding agent...") and paste into VS Code Copilot Chat.**
