
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ShoppingBag, Clock, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function BuyerDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const stats = [
    {
      title: "Recent Orders",
      value: "3",
      icon: ShoppingBag,
      description: "Orders in the last 30 days",
    },
    {
      title: "Pending Orders",
      value: "1",
      icon: Clock,
      description: "Orders being processed",
    },
    {
      title: "Messages",
      value: "5",
      icon: MessageSquare,
      description: "Unread messages",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-shop-800">Buyer Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-shop-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-shop-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-shop-800">{stat.value}</div>
                <p className="text-xs text-shop-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-shop-600">No recent activity to display.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Saved Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-shop-600">No saved searches yet.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
