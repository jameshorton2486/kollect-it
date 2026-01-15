# Domain Logic Module

**Purpose:** Centralized domain rules and business logic for Kollect-It marketplace.

## Structure

This module will contain (after Phase 2 refactoring):

- `sku.ts` - SKU generation, validation, and authority
- `categories.ts` - Category normalization and validation
- `condition.ts` - Condition grading logic
- `provenance.ts` - Provenance validation

## Rules

- ✅ Pure domain logic only
- ✅ No UI dependencies
- ✅ No infrastructure dependencies (except Prisma types)
- ✅ Testable in isolation
- ❌ No API routes
- ❌ No React components
- ❌ No external service calls

## Status

**Current:** Folder structure created  
**Phase 2:** Will be populated during refactoring
