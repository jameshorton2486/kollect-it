import { formatPrice } from "@/lib/utils";
import { Package, Truck } from "lucide-react";

interface OrderSummaryProps {
  items: {
    id: string;
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = 0; // Free shipping for now
  const tax = total * 0.1; // 10% tax

  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-4 divide-y">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between pt-4 first:pt-0">
            <span className="flex-1">
              {item.product.name} (x{item.quantity})
            </span>
            <span className="font-medium">
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="h-4 w-4" />
          <span>Free shipping on orders over $100</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Truck className="h-4 w-4" />
          <span>Estimated delivery: 3-5 business days</span>
        </div>
      </div>
    </div>
  );
}