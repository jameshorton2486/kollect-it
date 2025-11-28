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
    <nav className="flex flex-wrap items-center text-xs font-semibold uppercase tracking-[0.3em] text-ink-400">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="mx-3 h-3 w-3 text-ink-400/70" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-ink-900"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
