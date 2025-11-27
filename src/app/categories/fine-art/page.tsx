import Link from "next/link";

export default function FineArtCategoryPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Top band – matches /browse structure */}
      <section className="border-b border-lux-silver bg-lux-cream">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 pb-4 pt-8 lg:flex-row lg:items-end lg:justify-between lg:pb-6 lg:pt-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-lux-gold">
              Category
            </p>
            <h1 className="mt-2 font-serif text-2xl tracking-tight text-lux-charcoal lg:text-3xl">
              Fine Art
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-lux-gray">
              Paintings, prints, and works on paper with character and presence.
              Chosen for subject, quality, or mood rather than big names alone.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 text-xs text-lux-gray lg:items-end">
            <Link
              href="/categories"
              className="inline-flex items-center text-sm font-medium text-lux-charcoal hover:text-lux-gold transition-colors"
            >
              <span aria-hidden="true" className="mr-2">←</span>
              All categories
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery grid – matches /browse structure */}
      <section className="mx-auto max-w-6xl px-6 py-6 lg:py-8">
        <div className="rounded-2xl border border-dashed border-lux-silver bg-lux-cream/50 px-6 py-10 text-center">
          <p className="font-semibold text-lux-charcoal mb-2">No listings yet</p>
          <p className="text-sm text-lux-gray max-w-lg mx-auto">
            Inventory in this category is still small. New art is added as pieces worth sharing are found—check back soon or{" "}
            <Link href="/contact" className="text-lux-gold hover:underline">
              contact us
            </Link>
            {" "}if you're looking for something specific.
          </p>
        </div>
      </section>
    </main>
  );
}
