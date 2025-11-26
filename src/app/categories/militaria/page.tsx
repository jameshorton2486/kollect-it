import Image from "next/image";
import Link from "next/link";

export default function MilitariaCategoryPage() {
  return (
    <main className="bg-surface-50 text-ink-900">
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
              Historic Militaria
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
              Objects that reflect real service, history, and human stories.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-700">
              Helmets, uniforms, documents, photos, and related items. I look for honest pieces with period character and as much background as can reasonably be confirmed.
            </p>
          </div>

          <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-surface-200 bg-surface-200 shadow-md sm:h-64 lg:h-72 lg:w-80">
            <Image
              src="/images/categories/militaria.png"
              alt="Militaria"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 320px"
              priority
            />
          </div>
        </div>
      </section>

      <section className="border-b border-surface-200 bg-surface-50">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
          <header className="mb-8">
            <h2 className="text-2xl font-light text-ink-900 sm:text-3xl">
              Available Militaria
            </h2>
            <p className="mt-2 text-sm text-ink-700">
              This section will show militaria pieces as your catalog grows.
            </p>
          </header>

          <div className="rounded-2xl border border-dashed border-surface-300 bg-surface-100 px-6 py-10 text-sm text-ink-700">
            <p className="font-semibold text-ink-900">No listings yet</p>
            <p className="mt-2">
              Inventory in this category is still small. I add new militaria as I verify provenance—check back soon or contact me if you&apos;re after something specific.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
