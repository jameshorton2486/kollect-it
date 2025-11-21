# Creates reusable component files

$componentPath = ".\src\components"
$uiPath = "$componentPath\ui"

New-Item -ItemType Directory -Path $componentPath -Force | Out-Null
New-Item -ItemType Directory -Path $uiPath -Force | Out-Null

$emptyState = @'
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <Icon className="w-16 h-16 mx-auto mb-4 text-ink-400" />
      <h3 className="text-xl font-serif font-semibold text-ink-900 mb-2">
        {title}
      </h3>
      <p className="text-ink-600 max-w-md mx-auto mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
'@

Set-Content -Path "$componentPath\EmptyState.tsx" -Value $emptyState
Write-Host "✅ Created EmptyState.tsx" -ForegroundColor Green

$breadcrumbs = @'
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-ink-600 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-gold-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
'@

Set-Content -Path "$componentPath\Breadcrumbs.tsx" -Value $breadcrumbs
Write-Host "✅ Created Breadcrumbs.tsx" -ForegroundColor Green

Write-Host "✨ All components created!" -ForegroundColor Green