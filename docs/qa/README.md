# QA & Testing

This directory documents testing procedures and quality assurance practices.

## 🧪 Test Structure

### Unit Tests

Located in `src/lib/__tests__/` (mirrors lib structure).

```typescript
describe("formatPrice", () => {
  it("should format USD correctly", () => {
    expect(formatPrice(1000)).toBe("$1,000.00");
  });
});
```

### E2E Tests

Located in `e2e/` (Playwright).

```typescript
test("seller can create and publish listing", async ({ page }) => {
  await page.goto("/seller/new-listing");
  await page.fill("#title", "Vintage Watch");
  // ... complete flow
});
```

## 🎯 Critical Test Paths

All of these must have passing tests:

1. **Seller Registration** – Sign up → email verification → profile
2. **Listing Creation** – Upload images → enter details → publish
3. **Buyer Purchase** – Browse → add to cart → checkout
4. **Order Fulfillment** – Seller ships → buyer receives → review
5. **Payment Processing** – Order → payment → escrow → payout

## ✅ QA Procedures

See the main [docs/README.md](../README.md) for links to QA checklists and verification procedures.

---

**Last Updated:** January 2026
**Maintained by:** QA Team
