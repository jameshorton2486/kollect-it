
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  item_limit: number;
  features: string[];
}

interface UserSubscription {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  plan_id: string;
  created_at: string;
  subscription_plans: SubscriptionPlan;
}

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

  const { data: billingHistory, isLoading: historyLoading } = useQuery({
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

      // In a real application, you would integrate with Stripe here
      // For now, we'll just create a subscription record
      const { error } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: session.user.id,
          plan_id: planId,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        });

      if (error) throw error;
      
      toast.success("Successfully subscribed to plan");
      // Refresh the queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["user-subscription"] }),
        queryClient.invalidateQueries({ queryKey: ["billing-history"] })
      ]);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe to plan");
    }
  };

  return (
    <DashboardLayout pageTitle="Subscription Management">
      <div className="container mx-auto py-8 space-y-8">
        {/* Current Subscription Status */}
        {currentSubscription && (
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{currentSubscription.subscription_plans.name} Plan</h3>
                  <p className="text-muted-foreground">
                    Renews on {format(new Date(currentSubscription.current_period_end), "MMMM d, yyyy")}
                  </p>
                </div>
                <Badge variant={currentSubscription.status === "active" ? "default" : "destructive"}>
                  {currentSubscription.status.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Plans */}
        <h2 className="text-3xl font-bold text-shop-800 mb-8">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {subscriptionPlans?.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-shop-800">${plan.price}</span>
                  <span className="text-shop-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-teal-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-auto bg-[#008080] hover:bg-[#006666] text-white"
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={currentSubscription?.subscription_plans.id === plan.id}
                >
                  {currentSubscription?.subscription_plans.id === plan.id ? "Current Plan" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Billing History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Period</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory?.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        {format(new Date(subscription.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{subscription.subscription_plans.name}</TableCell>
                      <TableCell>${subscription.subscription_plans.price}</TableCell>
                      <TableCell>
                        <Badge variant={subscription.status === "active" ? "default" : "destructive"}>
                          {subscription.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(subscription.current_period_start), "MMM d")} -{" "}
                        {format(new Date(subscription.current_period_end), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
