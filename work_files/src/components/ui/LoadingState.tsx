type LoadingVariant = "spinner" | "skeleton-cards" | "skeleton-table" | "skeleton-list";

interface LoadingStateProps {
  /** Type of loading indicator to show */
  variant?: LoadingVariant;
  /** Number of skeleton items to show (for skeleton variants) */
  count?: number;
  /** Optional loading text */
  text?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * LoadingState - A reusable component for displaying loading states
 * 
 * Variants:
 * - spinner: Centered spinning loader (default)
 * - skeleton-cards: Grid of skeleton card placeholders
 * - skeleton-table: Table row placeholders
 * - skeleton-list: List item placeholders
 * 
 * @example
 * <LoadingState variant="spinner" text="Loading products..." />
 * <LoadingState variant="skeleton-cards" count={6} />
 */
export function LoadingState({
  variant = "spinner",
  count = 3,
  text,
  className = "",
}: LoadingStateProps) {
  // Spinner variant
  if (variant === "spinner") {
    return (
      <div
        className={`flex flex-col items-center justify-center py-16 md:py-20 gap-4 ${className}`}
        role="status"
        aria-label="Loading"
      >
        <div className="w-10 h-10 border-4 border-lux-gold/30 border-t-lux-gold rounded-full animate-spin" />
        {text && <p className="text-lux-gray-dark">{text}</p>}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Skeleton cards variant
  if (variant === "skeleton-cards") {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
        role="status"
        aria-label="Loading content"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-lux-white rounded-xl border border-lux-silver-soft p-4 animate-pulse"
          >
            {/* Image placeholder */}
            <div className="aspect-square bg-lux-cream rounded-lg mb-4" />
            {/* Title placeholder */}
            <div className="h-4 bg-lux-cream rounded w-3/4 mb-2" />
            {/* Subtitle placeholder */}
            <div className="h-3 bg-lux-cream rounded w-1/2 mb-4" />
            {/* Price placeholder */}
            <div className="h-5 bg-lux-cream rounded w-1/4" />
          </div>
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Skeleton table variant
  if (variant === "skeleton-table") {
    return (
      <div
        className={`bg-lux-white rounded-xl border border-lux-silver-soft overflow-hidden ${className}`}
        role="status"
        aria-label="Loading table"
      >
        {/* Header */}
        <div className="bg-lux-cream px-4 py-3 border-b border-lux-silver-soft">
          <div className="h-4 bg-lux-pearl rounded w-full animate-pulse" />
        </div>
        {/* Rows */}
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="px-4 py-4 border-b border-lux-silver-soft last:border-b-0 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-lux-cream rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-lux-cream rounded w-3/4" />
                <div className="h-3 bg-lux-cream rounded w-1/2" />
              </div>
              <div className="h-4 bg-lux-cream rounded w-20" />
            </div>
          </div>
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Skeleton list variant
  if (variant === "skeleton-list") {
    return (
      <div
        className={`space-y-4 ${className}`}
        role="status"
        aria-label="Loading list"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-lux-white rounded-xl border border-lux-silver-soft p-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-lux-cream rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-lux-cream rounded w-1/2" />
                <div className="h-3 bg-lux-cream rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return null;
}

export default LoadingState;
