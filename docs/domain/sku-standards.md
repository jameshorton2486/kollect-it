# SKU Standards

**Status:** Active  
**Last Updated:** December 2024

## Format

`CAT-YYYY-NNNN`

- **CAT**: Category code (2-4 letters)
- **YYYY**: Year (4 digits)
- **NNNN**: Sequential number (4 digits, zero-padded)

## Examples

- `FA-2024-0001` - First Fine Art item in 2024
- `RB-2024-0042` - 42nd Rare Book in 2024
- `CL-2024-0123` - 123rd Collectible in 2024

## Rules

1. **Uniqueness**: SKU must be unique across all products
2. **Immutability**: SKU cannot be changed after creation
3. **Generation**: Auto-generated on product creation
4. **Database**: Stored as `sku String @unique` in Prisma

## Category Codes

See [Categories](categories.md) for full list.

## References

- [ADR-0003: SKU Format](../decisions/ADR-0003-sku-format.md)
- Prisma schema: `prisma/schema.prisma`
