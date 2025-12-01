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

  if (loading) {
    return (
      <div className="success-page">
        <div className="success-container">
          <div className="success-loading">
            <div className="spinner-large"></div>
            <h2>Processing your order...</h2>
            <p>Please wait while we confirm your payment</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-[60vh] bg-lux-pearl">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="rounded-2xl border border-border-200 bg-white p-8 text-center shadow-sm sm:p-12">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Something went wrong
            </h1>

            {/* Description */}
            <p className="mt-4 text-base leading-relaxed text-ink-600">
              {error}
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-full bg-lux-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-lux-black shadow-sm transition-all hover:bg-lux-gold-light hover:shadow-md"
              >
                Return to Cart
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-border-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ink-700 transition-colors hover:bg-surface-50"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-content">
          {/* Success Icon */}
          <div className="success-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="success-title">Order Confirmed!</h1>
          <p className="success-subtitle">
            {emailConfigured ? (
              <>
                Thank you for your purchase. We&apos;ve sent a confirmation email
                to <strong>{orderDetails.email}</strong>.
              </>
            ) : (
              <>
                Thank you for your purchase. Email confirmations aren&apos;t
                enabled in this environment, so please save this page or copy
                your order number for your records.
              </>
            )}
          </p>
          {!emailConfigured && (
            <>
              {/* TODO: Enable email confirmations once SMTP credentials are configured */}
            </>
          )}

          {/* Order Number */}
          <div className="success-order-number">
            <span className="success-order-label">Order Number:</span>
            <span className="success-order-value">
              {orderDetails.orderNumber}
            </span>
          </div>

          {/* Order Summary */}
          <div className="success-summary">
            <h2 className="success-summary-title">Order Summary</h2>

            <div className="success-items">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="success-item">
                  <div className="success-item-info">
                    <h4>{item.title}</h4>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <span className="success-item-price">
                    {formatUSD(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="success-summary-divider" />

            <div className="success-total">
              <span>Total Paid</span>
              <span>{formatUSD(orderDetails.total)}</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="success-shipping">
            <h3 className="success-shipping-title">Shipping Address</h3>
            <p>{orderDetails.shippingAddress.address}</p>
            <p>
              {orderDetails.shippingAddress.city},{" "}
              {orderDetails.shippingAddress.state}{" "}
              {orderDetails.shippingAddress.zipCode}
            </p>
          </div>

          {/* Next Steps */}
          <div className="success-next-steps">
            <h3 className="success-next-title">What's Next?</h3>
            <ul className="success-steps-list">
              {emailConfigured ? (
                <li>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  You&apos;ll receive an email confirmation shortly
                </li>
              ) : (
                <li>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Save your order number; email updates will be enabled soon
                </li>
              )}
              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                We'll send you tracking information once your order ships
              </li>
              <li>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Expected delivery: 5-7 business days
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="success-actions">
            <Link href="/account?tab=orders" className="btn-primary">
              View Order Status
            </Link>
            <Link href="/" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>

          {/* Help Section */}
          <div className="success-help">
            <p>
              Need help?{" "}
              <Link href="/contact" className="success-help-link">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="success-page">
          <div className="success-container">
            <div className="success-loading">
              <div className="spinner-large"></div>
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

