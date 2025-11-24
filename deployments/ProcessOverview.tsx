import Link from "next/link";

export default function ProcessOverview() {
  const steps = [
    {
      number: 1,
      title: "Source",
      description:
        "We identify exceptional pieces from reputable collections, estates, and international specialists. Every potential acquisition undergoes initial assessment for authenticity and condition.",
    },
    {
      number: 2,
      title: "Authenticate",
      description:
        "Specialists vet and document provenance with transparent condition notes. We research materials, techniques, and historical context to ensure absolute accuracy.",
    },
    {
      number: 3,
      title: "Catalog",
      description:
        "Professional photography, detailed descriptions, and conservation-grade documentation. Each piece includes historical background and care recommendations.",
    },
    {
      number: 4,
      title: "Deliver",
      description:
        "Insured shipping with professional packaging ensures your piece arrives safely. Full tracking and dedicated support throughout the delivery process.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-lux-carbon">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm md:text-base font-medium text-lux-gold uppercase tracking-widest mb-3">
            Our Process
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-lux-white mb-4 font-normal">
            How We Work
          </h2>
          <p className="text-lg text-lux-gray-light max-w-2xl mx-auto font-light">
            From discovery to delivery, every step is designed to ensure
            authenticity, quality, and your complete satisfaction.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex gap-6 md:gap-10">
              {/* Timeline Line & Number */}
              <div className="flex flex-col items-center">
                {/* Number Circle */}
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-lux-gold text-lux-black font-semibold text-lg md:text-xl flex items-center justify-center z-10">
                  {step.number}
                </div>
                
                {/* Connecting Line (not after last item) */}
                {index < steps.length - 1 && (
                  <div className="w-px h-full bg-lux-gold/30 min-h-[80px]" />
                )}
              </div>

              {/* Content */}
              <div className="pb-12 md:pb-16">
                <h3 className="font-serif text-xl md:text-2xl text-lux-white mb-3">
                  {step.title}
                </h3>
                <p className="text-lux-gray-light leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-lux-gray-light text-lg mb-8 max-w-2xl mx-auto font-light">
            Ready to start collecting? Whether you're a seasoned collector or
            just beginning, we're here to guide you through every step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-lux-gold text-lux-black font-medium px-10 py-4 rounded hover:bg-lux-gold-light transition-colors"
            >
              Begin Shopping
            </Link>
            <Link
              href="/about"
              className="inline-block border border-lux-white/30 text-lux-white font-medium px-10 py-4 rounded hover:bg-lux-white/10 transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
