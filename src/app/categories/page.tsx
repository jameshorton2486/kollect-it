import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Categories | Kollect-It",
  description:
    "Browse four focused categories—fine art, rare books, militaria, and distinctive collectibles curated by Kollect-It.",
};

const categories = [
  {
    name: "Fine Art",
    slug: "fine-art",
    description:
      "Paintings, prints, and works on paper chosen for subject, quality, or mood rather than headline names alone.",
    image: "/images/categories/fine-art.png",
    imageAlt: "Abstract painting and brushes representing fine art.",
  },
  {
    name: "Rare Books & Manuscripts",
    slug: "rare-books",
    description:
      "Volumes, documents, and ephemera that carry history on every page, handpicked for readers and researchers.",
    image: "/images/categories/rare-books.png",
    imageAlt: "Stack of worn books and manuscript pages.",
  },
  {
    name: "Historic Militaria",
    slug: "militaria",
    description:
      "Objects with real service history—uniform pieces, field gear, documents, and photographs with honest provenance.",
    image: "/images/categories/militaria.png",
    imageAlt: "Vintage militaria items including helmet and field gear.",
  },
  {
    name: "Collectibles & Design",
    slug: "collectibles",
    description:
      "Unusual objects, early technology, and design-forward finds that are too interesting to leave behind.",
    image: "/images/categories/collectibles.png",
    imageAlt: "Assorted vintage design collectibles on display.",
  },
];

export default function CategoriesPage() {
  return (
    <main className="bg-surface-50 text-ink-900">
      <header className="border-b border-surface-200 bg-surface-100">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
            Browse
          </p>
          <h1 className="mt-4 text-3xl font-light leading-tight text-ink-900 sm:text-4xl lg:text-5xl">
            Explore the Collection by Category
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
            I keep inventory focused so you can browse by interest. Each category is curated one piece at a time and updates as new finds come in.
          </p>
        </div>
      </header>

      <section className="border-b border-surface-200 bg-surface-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group block h-full"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                  <div className="relative aspect-[4/3] w-full bg-surface-200">
                    <Image
                      src={category.image}
                      alt={category.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 560px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div>
                      <h2 className="text-2xl font-serif font-semibold text-ink-900">
                        {category.name}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-ink-700">
                        {category.description}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gold-600 transition-colors group-hover:text-gold-700 group-hover:underline">
                      View category
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
