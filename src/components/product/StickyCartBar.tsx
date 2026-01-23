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
        categoryName: product.CategoryName,
      });
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-surface-800/95 px-4 py-4 text-white shadow-[0_-10px_30px_rgba(0,0,0,0.4)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-300">
            {product.CategoryName}
          </p>
          <p className="text-sm font-medium text-white line-clamp-1">
            {product.title}
          </p>
          <p className="text-lg font-semibold text-gold-300">
            {formatUSD0(product.price)}
          </p>
        </div>
        <button
          className={`inline-flex min-w-[160px] items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
            added
              ? "bg-lux-gold text-lux-black"
              : "bg-lux-black text-lux-cream hover:bg-lux-charcoal"
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

