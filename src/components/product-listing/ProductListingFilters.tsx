import { CategoryFilter } from "@/components/products/filters/CategoryFilter";
import { ConditionFilter } from "@/components/products/filters/ConditionFilter";
import { PriceRangeFilter } from "@/components/products/filters/PriceRangeFilter";
import { SearchFilter } from "@/components/products/filters/SearchFilter";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ProductListingFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

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

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
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
      </CardContent>
    </Card>
  );
}