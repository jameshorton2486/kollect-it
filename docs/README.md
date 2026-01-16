# Kollect-It Marketplace Documentation

Welcome to the Kollect-It documentation hub. This directory contains all technical, operational, and strategic documentation for the marketplace.

## 📚 Quick Navigation

### Core Information
- **[Setup & Installation](../README.md)** – Quick start guide for developers
- **[Repository Governance](REPOSITORY_GOVERNANCE.md)** – Repository structure, documentation rules, AI behavior guidelines
- **[Repository Cleanup Checklist](REPOSITORY_CLEANUP_CHECKLIST.md)** – Quarterly maintenance checklist
- **[Contributing Guidelines](CONTRIBUTING.md)** – How to contribute to this project

### Architecture & Design
- **[Architecture Overview](architecture/)** – System design, data models, API routes
- **[Design System](design/)** – UI components, design tokens, brand guidelines
- **[Integrations](integrations/)** – Third-party services (ImageKit, Supabase, NextAuth, etc.)

### Marketplace & Domain
- **[Marketplace Features](marketplace/)** – Seller flows, buyer flows, listings, categories
- **[Marketplace Workflows](marketplace/#-seller-workflows)** – Step-by-step seller and buyer processes
- **[Category Taxonomy](marketplace/#-category-taxonomy)** – Product categories and structure
- **[SKU & Inventory](marketplace/#-sku--inventory)** – SKU format and standards
- **[Condition Standards](marketplace/#-condition-standards)** – Item condition grading

### Operations & Deployment
- **[Operations Guide](operations/)** – Database management, environment setup, monitoring
- **[Security & Credentials](operations/)** – Credential handling, access control, incident response
- **[Production Safety](operations/)** – Security procedures and incident response

### Quality Assurance
- **[QA Procedures](qa/)** – Testing procedures and verification strategies
- **[QA Test Checklist](qa/QA_TEST_CHECKLIST.md)** – Testing procedures and sign-off
- **[QA Verification Plan](qa/QA_VERIFICATION_PLAN.md)** – Testing strategy and scope

### SEO & Performance
- **[SEO Strategy](seo/)** – Schema markup, metadata, content optimization

---

## 🎯 Project Overview

**Kollect-It** is a curated antiques and collectibles marketplace built on:

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Package Manager:** Bun v1.0+
- **Database:** PostgreSQL (Supabase) + Prisma ORM
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **Image Service:** ImageKit
- **Formatting:** Biome

### Key Marketplace Principles

1. **Seller Trust** – Verification, reputation, and accountability
2. **Provenance** – Clear item history and authenticity
3. **Condition Clarity** – Standardized condition descriptors
4. **SEO Excellence** – Every listing ranks in search results
5. **Image Quality** – Professional normalization and CDN delivery
6. **Data Integrity** – Strict category taxonomy and SKU discipline

---

## 🛠️ Technology Stack Details

### Frontend
- React 19 with Next.js 15 Server Components
- Tailwind CSS for styling
- shadcn/ui component library
- Client-side search and filtering

### Backend
- Next.js API Routes (force-dynamic for AI operations)
- Prisma ORM for database abstraction
- Server-side data fetching and validation
- REST API with type safety

### Database
- PostgreSQL hosted on Supabase
- Prisma migrations for schema management
- Seed scripts for initial data
- Comprehensive indexing for performance

### DevOps
- Vercel for deployment
- GitHub Actions for CI/CD
- Environment-based configuration
- E2E testing with Playwright

---

## 📋 Common Tasks

### Local Development
```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Type checking
bun run typecheck

# Formatting
bun run format

# Linting
bun run lint
```

### Database Operations
```bash
# Create migration
bun x prisma migrate dev --name <migration_name>

# View database GUI
bun x prisma studio

# Seed database
bun x prisma db seed
```

### Deployment
See [Deployment & Operations](operations/) for detailed procedures before any production release.

---

## 🤝 Collaboration Standards

- **Branch naming:** `feature/`, `bugfix/`, `cleanup/`, `docs/`
- **Commit messages:** Clear, imperative tone (e.g., "Add seller verification flow")
- **PRs:** Link to issues, include testing evidence
- **Docs:** Update whenever behavior changes
- **No root clutter:** Use organized folder structure

See [Contributing Guidelines](CONTRIBUTING.md) for detailed rules.

---

## 🚨 Critical Rules

### Package Management
- ✅ Use `bun install`, `bun run`, `bun x`
- ❌ Never use `npm`, `yarn`, or `pnpm`

### AI Integration
- ✅ Lazy-load AI clients from `@/lib/ai/client`
- ❌ Never instantiate at module scope
- ✅ Use `export const dynamic = "force-dynamic"` on AI routes

### Database
- ✅ Modify schema in `prisma/schema.prisma` → run migrations
- ✅ Use Prisma in Server Components
- ❌ Never hard-code credentials

### Security
- ✅ Rotate credentials regularly
- ✅ Use `.env.local` (gitignored) for local development
- ✅ Verify all environment variables in CI/CD
- ❌ Never commit `.env` files

---

## 📞 Support & Issues

- **Bugs:** Open a GitHub issue with reproduction steps
- **Features:** Discuss in issues before starting development
- **Security:** Email security team (never commit credentials)
- **Performance:** Check [SEO Performance Guide](seo/performance.md)

---

**Last Updated:** January 2026
**Maintained by:** Kollect-It Development Team
