# Error Handling & Logging Guide for Phase 3

## Quick Reference: Where Error Files Are Located

### Log Files Directory Structure

```
project-root/
└── logs/
    ├── error-2025-11-09.log       # All errors from Nov 9
    ├── error-2025-11-10.log       # All errors from Nov 10
    ├── warn-2025-11-09.log        # All warnings from Nov 9
    ├── info-2025-11-09.log        # All info logs from Nov 9
    └── debug-2025-11-09.log       # Debug logs (only if DEBUG=true)
```

### Browser Console Errors

**Location:** Your browser's Developer Tools

- **Chrome/Edge:** F12 → Console tab
- **Firefox:** F12 → Console tab
- Shows real-time errors and logging

### Server Logs (Development)

**Location:** Terminal running `bun run dev`

- Shows all console.log, console.error, etc.
- Real-time output during development
- Prefixed with timestamps and log levels

### Database Errors

**Location:** Prisma error logs

- **File:** `.next/logs/` (Next.js build logs)
- **File:** `prisma/debug.log` (if DEBUG enabled)

### Next.js Build Errors

**Location:** Terminal output when running `bun run build`

- Shows TypeScript errors
- Shows bundling errors
- Shows runtime warnings

---

## Log File Format

Each log entry is a JSON object on a single line:

```json
{
  "timestamp": "2025-11-09T14:32:15.123Z",
  "level": "ERROR",
  "service": "PricingEngine",
  "message": "Price calculation failed",
  "error": "Product ID is required for pricing",
  "stack": "Error: Product ID is required...\n    at calculateThreeSourcePrice...",
  "context": {
    "requestId": "uuid-string",
    "productId": "prod_123",
    "category": "Books"
  }
}
```

### Parsing Log Files

**View recent errors:**

```bash
# PowerShell - Last 20 error lines
Get-Content logs/error-*.log | Select-Object -Last 20

# PowerShell - Errors from specific date
Get-Content logs/error-2025-11-09.log | ConvertFrom-Json
```

**Search for specific errors:**

```bash
# Find all pricing errors
Select-String "PricingEngine" logs/*.log

# Find all unauthorized attempts
Select-String "UNAUTHORIZED" logs/*.log

# Find errors in last 2 hours
Get-Content logs/error-*.log | Where-Object { $_ -match '"error":".*"' }
```

---

## Error Codes Reference

### Approval Service Errors

| Code             | HTTP Status | Meaning                      | Action                        |
| ---------------- | ----------- | ---------------------------- | ----------------------------- |
| `INVALID_PRICE`  | 400         | Price is invalid (≤ 0)       | Check price input validation  |
| `UNAUTHORIZED`   | 403         | User is not an admin         | Check authentication          |
| `NOT_FOUND`      | 404         | Approval doesn't exist       | Check approval ID             |
| `INVALID_STATE`  | 400         | Can't approve (wrong status) | Check current approval status |
| `DATABASE_ERROR` | 500         | Database operation failed    | Check database connection     |

### Pricing Engine Errors

| Code                           | HTTP Status | Meaning                   | Action                   |
| ------------------------------ | ----------- | ------------------------- | ------------------------ |
| `INVALID_PRODUCT`              | 400         | Product data invalid      | Verify product exists    |
| `NO_AI_DATA`                   | 400         | Product lacks AI analysis | Run AI analysis first    |
| `INVALID_AI_PRICE`             | 400         | AI price is ≤ 0           | Check AI analysis output |
| `MARKET_DATA_UNAVAILABLE`      | 503         | Market API is down        | Uses fallback mock data  |
| `CONFIDENCE_CALCULATION_ERROR` | 500         | Confidence calc failed    | Check historical data    |

### Common API Errors

| Code                    | HTTP Status | Meaning                          |
| ----------------------- | ----------- | -------------------------------- |
| `INTERNAL_SERVER_ERROR` | 500         | Unexpected error (logs included) |
| `VALIDATION_ERROR`      | 422         | Request validation failed        |
| `RATE_LIMIT_EXCEEDED`   | 429         | Too many requests                |

---

## How to Debug Using Logs

### Scenario 1: Approval Failed to Process

**Find the error:**

```bash
# Search for the approval ID
Select-String "approval_123" logs/error-*.log
```

**Example output:**

```
logs/error-2025-11-09.log:1:"error":"INVALID_STATE","message":"Cannot approve product with status: rejected"
```

**Action:** The product was already rejected. Contact admin or request changes instead.

---

### Scenario 2: Pricing Calculation Not Working

**Find the error:**

```bash
# Find all pricing errors
Select-String "PricingEngine" logs/error-*.log
```

**Example output:**

```json
{
  "timestamp": "2025-11-09T14:32:15.123Z",
  "level": "ERROR",
  "service": "PricingEngine",
  "message": "Price calculation failed",
  "error": "Product must have AI analysis before pricing",
  "context": {
    "productId": "prod_456",
    "hasAiAnalysis": false
  }
}
```

**Action:** Product needs to be analyzed with AI first.

---

### Scenario 3: Market Data API Connection Failed

**Find the warning:**

```bash
# Find market data failures
Select-String "market data" logs/warn-*.log
```

**Expected behavior:** System falls back to mock data automatically. Pricing still works, but with lower confidence score.

---

## Setting Up Error Monitoring

### Enable Debug Logging

**Add to `.env.local`:**

```bash
DEBUG=true
```

Then restart dev server:

```bash
bun run dev
```

