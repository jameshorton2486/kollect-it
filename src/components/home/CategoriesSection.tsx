
import { motion } from "framer-motion";
import { CategoryCardGrid } from "@/components/categories/CategoryCardGrid";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function CategoriesSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="section-padding bg-white py-16 sm:py-24"
      aria-labelledby="categories-heading"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 
            id="categories-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-shop-900 mb-6"
          >
            Discover Our Diverse Collection
          </h2>
          <p className="text-lg sm:text-xl text-shop-600 mb-12 max-w-3xl mx-auto">
            Explore a curated selection of antiques, vintage treasures, fine art, 
            rare books, jewelry, and collectibles.
          </p>
          
          <div className="max-w-md mx-auto mb-16 relative">
            <Input
              type="search"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg rounded-full border-shop-200 focus:border-shop-accent1 
                         focus:ring-shop-accent1/20 transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-shop-400 h-5 w-5" />
          </div>
        </motion.div>

        <CategoryCardGrid />
      </div>
    </motion.section>
  );
}
