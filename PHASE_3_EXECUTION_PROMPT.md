# 🚀 PHASE 3 COMPREHENSIVE EXECUTION PROMPT
## For Claude Code (VS Code AI Agent)

**Status:** Ready for Execution  
**Estimated Duration:** 4-6 hours  
**Complexity:** Medium-High  
**Build Status:** ✅ Current build passing

---

## CONTEXT & OVERVIEW

You are implementing **Phase 3: AI-Powered Product Creation System - Approval Queue & Intelligent Pricing Engine** for the Kollect-It marketplace.

**Current State:**
- Phase 2 (AI product analysis) is complete
- Claude + GPT-4V integration working
- ProductUploadForm component functional
- Admin dashboard has "AI Create Product" button
- Database schema extended with AI fields
- Build passing with 0 errors

**Your Mission:** Build the approval workflow and three-source pricing engine.

---

## PROJECT STRUCTURE CONTEXT

```
c:\Users\james\kollect-it-marketplace-1\
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx (ProductUploadForm integrated)
│   │   │   ├── login/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── approvals/ (NEW - you'll create this)
│   │   │       └── page.tsx (NEW)
│   │   └── api/
│   │       ├── admin/
│   │       │   ├── products/analyze/route.ts ✅
│   │       │   ├── products/create/route.ts ✅
│   │       │   └── approvals/ (NEW - you'll create this)
│   │       │       ├── route.ts
│   │       │       ├── [id]/approve/route.ts
│   │       │       ├── [id]/reject/route.ts
│   │       │       └── [id]/request-changes/route.ts
│   │       └── pricing/ (NEW)
│   │           └── calculate/route.ts
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ProductUploadForm.tsx ✅
│   │   │   ├── ApprovalCard.tsx (NEW)
│   │   │   ├── PriceReviewPanel.tsx (NEW)
│   │   │   └── AuditTrail.tsx (NEW)
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── claude-product-analyzer.ts ✅
│   │   │   ├── gpt4v-image-analyzer.ts ✅
│   │   │   └── product-generator.ts ✅
│   │   └── pricing/
│   │       ├── pricing-engine.ts (NEW)
│   │       ├── market-data.ts (NEW)
│   │       └── confidence-calculator.ts (NEW)
│   └── types/
│       └── approval.ts (NEW)
├── prisma/
│   ├── schema.prisma (has AI fields; add ProductApproval model)
│   └── migrations/
├── next.config.js
├── tsconfig.json
├── package.json
└── .env.local (add any new API keys needed)
```

---

## PHASE 3 ARCHITECTURE SPECIFICATION

### Component 1: Approval Queue System

#### Database Model (Add to `prisma/schema.prisma`)
```prisma
model ProductApproval {
  id              String    @id @default(cuid())
  product         Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId       String
  
  // AI Analysis Data
  aiTitle         String
  aiDescription   String
  aiShortDesc     String
  aiRarity        String
  aiAuthenticity  String
  estimatedEra    String
  investmentPot   String
  
  // Pricing Data
  aiSuggestedPrice    Float
  marketPrice         Float?
  historicalAvgPrice  Float?
  finalPrice          Float?
  priceConfidence     Float?
  pricingReasoning    String?
  
  // Approval Workflow
  status              String      @default("pending")    // pending, approved, rejected, changes_requested
  approverNotes       String?
  requestedChanges    String?
  reviewedAt          DateTime?
  reviewedBy          String?     // admin email
  
  // Audit Trail
  submittedAt         DateTime    @default(now())
  submittedBy         String?     // admin email
  changeHistory       Json        @default("[]")  // Array of {timestamp, change, by}
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  
  @@index([productId])
  @@index([status])
  @@index([createdAt])
}

// Extend Product model relationship:
// Add to existing Product model:
// approval    ProductApproval?
```

#### Components to Build

**`src/components/admin/ApprovalCard.tsx`**
```typescript
// Display pending product for approval
// Show:
// - Product image (from ImageKit)
// - AI-generated title, description, era, rarity, authenticity
// - AI suggested price
// - Image quality score
// - Category
// - Action buttons: Approve | Reject | Request Changes

// Props interface:
interface ApprovalCardProps {
  approval: ProductApproval & { product: Product & { images: Image[] } }
  onApprove: (id: string) => Promise<void>
  onReject: (id: string, reason: string) => Promise<void>
  onRequestChanges: (id: string, changes: string) => Promise<void>
}
```

