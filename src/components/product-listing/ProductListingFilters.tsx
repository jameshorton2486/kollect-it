import { CategoryFilter } from "@/components/products/filters/CategoryFilter";
import { ConditionFilter } from "@/components/products/filters/ConditionFilter";
import { PriceRangeFilter } from "@/components/products/filters/PriceRangeFilter";
import { SearchFilter } from "@/components/products/filters/SearchFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterContent } from "./filters/FilterContent";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProductListingFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedEra, setSelectedEra] = useState("all");
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
    setSelectedSubcategory("all");
    setSelectedCondition("all");
    setSelectedEra("all");
    setPriceRange({ min: "", max: "" });
  };

  const filterProps = {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedCondition,
    setSelectedCondition,
    selectedEra,
    setSelectedEra,
    priceRange,
    setPriceRange,
    categories,
    resetFilters,
  };

  const eras = [
    { value: "all", label: "All Eras" },
    { value: "victorian", label: "Victorian" },
    { value: "art-deco", label: "Art Deco" },
    { value: "mid-century", label: "Mid-Century" },
    { value: "vintage", label: "Vintage" },
    { value: "contemporary", label: "Contemporary" },
  ];

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
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={setSelectedSubcategory}
            categories={categories}
          />
          
          <PriceRangeFilter
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
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