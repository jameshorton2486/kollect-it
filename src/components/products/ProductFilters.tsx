import { Tables } from "@/integrations/supabase/types";
import { Separator } from "@/components/ui/separator";
import { SearchFilter } from "./filters/SearchFilter";
import { CategoryFilter } from "./filters/CategoryFilter";
import { PriceRangeFilter } from "./filters/PriceRangeFilter";
import { ConditionFilter } from "./filters/ConditionFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  selectedEra: string;
  onEraChange: (value: string) => void;
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

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold text-shop-800">Era</h3>
        <Select value={selectedEra} onValueChange={onEraChange}>
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
    </div>
  );
}