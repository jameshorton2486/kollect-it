
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  item_limit: number;
  features: string[];
}

export interface UserSubscription {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  plan_id: string;
  created_at: string;
  subscription_plans: SubscriptionPlan;
}
