# Project Safety & Change Control

This project is under active refactor and hardening.

## Core Safety Rules
- No deletion of files unless explicitly approved
- Legacy code must be moved to /archive, not removed
- AI-generated changes must be incremental
- Each phase must be verified before proceeding

## Change Process
1. Create new files first
2. Add automation scripts
3. Verify behavior
4. Commit only after verification

## Rollback Strategy
- Git is the source of truth
- Phase install scripts never overwrite without backup