**`src/components/admin/PriceReviewPanel.tsx`**
```typescript
// Show 3-source pricing with confidence
// Display:
// - AI Suggested Price: $X (from Claude analysis)
// - Historical Average: $Y (from your past products)
// - Market Data Price: $Z (from external API)
// - Calculated Confidence: 75% (based on data quality)
// - Price Rationale: "Why this price?"
// - Final Price Input (editable by approver)

// Props interface:
interface PriceReviewPanelProps {
  aiSuggestedPrice: number
  marketPrice?: number
  historicalAvgPrice?: number
  confidence: number
  reasoning: string
  onFinalPriceChange: (price: number) => void
}
```

**`src/components/admin/AuditTrail.tsx`**
```typescript
// Show which AI service generated which data
// Display timeline:
// - "Claude analyzed product → Generated title, description, rarity"
// - "GPT-4V analyzed image → Quality score: 8/10"
// - "Pricing engine calculated → $2500 (75% confidence)"
// - "Approver reviewed → Requested changes"

// Props interface:
interface AuditTrailProps {
  approval: ProductApproval
}
```

### Component 2: Approval Admin Page

**`src/app/admin/approvals/page.tsx`**
```typescript
'use client'

// Layout:
// Header: "Approval Queue (12 pending)"
// Filter tabs: All | Pending | Approved | Rejected | Changes Requested
// Search/sort options
// 
// Main grid/table:
// - Each row is an ApprovalCard
// - Click to expand full details
// - Shows PriceReviewPanel on right side
// - Shows AuditTrail in detail view
//
// Statistics:
// - Total pending: 12
// - Avg processing time
// - Approval rate: 85%
```

### Component 3: API Routes for Approval Workflow

**`src/app/api/admin/approvals/route.ts`**
```typescript
// GET: Fetch pending approvals
// Query params: status=pending, page=1, limit=20
// Returns: ProductApproval[] with related product/images

// POST: Create new approval from analyzed product
// Body: { productId, aiData }
// Returns: ProductApproval
```

**`src/app/api/admin/approvals/[id]/approve/route.ts`**
```typescript
// POST: Approve product for publication
// Body: { finalPrice, approverNotes }
// Actions:
// 1. Update ProductApproval.status = "approved"
// 2. Update Product.isDraft = false, publishedAt = now()
// 3. Add audit log entry
// 4. Send email notification (optional)
```

**`src/app/api/admin/approvals/[id]/reject/route.ts`**
```typescript
// POST: Reject approval (product won't be published)
// Body: { reason }
// Actions:
// 1. Update ProductApproval.status = "rejected"
// 2. Delete or archive the Product
// 3. Add audit log entry
```

**`src/app/api/admin/approvals/[id]/request-changes/route.ts`**
```typescript
// POST: Send back for editing
// Body: { requestedChanges }
// Actions:
// 1. Update ProductApproval.status = "changes_requested"
// 2. Update ProductApproval.requestedChanges
// 3. Product returns to draft
// 4. Admin can re-edit and resubmit
```

### Component 4: Three-Source Pricing Engine

**`src/lib/pricing/pricing-engine.ts`**
```typescript
// Master pricing orchestrator
// 
// Input: Product data (title, era, rarity, condition, category)
// 
// Process:
// 1. Get AI suggested price (already calculated)
// 2. Fetch historical data (your past products)
// 3. Fetch market data (external API or mock)
// 4. Apply your pricing rules
// 5. Calculate confidence score
// 6. Return: { price, confidence, reasoning, breakdown }

export interface PricingResult {
  finalPrice: number
  aiSuggestedPrice: number
  historicalAvgPrice?: number
  marketPrice?: number
  confidence: number  // 0-100%
  reasoning: string
  breakdown: {
    source: string
    price: number
    weight: number
  }[]
  appliedRules: string[]
}

export async function calculateThreeSourcePrice(
  product: Product & { aiAnalysis?: any }
): Promise<PricingResult>
```

**`src/lib/pricing/market-data.ts`**
```typescript
// Fetch external market data
// 
// Implement ONE of these (your choice):
// - Option A: Catawiki API (collectibles)
// - Option B: eBay API (broad market)
// - Option C: AskART API (fine art)
// - Option D: Mock data for MVP
//
// For MVP: Use mock data (hardcoded pricing by era/rarity)

export async function fetchMarketData(
  category: string,
  era: string,
  rarity: string
): Promise<{ price: number; source: string }>

// Mock implementation example:
// If category=Antique Books + era=19th Century + rarity=Very Rare
// Return: $1200 (mock market average)
```

