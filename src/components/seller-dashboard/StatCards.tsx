import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$12,345",
    icon: DollarSign,
    description: "Track your earnings and revenue growth over time",
    trend: "+12.5%",
    trendDirection: "up",
  },
  {
    title: "Active Listings",
    value: "45",
    icon: Package,
    description: "Monitor your active product listings and inventory levels",
    trend: "+5",
    trendDirection: "up",
  },
  {
    title: "Orders",
    value: "28",
    icon: ShoppingCart,
    description: "Keep track of new and pending orders this month",
    trend: "-2",
    trendDirection: "down",
  },
  {
    title: "Sales Growth",
    value: "+12.5%",
    icon: TrendingUp,
    description: "Analyze your month-over-month sales performance",
    trend: "+2.3%",
    trendDirection: "up",
  },
];

export function StatCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card 
          key={stat.title} 
          className="hover:shadow-lg transition-shadow group"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-shop-600">
              {stat.title}
            </CardTitle>
            <div className="relative group">
              <stat.icon className="h-4 w-4 text-shop-600" />
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