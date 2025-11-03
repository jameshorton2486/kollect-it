export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about authentication, shipping, returns, consignments, and collecting with Kollect-It.',
  openGraph: {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about authentication, shipping, returns, consignments, and collecting with Kollect-It.',
    images: ['https://ext.same-assets.com/kollect-it/og-home.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about authentication, shipping, returns, consignments, and collecting with Kollect-It.',
    images: ['https://ext.same-assets.com/kollect-it/og-home.jpg'],
  },
};

import CTA from '@/components/CTA';

const faqs = [
  {
    q: 'How do you authenticate items?',
    a: 'We use a rigorous multi-step authentication process combining expert appraisal by specialists with decades of experience, comprehensive provenance research, scientific analysis when appropriate, and third-party verification. Each item comes with a certificate of authenticity.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day return policy on all items. Items must be returned in their original condition with all certificates and documentation. Once we receive and inspect the return, we will process your refund within 5-7 business days.',
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Yes, we ship worldwide with full insurance and tracking. International shipments are handled by trusted carriers with expertise in fine art and antiques logistics. All customs documentation is prepared by our team.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Domestic shipping typically takes 3-5 business days. International shipping varies by destination but generally takes 7-14 business days. All items are fully insured during transit and require signature upon delivery.',
  },
  {
    q: 'Can I consign items with Kollect-It?',
    a: 'Absolutely! We welcome consignments of fine art, rare books, collectibles, and militaria. Submit photos and details through our consignment form, and our experts will review your items within 48 hours. We handle authentication, photography, listing, and marketing.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, wire transfers, and PayPal for qualified purchases. For high-value items, we can arrange secure payment through escrow services. All transactions use SSL encryption for your security.',
  },
  {
    q: 'How do I know if an item is still available?',
    a: 'Our website inventory is updated in real-time. If you can add an item to your cart, it is available. For additional confirmation, you can contact our team directly via the product inquiry form.',
  },
  {
    q: 'Do you offer appraisal services?',
    a: 'Yes, we provide professional appraisal services for insurance, estate planning, and sale purposes. Our appraisers are certified and specialize in fine art, rare books, collectibles, and militaria. Contact us for pricing and scheduling.',
  },
  {
    q: 'What is your commission structure for consignments?',
    a: 'Our commission rates vary based on the value and type of item. Generally, we charge 15-25% commission on sold items. There are no upfront fees—we only get paid when your item sells. Contact us for a detailed quote.',
  },
  {
    q: 'How can I track my order?',
    a: 'Once your order ships, you will receive a tracking number via email. You can use this number to track your shipment in real-time through the carrier\'s website. Our customer service team is also available to assist with tracking inquiries.',
  },
];

export default function FAQPage() {
  return (
    <main className="ki-section ki-container px-4 md:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-center mb-[clamp(3rem,6vw,5rem)]">
        <p className="text-[12px] tracking-[0.2em] text-[var(--color-gold)] uppercase mb-4 font-normal">HELP CENTER</p>
        <h1 className="text-[clamp(36px,4vw,48px)] font-serif font-normal leading-[1.3] text-[var(--color-navy)] mb-6">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto max-w-[700px] text-[16px] leading-[1.7] text-[var(--color-gray-dark)]">
          Find answers to common questions about our authentication process, shipping, returns, and consignment services.
        </p>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-[900px] mx-auto">
        {faqs.map((item, i) => (
          <details key={i} className="faq-item">
            <summary>{item.q}</summary>
            <div className="faq-answer">
              <p>{item.a}</p>
            </div>
          </details>
        ))}
      </div>

      {/* Contact CTA */}
      <CTA
        title="Still Have Questions?"
        description="Our team of experts is here to help. Contact us for personalized assistance."
        buttonText="Contact Us"
        buttonHref="/contact"
        bgClass="bg-[var(--color-cream)]"
        textClass="text-[var(--color-navy)]"
      />
    </main>
  );
}
