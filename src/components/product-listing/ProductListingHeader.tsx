import { Breadcrumbs } from "@/components/ui/breadcrumb";

export function ProductListingHeader() {
  return (
    <div className="space-y-4">
      <Breadcrumbs 
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" }
        ]} 
      />
      
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