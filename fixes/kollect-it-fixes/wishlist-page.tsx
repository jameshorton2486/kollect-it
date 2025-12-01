"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WishlistItem {
  id: string;
  product: {
    id: string;
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
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await fetch(`/api/wishlist?productId=${productId}`, { method: "DELETE" });
      fetchWishlist();
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      alert("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading wishlist...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-6">
          Save items you love for later!
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground">{items.length} items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden group"
          >
            <Link
              href={`/products/${item.product.id}`}
              className="relative aspect-square bg-muted block"
            >
              <Image
                src={item.product.images[0]?.url || "/placeholder.svg"}
                alt={item.product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </Link>

            <div className="p-4">
              <Link
                href={`/products/${item.product.id}`}
                className="font-semibold hover:text-primary line-clamp-2 mb-2"
              >
                {item.product.title}
              </Link>
              <p className="text-sm text-muted-foreground mb-2">
                {item.product.category.name}
              </p>
              <p className="text-lg font-bold text-primary mb-4">
                ${item.product.price.toFixed(2)}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(item.product.id)}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.product.id)}
                  className="p-2 border rounded text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

