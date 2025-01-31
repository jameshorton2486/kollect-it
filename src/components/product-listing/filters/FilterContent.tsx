import { SearchFilter } from "@/components/products/filters/SearchFilter";
import { CategoryFilter } from "@/components/products/filters/CategoryFilter";
import { ConditionFilter } from "@/components/products/filters/ConditionFilter";
import { PriceRangeFilter } from "@/components/products/filters/PriceRangeFilter";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface FilterContentProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedCondition: string;
  setSelectedCondition: (value: string) => void;
  priceRange: { min: string; max: string };
  setPriceRange: (value: { min: string; max: string }) => void;
  categories: Tables<"categories">[] | undefined;
  resetFilters: () => void;
}

export function FilterContent({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedCondition,
  setSelectedCondition,
  priceRange,
  setPriceRange,
  categories,
  resetFilters,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />
      <ConditionFilter
        selectedCondition={selectedCondition}
        onConditionChange={setSelectedCondition}
      />
      <PriceRangeFilter
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
      />
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={resetFilters}
      >
        <X className="h-4 w-4 mr-2" />
        Reset Filters
      </Button>
    </div>
  );
}