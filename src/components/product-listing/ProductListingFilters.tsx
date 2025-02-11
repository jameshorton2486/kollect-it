
import { CategoryFilter } from "@/components/products/filters/CategoryFilter";
import { ConditionFilter } from "@/components/products/filters/ConditionFilter";
import { PriceRangeFilter } from "@/components/products/filters/PriceRangeFilter";
import { SearchFilter } from "@/components/products/filters/SearchFilter";
import { MaterialFilter } from "@/components/products/filters/MaterialFilter";
import { SellerTypeFilter } from "@/components/products/filters/SellerTypeFilter";
import { AvailabilityFilter } from "@/components/products/filters/AvailabilityFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterContent } from "./filters/FilterContent";

export function ProductListingFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSellerType, setSelectedSellerType] = useState("all");
  const [showInStock, setShowInStock] = useState(true);
  const [showPreOrder, setShowPreOrder] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [isOpen, setIsOpen] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setSelectedMaterials([]);
    setSelectedSellerType("all");
    setShowInStock(true);
    setShowPreOrder(false);
    setPriceRange({ min: "", max: "" });
  };

  const filterProps = {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedCondition,
    setSelectedCondition,
    selectedMaterials,
    setSelectedMaterials,
    selectedSellerType,
    setSelectedSellerType,
    showInStock,
    setShowInStock,
    showPreOrder,
    setShowPreOrder,
    priceRange,
    setPriceRange,
    categories,
    resetFilters,
  };

  return (
    <>
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SearchFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />
          
          <PriceRangeFilter
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />
          
          <MaterialFilter
            selectedMaterials={selectedMaterials}
            onMaterialChange={setSelectedMaterials}
          />
          
          <ConditionFilter
            selectedCondition={selectedCondition}
            onConditionChange={setSelectedCondition}
          />
          
          <SellerTypeFilter
            selectedType={selectedSellerType}
            onTypeChange={setSelectedSellerType}
          />
          
          <AvailabilityFilter
            showInStock={showInStock}
            showPreOrder={showPreOrder}
            onInStockChange={setShowInStock}
            onPreOrderChange={setShowPreOrder}
          />

          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={resetFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </CardContent>
      </Card>

      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent {...filterProps} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
