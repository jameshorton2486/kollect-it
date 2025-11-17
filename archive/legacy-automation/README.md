# Legacy Automation Scripts

These PowerShell scripts were used during initial development and color refactoring phases.

**Status:** Archived - No longer maintained  
**Date Archived:** 2025-11-17  
**Reason:** Replaced with modern deployment automation and AI agent-driven fixes

## Legacy Scripts

The following scripts are kept for historical reference only:

- `00-MASTER-DEPLOYMENT-PREP.ps1` - Original deployment preparation
- `01-SCAN-TSX-FILES.ps1` - TSX file scanner
- `02-EXTRACT-TSX-CONTENTS.ps1` - Content extractor
- `03-ANALYZE-COLOR-COMPLIANCE.ps1` - Color system analyzer
- Additional automation scripts for development and deployment

## Current Automation

For current development and deployment, use:

### Development
```bash
bun run dev              # Start dev server
bun run build            # Build for production
bun run lint             # Check code quality
bun run typecheck        # TypeScript validation
```

### Database
```bash
bunx prisma generate    # Generate Prisma client
bunx prisma migrate dev # Create/run migrations
bunx prisma studio     # Open data studio
```

### Deployment
```bash
bun run build            # Build
bun run check            # Full verification
vercel --prod            # Deploy to production
```

## References

- **Main Docs**: See `docs/` directory
- **Deployment Guide**: `docs/DEPLOYMENT.md`
- **Setup Instructions**: `README.md` → Quick Start section
- **Environment Variables**: `.env.example`
- **Current Automation**: `package.json` → scripts section
