import Image from "next/image";

export default function RareBooksCategoryPage() {
  return (
    <main className="bg-surface-50 text-ink-900">
      <section className="border-b border-surface-200 bg-surface-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 lg:flex-row lg:items-center lg:py-20">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
              Category
            </p>
            <h1 className="mt-3 text-3xl font-light leading-tight text-ink-900 sm:text-4xl lg:text-5xl">
              Rare Books &amp; Manuscripts
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
              Volumes and documents that carry history on every page.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-700">
              From early printings and illustrated editions to unusual reference works, this section is for books and paper that reward careful reading and research.
            </p>
          </div>

          <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-surface-200 bg-surface-200 shadow-md sm:h-64 lg:h-72 lg:w-80">
            <Image
              src="/images/categories/rare-books.png"
              alt="Rare Books"
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
              Available Rare Books &amp; Manuscripts
            </h2>
            <p className="mt-2 text-sm text-ink-700">
              This section will show rare books and paper as your catalog grows.
            </p>
          </header>

          <div className="rounded-2xl border border-dashed border-surface-300 bg-surface-100 px-6 py-10 text-sm text-ink-700">
            <p className="font-semibold text-ink-900">Product grid placeholder</p>
            <p className="mt-2">
              Later, you can replace this with your rare books product grid.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
