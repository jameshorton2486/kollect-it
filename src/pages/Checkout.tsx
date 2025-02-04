import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ShippingForm, type ShippingInfo } from "@/components/checkout/ShippingForm";
import { PaymentForm, type PaymentInfo } from "@/components/checkout/PaymentForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PageLayout } from "@/components/layout/PageLayout";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  const handleCheckout = async (shippingInfo: ShippingInfo, paymentInfo: PaymentInfo) => {
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (items.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      // Group items by seller
      const itemsBySeller = items.reduce((acc, item) => {
        const sellerId = item.product.user_id;
        if (!acc[sellerId]) {
          acc[sellerId] = [];
        }
        acc[sellerId].push(item);
        return acc;
      }, {} as Record<string, typeof items>);

      // Create an order for each seller
      for (const [sellerId, sellerItems] of Object.entries(itemsBySeller)) {
        const sellerTotal = sellerItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            seller_id: sellerId,
            buyer_id: user?.id,
            guest_info: isGuest ? {
              email: shippingInfo.email,
              name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            } : null,
            shipping_address: {
              ...shippingInfo,
              country: "United States", // Default for now
            },
            total_amount: sellerTotal,
            status: 'pending',
            payment_method: 'credit_card', // Simplified for now
            shipping_method: 'standard',
          });

        if (orderError) {
          throw new Error(orderError.message);
        }
      }

      toast.success("Order placed successfully!");
      clearCart();
      navigate("/order-confirmation");
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || "Failed to process order");
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbs = [
    { label: "Cart", href: "/cart" },
    { label: "Checkout" },
  ];

  return (
    <PageLayout 
      showBackButton 
      breadcrumbs={breadcrumbs}
      className="bg-background min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <ShippingForm
              isGuest={isGuest}
              onSubmit={(shippingInfo) => {
                // Handle shipping info submission
                console.log('Shipping info:', shippingInfo);
              }}
            />
            
            <PaymentForm
              onSubmit={(paymentInfo) => {
                // Handle payment info submission
                console.log('Payment info:', paymentInfo);
              }}
            />

            <Button
              onClick={() => handleCheckout}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Place Order"}
            </Button>
          </div>

          <div>
            <OrderSummary items={items} total={total} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
