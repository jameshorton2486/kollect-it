"use client";

import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
    slug: string;
    image: string;
    categoryName: string;
  };
  variant?: "primary" | "secondary" | "card";
  className?: string;
  quantity?: number; // Optional quantity to add (defaults to 1)
}

export default function AddToCartButton({
  product,
  variant = "primary",
  className = "",
  quantity = 1,
}: AddToCartButtonProps) {
  const { addItem, items, updateQuantity } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a link
    e.stopPropagation(); // Stop event bubbling

    const qty =
      Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;

    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      // Increase existing quantity by qty
      updateQuantity(product.id, existing.quantity + qty);
    } else {
      // Add once, then set to desired qty if > 1
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        slug: product.slug,
        categoryName: product.categoryName,
      });
      if (qty > 1) {
        // After initial add (quantity 1 by default), set to qty
        updateQuantity(product.id, qty);
      }
    }

    // Show "Added!" feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const buttonVariant = variant === "primary" ? "default" : "secondary";
  const size = variant === "card" ? "sm" : "default";

  return (
    <Button
      onClick={handleAddToCart}
      variant={buttonVariant}
      size={size}
      className={`${className} ${added ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
    >
      {added ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          {variant === "card" ? "Added" : "Added to Cart"}
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}

