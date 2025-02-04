import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedSubcategory?: string;
  onSubcategoryChange?: (value: string) => void;
  categories: Tables<"categories">[] | undefined;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  selectedSubcategory,
  onSubcategoryChange,
  categories,
}: CategoryFilterProps) {
  const [currentCategory, setCurrentCategory] = useState(selectedCategory);

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories", currentCategory],
    queryFn: async () => {
      if (currentCategory === "all") return [];
      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", currentCategory)
        .order("name");
      
      if (error) throw error;
      return data;
    },
    enabled: currentCategory !== "all",
  });

  const handleCategoryChange = (value: string) => {
    setCurrentCategory(value);
    onCategoryChange(value);
    if (onSubcategoryChange) {
      onSubcategoryChange("all");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-shop-800">Category</h3>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCategory !== "all" && onSubcategoryChange && (
        <div>
          <h3 className="font-semibold text-shop-800">Subcategory</h3>
          <Select 
            value={selectedSubcategory} 
            onValueChange={onSubcategoryChange}
            disabled={!subcategories?.length}
          >
            <SelectTrigger>
              <SelectValue placeholder={subcategories?.length ? "Select Subcategory" : "No subcategories available"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {subcategories?.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}