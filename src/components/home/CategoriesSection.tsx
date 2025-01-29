import { Award, Gem, ShoppingBag, Star } from "lucide-react";
import { CategoryCard } from "./CategoryCard";

export function CategoriesSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-shop-900 mb-4">
          Explore a Diverse Range of Collectibles
        </h2>
        <p className="text-lg text-shop-600 text-center mb-12 max-w-3xl mx-auto">
          Find extraordinary pieces across multiple categories, handpicked for quality and authenticity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <CategoryCard
            icon={<Award className="w-8 h-8" />}
            title="Fine Art & Paintings"
            description="Masterpieces from renowned and emerging artists"
          />
          <CategoryCard
            icon={<Gem className="w-8 h-8" />}
            title="Vintage & Antique Collectibles"
            description="Coins, stamps, toys, and memorabilia"
          />
          <CategoryCard
            icon={<Star className="w-8 h-8" />}
            title="Luxury Collectibles"
            description="High-end watches, rare jewelry, and designer pieces"
          />
          <CategoryCard
            icon={<ShoppingBag className="w-8 h-8" />}
            title="Pop Culture & Media"
            description="Comics, trading cards, and iconic movie props"
          />
        </div>
      </div>
    </section>
  );
}