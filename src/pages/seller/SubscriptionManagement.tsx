
import { DashboardLayout } from "@/components/DashboardLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CurrentSubscription } from "@/components/subscription/CurrentSubscription";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { BillingHistory } from "@/components/subscription/BillingHistory";
import type { SubscriptionPlan, UserSubscription } from "@/types/subscription";

export default function SubscriptionManagement() {
  const queryClient = useQueryClient();

  const { data: subscriptionPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("price");

      if (error) {
        toast.error("Failed to load subscription plans");
        throw error;
      }
      return data as SubscriptionPlan[];
    }
  });

  const { data: currentSubscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["user-subscription"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .maybeSingle();

      if (error) {
        toast.error("Failed to load current subscription");
        throw error;
      }
      return data as UserSubscription | null;
    }
  });

  const { data: billingHistory } = useQuery({
    queryKey: ["billing-history"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load billing history");
        throw error;
      }
      return data as UserSubscription[];
    }
  });

  const handleSubscribe = async (planId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to subscribe");
        return;
      }

      const { error } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: session.user.id,
          plan_id: planId,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) throw error;
      
      toast.success("Successfully subscribed to plan");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["user-subscription"] }),
        queryClient.invalidateQueries({ queryKey: ["billing-history"] })
      ]);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe to plan");
    }
  };

  if (plansLoading || subscriptionLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Subscription Management">
      <div className="container mx-auto py-8 space-y-8">
        {currentSubscription && (
          <CurrentSubscription subscription={currentSubscription} />
        )}
        
        <SubscriptionPlans
          plans={subscriptionPlans || []}
          currentPlanId={currentSubscription?.subscription_plans.id}
          onSubscribe={handleSubscribe}
        />

        <BillingHistory history={billingHistory || []} />
      </div>
    </DashboardLayout>
  );
}
