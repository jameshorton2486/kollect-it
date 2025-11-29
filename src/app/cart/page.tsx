"use client";

import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/image";
import { formatUSD } from "@/lib/currency";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
    <section className="bg-surface-100 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-400">
            Curated picks
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900">
            {heading}
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {suggestions.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group rounded-2xl border border-border-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl bg-surface-200">
                {product.images[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                    loading="lazy"
                    quality={85}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                ) : (
                  <div className="h-full w-full bg-surface-200" />
                )}
                <span className="absolute inset-x-4 top-4 inline-flex items-center justify-center rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-ink-600">
                  {product.category?.name || "Featured"}
                </span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-ink-900 line-clamp-2 group-hover:text-gold-500">
                {product.title}
              </h3>
              <p className="mt-2 text-sm uppercase tracking-[0.28em] text-ink-400">
                {product.category?.name}
              </p>
              <p className="mt-3 text-xl font-semibold text-gold-500">
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

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-surface-50">
        <section className="flex items-center justify-center px-4 py-20 sm:py-24">
          <div className="max-w-xl text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-border-200 bg-white shadow-sm">
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-ink-700"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-400">
              Cart
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink-900">
              Your cart is currently empty
            </h1>
            <p className="mt-4 text-base text-ink-600">
              Discover authenticated fine art, militaria, rare books, and more.
              Items you add will appear here for a seamless checkout.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-ink-900 px-8 text-white hover:bg-ink-700"
              >
                <Link href="/browse">Browse the collection</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="rounded-full border border-border-200 px-8 text-ink-900 hover:border-ink-700"
              >
                <Link href="/categories">Explore categories</Link>
              </Button>
            </div>
          </div>
        </section>

        <Recommendations
          suggestions={suggestions}
          heading="Start with these curated pieces"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <section className="border-b border-border-200 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-400">
              Shopping cart
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              {itemCount} {itemCount === 1 ? "item" : "items"} secured
            </h1>
            <p className="mt-3 max-w-2xl text-base text-ink-600">
              Your selections remain reserved for the next 24 hours. Adjust
              quantities, review details, and check out when ready.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              variant="ghost"
              className="rounded-full border border-border-200 px-6 text-sm text-ink-900 hover:border-ink-700"
            >
              <Link href="/browse">Continue shopping</Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-gold-500 px-6 text-sm font-semibold text-ink-900 hover:bg-gold-400"
            >
              <Link href="/checkout">Skip to checkout</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-border-200 bg-white p-5 shadow-sm ring-1 ring-black/2"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href={`/product/${item.slug}`}
                    className="flex-shrink-0 overflow-hidden rounded-2xl bg-surface-200 sm:h-32 sm:w-32"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover transition duration-500 hover:scale-[1.05]"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                      <div>
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-ink-400">
                          {item.categoryName}
                        </p>
                        <Link
                          href={`/product/${item.slug}`}
                          className="mt-1 block text-lg font-semibold tracking-tight text-ink-900 hover:text-gold-500"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm text-ink-500">
                          Authenticated &amp; insured shipping
                        </p>
                      </div>
                      <p className="text-right text-xl font-semibold text-ink-900 sm:text-2xl">
                        {formatUSD(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="inline-flex items-center overflow-hidden rounded-full border border-border-200 bg-surface-50 text-sm font-medium text-ink-900">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          aria-label="Decrease quantity"
                          className="px-4 py-2 text-2xl leading-none transition hover:bg-white"
                        >
                          −
                        </button>
                        <span className="px-5 text-base">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="px-4 py-2 text-2xl leading-none transition hover:bg-white"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-ink-500">
                        Unit price {formatUSD(item.price)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm font-medium text-ink-500 underline-offset-4 transition hover:text-ink-900 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-xs uppercase tracking-[0.35em] text-ink-400">
                      Estimated delivery: 3–5 business days
                    </p>
                  </div>
                </div>
              </article>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border-200 bg-surface-100 px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  Need help editing your cart?
                </p>
                <p className="text-xs text-ink-500">
                  Concierge support is available via{" "}
                  <a
                    href="mailto:concierge@kollect-it.com"
                    className="text-ink-900 underline-offset-4 hover:underline"
                  >
                    concierge@kollect-it.com
                  </a>
                </p>
              </div>
              <button
                onClick={clearCart}
                className="rounded-full border border-border-200 px-5 py-2 text-sm font-semibold text-ink-900 transition hover:border-ink-700 hover:text-ink-700"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          <aside className="lg:pl-6">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-3xl border border-border-200 bg-surface-100/80 p-6 shadow-lg backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-400">
                      Summary
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-ink-900">
                      Order total
                    </h2>
                  </div>
                  <span className="text-3xl font-semibold text-gold-500">
                    {formatUSD(total)}
                  </span>
                </div>
                <dl className="space-y-4 border-y border-border-200 py-6 text-sm">
                  <div className="flex items-center justify-between text-ink-600">
                    <dt>
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                    </dt>
                    <dd className="font-semibold text-ink-900">
                      {formatUSD(subtotal)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between text-ink-600">
                    <dt>Shipping</dt>
                    <dd className="text-xs uppercase tracking-[0.28em] text-ink-500">
                      Calculated at checkout
                    </dd>
                  </div>
                  <div className="flex items-center justify-between text-ink-600">
                    <dt>Tax (est.)</dt>
                    <dd className="font-semibold text-ink-900">
                      {formatUSD(tax)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 space-y-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full rounded-full bg-ink-900 text-white hover:bg-ink-700"
                  >
                    <Link href="/checkout">Proceed to checkout</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full rounded-full border border-border-200 text-ink-900 hover:border-ink-700"
                  >
                    <Link href="/browse">Keep browsing</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-3xl border border-border-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-ink-400">
                  Trust &amp; assurances
                </h3>
                <ul className="mt-4 space-y-4 text-sm text-ink-600">
                  {[
                    {
                      title: "Secure checkout",
                      body: "SSL encrypted payments backed by Stripe",
                    },
                    {
                      title: "Insured shipping",
                      body: "Each parcel is fully insured to its purchase value",
                    },
                    {
                      title: "Concierge care",
                      body: "Dedicated support before, during, and after delivery",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface-100 text-xs font-semibold text-ink-900">
                        ✓
                      </span>
                      <div>
                        <p className="font-semibold text-ink-900">{item.title}</p>
                        <p className="text-xs text-ink-500">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-border-200 bg-white p-6 shadow-sm">
                <label
                  htmlFor="promo-code"
                  className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-400"
                >
                  Promo code
                </label>
                <div className="mt-3 flex gap-2">
                  <input
                    id="promo-code"
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 rounded-full border border-border-200 bg-surface-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-300"
                  />
                  <button className="rounded-full border border-border-200 px-5 text-sm font-semibold text-ink-900 transition hover:border-ink-700">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Recommendations
        suggestions={suggestions}
        heading="Complete your collection"
      />
    </div>
  );
}

