import { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Get in touch with our team of experts for authentication, appraisals, acquisitions, and consignment inquiries.",
  openGraph: {
    title: 'Contact Us',
    description: "Get in touch with our team of experts for authentication, appraisals, acquisitions, and consignment inquiries.",
    images: ['https://ext.same-assets.com/kollect-it/og-home.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us',
    description: "Get in touch with our team of experts for authentication, appraisals, acquisitions, and consignment inquiries.",
    images: ['https://ext.same-assets.com/kollect-it/og-home.jpg'],
  },
};

export default function ContactPage() {
  return (
    <main className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Kollect-It",
          description: "Authenticated antiques, collectibles, and fine art marketplace",
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
        }) }}
      />

      <div className="text-center mb-[clamp(3rem,6vw,5rem)]">
        <p className="text-[12px] tracking-[0.2em] text-[var(--color-gold)] uppercase mb-4 font-normal">GET IN TOUCH</p>
        <h1 className="text-[clamp(36px,4vw,48px)] font-serif font-normal leading-[1.3] text-[var(--color-navy)]">Contact Our Team</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-[clamp(3rem,6vw,5rem)] items-start max-w-[1000px] mx-auto">
            {/* Left: Info */}
            <div>
              <h2 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] mb-6">
                We're Here to Help
              </h2>
              <p className="text-base leading-[1.7] text-[var(--color-gray-dark)] mb-8">
                Whether you're looking to acquire a rare piece, need an authentication, or have questions
                about our collection, our team of experts is ready to assist you.
              </p>

              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase mb-2">
                    Email
                  </h3>
                  <a href="mailto:hello@kollect-it.com" className="text-[var(--color-muted-gold)] text-base">
                    hello@kollect-it.com
                  </a>
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase mb-2">
                    Phone
                  </h3>
                  <a href="tel:+15551234567" className="text-[var(--color-muted-gold)] text-base">
                    +1 (555) 123-4567
                  </a>
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase mb-2">
                    Hours
                  </h3>
                  <p className="text-base text-[var(--color-gray-dark)]">
                    Monday – Friday: 9:00 AM – 6:00 PM EST<br />
                    Saturday: 10:00 AM – 4:00 PM EST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Validated Client Form */}
            <ContactForm />
          </div>
        </main>
      );
    }
