import { SearchFilter } from "@/components/products/filters/SearchFilter";
import { CategoryFilter } from "@/components/products/filters/CategoryFilter";
import { ConditionFilter } from "@/components/products/filters/ConditionFilter";
import { PriceRangeFilter } from "@/components/products/filters/PriceRangeFilter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface FilterContentProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedCondition: string;
  setSelectedCondition: (value: string) => void;
  selectedEra: string;
  setSelectedEra: (value: string) => void;
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
  selectedEra,
  setSelectedEra,
  priceRange,
  setPriceRange,
  categories,
  resetFilters,
}: FilterContentProps) {
  const eras = [
    { value: "all", label: "All Eras" },
    { value: "victorian", label: "Victorian (1837-1901)" },
    { value: "art-deco", label: "Art Deco (1920-1939)" },
    { value: "mid-century", label: "Mid-Century Modern (1945-1969)" },
    { value: "art-nouveau", label: "Art Nouveau (1890-1910)" },
    { value: "edwardian", label: "Edwardian (1901-1910)" },
    { value: "vintage", label: "Vintage (50+ years old)" },
    { value: "contemporary", label: "Contemporary (Post-1970)" },
  ];

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
      <div className="space-y-4">
        <h3 className="font-semibold text-shop-800">Era</h3>
        <Select value={selectedEra} onValueChange={setSelectedEra}>
          <SelectTrigger>
            <SelectValue placeholder="Select Era" />
          </SelectTrigger>
          <SelectContent>
            {eras.map((era) => (
              <SelectItem key={era.value} value={era.value}>
                {era.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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