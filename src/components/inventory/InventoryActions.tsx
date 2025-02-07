
import { Button } from "@/components/ui/button";

interface InventoryActionsProps {
  selectedProducts: string[];
  onBulkUpdate: (action: 'increment' | 'decrement') => void;
}

export function InventoryActions({ selectedProducts, onBulkUpdate }: InventoryActionsProps) {
  if (selectedProducts.length === 0) return null;

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => onBulkUpdate('increment')}>
        Increase Stock (+1)
      </Button>
      <Button variant="outline" onClick={() => onBulkUpdate('decrement')}>
        Decrease Stock (-1)
      </Button>
    </div>
  );
}
