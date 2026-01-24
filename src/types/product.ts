/**
 * Product Domain Types
 * 
 * Extended types for products with relations.
 */

import type { 
  Product, 
  Category, 
  Subcategory, 
  Image 
} from '@prisma/client';

/**
 * Product with all relations loaded
 */
export type ProductWithRelations = Product & {
  Category: Category;
  Subcategory: Subcategory | null;
  Image: Image[];
};

/**
 * Product for grid/list display (minimal data)
 */
export type ProductListItem = Pick<
  Product,
  'id' | 'title' | 'slug' | 'price' | 'condition' | 'year'
> & {
  Image: Pick<Image, 'url'>[];
  Category: Pick<Category, 'name' | 'slug'> | null;
};

/**
 * Product filter options
 */
export interface ProductFilters {
  categoryId?: string;
  categorySlug?: string;
  subcategoryId?: string;
  subcategorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  search?: string;
  featured?: boolean;
  isDraft?: boolean;
}

/**
 * Product sort options
 */
export interface ProductSort {
  field: 'price' | 'createdAt' | 'title' | 'updatedAt';
  direction: 'asc' | 'desc';
}

/**
 * Product creation input
 */
export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  subcategoryId?: string;
  condition?: string;
  year?: string;
  artist?: string;
  medium?: string;
  period?: string;
  images?: { url: string; alt?: string; order?: number }[];
}

/**
 * Product update input
 */
export interface UpdateProductInput extends Partial<CreateProductInput> {
  featured?: boolean;
  status?: 'active' | 'sold' | 'archived';
  isDraft?: boolean;
}
