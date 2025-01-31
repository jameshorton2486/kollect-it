import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbsProps {
  items: {
    label: string;
    href: string;
  }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 text-shop-400" />
            )}
            <Link
              to={item.href}
              className={`inline-flex items-center text-sm font-medium transition-colors hover:text-shop-900 ${
                index === items.length - 1
                  ? "text-shop-600 cursor-default"
                  : "text-shop-500 hover:text-shop-700"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}