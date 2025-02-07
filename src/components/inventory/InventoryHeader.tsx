
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Package, AlertCircle } from "lucide-react";

interface InventoryHeaderProps {
  itemCount: number;
  itemLimit: number;
}

export function InventoryHeader({ itemCount, itemLimit }: InventoryHeaderProps) {
  const usagePercentage = (itemCount / itemLimit) * 100;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-6 w-6 text-[#008080]" />
          Inventory Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={usagePercentage} className="h-2" />
          <div className="flex justify-between text-sm text-shop-600">
            <span>{itemCount} items listed</span>
            <span>{itemLimit} items limit</span>
          </div>
          {usagePercentage >= 90 && (
            <div className="flex items-center gap-2 text-amber-600 mt-2">
              <AlertCircle className="h-5 w-5" />
              <span>You're approaching your inventory limit</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
