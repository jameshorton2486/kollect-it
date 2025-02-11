
import { Footer } from "@/components/home/Footer";
import { Cart } from "@/components/cart/Cart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowRight, CreditCard, Truck } from "lucide-react";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";

export default function ShoppingCartPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFEFE]">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <CheckoutProgress currentStep="cart" />
        </div>
      </div>

      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-display font-bold text-shop-800 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-shop-600" />
            Shopping Cart
          </h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Cart />
          
          <div className="mt-12 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => navigate("/products")}
              className="text-shop-700 border-shop-200 hover:bg-shop-50 hover:text-shop-800
                       font-medium px-6 py-3"
            >
              Continue Shopping
            </Button>
            
            <Button
              onClick={() => navigate("/checkout")}
              className="bg-[#C6A961] hover:bg-[#B59851] text-white font-bold px-8 py-3
                       transition-all duration-200 gap-2 group"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="p-3 bg-shop-50 rounded-full">
                <Truck className="h-6 w-6 text-shop-600" />
              </div>
              <div>
                <h3 className="font-medium text-shop-800">Free Shipping</h3>
                <p className="text-sm text-shop-600">On orders over $100</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="p-3 bg-shop-50 rounded-full">
                <CreditCard className="h-6 w-6 text-shop-600" />
              </div>
              <div>
                <h3 className="font-medium text-shop-800">Secure Payment</h3>
                <p className="text-sm text-shop-600">SSL encrypted checkout</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="p-3 bg-shop-50 rounded-full">
                <ShoppingCart className="h-6 w-6 text-shop-600" />
              </div>
              <div>
                <h3 className="font-medium text-shop-800">Easy Returns</h3>
                <p className="text-sm text-shop-600">30 day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
