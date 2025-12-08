# NEXTAUTH_URL Configuration Reference

## Quick Reference

### Local Development
```env
NEXTAUTH_URL=http://localhost:3000
```

### Production (Vercel)
```env
NEXTAUTH_URL=https://kollect-it-marketplace-1.vercel.app
```

---

## Important Notes

⚠️ **The NEXTAUTH_URL must match exactly where your application is running** so that NextAuth can properly handle authentication requests.

### For Local Development (.env.local)
- Use: `http://localhost:3000`
- **Note:** Use port **3000**, not 300
- This file is in your project root

### For Production (Vercel)
- Use: `https://kollect-it-marketplace-1.vercel.app`
- Set via: `vercel env add NEXTAUTH_URL production`
- Must be set in Vercel dashboard or via CLI

---

## Setup Instructions

### Local Development

1. Open `.env.local` in your project root
2. Add or update:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-here
   ```
3. Restart your dev server: `npm run dev`

### Production (Vercel)

1. **Add NEXTAUTH_URL:**
   ```powershell
   vercel env add NEXTAUTH_URL production
   ```
   When prompted, enter: `https://kollect-it-marketplace-1.vercel.app`

2. **Verify it was added:**
   ```powershell
   vercel env ls | Select-String "NEXTAUTH"
   ```

3. **Redeploy:**
   ```powershell
   vercel --prod
   ```

---

## Troubleshooting

### "Invalid NEXTAUTH_URL"
- ✅ Check the URL matches exactly (no trailing slash)
- ✅ For localhost: Use `http://localhost:3000` (not `http://localhost:300`)
- ✅ For production: Use the exact Vercel URL

### "NEXTAUTH_URL is not set"
- ✅ Add it to `.env.local` for local development
- ✅ Add it to Vercel environment variables for production
- ✅ Redeploy after adding to Vercel

### Authentication not working in production
- ✅ Verify NEXTAUTH_URL is set in Vercel
- ✅ Check it matches your production URL exactly
- ✅ Redeploy after making changes

---

## Environment Variables Checklist

### Required for Both Environments:

| Variable | Local Value | Production Value |
|----------|-------------|------------------|
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://kollect-it-marketplace-1.vercel.app` |
| `NEXTAUTH_SECRET` | (32+ char secret) | (Same secret) |

### Where to Set:

- **Local:** `.env.local` file in project root
- **Production:** Vercel dashboard or `vercel env add` command

---

**Remember:** The NEXTAUTH_URL must match exactly where your application is running!
