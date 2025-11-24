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
          {steps.map((step) => (
            <div key={step.title} className="flex items-start gap-4 mb-8">
              <div className="text-lux-gold text-2xl font-bold">{step.number}</div>
              <div>
                <h3 className="text-lg text-lux-white font-medium mb-2">
                  {step.title}
                </h3>
                <p className="text-lux-gray-light text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}