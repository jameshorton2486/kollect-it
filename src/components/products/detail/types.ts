import { Tables } from "@/integrations/supabase/types";

export interface ProductWithDetails extends Tables<"products"> {
  category?: {
    name: string | null;
  } | null;
  seller?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface ProductGalleryProps {
  defaultImage: string;
  images: Array<{
    id: string;
    image_url: string;
    display_order: number;
  }>;
}