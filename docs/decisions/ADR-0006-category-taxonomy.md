# ADR-0006: Category Taxonomy

**Status:** Accepted  
**Date:** December 2024  
**Deciders:** Development Team

## Context

Kollect-It requires a stable, hierarchical category system for:
- Product organization
- SKU generation (category codes)
- Search and filtering
- SEO structure
- Buyer navigation

The marketplace deals with curated collectibles, antiques, and rare items that require precise categorization.

## Decision

Kollect-It will use a **stable, hierarchical category taxonomy** with the following structure:

### Primary Categories

1. **Fine Art** (`fine-art`) - Code: `FA`
   - Paintings, prints, sculptures, mixed media

2. **Rare Books** (`rare-books`) - Code: `RB`
   - First editions, signed copies, limited editions, antiquarian books

3. **Collectibles** (`collectibles`) - Code: `CL`
   - Curated objects, curiosities, memorabilia, vintage items

4. **Militaria** (`militaria`) - Code: `ML`
   - Historical military artifacts, uniforms, medals, documents

### Rules

- **Categories are immutable** once products are assigned
- New categories require approval and migration plan
- Subcategories can be added without breaking changes
- Category codes are used in SKU generation (see ADR-0003)
- Category structure must remain stable for SEO and navigation

## Implementation

- Categories stored in `Category` model (Prisma)
- Category codes mapped in `/lib/domain/categories.ts` (Phase 2)
- Category validation enforced at product creation
- Category changes require data migration plan

## Consequences

### Positive
- ✅ Stable navigation structure
- ✅ Consistent SKU generation
- ✅ SEO-friendly URL structure
- ✅ Clear buyer expectations

### Negative
- ⚠️ Adding new categories requires careful planning
- ⚠️ Category changes may require data migration
- ⚠️ Must maintain backward compatibility

## Alternatives Considered

1. **Flexible category system** - Rejected: Too unstable for SKU generation and SEO
2. **User-defined categories** - Rejected: Lacks curation and consistency
3. **Flat category list** - Rejected: Doesn't support hierarchical navigation

## References

- [Category Taxonomy Documentation](../domain/categories.md)
- [ADR-0003: SKU Format](ADR-0003-sku-format.md)
- [SKU Standards](../domain/sku-standards.md)
