import Image from "next/image";
import Link from "next/link";

export default function FineArtCategoryPage() {
  return (
    <main className="bg-surface-50 text-ink-900">
      {/* Hero */}
      <section className="border-b border-surface-200 bg-surface-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 lg:flex-row lg:items-center lg:py-20">
          <div className="md:self-start">
            <Link
              href="/categories"
              className="inline-flex items-center text-sm font-semibold text-gold-600 transition-colors hover:text-gold-700"
            >
              <span aria-hidden="true" className="mr-2">←</span>
              Back to all categories
            </Link>
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
              Category
            </p>
            <h1 className="mt-3 text-3xl font-light leading-tight text-ink-900 sm:text-4xl lg:text-5xl">
              Fine Art
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
              Paintings, prints, and works on paper with character and presence.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-700">
              This category focuses on pieces chosen for subject, quality, or mood rather than big names alone. Many works come from estates, older collections, or regional artists whose work deserves a closer look.
            </p>
          </div>

          <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-surface-200 bg-surface-200 shadow-md sm:h-64 lg:h-72 lg:w-80">
            <Image
              src="/images/categories/fine-art.png"
              alt="Fine Art"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 320px"
              priority
            />
          </div>
        </div>
      </section>

      {/* Products placeholder */}
      <section className="border-b border-surface-200 bg-surface-50">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
          <header className="mb-8">
            <h2 className="text-2xl font-light text-ink-900 sm:text-3xl">
              Available Fine Art
            </h2>
            <p className="mt-2 text-sm text-ink-700">
              This section will show fine art pieces as your catalog grows.
            </p>
          </header>

          <div className="rounded-2xl border border-dashed border-surface-300 bg-surface-100 px-6 py-10 text-sm text-ink-700">
            <p className="font-semibold text-ink-900">No listings yet</p>
            <p className="mt-2">
              Inventory in this category is still small. I add new art as I find pieces worth sharing—check back soon or contact me if you&apos;re looking for something specific.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