**`src/lib/pricing/confidence-calculator.ts`**
```typescript
// Calculate confidence score (0-100%)
//
// Factors:
// - Data availability: Do we have historical data? (0-30%)
// - Data recency: How old is the data? (0-20%)
// - Market relevance: How similar are market items? (0-25%)
// - Era/rarity match: How many similar items exist? (0-25%)

export function calculateConfidence(
  hasHistoricalData: boolean,
  historicalDataAge: number,  // days
  marketDataPoints: number,
  rarityLevel: string
): number // 0-100

// Example:
// - Has historical data (15 past books): +20%
// - Data from last month: +15%
// - Found 3 similar market items: +20%
// - Very Rare rarity level: +25%
// = 80% confidence
```

---

## IMPLEMENTATION STEPS (RECOMMENDED ORDER)

### Phase 3a: Database & Types (45 min)

**Step 1: Update Prisma Schema**
```bash
# 1. Add ProductApproval model to prisma/schema.prisma
# 2. Add approval relationship to Product model
# 3. Run: bun run db:generate
# 4. Create migration: bun run db:migrate dev --name add_product_approval_model
```

**Step 2: Create TypeScript Types**
```typescript
// src/types/approval.ts
// Define: ProductApproval, ApprovalStatus, PricingResult
```

### Phase 3b: Pricing Engine (90 min)

**Step 3: Build Three-Source Pricing**
- Create `src/lib/pricing/confidence-calculator.ts`
- Create `src/lib/pricing/market-data.ts` (mock data for MVP)
- Create `src/lib/pricing/pricing-engine.ts`

**Step 4: Test Pricing Engine**
```bash
# Create a simple test file to verify pricing calculations
# bun run build && echo "✅ Pricing engine compiles"
```

### Phase 3c: API Endpoints (120 min)

**Step 5: Build Approval API Routes**
- Create `/api/admin/approvals/route.ts` (GET/POST)
- Create `/api/admin/approvals/[id]/approve/route.ts`
- Create `/api/admin/approvals/[id]/reject/route.ts`
- Create `/api/admin/approvals/[id]/request-changes/route.ts`

**Step 6: Build Pricing API Route**
- Create `/api/admin/pricing/calculate/route.ts`

### Phase 3d: UI Components (90 min)

**Step 7: Build Approval Components**
- Create `src/components/admin/ApprovalCard.tsx`
- Create `src/components/admin/PriceReviewPanel.tsx`
- Create `src/components/admin/AuditTrail.tsx`

**Step 8: Build Approval Admin Page**
- Create `src/app/admin/approvals/page.tsx`
- Integrate with dashboard (add "Approvals" tab/link)

### Phase 3e: Integration & Testing (60 min)

**Step 9: End-to-End Testing**
```bash
# 1. Start dev server: bun run dev
# 2. Go to /admin/dashboard → "AI Create Product"
# 3. Upload image, AI analyzes
# 4. Go to /admin/approvals
# 5. Review pricing and approve
# 6. Check product published
```

**Step 10: Build & Commit**
```bash
bun run build  # Should pass with 0 errors
git add -A
git commit -m "feat: Phase 3 - approval queue and pricing engine complete"
```

---

## KEY DECISION POINTS FOR YOU

### Decision 1: Market Data Source
**Question:** Which pricing API should we use for market data?

Options:
- **Catawiki API** (recommended for collectibles) - Most relevant
- **eBay API** (broadest market coverage) - Most data points
- **AskART API** (art-specific) - Better for Fine Art category
- **Mock Data** (fastest MVP) - Good enough for testing

**Recommendation:** Start with mock data (1-hour MVP), then upgrade to Catawiki later.

### Decision 2: Pricing Rules
**Question:** What's your markup/discount strategy?

Example rules:
```javascript
// Your current pricing rules (fill these in):
const pricingRules = {
  rarityMultiplier: {
    "Common": 1.0,
    "Uncommon": 1.5,
    "Rare": 2.5,
    "Very Rare": 4.0,
    "Extremely Rare": 7.0,
  },
  eraModifier: {
    "Ancient": 1.2,
    "Medieval": 1.1,
    "Renaissance": 1.15,
    "17th Century": 1.0,
    "18th Century": 0.95,
    "19th Century": 0.9,
    "20th Century": 0.8,
  },
  conditionDiscount: {
    "Fine": 0.95,
    "Very Good": 0.85,
    "Good": 0.7,
    "Fair": 0.5,
  },
  yourMargin: 1.3,  // 30% margin over market price
}
```

