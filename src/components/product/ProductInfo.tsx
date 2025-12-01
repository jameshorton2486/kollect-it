"use client";

import { useState, useEffect } from "react";
import AddToCartButton from "../AddToCartButton";
import { formatUSD0 } from "@/lib/currency";
import { useWishlist } from "@/contexts/WishlistContext";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  condition: string | null;
  year: string | null;
  artist: string | null;
  medium: string | null;
  period: string | null;
  category: { name: string };
  images: { url: string }[];
}

interface ProductInfoProps {
  product: Product;
  sku: string;
}

export default function ProductInfo({ product, sku }: ProductInfoProps) {
  const {
    isInWishlist,
    toggleWishlist,
    loading: wishlistLoading,
  } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  const handleWishlist = async () => {
    await toggleWishlist(product.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on Kollect-It`,
          url: window.location.href,
        });
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.log("Share cancelled");
        }
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };
  return (
    <div className="space-y-8 rounded-3xl border border-border-200 bg-white/95 p-6 shadow-xl shadow-black/5 lg:p-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-300">
          Collector Release
        </p>
        <div className="flex flex-wrap items-center gap-3 text-[0.75rem] uppercase tracking-[0.35em] text-ink-400">
          <span>{product.category.name}</span>
          {product.condition && (
            <span className="inline-flex items-center gap-2 text-ink-400">
              <span className="h-1 w-1 rounded-full bg-lux-gold" />
              {product.condition}
            </span>
          )}
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink-900">
          {product.title}
        </h1>
        <p className="text-sm text-ink-500">
          SKU {sku} · Authenticated & catalogued by Kollect-It curators
        </p>
      </div>

      <div className="rounded-2xl border border-border-200 bg-surface-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400">
          Collector&apos;s Price
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <span className="text-3xl font-semibold text-gold-500">
            {formatUSD0(product.price)}
          </span>
          <span className="text-sm text-ink-500">
            Includes authentication, insured shipping & concierge service
          </span>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border-200 bg-white/90 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink-800">Quantity</span>
          <div className="inline-flex items-center rounded-full border border-border-200 bg-white">
            <button
              type="button"
              className="px-4 py-2 text-lg text-ink-600 hover:text-ink-900"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (Number.isNaN(val)) return;
                setQuantity(Math.min(99, Math.max(1, val)));
              }}
              className="w-16 border-x border-border-200 bg-transparent py-2 text-center font-medium text-ink-900"
              aria-label="Quantity"
            />
            <button
              type="button"
              className="px-4 py-2 text-lg text-ink-600 hover:text-ink-900"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <AddToCartButton
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              slug: product.slug,
              image: product.images[0]?.url || "/placeholder.jpg",
              categoryName: product.category.name,
            }}
            quantity={quantity}
            className="w-full sm:flex-1"
          />

          <button
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-lux-gold px-4 py-3 text-sm font-medium text-lux-gold transition-all hover:bg-lux-gold hover:text-lux-black ${isWishlisted ? "bg-lux-gold/10" : ""}`}
            onClick={handleWishlist}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            disabled={wishlistLoading}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{isWishlisted ? "Saved" : "Save"}</span>
          </button>

          <button
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-200 px-4 py-3 text-sm font-medium text-ink-700 transition hover:border-lux-gold hover:text-ink-900"
            onClick={handleShare}
            title="Share this product"
            aria-label="Share this product"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border-200 bg-white/90 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400">
          Item Specifications
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 text-sm text-ink-700 md:grid-cols-2">
          {product.artist && (
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400">
                Artist / Maker
              </p>
              <p className="mt-1 text-base font-medium text-ink-900">
                {product.artist}
              </p>
            </div>
          )}
          {product.year && (
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400">
                Year Created
              </p>
              <p className="mt-1 text-base font-medium text-ink-900">
                {product.year}
              </p>
            </div>
          )}
          {product.medium && (
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400">
                Medium
              </p>
              <p className="mt-1 text-base font-medium text-ink-900">
                {product.medium}
              </p>
            </div>
          )}
          {product.period && (
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400">
                Period
              </p>
              <p className="mt-1 text-base font-medium text-ink-900">
                {product.period}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-400">SKU</p>
            <p className="mt-1 font-mono text-base text-ink-900">{sku}</p>
          </div>
          {product.condition && (
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-400">
                Condition
              </p>
              <p className="mt-1 inline-flex items-center gap-2 text-base text-ink-900">
                <span className="h-1.5 w-1.5 rounded-full bg-lux-gold" />
                {product.condition}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border-200 bg-surface-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400">
          Collector Assurance
        </p>
        <ul className="mt-4 space-y-3 text-sm text-ink-700">
          {[
            "Authenticated by Kollect-It curators",
            "Complimentary insured shipping worldwide",
            "30-day return window with concierge support",
            "Secure checkout & white-glove packaging",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-lux-gold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

