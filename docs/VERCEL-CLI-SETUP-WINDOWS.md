# Vercel CLI setup (Windows / PowerShell)

Use this if `vercel` is not recognized or you see pasted error text in the terminal.

---

## What’s going wrong

1. **Pasting output into PowerShell** – Lines like `CategoryInfo`, `At line:1 char:1`, `vercel : The term 'vercel' is not recognized` are **output**, not commands. Don’t paste them.
2. **Vercel CLI not installed or not on PATH** – So Windows can’t find `vercel`.

---

## Step 0 — Reset terminal

- Close PowerShell completely.
- Open a **new** PowerShell window.
- Only type what’s in the steps below. Don’t paste error text or prompts.

When you see `PS C:\Users\james>` (or similar), you’re ready.

---

## Step 1 — Check Node and npm

Run **one at a time**:

```powershell
node --version
npm --version
```

You should see version numbers. If either fails, fix Node/npm first.

---

## Step 2 — Install Vercel CLI

```powershell
npm install -g vercel
```

Let it finish. Ignore warnings. Don’t paste the output back into the terminal.

---

## Step 3 — Get npm global path

```powershell
npm config get prefix
```

You’ll see something like: `C:\Users\james\AppData\Roaming\npm`
Copy that path (you’ll add it to PATH in the next step).

---

## Step 4 — Add npm global path to PATH (permanent)

1. Press **Windows key** → search **Environment Variables**.
2. Click **Edit the system environment variables**.
3. Click **Environment Variables**.
4. Under **User variables**, select **Path** → **Edit**.
5. **New** → paste the path from Step 3 (e.g. `C:\Users\james\AppData\Roaming\npm`).
6. **OK** → **OK** → **OK**.

---

## Step 5 — Restart PowerShell

Close **all** PowerShell windows and open a new one.

---

## Step 6 — Confirm Vercel CLI

Run **only**:

```powershell
vercel --version
```

Success: you see something like `Vercel CLI 50.x.x`.

---

## Step 7 — Log in

```powershell
vercel login
```

Browser opens → log in → terminal confirms.

---

## Rule to avoid noise

**Only type commands.** Don’t type explanations, prompts, or error text.

If it doesn’t start with something like `npm`, `node`, `vercel`, `git`, or `powershell`, don’t type it in the terminal.

---

## After it works

Once `vercel --version` works, you can use `vercel link`, `vercel pull --environment=production`, and deploy as needed.
