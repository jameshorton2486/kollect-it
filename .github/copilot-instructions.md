# Copilot Instructions for Kollect-It Marketplace

## 🎯 Repository Governance (CRITICAL)

**This repository follows professional, production-grade standards.**

See [docs/README.md](../docs/README.md) and [docs/CONTRIBUTING.md](../docs/CONTRIBUTING.md) for complete collaboration rules.

### Core Governance Principles

1. **Repository Structure:** Strict organization—no root-level clutter
2. **Documentation:** All .md files MUST go in /docs/ (never root level)
3. **File Organization:** Use established folder structure (src/, scripts/, etc.)
4. **Marketplace Focus:** Respect Kollect-It's antiques/collectibles positioning
5. **Code Quality:** Type-safe, tested, formatted, linted

---

## 🛠️ Tech Stack & Environment
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Package Manager**: **Bun** (v1.0+) - ⚠️ **NEVER use npm/yarn/pnpm**
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js
- **Images**: ImageKit
- **Formatting**: Biome (\un run format\)

## 🚨 Critical Rules

### 1. Package Management
- **ALWAYS** use \un install\, \un run\, \un x\.
- **NEVER** suggest \
pm install\ or \
px\.

### 2. AI & API Route Safety
- **NEVER** instantiate AI SDKs (OpenAI, Anthropic) at module scope.
- **ALWAYS** use lazy-loaded clients from \@/lib/ai/client\.
- **ALWAYS** add \xport const dynamic = "force-dynamic";\ to AI-related API routes.
- **NEVER** access \process.env.OPENAI_API_KEY\ outside of request handlers.

### 3. Database Operations
- Use \un x prisma\ for all DB CLI commands.
- **Schema Changes**: Modify \prisma/schema.prisma\ → \un x prisma migrate dev\.
- **Seeding**: \un x prisma db seed\.

### 4. Documentation Requirements
- ✅ All markdown files go in \/docs/\ (or subdirectories)
- ❌ Never create \.md\ files in repository root
- ✅ Update \/docs/\ links when adding new documentation
- ❌ Never commit temporary, debug, or scratch files

### 5. Marketplace-Specific Rules
- Every feature must enforce seller trust and identity verification
- Maintain strict category taxonomy (no custom categories)
- Track item provenance and condition changes
- All listings must include Schema.org metadata
- Use consistent SKU format: \CATEGORY-SUBCATEGORY-YEAR-VARIANT\

## 🏗️ Architecture & Patterns

### Directory Structure
- \src/app\: Next.js App Router pages and API routes
- \src/components\: React components (shadcn/ui patterns)
- \src/lib\: Shared utilities (AI clients, DB helpers)
- \src/styles\: Global styles and Tailwind configuration
- \public\: Static assets (images, manifests, robots.txt)
- \scripts\: Automation and maintenance scripts
- \docs\: **ALL documentation (mandatory)**
- \prisma\: Database schema and migrations
- \	ests/e2e\: End-to-end tests (Playwright)

### Data Fetching
- Prefer **Server Components** for data fetching where possible.
- Use Prisma directly in Server Components/Server Actions.
- Use API routes (\src/app/api\) for client-side fetching or external webhooks.

### Image Handling
- Use ImageKit for all image uploads/serving.
- Refer to \docs/marketplace/#-image-pipeline\ for pipeline details.
- Never store images in the repository or raw filesystem.

## 🧪 Testing & Quality
- **E2E**: Playwright (\un run test:e2e\).
- **Linting**: \un run lint\.
- **Formatting**: \un run format\ (Biome).
- **Typecheck**: \un run typecheck\.

## ⚡ Common Commands
- **Dev Server**: \un run dev\
- **Build**: \un run build\
- **DB Studio**: \un x prisma studio\
- **Health Check**: \un run health-check\

---

**Last Updated:** January 2026  
**Enforced by:** Copilot AI + Team Reviews