### Decision 3: Approval Workflow
**Question:** Simple or complex approval?

Options:
- **Simple (Recommended):** Approve → Publish OR Reject → Delete
- **Complex:** Approve → Publish, Reject → Delete, Request Changes → Re-edit

**Recommendation:** Start simple, add complexity later.

---

## SUCCESS CRITERIA

You'll know Phase 3 is complete when:

✅ **Approval Queue Page Loads**
```bash
http://localhost:3000/admin/approvals → Shows "Approval Queue" page
```

✅ **Can Create Test Approval**
```bash
- Upload product via AI → Creates ProductApproval in DB
- Approval shows in queue with status "pending"
```

✅ **Pricing Displays Correctly**
```bash
- Shows AI suggested price
- Shows mock market data
- Shows historical data (if available)
- Shows confidence score
```

✅ **Can Approve Product**
```bash
- Click "Approve" button
- Product.isDraft becomes false
- ProductApproval.status becomes "approved"
- Product now visible in /shop
```

✅ **Audit Trail Works**
```bash
- Click product → See audit trail
- Shows Claude analyzed X, GPT-4V analyzed Y, etc.
```

✅ **Build Passes**
```bash
bun run build → ✅ 0 errors, 47+ pages generated
```

---

## NOTES FOR IMPLEMENTATION

1. **Use existing patterns:** Follow the style of ProductUploadForm component
2. **Use amber/gold theme:** Consistent with admin dashboard
3. **Error handling:** Graceful fallbacks if market API fails
4. **Loading states:** Show "Calculating price..." while fetching market data
5. **Logging:** Log all approval actions (already in place for AI)
6. **Security:** All endpoints check admin role

---

## ROBUST ERROR HANDLING & LOGGING STRATEGY

### Error Handling Architecture

**Global Error Handler (`src/lib/errors/handler.ts`)**
```typescript
export class ApprovalError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public context?: Record<string, any>
  ) {
    super(message)
    this.name = 'ApprovalError'
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApprovalError) {
    return {
      status: error.statusCode,
      body: {
        error: error.code,
        message: error.message,
        context: error.context,
      }
    }
  }
  
  // Unexpected error
  return {
    status: 500,
    body: {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    }
  }
}
```

**Logger Service (`src/lib/logging/logger.ts`)**
```typescript
import fs from 'fs/promises'
import path from 'path'

interface LogEntry {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  service: string
  message: string
  error?: string
  stack?: string
  context?: Record<string, any>
}

export class Logger {
  private logsDir = 'logs'
  
  async ensureLogsDir() {
    try {
      await fs.mkdir(this.logsDir, { recursive: true })
    } catch (e) {
      console.error('Failed to create logs directory', e)
    }
  }
  
  async log(entry: LogEntry) {
    await this.ensureLogsDir()
    
    // Console output
    const prefix = `[${entry.timestamp}] [${entry.level}] [${entry.service}]`
    console.log(`${prefix} ${entry.message}`, entry.context || '')
    
    // File output
    const date = entry.timestamp.split('T')[0]
    const filename = path.join(this.logsDir, `${entry.level.toLowerCase()}-${date}.log`)
    
    const logLine = JSON.stringify(entry) + '\n'
    try {
      await fs.appendFile(filename, logLine)
    } catch (e) {
      console.error(`Failed to write to ${filename}:`, e)
    }
  }
  
  info(service: string, message: string, context?: Record<string, any>) {
    return this.log({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service,
      message,
      context,
    })
  }
  
  warn(service: string, message: string, context?: Record<string, any>) {
    return this.log({
      timestamp: new Date().toISOString(),
      level: 'WARN',
      service,
      message,
      context,
    })
  }
  
  error(service: string, message: string, error?: Error, context?: Record<string, any>) {
    return this.log({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      service,
      message,
      error: error?.message,
      stack: error?.stack,
      context,
    })
  }
  
  debug(service: string, message: string, context?: Record<string, any>) {
    if (process.env.DEBUG === 'true') {
      return this.log({
        timestamp: new Date().toISOString(),
        level: 'DEBUG',
        service,
        message,
        context,
      })
    }
  }
}

export const logger = new Logger()
```

