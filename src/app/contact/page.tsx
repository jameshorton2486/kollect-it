import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact – Kollect-It",
  description: "Get in touch with Kollect-It for questions about items, shipping, or consignment opportunities.",
  alternates: {
    canonical: "https://kollect-it.com/contact",
  },
  openGraph: {
    title: "Contact Kollect-It",
    description: "Get in touch with questions about items, shipping, or consignment opportunities. We respond personally within 24 hours.",
    url: "https://kollect-it.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Kollect-It",
    description: "Get in touch for questions about items, shipping, or consignment opportunities.",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-lux-pearl">
      {/* Header Section */}
      <section className="border-b border-border-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-lux-gold">
            Get in Touch
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            Contact
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-600">
            I&apos;d love to hear from you. Whether you have a question about a piece, want to discuss consignment, or just want to say hello—I respond personally to every message, usually within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-border-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-lg leading-relaxed text-ink-700">
            Questions about an item? Interested in consigning something? Just want to chat about collecting? I&apos;m here to help. Since this is a one-person operation, you&apos;ll hear directly from me—no automated responses or customer service scripts.
          </p>

          <div className="mt-8 space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface-100">
                <svg className="h-5 w-5 text-lux-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-ink-700">Email</p>
                <a
                  href="mailto:james@kollect-it.com"
                  className="mt-1 text-lg text-lux-gold hover:underline underline-offset-4"
                >
                  james@kollect-it.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface-100">
                <svg className="h-5 w-5 text-lux-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-ink-700">Phone</p>
                <a
                  href="tel:+14693866065"
                  className="mt-1 text-lg text-ink-900 hover:text-lux-gold transition-colors"
                >
                  469-386-6065
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface-100">
                <svg className="h-5 w-5 text-lux-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-ink-700">Location</p>
                <p className="mt-1 text-lg text-ink-900">San Antonio, Texas</p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-xl bg-surface-50 px-6 py-5">
            <p className="text-sm text-ink-600">
              <span className="font-semibold text-ink-700">Response time:</span>{" "}
              I typically reply within 24 hours during business days. For urgent matters, 
              please call directly.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
