"use client";

import { useState } from "react";
import {
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductDetailsProps {
  product: {
    id: string;
    title: string;
    price: number;
    condition: string;
    description: string;
    category: { name: string };
    year?: string;
    artist?: string;
    rarity?: string;
    estimatedEra?: string;
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const [quantity] = useState(1); // Removed unused setter
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      if (response.ok) {
        router.push("/cart");
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleWishlist = async () => {
    try {
      const method = isWishlisted ? "DELETE" : "POST";
      await fetch("/api/wishlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.title,
        text: `Check out ${product.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Price */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Key Info */}
      <div className="flex gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Condition:</span>{" "}
          <span className="font-medium">{product.condition}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Category:</span>{" "}
          <span className="font-medium">{product.category.name}</span>
        </div>
        {product.year && (
          <div>
            <span className="text-muted-foreground">Year:</span>{" "}
            <span className="font-medium">{product.year}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>
          <button
            onClick={handleWishlist}
            className={`p-3 border rounded-lg ${
              isWishlisted ? "bg-red-50 border-red-500 text-red-500" : ""
            }`}
          >
            <Heart
              className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>
          <button onClick={handleShare} className="p-3 border rounded-lg">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        <button className="w-full border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/5">
          Buy Now
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <div className="text-sm">
            <div className="font-medium">Free Shipping</div>
            <div className="text-muted-foreground">On orders $50+</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <div className="text-sm">
            <div className="font-medium">Authenticity</div>
            <div className="text-muted-foreground">Guaranteed</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-muted-foreground" />
          <div className="text-sm">
            <div className="font-medium">30-Day Returns</div>
            <div className="text-muted-foreground">Money back</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="pt-4 border-t">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-muted-foreground whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* Specifications */}
      {(product.artist ||
        product.year ||
        product.rarity ||
        product.estimatedEra) && (
        <div className="pt-4 border-t">
          <h2 className="text-xl font-semibold mb-3">Specifications</h2>
          <dl className="grid grid-cols-2 gap-3">
            {product.artist && (
              <>
                <dt className="text-muted-foreground">Artist/Creator</dt>
                <dd className="font-medium">{product.artist}</dd>
              </>
            )}
            {product.year && (
              <>
                <dt className="text-muted-foreground">Year</dt>
                <dd className="font-medium">{product.year}</dd>
              </>
            )}
            {product.estimatedEra && (
              <>
                <dt className="text-muted-foreground">Era</dt>
                <dd className="font-medium">{product.estimatedEra}</dd>
              </>
            )}
            {product.rarity && (
              <>
                <dt className="text-muted-foreground">Rarity</dt>
                <dd className="font-medium">{product.rarity}</dd>
              </>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}

