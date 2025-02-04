import { useLocation, useNavigate } from "react-router-dom";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Check, Package, Truck, Receipt } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Thank You for Your Order!</h1>
            <p className="text-gray-600">
              Order #{order.id.slice(0, 8)} has been confirmed
            </p>
          </div>

          {/* Order Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-shop-600" />
                <span>Order Processing</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-shop-600" />
                <span>Estimated Delivery: 3-5 Business Days</span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="text-gray-600">
                  {order.shipping_address.firstName} {order.shipping_address.lastName}<br />
                  {order.shipping_address.address}<br />
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Payment Method</h3>
                <p className="text-gray-600">
                  {order.payment_method}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <Receipt className="h-5 w-5 text-gray-400" />
            </div>
            <div className="divide-y">
              <div className="py-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => navigate("/profile-settings")}
            >
              View Order Status
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}