### API Route Error Handling Example

**`src/app/api/admin/approvals/[id]/approve/route.ts` (with error handling)**
```typescript
import { logger } from '@/lib/logging/logger'
import { ApprovalError, handleApiError } from '@/lib/errors/handler'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = crypto.randomUUID()
  
  try {
    await logger.info('ApprovalService', 'Approve request started', {
      requestId,
      approvalId: params.id,
    })
    
    // Validate input
    const body = await request.json()
    if (!body.finalPrice || body.finalPrice <= 0) {
      throw new ApprovalError(
        'INVALID_PRICE',
        400,
        'Final price must be greater than 0',
        { finalPrice: body.finalPrice }
      )
    }
    
    // Check admin authorization
    const session = await getSession()
    if (!session?.user?.isAdmin) {
      await logger.warn('ApprovalService', 'Unauthorized approval attempt', {
        requestId,
        userId: session?.user?.id,
      })
      throw new ApprovalError(
        'UNAUTHORIZED',
        403,
        'Only admins can approve products'
      )
    }
    
    // Fetch approval
    const approval = await prisma.productApproval.findUnique({
      where: { id: params.id },
      include: { product: true },
    })
    
    if (!approval) {
      throw new ApprovalError(
        'NOT_FOUND',
        404,
        'Approval not found',
        { approvalId: params.id }
      )
    }
    
    if (approval.status !== 'pending') {
      throw new ApprovalError(
        'INVALID_STATE',
        400,
        `Cannot approve product with status: ${approval.status}`,
        { currentStatus: approval.status }
      )
    }
    
    // Update approval and product
    const updatedApproval = await prisma.productApproval.update({
      where: { id: params.id },
      data: {
        status: 'approved',
        finalPrice: body.finalPrice,
        approverNotes: body.notes,
        reviewedAt: new Date(),
        reviewedBy: session.user.email,
        changeHistory: approval.changeHistory && Array.isArray(approval.changeHistory)
          ? [...(approval.changeHistory as any[]), {
              timestamp: new Date().toISOString(),
              change: 'approved',
              by: session.user.email,
              finalPrice: body.finalPrice,
            }]
          : [{
              timestamp: new Date().toISOString(),
              change: 'approved',
              by: session.user.email,
              finalPrice: body.finalPrice,
            }],
      },
    })
    
    await prisma.product.update({
      where: { id: approval.productId },
      data: {
        isDraft: false,
        publishedAt: new Date(),
        price: body.finalPrice,
      },
    })
    
    await logger.info('ApprovalService', 'Product approved successfully', {
      requestId,
      approvalId: params.id,
      productId: approval.productId,
      finalPrice: body.finalPrice,
    })
    
    return NextResponse.json(updatedApproval, { status: 200 })
    
  } catch (error) {
    const errorInfo = {
      requestId,
      approvalId: params.id,
      timestamp: new Date().toISOString(),
      errorType: error instanceof ApprovalError ? error.code : 'UNKNOWN_ERROR',
    }
    
    await logger.error(
      'ApprovalService',
      'Approve request failed',
      error instanceof Error ? error : new Error(String(error)),
      errorInfo
    )
    
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
```

### Component Error Boundary

**`src/components/admin/ApprovalErrorBoundary.tsx`**
```typescript
'use client'

import React, { ReactNode } from 'react'
import { logger } from '@/lib/logging/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ApprovalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ApprovalErrorBoundary', 'Component error caught', error, {
      componentStack: errorInfo.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 rounded-lg bg-red-50 border border-red-200">
            <h2 className="text-lg font-semibold text-red-900">
              Something went wrong
            </h2>
            <p className="text-red-700 mt-2">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
```

### Pricing Engine Error Handling

