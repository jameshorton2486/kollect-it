import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "./CartItem";
import { formatPrice } from "@/lib/utils";

export function Cart() {
  const { items, isLoading, total } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="default" 
          size="lg" 
          className="relative bg-shop-accent1 hover:bg-shop-accent1/90 text-white px-6 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          <span className="mr-1">Cart</span>
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-shop-accent2 text-sm text-white flex items-center justify-center font-semibold animate-fadeIn">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-shop-800 dark:text-shop-100">
            Shopping Cart
          </SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shop-accent1" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-shop-500">
            <ShoppingCart className="h-12 w-12 mb-4" />
            <p className="text-shop-600 dark:text-shop-400">Your cart is empty</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <div className="border-t border-shop-200 dark:border-shop-700 pt-4 mt-4">
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-shop-800 dark:text-shop-200">Total</span>
                <span className="font-semibold text-shop-800 dark:text-shop-200">{formatPrice(total)}</span>
              </div>
              <Button className="w-full btn-primary">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}