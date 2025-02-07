
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

export default function SellerDashboard() {
  // Fetch notifications with real-time updates
  const { data: notifications, refetch: refetchNotifications } = useQuery({
    queryKey: ["seller-notifications"],
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

  // Subscribe to real-time notifications
  React.useEffect(() => {
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
  }, [refetchNotifications]);

  // Mark notification as read
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
    <DashboardLayout requiredRole="seller">
      <div className="space-y-6 p-6 pb-16">
        <WelcomeSection />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <StatCards />
            <SalesChart />
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
    </DashboardLayout>
  );
}
