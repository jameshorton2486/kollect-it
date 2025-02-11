
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-shop-50">
        <div className="animate-pulse text-shop-600">Loading...</div>
      </div>
    );
  }

  if (!userRoles?.includes('seller')) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-shop-50">
      <div className="space-y-6 p-6 pb-16 max-w-[1600px] mx-auto">
        <WelcomeSection />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <StatCards metrics={metrics} />
            <Card className="border-shop-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-shop-600">
                  Sales Overview
                </CardTitle>
                <CardDescription className="text-shop-400">
                  Your sales performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SalesChart 
                  data={salesData || []} 
                  chartType="area"
                  timeFrame="daily"
                  dateRange={dateRange}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="border-shop-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-shop-600">
                    Recent Notifications
                  </CardTitle>
                  <Bell className="h-5 w-5 text-shop-accent1" />
                </div>
                <CardDescription className="text-shop-400">
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

        <Card className="border-shop-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-shop-600">
              Performance Monitoring
            </CardTitle>
            <CardDescription className="text-shop-400">
              Track your store's key metrics and performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonitoringSection />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
