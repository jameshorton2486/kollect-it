export default function Loading() {
  return (
    <div className="min-h-screen bg-lux-pearl">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Breadcrumbs skeleton */}
        <div className="mb-8">
          <div className="h-4 w-48 animate-shimmer rounded bg-surface-200" />
        </div>

        {/* Product Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Image Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="aspect-square animate-shimmer rounded-xl bg-surface-200" />
            {/* Thumbnail grid */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-shimmer rounded-lg bg-surface-200"
                />
              ))}
            </div>
          </div>

          {/* Right Column - Product Info Skeleton */}
          <div className="space-y-6">
            {/* Title */}
            <div className="h-10 w-3/4 animate-shimmer rounded bg-surface-200" />
            {/* Price */}
            <div className="h-8 w-32 animate-shimmer rounded bg-surface-200" />
            {/* Description lines */}
            <div className="space-y-2">
              <div className="h-4 w-full animate-shimmer rounded bg-surface-200" />
              <div className="h-4 w-full animate-shimmer rounded bg-surface-200" />
              <div className="h-4 w-2/3 animate-shimmer rounded bg-surface-200" />
            </div>
            {/* Action buttons */}
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-48 animate-shimmer rounded bg-surface-200" />
              <div className="h-12 w-12 animate-shimmer rounded bg-surface-200" />
            </div>
            {/* Metadata */}
            <div className="space-y-3 pt-6 border-t border-surface-300">
              <div className="h-4 w-24 animate-shimmer rounded bg-surface-200" />
              <div className="h-4 w-32 animate-shimmer rounded bg-surface-200" />
            </div>
          </div>
        </div>

        {/* Product Tabs Skeleton */}
        <div className="mx-auto mt-12 max-w-6xl px-4 pb-12 sm:px-6 lg:pb-16">
          <div className="border-b border-surface-300">
            <div className="flex gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-24 animate-shimmer rounded-t bg-surface-200"
                />
              ))}
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="h-4 w-full animate-shimmer rounded bg-surface-200" />
            <div className="h-4 w-full animate-shimmer rounded bg-surface-200" />
            <div className="h-4 w-3/4 animate-shimmer rounded bg-surface-200" />
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="h-8 w-48 mb-6 animate-shimmer rounded bg-surface-200" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square animate-shimmer rounded-xl bg-surface-200" />
                <div className="h-5 w-3/4 animate-shimmer rounded bg-surface-200" />
                <div className="h-4 w-1/2 animate-shimmer rounded bg-surface-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
