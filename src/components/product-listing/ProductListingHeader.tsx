import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

export function ProductListingHeader() {
  return (
    <div className="space-y-4">
      <Breadcrumb separator={<ChevronRight className="h-4 w-4" />}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div>
        <h1 className="text-3xl font-bold text-shop-800">Fine Art & Collectibles</h1>
        <p className="mt-2 text-shop-600">
          Discover unique pieces from our curated collection of fine art and rare collectibles.
          Each item is carefully authenticated and comes with a detailed description.
        </p>
      </div>
    </div>
  );
}