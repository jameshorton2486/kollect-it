
export type UserRole = 'admin' | 'buyer' | 'seller';

export interface UserRoleData {
  role: UserRole;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  business_name: string | null;
  is_seller: boolean | null;
  seller_since: string | null;
  total_sales: number | null;
  rating: number | null;
  user_roles: UserRoleData[];
}

export interface SupabaseProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  business_name: string | null;
  is_seller: boolean | null;
  seller_since: string | null;
  total_sales: number | null;
  rating: number | null;
  user_roles: { role: UserRole }[] | null;
}

export interface AuthUser {
  id: string;
  email?: string;
}
