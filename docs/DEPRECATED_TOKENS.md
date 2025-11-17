# Deprecated Color Tokens & Classes (Kollect-It)

These legacy tokens and classes must not be used going forward.
Use the new semantic equivalents instead.

---

## Legacy CSS Variables (DO NOT USE)

- `--color-accent-gold` → use `--gold-500`
- `--color-text-primary` → use `--ink-900`
- `--color-text-secondary` → use `--ink-700`
- `--color-bg-muted` → use `--surface-1`
- `--color-bg-alt` → use `--surface-2`

If you find any of these in `globals.css` or other stylesheets,
convert them to the semantic HSL token system.

---

## Legacy Tailwind Classes (DO NOT USE)

Replace the following Tailwind classes:

- `text-primary`          → `text-ink`
- `text-secondary`        → `text-ink-secondary`
- `text-muted`            → `text-ink-muted`

- `text-accent-gold`      → `text-gold`
- `bg-accent-gold`        → `bg-gold`
- `border-accent-gold`    → `border-gold`
- `hover:text-accent-gold`→ `hover:text-gold`
- `hover:bg-accent-gold`  → `hover:bg-gold`

- `bg-panel`              → `bg-surface-1`
- `bg-panel-alt`          → `bg-surface-2`

---

## How to Use This Document

1. Search the codebase for any of the **left-hand** values above.
2. Replace them with the corresponding **right-hand** semantic token.
3. Run:

   ```bash
   npm run lint
   npm run build
   ```

If you are using an AI agent, instruct it:

"Scan the repo for anything listed in docs/DEPRECATED_TOKENS.md and refactor to the new tokens."

---

## Quick Check Commands

```powershell
# Find any deprecated tokens in the codebase
Get-ChildItem -Path "src\*" -Recurse -File -Include "*.tsx","*.ts" | 
  Select-String "text-accent-gold|bg-accent-gold|--color-accent-gold"

# Run the cleanup script
pwsh -File .\scripts\clean-color-tokens.ps1
```