import { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import { AesopSection } from "@/components/AesopSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with our team of experts for authentication, appraisals, acquisitions, and consignment inquiries.",
  openGraph: {
    title: "Contact Us",
    description:
      "Get in touch with our team of experts for authentication, appraisals, acquisitions, and consignment inquiries.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us",
    description:
      "Get in touch with our team of experts for authentication, appraisals, acquisitions, and consignment inquiries.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
  },
};

export default function ContactPage() {
  return (
    <main className="" role="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Kollect-It",
            description:
              "Authenticated antiques, collectibles, and fine art marketplace",
            url: "https://kollect-it.com",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "Customer Service",
              telephone: "+1-555-123-4567",
              email: "hello@kollect-it.com",
              contactOption: "TollFree",
            },
            address: {
              "@type": "PostalAddress",
              addressCountry: "US",
              addressRegion: "NY",
            },
            sameAs: [
              "https://www.instagram.com/",
              "https://www.facebook.com/",
              "https://www.youtube.com/",
            ],
          }),
        }}
      />

      {/* HERO SECTION */}
      <AesopSection
        variant="sand"
        layout="full"
        subtitle="GET IN TOUCH"
        title="We're Here to Help"
        description={
          <>
            Our team of experts is ready to assist with acquisitions,
            authentication, appraisals, consignments, and any questions about
            our collection.
          </>
        }
      />

      {/* CONTACT METHODS SECTION */}
      <AesopSection variant="cream" layout="full">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {/* General Inquiries */}
          <div className="contact-method bg-surface-1 p-8 rounded-lg">
            <h3 className="font-serif text-2xl text-ink mb-4">
              General Inquiries
            </h3>
            <p className="text-ink-light mb-6">
              Have a question about our collection, authentication process, or
              services?
            </p>
            <div className="space-y-3 text-ink">
              <div>
                <p className="text-sm font-semibold text-ink-light mb-1">
                  Email
                </p>
                <a
                  href="mailto:hello@kollect-it.com"
                  className="text-gold font-medium hover:underline"
                >
                  hello@kollect-it.com
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-light mb-1">
                  Phone
                </p>
                <a
                  href="tel:+15551234567"
                  className="text-gold font-medium hover:underline"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-light mb-1">
                  Response Time
                </p>
                <p className="text-sm">Within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Selling & Consignment */}
          <div className="contact-method bg-surface-1 p-8 rounded-lg">
            <h3 className="font-serif text-2xl text-ink mb-4">
              Selling & Consignment
            </h3>
            <p className="text-ink-light mb-6">
              Ready to consign your items or sell to us directly?
            </p>
            <div className="space-y-3 text-ink">
              <div>
                <p className="text-sm font-semibold text-ink-light mb-1">
                  Email
                </p>
                <a
                  href="mailto:consign@kollect-it.com"
                  className="text-gold font-medium hover:underline"
                >
                  consign@kollect-it.com
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-light mb-1">
                  Phone
                </p>
                <a
                  href="tel:+15551234567"
                  className="text-gold font-medium hover:underline"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              <Link
                href="/sell"
                className="inline-block text-gold font-medium hover:underline mt-2"
              >
                Consignment Info →
              </Link>
            </div>
          </div>

          {/* Customer Support */}
          <div className="contact-method bg-surface-1 p-8 rounded-lg">
            <h3 className="font-serif text-2xl text-ink mb-4">
              Customer Support
            </h3>
            <p className="text-ink-light mb-6">
              Need help with an order or have a delivery question?
            </p>
            <div className="space-y-3 text-ink">
              <div>
                <p className="text-sm font-semibold text-ink-light mb-1">
                  Email
                </p>
                <a
                  href="mailto:support@kollect-it.com"
                  className="text-gold font-medium hover:underline"
                >
                  support@kollect-it.com
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-light mb-1">
                  Phone
                </p>
                <a
                  href="tel:+15551234567"
                  className="text-gold font-medium hover:underline"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-light mb-1">
                  Hours
                </p>
                <p className="text-sm">Mon-Fri: 9am-6pm EST</p>
              </div>
            </div>
          </div>
        </div>
      </AesopSection>

      {/* CONTACT FORM SECTION */}
      <AesopSection
        variant="sand"
        layout="full"
        title="Send Us a Message"
      >
        <div className="bg-surface-0 p-8 md:p-12 rounded-lg max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </AesopSection>

      {/* FAQ QUICK LINKS */}
      <AesopSection
        variant="olive"
        layout="full"
        title="Find Answers Quickly"
        description={
          <>
            Browse our comprehensive FAQ for answers to common questions
          </>
        }
      >
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <Link
            href="/faq#buying"
            className="bg-surface-1 p-6 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="font-serif text-lg text-ink mb-2">
              Buying & Ordering
            </h3>
            <span className="text-gold text-sm">View FAQ →</span>
          </Link>
          <Link
            href="/faq#shipping"
            className="bg-surface-1 p-6 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="font-serif text-lg text-ink mb-2">
              Shipping & Delivery
            </h3>
            <span className="text-gold text-sm">View FAQ →</span>
          </Link>
          <Link
            href="/faq#authentication"
            className="bg-surface-1 p-6 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="font-serif text-lg text-ink mb-2">
              Authentication
            </h3>
            <span className="text-gold text-sm">View FAQ →</span>
          </Link>
          <Link
            href="/faq#returns"
            className="bg-surface-1 p-6 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="font-serif text-lg text-ink mb-2">
              Returns & Refunds
            </h3>
            <span className="text-gold text-sm">View FAQ →</span>
          </Link>
          <Link
            href="/faq#selling"
            className="bg-surface-1 p-6 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="font-serif text-lg text-ink mb-2">
              Selling & Consignment
            </h3>
            <span className="text-gold text-sm">View FAQ →</span>
          </Link>
          <Link
            href="/faq#account"
            className="bg-surface-1 p-6 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="font-serif text-lg text-ink mb-2">
              Account & Technical
            </h3>
            <span className="text-gold text-sm">View FAQ →</span>
          </Link>
        </div>
      </AesopSection>

      {/* HOURS & LOCATION */}
      <AesopSection
        variant="charcoal"
        layout="full"
        title="Business Hours"
      >
        <div className="space-y-2 text-ink-light max-w-2xl mx-auto text-center">
          <p>
            <span className="font-semibold text-ink">Monday – Friday:</span>{" "}
            9:00 AM – 6:00 PM EST
          </p>
          <p>
            <span className="font-semibold text-ink">Saturday:</span> 10:00
            AM – 4:00 PM EST
          </p>
          <p>
            <span className="font-semibold text-ink">Sunday:</span> Closed
          </p>
        </div>
      </AesopSection>
    </main>
  );
}

