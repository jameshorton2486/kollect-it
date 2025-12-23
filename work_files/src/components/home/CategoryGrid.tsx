import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Fine Art",
    slug: "fine-art",
    image: "/images/categories/fine-art.webp",
    description: "Paintings, prints, and sculptures",
  },
  {
    name: "Rare Books",
    slug: "rare-books",
    image: "/images/categories/rare-books.webp",
    description: "First editions and collectible volumes",
  },
  {
    name: "Collectibles",
    slug: "collectibles",
    image: "/images/categories/collectibles.webp",
    description: "Curated objects and curiosities",
  },
  {
    name: "Militaria",
    slug: "militaria",
    image: "/images/categories/militaria.webp",
    description: "Historical military artifacts",
  },
];

export default function CategoryGrid() {
  return (
    <section className="bg-lux-pearl section-normal">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <p className="text-label text-lux-gold mb-2">Explore Our Collection</p>
          <h2 className="heading-section text-lux-black">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-lux-cream shadow-clean transition-all duration-300 group-hover:shadow-soft">
                {/* Category Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-lux-black/60 via-transparent to-transparent" />
                
                {/* Category Name */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="font-serif text-xl md:text-2xl text-lux-white group-hover:text-lux-gold-light transition-colors">
                    {category.name}
                  </h3>
                  <div className="h-0.5 w-0 bg-lux-gold transition-all duration-300 group-hover:w-12 mt-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


