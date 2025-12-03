"use client";

import { useState } from "react";

interface Product {
  description: string;
  condition: string | null;
}

interface ProductTabsProps {
  product: Product;
}

const tabs = [
  { id: "details", label: "Details", icon: "📋" },
  { id: "shipping", label: "Shipping & Returns", icon: "📦" },
  { id: "authentication", label: "Authentication", icon: "✓" },
  { id: "guarantee", label: "Guarantee", icon: "🛡️" },
] as const;

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>(
    "details",
  );

  const tabPanels: Record<(typeof tabs)[number]["id"], JSX.Element> = {
    details: (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 font-serif text-2xl text-ink">
            <span className="text-lux-gold">📖</span> Product Description
          </h3>
          <p className="text-base text-ink-700 leading-relaxed">
            {product.description}
          </p>
          <p className="mt-4 text-sm text-ink-500">
            Every piece is researched and evaluated before being listed. Descriptions are clear and honest, so you know exactly what you're purchasing.
          </p>
        </div>
        {product.condition && (
          <div className="rounded-2xl border border-lux-gold/30 bg-lux-gold/5 p-6">
            <h4 className="mb-3 flex items-center gap-2 font-serif text-lg text-ink">
              <span className="text-lux-gold">✓</span> Condition:
              <span className="font-semibold text-lux-gold">
                {product.condition}
              </span>
            </h4>
            <p className="text-sm text-ink-600">
              All items are inspected under magnification and natural light.
              Condition notes follow industry-standard grading.
            </p>
          </div>
        )}
      </div>
    ),
    shipping: (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 font-serif text-2xl text-ink">
            <span className="text-lux-gold">📦</span> Shipping Information
          </h3>
          <p className="text-sm text-ink-600">
            Professional shipping support for all orders. We coordinate secure packing and reliable delivery with tracking included.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Standard", timeline: "5–7 Business Days" },
            { label: "Express", timeline: "2–3 Business Days" },
            { label: "International", timeline: "10–14 Business Days" },
          ].map((option) => (
            <div
              key={option.label}
              className="rounded-2xl border border-border-200 bg-surface-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400">
                {option.label}
              </p>
              <p className="mt-1 font-serif text-lg text-ink-900">
                {option.timeline}
              </p>
              <p className="text-sm text-ink-600">
                {option.label === "International"
                  ? "Worldwide delivery available"
                  : "Fully insured service"}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border-200 bg-white p-6">
          <h4 className="mb-3 flex items-center gap-2 font-serif text-lg text-ink">
            <span className="text-lux-gold">↩</span> Returns & Exchanges
          </h4>
          <p className="text-sm text-ink-600">
            Returns accepted if an item arrives damaged or is not as described. Contact us within 48 hours of delivery to coordinate a return.
          </p>
        </div>
      </div>
    ),
    authentication: (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 font-serif text-2xl text-ink">
            <span className="text-lux-gold">✓</span> Authentication Guarantee
          </h3>
          <p className="text-sm text-ink-600 leading-relaxed">
            Each piece is researched and evaluated before being listed. Provenance and documentation are included when available.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border-200 bg-surface-50 p-6">
            <h4 className="mb-4 font-serif text-lg text-ink">Process</h4>
            <ol className="space-y-3 text-sm text-ink-700">
              <li>1. Review for quality, condition, and market interest</li>
              <li>2. Research provenance and history when available</li>
              <li>3. Document details and photograph carefully</li>
              <li>4. Present with clear images and honest descriptions</li>
            </ol>
          </div>
          <div className="rounded-2xl border border-border-200 bg-white p-6">
            <h4 className="mb-4 font-serif text-lg text-ink">
              Certificate Package
            </h4>
            <ul className="space-y-2 text-sm text-ink-700">
              <li>• Item overview with dimensions & materials</li>
              <li>• Condition report with curator notes</li>
              <li>• Provenance summary (when available)</li>
              <li>• Signed authentication letter</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    guarantee: (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 font-serif text-2xl text-ink">
            <span className="text-lux-gold">🛡️</span> Lifetime Guarantee
          </h3>
          <p className="text-sm text-ink-600">
            If you receive an item that doesn&apos;t match its description, contact us immediately. We will investigate and provide a full refund including return shipping if the item is found to be inauthentic or misrepresented.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border-200 bg-surface-50 p-6">
            <h4 className="mb-3 font-serif text-lg text-ink">What&apos;s Covered</h4>
            <ul className="space-y-2 text-sm text-ink-700">
              <li>• Authenticity of materials & construction</li>
              <li>• Accuracy of dating and attribution</li>
              <li>• Documentation represented in the listing</li>
              <li>• Market value tied to authenticity</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border-200 bg-white p-6">
            <h4 className="mb-3 font-serif text-lg text-ink">
              Making a Claim
            </h4>
            <ol className="space-y-2 text-sm text-ink-700">
              <li>1. Contact us with your documentation</li>
              <li>2. Provide third-party findings or lab reports</li>
              <li>3. We coordinate expert review</li>
              <li>4. Refund issued once assessment is confirmed</li>
            </ol>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="rounded-3xl border border-border-200 bg-white/95 p-6 shadow-lg shadow-black/5">
      <div className="mb-6 flex flex-wrap gap-2 border-b border-border-200 pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`whitespace-nowrap rounded-t-xl border-b-2 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] transition-colors ${
                isActive
                  ? "border-lux-gold text-ink-900"
                  : "border-transparent text-ink-400 hover:text-ink-900"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">{tabPanels[activeTab]}</div>
    </div>
  );
}

