# ADR-0001: Repository Structure and Documentation Placement

**Status:** Accepted  
**Date:** December 2024  
**Deciders:** Development Team

## Context

Kollect-It needs a clean, scalable repository structure that prevents documentation sprawl and maintains long-term maintainability. Without clear rules, documentation and temporary files accumulate in the root directory, making the codebase harder to navigate and maintain.

## Decision

We will enforce a strict repository structure:

1. **Root README.md** must remain minimal (project name, description, link to `/docs`)
2. **All documentation** must live under `/docs` in organized subfolders
3. **No root-level markdown files** except the minimal README.md
4. **Pre-commit hook** will enforce these rules automatically
5. **Cursor rules** will guide AI to follow these patterns

## Consequences

### Positive
- ✅ Centralized, discoverable documentation
- ✅ Clean root directory
- ✅ Predictable file locations
- ✅ AI tools follow consistent patterns
- ✅ Easier onboarding for new developers

### Negative
- ⚠️ Requires discipline to maintain
- ⚠️ Pre-commit hook may block legitimate commits (but can be bypassed with `--no-verify` if needed)

## Implementation

- Created `.cursor/rules/kollect-it-repo-governance.mdc`
- Updated `.husky/pre-commit` to block root-level markdown
- Updated `.gitignore` to block scratch files
- Created `docs/REPOSITORY_GOVERNANCE.md`
- Created `docs/REPOSITORY_CLEANUP_CHECKLIST.md`

## References

- [Repository Governance](REPOSITORY_GOVERNANCE.md)
- [Cleanup Checklist](REPOSITORY_CLEANUP_CHECKLIST.md)
