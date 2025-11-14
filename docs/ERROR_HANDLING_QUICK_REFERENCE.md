# 📋 Error Handling Quick Reference Card

## Log Files Location

```
/logs/
├── error-YYYY-MM-DD.log    ← All errors go here
├── warn-YYYY-MM-DD.log     ← Warnings go here
├── info-YYYY-MM-DD.log     ← Info logs go here
└── debug-YYYY-MM-DD.log    ← Debug (only when DEBUG=true)
```

**Today's date example:** `error-2025-11-09.log`

---

## View Errors (PowerShell)

```powershell
# Last 20 errors
Get-Content logs/error-*.log | Select-Object -Last 20

# Search for specific approval
Select-String "approval_ID" logs/*.log

# Watch errors live
Get-Content logs/error-*.log -Wait -Tail 5

# Count errors by date
Get-ChildItem logs/error-*.log | Measure-Object
```

---

## Common Error Codes

| Code                    | Meaning                  | Fix                    |
| ----------------------- | ------------------------ | ---------------------- |
| `UNAUTHORIZED`          | Not an admin             | Check login            |
| `NOT_FOUND`             | Item doesn't exist       | Check ID               |
| `INVALID_PRICE`         | Price ≤ 0                | Enter valid price      |
| `INVALID_STATE`         | Wrong workflow status    | Check current status   |
| `NO_AI_DATA`            | Product not analyzed yet | Run AI analysis first  |
| `DATABASE_ERROR`        | DB connection failed     | Check database         |
| `INTERNAL_SERVER_ERROR` | Unexpected error         | Check logs for details |

---

## Where to Find Errors

| Where                          | How to Access                        |
| ------------------------------ | ------------------------------------ |
| **Phase 3 approval errors**    | `logs/error-YYYY-MM-DD.log`          |
| **Pricing calculation errors** | `logs/error-YYYY-MM-DD.log`          |
| **Browser console errors**     | Press F12 in browser → Console tab   |
| **Server console errors**      | Terminal running `bun run dev`       |
| **Build errors**               | Terminal output from `bun run build` |

---

## Error Handling Pattern (Copy-Paste)

```typescript
try {
  // Your code here
  await logger.info("ServiceName", "Operation started", {
    requestId,
    context: "value",
  });

  // Do work...

  await logger.info("ServiceName", "Operation succeeded", {
    result: "value",
  });
} catch (error) {
  await logger.error(
    "ServiceName",
    "Operation failed",
    error instanceof Error ? error : new Error(String(error)),
    { requestId, context: "value" },
  );
  throw error;
}
```

---

## Enable Debug Logging

Add to `.env.local`:

```
DEBUG=true
```

Restart server, then check `logs/debug-*.log`

---

## Files to Create for Phase 3

- `src/lib/logging/logger.ts` ← Logging service
- `src/lib/errors/handler.ts` ← Error handler
- `src/components/admin/ApprovalErrorBoundary.tsx` ← Error boundary
- All API routes use error handling from execution prompt

---

## Read Full Guide

See `docs/ERROR_HANDLING_AND_LOGGING_GUIDE.md` for complete documentation.

---

_Phase 3 Implementation | Robust Error Handling_
