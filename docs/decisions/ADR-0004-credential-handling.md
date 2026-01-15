# ADR-0004: Credential & Secret Handling

**Status:** Accepted  
**Date:** December 2024  
**Deciders:** Development Team

## Context

Kollect-It handles sensitive credentials including:
- Database connection strings
- API keys (Stripe, ImageKit, etc.)
- Authentication secrets (NextAuth)
- SMTP credentials
- Third-party service keys

Without proper handling, credentials can be:
- Accidentally committed to version control
- Exposed in logs or error messages
- Hardcoded in application code
- Shared insecurely between team members

## Decision

We will enforce strict credential handling practices:

1. **Environment Variables Only**
   - All secrets stored in environment variables
   - Never hardcoded in source code
   - `.env.local` for local development (gitignored)
   - Vercel environment variables for production

2. **Git History Protection**
   - `.gitignore` blocks all `.env*` files
   - Pre-commit hook warns about potential credential leaks
   - Emergency script available for credential removal from history

3. **Documentation**
   - `.env.example` provides template without real values
   - Security documentation in `docs/operations/security.md`
   - Clear instructions for credential rotation

4. **Rotation Policy**
   - Credentials rotated quarterly or after any exposure
   - Old credentials invalidated before new ones activated
   - Team notified of rotations

5. **Access Control**
   - Production credentials accessible only to authorized team members
   - CI/CD secrets stored in platform (Vercel), not in code
   - No credentials in chat logs or documentation

## Implementation

### Files Created
- `docs/operations/security.md` - Security documentation
- `scripts/maintenance/EMERGENCY-REMOVE-CREDENTIALS-FROM-HISTORY.ps1` - Emergency cleanup
- `.env.example` - Template (no real values)

### Pre-Commit Checks
- Warns about potential credential patterns in staged files
- Blocks `.env` files from being committed

### CI/CD
- Environment variables configured in Vercel dashboard
- No secrets in GitHub Actions or CI configs

## Consequences

### Positive
- ✅ Credentials never exposed in version control
- ✅ Clear process for credential management
- ✅ Emergency response plan in place
- ✅ Team awareness of security practices

### Negative
- ⚠️ Requires discipline to maintain
- ⚠️ Additional setup step for new developers
- ⚠️ Credential rotation requires coordination

## Alternatives Considered

1. **Secret Management Service (Vault, AWS Secrets Manager)**
   - More complex setup
   - Additional cost
   - Overkill for current scale

2. **Encrypted Credential Files**
   - Still risk of committing encrypted files
   - Key management complexity
   - Not adopted

## Emergency Procedures

If credentials are accidentally committed:

1. **Immediate Actions:**
   - Rotate all exposed credentials immediately
   - Run `scripts/maintenance/EMERGENCY-REMOVE-CREDENTIALS-FROM-HISTORY.ps1`
   - Force push cleaned history (coordinate with team)

2. **Post-Incident:**
   - Document incident in `docs/operations/security.md`
   - Review access logs for unauthorized use
   - Update procedures if needed

## References

- [Security Documentation](../operations/security.md)
- [Environment Variables Guide](../operations/environments.md)
- Emergency Script: `scripts/maintenance/EMERGENCY-REMOVE-CREDENTIALS-FROM-HISTORY.ps1`
