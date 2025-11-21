"use client";

import { useState } from "react";

interface Product {
  description: string;
  condition: string | null;
}

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<
    "details" | "shipping" | "authentication" | "guarantee"
  >("details");

  const tabs = [
    { id: "details", label: "Details", icon: "📋" },
    { id: "shipping", label: "Shipping & Returns", icon: "📦" },
    { id: "authentication", label: "Authentication", icon: "✓" },
    { id: "guarantee", label: "Guarantee", icon: "🛡️" },
  ] as const;

  return (
    <div className="product-tabs-section ki-section py-12 bg-parchment">
      <div className="ki-container">
        {/* Tab Navigation */}
        <div
          className="mb-8 overflow-x-auto"
          role="tablist"
          aria-label="Product information tabs"
        >
          <div className="flex gap-2 border-b border-ink-tertiary/20 pb-0 flex-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                className={`product-tab whitespace-nowrap px-6 py-4 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 ${
                  activeTab === tab.id
                    ? "border-b-[3px] border-gold-600 text-ink-900 bg-surface-0"
                    : "text-ink-600 hover:text-ink-900 hover:bg-surface-0/50"
                }`}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
              >
                <span className="inline-block mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="product-tabs-content">
          {activeTab === "details" && (
            <div
              className="tab-panel space-y-6"
              role="tabpanel"
              id="panel-details"
              aria-labelledby="tab-details"
              tabIndex={0}
            >
              <div className="rounded-lg border border-gold/20 bg-white p-6">
                <h3 className="font-serif text-2xl text-ink mb-4 flex items-center gap-2">
                  <span className="text-gold">📖</span> Product
                  Description
                </h3>
                <div className="prose prose-sm max-w-none text-ink-secondary leading-relaxed">
                  <p className="mb-4 text-base">{product.description}</p>
                  <p className="text-sm italic text-ink-secondary">
                    This product has been carefully selected and authenticated
                    by our expert curators. Every item in our collection is
                    evaluated for quality, historical significance, and value.
                  </p>
                </div>
              </div>

              {product.condition && (
                <div className="rounded-lg border border-green-200 bg-green-50/50 p-6">
                  <h4 className="font-serif text-lg text-ink mb-3 flex items-center gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-green-600"
                      aria-hidden="true"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Condition:{" "}
                    <span className="font-bold text-green-700">
                      {product.condition}
                    </span>
                  </h4>
                  <p className="text-sm text-ink-secondary">
                    This item is in <strong>{product.condition}</strong>{" "}
                    condition. All items are carefully inspected and accurately
                    described by our expert curators. Our condition grading
                    follows industry standards for antique and collectible
                    items.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "shipping" && (
            <div
              className="tab-panel space-y-6"
              role="tabpanel"
              id="panel-shipping"
              aria-labelledby="tab-shipping"
              tabIndex={0}
            >
              <div className="rounded-lg border border-border-200 bg-surface-0 p-6 space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-ink mb-4 flex items-center gap-2">
                    <span className="text-gold">📦</span> Shipping
                    Information
                  </h3>
                  <p className="text-ink-secondary mb-3">
                    We provide premium shipping services for all orders,
                    including complimentary white-glove shipping for items over
                    $99 within the continental United States.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-ink-tertiary/10 p-4 bg-gradient-to-br from-parchment to-white">
                    <p className="text-xs uppercase tracking-wider font-semibold text-gold mb-2">
                      Standard
                    </p>
                    <p className="font-serif text-lg text-ink mb-1">
                      5-7 Business Days
                    </p>
                    <p className="text-sm text-ink-secondary">Continental US</p>
                  </div>
                  <div className="rounded-lg border border-ink-tertiary/10 p-4 bg-gradient-to-br from-parchment to-white">
                    <p className="text-xs uppercase tracking-wider font-semibold text-gold mb-2">
                      Express
                    </p>
                    <p className="font-serif text-lg text-ink mb-1">
                      2-3 Business Days
                    </p>
                    <p className="text-sm text-ink-secondary">
                      Premium service
                    </p>
                  </div>
                  <div className="rounded-lg border border-ink-tertiary/10 p-4 bg-gradient-to-br from-parchment to-white">
                    <p className="text-xs uppercase tracking-wider font-semibold text-gold mb-2">
                      International
                    </p>
                    <p className="font-serif text-lg text-ink mb-1">
                      10-14 Business Days
                    </p>
                    <p className="text-sm text-ink-secondary">
                      Worldwide available
                    </p>
                  </div>
                </div>

                <div className="border-t border-ink-tertiary/10 pt-6">
                  <h4 className="font-serif text-lg text-ink mb-3">
                    ✓ Professional Packaging
                  </h4>
                  <ul className="space-y-2 text-sm text-ink-secondary">
                    <li className="flex gap-3">
                      <span className="text-gold flex-shrink-0">→</span>
                      <span>Quality materials ensure safe transit</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold flex-shrink-0">→</span>
                      <span>
                        Fragile items receive additional protective padding
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold flex-shrink-0">→</span>
                      <span>
                        Full insurance coverage included with shipment
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold flex-shrink-0">→</span>
                      <span>
                        Real-time tracking available for all deliveries
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-ink-tertiary/10 pt-6">
                  <h4 className="font-serif text-lg text-ink mb-3">
                    ↩ Returns & Exchanges
                  </h4>
                  <p className="text-sm text-ink-secondary mb-3">
                    We accept returns within{" "}
                    <strong>30 days of delivery</strong> for a full refund.
                    Items must be returned in their original condition. Simply
                    contact our concierge team to initiate a return – we'll even
                    provide return shipping at no cost.
                  </p>
                  <p className="text-xs bg-gold/10 border border-gold/20 rounded p-3 text-ink font-medium">
                    💡 Not satisfied? No questions asked returns – we want you
                    to be completely happy with your purchase.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "authentication" && (
            <div
              className="tab-panel space-y-6"
              role="tabpanel"
              id="panel-authentication"
              aria-labelledby="tab-authentication"
              tabIndex={0}
            >
              <div className="rounded-lg border border-border-200 bg-surface-0 p-6">
                <h3 className="font-serif text-2xl text-ink mb-4 flex items-center gap-2">
                  <span className="text-green-600">✓</span> Our Authentication
                  Guarantee
                </h3>
                <p className="text-ink-secondary leading-relaxed mb-4">
                  Every item at Kollect-It undergoes rigorous authentication by
                  our team of expert curators and specialists. We guarantee the
                  authenticity and accurate representation of all pieces in our
                  collection. Your confidence is our priority.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-lg border border-gold/20 bg-white p-6">
                  <h4 className="font-serif text-lg text-ink mb-4">
                    🔍 Authentication Process
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span className="text-gold font-bold flex-shrink-0">
                        1
                      </span>
                      <div>
                        <p className="font-medium text-ink text-sm">
                          Expert Examination
                        </p>
                        <p className="text-xs text-ink-secondary">
                          Physical inspection by category specialists
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold font-bold flex-shrink-0">
                        2
                      </span>
                      <div>
                        <p className="font-medium text-ink text-sm">
                          Provenance Research
                        </p>
                        <p className="text-xs text-ink-secondary">
                          Verification of item history and ownership
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold font-bold flex-shrink-0">
                        3
                      </span>
                      <div>
                        <p className="font-medium text-ink text-sm">
                          Condition Assessment
                        </p>
                        <p className="text-xs text-ink-secondary">
                          Detailed evaluation and documentation
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold font-bold flex-shrink-0">
                        4
                      </span>
                      <div>
                        <p className="font-medium text-ink text-sm">
                          Market Analysis
                        </p>
                        <p className="text-xs text-ink-secondary">
                          Fair pricing based on current market values
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gold/20 bg-white p-6">
                  <h4 className="font-serif text-lg text-ink mb-4">
                    📜 Certificate of Authenticity
                  </h4>
                  <p className="text-sm text-ink-secondary mb-4">
                    Select items include an official Certificate of Authenticity
                    from Kollect-It or the original artist/maker. All
                    documentation is carefully preserved and included with your
                    purchase.
                  </p>
                  <div className="bg-parchment rounded p-3 border border-gold/20">
                    <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-1">
                      Included with Certificate
                    </p>
                    <ul className="space-y-1 text-xs text-ink">
                      <li>✓ Detailed item description</li>
                      <li>✓ Condition assessment report</li>
                      <li>✓ Provenance documentation</li>
                      <li>✓ Expert authentication seal</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "guarantee" && (
            <div
              className="tab-panel space-y-6"
              role="tabpanel"
              id="panel-guarantee"
              aria-labelledby="tab-guarantee"
              tabIndex={0}
            >
              <div className="rounded-lg border-2 border-green-200 bg-green-50/30 p-6">
                <h3 className="font-serif text-2xl text-ink mb-4 flex items-center gap-2">
                  <span className="text-green-600">🛡️</span> Lifetime
                  Authenticity Guarantee
                </h3>
                <p className="text-ink-secondary font-medium mb-3">
                  Every Kollect-It purchase is backed by our unconditional
                  lifetime authenticity guarantee.
                </p>
                <div className="bg-white rounded p-4 border border-green-200">
                  <p className="text-sm text-ink font-semibold">
                    If any item is ever determined to be inauthentic, we will
                    provide a full refund including original shipping costs.
                    This guarantee remains valid for the lifetime of the item.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-lg border border-gold/20 bg-white p-6">
                  <h4 className="font-serif text-lg text-ink mb-4">
                    ✓ What's Protected
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-green-600 flex-shrink-0"
                        aria-hidden="true"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span className="text-sm text-ink-secondary">
                        Authenticity of materials and construction
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-green-600 flex-shrink-0"
                        aria-hidden="true"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span className="text-sm text-ink-secondary">
                        Accuracy of all descriptions and dates
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-green-600 flex-shrink-0"
                        aria-hidden="true"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span className="text-sm text-ink-secondary">
                        Fair market pricing based on authenticity
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-green-600 flex-shrink-0"
                        aria-hidden="true"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span className="text-sm text-ink-secondary">
                        Valid for the lifetime of the item
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gold/20 bg-white p-6">
                  <h4 className="font-serif text-lg text-ink mb-4">
                    💬 How to Make a Claim
                  </h4>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="text-gold font-bold flex-shrink-0">
                        1
                      </span>
                      <span className="text-sm text-ink-secondary">
                        Contact our concierge team with details
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold font-bold flex-shrink-0">
                        2
                      </span>
                      <span className="text-sm text-ink-secondary">
                        Provide documentation of discrepancy
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold font-bold flex-shrink-0">
                        3
                      </span>
                      <span className="text-sm text-ink-secondary">
                        We arrange item inspection by experts
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-gold font-bold flex-shrink-0">
                        4
                      </span>
                      <span className="text-sm text-ink-secondary">
                        Full refund if claim is verified
                      </span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

