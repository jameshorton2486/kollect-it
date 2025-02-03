import { Footer } from "@/components/home/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Package, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GuestInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
}

export default function Checkout() {
  const { items, total } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isGuest, setIsGuest] = useState(true);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // If user is logged in, use their ID, otherwise create a guest order
      const { data: { user } } = await supabase.auth.getUser();
      
      if (items.length === 0) {
        toast({
          title: "Cart is empty",
          description: "Please add items to your cart before checking out.",
          variant: "destructive"
        });
        return;
      }

      // Process order (you'll need to implement the actual order processing logic)
      // For guest users, we'll store their information with the order
      const orderData = {
        buyer_id: user?.id || null,
        guest_info: !user ? guestInfo : null,
        items: items,
        total_amount: total,
        status: 'pending'
      };

      // Here you would typically:
      // 1. Process payment
      // 2. Create order in database
      // 3. Clear cart
      // 4. Redirect to confirmation

      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      navigate("/order-confirmation");
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error processing order",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={guestInfo.email}
                      onChange={handleGuestInfoChange}
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName"
                      name="firstName"
                      value={guestInfo.firstName}
                      onChange={handleGuestInfoChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      name="lastName"
                      value={guestInfo.lastName}
                      onChange={handleGuestInfoChange}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address"
                      name="address"
                      value={guestInfo.address}
                      onChange={handleGuestInfoChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      name="city"
                      value={guestInfo.city}
                      onChange={handleGuestInfoChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input 
                      id="postalCode"
                      name="postalCode"
                      value={guestInfo.postalCode}
                      onChange={handleGuestInfoChange}
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Payment Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" placeholder="MM/YY" required />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" required />
                    </div>
                  </div>
                </div>
              </section>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : `Pay ${formatPrice(total)}`}
              </Button>
            </form>
          </div>

          <div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.product.name} (x{item.quantity})</span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
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
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="h-4 w-4" />
                  <span>Secure payment processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}