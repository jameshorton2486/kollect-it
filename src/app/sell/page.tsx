import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell Your Collection - Kollect-It',
  description: 'Consign your rare pieces with Kollect-It. Expert authentication, fair pricing, and white-glove service for discerning collectors.',
  openGraph: {
    title: 'Sell Your Collection - Kollect-It',
    description: 'Consign your rare pieces with Kollect-It. Expert authentication, fair pricing, and white-glove service for discerning collectors.',
    images: ['https://ext.same-assets.com/kollect-it/og-home.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sell Your Collection - Kollect-It',
    description: 'Consign your rare pieces with Kollect-It. Expert authentication, fair pricing, and white-glove service for discerning collectors.',
    images: ['https://ext.same-assets.com/kollect-it/og-home.jpg'],
  },
};

export default function SellPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="ki-section bg-[var(--color-cream)]">
        <div className="ki-container">
          <p className="section-subtitle" data-reveal>CONSIGNMENT SERVICES</p>
          <h1 className="section-title-main" data-reveal data-reveal-delay="100">
            Sell Your Collection
          </h1>
          <p className="text-center max-w-[700px] mx-auto text-[17px] leading-[1.7] text-[var(--color-gray-dark)]" data-reveal data-reveal-delay="200">
            Consign your rare pieces with Kollect-It. Expert authentication, fair pricing, and white-glove service for discerning collectors.
          </p>
        </div>
      </section>

      {/* Animated Timeline Section */}
      <section className="ki-section">
        <div className="ki-container">
          <h2 className="section-subtitle text-center mb-12">
            HOW IT WORKS
          </h2>

          <div className="timeline-container">
            <div className="timeline-line">
              <div className="timeline-line-fill" />
            </div>

            <div className="timeline-steps">
              <div className="timeline-step">
                <div className="timeline-number">
                  1
                  <span className="timeline-tooltip" title="Submit photos and details of your item">ℹ️</span>
                </div>
                <h3>Submit Your Item</h3>
                <p>Share photos and details through our secure consignment form</p>
              </div>

              <div className="timeline-step">
                <div className="timeline-number">
                  2
                  <span className="timeline-tooltip" title="Our experts review authenticity and market value">ℹ️</span>
                </div>
                <h3>Expert Review</h3>
                <p>Our specialists authenticate and appraise your piece</p>
              </div>

              <div className="timeline-step">
                <div className="timeline-number">
                  3
                  <span className="timeline-tooltip" title="We handle photography, listing, and marketing">ℹ️</span>
                </div>
                <h3>Professional Listing</h3>
                <p>We create a compelling listing with expert photography</p>
              </div>

              <div className="timeline-step">
                <div className="timeline-number">
                  4
                  <span className="timeline-tooltip" title="Secure payment within 7 days of sale">ℹ️</span>
                </div>
                <h3>Get Paid</h3>
                <p>Receive payment promptly once your item sells</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="ki-section bg-[var(--color-cream)]">
        <div className="ki-container">
          <h2 className="section-subtitle text-center mb-12">
            WHY CONSIGN WITH US
          </h2>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] gap-12 max-w-[1000px] mx-auto">
            <div className="text-center" data-reveal>
              <h3 className="text-[18px] font-semibold mb-4">Expert Authentication</h3>
              <p className="text-[15px] leading-[1.6] text-[var(--color-gray-dark)]">
                Every item is verified by specialists with decades of experience
              </p>
            </div>
            <div className="text-center" data-reveal data-reveal-delay="150">
              <h3 className="text-[18px] font-semibold mb-4">Transparent Pricing</h3>
              <p className="text-[15px] leading-[1.6] text-[var(--color-gray-dark)]">
                Fair market valuations with no hidden fees
              </p>
            </div>
            <div className="text-center" data-reveal data-reveal-delay="300">
              <h3 className="text-[18px] font-semibold mb-4">Global Reach</h3>
              <p className="text-[15px] leading-[1.6] text-[var(--color-gray-dark)]">
                Access to our network of collectors worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Shimmer */}
      <section className="ki-section">
        <div className="ki-container text-center">
          <h2 className="section-title mb-8">
            Ready to Consign?
          </h2>
          <p className="max-w-[600px] mx-auto mb-8 text-[16px] leading-[1.7] text-[var(--color-gray-dark)]">
            Start the consignment process today and let our experts handle the rest.
          </p>
          <Link href="/contact" className="btn-primary cta-shimmer text-[15px] py-4 px-12">
            GET STARTED TODAY
          </Link>
        </div>
      </section>
    </div>
  );
}
