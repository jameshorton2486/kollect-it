# ADR-0007: Condition Grading Standards

**Status:** Accepted  
**Date:** December 2024  
**Deciders:** Development Team

## Context

Kollect-It deals with collectibles, antiques, and rare items where condition is a critical factor in:
- Pricing accuracy
- Buyer trust
- Seller accountability
- Dispute resolution

Inconsistent condition grading leads to buyer dissatisfaction, disputes, and trust erosion.

## Decision

Kollect-It will enforce a **standardized condition grading system** with the following scale:

### Grading Scale

1. **Fine** - Excellent condition, minimal wear, near-mint
2. **Very Good** - Good condition with minor wear, well-maintained
3. **Good** - Acceptable condition with visible wear, functional
4. **Fair** - Significant wear but functional, may have defects

### Rules

- Condition must be **accurately described** at listing creation
- Photos must **reflect stated condition**
- Condition **affects pricing** and buyer expectations
- Condition **cannot be changed** after sale
- Condition is **mandatory** for all listings
- Sellers must provide **detailed condition notes** for items below "Very Good"

## Implementation

- Condition stored in `Product.condition` field (String)
- Condition displayed prominently on product detail pages
- Condition used in search/filter functionality
- Condition validation enforced at product creation/update
- Condition grading logic centralized in `/lib/domain/condition.ts` (Phase 2)

## Consequences

### Positive
- ✅ Consistent buyer expectations
- ✅ Reduced disputes
- ✅ Accurate pricing
- ✅ Trust and transparency

### Negative
- ⚠️ Requires seller education
- ⚠️ May reduce listings if sellers are cautious
- ⚠️ Enforcement requires moderation

## Alternatives Considered

1. **Free-form condition text** - Rejected: Too inconsistent
2. **Numerical scale (1-10)** - Rejected: Less intuitive for buyers
3. **No condition requirement** - Rejected: Critical for collectibles marketplace

## References

- [Condition Grading Documentation](../domain/condition-grading.md)
- [Product Schema](../../prisma/schema.prisma)
