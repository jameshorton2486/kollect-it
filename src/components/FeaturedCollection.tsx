import Image from "next/image";
import Link from "next/link";
import { BookOpen, Medal, Palette } from "lucide-react";

export default function FeaturedCollection() {
  const categories = [
    {
      icon: BookOpen,
      title: "Rare Manuscripts",
      description: "Leather-bound volumes, first editions, and historic texts from the 17th century onward.",
      href: "/category/rare-books",
      image: "/images/categories/rare-books/rare-books-v1.webp"
    },
    {
      icon: Medal,
      title: "Historic Militaria",
      description: "Medals, ribbon bars, and service memorabilia with verified provenance and documentation.",
      href: "/category/militaria",
      image: "/images/categories/militaria/militaria-category-v1.webp"
    },
    {
      icon: Palette,
      title: "Fine Art & Ceramics",
      description: "Documented paintings, sculpture, and refined decorative pieces from established artists.",
      href: "/category/fine-art",
      image: "/images/categories/fine-art.jpg"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-lux-carbon">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-lux-gold uppercase tracking-widest mb-3">
            Featured Collections
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-lux-white mb-4 leading-tight font-normal">
            Curated Categories
          </h2>
          <p className="text-lg text-lux-gray-light max-w-2xl mx-auto font-light">
            Explore our diverse collection of authenticated antiques and collectibles
          </p>
        </div>

        {/* Three Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group block bg-lux-charcoal rounded-lg overflow-hidden hover:bg-lux-charcoal/80 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  width={400}
                  height={300}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <category.icon className="h-5 w-5 text-lux-gold" strokeWidth={1.5} />
                  <h3 className="text-xl font-serif text-lux-white">
                    {category.title}
                  </h3>
                </div>
                <p className="text-sm text-lux-gray-light leading-relaxed">
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