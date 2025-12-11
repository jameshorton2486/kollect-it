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
import { Check, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    const required = ["fullName", "email", "phone", "address", "city", "state", "zipCode"];

    for (const field of required) {
      if (!shippingInfo[field as keyof ShippingInfo]) {
        setError("Please fill in all required fields");
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(shippingInfo.phone)) {
      setError("Please enter a valid phone number");
      return false;
    }

    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(shippingInfo.zipCode)) {
      setError("Please enter a valid ZIP code");
      return false;
    }

    return true;
  };

  const handleContinueToPayment = async () => {
    setError("");

    if (!validateShippingForm()) return;

    if (!stripeEnabled) {
      setError("Stripe is not configured. Add your Stripe test keys to continue.");
      return;
    }

    setLoading(true);

    try {
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
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (itemCount === 0) return null;

  const stripePromise = stripeEnabled ? getStripe() : null;

  const inputClasses =
    "w-full px-4 py-3 rounded-lg border border-lux-silver-soft bg-lux-white text-lux-black placeholder:text-lux-gray-dark focus:outline-none focus:ring-2 focus:ring-lux-gold transition";

  return (
    <main className="min-h-screen bg-lux-pearl">
      {/* Header */}
      <section className="bg-lux-cream section-normal border-b border-lux-silver-soft">
        <div className="container mx-auto">
          <Link href="/cart" className="inline-flex items-center gap-2 text-lux-gray-dark hover:text-lux-gold transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>
          <p className="text-label text-lux-gold mb-2">Secure checkout</p>
          <h1 className="heading-page text-lux-black">Complete your purchase</h1>
          <p className="lead mt-3 max-w-2xl">
            Enter your shipping details and complete payment securely. Your order will be carefully packed and shipped with tracking included.
          </p>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-8">
            {["Shipping", "Payment"].map((label, index) => {
              const isActive = (index === 0 && step === "shipping") || (index === 1 && step === "payment");
              const isCompleted = index === 0 && step === "payment";
              return (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-lux-gold text-lux-charcoal"
                        : "bg-lux-pearl text-lux-gray-dark border border-lux-silver-soft"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span className={`text-sm font-medium ${isActive ? "text-lux-gold" : "text-lux-gray-dark"}`}>
                    {label}
                  </span>
                  {index === 0 && <span className="w-8 h-px bg-lux-silver-soft mx-2" />}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-normal">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Form Section */}
            <div className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 shadow-clean">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {step === "shipping" && (
                <div>
                  <h2 className="heading-section text-lux-black mb-6">Shipping Information</h2>

                  <div className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-label text-lux-gray-dark block mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                          className={inputClasses}
                          placeholder="John Smith"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-label text-lux-gray-dark block mb-2">Email *</label>
                        <input
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          className={inputClasses}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-label text-lux-gray-dark block mb-2">Phone *</label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className={inputClasses}
                        placeholder="(555) 555-5555"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-label text-lux-gray-dark block mb-2">Street Address *</label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className={inputClasses}
                        placeholder="123 Main Street"
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-label text-lux-gray-dark block mb-2">City *</label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className={inputClasses}
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-label text-lux-gray-dark block mb-2">State *</label>
                        <input
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className={inputClasses}
                          placeholder="NY"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-label text-lux-gray-dark block mb-2">ZIP Code *</label>
                        <input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          className={inputClasses}
                          placeholder="10001"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-label text-lux-gray-dark block mb-2">Country *</label>
                        <select
                          value={shippingInfo.country}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                          className={inputClasses}
                        >
                          <option>United States</option>
                          <option>Canada</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Billing Address Toggle */}
                  <div className="mt-8 pt-6 border-t border-lux-silver-soft">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billingInfo.sameAsShipping}
                        onChange={(e) => setBillingInfo({ ...billingInfo, sameAsShipping: e.target.checked })}
                        className="w-5 h-5 rounded border-lux-silver-soft text-lux-gold focus:ring-lux-gold"
                      />
                      <span className="text-lux-black">Billing address same as shipping</span>
                    </label>
                  </div>

                  <button
                    onClick={handleContinueToPayment}
                    disabled={loading}
                    className="btn-primary rounded-full w-full mt-8"
                  >
                    {loading ? "Processing..." : "Continue to Payment"}
                  </button>
                </div>
              )}

              {step === "payment" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="heading-section text-lux-black">Payment</h2>
                    <button
                      onClick={() => setStep("shipping")}
                      className="text-sm text-lux-gold hover:underline"
                    >
                      Edit shipping
                    </button>
                  </div>

                  {/* Shipping Summary */}
                  <div className="bg-lux-pearl rounded-lg p-4 mb-6">
                    <p className="text-label text-lux-gold mb-2">Shipping to</p>
                    <p className="text-lux-black">{shippingInfo.fullName}</p>
                    <p className="text-lux-gray-dark text-sm">
                      {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                    </p>
                  </div>

                  {!stripeEnabled ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700">
                      Stripe is not configured. Add your publishable and secret keys to enable payments.
                    </div>
                  ) : (
                    stripePromise && (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm
                          clientSecret={clientSecret}
                          shippingInfo={shippingInfo}
                          billingInfo={billingInfo.sameAsShipping ? shippingInfo : billingInfo}
                          totalAmount={validatedTotal ?? total}
                          onSuccess={() => clearCart()}
                        />
                      </Elements>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:sticky lg:top-28 h-fit space-y-6">
              <div className="bg-lux-white rounded-xl border border-lux-silver-soft p-6 shadow-soft">
                <h2 className="heading-subsection text-lux-black mb-4">Order summary</h2>
                <p className="text-muted mb-6">
                  {itemCount} {itemCount === 1 ? "piece" : "pieces"} in your order
                </p>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-lux-pearl rounded-lg p-3">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-lg object-cover"
                        loading="lazy"
                        quality={85}
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-lux-black text-sm line-clamp-2">{item.title}</p>
                        <p className="text-muted text-xs">Qty {item.quantity}</p>
                      </div>
                      <p className="font-medium text-lux-black text-sm">
                        {formatUSD(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <dl className="space-y-2 border-t border-lux-silver-soft pt-4 mt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-lux-gray-dark">Subtotal</dt>
                    <dd className="font-medium text-lux-black">{formatUSD(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-lux-gray-dark">Shipping</dt>
                    <dd className="text-label text-lux-gray">Calculated at payment</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-lux-gray-dark">Tax (est.)</dt>
                    <dd className="font-medium text-lux-black">{formatUSD(tax)}</dd>
                  </div>
                </dl>

                <div className="border-t border-lux-silver-soft pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lux-black">Total</span>
                    <span className="text-2xl font-semibold text-lux-gold">{formatUSD(total)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-lux-white rounded-xl border border-lux-silver-soft p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-lux-gold" />
                    <div>
                      <p className="font-medium text-lux-black text-sm">Secure checkout</p>
                      <p className="text-muted text-xs">256-bit SSL encryption</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-lux-gold" />
                    <div>
                      <p className="font-medium text-lux-black text-sm">Insured shipping</p>
                      <p className="text-muted text-xs">Full coverage included</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
