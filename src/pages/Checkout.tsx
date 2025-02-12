
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ShippingForm, type ShippingInfo } from "@/components/checkout/ShippingForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import type { PaymentInfo } from "@/components/checkout/payment/types";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { PageLayout } from "@/components/layout/PageLayout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [currentStep, setCurrentStep] = useState<"shipping" | "payment" | "confirmation">("shipping");

  const handleCheckout = async (shippingInfo: ShippingInfo, paymentInfo: PaymentInfo) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (items.length === 0) {
        throw new Error("Your cart is empty");
      }

      const productDetails = await Promise.all(
        items.map(async (item) => {
          const { data } = await supabase
            .from('products')
            .select('*, user_id')
            .eq('id', item.product_id)
            .single();
          return data;
        })
      );

      const itemsBySeller = items.reduce((acc, item, index) => {
        const product = productDetails[index];
        if (!product) return acc;
        
        const sellerId = product.user_id;
        if (!acc[sellerId]) {
          acc[sellerId] = [];
        }
        acc[sellerId].push({ ...item, product });
        return acc;
      }, {} as Record<string, Array<typeof items[0] & { product: Tables<"products"> }>>);

      for (const [sellerId, sellerItems] of Object.entries(itemsBySeller)) {
        const sellerTotal = sellerItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            seller_id: sellerId,
            buyer_id: user?.id,
            product_id: sellerItems[0].product.id,
            guest_info: isGuest ? {
              email: shippingInfo.email,
              name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            } : null,
            shipping_address: {
              ...shippingInfo,
              country: "United States",
            },
            total_amount: sellerTotal,
            status: 'pending',
            payment_method: 'credit_card',
            payment_status: 'completed',
            payment_method_details: {
              last4: paymentInfo.last4,
              brand: paymentInfo.brand,
            },
            shipping_method: 'standard',
          })
          .select()
          .single();

        if (orderError) throw orderError;

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(
            sellerItems.map(item => ({
              order_id: order.id,
              product_id: item.product.id,
              quantity: item.quantity,
              price_at_time: item.product.price,
            }))
          );

        if (itemsError) throw itemsError;
      }

      toast.success("Order placed successfully!");
      clearCart();
      navigate("/order-confirmation");
    } catch (error: any) {
      console.error('Checkout error:', error);
      setError(error.message || "Failed to process order");
      toast.error(error.message || "Failed to process order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout className="bg-[#FDFEFE]">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <CheckoutProgress currentStep={currentStep} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            {currentStep === "shipping" && (
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-display font-semibold text-shop-800 mb-6">
                  Shipping Information
                </h2>
                <ShippingForm
                  isGuest={isGuest}
                  onSubmit={(info) => {
                    setShippingInfo(info);
                    setCurrentStep("payment");
                  }}
                />
              </div>
            )}
            
            {currentStep === "payment" && shippingInfo && (
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-display font-semibold text-shop-800 mb-6">
                  Payment Information
                </h2>
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    isLoading={isLoading}
                    onSubmit={handleCheckout}
                    shippingInfo={shippingInfo}
                    amount={total}
                  />
                </Elements>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <OrderSummary items={items} total={total} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
