
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminMetrics } from "@/types/admin";
import { toast } from "sonner";
import {
  Users,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  Settings,
  Shield,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const [users, listings, sales, disputes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('reviews').select('id').eq('status', 'disputed'),
      ]);

      return {
        totalUsers: users.count || 0,
        activeListings: listings.count || 0,
        totalSales: sales.count || 0,
        openDisputes: disputes.data?.length || 0,
      } as AdminMetrics;
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data: adminSettings, error } = await supabase
        .from('admin_dashboard_settings')
        .select('*')
        .maybeSingle();

      if (error) {
        toast.error("Failed to load dashboard settings");
        return null;
      }
      
      // Return default settings if none exist
      return adminSettings || {
        show_metrics: true,
        enable_notifications: true,
        default_view: "analytics",
        refresh_interval: 300, // 5 minutes
      };
    },
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-shop-800 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <h3 className="text-2xl font-bold">{metrics?.totalUsers || 0}</h3>
                </div>
                <Users className="h-8 w-8 text-shop-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                  <h3 className="text-2xl font-bold">{metrics?.activeListings || 0}</h3>
                </div>
                <ShoppingBag className="h-8 w-8 text-shop-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                  <h3 className="text-2xl font-bold">{metrics?.totalSales || 0}</h3>
                </div>
                <TrendingUp className="h-8 w-8 text-shop-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open Disputes</p>
                  <h3 className="text-2xl font-bold">{metrics?.openDisputes || 0}</h3>
                </div>
                <AlertTriangle className="h-8 w-8 text-shop-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagementTable />
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Login Attempts</h3>
                      <p className="text-sm text-muted-foreground">
                        Monitor and manage login attempts
                      </p>
                    </div>
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      View Logs
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Admin Activity</h3>
                      <p className="text-sm text-muted-foreground">
                        Track administrative actions
                      </p>
                    </div>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      View Activity
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
