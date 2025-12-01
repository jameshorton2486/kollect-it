const items = [
  {
    title: "Authenticated Consignments",
    body: "Every piece is inspected, documented, and photographed in-house before it is published.",
  },
  {
    title: "Concierge Shipping",
    body: "Insured carriers, custom packing, and white-glove delivery options for statement works.",
  },
  {
    title: "Secure Checkout",
    body: "Stripe-powered payments, PCI-compliant processing, and prompt settlement for consignors.",
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-surface-800 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:gap-10">
        {items.map((item) => (
          <div key={item.title} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
              {item.title}
            </p>
            <p className="text-sm leading-relaxed text-white/90">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}