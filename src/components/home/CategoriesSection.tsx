import { Award, BookOpen, Gem, Paint, Ring, ShoppingBag } from "lucide-react";
import { CategoryCard } from "./CategoryCard";

export function CategoriesSection() {
  return (
    <section 
      className="py-20 px-4 bg-white"
      aria-labelledby="categories-heading"
    >
      <div className="max-w-6xl mx-auto">
        <h2 
          id="categories-heading"
          className="text-3xl md:text-4xl font-bold text-center text-nav mb-4"
        >
          Discover Our Diverse Collection
        </h2>
        <p className="text-lg text-shop-600 text-center mb-12 max-w-3xl mx-auto">
          Explore a broad array of items, including antiques, vintage treasures, fine art, 
          rare books, jewelry, and more.
        </p>
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          role="list"
          aria-label="Collection categories"
        >
          <CategoryCard
            icon={<Paint className="w-8 h-8 text-[#008080]" />}
            title="Fine Art & Antiques"
            description="Masterpieces and historical treasures from renowned artists and periods"
            href="/categories/fine-art"
          />
          <CategoryCard
            icon={<BookOpen className="w-8 h-8 text-[#008080]" />}
            title="Rare Books & Literature"
            description="First editions, signed copies, and vintage publications"
            href="/categories/books"
          />
          <CategoryCard
            icon={<Ring className="w-8 h-8 text-[#008080]" />}
            title="Jewelry & Accessories"
            description="Vintage and antique jewelry pieces with unique character"
            href="/categories/jewelry"
          />
          <CategoryCard
            icon={<Gem className="w-8 h-8 text-[#008080]" />}
            title="Vintage Collectibles"
            description="Coins, stamps, toys, and memorabilia from past eras"
            href="/categories/vintage"
          />
          <CategoryCard
            icon={<Award className="w-8 h-8 text-[#008080]" />}
            title="Home Decor"
            description="Unique antique furniture and decorative pieces"
            href="/categories/home-decor"
          />
          <CategoryCard
            icon={<ShoppingBag className="w-8 h-8 text-[#008080]" />}
            title="Other Treasures"
            description="Discover more unique and hard-to-find collectibles"
            href="/categories/other"
          />
        </div>
      </div>
    </section>
  );
}