import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface ShippingEstimateProps {
  total: number;
  itemCount: number;
}

interface ShippingCost {
  base_cost: number;
  total_cost: number;
  estimated_days_min: number;
  estimated_days_max: number;
  is_free_shipping: boolean;
}

export function ShippingEstimate({ total, itemCount }: ShippingEstimateProps) {
  const [shippingCost, setShippingCost] = useState<ShippingCost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateShipping = async () => {
      try {
        const { data, error } = await supabase.rpc('calculate_shipping_cost', {
          p_total_amount: total,
          p_item_count: itemCount,
          p_country: 'US' // Default to US for now
        });

        if (error) throw error;
        setShippingCost(data[0]);
      } catch (error) {
        console.error('Error calculating shipping:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateShipping();
  }, [total, itemCount]);

  if (isLoading) {
    return (
      <div className="bg-shop-50 dark:bg-shop-800 p-4 rounded-lg animate-pulse">
        <div className="h-4 bg-shop-200 dark:bg-shop-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-shop-200 dark:bg-shop-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (!shippingCost) return null;

  return (
    <div className="bg-shop-50 dark:bg-shop-800 p-4 rounded-lg">
      <div className="flex items-center text-shop-600 dark:text-shop-300">
        <Truck className="h-5 w-5 mr-2" />
        <div className="flex-1">
          {shippingCost.is_free_shipping ? (
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              You've qualified for free shipping!
            </p>
          ) : (
            <>
              <p className="text-sm">
                Add {formatPrice(100 - total)} more for free shipping
              </p>
              <p className="text-xs mt-1">
                Estimated shipping: {formatPrice(shippingCost.total_cost)}
              </p>
            </>
          )}
          <p className="text-xs mt-1 text-shop-500">
            Estimated delivery: {shippingCost.estimated_days_min}-{shippingCost.estimated_days_max} business days
          </p>
        </div>
      </div>
    </div>
  );
}