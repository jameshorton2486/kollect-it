# 📋 PHASE 3 QUICK REFERENCE CARD

**For Claude Code (AI Agent in VS Code)**

---

## 🎯 YOUR MISSION

Build the Approval Queue + Pricing Engine for AI-analyzed products.

**Input:** Products analyzed by Claude + GPT-4V (Phase 2)  
**Output:** Approved products published to marketplace  
**Time:** 4-6 hours  
**Complexity:** Medium

---

## 📁 FILES YOU'LL CREATE

```
NEW FILES (11 total):

Database:
└─ Update: prisma/schema.prisma (add ProductApproval model)

Types:
└─ src/types/approval.ts

Pricing Engine:
├─ src/lib/pricing/pricing-engine.ts
├─ src/lib/pricing/market-data.ts (mock data)
└─ src/lib/pricing/confidence-calculator.ts

API Routes (5):
├─ src/app/api/admin/approvals/route.ts
├─ src/app/api/admin/approvals/[id]/approve/route.ts
├─ src/app/api/admin/approvals/[id]/reject/route.ts
├─ src/app/api/admin/approvals/[id]/request-changes/route.ts
└─ src/app/api/admin/pricing/calculate/route.ts

Components (3):
├─ src/components/admin/ApprovalCard.tsx
├─ src/components/admin/PriceReviewPanel.tsx
└─ src/components/admin/AuditTrail.tsx

Page (1):
└─ src/app/admin/approvals/page.tsx
```

---

## 🔧 IMPLEMENTATION CHECKLIST

- [ ] **Step 1** (30 min): Update Prisma schema + generate types
- [ ] **Step 2** (45 min): Build pricing engine (mock data for MVP)
- [ ] **Step 3** (60 min): Create 5 API endpoints
- [ ] **Step 4** (60 min): Build 3 UI components
- [ ] **Step 5** (30 min): Build approval admin page
- [ ] **Step 6** (30 min): End-to-end testing + commit

**Total: ~4.5 hours** ✅

---

## 💡 KEY TECHNOLOGIES

| Component | Tech | Status |
|-----------|------|--------|
| Database | Prisma + PostgreSQL | Already configured ✅ |
| Frontend | React 19 + Tailwind | Already configured ✅ |
| API | Next.js Route Handlers | Already configured ✅ |
| Auth | NextAuth.js (admin role check) | Already configured ✅ |
| Pricing | Node.js logic | NEW - you'll build |

---

## 🏗️ ARCHITECTURE AT A GLANCE

```
Admin uploads photo
        ↓
Claude + GPT-4V analyze
        ↓
ProductApproval created (status: pending)
        ↓
Admin goes to /admin/approvals
        ↓
Sees ApprovalCard with AI data + pricing panel
        ↓
Pricing engine shows:
  - AI suggested: $2500
  - Historical avg: $2200
  - Market data: $2800
  - Confidence: 78%
        ↓
Admin clicks "Approve" with final price
        ↓
Product.isDraft = false (now published)
Product appears in /shop
```

---

## 🎨 COMPONENT RESPONSIBILITIES

| Component | Shows | Returns |
|-----------|-------|---------|
| **ApprovalCard** | Product image + AI data | onApprove, onReject, onRequestChanges |
| **PriceReviewPanel** | 3 price sources + confidence | finalPrice |
| **AuditTrail** | What each AI did | (display only) |

---

## 📊 API ENDPOINTS YOU'LL BUILD

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/approvals` | GET | Fetch pending approvals |
| `/api/admin/approvals` | POST | Create approval from product |
| `/api/admin/approvals/[id]/approve` | POST | Approve & publish |
| `/api/admin/approvals/[id]/reject` | POST | Reject & delete |
| `/api/admin/approvals/[id]/request-changes` | POST | Send back for edits |
| `/api/admin/pricing/calculate` | POST | Calculate 3-source price |

---

## 🧠 PRICING ENGINE LOGIC

```javascript
Input: Product data
  ├─ aiSuggestedPrice (from Claude)
  ├─ category, era, rarity, condition
  └─ customRules (your business logic)

Process:
  1. Get AI price
  2. Query historical similar products → avg price
  3. Fetch market data → current market price
  4. Apply your pricing rules (multipliers, discounts)
  5. Calculate confidence based on data availability
  6. Return: finalPrice, confidence, reasoning

Output: {
  finalPrice: 2500,
  confidence: 78,
  breakdown: [
    { source: "AI", price: 2500, weight: 30% },
    { source: "Historical", price: 2200, weight: 35% },
    { source: "Market", price: 2800, weight: 35% }
  ]
}
```

---

## 🚀 START HERE

### Command to run:
```bash
cd c:\Users\james\kollect-it-marketplace-1
bun run dev  # Starts dev server on 3001
```

### Then follow PHASE_3_EXECUTION_PROMPT.md section by section

### Or copy this checklist into VS Code:
1. Open `PHASE_3_EXECUTION_PROMPT.md`
2. Follow Step 1 → Step 10
3. Each step has code templates
4. Paste and customize

---

## ✅ SUCCESS = THIS WORKFLOW

```
1. Go to http://localhost:3000/admin/dashboard
2. Click "AI Create Product" button
3. Upload image → AI analyzes
4. Go to http://localhost:3000/admin/approvals
5. See approval card with pricing
6. Click "Approve"
7. Product published to shop
8. View at http://localhost:3000/shop
```

---

## 🆘 IF YOU GET STUCK

**"Don't know where to start"**
→ Open PHASE_3_EXECUTION_PROMPT.md → Copy Step 1 code

**"Pricing engine too complex"**
→ Use mock data (hardcoded prices by rarity level)

**"API endpoint failing"**
→ Check admin role in auth; use getServerSession()

**"Component not showing"**
→ Verify imports; check className (use amber-500 theme)

**"Build fails"**
→ Run `bun run build 2>&1` to see errors
→ Check types in src/types/approval.ts

---

## 📞 KEY FILES TO REFERENCE

- `src/components/admin/ProductUploadForm.tsx` → Copy component structure
- `src/app/api/admin/products/analyze/route.ts` → Copy API pattern
- `src/app/admin/dashboard/page.tsx` → Copy page layout
- `prisma/schema.prisma` → Already has AI fields

---

## 🎯 DEFINITION OF DONE

```javascript
const phaseThreeDone = {
  approvalsPageLoads: true,
  approvalCardDisplays: true,
  pricingShowsThreeSources: true,
  canApproveProduct: true,
  auditTrailShowsAIWork: true,
  productPublishesToShop: true,
  buildPasses: true,
  allCommitted: true
}
```

---

## 🚀 GO TIME

You have everything you need. The execution prompt has all the details.

**Execute Step 1 → Step 10 in order.**

**If stuck: Read the relevant section in PHASE_3_EXECUTION_PROMPT.md**

**Good luck! 🎉**

---

**Phase 3 Status:** Ready for Execution  
**Your role:** Execute the 10-step plan  
**Build status:** ✅ Currently passing  
**Time estimate:** 4-6 hours  
**Next: Read PHASE_3_EXECUTION_PROMPT.md**
