import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
}

export interface CartContextType {
  items: CartItem[];
  total: number;
  isLoading: boolean;
  addItem: (productId: string) => Promise<void>;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addItem = useCallback(async (productId: string) => {
    setIsLoading(true);
    try {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, price, image_url')
        .eq('id', productId)
        .single();

      if (productError) throw productError;

      const existingItem = items.find(item => item.product_id === productId);
      if (existingItem) {
        updateQuantity(existingItem.id, existingItem.quantity + 1);
      } else {
        const newItem: CartItem = {
          id: crypto.randomUUID(),
          product_id: productId,
          quantity: 1,
          product
        };
        setItems(prev => [...prev, newItem]);
      }
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart"
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [items]);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );

  return (
    <CartContext.Provider value={{
      items,
      total,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}