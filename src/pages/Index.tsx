import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    label: "Total Sales",
    value: "$0",
    icon: TrendingUp,
    trend: "+0%",
    trendUp: true,
  },
  {
    label: "Orders",
    value: "0",
    icon: ShoppingCart,
    trend: "+0%",
    trendUp: true,
  },
  {
    label: "Products",
    value: "0",
    icon: Package,
    trend: "0",
    trendUp: false,
  },
  {
    label: "Views",
    value: "0",
    icon: BarChart3,
    trend: "+0%",
    trendUp: true,
  },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-shop-800">Dashboard</h1>
          <p className="text-shop-500 mt-2">Welcome to your store dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-shop-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-semibold text-shop-800 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    "bg-shop-100"
                  )}
                >
                  <stat.icon className="w-6 h-6 text-shop-600" />
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={cn(
                    "text-sm",
                    stat.trendUp ? "text-green-600" : "text-red-600"
                  )}
                >
                  {stat.trend}
                </span>
                <span className="text-shop-500 text-sm ml-1">vs last month</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-shop-800 mb-4">
              Recent Orders
            </h2>
            <div className="text-shop-500 text-center py-8">
              No orders yet
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-shop-800 mb-4">
              Popular Products
            </h2>
            <div className="text-shop-500 text-center py-8">
              No products yet
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;