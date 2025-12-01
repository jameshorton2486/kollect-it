"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    slug: "rare-books",
    title: "Rare Manuscripts",
    description:
      "Leather-bound volumes, first editions, and historic texts from the 17th century onward.",
    image: "/images/categories/rare-books.png",
  },
  {
    slug: "militaria",
    title: "Historic Militaria",
    description:
      "Medals, ribbon bars, and service memorabilia with verified provenance and documentation.",
    image: "/images/categories/militaria.png",
  },
  {
    slug: "fine-art",
    title: "Fine Art & Ceramics",
    description:
      "Documented paintings, sculpture, and refined decorative pieces from established artists.",
    image: "/images/categories/fine-art.png",
  },
  {
    slug: "collectibles",
    title: "Collectibles",
    description:
      "Characterful objects, curiosities, and display pieces that add personality to a collection or room.",
    image: "/images/categories/collectibles.png",
  },
];

export default function ShopByCategoriesClient() {
  return (
    <section className="bg-surface-0">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-24">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-semibold tracking-[0.22em] text-ink-500 uppercase">
            Featured Collections
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-light tracking-tight text-ink-900">
            Curated Categories
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-ink-600">
            Explore our diverse collection of authenticated antiques and collectibles.
          </p>
        </div>

        {/* 2 × 2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group flex flex-col gap-4"
            >
              <div className="overflow-hidden rounded-2xl bg-surface-100">
                <Image
                  src={category.image}
                  alt={category.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  priority={category.slug === "rare-books"}
                />
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-ink-900">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm text-ink-600 leading-relaxed">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

