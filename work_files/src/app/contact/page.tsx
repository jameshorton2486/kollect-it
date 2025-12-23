import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui";

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
};

export default function ContactPage() {
  return (
    <main className="bg-lux-pearl">
      {/* Header Section */}
      <PageHeader
        label="Get in Touch"
        title="Contact Us"
        description="Have a question about an item, interested in consigning, or just want to say hello?"
      />

      {/* Contact Content */}
      <section className="section-normal">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="heading-subsection mb-6">Reach Out Directly</h2>
              <p className="text-ink-600 mb-8">
                Questions about an item? Interested in consigning something? Just want to chat about collecting? I&apos;m here to help. Since this is a one-person operation, you&apos;ll hear directly from me—no automated responses or customer service scripts.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-lux-cream">
                    <Mail className="h-5 w-5 text-lux-gold" />
                  </div>
                  <div>
                    <p className="text-label text-lux-gray-dark mb-1">Email</p>
                    <a
                      href="mailto:james@kollect-it.com"
                      className="text-lg text-lux-gold hover:text-lux-gold-light transition-colors"
                    >
                      james@kollect-it.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-lux-cream">
                    <Phone className="h-5 w-5 text-lux-gold" />
                  </div>
                  <div>
                    <p className="text-label text-lux-gray-dark mb-1">Phone</p>
                    <a
                      href="tel:+14693866065"
                      className="text-lg text-lux-black hover:text-lux-gold transition-colors"
                    >
                      469-386-6065
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-lux-cream">
                    <MapPin className="h-5 w-5 text-lux-gold" />
                  </div>
                  <div>
                    <p className="text-label text-lux-gray-dark mb-1">Location</p>
                    <p className="text-lg text-lux-black">San Antonio, Texas</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-lg bg-lux-cream p-6">
                <p className="text-sm text-ink-600">
                  <span className="font-semibold text-lux-black">Response time:</span>{" "}
                  I typically reply within 24 hours during business days. For urgent matters, please call directly.
                </p>
              </div>
            </div>

            {/* Contact Form Placeholder */}
            <div className="bg-lux-white rounded-xl border border-lux-silver-soft p-8 shadow-clean">
              <h2 className="heading-subsection mb-6">Send a Message</h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="text-label text-lux-gray-dark block mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 rounded-lg border border-lux-silver-soft bg-lux-pearl focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-label text-lux-gray-dark block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-lg border border-lux-silver-soft bg-lux-pearl focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="text-label text-lux-gray-dark block mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-lg border border-lux-silver-soft bg-lux-pearl focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent"
                  >
                    <option value="">Select a topic</option>
                    <option value="item-inquiry">Question about an item</option>
                    <option value="consignment">Consignment inquiry</option>
                    <option value="shipping">Shipping question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="text-label text-lux-gray-dark block mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-lux-silver-soft bg-lux-pearl focus:outline-none focus:ring-2 focus:ring-lux-gold focus:border-transparent resize-none"
                    placeholder="How can I help you?"
                  />
                </div>

                <button type="submit" className="btn-primary w-full rounded-lg">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
