# COPY-PASTE THIS INTO YOUR AI CODING ASSISTANT

---

I need you to implement an automated error handling and logging system for my Kollect-It Next.js app.

## Your Task

1. **Read these files first** (located in `deployments/Error handling and logging/`):
   - 00-START-HERE-EXECUTIVE-SUMMARY.md
   - IMPLEMENTATION-GUIDE.md
   - ERROR-LOGGING-SYSTEM-COMPLETE.md

2. **Then implement:**
   - Replace `src/lib/auth.ts` with `deployments/Error handling and logging/auth-enhanced.ts`
   - Copy `deployments/Error handling and logging/generate-error-summary.ts` to `scripts/`
   - Add scripts from `deployments/Error handling and logging/package-json-scripts.json` to `package.json`
   - Create `logs/` directory and update `.gitignore`

3. **Test:**
   - Run `bun run dev`
   - Try logging in
   - Run `bun run error-summary`
   - Verify `error-summary-ai.md` is generated

4. **Report:**
   - Show me what you changed
   - Show me the first error summary
   - Tell me what needs to be fixed (if anything)

## Important
- Create backup of `src/lib/auth.ts` before modifying
- Follow instructions in IMPLEMENTATION-GUIDE.md exactly
- Ask me for clarification if needed

## Success Criteria
✅ Login attempts show detailed logs in terminal
✅ `bun run error-summary` generates `error-summary-ai.md`
✅ TypeScript compiles without errors

Start by reading the documentation files, then proceed with implementation.
