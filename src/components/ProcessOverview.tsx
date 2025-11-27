import Link from "next/link";

const STEPS = [
  {
    title: "Consultation & Intake",
    description:
      "You send initial images or details. We assess authenticity indicators, condition signals, and market relevance.",
  },
  {
    title: "Authentication & Research",
    description:
      "We review provenance, maker marks, and comparative sales—building a factual basis that supports buyer confidence.",
  },
  {
    title: "Preparation & Presentation",
    description:
      "Pieces are photographed (including condition notes), cataloged with structured attributes, and listed with transparent narratives.",
  },
  {
    title: "Sale & Settlement",
    description:
      "Transactions are cleared, funds remitted promptly, and shipping or handoff is coordinated with appropriate care.",
  },
];

export default function ProcessOverview() {
  return (
    <section className="bg-lux-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-lux-gold uppercase">
              Consignment Process
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-lux-black sm:text-3xl">
              Structured, documented, and transparent at each stage
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-lux-gray-dark">
              A disciplined intake and presentation pipeline that preserves
              trust—for sellers seeking proper representation and buyers seeking
              verified objects.
            </p>
          </div>
          <div className="text-sm text-lux-gray-dark/85 md:text-right">
            <p>Detail-rich listings reduce friction and post-sale uncertainty.</p>
            <p className="mt-1">That drives better realized outcomes.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2">
          {STEPS.map((step, idx) => (
            <div
              key={step.title}
              className="group rounded-xl border border-lux-silver/40 bg-lux-cream px-5 py-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-lux-gold hover:shadow-[0_16px_45px_rgba(0,0,0,0.09)]"
            >
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-lux-gold bg-lux-white text-[0.70rem] font-semibold tracking-[0.18em] text-lux-black">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <h3 className="text-base font-semibold text-lux-black">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-lux-gray-dark">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-lux-gray-dark/85">
            Each phase creates structured data—attributes, condition markers,
            provenance notes—used to inform buyers clearly.
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/how-it-works"
              className="inline-flex items-center rounded-full border border-lux-black bg-lux-black px-5 py-2 text-sm font-medium text-lux-white transition hover:border-lux-gold hover:bg-lux-gold hover:text-lux-black"
            >
              View the full process
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-lux-black px-5 py-2 text-sm font-medium text-lux-black transition hover:border-lux-gold hover:text-lux-gold"
            >
              Start a consignment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
