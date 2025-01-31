import { Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ShippingEstimateProps {
  total: number;
}

export function ShippingEstimate({ total }: ShippingEstimateProps) {
  // Simple shipping estimate logic
  const shippingCost = total > 100 ? 0 : 10;
  const freeShippingThreshold = 100;
  
  return (
    <div className="bg-shop-50 dark:bg-shop-800 p-4 rounded-lg">
      <div className="flex items-center text-shop-600 dark:text-shop-300">
        <Truck className="h-5 w-5 mr-2" />
        <div className="flex-1">
          {total < freeShippingThreshold ? (
            <>
              <p className="text-sm">
                Add {formatPrice(freeShippingThreshold - total)} more for free shipping
              </p>
              <p className="text-xs mt-1">
                Estimated shipping: {formatPrice(shippingCost)}
              </p>
            </>
          ) : (
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              You've qualified for free shipping!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}