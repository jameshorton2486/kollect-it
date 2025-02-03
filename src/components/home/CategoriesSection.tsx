import { CategoryCardGrid } from "@/components/categories/CategoryCardGrid";

export function CategoriesSection() {
  return (
    <section className="py-20 px-4 bg-white" aria-labelledby="categories-heading">
      <div className="max-w-6xl mx-auto">
        <h2 
          id="categories-heading"
          className="text-3xl md:text-4xl font-bold text-center text-shop-900 mb-4"
        >
          Discover Our Diverse Collection
        </h2>
        <p className="text-lg text-shop-600 text-center mb-12 max-w-3xl mx-auto">
          Explore a broad array of items, including antiques, vintage treasures, fine art, 
          rare books, jewelry, and more.
        </p>
        <CategoryCardGrid />
      </div>
    </section>
  );
}