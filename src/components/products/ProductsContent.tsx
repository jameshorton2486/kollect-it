import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { ProductGrid } from "./ProductGrid";
import { ProductFilters } from "./ProductFilters";

interface ProductsContentProps {
  isLoading: boolean;
  filteredProducts: Tables<"products">[];
  categories: Tables<"categories">[] | undefined;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  priceRange: { min: string; max: string };
  onPriceRangeChange: (value: { min: string; max: string }) => void;
  selectedCondition: string;
  onConditionChange: (value: string) => void;
  selectedEra: string;
  onEraChange: (value: string) => void;
}

export function ProductsContent({
  isLoading,
  filteredProducts,
  categories,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedCondition,
  onConditionChange,
  selectedEra,
  onEraChange,
}: ProductsContentProps) {
  const filters = {
    search: searchQuery,
    category: selectedCategory,
    condition: selectedCondition,
    priceRange,
    era: selectedEra,
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    onSearchChange(newFilters.search);
    onCategoryChange(newFilters.category);
    onConditionChange(newFilters.condition);
    onPriceRangeChange(newFilters.priceRange);
    onEraChange(newFilters.era);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="space-y-6 md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Search & Browse
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Use our intuitive filters to discover collectibles that match your interests
            </p>
          </CardHeader>
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            categories={categories}
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            selectedCondition={selectedCondition}
            onConditionChange={onConditionChange}
            selectedEra={selectedEra}
            onEraChange={onEraChange}
          />
        </Card>
      </aside>

      <main className="md:col-span-3">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              {isLoading ? "Loading..." : `${filteredProducts.length} Products Found`}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length === 0 
                ? "Try adjusting your filters or exploring new categories. Our curated collection is always growing with unique and rare finds."
                : "Browse our curated collection of fine art and collectibles, with prices ranging from $100 to $1,000+"}
            </p>
          </CardHeader>
        </Card>
        <ProductGrid 
          products={filteredProducts} 
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </main>
    </div>
  );
}