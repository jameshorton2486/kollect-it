import { Award, BookOpen, Gem, ShoppingBag, Star, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  imageUrl?: string;
  subcategories?: { id: string; name: string }[];
}

export function CategoryCard({ icon, title, description, href, imageUrl, subcategories }: CategoryCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <a href={href} className="block">
        <div className="relative h-48 overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-shop-50 flex items-center justify-center">
              <div className="text-shop-accent1">{icon}</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-shop-accent1">{icon}</span>
            <h3 className="text-xl font-semibold text-shop-800">{title}</h3>
          </div>
          <p className="text-shop-600 mb-4">{description}</p>
          {subcategories && subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {subcategories.slice(0, 3).map((sub) => (
                <span
                  key={sub.id}
                  className="text-xs bg-shop-100 text-shop-600 px-2 py-1 rounded-full"
                >
                  {sub.name}
                </span>
              ))}
              {subcategories.length > 3 && (
                <span className="text-xs text-shop-400">
                  +{subcategories.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </a>
    </Card>
  );
}

export function CategoryCardGrid() {
  const { data: categories } = useQuery({
    queryKey: ["categories-with-subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(`
          id,
          name,
          description,
          subcategories (
            id,
            name
          )
        `)
        .order('name');
      
      if (error) throw error;
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

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      role="list"
      aria-label="Collection categories"
    >
      {categories?.map((category) => {
        const IconComponent = getCategoryIcon(category.name);
        return (
          <CategoryCard
            key={category.id}
            icon={<IconComponent className="w-8 h-8" />}
            title={category.name}
            description={category.description || `Explore our collection of ${category.name.toLowerCase()}`}
            href={`/categories/${category.id}`}
            subcategories={category.subcategories}
          />
        );
      })}
    </div>
  );
}