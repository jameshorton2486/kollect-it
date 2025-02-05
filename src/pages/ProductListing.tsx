import { DashboardLayout } from "@/components/DashboardLayout";
import { ProductListingHeader } from "@/components/product-listing/ProductListingHeader";
import { ProductListingGrid } from "@/components/product-listing/ProductListingGrid";
import { ProductListingFilters } from "@/components/product-listing/ProductListingFilters";
import { NewArrivals } from "@/components/product-listing/NewArrivals";
import { CuratedCollections } from "@/components/product-listing/CuratedCollections";
import { ProductListingPagination } from "@/components/product-listing/ProductListingPagination";
import { useState } from "react";

export default function ProductListing() {
  const [sortBy, setSortBy] = useState("created_at_desc");
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    subcategory: "all",
    condition: "all",
    priceRange: { min: "", max: "" },
    era: "all",
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductListingHeader 
          title="Explore Our Collection"
          description="Discover unique collectibles and fine art pieces"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <aside className="md:col-span-1">
            <ProductListingFilters />
          </aside>
          <main className="md:col-span-3">
            <ProductListingGrid sortBy={sortBy} filters={filters} />
            <ProductListingPagination />
          </main>
        </div>
        <NewArrivals />
        <CuratedCollections />
      </div>
    </DashboardLayout>
  );
}