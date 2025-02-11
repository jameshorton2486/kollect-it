
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AvailabilityFilterProps {
  showInStock: boolean;
  showPreOrder: boolean;
  onInStockChange: (value: boolean) => void;
  onPreOrderChange: (value: boolean) => void;
}

export function AvailabilityFilter({
  showInStock,
  showPreOrder,
  onInStockChange,
  onPreOrderChange,
}: AvailabilityFilterProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-shop-800">Availability</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="in-stock" className="text-sm text-gray-600">Show In Stock</Label>
          <Switch
            id="in-stock"
            checked={showInStock}
            onCheckedChange={onInStockChange}
            className="data-[state=checked]:bg-[#C6A961]"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="pre-order" className="text-sm text-gray-600">Show Pre-Order</Label>
          <Switch
            id="pre-order"
            checked={showPreOrder}
            onCheckedChange={onPreOrderChange}
            className="data-[state=checked]:bg-[#C6A961]"
          />
        </div>
      </div>
    </div>
  );
}
