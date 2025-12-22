# Copilot Instructions for Kollect-It Marketplace

## 🛠️ Tech Stack & Environment
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Package Manager**: **Bun** (v1.0+) - ⚠️ **NEVER use npm/yarn/pnpm**
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js
- **Images**: ImageKit
- **Formatting**: Biome (`bun run format`)

## 🚨 Critical Rules

### 1. Package Management
- **ALWAYS** use `bun install`, `bun run`, `bun x`.
- **NEVER** suggest `npm install` or `npx`.

### 2. AI & API Route Safety
- **NEVER** instantiate AI SDKs (OpenAI, Anthropic) at module scope.
- **ALWAYS** use lazy-loaded clients from `@/lib/ai/client`:
  ```typescript
  import { getOpenAIClient } from "@/lib/ai/client";

  export async function POST() {
    const openai = await getOpenAIClient(); // Safe lazy load
    // ...
  }
  ```
- **ALWAYS** add `export const dynamic = "force-dynamic";` to AI-related API routes.
- **NEVER** access `process.env.OPENAI_API_KEY` outside of request handlers.

### 3. Database Operations
- Use `bun x prisma` for all DB CLI commands.
- **Schema Changes**: Modify `prisma/schema.prisma` -> `bun x prisma migrate dev`.
- **Seeding**: `bun x prisma db seed`.

## 🏗️ Architecture & Patterns

### Directory Structure
- `src/app`: Next.js App Router pages and API routes.
- `src/components`: React components (shadcn/ui patterns).
- `src/lib`: Shared utilities (AI clients, DB helpers).
- `scripts/`: Automation scripts (use `bun run scripts/<script-name>`).
- `prisma/`: Database schema and migrations.

### Data Fetching
- Prefer **Server Components** for data fetching where possible.
- Use Prisma directly in Server Components/Server Actions.
- Use API routes (`src/app/api`) for client-side fetching or external webhooks.

### Image Handling
- Use ImageKit for all image uploads/serving.
- Refer to `scripts/sync-drive-to-imagekit.ts` for sync logic.

## 🧪 Testing & Quality
- **E2E**: Playwright (`bun run test:e2e`).
- **Linting**: `bun run lint`.
- **Formatting**: `bun run format` (Biome).
- **Typecheck**: `bun run typecheck`.

## ⚡ Common Commands
- **Dev Server**: `bun run dev`
- **Build**: `bun run build`
- **DB Studio**: `bun x prisma studio`
- **Health Check**: `bun run health-check`
