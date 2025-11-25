import { Search, ShieldCheck, Camera, Package } from "lucide-react";

export default function ProcessOverview() {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: "Source",
      description:
        "We identify exceptional pieces from reputable collections, estates, and international specialists. Every potential acquisition undergoes initial assessment for authenticity and condition.",
    },
    {
      number: 2,
      icon: ShieldCheck,
      title: "Authenticate",
      description:
        "Specialists vet and document provenance with transparent condition notes. We research materials, techniques, and historical context to ensure absolute accuracy.",
    },
    {
      number: 3,
      icon: Camera,
      title: "Catalog",
      description:
        "We photograph every flaw. Our condition reports are forensic, so you know exactly what you're holding before it arrives. Professional photography, detailed descriptions, and conservation-grade documentation included.",
    },
    {
      number: 4,
      icon: Package,
      title: "Deliver",
      description:
        "Insured shipping with professional packaging ensures your piece arrives safely. Full tracking and dedicated support throughout the delivery process.",
    },
  ];

  return (
    <section className="section-grand bg-lux-carbon">
      <div className="container mx-auto page-padding">
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
            <div key={step.title} className="flex items-start gap-6 mb-10">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-lux-charcoal flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-lux-gold" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h3 className="text-xl text-lux-white font-medium mb-2">
                  {step.title}
                </h3>
                <p className="text-lux-gray-light leading-relaxed">
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