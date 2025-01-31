import { Footer } from "@/components/home/Footer";
import { Cart } from "@/components/cart/Cart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";

export default function ShoppingCartPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Shopping Cart
          </h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Cart />
          
          <div className="mt-8 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
            
            <Button
              onClick={() => navigate("/checkout")}
              className="gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}