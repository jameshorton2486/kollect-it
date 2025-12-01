import { Breadcrumbs } from "@/components/Breadcrumbs";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="bg-surface-50 border-b border-border-200 py-12">
      <div className="container mx-auto px-4">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} />
        )}
        <h1 className="text-4xl md:text-5xl font-serif font-semibold text-ink-900 mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-ink-700 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
