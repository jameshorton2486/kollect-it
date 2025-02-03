import { CategoryCard } from "../CategoryCard";
import { Tables } from "@/integrations/supabase/types";

interface CategoryGridProps {
  categories: (Tables<"categories"> & {
    subcategories: { id: string; name: string }[];
  })[] | null;
  onEdit: (category: Tables<"categories"> & {
    subcategories: { id: string; name: string }[];
  }) => void;
  onDelete: (id: string) => Promise<void>;
}

export function CategoryGrid({ categories, onEdit, onDelete }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories?.map((category) => (
        <CategoryCard
          key={category.id}
          id={category.id}
          name={category.name}
          description={category.description || ""}
          subcategories={category.subcategories || []}
          onEdit={() => onEdit(category)}
          onDelete={() => onDelete(category.id)}
        />
      ))}
    </div>
  );
}