const items = [
  {
    title: "Authenticated Consignments",
    body: "Trusted consignments vetted for quality and authenticity",
  },
  {
    title: "Concierge Shipping",
    body: "White-glove shipping coordination from our team",
  },
  {
    title: "Research & Provenance",
    body: "Provenance and documentation included whenever available",
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