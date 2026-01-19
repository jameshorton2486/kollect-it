# 🤖 AUTOMATED BATCH REFACTOR - EXACT CHANGES

## This document shows the exact code changes that will be applied

---

## 📁 FILE 1: src/lib/email/reportSender.ts

### Change 1: Fix gradient (Line 33)
```diff
-    .header { background: linear-gradient(135deg, #D4AF37 0%, #B1874C 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
+    .header { background: linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
```

### Change 2: Fix content background (Line 34)
```diff
-    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
+    .content { background: var(--surface-50); padding: 20px; border-radius: 0 0 8px 8px; }
```

### Change 3: Fix data preview background (Line 37)
```diff
-    .data-preview { background: #f0f0f0; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 200px; overflow: auto; }
+    .data-preview { background: var(--surface-50); padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 200px; overflow: auto; }
```

### Change 4: Fix button color (Line 40)
```diff
-    .button { display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin: 10px 0; }
+    .button { display: inline-block; background: var(--gold-500); color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin: 10px 0; }
```

---

## 📁 FILE 2: src/components/Header.tsx

### Change 1: Fix scrolled header background (Line 49)
```diff
-          ? "bg-[#0D0D0D]/95 backdrop-blur-md shadow-lg"
+          ? "bg-lux-black/95 backdrop-blur-md shadow-lg"
```

### Change 2: Fix default header background (Line 50)
```diff
-          : "bg-[#0D0D0D]"
+          : "bg-lux-black"
```

### Change 3: Fix mobile menu background (Line 189)
```diff
-            className="md:hidden absolute left-0 right-0 top-full bg-[#0D0D0D] border-b border-white/10 shadow-2xl"
+            className="md:hidden absolute left-0 right-0 top-full bg-lux-black border-b border-white/10 shadow-2xl"
```

---

## 📁 FILE 3: src/app/payment/page.tsx

### Change 1-3: Convert inline styles to Tailwind classes (Lines 54-56)

**BEFORE:**
```tsx
        <div style={{ backgroundColor: "#3A3A3A", color: "#FFFFFF", padding: "40px", borderRadius: "8px", textAlign: "center" }}>
          <ShieldCheck size={48} color="#C9A66B" style={{ margin: "0 auto 20px" }} />
          <h2 style={{ fontFamily: "serif", fontSize: "2rem", marginBottom: "20px", color: "#C9A66B" }}>Security Guarantee</h2>
```

**AFTER:**
```tsx
        <div className="bg-surface-800 text-lux-white p-10 rounded-lg text-center">
          <ShieldCheck size={48} color="var(--gold-500)" className="mx-auto mb-5" />
          <h2 className="font-serif text-3xl mb-5 text-gold-500">Security Guarantee</h2>
```

**Note:** The rest of the paragraph style can remain as is or be converted to Tailwind classes.

---

## 📁 FILE 4: src/components/admin/charts/RevenueByCategory.tsx

### Change 1: Fix color array (Line 28)
```diff
-const COLORS = ["#D4AF37", "#A17D2F", "#CD7F32", "#C0C0C0", "#FFD700"];
+const COLORS = ["var(--gold-500)", "var(--gold-600)", "var(--gold-700)", "var(--lux-silver)", "var(--gold-300)"];
```

### Change 2: Fix fill color (Line 57)
```diff
-            fill="#D4AF37"
+            fill="var(--gold-500)"
```

---

## 📋 SUMMARY OF CHANGES

| File | Lines Changed | Changes |
|------|---------------|---------|
| `src/lib/email/reportSender.ts` | 4 | CSS variables for gradient, backgrounds, button |
| `src/components/Header.tsx` | 3 | Tailwind classes for backgrounds |
| `src/app/payment/page.tsx` | 3 | Inline styles → Tailwind classes + CSS vars |
| `src/components/admin/charts/RevenueByCategory.tsx` | 2 | Color array + fill prop |

**Total:** 4 files, 12 individual changes

---

## ✅ PRE-APPLICATION CHECKLIST

Before applying these changes, verify:
- [ ] All changes are in allowed folders only
- [ ] No email templates will be modified
- [ ] Backup branch is created
- [ ] Changes match the patch list

---

## 🚀 READY TO APPLY

These changes are ready for batch application. All modifications follow the Kollect-It design system requirements.

**END OF AUTOMATED REFACTOR**
