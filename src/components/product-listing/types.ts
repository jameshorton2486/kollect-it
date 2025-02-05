
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: string | null;
  condition: string | null;
  era: string | null;
  subcategories: {
    name: string;
  }[] | null;
  categories: {
    name: string | null;
  } | null;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  estimated_age?: string | null;
  provenance?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  social_shares?: number;
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
