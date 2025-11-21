import Link from "next/link";

export default function ProcessOverview() {
  const steps = [
    {
      n: 1,
      title: "Source",
      text: "We identify exceptional pieces from reputable collections, estates, and international specialists. Every potential acquisition undergoes initial assessment for authenticity and condition.",
      icon: "🔍",
    },
    {
      n: 2,
      title: "Authenticate",
      text: "Specialists vet and document provenance with transparent condition notes. We research materials, techniques, and historical context to ensure absolute accuracy.",
      icon: "✓",
    },
    {
      n: 3,
      title: "Catalog",
      text: "Professional photography, detailed descriptions, and conservation-grade documentation. Each piece includes historical background and care recommendations.",
      icon: "📋",
    },
    {
      n: 4,
      title: "Ship",
      text: "Insured, secure shipping with archival-grade packing. White-glove handling for premium items. Full tracking and insurance provided.",
      icon: "📦",
    },
    {
      n: 5,
      title: "Support",
      text: "Post-sale care guidance and lifetime authentication support. Our specialists are available for questions about your collection.",
      icon: "💬",
    },
    {
      n: 6,
      title: "Grow",
      text: "Build your collection with confidence. We offer acquisition consulting and help you discover pieces that match your vision and interests.",
      icon: "⭐",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-surface-1 border-t border-surface-2">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm md:text-base font-semibold text-gold uppercase tracking-widest mb-3">
            Our Process
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-4">
            How We Work
          </h2>
          <p className="text-lg text-ink-light max-w-2xl mx-auto">
            From discovery to delivery, every step is designed to ensure
            authenticity, quality, and your complete satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group bg-surface-0 rounded-lg p-8 border border-surface-2 hover:border-gold transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center text-2xl">
                  {s.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gold uppercase tracking-wider">
                    Step {s.n}
                  </div>
                  <h3 className="font-serif text-xl text-ink group-hover:text-gold transition-colors">
                    {s.title}
                  </h3>
                </div>
              </div>
              <p className="text-ink-light leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-ink-light text-lg mb-8 max-w-2xl mx-auto">
            Ready to start collecting? Whether you're a seasoned collector or
            just beginning, we're here to guide you through every step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-gold text-white font-semibold px-10 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Begin Shopping
            </Link>
            <Link
              href="/about"
              className="inline-block bg-surface-0 border-2 border-gold text-gold font-semibold px-10 py-3 rounded-lg hover:bg-gold hover:text-white transition-all"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

