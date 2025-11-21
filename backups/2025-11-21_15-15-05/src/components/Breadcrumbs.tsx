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
