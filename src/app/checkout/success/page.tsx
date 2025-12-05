"use client";

import { useEffect, useState, Suspense } from "react";
import { formatUSD } from "@/lib/currency";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface OrderDetails {
  orderNumber: string;
  email: string;
  total: number;
  items: {
    title: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [emailConfigured, setEmailConfigured] = useState(true);

  useEffect(() => {
    if (!paymentIntentId) {
      setError("No payment information found");
      setLoading(false);
      return;
    }

    const createOrder = async () => {
      try {
        const response = await fetch("/api/checkout/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create order");
        }

        setOrderDetails(data.order);
        setEmailConfigured(
          data.emailConfigured === undefined ? true : Boolean(data.emailConfigured),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    createOrder();
  }, [paymentIntentId]);

  // Loading State
  if (loading) {
    return (
      <main className="min-h-[60vh] bg-lux-pearl">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="rounded-2xl border border-border-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-lux-gold border-t-transparent"></div>
            </div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink-900">
              Processing your order...
            </h2>
            <p className="mt-2 text-base text-ink-600">
              Please wait while we confirm your payment
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Error State
  if (error) {
    return (
      <main className="min-h-[60vh] bg-lux-pearl">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="rounded-2xl border border-border-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
              Something went wrong
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-600">{error}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-full bg-lux-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lux-black shadow-sm transition-all hover:bg-lux-gold-light"
              >
                Return to Cart
              </Link>
              <Link
                href="/browse"
                className="inline-flex items-center justify-center rounded-full border border-border-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ink-700 transition-colors hover:bg-surface-50"
              >
                Continue Shopping
              </Link>
            </div>
            <p className="mt-6 text-sm text-ink-700">
              Need help?{" "}
              <Link href="/contact" className="text-lux-gold hover:underline underline-offset-4">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!orderDetails) {
    return null;
  }

  // Success State - Fully styled
  return (
    <main className="min-h-[60vh] bg-lux-pearl">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-2xl border border-border-200 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-b from-green-50 to-white px-6 py-8 text-center sm:px-10 sm:py-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Your order is confirmed!
            </h1>
            <p className="mt-3 text-base text-ink-600 max-w-md mx-auto">
              {emailConfigured ? (
                <>
                  We&apos;ll email shipping details soon to{" "}
                  <span className="font-medium text-ink-900">{orderDetails.email}</span>
                  . Your pieces will be carefully packed and shipped within 1-2 business days.
                </>
              ) : (
                <>
                  Your order is confirmed. Please save your order number for your records—you&apos;ll receive shipping details soon.
                </>
              )}
            </p>
          </div>

          {/* Order Number */}
          <div className="border-t border-b border-border-100 bg-surface-50 px-6 py-4 sm:px-10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink-700 uppercase tracking-wide">Order Number</span>
              <span className="font-mono text-lg font-semibold text-ink-900">
                {orderDetails.orderNumber}
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="px-6 py-6 sm:px-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-700 mb-4">
              Order Summary
            </h2>
            
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex items-start justify-between py-2">
                  <div className="flex-1 pr-4">
                    <p className="text-base font-medium text-ink-900">{item.title}</p>
                    <p className="text-sm text-ink-700">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-base font-medium text-ink-900">
                    {formatUSD(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border-200 flex items-center justify-between">
              <span className="text-base font-semibold text-ink-900">Total Paid</span>
              <span className="text-lg font-bold text-ink-900">{formatUSD(orderDetails.total)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t border-border-200 px-6 py-6 sm:px-10 bg-surface-50/50">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-700 mb-3">
              Shipping To
            </h2>
            <p className="text-base text-ink-700">
              {orderDetails.shippingAddress.address}
            </p>
            <p className="text-base text-ink-700">
              {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}{" "}
              {orderDetails.shippingAddress.zipCode}
            </p>
          </div>

          {/* What's Next */}
          <div className="border-t border-border-200 px-6 py-6 sm:px-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-700 mb-4">
              What&apos;s Next
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 text-lux-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-ink-700">
                  {emailConfigured 
                    ? "Check your email for a detailed confirmation"
                    : "Save your order number—you'll need it for reference"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 text-lux-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-ink-700">
                  I&apos;ll send tracking information as soon as your order ships
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 text-lux-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-ink-700">
                  Expected delivery: 5–7 business days
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-border-200 px-6 py-6 sm:px-10 bg-surface-50/50">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/account?tab=orders"
                className="flex-1 inline-flex items-center justify-center rounded-full bg-lux-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lux-black shadow-sm transition-all hover:bg-lux-gold-light"
              >
                View Order Status
              </Link>
              <Link
                href="/browse"
                className="flex-1 inline-flex items-center justify-center rounded-full border border-border-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ink-700 transition-colors hover:bg-surface-50"
              >
                Continue Browsing
              </Link>
            </div>
            <p className="mt-4 text-center text-sm text-ink-700">
              Need help?{" "}
              <Link href="/contact" className="text-lux-gold hover:underline underline-offset-4">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[60vh] bg-lux-pearl">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="rounded-2xl border border-border-200 bg-white p-8 text-center shadow-sm sm:p-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-lux-gold border-t-transparent"></div>
              </div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink-900">
                Loading...
              </h2>
            </div>
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
