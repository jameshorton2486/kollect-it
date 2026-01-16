# Operations Guide

This directory contains operational procedures for running, maintaining, and monitoring Kollect-It.

## 📋 Quick Links

- [Database Management](#database-management)
- [Environment Setup](#environment-setup)
- [Monitoring & Logging](#monitoring--logging)
- [Incident Response](#incident-response)
- [Credential Rotation](#credential-rotation)

## Database Management

### Connection & Credentials

1. Supabase dashboard: https://supabase.com/
2. Connection string in `.env.local` (never commit)
3. Always use Prisma client for queries

### Backup & Recovery

```bash
# View database
bun x prisma studio

# Create migration (after schema change)
bun x prisma migrate dev --name <change_name>

# Deploy migration to staging/production
bun x prisma migrate deploy
```

See database documentation in Prisma schema (`prisma/schema.prisma`).

## Environment Setup

### Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in local database credentials (Supabase)
3. Fill in third-party API keys (if using integrations)
4. Never commit `.env.local`

### Staging/Production

- Use Vercel environment variables UI
- Never hardcode secrets in code
- Rotate credentials every 90 days
- Use managed secrets where possible

## Monitoring & Logging

### Application Logs

```bash
# View Vercel deployment logs
vercel logs --follow

# Local development
bun run dev
```

### Database Monitoring

- Use Prisma Studio: `bun x prisma studio`
- Check Supabase dashboard for slow queries
- Monitor connection pool usage

## Incident Response

See [PROJECT_SAFETY.md](PROJECT_SAFETY.md) for security incident procedures.

### Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to database" | Check `.env.local`, verify Supabase status |
| "Prisma migration failed" | Check constraints, run `prisma migrate resolve` |
| "API rate limits" | Check third-party API quotas |

## Credential Rotation

Perform every 90 days:

1. Generate new API keys in respective services
2. Update `.env` variables
3. Redeploy to Vercel
4. Revoke old keys

---

**Last Updated:** January 2026
**Maintained by:** Kollect-It DevOps Team
