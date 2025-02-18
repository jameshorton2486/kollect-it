
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";
import { Award, BookOpen, Gem, ShoppingBag, Star, Palette } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface CategoryWithSubcategories extends Tables<"categories"> {
  subcategories: {
    id: string;
    name: string;
  }[];
}

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  imageUrl?: string | null;
  subcategories?: { id: string; name: string }[];
}

function CategoryCard({ icon, title, description, href, imageUrl, subcategories }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 rounded-lg border border-transparent hover:border-[#C6A961]">
        <a href={href} className="block">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F5F5]">
            {imageUrl ? (
              <OptimizedImage
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                fallbackSrc="/placeholder.svg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <motion.div 
                  className="text-[#C6A961]"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {icon}
                </motion.div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#C6A961]">{icon}</span>
              <h3 className="font-display text-xl font-semibold text-[#222222] group-hover:text-[#C6A961] transition-colors duration-300 tracking-wide">
                {title}
              </h3>
            </div>
            <p className="font-sans text-[#555555] mb-4 line-clamp-2">{description}</p>
            {subcategories && subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {subcategories.slice(0, 3).map((sub) => (
                  <span
                    key={sub.id}
                    className="text-xs bg-[#F5F5F5] text-[#555555] px-2 py-1 rounded-full 
                             transition-colors duration-200 group-hover:bg-[#C6A961]/10 
                             group-hover:text-[#C6A961]"
                  >
                    {sub.name}
                  </span>
                ))}
                {subcategories.length > 3 && (
                  <span className="text-xs text-[#555555]">
                    +{subcategories.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </a>
      </Card>
    </motion.div>
  );
}

export function CategoryCardGrid() {
  const { data: categories, isLoading } = useQuery<CategoryWithSubcategories[]>({
    queryKey: ["categories-with-subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(`
          *,
          subcategories (
            id,
            name
          )
        `)
        .order('name');
      
      if (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
      
      return data;
    }
  });

  const getCategoryIcon = (categoryName: string) => {
    const icons: { [key: string]: any } = {
      'Antiques': Award,
      'Art': Palette,
      'Books & Manuscripts': BookOpen,
      'Collectibles': Gem,
      'Jewelry': Star,
      'Other': ShoppingBag,
    };
    return icons[categoryName] || ShoppingBag;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Card className="animate-pulse">
              <div className="aspect-[4/3] bg-[#F5F5F5]" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-[#F5F5F5] rounded w-2/3" />
                <div className="h-4 bg-[#F5F5F5] rounded w-full" />
                <div className="h-4 bg-[#F5F5F5] rounded w-3/4" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8"
      role="list"
      aria-label="Collection categories"
    >
      {categories?.map((category, index) => {
        const IconComponent = getCategoryIcon(category.name);
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CategoryCard
              icon={<IconComponent className="w-8 h-8" />}
              title={category.name}
              description={category.description || `Explore our collection of ${category.name.toLowerCase()}`}
              href={`/categories/${category.id}`}
              imageUrl={category.image_url}
              subcategories={category.subcategories}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
