import { Tables } from "@/integrations/supabase/types";
import { Separator } from "@/components/ui/separator";
import { SearchFilter } from "./filters/SearchFilter";
import { CategoryFilter } from "./filters/CategoryFilter";
import { PriceRangeFilter } from "./filters/PriceRangeFilter";
import { ConditionFilter } from "./filters/ConditionFilter";

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: Tables<"categories">[] | undefined;
  priceRange: { min: string; max: string };
  onPriceRangeChange: (value: { min: string; max: string }) => void;
  selectedCondition: string;
  onConditionChange: (value: string) => void;
  selectedEra?: string;
  onEraChange?: (value: string) => void;
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  priceRange,
  onPriceRangeChange,
  selectedCondition,
  onConditionChange,
  selectedEra,
  onEraChange,
}: ProductFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <SearchFilter searchQuery={searchQuery} onSearchChange={onSearchChange} />
      
      <Separator />
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        categories={categories}
      />
      
      <Separator />
      
      <PriceRangeFilter
        priceRange={priceRange}
        onPriceRangeChange={onPriceRangeChange}
      />
      
      <Separator />
      
      <ConditionFilter
        selectedCondition={selectedCondition}
        onConditionChange={onConditionChange}
      />
    </div>
  );
}