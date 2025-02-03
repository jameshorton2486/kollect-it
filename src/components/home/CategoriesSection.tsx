import { motion } from "framer-motion";
import { CategoryCardGrid } from "@/components/categories/CategoryCardGrid";

export function CategoriesSection() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="section-padding bg-white"
      aria-labelledby="categories-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 
            id="categories-heading"
            className="heading-responsive text-shop-900 mb-4"
          >
            Discover Our Diverse Collection
          </h2>
          <p className="text-responsive text-shop-600 mb-12 max-w-3xl mx-auto">
            Explore a broad array of items, including antiques, vintage treasures, fine art, 
            rare books, jewelry, and more.
          </p>
        </motion.div>
        <CategoryCardGrid />
      </div>
    </motion.section>
  );
}