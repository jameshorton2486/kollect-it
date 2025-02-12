
export interface AdminMetrics {
  totalUsers: number;
  activeListings: number;
  totalSales: number;
  openDisputes: number;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  action_type: string;
  target_type: string;
  target_id: string | null;
  changes: Record<string, any>;
  ip_address: string | null;
  created_at: string;
}

export interface AdminDashboardSettings {
  id: string;
  admin_id: string;
  layout_preferences: Record<string, any>;
  visible_metrics: string[];
  created_at: string;
  updated_at: string;
}

export interface UserBan {
  id: string;
  user_id: string;
  banned_by: string;
  reason: string;
  expires_at: string | null;
  created_at: string;
  lifted_at: string | null;
  lifted_by: string | null;
  lift_reason: string | null;
}
