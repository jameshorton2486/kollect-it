
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, TrendingUp, BarChart2 } from "lucide-react";

interface StatCardsProps {
  metrics: {
    totalSales: number;
    averageOrderValue: number;
    totalOrders: number;
    conversionRate: number;
  };
}

export function StatCards({ metrics }: StatCardsProps) {
  const performanceStats = [
    {
      title: "Total Sales",
      value: `$${metrics.totalSales.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      description: "Total revenue from all sales",
    },
    {
      title: "Average Order Value",
      value: `$${metrics.averageOrderValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: BarChart2,
      description: "Average amount per order",
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders.toString(),
      icon: ShoppingBag,
      description: "Number of completed orders",
    },
    {
      title: "Conversion Rate",
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      description: "Order to view ratio",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {performanceStats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
