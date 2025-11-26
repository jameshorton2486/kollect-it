"use client";

import Image from "next/image";
import Link from "next/link";

type Category = {
  slug: string;
  name: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const categories: Category[] = [
  {
    slug: "rare-books",
    name: "Rare Manuscripts",
    description:
      "Leather-bound volumes, first editions, and historic texts from the 17th century onward.",
    imageSrc: "/images/categories/rare-books.png",
    imageAlt: "Stack of antique leather-bound books on a wooden table.",
  },
  {
    slug: "militaria",
    name: "Historic Militaria",
    description:
      "Medals, ribbon bars, uniforms, and service memorabilia with documented history where possible.",
    imageSrc: "/images/categories/militaria.png",
    imageAlt:
      "Vintage military documents, medals, and artifacts laid out on a desk.",
  },
  {
    slug: "fine-art",
    name: "Fine Art & Ceramics",
    description:
      "Paintings, sculpture, and decorative pieces chosen for quality, character, and display appeal.",
    imageSrc: "/images/categories/fine-art.png",
    imageAlt: "Warm interior with framed artwork, sofa, and decorative pieces.",
  },
  {
    slug: "collectibles",
    name: "Collectibles",
    description:
      "Interesting objects, sports items, and unusual finds that make fun additions to a collection.",
    imageSrc: "/images/categories/collectibles.png",
    imageAlt:
      "Table of assorted collectibles including silver, pottery, and ephemera.",
  },
];

export default function FeaturedCollection() {
  return (
    <section className="bg-white py-24 md:py-32 mt-24 md:mt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 text-center md:mb-16">
          <p className="text-xs font-semibold tracking-[0.25em] text-neutral-500">
            FEATURED COLLECTIONS
          </p>
          <h2 className="mt-3 font-serif text-3xl text-neutral-900 md:text-4xl">
            Curated Categories
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-700 md:text-base">
            Explore antiques, art, militaria, books, and collectibles. Each
            category reflects pieces I've personally selected and described.
          </p>
        </div>

        {/* 2x2 grid on desktop */}
        <div className="grid auto-rows-fr grid-cols-1 gap-10 md:grid-cols-2 lg:gap-12">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={category.imageSrc}
                  alt={category.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between px-6 py-5 md:px-7 md:py-6">
                <div>
                  <h3 className="font-serif text-lg text-neutral-900 md:text-xl">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-700 md:text-[0.95rem]">
                    {category.description}
                  </p>
                </div>

                <span className="mt-4 inline-flex items-center text-sm font-medium text-neutral-900">
                  Browse {category.name}
                  <span className="ml-2 text-xs transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
