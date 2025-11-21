import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about authentication, shipping, returns, consignments, and collecting with Kollect-It.",
  openGraph: {
    title: "Frequently Asked Questions",
    description:
      "Find answers to common questions about authentication, shipping, returns, consignments, and collecting with Kollect-It.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions",
    description:
      "Find answers to common questions about authentication, shipping, returns, consignments, and collecting with Kollect-It.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
  },
};

const faqCategories = [
  {
    id: "buying",
    title: "Buying & Ordering",
    icon: "🛍️",
    faqs: [
      {
        q: "How do I place an order?",
        a: "Browse our collection, select an item, review the condition and details, and add it to your cart. Proceed to checkout where you can review your order, select shipping method, and enter payment information. You'll receive an order confirmation via email with tracking information.",
      },
      {
        q: "Do I need an account to purchase?",
        a: "You can purchase as a guest without creating an account. However, creating an account allows you to save items to your wishlist, track your orders, and access your purchase history. It also makes future purchases quicker and easier.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, wire transfers for high-value items, and bank transfers. All payment processing is secured with SSL encryption technology. For items over $5,000, we can arrange secure escrow payment options.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All payment information is encrypted using industry-standard SSL encryption. We never store your full credit card details on our servers. Our payment processing is PCI-DSS compliant, meeting the highest security standards for online transactions.",
      },
      {
        q: "Can I purchase multiple items at once?",
        a: "Absolutely. Add multiple items to your cart and proceed to checkout. Shipping costs are calculated based on total weight and destination. You may save money on shipping when combining orders compared to purchasing items separately.",
      },
      {
        q: "Do you offer payment plans or financing for expensive items?",
        a: "For items over $2,500, we can arrange layaway options. We also work with select financing partners for qualified customers. Contact our sales team at sales@kollect-it.com to discuss payment plan options for specific items.",
      },
      {
        q: "What if an item sells out while it's in my cart?",
        a: "If an item becomes unavailable after you add it to your cart but before checkout, we'll notify you immediately and offer to place you on a waitlist. We'll also recommend similar items from our collection.",
      },
      {
        q: "How often is your inventory updated?",
        a: "Our inventory is updated continuously throughout the day as new items are cataloged and authenticated. Popular items may sell quickly, so we recommend checking regularly or signing up for notifications on specific categories.",
      },
      {
        q: "Can I place a hold on an item?",
        a: "Yes. Contact our sales team with the item number or title, and we can place a 48-hour hold while you make your decision. Premium members can place 30-day holds on items up to $5,000.",
      },
      {
        q: "Do you offer gifts or gift certificates?",
        a: "Yes! We offer digital gift certificates in any amount, perfect for collectors. Available at checkout or contact our gift concierge at gifts@kollect-it.com for custom presentations.",
      },
    ],
  },
  {
    id: "authentication",
    title: "Authentication & Quality",
    icon: "✓",
    faqs: [
      {
        q: "How do you authenticate items?",
        a: "We use a rigorous multi-step authentication process: expert appraisal by category specialists with 20+ years experience, comprehensive provenance research, scientific analysis when appropriate (materials testing, aging analysis), and third-party verification through auction records and academic databases. Each item receives a certificate of authenticity documenting our findings.",
      },
      {
        q: "Do items come with certificates of authenticity?",
        a: "Yes, every item in our collection includes a detailed certificate of authenticity. It documents authentication method, condition assessment, measurements, provenance information, and our expert stamp of approval. Certificates are transferable and add to resale value.",
      },
      {
        q: "What do the condition ratings mean?",
        a: "Mint/Like New: No visible wear, original condition. Excellent: Minor wear consistent with age, fully functional. Very Good: Expected wear for age, all original parts. Good: Obvious wear, minor repairs, all original parts. Fair: Heavy wear, repairs present, may need conservation.",
      },
      {
        q: "How accurate are your condition descriptions?",
        a: "Very accurate. Our photographers capture items under professional lighting from multiple angles. Condition notes are detailed and honest, including all flaws, repairs, and restoration work. High-resolution photos allow you to inspect items closely before purchase.",
      },
      {
        q: "Can I request additional photos or information about an item?",
        a: "Absolutely. Contact our authentication team at auth@kollect-it.com with the item number and specific questions. We provide additional photos, detailed measurements, and expert insights within 24 hours.",
      },
      {
        q: "What if I'm not satisfied with the authenticity after purchase?",
        a: "We stand behind every authentication. If you have concerns, contact us within 30 days with documentation. We're happy to review your findings with our experts. If we determine an item doesn't match our authentication, we'll offer a full refund or exchange.",
      },
      {
        q: "Do you authenticate items for people outside the marketplace?",
        a: "Yes! We offer professional appraisal and authentication services for insurance, estate planning, and sale purposes. Our appraisers are certified and charge competitive rates. Contact appraisals@kollect-it.com for pricing and scheduling.",
      },
      {
        q: "How can I learn to authenticate items myself?",
        a: "We publish weekly authentication guides and tips on our blog. Our Learning Center features video tutorials on identifying markers, materials, and construction techniques across different categories. Premium members get exclusive access to expert webinars.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    icon: "📦",
    faqs: [
      {
        q: "How long does shipping take?",
        a: "Domestic shipping: 3-5 business days. International: 7-14 business days depending on destination. All estimates are provided at checkout and include handling time. You can upgrade to expedited shipping options for faster delivery.",
      },
      {
        q: "How much does shipping cost?",
        a: "Shipping rates are calculated at checkout based on item weight, dimensions, and destination. We offer competitive rates through our carrier partnerships. Orders over $500 qualify for free domestic shipping. International shipping varies by location.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes! We ship worldwide with full insurance and tracking. International shipments are handled by trusted carriers specializing in fine art and antiques logistics. All customs documentation is prepared by our team. Contact us for quotes on high-value international shipments.",
      },
      {
        q: "How are fragile items packaged?",
        a: "Fragile items receive special care. We use archival-quality packaging materials, custom foam inserts, multiple protective layers, and shock-absorbing padding. Fine art is wrapped in acid-free paper, ceramics are individually cushioned, and furniture receives reinforced packaging. We inspect items before packing to document baseline condition.",
      },
      {
        q: "Is shipping insured?",
        a: "Yes! Standard insurance is included on all shipments. For items over $5,000, additional insurance is automatically added. You can also purchase additional coverage at checkout. All policies cover loss and damage during transit.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order ships, you'll receive a tracking number via email. You can track your shipment in real-time through the carrier's website. Our customer service team is also available to assist with tracking inquiries.",
      },
      {
        q: "What if I'm not home when my package arrives?",
        a: "All shipments require a signature. If you're unavailable, the carrier will leave a notice. You can arrange redelivery through the carrier or pick up from their facility. Contact us if you need special delivery arrangements (signature waiver, specific time window).",
      },
      {
        q: "Do you offer white glove delivery?",
        a: "Yes, for large furniture items. White glove service includes door delivery, placement in your home, unpacking, and basic setup. Available for additional fee. Contact sales@kollect-it.com to arrange for your purchase.",
      },
      {
        q: "What if my item arrives damaged?",
        a: "Contact us immediately with photos. We handle all insurance claims directly. Most damaged items are replaced or refunded within 5-7 business days. Never refuse delivery—always accept packages and document any visible damage on the delivery slip.",
      },
      {
        q: "Can I change the delivery address after purchasing?",
        a: "If your order hasn't shipped yet, contact us immediately at support@kollect-it.com and we can update your address. Once items ship, contact the carrier to arrange redirection if available.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    icon: "↩️",
    faqs: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return window from delivery date. Items must be in their original condition with all documentation and packaging materials. Once we receive and inspect the return, we process refunds within 5-7 business days. Return shipping is covered for defective or misrepresented items.",
      },
      {
        q: "How do I initiate a return?",
        a: "Contact our customer service team at returns@kollect-it.com within 30 days with your order number and reason for return. We'll provide a prepaid return shipping label and instructions. Pack the item securely and include all original documentation.",
      },
      {
        q: "Who pays for return shipping?",
        a: "If the item doesn't match our description or arrives damaged, we cover return shipping. If you're returning a perfectly authentic item in original condition because you changed your mind, you cover return shipping. Either way, we process refunds promptly.",
      },
      {
        q: "How long do refunds take?",
        a: "Once we receive and inspect your return, we process the refund within 5-7 business days. Refunds appear back to your original payment method. Bank transfers may take an additional 1-3 business days to appear in your account.",
      },
      {
        q: "What condition does an item need to be in to return it?",
        a: "Items should be in the same condition as received. For collectibles, minimal wear is normal. For furniture, no new damage. All included documentation, certificates, and packaging should be included. Items should not be professionally cleaned, repaired, or altered.",
      },
      {
        q: "Can I exchange an item instead of returning it?",
        a: "Yes! If you'd like to exchange for a similar item, we can often arrange this directly without a full return. Contact our customer service team to discuss options. Exchanges are typically processed faster than separate return and purchase transactions.",
      },
      {
        q: "What if my item arrives damaged?",
        a: "Contact us immediately with photos of the damage. We handle insurance claims directly and typically offer a replacement or full refund. Never refuse delivery—accept packages and document any visible damage on the delivery slip.",
      },
      {
        q: "What if I'm unhappy with my purchase?",
        a: "We want you to be completely satisfied. Contact our team and describe the issue. Many concerns can be resolved without returns—condition photos, additional information, or expert consultation. If return is appropriate, we make the process simple.",
      },
    ],
  },
  {
    id: "selling",
    title: "Selling & Consignment",
    icon: "💰",
    faqs: [
      {
        q: "How does consignment work?",
        a: "Submit photos and details through our consignment form. Our experts review within 48 hours and provide an appraisal. If accepted, we handle professional photography, detailed listing, marketing, and sale. When your item sells, we handle fulfillment and pay you your commission within 7 days of delivery confirmation.",
      },
      {
        q: "What items do you accept?",
        a: "We accept fine art, rare books, furniture, collectibles, jewelry, militaria, and other authenticated antiques. Items should be original or limited edition, 50+ years old (exceptions made for significant contemporary art), in good to excellent condition, and have clear or researched provenance.",
      },
      {
        q: "What are your commission rates?",
        a: "Standard items ($50-$1,000): 30%. Premium items ($1,000-$5,000): 25%. Luxury items ($5,000+): 20%. No upfront fees—we only get paid when your item sells. Rate includes photography, listing, marketing, and fulfillment.",
      },
      {
        q: "How long does it take to sell my item?",
        a: "Average time on market: Standard items 2-6 weeks, Premium items 1-4 weeks, Luxury items varies by rarity. Popular categories sell faster. Items remain active for 90 days unless extended. Contact us to renew listings that don't sell.",
      },
      {
        q: "How do you determine pricing?",
        a: "Our appraisers research comparable sales, auction results, market demand, and rarity. We base pricing to sell within 30-60 days at fair market value. We provide recommendations but welcome your input. Competitive pricing helps your item sell faster.",
      },
      {
        q: "Do I need to ship items to you?",
        a: "It depends on location and item size. Local items under $500 can be picked up. Items $500-$5,000 typically use prepaid shipping. Luxury items ($5,000+) may qualify for white glove pickup at no cost. Contact our consignment team to arrange.",
      },
      {
        q: "Can I get my items back if they don't sell?",
        a: "Yes. Items remain active for 90 days. If not sold, we return them to you prepaid. You can request return shipment anytime. No fees for unsold items except return shipping which we cover.",
      },
      {
        q: "When do I get paid?",
        a: "Payment is processed within 7 days of confirmed delivery. We typically send via bank transfer. You receive itemized documentation of the sale price, fees, and your payment amount.",
      },
      {
        q: "Do you sell items directly to dealers?",
        a: "Yes. Established dealers often get priority placement and may qualify for special rates. Contact partnerships@kollect-it.com to discuss wholesale opportunities.",
      },
      {
        q: "What if I want to sell multiple items?",
        a: "Perfect! Consign as many items as you'd like. Bulk consignments may qualify for adjusted rates. We process everything on a rolling basis—each item is evaluated and listed independently.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Technical",
    icon: "⚙️",
    faqs: [
      {
        q: "Do I need an account to make a purchase?",
        a: "No. You can purchase as a guest without creating an account. However, creating an account has benefits: save items to wishlist, track orders, view purchase history, and faster checkout for future purchases.",
      },
      {
        q: "How do I reset my password?",
        a: 'On the login page, click "Forgot password?" Enter your email address, and we\'ll send a password reset link within 5 minutes. Follow the link to create a new password. For security, password reset links expire after 1 hour.',
      },
      {
        q: "How do I update my shipping address?",
        a: "Log into your account and go to Settings > Addresses. You can add, edit, or delete addresses anytime. If you need to change your address for an order that hasn't shipped yet, contact us immediately.",
      },
      {
        q: "Can I save items to a wishlist?",
        a: "Yes! Click the heart icon on any product to save to your wishlist. Account holders can access their wishlist anytime. You'll receive email notifications if prices change or items become unavailable.",
      },
      {
        q: "How do I manage my email preferences?",
        a: "Log into your account and go to Settings > Email Preferences. Choose which types of communications you'd like to receive: order updates, product recommendations, new arrivals, sales, and event invitations.",
      },
      {
        q: "Is there a mobile app?",
        a: "We're mobile-optimized for browsing and purchasing on phones and tablets. Our responsive design works seamlessly on all devices. Native apps are in development for iOS and Android.",
      },
      {
        q: "What if I forgot my email address?",
        a: "Contact our customer service team at support@kollect-it.com with your name and any associated phone number or address. We can help you recover your account.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Settings > Account > Delete Account. This removes your personal information from our active systems (we retain transaction records as required by law). You can create a new account anytime using the same email.",
      },
    ],
  },
  {
    id: "marketplace",
    title: "About Our Marketplace",
    icon: "🏪",
    faqs: [
      {
        q: "What makes Kollect-It different?",
        a: "We combine expert curation with strict authentication, transparent pricing, and white glove service. Every seller is vetted, every item is authenticated, and every transaction is backed by our guarantee. We're built for serious collectors by passionate experts.",
      },
      {
        q: "Who are your sellers?",
        a: "Our sellers are established dealers, certified appraisers, auction houses, museums, estates, and trusted collectors. Each seller undergoes vetting including background checks, authentication credentials, and customer reviews. All items are individually authenticated before listing.",
      },
      {
        q: "Do you have a physical location?",
        a: "Kollect-It is currently online-only, allowing us to offer lower prices and wider selection than physical gallery models. For significant purchases or consignments, we can arrange private consultations via video or phone.",
      },
      {
        q: "How long has Kollect-It been in business?",
        a: "Founded in 2020, Kollect-It has quickly become a trusted marketplace for authenticated antiques and collectibles. Our team brings 150+ combined years of auction house, museum, and dealer experience.",
      },
      {
        q: "Are you affiliated with any major auction houses?",
        a: "We maintain independence as a curated marketplace. Our team includes former specialists from major houses, and we maintain professional relationships across the antiques industry for provenance research and authentication verification.",
      },
      {
        q: "What are your future plans?",
        a: "We're expanding our categories, building an in-app bidding platform for limited-time offerings, launching a membership program with exclusive benefits, and opening regional authentication labs in major cities.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="bg-surface-0" role="main">
      {/* HERO SECTION */}
      <section className="py-20 md:py-28 bg-surface-1">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-[12px] tracking-[0.2em] text-[hsl(var(--gold-500))] uppercase mb-6 font-normal">
              HELP CENTER
            </p>
            <h1 className="font-serif text-5xl md:text-6xl text-ink mb-6 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-ink-light leading-relaxed">
              Find answers to common questions about authentication, shipping,
              returns, collecting, and our consignment services. Can't find what
              you're looking for? Contact our team anytime.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ CATEGORIES SECTION */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {faqCategories.map((category) => (
              <div
                key={category.id}
                id={category.id}
                className="mb-16 md:mb-20"
              >
                <div className="flex items-center gap-4 mb-12">
                  <span className="text-4xl">{category.icon}</span>
                  <h2 className="font-serif text-4xl md:text-5xl text-ink">
                    {category.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.faqs.map((faq, idx) => (
                    <details
                      key={idx}
                      className="faq-item group border border-surface-2 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <summary className="cursor-pointer font-semibold text-ink text-lg flex justify-between items-start gap-4 select-none">
                        {faq.q}
                        <span className="flex-shrink-0 text-gold text-2xl group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <div className="faq-answer mt-6 text-ink-light leading-relaxed border-t border-surface-2 pt-6">
                        <p>{faq.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STILL NEED HELP SECTION */}
      <section className="py-16 md:py-24 bg-surface-1">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-serif text-4xl text-ink mb-4">
              Still Have Questions?
            </h3>
            <p className="text-xl text-ink-light mb-8">
              Our team of experts is here to help. Reach out with any questions
              about our collection, authentication, consignment, or anything
              else.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-block bg-gold text-white font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                Contact Us
              </Link>
              <Link
                href="/sell"
                className="inline-block bg-surface-0 text-gold font-semibold px-8 py-4 rounded-lg border-2 border-gold hover:bg-gold hover:text-white transition-colors"
              >
                Sell With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

