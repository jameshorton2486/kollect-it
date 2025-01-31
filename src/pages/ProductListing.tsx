import { DashboardLayout } from "@/components/DashboardLayout";
import { ProductListingHeader } from "@/components/product-listing/ProductListingHeader";
import { ProductListingFilters } from "@/components/product-listing/ProductListingFilters";
import { ProductListingGrid } from "@/components/product-listing/ProductListingGrid";
import { NewArrivals } from "@/components/product-listing/NewArrivals";
import { CuratedCollections } from "@/components/product-listing/CuratedCollections";
import { ProductListingPagination } from "@/components/product-listing/ProductListingPagination";
import { useState } from "react";

export default function ProductListing() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductListingHeader 
          viewMode={viewMode} 
          onViewModeChange={setViewMode}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <aside className="md:col-span-1">
            <ProductListingFilters />
          </aside>
          <main className="md:col-span-3 space-y-8">
            <ProductListingGrid />
            <NewArrivals />
            <CuratedCollections />
            <ProductListingPagination />
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}