import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { ProductGrid } from "./ProductGrid";
import { ProductFilters } from "./ProductFilters";
import { SavedSearchesList } from "./SavedSearchesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <Tabs defaultValue="filters">
          <TabsList className="w-full">
            <TabsTrigger value="filters" className="flex-1">Filters</TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
          </TabsList>
          <TabsContent value="filters">
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
          </TabsContent>
          <TabsContent value="saved">
            <SavedSearchesList />
          </TabsContent>
        </Tabs>
      </aside>

      <main className="md:col-span-3">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              {isLoading ? "Loading..." : `${filteredProducts.length} Products Found`}
            </CardTitle>
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