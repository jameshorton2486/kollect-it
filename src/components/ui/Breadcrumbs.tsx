import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  /** Breadcrumb items */
  items: Breadcrumb[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Breadcrumbs - A consistent breadcrumb navigation component
 * 
 * Used for: Category pages, product pages, nested navigation
 * 
 * @example
 * <Breadcrumbs
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Browse", href: "/browse" },
 *     { label: "Fine Art", href: "/category/fine-art" },
 *   ]}
 * />
 */
export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      className={`flex items-center gap-2 text-sm text-lux-gray-dark ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.href} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight
                className="h-4 w-4 text-lux-gray"
                aria-hidden="true"
              />
            )}
            {isLast ? (
              <span className="text-lux-black font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-lux-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;

