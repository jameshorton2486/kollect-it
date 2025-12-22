import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui";

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
    <main className="bg-lux-pearl">
      {/* Header */}
      <PageHeader
        label="Browse"
        title="All Categories"
        description="Explore our curated collection across all categories."
        maxWidth="6xl"
      />

      {/* Categories Grid */}
      <section className="section-normal">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-luxury">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group block"
              >
                <article className="h-full overflow-hidden rounded-xl border border-lux-silver-soft bg-lux-white shadow-clean transition-all duration-300 hover:shadow-soft hover:-translate-y-1">
                  <div className="relative aspect-[4/3] w-full bg-lux-pearl overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 560px"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-lux-charcoal/0 group-hover:bg-lux-charcoal/10 transition-colors" />
                  </div>
                  <div className="p-6">
                    <h2 className="font-serif text-2xl font-semibold text-lux-black group-hover:text-lux-gold transition-colors">
                      {category.name}
                    </h2>
                    <p className="mt-2 text-ink-600 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-lux-gold font-medium group-hover:gap-3 transition-all">
                      <span>View category</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-lux-charcoal section-normal">
        <div className="container mx-auto text-center">
          <h2 className="heading-section text-lux-gold mb-4">Looking for Something Specific?</h2>
          <p className="text-lux-cream/80 mb-8 max-w-xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Let me know what you&apos;re collecting and I&apos;ll keep an eye out.
          </p>
          <Link href="/contact" className="btn-primary rounded-full">
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
