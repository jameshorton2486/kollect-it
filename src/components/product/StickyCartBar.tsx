"use client";

import { useState } from "react";
import { formatUSD0 } from "@/lib/currency";
import { useCart } from "@/contexts/CartContext";
import { Check, ShoppingCart } from "lucide-react";

interface StickyProduct {
  id: string;
  title: string;
  price: number;
  slug: string;
  image: string;
  categoryName: string;
}

interface StickyCartBarProps {
  product: StickyProduct;
}

export default function StickyCartBar({ product }: StickyCartBarProps) {
  const { addItem, items, updateQuantity } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const existing = items.find((item) => item.id === product.id);
    if (existing) {
      updateQuantity(product.id, existing.quantity + 1);
    } else {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        slug: product.slug,
        image: product.image,
        categoryName: product.categoryName,
      });
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="sticky-cart-bar">
      <div className="sticky-cart-content">
        <div className="sticky-cart-info">
          <p className="sticky-cart-price text-gold font-semibold">
            {formatUSD0(product.price)}
          </p>
          <p className="text-xs text-ink-secondary">{product.title}</p>
        </div>
        <button
          className={`sticky-cart-button btn-cta inline-flex items-center justify-center gap-2 ${
            added ? "bg-green-600 text-white hover:bg-green-700" : ""
          }`}
          onClick={handleAddToCart}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

