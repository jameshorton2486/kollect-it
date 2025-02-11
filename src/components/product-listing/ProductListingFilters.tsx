
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
  const [selectedEra, setSelectedEra] = useState("all");
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
    setSelectedEra("all");
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
    selectedEra,
    setSelectedEra,
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
      <Card className="hidden md:block bg-white shadow-sm border-shop-200 hover:border-shop-accent1/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-heading font-semibold flex items-center text-shop-800">
            <Filter className="h-5 w-5 mr-2 text-shop-accent1" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FilterContent {...filterProps} />
        </CardContent>
      </Card>

      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full border-shop-200 hover:bg-shop-accent1/10 
                         hover:text-shop-accent1 hover:border-shop-accent1 
                         transition-all duration-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle className="font-heading text-xl text-shop-800">Filters</SheetTitle>
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