Debug logs will appear in `logs/debug-*.log`

### Monitor Logs in Real-Time

**PowerShell - Watch error log:**

```powershell
Get-Content logs/error-*.log -Wait -Tail 5
```

**PowerShell - Watch all logs:**

```powershell
Get-Content logs/*.log -Wait -Tail 10
```

---

## Error Handling Best Practices

### 1. Always Include Context

```typescript
// ❌ Bad
await logger.error("Service", "Something failed", error);

// ✅ Good
await logger.error("Service", "Price calculation failed", error, {
  productId: product.id,
  requestId: requestId,
  attemptedPrice: calculatedPrice,
});
```

### 2. Use Specific Error Codes

```typescript
// ❌ Bad
throw new Error("Approval failed");

// ✅ Good
throw new ApprovalError(
  "INVALID_STATE",
  400,
  "Cannot approve product with status: rejected",
  { currentStatus: approval.status },
);
```

### 3. Log at Right Level

- **ERROR:** Something failed and needs action
- **WARN:** Something unexpected but system recovers
- **INFO:** Important business event (approval created, product published)
- **DEBUG:** Detailed technical info for troubleshooting

```typescript
// Market API fails - use fallback
await logger.warn("PricingEngine", "Market API failed, using mock data", {
  error: err.message,
});

// Product approved successfully
await logger.info("ApprovalService", "Product approved", {
  productId,
  finalPrice,
});
```

### 4. Graceful Error Recovery

```typescript
// ✅ Good: Tries market API, falls back to mock
let marketPrice: number | undefined
try {
  marketPrice = await fetchMarketData(...)
} catch (error) {
  await logger.warn('PricingEngine', 'Market API failed', { error: error.message })
  // Use mock fallback
  marketPrice = getMockMarketPrice(...)
}
```

---

## Viewing Logs in Production

### Vercel Deployment Logs

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Click "Deployments" tab
4. View logs under each deployment

### Environment Variables for Production

Add to Vercel project settings:

```
DEBUG=false  (keep false for performance)
LOG_LEVEL=INFO  (only log INFO and above)
```

---

## Troubleshooting Guide

### "Logs directory doesn't exist"

**Fix:**

```bash
# Create it manually
New-Item -ItemType Directory -Force -Path "logs"
```

Then restart your dev server.

### "Can't read log files - Permission denied"

**Fix:**

```bash
# On Windows, check file permissions
Get-Item logs/*.log | Get-Acl

# Make sure your user can read them
icacls logs /grant $env:USERNAME:F /T
```

### "Log file too large"

**Clean up old logs:**

```bash
# Keep only recent logs (optional - do this monthly)
Remove-Item logs/error-2025-10*.log  # Delete October logs
```

### "Missing context in errors"

**Add logging statement:**

```typescript
await logger.debug("MyService", "Debug checkpoint", {
  variableName: value,
  checkpointName: "after-database-query",
});
```

---

## Integration with Error Tracking (Future)

To integrate with Sentry or similar:

```typescript
// Add to logger.ts
import * as Sentry from "@sentry/nextjs"

export class Logger {
  error(service: string, message: string, error?: Error, context?: Record<string, any>) {
    // Log locally
    this.log({ timestamp: ..., level: 'ERROR', ... })

    // Also send to Sentry for monitoring
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error, { contexts: { context } })
    }
  }
}
```

---

## File Locations Summary

| What            | Where                          | How to Access                |
| --------------- | ------------------------------ | ---------------------------- |
| Error logs      | `./logs/error-YYYY-MM-DD.log`  | Text editor or `Get-Content` |
| Info logs       | `./logs/info-YYYY-MM-DD.log`   | Text editor or `Get-Content` |
| Warn logs       | `./logs/warn-YYYY-MM-DD.log`   | Text editor or `Get-Content` |
| Debug logs      | `./logs/debug-YYYY-MM-DD.log`  | When DEBUG=true              |
| Browser errors  | Developer Console (F12)        | Chrome/Firefox DevTools      |
| Server console  | Terminal running `bun run dev` | Watch terminal output        |
| Build errors    | Terminal output                | After `bun run build`        |
| Database errors | `.next/logs/`                  | Next.js internal             |
| Next.js logs    | `.next/logs/`                  | After each build             |

---

## Quick Commands

```powershell
# View last 20 errors
Get-Content logs/error-*.log | Select-Object -Last 20

# Search for specific approval
Select-String "approval_123" logs/*.log

# Count errors by type
Select-String '"error":"' logs/error-*.log | Measure-Object

# Export errors to CSV
Get-Content logs/error-*.log | ConvertFrom-Json | Export-Csv errors.csv

# Find errors from last hour
Get-Content logs/error-*.log | Where-Object { $_ -match (Get-Date).AddHours(-1).ToString("yyyy-MM-ddTHH") }

# Watch errors in real-time
Get-Content logs/error-*.log -Wait -Tail 5

# Clear old logs
Remove-Item logs/error-2025-10*.log  # Example: remove October logs
```

---

## Next Steps

1. **Create logger service:** Copy `src/lib/logging/logger.ts` code from the execution prompt
2. **Create error handler:** Copy `src/lib/errors/handler.ts` code
3. **Create error boundary:** Copy error boundary component
4. **Update API routes:** Use error handling patterns in all endpoints
5. **Test logging:** Upload a product and check `logs/info-*.log` for entries

---

_Last updated: November 9, 2025_
_For Phase 3 Implementation_
