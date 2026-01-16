# Scripts Directory

This directory contains automation, maintenance, and utility scripts for Kollect-It.

## Structure

```
scripts/
├── README.md           # This file
├── maintenance/        # One-off fixes, emergency scripts
├── migrations/         # Database migrations, data transforms
└── utilities/          # Reusable utility scripts
```

## Script Categories

### Maintenance (`/maintenance`)

One-off scripts for fixes, cleanup, and emergency operations.

**⚠️ Warning:** These scripts may be single-use. Review before running.

- `EMERGENCY-REMOVE-CREDENTIALS-FROM-HISTORY.ps1` - Emergency credential removal from git history
- `Fix-Footer-Colors.ps1` - One-off footer color fix
- `Fix-ProductCard-Colors.ps1` - One-off product card color fix
- `commit-and-push.ps1` - Git commit and push helper

### Migrations (`/migrations`)

Database migrations, schema updates, and data transformation scripts.

### Utilities (`/utilities`)

Reusable utility scripts for common tasks.

## Usage Guidelines

1. **Review before running** - Always read scripts before executing
2. **Test in dev first** - Never run untested scripts in production
3. **Document purpose** - Each script should have a clear purpose
4. **Version control** - All scripts should be committed and tracked

## Adding New Scripts

1. Place in appropriate subdirectory
2. Add description to this README
3. Include usage instructions in script comments
4. Test thoroughly before committing

## Security

- Never commit credentials in scripts
- Use environment variables for secrets
- Review scripts for security implications
- See [Security Documentation](../../docs/operations/security.md)
