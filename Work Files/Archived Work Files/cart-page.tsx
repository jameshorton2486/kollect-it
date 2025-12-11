"use client";

import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/image";
import { formatUSD } from "@/lib/currency";
import { useEffect, useState } from "react";
import { ShoppingCart, Minus, Plus, Trash2, ShieldCheck, Truck, Headphones } from "lucide-react";

interface SuggestionProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  images: { url: string }[];
  category: { name: string };
}

function Recommendations({
  suggestions,
  heading,
}: {
  suggestions: SuggestionProduct[];
  heading: string;
}) {
  if (!suggestions.length) return null;

  return (
    <section className="bg-lux-cream section-normal">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <p className="text-label text-lux-gold mb-2">You might also like</p>
          <h2 className="heading-section text-lux-black">{heading}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-standard">
          {suggestions.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group bg-lux-white rounded-lg border border-lux-silver-soft p-4 shadow-clean hover:shadow-soft transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-lux-pearl">
                {product.images[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    quality={85}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                ) : (
                  <div className="w-full h-full bg-lux-pearl" />
                )}
                <span className="absolute top-3 left-3 px-2 py-1 bg-lux-white/90 text-label text-lux-gold rounded">
                  {product.category?.name || "Featured"}
                </span>
              </div>
              <h3 className="font-serif font-medium text-lux-black line-clamp-2 group-hover:text-lux-gold transition-colors">
                {product.title}
              </h3>
              <p className="mt-2 text-lg font-semibold text-lux-gold">
                {formatUSD(product.price)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
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

  // Empty cart
  if (itemCount === 0) {
    return (
      <main className="min-h-screen bg-lux-pearl">
        <section className="section-grand">
          <div className="container mx-auto text-center max-w-lg">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-lux-cream border border-lux-silver-soft">
              <ShoppingCart className="h-10 w-10 text-lux-gold" />
            </div>
            <p className="text-label text-lux-gold mb-2">Cart</p>
            <h1 className="heading-page text-lux-black">Your cart is empty</h1>
            <p className="lead mt-4">
              Take your time browsing—when you find something you love, it&apos;ll be waiting here for you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/browse" className="btn-primary rounded-full">
                Browse the collection
              </Link>
              <Link href="/categories" className="btn-secondary rounded-full">
                Explore categories
              </Link>
            </div>
          </div>
        </section>

        <Recommendations
          suggestions={suggestions}
          heading="Pieces you might like"
        />
      </main>
    );
  }

  // Cart with items
  return (
    <main className="min-h-screen bg-lux-pearl">
      {/* Header */}
      <section className="bg-lux-cream section-normal border-b border-lux-silver-soft">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-label text-lux-gold mb-2">Shopping cart</p>
              <h1 className="heading-page text-lux-black">Your cart</h1>
              <p className="lead mt-3 max-w-2xl">
                {itemCount === 1
                  ? "One piece waiting for you. Review the details, or proceed to checkout when ready."
                  : `${itemCount} pieces waiting for you. Review your selections and check out when ready.`}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/browse" className="btn-secondary rounded-full">
                Continue Shopping
              </Link>
              <Link href="/checkout" className="btn-primary rounded-full">
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="section-normal">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="bg-lux-white rounded-xl border border-lux-silver-soft p-4 sm:p-6 shadow-clean"
                >
                  <div className="flex gap-4 sm:gap-6">
                    <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-lux-pearl">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          loading="lazy"
                          quality={85}
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="text-label text-lux-gold">{item.categoryName}</p>
                          <Link
                            href={`/product/${item.slug}`}
                            className="font-serif text-lg font-medium text-lux-black hover:text-lux-gold transition-colors line-clamp-2"
                          >
                            {item.title}
                          </Link>
                          <p className="text-muted mt-1">Authenticated & insured shipping</p>
                        </div>
                        <p className="text-xl font-semibold text-lux-black whitespace-nowrap">
                          {formatUSD(item.price * item.quantity)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        {/* Quantity Controls */}
                        <div className="inline-flex items-center rounded-full border border-lux-silver-soft bg-lux-pearl">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            aria-label="Decrease quantity"
                            className="p-2 hover:bg-lux-cream rounded-l-full transition-colors"
                          >
                            <Minus className="h-4 w-4 text-lux-gray-dark" />
                          </button>
                          <span className="px-4 text-lux-black font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="p-2 hover:bg-lux-cream rounded-r-full transition-colors"
                          >
                            <Plus className="h-4 w-4 text-lux-gray-dark" />
                          </button>
                        </div>
                        <p className="text-muted">Unit price {formatUSD(item.price)}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {/* Help Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-lux-cream rounded-xl p-4 border border-lux-silver-soft">
                <div>
                  <p className="font-medium text-lux-black">Need help editing your cart?</p>
                  <p className="text-muted">
                    Questions? Reach out at{" "}
                    <a href="mailto:james@kollect-it.com" className="text-lux-gold hover:underline">
                      james@kollect-it.com
                    </a>
                  </p>
                </div>
                <button
                  onClick={clearCart}
                  className="btn-secondary rounded-full text-sm"
                >
                  Clear entire cart
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:sticky lg:top-28 space-y-6 h-fit">
              {/* Summary Card */}
              <div className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-label text-lux-gold">Summary</p>
                    <h2 className="heading-subsection mt-1">Order total</h2>
                  </div>
                  <span className="text-2xl font-semibold text-lux-gold">
                    {formatUSD(total)}
                  </span>
                </div>

                <dl className="space-y-3 border-y border-lux-silver-soft py-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-lux-gray-dark">
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                    </dt>
                    <dd className="font-medium text-lux-black">{formatUSD(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-lux-gray-dark">Shipping</dt>
                    <dd className="text-label text-lux-gray">Calculated at checkout</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-lux-gray-dark">Tax (est.)</dt>
                    <dd className="font-medium text-lux-black">{formatUSD(tax)}</dd>
                  </div>
                </dl>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="btn-primary rounded-full w-full text-center block"
                  >
                    Proceed to checkout
                  </Link>
                  <Link
                    href="/browse"
                    className="btn-secondary rounded-full w-full text-center block"
                  >
                    Keep browsing
                  </Link>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-lux-white rounded-xl border border-lux-silver-soft p-6">
                <h3 className="text-label text-lux-gold mb-4">Trust & assurances</h3>
                <ul className="space-y-4">
                  {[
                    { icon: ShieldCheck, title: "Secure checkout", body: "SSL encrypted payments backed by Stripe" },
                    { icon: Truck, title: "Insured shipping", body: "Each parcel is fully insured to its purchase value" },
                    { icon: Headphones, title: "Concierge care", body: "Dedicated support before, during, and after delivery" },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-lux-cream flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-lux-gold" />
                      </span>
                      <div>
                        <p className="font-medium text-lux-black">{item.title}</p>
                        <p className="text-muted text-sm">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Promo Code */}
              <div className="bg-lux-white rounded-xl border border-lux-silver-soft p-6">
                <label htmlFor="promo-code" className="text-label text-lux-gold block mb-3">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo-code"
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 rounded-full border border-lux-silver-soft bg-lux-pearl text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold"
                  />
                  <button className="btn-secondary rounded-full px-5">
                    Apply
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Recommendations
        suggestions={suggestions}
        heading="Complete your collection"
      />
    </main>
  );
}
