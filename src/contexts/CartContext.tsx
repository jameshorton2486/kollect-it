import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Tables<"products">;
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  isLoading: boolean;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadCartItems = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      const { data: cartItems, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          product:products(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading cart items:", error);
        throw error;
      }

      setItems(cartItems as CartItem[]);
    } catch (error) {
      console.error("Error loading cart items:", error);
      toast({
        title: "Error loading cart",
        description: "Failed to load your cart items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCartItems();

    const channel = supabase
      .channel("cart_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
        },
        () => {
          loadCartItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addItem = async (productId: string, quantity: number = 1) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add items to your cart.",
          variant: "destructive",
        });
        return;
      }

      const existingItem = items.find((item) => item.product_id === productId);

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        const { error } = await supabase.from("cart_items").insert({
          product_id: productId,
          quantity,
          user_id: session.session.user.id,
        });

        if (error) throw error;
      }

      toast({
        title: "Item added to cart",
        description: "The item has been added to your cart successfully.",
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Error adding item",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast({
        title: "Error removing item",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Quantity updated",
        description: "The item quantity has been updated.",
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error updating quantity",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.quantity * (item.product?.price || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, isLoading, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
