# ADR-0007: Category Taxonomy Authority

**Status:** Accepted  
**Date:** December 2024  
**Deciders:** Development Team

## Context

Categories affect SEO, navigation, analytics, and buyer trust.
Inconsistent categorization leads to drift and fragmentation.

## Decision

Kollect-It enforces:
- A canonical category registry
- Normalization at write-time
- No free-form categories
- Categories are immutable identifiers

UI may display labels, but persistence uses canonical IDs.

## Consequences

### Positive
- Stable SEO structure
- Clean analytics
- Reduced category sprawl
- Consistent navigation

### Negative
- ⚠️ Requires migration for existing free-form categories
- ⚠️ UI must map IDs to labels
- ⚠️ New categories require code changes

## Implementation

- Categories stored as canonical IDs in database
- Category registry in `/lib/domain/categories.ts` (Phase 2)
- UI components receive category objects with ID and label
- No free-form category strings in persistence layer

## References

- [ADR-0006: Category Taxonomy](ADR-0006-category-taxonomy.md) - Original taxonomy decision
- [Category Taxonomy Documentation](../domain/categories.md)
