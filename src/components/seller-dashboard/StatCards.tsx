import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp, Star, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Stat {
  title: string;
  value: string;
  icon: any;
  description: string;
  trend: string;
  trendDirection: 'up' | 'down';
}

export function StatCards() {
  const { data: stats } = useQuery({
    queryKey: ["seller-stats"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const [
        { count: totalProducts },
        { data: orders },
        { data: reviews }
      ] = await Promise.all([
        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("user_id", session.user.id),
        supabase
          .from("orders")
          .select("total_amount")
          .eq("seller_id", session.user.id),
        supabase
          .from("reviews")
          .select("rating")
          .eq("seller_id", session.user.id)
      ]);

      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const averageRating = reviews?.reduce((sum, review) => sum + review.rating, 0) / (reviews?.length || 1);

      return {
        totalRevenue,
        totalProducts,
        totalOrders: orders?.length || 0,
        averageRating: averageRating.toFixed(1),
        totalCustomers: new Set(orders?.map(o => o.buyer_id)).size || 0,
        growth: ((totalRevenue / 1000) - 1) * 100 // Placeholder calculation
      };
    },
    placeholderData: {
      totalRevenue: 12345,
      totalProducts: 45,
      totalOrders: 28,
      averageRating: "4.5",
      totalCustomers: 150,
      growth: 12.5
    }
  });

  const performanceStats: Stat[] = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toLocaleString()}`,
      icon: DollarSign,
      description: "Track your earnings and revenue growth",
      trend: "+12.5%",
      trendDirection: "up",
    },
    {
      title: "Active Listings",
      value: stats?.totalProducts?.toString() || "0",
      icon: Package,
      description: "Monitor your active product listings",
      trend: "+5",
      trendDirection: "up",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders?.toString() || "0",
      icon: ShoppingCart,
      description: "Track completed orders",
      trend: "+8",
      trendDirection: "up",
    },
    {
      title: "Customer Rating",
      value: stats?.averageRating || "0.0",
      icon: Star,
      description: "Your average customer rating",
      trend: "+0.2",
      trendDirection: "up",
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers?.toString() || "0",
      icon: Users,
      description: "Unique customers served",
      trend: "+15",
      trendDirection: "up",
    },
    {
      title: "Growth Rate",
      value: `${stats?.growth}%`,
      icon: TrendingUp,
      description: "Month-over-month growth",
      trend: "+2.3%",
      trendDirection: "up",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {performanceStats.map((stat) => (
        <Card 
          key={stat.title} 
          className="hover:shadow-lg transition-shadow group"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-shop-600">
              {stat.title}
            </CardTitle>
            <div className="relative group">
              <stat.icon className="h-4 w-4 text-[#008080]" />
              <div className="absolute hidden group-hover:block right-0 top-full mt-2 w-48 p-2 bg-white text-xs text-shop-600 rounded-md shadow-lg z-10">
                {stat.description}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-shop-800">{stat.value}</div>
            <div className={`text-xs mt-1 ${
              stat.trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              {stat.trend} from last period
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}