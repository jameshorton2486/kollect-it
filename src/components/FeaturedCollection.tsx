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
    <section className="bg-lux-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 text-center md:mb-16">
          <p className="text-xs font-semibold tracking-[0.25em] text-lux-gold uppercase">
            Featured Collections
          </p>
          <h2 className="mt-3 font-serif text-3xl text-lux-black md:text-4xl">
            Curated Categories
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-lux-gray-dark md:text-base leading-relaxed">
            Explore antiques, art, militaria, books, and collectibles. Each
            category reflects pieces I've personally selected and described.
          </p>
        </div>

        {/* 2x2 grid on desktop */}
        <div className="grid auto-rows-fr grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-lux-silver bg-lux-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-lux-gold"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={category.imageSrc}
                  alt={category.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-lux-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="flex flex-1 flex-col justify-between px-6 py-5 md:px-7 md:py-6">
                <div>
                  <h3 className="font-serif text-lg text-lux-black md:text-xl group-hover:text-lux-gold transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm text-lux-gray-dark md:text-[0.95rem] leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <span className="mt-4 inline-flex items-center text-sm font-medium text-lux-black group-hover:text-lux-gold transition-colors">
                  Browse {category.name}
                  <span className="ml-2 text-xs transition-transform duration-300 group-hover:translate-x-1">
                    →
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
