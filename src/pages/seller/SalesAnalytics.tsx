
import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SalesChart } from "@/components/seller-dashboard/SalesChart";
import { StatCards } from "@/components/seller-dashboard/StatCards";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays, subDays } from "date-fns";
import { DateRange } from "react-day-picker";

export default function SalesAnalytics() {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [chartType, setChartType] = React.useState<"area" | "bar" | "pie">("area");
  const [timeFrame, setTimeFrame] = React.useState<"daily" | "weekly" | "monthly">("daily");

  // Fetch sales data and analytics
  const { data: salesData } = useQuery({
    queryKey: ["seller-sales-analytics", dateRange, timeFrame],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data: orders, error } = await supabase
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
        .gte("created_at", dateRange.from?.toISOString() ?? '')
        .lte("created_at", dateRange.to?.toISOString() ?? '')
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Error fetching sales data");
        return [];
      }

      return orders || [];
    }
  });

  // Fetch seller analytics data
  const { data: analyticsData } = useQuery({
    queryKey: ["seller-analytics-metrics"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from("seller_analytics")
        .select("*")
        .eq("seller_id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching analytics:", error);
        return null;
      }

      return data;
    }
  });

  // Calculate metrics from sales data and analytics
  const metrics = React.useMemo(() => {
    const defaultMetrics = {
      totalSales: 0,
      averageOrderValue: 0,
      totalOrders: 0,
      conversionRate: 0
    };

    if (!salesData?.length) return defaultMetrics;

    const totalSales = salesData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const totalOrders = salesData.length;
    const averageOrderValue = totalSales / totalOrders;
    
    // Calculate conversion rate using analytics data if available
    const conversionRate = analyticsData 
      ? (analyticsData.total_orders / analyticsData.total_customers) * 100 
      : (totalOrders / (totalOrders * 100)) * 100;

    return {
      totalSales,
      averageOrderValue,
      totalOrders,
      conversionRate
    };
  }, [salesData, analyticsData]);

  const handleExport = () => {
    if (!salesData?.length) {
      toast.error("No data available to export");
      return;
    }

    const csvData = salesData.map(order => ({
      Date: new Date(order.created_at).toLocaleDateString(),
      Order_ID: order.id,
      Product: order.products?.name || 'Unknown Product',
      Amount: order.total_amount,
      Status: order.status
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sales_report_${dateRange.from?.toISOString().split('T')[0]}_to_${dateRange.to?.toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    toast.success("Sales report downloaded successfully");
  };

  return (
    <DashboardLayout pageTitle="Sales Analytics">
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold">Sales Analytics</h1>
            <Button
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>

          <div className="grid gap-4 md:flex md:items-center md:gap-6">
            <DateRangePicker
              value={dateRange}
              onChange={(newDateRange: DateRange) => {
                setDateRange(newDateRange);
              }}
            />
            <Select
              value={timeFrame}
              onValueChange={(value: "daily" | "weekly" | "monthly") => setTimeFrame(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={chartType}
              onValueChange={(value: "area" | "bar" | "pie") => setChartType(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Area Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <StatCards metrics={metrics} />
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4">Sales Trend</h3>
            <SalesChart 
              data={salesData || []} 
              chartType={chartType}
              timeFrame={timeFrame}
              dateRange={{
                from: dateRange.from || new Date(),
                to: dateRange.to || new Date()
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
