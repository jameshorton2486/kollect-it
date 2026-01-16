# ADR-0008: Condition Grading Standards

**Status:** Accepted  
**Date:** December 2024  
**Deciders:** Development Team

## Context

Condition descriptions directly affect buyer trust and dispute rates.

Free-form condition strings create ambiguity and inconsistency.

## Decision

Kollect-It enforces:
- Enum-based condition grading
- Validation at listing creation and update
- Human-readable descriptions mapped to canonical values

No silent coercion is permitted.

## Consequences

### Positive
- Clear buyer expectations
- Reduced disputes
- Consistent listing quality
- Enforceable validation

### Negative
- ⚠️ Requires migration for existing free-form conditions
- ⚠️ UI must map enum values to labels
- ⚠️ New conditions require code changes

## Implementation

- Condition stored as enum value in database
- Condition enum in `/lib/domain/condition.ts` (Phase 2)
- Validation rejects invalid condition values
- UI components display human-readable labels

## Condition Enum

```typescript
enum Condition {
  FINE = "FINE",
  VERY_GOOD = "VERY_GOOD",
  GOOD = "GOOD",
  FAIR = "FAIR"
}
```

## References

- [ADR-0007: Condition Grading](ADR-0007-condition-grading.md) - Original condition decision
- [Condition Grading Documentation](../domain/condition-grading.md)
