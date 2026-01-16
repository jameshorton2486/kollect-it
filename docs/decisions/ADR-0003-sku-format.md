# ADR-0003: SKU Format Standard

**Status:** Accepted  
**Date:** December 2024  
**Deciders:** Development Team

## Context

Kollect-It needs a consistent SKU (Stock Keeping Unit) format for product identification. SKUs must be:
- Unique across all products
- Human-readable
- Parseable for categorization
- Sortable chronologically
- Database-indexable

## Decision

We will use the format: `CAT-YYYY-NNNN`

Where:
- **CAT**: Category code (2-4 letters, e.g., `FA` = Fine Art, `RB` = Rare Books)
- **YYYY**: Year of acquisition/listing (4 digits)
- **NNNN**: Sequential number within that year (4 digits, zero-padded)

**Examples:**
- `FA-2024-0001` - First Fine Art item listed in 2024
- `RB-2024-0042` - 42nd Rare Book item listed in 2024
- `CL-2024-0123` - 123rd Collectible item listed in 2024

## Implementation

- SKU generation in product creation flow
- Database field: `sku String @unique` in Prisma schema
- Parsing logic in `src/lib/sku.ts` (if needed)
- Category codes defined in `docs/domain/categories.md`

## Consequences

### Positive
- ✅ Predictable, sortable format
- ✅ Human-readable
- ✅ Easy to parse programmatically
- ✅ Chronological ordering built-in
- ✅ Category identification at a glance

### Negative
- ⚠️ Requires category code standardization
- ⚠️ Sequential numbering requires database coordination
- ⚠️ Year-based means reset each year (but sequential number continues)

## Alternatives Considered

1. **UUID**: Unique but not human-readable
2. **Timestamp-based**: Unique but harder to read
3. **Random alphanumeric**: Unique but no semantic meaning

## References

- [SKU Standards](../domain/sku-standards.md)
- [Category Taxonomy](../domain/categories.md)
- Prisma schema: `prisma/schema.prisma`
