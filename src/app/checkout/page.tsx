"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/image";
import { formatUSD } from "@/lib/currency";

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BillingInfo {
  sameAsShipping: boolean;
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// metadata moved to ./metadata.ts for client component compliance

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, itemCount, subtotal, tax, total, clearCart } = useCart();
  const stripeEnabled = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validatedTotal, setValidatedTotal] = useState<number | null>(null);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    sameAsShipping: true,
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (itemCount === 0) {
      router.push("/cart");
    }
  }, [itemCount, router]);

  // Update shipping info when session loads
  useEffect(() => {
    if (session?.user) {
      setShippingInfo((prev) => ({
        ...prev,
        fullName: session.user?.name || prev.fullName,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session]);

  const validateShippingForm = (): boolean => {
    const required = [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ];

    for (const field of required) {
      if (!shippingInfo[field as keyof ShippingInfo]) {
        setError(`Please fill in all required fields`);
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate phone format (basic)
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(shippingInfo.phone)) {
      setError("Please enter a valid phone number");
      return false;
    }

    // Validate ZIP code format (US)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(shippingInfo.zipCode)) {
      setError("Please enter a valid ZIP code");
      return false;
    }

    return true;
  };

  const handleContinueToPayment = async () => {
    setError("");

    if (!validateShippingForm()) {
      return;
    }

    if (!stripeEnabled) {
      setError(
        "Stripe is not configured in this environment. Add your Stripe test keys to continue.",
      );
      return;
    }

    setLoading(true);

    try {
      // Create Payment Intent
      const cartPayload = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      if (cartPayload.length === 0) {
        setError("Your cart is empty.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartPayload,
          shippingInfo,
          billingInfo: billingInfo.sameAsShipping ? shippingInfo : billingInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      setClientSecret(data.clientSecret);
      if (typeof data.validatedTotal === "number") {
        setValidatedTotal(data.validatedTotal);
      }
      setStep("payment");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (itemCount === 0) {
    return null; // redirect kicks in
  }

  const stripePromise = stripeEnabled ? getStripe() : null;
  const labelClasses =
    "text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-ink-600";
  const inputClasses =
    "w-full rounded-xl border border-border-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-lux-gray-light focus:border-lux-gold focus:outline-none focus:ring-1 focus:ring-lux-gold transition";

  return (
    <div className="min-h-screen bg-lux-pearl py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="space-y-4 border-b border-border-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-700">
            Secure checkout
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                Complete your purchase
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-600">
                Enter your shipping details and complete payment securely. Your order will be carefully packed and shipped with tracking included.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {["Shipping", "Payment"].map((label, index) => {
                const isActive =
                  (index === 0 && step === "shipping") ||
                  (index === 1 && step === "payment");
                const isCompleted = index === 0 && step === "payment";
                return (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em]"
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm ${
                        isActive
                          ? "border-ink-900 bg-ink-900 text-white"
                          : isCompleted
                            ? "border-gold-500 bg-gold-500/20 text-ink-900"
                            : "border-border-200 bg-white text-ink-700"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={
                        isActive || isCompleted ? "text-ink-900" : "text-ink-700"
                      }
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
          <section className="space-y-8">
            {error && (
              <div className="rounded-2xl border border-semantic-error-500/40 bg-semantic-error-500/5 px-4 py-3 text-sm text-semantic-error-500">
                {error}
              </div>
            )}

            {step === "shipping" && (
              <div className="rounded-3xl border border-border-200 bg-white/90 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                  Shipping information
                </h2>
                <p className="mt-1 text-sm text-ink-700">
                  We'll coordinate secure packing and reliable delivery. Tracking information will be sent once your order ships.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClasses} htmlFor="shipping-fullName">
                        Full name *
                      </label>
                      <input
                        id="shipping-fullName"
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            fullName: e.target.value,
                          })
                        }
                        className={inputClasses}
                        placeholder="Ava Spencer"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClasses} htmlFor="shipping-email">
                        Email *
                      </label>
                      <input
                        id="shipping-email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            email: e.target.value,
                          })
                        }
                        className={inputClasses}
                        placeholder="ava@kollect-it.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClasses} htmlFor="shipping-phone">
                        Phone *
                      </label>
                      <input
                        id="shipping-phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            phone: e.target.value,
                          })
                        }
                        className={inputClasses}
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClasses} htmlFor="shipping-address">
                        Street *
                      </label>
                      <input
                        id="shipping-address"
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            address: e.target.value,
                          })
                        }
                        className={inputClasses}
                        placeholder="123 Mercer Street"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClasses} htmlFor="shipping-city">
                        City *
                      </label>
                      <input
                        id="shipping-city"
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            city: e.target.value,
                          })
                        }
                        className={inputClasses}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClasses} htmlFor="shipping-state">
                        State / region *
                      </label>
                      <input
                        id="shipping-state"
                        type="text"
                        value={shippingInfo.state}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            state: e.target.value,
                          })
                        }
                        className={inputClasses}
                        placeholder="NY"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClasses} htmlFor="shipping-zip">
                        Postal code *
                      </label>
                      <input
                        id="shipping-zip"
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            zipCode: e.target.value,
                          })
                        }
                        className={inputClasses}
                        placeholder="10012"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClasses} htmlFor="shipping-country">
                        Country *
                      </label>
                      <select
                        id="shipping-country"
                        value={shippingInfo.country}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            country: e.target.value,
                          })
                        }
                        className={inputClasses}
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {session?.user && (
                    <label className="flex items-center gap-3 text-sm text-ink-700">
                      <input type="checkbox" className="rounded border-border-200 text-ink-900 focus:ring-gold-300" />
                      Save this address to my account
                    </label>
                  )}

                  <button
                    onClick={handleContinueToPayment}
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Processing..." : "Continue to payment"}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {step === "payment" && clientSecret && (
              <div className="space-y-6 rounded-3xl border border-border-200 bg-white/90 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                      Payment
                    </h2>
                    <p className="text-sm text-ink-700">
                      Review your order details and complete payment securely.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep("shipping")}
                    className="text-sm font-semibold text-ink-700 underline-offset-4 hover:text-ink-900 hover:underline"
                  >
                    Edit shipping
                  </button>
                </div>

                <div className="rounded-2xl border border-border-200 bg-surface-50 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-700">
                    Shipping to
                  </p>
                  <p className="mt-2 font-semibold text-ink-900">
                    {shippingInfo.fullName}
                  </p>
                  <p className="text-sm text-ink-600">{shippingInfo.address}</p>
                  <p className="text-sm text-ink-600">
                    {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                  </p>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-border-200 bg-surface-50 px-5 py-4 text-sm text-ink-600">
                  <input
                    type="checkbox"
                    checked={billingInfo.sameAsShipping}
                    onChange={(e) =>
                      setBillingInfo({
                        ...billingInfo,
                        sameAsShipping: e.target.checked,
                      })
                    }
                    className="rounded border-border-200 text-ink-900 focus:ring-gold-300"
                  />
                  Billing address matches shipping
                </label>

                {!billingInfo.sameAsShipping && (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClasses} htmlFor="billing-fullName">
                          Full name *
                        </label>
                        <input
                          id="billing-fullName"
                          type="text"
                          value={billingInfo.fullName}
                          onChange={(e) =>
                            setBillingInfo({
                              ...billingInfo,
                              fullName: e.target.value,
                            })
                          }
                          className={inputClasses}
                          placeholder="Ava Spencer"
                          required
                        />
                      </div>
                      <div>
                        <label className={labelClasses} htmlFor="billing-address">
                          Street *
                        </label>
                        <input
                          id="billing-address"
                          type="text"
                          value={billingInfo.address}
                          onChange={(e) =>
                            setBillingInfo({
                              ...billingInfo,
                              address: e.target.value,
                            })
                          }
                          className={inputClasses}
                          placeholder="123 Mercer Street"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClasses} htmlFor="billing-city">
                          City *
                        </label>
                        <input
                          id="billing-city"
                          type="text"
                          value={billingInfo.city}
                          onChange={(e) =>
                            setBillingInfo({
                              ...billingInfo,
                              city: e.target.value,
                            })
                          }
                          className={inputClasses}
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div>
                        <label className={labelClasses} htmlFor="billing-state">
                          State *
                        </label>
                        <input
                          id="billing-state"
                          type="text"
                          value={billingInfo.state}
                          onChange={(e) =>
                            setBillingInfo({
                              ...billingInfo,
                              state: e.target.value,
                            })
                          }
                          className={inputClasses}
                          placeholder="NY"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClasses} htmlFor="billing-zip">
                          Postal code *
                        </label>
                        <input
                          id="billing-zip"
                          type="text"
                          value={billingInfo.zipCode}
                          onChange={(e) =>
                            setBillingInfo({
                              ...billingInfo,
                              zipCode: e.target.value,
                            })
                          }
                          className={inputClasses}
                          placeholder="10012"
                          required
                        />
                      </div>
                      <div>
                        <label className={labelClasses} htmlFor="billing-country">
                          Country *
                        </label>
                        <select
                          id="billing-country"
                          value={billingInfo.country}
                          onChange={(e) =>
                            setBillingInfo({
                              ...billingInfo,
                              country: e.target.value,
                            })
                          }
                          className={inputClasses}
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>Australia</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {!stripeEnabled ? (
                  <div className="rounded-2xl border border-border-200 bg-surface-50 px-4 py-3 text-sm text-ink-600">
                    Stripe is not configured in this environment. Add your
                    publishable and secret keys to <code>.env.local</code> to run
                    test-mode payments (4242 4242 4242 4242).
                  </div>
                ) : (
                  stripePromise && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm
                        clientSecret={clientSecret}
                        shippingInfo={shippingInfo}
                        billingInfo={
                          billingInfo.sameAsShipping ? shippingInfo : billingInfo
                        }
                        totalAmount={validatedTotal ?? total}
                        onSuccess={() => clearCart()}
                      />
                    </Elements>
                  )
                )}
              </div>
            )}
          </section>

          <aside className="rounded-3xl border border-border-200 bg-white/90 p-6 shadow-lg">
            <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
              Order summary
            </h2>
            <p className="mt-1 text-sm text-ink-700">
              {itemCount} {itemCount === 1 ? "piece" : "pieces"} in your order
            </p>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-border-200/70 bg-surface-50 p-3"
                >
                  <Image
                    src={item.image}
                    alt={`${item.title} thumbnail`}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-2xl object-cover"
                    loading="lazy"
                    quality={85}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-900 line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-xs text-ink-700">
                      Qty {item.quantity} · {item.categoryName}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-ink-900">
                    {formatUSD(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between text-ink-600">
                <span>Subtotal</span>
                <span className="font-semibold text-ink-900">
                  {formatUSD(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-ink-600">
                <span>Shipping</span>
                <span className="text-xs uppercase tracking-[0.28em] text-ink-700">
                  Calculated at payment
                </span>
              </div>
              <div className="flex items-center justify-between text-ink-600">
                <span>Tax (est.)</span>
                <span className="font-semibold text-ink-900">
                  {formatUSD(tax)}
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-border-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-ink-900">
                  Total
                </span>
                <span className="text-2xl font-semibold text-gold-500">
                  {formatUSD(total)}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4 rounded-2xl border border-border-200 bg-surface-50 p-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-sm font-semibold text-white">
                  ✓
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    Stripe test-mode ready
                  </p>
                  <p className="text-xs text-ink-700">
                    Use 4242 4242 4242 4242 with any future expiration to confirm
                    payment flow.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-200 text-sm font-semibold text-ink-900">
                  ✓
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    Fully insured shipping
                  </p>
                  <p className="text-xs text-ink-700">
                    Worldwide coverage with signature confirmation.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
