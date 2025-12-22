import Link from "next/link";

const STEPS = [
  {
    title: "Review",
    description:
      "We assess each item individually for quality, condition, and market interest.",
  },
  {
    title: "Document",
    description:
      "We record details and history when available, and photograph each piece carefully.",
  },
  {
    title: "Present",
    description:
      "Your item is listed with clear images, honest descriptions, and collector-focused detail.",
  },
];

export default function ProcessOverview() {
  return (
    <section className="bg-surface-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-700">
              Consignment process
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-ink-900">
              Our Process
            </h2>
            <p className="text-sm leading-relaxed text-ink-600">
              Consignments are reviewed individually based on the item, category, and condition. We evaluate each piece, document what we can, and present it clearly so buyers know exactly what they're purchasing.
            </p>
          </div>
          <p className="text-sm text-ink-700">
            Transparent documentation reduces returns and keeps collectors
            confident when buying remotely.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {STEPS.map((step, idx) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border-200 bg-white px-6 py-6 shadow-sm"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-lux-gold text-xs font-semibold uppercase tracking-[0.35em] text-ink-600">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg font-semibold text-ink-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-ink-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-600">
            Each phase generates structured data—attributes, condition markers,
            provenance details—that feed directly into listing copy.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/our-process"
              className="inline-flex items-center rounded-full bg-lux-black px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-lux-charcoal"
            >
              View the full process
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-ink-300 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink-700 hover:text-ink-900"
            >
              Start a consignment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
