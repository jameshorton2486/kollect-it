
import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { AnalyticsHeader } from "@/components/seller-dashboard/AnalyticsHeader";
import { AnalyticsFilters } from "@/components/seller-dashboard/AnalyticsFilters";
import { AnalyticsChart } from "@/components/seller-dashboard/AnalyticsChart";

export default function SalesAnalytics() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
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
        .gte("created_at", dateRange?.from?.toISOString() ?? '')
        .lte("created_at", dateRange?.to?.toISOString() ?? '')
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
    link.download = `sales_report_${dateRange?.from?.toISOString().split('T')[0]}_to_${dateRange?.to?.toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    toast.success("Sales report downloaded successfully");
  };

  return (
    <DashboardLayout pageTitle="Sales Analytics">
      <div className="container mx-auto py-8 space-y-8">
        <AnalyticsHeader onExport={handleExport} />
        
        <AnalyticsFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          timeFrame={timeFrame}
          onTimeFrameChange={setTimeFrame}
          chartType={chartType}
          onChartTypeChange={setChartType}
        />

        <AnalyticsChart
          salesData={salesData || []}
          metrics={metrics}
          chartType={chartType}
          timeFrame={timeFrame}
          dateRange={{
            from: dateRange?.from || new Date(),
            to: dateRange?.to || new Date()
          }}
        />
      </div>
    </DashboardLayout>
  );
}
