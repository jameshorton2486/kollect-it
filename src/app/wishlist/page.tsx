"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/ui";

interface WishlistItem {
  id: string;
  Product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    Image: { url: string }[];
    Category: { name: string };
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
        prevItems.filter((item) => item.Product.id !== productId)
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
      <main className="min-h-screen bg-lux-pearl">
        <div className="container mx-auto py-20 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-lux-gold border-t-transparent" />
          <p className="mt-4 text-muted">Loading your wishlist...</p>
        </div>
      </main>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-lux-pearl">
        <section className="section-grand">
          <div className="container mx-auto">
            <EmptyState
              icon={Heart}
              title="No Favorites Yet"
              description="Start adding items to your wishlist to keep track of your favorite pieces."
              primaryAction={{ label: "Browse Collection", href: "/browse" }}
            />
          </div>
        </section>
      </main>
    );
  }

  // Wishlist with items
  return (
    <main className="min-h-screen bg-lux-pearl">
      {/* Header */}
      <section className="bg-lux-cream section-normal border-b border-lux-silver-soft">
        <div className="container mx-auto">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-label text-lux-gold mb-2">Saved Items</p>
              <h1 className="heading-page text-lux-black">My Wishlist</h1>
            </div>
            <p className="text-muted">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </section>

      {/* Wishlist Grid */}
      <section className="section-normal">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-luxury">
            {items.map((item) => (
              <div
                key={item.id}
                className="group bg-lux-white rounded-lg border border-lux-silver-soft overflow-hidden shadow-clean hover:shadow-soft transition-shadow"
              >
                <Link
                  href={`/product/${item.Product.slug}`}
                  className="relative aspect-square bg-lux-pearl block overflow-hidden"
                >
                  <Image
                    src={item.Product.Image[0]?.url || "/placeholder.svg"}
                    alt={item.Product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-4">
                  <p className="text-label text-lux-gold">
                    {item.Product.Category?.name || "Featured"}
                  </p>
                  <Link href={`/product/${item.Product.slug}`}>
                    <h3 className="font-serif font-medium text-lux-black line-clamp-2 mt-1 hover:text-lux-gold transition-colors">
                      {item.Product.title}
                    </h3>
                  </Link>

                  <p className="mt-2 text-xl font-semibold text-lux-gold">
                    ${item.Product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => addToCart(item.Product.id)}
                      className="flex-1 btn-primary rounded-full text-xs py-2.5"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1 inline" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.Product.id)}
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
        </div>
      </section>
    </main>
  );
}
