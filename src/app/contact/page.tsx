export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface-50 text-ink-900">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-serif font-bold mb-10 text-ink-900">
          Contact
        </h1>

        <p className="text-lg leading-relaxed mb-10">
          If you have a question about an item, shipping, or a possible
          consignment, feel free to reach out. I&apos;m a one-person shop, so I
          respond personally to every message.
        </p>

        <div className="space-y-4 text-lg">
          <p>
            <span className="font-semibold">Email:</span>{" "}
            <a
              href="mailto:james@kollect-it.com"
              className="text-gold-600 hover:text-gold-700 underline-offset-4 hover:underline"
            >
              james@kollect-it.com
            </a>
          </p>

          <p>
            <span className="font-semibold">Phone:</span> 469-386-6065
          </p>

          <p>
            <span className="font-semibold">Location:</span> San Antonio, Texas
          </p>

          <p className="pt-6 text-ink-700">
            I typically reply within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

