# Phase 4 Quick Reference

## URLs & Routes

| Route | Purpose | Auth |
|-------|---------|------|
| `/admin/analytics` | Analytics dashboard | Admin |
| `/api/admin/analytics` | Analytics data API | Admin |

---

## API Endpoint

### GET /api/admin/analytics

**Example Request:**
```bash
curl "http://localhost:3000/api/admin/analytics?startDate=2025-10-01&endDate=2025-11-09"
```

**Query Parameters:**
```
startDate   (YYYY-MM-DD)  - Filter from date
endDate     (YYYY-MM-DD)  - Filter to date
category    (string)      - Filter by category
status      (enum)        - APPROVED|REJECTED|ALL
```

**Response Structure:**
```json
{
  "dateRange": { "startDate": "...", "endDate": "..." },
  "approvalMetrics": {
    "totalApprovals": 42,
    "totalRejections": 8,
    "pendingCount": 15,
    "approvalRate": 84.0,
    "averageTimeToApprove": 45,
    "averageTimeToReject": 30,
    "todayApprovals": 5,
    "thisWeekApprovals": 28,
    "thisMonthApprovals": 42
  },
  "pricingAnalysis": {
    "averagePricingAccuracy": 87.5,
    "averageAIPriceDeviation": 2.3,
    "avgConfidenceScore": 78.5,
    "categoriesByDeviation": [...],
    "priceOverridesPercentage": 12.5
  },
  "productPerformance": {
    "totalProducts": 156,
    "averageTimeToSell": 7,
    "sellThroughRate": 68.5,
    "averageSellingPrice": 1250.50,
    "priceAccuracy": 92.0,
    "bestPerformingCategory": "Vintage Comics",
    "lowestPerformingCategory": "Sports Cards",
    "trendingCategories": [...]
  },
  "revenueInsights": {
    "totalRevenue": 185750.50,
    "averageOrderValue": 1250.34,
    "totalOrdersPlaced": 148,
    "conversionRate": 94.87,
    "revenueByCategory": [...],
    "revenueGrowth": {
      "daily": 3.5,
      "weekly": 8.2,
      "monthly": 15.7
    }
  },
  "approvalTrends": [
    {
      "date": "2025-11-09",
      "approvalsCount": 5,
      "rejectionsCount": 1,
      "averageConfidence": 79.5,
      "averagePrice": 1250.00
    },
    ...
  ],
  "categoryMetrics": [
    {
      "name": "Vintage Comics",
      "productCount": 45,
      "approvalRate": 88.5,
      "averagePrice": 150.00,
      "averageConfidence": 82.3,
      "revenue": 45000.00,
      "soldCount": 300,
      "growthRate": 12.5
    },
    ...
  ],
  "timestamp": "2025-11-09T14:30:45.123Z"
}
```

---

## Dashboard Sections

### 1. Metric Cards (Top Row)
```
[Total Approvals]  [Pending Review]  [Total Revenue]  [Avg Order Value]
     42 items        15 items           $185,750        $1,250
     ↑ 84% rate      awaiting           ↑ 15.7% growth  per order
```

### 2. Approval Trends (Left Chart)
```
Last 7 days trend:
Nov 03: ✓ 6 approved, ✗ 1 rejected (Conf: 78%)
Nov 04: ✓ 5 approved, ✗ 0 rejected (Conf: 80%)
Nov 05: ✓ 7 approved, ✗ 2 rejected (Conf: 77%)
...
```

### 3. Revenue by Category (Right Chart)
```
Vintage Comics      ████████░░░░  28.5% • 300 units
Trading Cards       ██████░░░░░░  18.2% • 182 units
Collectibles        █████░░░░░░░  15.3% • 153 units
Memorabilia         ███░░░░░░░░░   9.4% • 94 units
Books               ██░░░░░░░░░░   6.2% • 62 units
```

### 4. Category Performance Table
```
Category         Products  Approval%  Avg Price  Confidence  Revenue    Growth
Vintage Comics   45        88.5%      $150.00   82.3        $45,000    +12.5%
Trading Cards    32        91.2%      $85.50    84.1        $33,760    +8.3%
Collectibles     28        85.3%      $220.00   79.5        $28,160    +5.2%
...
```

### 5. Pricing Analysis Cards
```
[Accuracy]         [Confidence]       [Overrides]
87.5%             78.5               12.5%
Pricing accurate   Avg confidence     Admin changed
```

### 6. Product Performance Cards
```
[Total]  [Sell-Through]  [Avg Price]  [Time-to-Sell]
156      68.5%          $1,250.50    7 days
```

---

## Data Structure Examples

### ApprovalMetrics
```typescript
{
  totalApprovals: 42,
  totalRejections: 8,
  pendingCount: 15,
  approvalRate: 84.0,  // %
  averageTimeToApprove: 45,  // minutes
  averageTimeToReject: 30,
  todayApprovals: 5,
  thisWeekApprovals: 28,
  thisMonthApprovals: 42
}
```

