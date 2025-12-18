# Kollect-It AI Safety Rules (STRICT)

## ABSOLUTE BLOCKS
- NEVER modify generated folders:
	- .next
	- .vercel
	- .idea
	- .venv
- NEVER commit build output or local configs
- NEVER import from /archive

## PROTECTED FILES (EXPLICIT CONFIRMATION REQUIRED)
- prisma/schema.prisma
- src/lib/prisma.ts
- src/lib/stripe.ts
- src/app/api/webhooks/stripe/*
- src/app/api/auth/*
- src/middleware.ts
- next.config.*
- package.json (scripts/deps)
- .env*, *.env.local, *.env.production

## STRIPE RULES
- No edits to Stripe logic without test-mode confirmation
- No webhook changes without endpoint + signing secret verification
- No currency, amount, or fee math changes without approval

## PRISMA RULES
- No schema edits without:
	1) Explanation
	2) Migration name
	3) prisma generate confirmation

## ROUTING SAFETY
- No deleting or renaming routes under:
	- /app/admin
	- /app/api
- No changing auth guards without approval

## BUILD SAFETY
- No new env vars unless added to .env.example
- No new dependencies without Bun compatibility
- Prefer deleting dead code over commenting it out

## CLEANUP RULE
If a file exists only for debugging, logs, or experiments -> DELETE IT.
