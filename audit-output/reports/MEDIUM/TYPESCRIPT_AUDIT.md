# TypeScript Audit
Generated: 11/14/2025 10:36:19

## Type Check Results

```src/app/products/[id]/page.tsx(75,25): error TS2322: Type '{ url: string; alt: string | null; }[]' is not assignable to type '{ url: string; alt?: string | undefined; }[]'.
  Type '{ url: string; alt: string | null; }' is not assignable to type '{ url: string; alt?: string | undefined; }'.
    Types of property 'alt' are incompatible.
      Type 'string | null' is not assignable to type 'string | undefined'.
        Type 'null' is not assignable to type 'string | undefined'.
src/app/products/[id]/page.tsx(78,25): error TS2322: Type '{ category: { id: string; name: string; }; images: { url: string; alt: string | null; }[]; } & { id: string; createdAt: Date; updatedAt: Date; slug: string; description: string; title: string; ... 21 more ...; categoryId: string; }' is not assignable to type '{ id: string; title: string; price: number; condition: string; description: string; category: { name: string; }; year?: string | undefined; artist?: string | undefined; rarity?: string | undefined; estimatedEra?: string | undefined; }'.
  Types of property 'condition' are incompatible.
    Type 'string | null' is not assignable to type 'string'.
      Type 'null' is not assignable to type 'string'.
src/app/products/[id]/page.tsx(84,11): error TS2322: Type '({ images: { url: string; }[]; } & { id: string; createdAt: Date; updatedAt: Date; slug: string; description: string; title: string; price: number; featured: boolean; condition: string | null; ... 18 more ...; categoryId: string; })[]' is not assignable to type 'Product[]'.
  Property 'category' is missing in type '{ images: { url: string; }[]; } & { id: string; createdAt: Date; updatedAt: Date; slug: string; description: string; title: string; price: number; featured: boolean; condition: string | null; ... 18 more ...; categoryId: string; }' but required in type 'Product'.
src/app/products/[id]/page.tsx(85,33): error TS2551: Property 'categoryName' does not exist on type '{ category: { id: string; name: string; }; images: { url: string; alt: string | null; }[]; } & { id: string; createdAt: Date; updatedAt: Date; slug: string; description: string; title: string; ... 21 more ...; categoryId: string; }'. Did you mean 'category'?
src/components/admin/DashboardOverview.tsx(230,59): error TS2339: Property 'count' does not exist on type 'PieLabelRenderProps'.
src/components/admin/EmailNotificationManager.tsx(14,3): error TS6133: 'Users' is declared but its value is never read.
src/components/admin/EmailNotificationManager.tsx(70,10): error TS6133: 'selectedTemplate' is declared but its value is never read.
src/components/admin/EmailNotificationManager.tsx(72,10): error TS6133: 'showTemplateEditor' is declared but its value is never read.
src/components/admin/EnhancedSalesAnalytics.tsx(201,29): error TS2339: Property 'status' does not exist on type 'PieLabelRenderProps'.
src/components/admin/EnhancedSalesAnalytics.tsx(201,37): error TS2339: Property 'count' does not exist on type 'PieLabelRenderProps'.
src/components/admin/TrafficAnalyticsDashboard.tsx(289,27): error TS2339: Property 'source' does not exist on type 'PieLabelRenderProps'.
src/components/admin/TrafficAnalyticsDashboard.tsx(289,35): error TS2339: Property 'percentage' does not exist on type 'PieLabelRenderProps'.
src/lib/auth.ts(29,11): error TS2769: No overload matches this call.
  Overload 1 of 2, '(password: string, hash: string): Promise<boolean>', gave the following error.
    Argument of type 'string | null' is not assignable to parameter of type 'string'.
      Type 'null' is not assignable to type 'string'.
  Overload 2 of 2, '(password: string, hash: string, callback?: Callback<boolean> | undefined, progressCallback?: ProgressCallback | undefined): void', gave the following error.
    Argument of type 'string | null' is not assignable to parameter of type 'string'.
      Type 'null' is not assignable to type 'string'.
src/lib/db-optimization.ts(80,11): error TS2353: Object literal may only specify known properties, and 'name' does not exist in type 'ProductSelect<DefaultArgs>'.
```

