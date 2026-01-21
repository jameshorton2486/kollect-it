# Kollect-It Deployment Automation Scripts

These PowerShell scripts automate many of the "manual" deployment tasks from the V4.1 guide.

## Prerequisites

Before running these scripts, install the required CLIs:

```powershell
# Install Vercel CLI
npm install -g vercel

# Install Stripe CLI
# Download from: https://stripe.com/docs/stripe-cli
# Or with Scoop:
scoop install stripe

# Install Supabase CLI (optional)
npm install -g supabase
```

## Scripts Overview

| Script | Purpose | Automates |
|--------|---------|-----------|
| `01-generate-secrets.ps1` | Generate all required secrets | NEXTAUTH_SECRET, API keys |
| `02-setup-vercel-env.ps1` | Set Vercel environment variables | Section 5 of guide |
| `03-setup-stripe-webhook.ps1` | Create Stripe webhook | Section 7 of guide |
| `04-verify-dns.ps1` | Check DNS propagation | Section 11 of guide |
| `05-test-api-endpoints.ps1` | Test all API endpoints | Section 14 of guide |
| `06-pre-flight-check.ps1` | Verify everything before launch | Pre-launch checklist |
| `07-desktop-app-setup.ps1` | Configure desktop app | Section 12 of guide |
| `08-full-deployment.ps1` | Run complete deployment | All sections |

## Quick Start

```powershell
# 1. Generate secrets first
.\01-generate-secrets.ps1

# 2. Edit the generated .env.secrets file with your API keys from dashboards

# 3. Run the full deployment
.\08-full-deployment.ps1
```

## What Still Requires Manual Work

Even with these scripts, you'll need to manually:
1. Copy API keys from service dashboards (Stripe, ImageKit, Anthropic, Resend)
2. Copy Supabase connection strings
3. Add DNS records in Bluehost (script provides the values)
4. Verify domain in Resend dashboard
5. Complete Stripe account setup (business info, bank account)

## File Structure

```
kollect-it-deployment-scripts/
├── README.md
├── 01-generate-secrets.ps1
├── 02-setup-vercel-env.ps1
├── 03-setup-stripe-webhook.ps1
├── 04-verify-dns.ps1
├── 05-test-api-endpoints.ps1
├── 06-pre-flight-check.ps1
├── 07-desktop-app-setup.ps1
├── 08-full-deployment.ps1
├── config/
│   └── env.template.ps1
└── lib/
    └── common-functions.ps1
```
