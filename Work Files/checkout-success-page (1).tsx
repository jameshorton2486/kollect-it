"use client";

import { useEffect, useState, Suspense } from "react";
import { formatUSD } from "@/lib/currency";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Shield, Award } from "lucide-react";

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
          data.emailConfigured === undefined ? true : Boolean(data.emailConfigured)
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
          <div className="bg-lux-white rounded-2xl border border-lux-silver-soft p-8 text-center shadow-soft sm:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-lux-gold/30 border-t-lux-gold"></div>
            </div>
            <h2 className="heading-section text-lux-black">Processing your order...</h2>
            <p className="lead mt-3">Please wait while we confirm your payment</p>
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
          <div className="bg-lux-white rounded-2xl border border-lux-silver-soft p-8 text-center shadow-soft sm:p-12">
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
            <h1 className="heading-page text-lux-black">Something went wrong</h1>
            <p className="lead mt-4">{error}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/cart" className="btn-primary rounded-full">
                Return to Cart
              </Link>
              <Link href="/browse" className="btn-secondary rounded-full">
                Continue Shopping
              </Link>
            </div>
            <p className="mt-6 text-sm text-ink-600">
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

  // Success State
  return (
    <main className="min-h-[60vh] bg-lux-pearl">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="bg-lux-white rounded-2xl border border-lux-silver-soft shadow-soft overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-b from-lux-cream to-lux-white px-6 py-10 text-center sm:px-10 sm:py-12">
            {/* Gold Checkmark */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-lux-gold/10">
              <CheckCircle2 className="h-10 w-10 text-lux-gold" />
            </div>
            <h1 className="heading-page text-lux-black">Your order is confirmed!</h1>
            <p className="lead mt-4 max-w-md mx-auto">
              {emailConfigured ? (
                <>
                  We&apos;ll email shipping details to{" "}
                  <span className="font-medium text-lux-black">{orderDetails.email}</span>. 
                  Your pieces will be carefully packed and shipped within 1-2 business days.
                </>
              ) : (
                <>
                  Your order is confirmed. Please save your order number for your records—you&apos;ll 
                  receive shipping details soon.
                </>
              )}
            </p>
          </div>

          {/* Order Number */}
          <div className="border-t border-b border-lux-silver-soft bg-lux-cream/50 px-6 py-4 sm:px-10">
            <div className="flex items-center justify-between">
              <span className="text-label text-lux-gray-dark">Order Number</span>
              <span className="font-mono text-lg font-semibold text-lux-black">
                {orderDetails.orderNumber}
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="px-6 py-8 sm:px-10">
            <h2 className="text-label text-lux-gold mb-6">Order Summary</h2>

            <div className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex items-start justify-between py-2">
                  <div className="flex-1 pr-4">
                    <p className="font-medium text-lux-black">{item.title}</p>
                    <p className="text-sm text-ink-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-lux-black">
                    {formatUSD(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-lux-silver-soft flex items-center justify-between">
              <span className="heading-subsection text-lux-black">Total Paid</span>
              <span className="text-xl font-bold text-lux-black">{formatUSD(orderDetails.total)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t border-lux-silver-soft px-6 py-6 sm:px-10 bg-lux-cream/30">
            <h2 className="text-label text-lux-gold mb-3">Shipping To</h2>
            <p className="text-ink-600">{orderDetails.shippingAddress.address}</p>
            <p className="text-ink-600">
              {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}{" "}
              {orderDetails.shippingAddress.zipCode}
            </p>
          </div>

          {/* What's Next */}
          <div className="border-t border-lux-silver-soft px-6 py-8 sm:px-10">
            <h2 className="text-label text-lux-gold mb-6">What&apos;s Next</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-lux-cream flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-lux-gold" />
                </div>
                <div>
                  <p className="font-medium text-lux-black text-sm">Careful Packing</p>
                  <p className="text-xs text-ink-600 mt-1">Every piece wrapped with care</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-lux-cream flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-lux-gold" />
                </div>
                <div>
                  <p className="font-medium text-lux-black text-sm">Insured Shipping</p>
                  <p className="text-xs text-ink-600 mt-1">Full coverage included</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-lux-cream flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5 text-lux-gold" />
                </div>
                <div>
                  <p className="font-medium text-lux-black text-sm">Authenticated</p>
                  <p className="text-xs text-ink-600 mt-1">Quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-lux-silver-soft px-6 py-8 sm:px-10 bg-lux-cream/30">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/account?tab=orders"
                className="btn-primary flex-1 text-center rounded-full"
              >
                View Order Status
              </Link>
              <Link
                href="/browse"
                className="btn-secondary flex-1 text-center rounded-full"
              >
                Continue Browsing
              </Link>
            </div>
            <p className="mt-6 text-center text-sm text-ink-600">
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
            <div className="bg-lux-white rounded-2xl border border-lux-silver-soft p-8 text-center shadow-soft sm:p-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-lux-gold/30 border-t-lux-gold"></div>
              </div>
              <h2 className="heading-section text-lux-black">Loading...</h2>
            </div>
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
