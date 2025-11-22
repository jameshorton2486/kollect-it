"use client";

import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/image";
import { formatUSD } from "@/lib/currency";
import { useEffect, useState } from "react";
import { AesopSection } from "@/components/AesopSection";

interface SuggestionProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  images: { url: string }[];
  category: { name: string };
}

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    tax,
    total,
    clearCart,
  } = useCart();
  const [suggestions, setSuggestions] = useState<SuggestionProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/products?featured=true&limit=6", {
          cache: "no-store",
        });
        let data: SuggestionProduct[] = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          const res2 = await fetch("/api/products?limit=6", {
            cache: "no-store",
          });
          data = await res2.json();
        }
        if (!cancelled) setSuggestions(data);
      } catch {
        // ignore
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (itemCount === 0) {
    return (
      <>
        <AesopSection variant="cream">
          <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-6 h-24 w-24 text-ink">
                <svg
                  width="96"
                  height="96"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mx-auto"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h1 className="font-serif text-4xl text-ink mb-3">
                Your Cart is Empty
              </h1>
              <p className="text-ink-light mb-8 text-lg">
                Explore our curated collection of authenticated antiques and
                collectibles to get started.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-gold text-white font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                Browse Collection
              </Link>
            </div>
          </div>
        </AesopSection>

        {/* FEATURED ITEMS SECTION */}
        {suggestions.length > 0 && (
          <AesopSection variant="sand">
            <h2 className="font-serif text-3xl md:text-4xl text-ink text-center mb-12">
              Start with These Curated Pieces
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {suggestions.slice(0, 6).map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="group"
                >
                  <div className="h-64 w-full overflow-hidden rounded-lg bg-surface-2 mb-4 relative">
                    {p.images[0] ? (
                      <Image
                        src={p.images[0].url}
                        alt={p.title}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        quality={85}
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                      />
                    ) : (
                      <div className="h-full w-full bg-surface-2" />
                    )}
                    <div className="absolute top-4 right-4 bg-gold text-white px-3 py-1 rounded text-sm font-semibold">
                      New
                    </div>
                  </div>
                  <h3 className="font-serif text-lg text-ink mb-2 group-hover:text-gold transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-gold font-semibold text-lg">
                    {formatUSD(p.price)}
                  </p>
                  <p className="text-ink-light text-sm">{p.category?.name}</p>
                </Link>
              ))}
            </div>
          </AesopSection>
        )}
      </>
    );
  }

  return (
    <>
      {/* HEADER */}
      <AesopSection variant="cream">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] tracking-[0.2em] text-[hsl(var(--gold-500))] uppercase mb-2 font-normal">
              SHOPPING CART
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-ink">
              {itemCount} {itemCount === 1 ? "Item" : "Items"}
            </h1>
          </div>
          <Link
            href="/shop"
            className="text-gold font-semibold hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </AesopSection>

      <AesopSection variant="sand">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* CART ITEMS */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 pb-6 border-b border-surface-2"
                >
                  {/* Product Image */}
                  <Link
                    href={`/product/${item.slug}`}
                    className="flex-shrink-0 h-32 w-32 rounded-lg overflow-hidden bg-surface-2"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-1">
                          {item.categoryName}
                        </p>
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-serif text-lg md:text-xl text-ink hover:text-gold transition-colors block mb-2"
                        >
                          {item.title}
                        </Link>
                        <p className="text-gold font-semibold text-lg">
                          {formatUSD(item.price)}
                        </p>
                      </div>
                      <p className="font-semibold text-ink text-lg whitespace-nowrap">
                        {formatUSD(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-surface-2 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          aria-label="Decrease quantity"
                          className="px-4 py-2 hover:bg-surface-1 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="px-4 py-2 hover:bg-surface-1 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-ink-light hover:text-red-500 transition-colors text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Estimated Delivery */}
                    <p className="text-xs text-ink-light mt-3">
                      ✓ Estimated delivery: 3-5 business days
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="mt-6 text-ink-light hover:text-red-500 transition-colors text-sm font-medium"
            >
              Clear entire cart
            </button>
          </div>

          {/* CART SUMMARY */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Order Summary */}
              <div className="bg-surface-1 rounded-lg p-8">
                <h2 className="font-serif text-2xl text-ink mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-surface-2">
                  <div className="flex justify-between text-ink-light">
                    <span>
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}
                      )
                    </span>
                    <span className="font-medium">{formatUSD(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-ink-light">
                    <span>Shipping</span>
                    <span className="text-sm">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-ink-light">
                    <span>Tax (estimated)</span>
                    <span className="font-medium">{formatUSD(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-lg text-ink">Total</span>
                  <span className="font-serif text-2xl text-gold">
                    {formatUSD(total)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-gold text-white font-semibold py-4 text-center rounded-lg hover:opacity-90 transition-opacity mb-3"
                >
                  Proceed to Checkout
                </Link>

                <button
                  onClick={() => (window.location.href = "/shop")}
                  className="w-full border-2 border-gold text-gold font-semibold py-3 rounded-lg hover:bg-gold hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust Badges */}
              <div className="bg-surface-0 rounded-lg p-6 space-y-3">
                <div className="flex gap-3 text-sm">
                  <span className="text-lg">✓</span>
                  <p>
                    <strong>Secure Checkout</strong>
                    <br />
                    <span className="text-ink-light text-xs">
                      SSL encrypted
                    </span>
                  </p>
                </div>
                <div className="flex gap-3 text-sm border-t border-surface-2 pt-3">
                  <span className="text-lg">✓</span>
                  <p>
                    <strong>30-Day Returns</strong>
                    <br />
                    <span className="text-ink-light text-xs">
                      Easy returns policy
                    </span>
                  </p>
                </div>
                <div className="flex gap-3 text-sm border-t border-surface-2 pt-3">
                  <span className="text-lg">✓</span>
                  <p>
                    <strong>Insured Shipping</strong>
                    <br />
                    <span className="text-ink-light text-xs">
                      Full protection included
                    </span>
                  </p>
                </div>
              </div>

              {/* Promo Code */}
              <div className="bg-surface-0 rounded-lg p-6">
                <label className="block text-sm font-semibold text-ink mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-grow px-3 py-2 border border-surface-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold"
                  />
                  <button className="px-4 py-2 border border-surface-2 rounded-lg hover:bg-surface-1 transition-colors font-medium text-sm">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AesopSection>

      {/* RECOMMENDED ITEMS */}
      {suggestions.length > 0 && (
        <AesopSection variant="olive">
          <h2 className="font-serif text-3xl md:text-4xl text-ink text-center mb-12">
            Complete Your Collection
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {suggestions.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group">
                <div className="h-64 w-full overflow-hidden rounded-lg bg-surface-2 mb-4 relative">
                  {p.images[0] ? (
                    <Image
                      src={p.images[0].url}
                      alt={p.title}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      quality={85}
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  ) : (
                    <div className="h-full w-full bg-surface-2" />
                  )}
                </div>
                <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-1">
                  {p.category?.name}
                </p>
                <h3 className="font-serif text-lg text-ink mb-2 group-hover:text-gold transition-colors line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-gold font-semibold text-lg">
                  {formatUSD(p.price)}
                </p>
              </Link>
            ))}
          </div>
        </AesopSection>
      )}
    </>
  );
}

