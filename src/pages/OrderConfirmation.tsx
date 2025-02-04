import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Check, Package, Printer, Receipt, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { OrderDetails } from "@/types/order";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as OrderDetails;

  if (!order) {
    navigate("/");
    return null;
  }

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <PageLayout showBackButton>
      <div className="max-w-4xl mx-auto">
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

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column - Order Details & Tracking */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Order Status</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-shop-600" />
                  <span>Order Processing</span>
                </div>
                {order.tracking_number && (
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-shop-600" />
                    <div>
                      <p>Tracking Number: {order.tracking_number}</p>
                      <p className="text-sm text-gray-500">
                        Carrier: {order.tracking_carrier}
                      </p>
                      {order.estimated_delivery_date && (
                        <p className="text-sm text-gray-500">
                          Estimated Delivery:{" "}
                          {new Date(order.estimated_delivery_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="space-y-2">
                <p>
                  {order.shipping_address.firstName} {order.shipping_address.lastName}
                </p>
                <p>{order.shipping_address.address}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{" "}
                  {order.shipping_address.postalCode}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <OrderSummary
              items={order.order_items.map((item) => ({
                id: item.id,
                product: {
                  name: item.product.name,
                  price: Number(item.product.price)
                },
                quantity: item.quantity
              }))}
              total={Number(order.total_amount)}
            />

            {/* Print Receipt Button */}
            <Button
              onClick={handlePrintReceipt}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
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
    </PageLayout>
  );
}