### CategoryMetrics
```typescript
{
  name: "Vintage Comics",
  productCount: 45,
  approvalRate: 88.5,  // %
  averagePrice: 150.00,
  averageConfidence: 82.3,
  revenue: 45000.00,
  soldCount: 300,
  growthRate: 12.5  // %
}
```

### RevenueByCategory
```typescript
{
  category: "Vintage Comics",
  revenue: 45000.00,
  productsSold: 300,
  percentage: 28.5  // of total revenue
}
```

---

## Component Props

### AnalyticsDashboard
```typescript
interface DashboardProps {
  initialData?: AdminAnalyticsSummary;
}

<AnalyticsDashboard initialData={preloadedData} />
```

### MetricCard
```typescript
interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  prefix?: string;  // "$", "%", etc
  trend?: number;   // +/- percentage
  trendLabel?: string;
  color?: string;   // "bg-blue-50"
  borderColor?: string;  // "border-blue-200"
}
```

### ApprovalTrendChart
```typescript
interface ApprovalTrendChartProps {
  data: ApprovalTrends[];  // 30-day array
}
```

### RevenueByCategory
```typescript
interface RevenueByCategoryProps {
  data: RevenueByCategory[];  // Top 5 categories
}
```

### CategoryMetricsGrid
```typescript
interface CategoryMetricsGridProps {
  data: CategoryMetrics[];  // All categories
}
```

---

## Key Functions

### getApprovalMetrics(params)
Returns approval rate, pending count, timing metrics

### getPricingAnalysis(params)
Returns accuracy, confidence, AI deviations by category

### getProductPerformance(params)
Returns time-to-sell, sell-through rate, trending categories

### getRevenueInsights(params)
Returns total revenue, AOV, conversion rate, category breakdown

### getApprovalTrends(days=30)
Returns time-series approval/rejection data for N days

### getCategoryMetrics(params)
Returns per-category performance metrics

### getAnalyticsSummary(params)
Orchestrates all functions in parallel, returns complete snapshot

---

## Common Queries

### Last 30 Days Analytics
```
GET /api/admin/analytics
```

### Last Quarter Analytics
```
GET /api/admin/analytics?startDate=2025-07-09&endDate=2025-10-09
```

### Vintage Comics Category Only
```
GET /api/admin/analytics?category=Vintage Comics
```

### Approved Products Only
```
GET /api/admin/analytics?status=APPROVED
```

### Rejected Products Only
```
GET /api/admin/analytics?status=REJECTED
```

### Combined Filters
```
GET /api/admin/analytics?startDate=2025-10-01&category=Collectibles&status=APPROVED
```

---

## Files Reference

| File | Lines | Purpose |
|------|-------|---------|
| `src/lib/analytics/types.ts` | 113 | 12 type interfaces |
| `src/lib/analytics/queries.ts` | 403 | 6 query functions |
| `src/app/api/admin/analytics/route.ts` | 48 | API endpoint |
| `src/components/admin/AnalyticsDashboard.tsx` | 190 | Main component |
| `src/components/admin/charts/MetricCard.tsx` | 45 | Metric display |
| `src/components/admin/charts/ApprovalTrendChart.tsx` | 76 | Trend chart |
| `src/components/admin/charts/RevenueByCategory.tsx` | 48 | Category chart |
| `src/components/admin/charts/CategoryMetricsGrid.tsx` | 63 | Table view |
| `src/app/admin/analytics/page.tsx` | 16 | Route page |

**Total: 9 files, 1,174 lines**

---

## Performance Tips

1. **Date ranges:** Shorter ranges = faster queries
2. **Filtering:** Narrow results with category/status
3. **Caching:** API disables cache (always fresh)
4. **Updates:** Click "Refresh" to reload data

---

## Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 401 | Unauthorized | Login as admin user |
| 403 | Forbidden | Ensure user has ADMIN role |
| 500 | Server error | Check database connection |

---

## Troubleshooting

**No data showing?**
- Check admin role: `user.role === 'ADMIN'`
- Verify approvals exist in database
- Check date range isn't too narrow

**Charts look empty?**
- Insufficient data for period
- Try wider date range (30+ days)
- Ensure products have sales

**API returns 401?**
- Session expired: Refresh page
- Check authentication cookie
- Verify NextAuth setup

**Slow performance?**
- Large date ranges slow queries
- Limit to 90 days max
- Reduce category count

---

## Next Steps

1. **View dashboard:** `/admin/analytics`
2. **Adjust dates:** Pick custom range
3. **Click Refresh:** Load updated data
4. **Analyze trends:** Review 5 sections
5. **Export data:** (Feature coming in Phase 4.1)

---

*Last Updated: November 9, 2025*
*Phase 4: Admin Analytics Dashboard*