**`src/lib/pricing/pricing-engine.ts` (with error handling)**
```typescript
import { logger } from '@/lib/logging/logger'
import { ApprovalError } from '@/lib/errors/handler'

export async function calculateThreeSourcePrice(
  product: Product & { aiAnalysis?: any }
): Promise<PricingResult> {
  const requestId = crypto.randomUUID()
  
  try {
    await logger.info('PricingEngine', 'Price calculation started', {
      requestId,
      productId: product.id,
      category: product.category,
    })

    // Validate inputs
    if (!product.id) {
      throw new ApprovalError(
        'INVALID_PRODUCT',
        400,
        'Product ID is required for pricing'
      )
    }

    if (!product.aiAnalysis) {
      await logger.warn('PricingEngine', 'No AI analysis found', {
        requestId,
        productId: product.id,
      })
      throw new ApprovalError(
        'NO_AI_DATA',
        400,
        'Product must have AI analysis before pricing'
      )
    }

    // Source 1: AI Suggested Price
    const aiPrice = product.aiAnalysis.suggestedPrice || 0
    if (aiPrice <= 0) {
      throw new ApprovalError(
        'INVALID_AI_PRICE',
        400,
        'AI suggested price must be greater than 0',
        { aiPrice }
      )
    }

    // Source 2: Historical Data (with error handling)
    let historicalPrice: number | undefined
    try {
      historicalPrice = await getHistoricalPrice(product.category, product.id)
      await logger.debug('PricingEngine', 'Historical price retrieved', {
        requestId,
        category: product.category,
        historicalPrice,
      })
    } catch (error) {
      await logger.warn('PricingEngine', 'Failed to fetch historical data', {
        requestId,
        error: error instanceof Error ? error.message : String(error),
      })
      // Don't fail; continue with other sources
    }

    // Source 3: Market Data (with fallback)
    let marketPrice: number | undefined
    try {
      marketPrice = await fetchMarketData(
        product.category,
        product.estimatedEra || 'Unknown',
        product.rarity || 'Common'
      )
      await logger.debug('PricingEngine', 'Market data retrieved', {
        requestId,
        marketPrice,
      })
    } catch (error) {
      await logger.warn('PricingEngine', 'Failed to fetch market data', {
        requestId,
        error: error instanceof Error ? error.message : String(error),
      })
      // Use mock fallback
      marketPrice = getMockMarketPrice(product.category, product.rarity || 'Common')
    }

    // Calculate confidence
    const confidence = calculateConfidence(
      !!historicalPrice,
      historicalPrice ? 30 : 0,
      marketPrice ? 1 : 0,
      product.rarity || 'Common'
    )

    // Determine final price
    const prices = [aiPrice, historicalPrice, marketPrice].filter(Boolean)
    const finalPrice = prices.reduce((a, b) => a + b, 0) / prices.length

    const result: PricingResult = {
      finalPrice,
      aiSuggestedPrice: aiPrice,
      historicalAvgPrice: historicalPrice,
      marketPrice,
      confidence,
      reasoning: buildPricingReasoning(aiPrice, historicalPrice, marketPrice),
      breakdown: [
        { source: 'AI Analysis', price: aiPrice, weight: 0.5 },
        ...(historicalPrice ? [{ source: 'Historical Data', price: historicalPrice, weight: 0.3 }] : []),
        ...(marketPrice ? [{ source: 'Market Data', price: marketPrice, weight: 0.2 }] : []),
      ],
      appliedRules: [],
    }

    await logger.info('PricingEngine', 'Price calculation completed', {
      requestId,
      productId: product.id,
      finalPrice,
      confidence,
    })

    return result

  } catch (error) {
    await logger.error(
      'PricingEngine',
      'Price calculation failed',
      error instanceof Error ? error : new Error(String(error)),
      { requestId, productId: product.id }
    )
    throw error
  }
}
```

---

## EMERGENCY SHORTCUTS

If you get stuck:

**"Pricing engine is too complex"**
→ Use mock data (just hardcoded prices by rarity level)

**"Market API integration is hard"**
→ Skip it; use only historical + AI data

**"Approval workflow too complicated"**
→ Start with just "Approve" button (reject later)

---

## DEPLOYMENT NOTE

After Phase 3 is complete:
- Run `bun run db:migrate:deploy` to apply schema changes
- Deploy to Vercel: `git push origin main` (auto-deploys)
- Verify approvals queue works in production

---

## YOU'RE READY TO EXECUTE

You have:
- ✅ Clear architecture specification
- ✅ Detailed implementation steps
- ✅ Component templates
- ✅ Success criteria
- ✅ Emergency shortcuts
- ✅ Existing codebase as reference

**Execute the steps in order. If you hit a blocker, check the relevant section above for guidance.**

**Happy building! 🚀**

---

*Last updated: November 9, 2025*  
*Phase 3 Implementation Ready*  
*Estimated completion: 4-6 hours*  
*Build status: ✅ Passing*
