"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    images: { url: string }[];
    category: { name: string };
  };
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist");
      if (!response.ok) throw new Error("Failed to fetch wishlist");

      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to get wishlist status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete from wishlist.");

      setItems((prevItems) =>
        prevItems.filter((item) => item.product.id !== productId)
      );
    } catch (error) {
      console.error("Failed to remove product from wishlist.", error);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) throw new Error("Failed to add product to the cart.");

      alert("Added to cart successfully!");
    } catch (error) {
      console.error("Failed to add to shopping cart.", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-[60vh] bg-lux-pearl">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-lux-gold border-t-transparent"></div>
            <p className="text-ink-600">Loading your wishlist...</p>
          </div>
        </div>
      </main>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] bg-lux-pearl">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="text-center max-w-md mx-auto">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-100">
              <Heart className="h-10 w-10 text-lux-gold" />
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Your Wishlist is Empty
            </h1>
            <p className="mt-4 text-base text-ink-600">
              Start adding items to your wishlist to keep track of your favorite pieces.
            </p>
            <div className="mt-8">
              <Link
                href="/browse"
                className="inline-flex items-center justify-center rounded-full bg-lux-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lux-black shadow-sm transition-all hover:bg-lux-gold-light"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Wishlist with items
  return (
    <main className="min-h-screen bg-lux-pearl">
      {/* Header */}
      <section className="border-b border-border-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-lux-gold">
                Saved Items
              </p>
              <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                My Wishlist
              </h1>
            </div>
            <p className="text-sm text-ink-700">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </section>

      {/* Wishlist Grid */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl border border-border-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                href={`/product/${item.product.slug}`}
                className="relative aspect-square bg-surface-100 block overflow-hidden"
              >
                <Image
                  src={item.product.images[0]?.url || "/placeholder.svg"}
                  alt={item.product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="p-4">
                <Link href={`/product/${item.product.slug}`}>
                  <h3 className="font-medium text-ink-900 line-clamp-2 hover:text-lux-gold transition-colors">
                    {item.product.title}
                  </h3>
                </Link>

                <p className="mt-1 text-sm text-ink-700">
                  {item.product.category?.name || "Uncategorized"}
                </p>

                <p className="mt-2 text-lg font-semibold text-lux-gold">
                  ${item.product.price.toFixed(2)}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => addToCart(item.product.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-lux-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-lux-black hover:bg-lux-gold-light transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.product.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
