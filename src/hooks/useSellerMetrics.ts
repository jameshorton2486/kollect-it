
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

export const useSellerMetrics = (dateRange: { from: Date; to: Date }) => {
  const { data: salesData } = useQuery({
    queryKey: ["seller-dashboard-metrics"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data: orders } = await supabase
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
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString())
        .order("created_at", { ascending: true });

      return orders || [];
    }
  });

  const metrics = useMemo(() => {
    if (!salesData?.length) return {
      totalSales: 0,
      averageOrderValue: 0,
      totalOrders: 0,
      conversionRate: 0
    };

    const totalSales = salesData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const totalOrders = salesData.length;
    const averageOrderValue = totalSales / totalOrders;
    const conversionRate = (totalOrders / (totalOrders * 100)) * 100;

    return {
      totalSales,
      averageOrderValue,
      totalOrders,
      conversionRate
    };
  }, [salesData]);

  return { salesData, metrics };
};
