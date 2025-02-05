
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  condition: string | null;
  era: string | null;
  created_at: string;  // Removed optional marker since it's required
  updated_at: string;  // Removed optional marker since it's required
  user_id: string;     // Removed optional marker since it's required
  estimated_age: string | null;
  provenance: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  social_shares: number | null;
  subcategories: {
    name: string;
  }[] | null;
  categories: {
    name: string | null;
  } | null;
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
