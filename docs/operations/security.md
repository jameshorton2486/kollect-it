# Security Documentation

**Status:** Active  
**Last Updated:** December 2024

## Overview

Kollect-It security practices for credential handling, access control, and incident response.

## Credential Management

### Environment Variables

All secrets stored in environment variables:

**Local Development:**
- Use `.env.local` (gitignored)
- Copy from `.env.example` as template
- Never commit `.env.local` to version control

**Production:**
- Configure in Vercel Dashboard → Settings → Environment Variables
- Separate values for Production, Preview, and Development
- Rotate credentials quarterly or after exposure

### Required Credentials

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Authentication secret
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `IMAGEKIT_PRIVATE_KEY` - ImageKit private key
- `PRODUCT_INGEST_API_KEY` - Desktop app API key
- SMTP credentials (if using email)

### Credential Rotation

**Quarterly Rotation:**
1. Generate new credentials
2. Update in Vercel (production)
3. Update in `.env.local` (local)
4. Test application functionality
5. Invalidate old credentials
6. Notify team of rotation

**Emergency Rotation:**
- If credentials are exposed, rotate immediately
- Follow emergency procedures in [ADR-0004](../decisions/ADR-0004-credential-handling.md)

## Access Control

### Production Access

- Only authorized team members have Vercel access
- Database access restricted to necessary personnel
- API keys shared only through secure channels
- No credentials in chat, email, or documentation

### Development Access

- Local development uses test credentials
- Test Stripe keys for payment testing
- Test database for development
- Production credentials never used locally

## Git History Protection

### Prevention

- `.gitignore` blocks all `.env*` files
- Pre-commit hook warns about potential leaks
- Code review checks for hardcoded secrets

### Emergency Cleanup

If credentials are committed:

1. **Rotate immediately** - All exposed credentials
2. **Clean history** - Run `scripts/maintenance/EMERGENCY-REMOVE-CREDENTIALS-FROM-HISTORY.ps1`
3. **Force push** - Coordinate with team before force pushing
4. **Document** - Record incident and response

## Security Best Practices

### Code

- ✅ Never hardcode credentials
- ✅ Use environment variables
- ✅ Validate input to prevent injection
- ✅ Use parameterized queries (Prisma handles this)
- ✅ Sanitize user input

### Infrastructure

- ✅ HTTPS only in production
- ✅ Secure headers configured
- ✅ Database connections encrypted
- ✅ API rate limiting enabled
- ✅ Regular dependency updates

### Monitoring

- ✅ Monitor for unauthorized access
- ✅ Review access logs regularly
- ✅ Set up alerts for suspicious activity
- ✅ Regular security audits

## Incident Response

### If Credentials Are Exposed

1. **Immediate:**
   - Rotate all exposed credentials
   - Revoke API keys
   - Check access logs

2. **Short-term:**
   - Clean git history (if committed)
   - Document incident
   - Review security procedures

3. **Long-term:**
   - Update procedures if needed
   - Additional training if required
   - Review access controls

### Reporting

- Document incidents in this file
- Include date, scope, response, and resolution
- Update procedures based on lessons learned

## References

- [ADR-0004: Credential Handling](../decisions/ADR-0004-credential-handling.md)
- [Environment Variables Guide](environments.md)
- Emergency Script: `scripts/maintenance/EMERGENCY-REMOVE-CREDENTIALS-FROM-HISTORY.ps1`
- [Production Safety](../operations/PROJECT_SAFETY.md)
