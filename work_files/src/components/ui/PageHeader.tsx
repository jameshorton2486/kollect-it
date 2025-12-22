import Link from "next/link";

interface Breadcrumb {
  label: string;
  href: string;
}

interface PageHeaderProps {
  /** Small label text above the title (e.g., category name) */
  label?: string;
  /** Main page title */
  title: string;
  /** Description/lead text below the title */
  description?: string;
  /** Breadcrumb navigation items */
  breadcrumbs?: Breadcrumb[];
  /** Maximum width of the content container */
  maxWidth?: "4xl" | "5xl" | "6xl";
  /** Additional CSS classes */
  className?: string;
}

/**
 * PageHeader - A standardized header component for all pages
 *
 * Provides consistent styling for page titles, descriptions, and breadcrumbs.
 *
 * @example
 * <PageHeader
 *   label="Fine Art"
 *   title="Oil Paintings"
 *   description="A curated collection of original oil paintings."
 *   breadcrumbs={[
 *     { label: "Home", href: "/" },
 *     { label: "Browse", href: "/browse" },
 *     { label: "Fine Art", href: "/category/fine-art" },
 *   ]}
 * />
 */
export function PageHeader({
  label,
  title,
  description,
  breadcrumbs,
  maxWidth = "4xl",
  className = "",
}: PageHeaderProps) {
  const maxWidthClass = {
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
  }[maxWidth];

  return (
    <section
      className={`bg-lux-cream section-normal border-b border-lux-silver-soft ${className}`}
    >
      <div className={`container mx-auto ${maxWidthClass} px-4`}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            className="flex items-center gap-2 text-sm text-ink-600 mb-6"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-lux-gray-dark" aria-hidden="true">
                    /
                  </span>
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-lux-black font-medium" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-lux-gold transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Label */}
        {label && <p className="text-label text-lux-gold mb-2">{label}</p>}

        {/* Title */}
        <h1 className="heading-page text-lux-black">{title}</h1>

        {/* Description */}
        {description && (
          <p className="lead mt-4 max-w-2xl">{description}</p>
        )}
      </div>
    </section>
  );
}

export default PageHeader;
