export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: string | null;
  condition: string | null;
  era: string | null;
  categories?: {
    name: string | null;
  } | null;
  subcategories?: {
    name: string;
  }[];
}

export interface ProductListingGridProps {
  sortBy: string;
  filters: {
    search: string;
    category: string;
    subcategory: string;
    condition: string;
    priceRange: { min: string; max: string };
    era: string;
  };
}