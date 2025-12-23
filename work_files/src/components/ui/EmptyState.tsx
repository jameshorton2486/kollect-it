import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  /** Lucide icon to display */
  icon: LucideIcon;
  /** Main heading text */
  title: string;
  /** Supporting description text */
  description?: string;
  /** Primary action button */
  primaryAction?: {
    label: string;
    href: string;
  };
  /** Secondary action button (optional) */
  secondaryAction?: {
    label: string;
    href: string;
  };
  /** Additional CSS classes for the wrapper */
  className?: string;
}

/**
 * EmptyState - A reusable component for displaying empty states
 * 
 * Used when: No products, no orders, no wishlist items, no search results, etc.
 * 
 * @example
 * <EmptyState
 *   icon={Package}
 *   title="No Products Found"
 *   description="Try adjusting your filters or browse our full collection."
 *   primaryAction={{ label: "Browse All", href: "/browse" }}
 *   secondaryAction={{ label: "Clear Filters", href: "/browse" }}
 * />
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 md:py-20 px-4 gap-6 ${className}`}
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-lux-cream flex items-center justify-center">
        <Icon className="w-8 h-8 text-lux-gold" aria-hidden="true" />
      </div>

      {/* Title */}
      <h2 className="heading-section text-lux-black">{title}</h2>

      {/* Description */}
      {description && (
        <p className="lead max-w-md text-ink-700">{description}</p>
      )}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full sm:w-auto">
          {primaryAction && (
            <Link
              href={primaryAction.href}
              className="btn-primary rounded-full w-full sm:w-auto text-center"
            >
              {primaryAction.label}
            </Link>
          )}
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="btn-secondary rounded-full w-full sm:w-auto text-center"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
