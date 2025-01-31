import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, Package, Truck } from "lucide-react";

export default function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Order Confirmation</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You for Your Order!</h2>
            <p className="text-gray-600">
              Order #123456 has been confirmed and is being processed.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Package className="h-5 w-5" />
                <span>Processing</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Truck className="h-5 w-5" />
                <span>Estimated Delivery: 3-5 Business Days</span>
              </div>
            </div>
          </div>

          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => navigate("/buyer-dashboard")}
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