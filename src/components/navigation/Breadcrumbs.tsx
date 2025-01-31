import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/"
            className="text-shop-600 hover:text-shop-900 flex items-center"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-shop-400 mx-2" />
            {item.path ? (
              <Link
                to={item.path}
                className="text-shop-600 hover:text-shop-900"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-shop-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}