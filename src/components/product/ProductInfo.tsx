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
    <div className="product-info">
      {/* Eyebrow: Collector's Premium Badge */}
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold/10 to-gold/5 px-3 py-1">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-gold"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-gold">
          Authenticated Collector's Item
        </span>
      </div>

      {/* Category Badge */}
      <div className="product-info-category uppercase text-[12px] tracking-wide text-gold">
        {product.category.name}
      </div>

      {/* Condition Badge */}
      {product.condition && (
        <div
          className="mt-2 inline-flex items-center rounded-full border border-gold px-3 py-1 text-[12px] font-medium text-gold"
          aria-label={`Condition: ${product.condition}`}
        >
          ✓ {product.condition}
        </div>
      )}

      {/* Title */}
      <h1 className="product-info-title ki-heading font-serif text-ink leading-tight text-4xl mt-3">
        {product.title}
      </h1>

      {/* Meta: SKU · Condition · Authentication */}
      <p className="mt-2 text-sm text-ink-secondary">
        <span className="inline-flex items-center gap-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-green-600"
            aria-hidden="true"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          Verified & Authenticated
        </span>
        {" · "}SKU: {sku}
        {product.condition ? ` · Condition: ${product.condition}` : ""}
      </p>

      {/* Premium Pricing Section */}
      <div className="mt-6 rounded-lg border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-4">
        <p className="text-xs uppercase tracking-wider text-gold font-semibold mb-2">
          Collector's Price
        </p>
        <div className="flex items-baseline gap-3">
          <div className="text-4xl font-serif font-bold text-ink">
            {formatUSD0(product.price)}
          </div>
          <div className="text-sm text-ink-secondary">
            <p>• Authenticated piece</p>
            <p>• Professionally curated</p>
            <p>• 30-day guarantee included</p>
          </div>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="product-qty my-6 flex items-center gap-4">
        <label
          htmlFor="quantity"
          className="text-sm font-medium text-ink"
        >
          Quantity
        </label>
        <div className="inline-flex items-center rounded border border-gold/30 bg-white">
          <button
            type="button"
            className="px-3 py-2 select-none text-ink hover:bg-gold/10 transition-colors"
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
            className="w-16 text-center py-2 outline-none font-medium border-l border-r border-gold/30"
            aria-label="Quantity"
          />
          <button
            type="button"
            className="px-3 py-2 select-none text-ink hover:bg-gold/10 transition-colors"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Professional Details Grid */}
      <div className="product-info-details mt-6 rounded-lg border border-ink-tertiary/10 bg-gradient-to-br from-parchment to-white p-5">
        <p className="text-xs uppercase tracking-wider text-gold font-semibold mb-4">
          Item Specifications
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {product.artist && (
            <div className="product-detail-item">
              <span className="product-detail-label block text-xs uppercase tracking-wide text-ink-secondary font-medium mb-1">
                Artist/Maker
              </span>
              <span className="product-detail-value block text-base font-medium text-ink">
                {product.artist}
              </span>
            </div>
          )}
          {product.year && (
            <div className="product-detail-item">
              <span className="product-detail-label block text-xs uppercase tracking-wide text-ink-secondary font-medium mb-1">
                Year Created
              </span>
              <span className="product-detail-value block text-base font-medium text-ink">
                {product.year}
              </span>
            </div>
          )}
          {product.medium && (
            <div className="product-detail-item">
              <span className="product-detail-label block text-xs uppercase tracking-wide text-ink-secondary font-medium mb-1">
                Medium
              </span>
              <span className="product-detail-value block text-base font-medium text-ink">
                {product.medium}
              </span>
            </div>
          )}
          {product.period && (
            <div className="product-detail-item">
              <span className="product-detail-label block text-xs uppercase tracking-wide text-ink-secondary font-medium mb-1">
                Period
              </span>
              <span className="product-detail-value block text-base font-medium text-ink">
                {product.period}
              </span>
            </div>
          )}
          {product.condition && (
            <div className="product-detail-item">
              <span className="product-detail-label block text-xs uppercase tracking-wide text-ink-secondary font-medium mb-1">
                Condition
              </span>
              <span className="product-detail-value flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-base font-medium text-ink">
                  {product.condition}
                </span>
              </span>
            </div>
          )}
          <div className="product-detail-item">
            <span className="product-detail-label block text-xs uppercase tracking-wide text-ink-secondary font-medium mb-1">
              SKU
            </span>
            <span className="product-detail-value block text-base font-medium text-ink font-mono">
              {sku}
            </span>
          </div>
          <div className="product-detail-item">
            <span className="product-detail-label block text-xs uppercase tracking-wide text-ink-secondary font-medium mb-1">
              Provenance
            </span>
            <span className="product-detail-value flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-green-600"
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="text-base font-medium text-ink">
                Authenticated & Verified
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="product-info-actions mt-6 flex flex-col gap-3 sm:flex-row sm:gap-2">
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
          className="ki-btn-primary flex-grow sm:flex-grow-0"
        />

        <button
          className={`btn-wishlist ${isWishlisted ? "active" : ""} inline-flex items-center justify-center gap-2 rounded border border-gold px-4 py-3 font-medium text-gold transition-all hover:bg-cta hover:text-white hover:border-cta`}
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
            focusable="false"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{isWishlisted ? "Saved" : "Save"}</span>
        </button>

        <button
          className="btn-share inline-flex items-center justify-center gap-2 rounded border border-ink-tertiary px-4 py-3 font-medium text-ink-secondary transition-all hover:bg-ink-tertiary hover:text-white"
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
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>Share</span>
        </button>
      </div>

      {/* Comprehensive Trust & Guarantee Section */}
      <div className="mt-6 rounded-lg border border-gold/20 bg-gold/5 p-4">
        <p className="text-xs uppercase tracking-wider text-gold font-semibold mb-3">
          Collector's Guarantee & Protection
        </p>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mt-0.5 flex-shrink-0 text-green-600"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <div>
              <p className="font-medium text-ink text-sm">
                Authenticity Guaranteed
              </p>
              <p className="text-xs text-ink-secondary">
                Every item is professionally authenticated and verified
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mt-0.5 flex-shrink-0 text-green-600"
              aria-hidden="true"
            >
              <path d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
            <div>
              <p className="font-medium text-ink text-sm">
                30-Day Returns
              </p>
              <p className="text-xs text-ink-secondary">
                Full refund if not completely satisfied
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mt-0.5 flex-shrink-0 text-green-600"
              aria-hidden="true"
            >
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
            </svg>
            <div>
              <p className="font-medium text-ink text-sm">
                Secure Checkout
              </p>
              <p className="text-xs text-ink-secondary">
                Industry-standard encryption & fraud protection
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mt-0.5 flex-shrink-0 text-green-600"
              aria-hidden="true"
            >
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <div>
              <p className="font-medium text-ink text-sm">
                Free Insured Shipping
              </p>
              <p className="text-xs text-ink-secondary">
                Includes insurance & tracking for full peace of mind
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mt-0.5 flex-shrink-0 text-green-600"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <div>
              <p className="font-medium text-ink text-sm">
                Expert Support
              </p>
              <p className="text-xs text-ink-secondary">
                Direct access to curators & authentication experts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

