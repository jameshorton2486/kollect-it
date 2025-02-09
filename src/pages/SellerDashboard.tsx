
import React from "react";
import { subDays } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell } from "lucide-react";
import { WelcomeSection } from "@/components/seller-dashboard/WelcomeSection";
import { QuickAccessGrid } from "@/components/seller-dashboard/QuickAccessGrid";
import { StatCards } from "@/components/seller-dashboard/StatCards";
import { SalesChart } from "@/components/seller-dashboard/SalesChart";
import { MonitoringSection } from "@/components/seller-dashboard/MonitoringSection";
import { NotificationsList } from "@/components/seller-dashboard/NotificationsList";
import { useSellerAuthorization } from "@/hooks/useSellerAuthorization";
import { useSellerNotifications } from "@/hooks/useSellerNotifications";
import { useSellerMetrics } from "@/hooks/useSellerMetrics";

export default function SellerDashboard() {
  const [dateRange] = React.useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { userRoles, rolesLoading } = useSellerAuthorization();
  const { notifications, markAsRead } = useSellerNotifications(userRoles?.includes('seller') || false);
  const { salesData, metrics } = useSellerMetrics(dateRange);

  if (rolesLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!userRoles?.includes('seller')) {
    return null; // Will redirect in useEffect
  }

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
              <NotificationsList 
                notifications={notifications} 
                onMarkAsRead={markAsRead}
              />
            </CardContent>
          </Card>

          <QuickAccessGrid />
        </div>
      </div>

      <MonitoringSection />
    </div>
  );
}
