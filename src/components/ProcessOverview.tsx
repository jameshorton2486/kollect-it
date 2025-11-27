export default function ProcessOverview() {
  const steps = [
    {
      title: "Source",
      description:
        "I look for pieces from estates, auctions, and long-held collections that feel special in their quality, design, or story.",
    },
    {
      title: "Review & Research",
      description:
        "I examine condition as best I can, note any flaws I see, and learn what I can about age, materials, and background.",
    },
    {
      title: "Photograph & Describe",
      description:
        "Items are photographed in a simple, honest way and described in plain language so you know what to expect.",
    },
    {
      title: "Careful Packing & Delivery",
      description:
        "When something sells, I pack it carefully and ship with tracking whenever possible. If you have questions, you deal directly with me.",
    },
  ];

  return (
    <section className="bg-lux-cream py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 text-center md:mb-16">
          <p className="text-xs font-semibold tracking-[0.25em] text-lux-gold uppercase mb-3">
            How It Works
          </p>
          <h2 className="font-serif text-3xl text-lux-black md:text-4xl">
            Our Process
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-lux-gray-dark md:text-base leading-relaxed">
            I keep things simple: find interesting pieces, describe them
            honestly, and try to match them with collectors who will appreciate
            them.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 md:space-y-10">
          {steps.map((step, index) => (
            <div key={step.title} className="flex gap-5 md:gap-6">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-lux-gold bg-lux-white text-sm font-semibold text-lux-gold md:h-11 md:w-11">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="text-base font-medium text-lux-black md:text-lg">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-lux-gray-dark md:text-base leading-relaxed">
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
