import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { WelcomeSection } from "@/components/seller-dashboard/WelcomeSection";
import { QuickAccessGrid } from "@/components/seller-dashboard/QuickAccessGrid";
import { StatCards } from "@/components/seller-dashboard/StatCards";
import { SalesChart } from "@/components/seller-dashboard/SalesChart";
import { MonitoringSection } from "@/components/seller-dashboard/MonitoringSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Package, AlertTriangle, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { subDays } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [dateRange] = React.useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // First check if user is authenticated and has seller role
  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return null;
      }

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching user roles:", error);
        toast.error("Failed to verify seller access");
        return null;
      }

      return roles?.map(r => r.role) || [];
    }
  });

  React.useEffect(() => {
    if (!rolesLoading && userRoles && !userRoles.includes('seller')) {
      toast.error("You need seller access to view this page");
      navigate("/");
    }
  }, [userRoles, rolesLoading, navigate]);

  const { data: notifications, refetch: refetchNotifications } = useQuery({
    queryKey: ["seller-notifications"],
    enabled: userRoles?.includes('seller'),
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data } = await supabase
        .from("order_notifications")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      return data || [];
    }
  });

  const { data: salesData } = useQuery({
    queryKey: ["seller-dashboard-metrics"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data: orders } = await supabase
        .from("orders")
        .select(`
          id,
          created_at,
          total_amount,
          status,
          products (
            id,
            name,
            category_id,
            price
          )
        `)
        .eq("seller_id", session.user.id)
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString())
        .order("created_at", { ascending: true });

      return orders || [];
    }
  });

  const metrics = React.useMemo(() => {
    if (!salesData?.length) return {
      totalSales: 0,
      averageOrderValue: 0,
      totalOrders: 0,
      conversionRate: 0
    };

    const totalSales = salesData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const totalOrders = salesData.length;
    const averageOrderValue = totalSales / totalOrders;
    const conversionRate = (totalOrders / (totalOrders * 100)) * 100;

    return {
      totalSales,
      averageOrderValue,
      totalOrders,
      conversionRate
    };
  }, [salesData]);

  React.useEffect(() => {
    if (!userRoles?.includes('seller')) return;

    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_notifications',
        },
        (payload) => {
          refetchNotifications();
          toast.info("New notification received");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchNotifications, userRoles]);

  if (rolesLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!userRoles?.includes('seller')) {
    return null; // Will redirect in useEffect
  }

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("order_notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) {
      toast.error("Failed to mark notification as read");
    } else {
      refetchNotifications();
    }
  };

  return (
    <div className="space-y-6 p-6 pb-16">
      <WelcomeSection />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <StatCards metrics={metrics} />
          <SalesChart 
            data={salesData || []} 
            chartType="area"
            timeFrame="daily"
            dateRange={dateRange}
          />
        </div>
        
        <div className="space-y-6">
          {/* Notifications Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                  Recent Notifications
                </CardTitle>
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>
                Stay updated with your store's activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {notifications?.length ? (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start space-x-4 rounded-lg border p-3 ${
                          notification.read ? 'bg-muted/50' : 'bg-white'
                        }`}
                      >
                        {notification.type === 'new_order' ? (
                          <Package className="h-5 w-5 text-blue-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant={notification.read ? "secondary" : "default"}>
                            {notification.type === 'new_order' ? 'Order' : 'Alert'}
                          </Badge>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No new notifications
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <QuickAccessGrid />
        </div>
      </div>

      <MonitoringSection />
    </div>
  );
}
