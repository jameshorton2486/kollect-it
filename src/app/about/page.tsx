import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Kollect-It's team of experts and our commitment to authenticating and curating rare antiques, collectibles, and fine art.",
  openGraph: {
    title: "About Us",
    description: "Learn about Kollect-It's team of experts and our commitment to authenticating and curating rare antiques, collectibles, and fine art.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us",
    description: "Learn about Kollect-It's team of experts and our commitment to authenticating and curating rare antiques, collectibles, and fine art.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
  },
};

export const revalidate = 3600;

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.log('Database not available, using fallback categories');
    return [
      {
        id: '1',
        name: 'Fine Art',
        slug: 'fine-art',
        description: 'Authenticated art pieces spanning various periods and mediums, from paintings to prints and sculptures',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Antique Books',
        slug: 'antique-books',
        description: 'Scarce first editions, beautifully bound volumes, and literary treasures for discerning bibliophiles',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'Collectibles',
        slug: 'collectibles',
        description: 'Rare memorabilia, unique ephemera, vintage timepieces, and authenticated collectible items',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        name: 'Militaria',
        slug: 'militaria',
        description: 'Historical artifacts with documented provenance and significance, from military medals to period documents',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}

export default async function AboutPage() {
  const categories = await getCategories();

  return (
    <main className="bg-white" role="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Kollect-It",
          url: "https://kollect-it.com",
          description: "Authenticated antiques, collectibles, and fine art curated by specialists",
          logo: "https://ext.same-assets.com/kollect-it/logo.png",
          foundingDate: "2020",
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            url: "https://kollect-it.com/contact",
          },
          sameAs: [
            "https://www.instagram.com/",
            "https://www.facebook.com/",
            "https://www.youtube.com/",
          ],
        }) }}
      />

      {/* HERO SECTION */}
      <section className="py-20 md:py-32 bg-surface-1">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[12px] tracking-[0.2em] text-[var(--color-gold)] uppercase mb-6 font-normal">
              ABOUT US
            </p>
            <h1 className="font-display text-5xl md:text-6xl mb-6 leading-tight text-ink">
              Preserving History,<br />One Treasure at a Time
            </h1>
            <p className="text-xl md:text-2xl text-ink-light font-serif mb-8 leading-relaxed">
              Since 2020, Kollect-It has connected passionate collectors with authenticated antiques and the stories behind them. We believe every piece deserves expert care and appreciation.
            </p>
          </div>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-[12px] tracking-[0.2em] text-[var(--color-gold)] uppercase mb-4 font-normal">
              OUR STORY
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-8 leading-tight">
              Expertise Meets Passion
            </h2>
            
            <div className="prose prose-lg max-w-none space-y-6 text-ink-light leading-relaxed">
              <p className="text-lg md:text-xl font-serif italic mb-6">
                Kollect-It began with a simple belief: every antique deserves to be appreciated, preserved, and passed down with its story intact. Founded by a collective of historians, appraisers, and passionate collectors, we saw a gap in the marketplace for a platform that combined expertise, transparency, and genuine care for fine items.
              </p>

              <p className="text-base md:text-lg leading-8">
                Our founders spent years working in auction houses, museums, and private collections. They witnessed incredible treasures find their way to underappreciated settings—beautiful pieces whose histories went untold, whose authenticity was questioned, whose value was misunderstood. They also saw collectors struggling to find trustworthy sources for significant acquisitions, constantly worrying about authenticity and fair pricing.
              </p>

              <p className="text-base md:text-lg leading-8">
                The vision for Kollect-It emerged from these experiences: create a curated marketplace where authentication is rigorous, provenance is documented, pricing is fair, and every transaction is a relationship built on trust. We wanted to build something different—not a transaction platform, but a community dedicated to preservation and appreciation of fine objects.
              </p>

              <p className="text-base md:text-lg leading-8">
                Today, Kollect-It represents thousands of hours of expert curation, a network of trusted dealers and consignors, and a growing community of collectors who share our passion for quality and authenticity. We've authenticated pieces ranging from Victorian furniture to contemporary art, rare first editions to historical militaria. Each acquisition tells a story; our job is to help you understand and appreciate it.
              </p>

              <p className="text-base md:text-lg leading-8">
                Looking ahead, we're committed to deepening our expertise, expanding our community, and setting new standards for how authenticated antiques are bought and sold online. We're building the marketplace we wish existed when we started—professional, transparent, and genuinely invested in your success as a collector.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR VALUES SECTION */}
      <section className="py-16 md:py-24 bg-surface-1">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-[12px] tracking-[0.2em] text-[var(--color-gold)] uppercase mb-4 font-normal text-center">
              OUR VALUES
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-16 leading-tight text-center">
              What Guides Our Work
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="value-card bg-white p-8 rounded-lg shadow-sm">
                <h3 className="font-serif text-2xl text-ink mb-4">Authenticity First</h3>
                <p className="text-ink-light leading-relaxed">
                  Every item is rigorously verified by our team of experts with comprehensive documentation of materials, methods, and provenance. We stand behind every authentication.
                </p>
              </div>

              <div className="value-card bg-white p-8 rounded-lg shadow-sm">
                <h3 className="font-serif text-2xl text-ink mb-4">Complete Transparency</h3>
                <p className="text-ink-light leading-relaxed">
                  Full disclosure of condition, including detailed photographs, restoration history, and known issues. You see exactly what you're purchasing.
                </p>
              </div>

              <div className="value-card bg-white p-8 rounded-lg shadow-sm">
                <h3 className="font-serif text-2xl text-ink mb-4">Continuous Education</h3>
                <p className="text-ink-light leading-relaxed">
                  Sharing knowledge to help collectors make informed decisions. Our buying guides, authentication articles, and expert insights are freely available.
                </p>
              </div>

              <div className="value-card bg-white p-8 rounded-lg shadow-sm">
                <h3 className="font-serif text-2xl text-ink mb-4">Respectful Preservation</h3>
                <p className="text-ink-light leading-relaxed">
                  Treating each piece with the care, respect, and reverence it deserves. Conservation, proper handling, and security are non-negotiable.
                </p>
              </div>

              <div className="value-card bg-white p-8 rounded-lg shadow-sm">
                <h3 className="font-serif text-2xl text-ink mb-4">Community Building</h3>
                <p className="text-ink-light leading-relaxed">
                  Connecting collectors, dealers, historians, and enthusiasts. We're stronger together, sharing expertise and appreciation for our shared passion.
                </p>
              </div>

              <div className="value-card bg-white p-8 rounded-lg shadow-sm">
                <h3 className="font-serif text-2xl text-ink mb-4">Excellence Always</h3>
                <p className="text-ink-light leading-relaxed">
                  From expert photography to white glove service, we approach every detail with professionalism and attention to quality. Excellence isn't optional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE WORK SECTION */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-[12px] tracking-[0.2em] text-[var(--color-gold)] uppercase mb-4 font-normal text-center">
              OUR PROCESS
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-16 leading-tight text-center">
              How We Source & Authenticate
            </h2>

            <div className="space-y-8">
              <div className="process-step flex gap-6 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold text-white font-serif font-bold text-lg">
                    1
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-serif text-2xl text-ink mb-3">Sourcing & Discovery</h3>
                  <p className="text-ink-light leading-relaxed text-base md:text-lg">
                    We develop relationships with estate liquidators, auction houses, private consignors, and collectors worldwide. We're selective—only 1 in 10 pieces we evaluate make it to our platform. Each potential acquisition is assessed for quality, rarity, and fit with our community.
                  </p>
                </div>
              </div>

              <div className="process-step flex gap-6 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold text-white font-serif font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-serif text-2xl text-ink mb-3">Initial Assessment</h3>
                  <p className="text-ink-light leading-relaxed text-base md:text-lg">
                    Our specialists conduct a thorough preliminary examination, documenting all visible characteristics: materials, construction methods, signs of wear, repairs, and marks. We photograph items from multiple angles under professional lighting.
                  </p>
                </div>
              </div>

              <div className="process-step flex gap-6 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold text-white font-serif font-bold text-lg">
                    3
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-serif text-2xl text-ink mb-3">Expert Authentication</h3>
                  <p className="text-ink-light leading-relaxed text-base md:text-lg">
                    Category specialists with decades of experience conduct in-depth authentication. This includes comparison with known examples, technical analysis when needed, documentation review, and cross-reference with auction records and scholarly databases.
                  </p>
                </div>
              </div>

              <div className="process-step flex gap-6 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold text-white font-serif font-bold text-lg">
                    4
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-serif text-2xl text-ink mb-3">Research & Documentation</h3>
                  <p className="text-ink-light leading-relaxed text-base md:text-lg">
                    We research provenance, historical context, maker information, and market comparables. Each item receives a detailed description that tells its story: where it comes from, how it was made, why it matters, and how to care for it.
                  </p>
                </div>
              </div>

              <div className="process-step flex gap-6 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold text-white font-serif font-bold text-lg">
                    5
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-serif text-2xl text-ink mb-3">Professional Photography & Listing</h3>
                  <p className="text-ink-light leading-relaxed text-base md:text-lg">
                    Studio photography captures every detail. Condition notes are precise and honest. Pricing is based on comparable sales, rarity, condition, and market demand. Each listing is crafted to educate and inspire.
                  </p>
                </div>
              </div>

              <div className="process-step flex gap-6 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold text-white font-serif font-bold text-lg">
                    6
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-serif text-2xl text-ink mb-3">Sale & White Glove Fulfillment</h3>
                  <p className="text-ink-light leading-relaxed text-base md:text-lg">
                    When an item sells, we handle everything: secure payment processing, professional packaging with archival materials, full insurance, and tracking. Your piece arrives as beautifully as it left our hands.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-16 md:py-24 bg-surface-1">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-[12px] tracking-[0.2em] text-[var(--color-gold)] uppercase mb-4 font-normal text-center">
              OUR TEAM
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-16 leading-tight text-center">
              Expert Specialists
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="team-member bg-white p-8 rounded-lg">
                <h3 className="font-serif text-2xl text-ink mb-2">Fine Art & Paintings</h3>
                <p className="text-ink-light leading-relaxed mb-4">
                  Our fine art specialists bring credentials from major museums and auction houses. With expertise spanning Old Masters to contemporary works, they verify authenticity through technical analysis, provenance research, and comparison with institutional records.
                </p>
              </div>

              <div className="team-member bg-white p-8 rounded-lg">
                <h3 className="font-serif text-2xl text-ink mb-2">Rare Books & Manuscripts</h3>
                <p className="text-ink-light leading-relaxed mb-4">
                  Our bibliophile specialists examine binding, printing, typography, and paper aging. They consult rare book databases, track first edition records, and assess condition with respect to academic standards. Every book is cataloged with full bibliographic information.
                </p>
              </div>

              <div className="team-member bg-white p-8 rounded-lg">
                <h3 className="font-serif text-2xl text-ink mb-2">Furniture & Decorative Arts</h3>
                <p className="text-ink-light leading-relaxed mb-4">
                  Our furniture experts evaluate construction methods, wood types, hardware, and design elements. They identify makers through labels and stylistic analysis, assess structural integrity, and determine appropriate restoration or conservation approaches.
                </p>
              </div>

              <div className="team-member bg-white p-8 rounded-lg">
                <h3 className="font-serif text-2xl text-ink mb-2">Collectibles & Militaria</h3>
                <p className="text-ink-light leading-relaxed mb-4">
                  Specialized knowledge in military history, medals, insignia, and period collectibles. Our team verifies authenticity through manufacturing records, cross-references historical documentation, and consults with military historians when needed.
                </p>
              </div>
            </div>

            <div className="mt-12 bg-white p-8 rounded-lg border border-surface-2">
              <h3 className="font-serif text-2xl text-ink mb-4">Credentials & Affiliations</h3>
              <p className="text-ink-light leading-relaxed mb-4">
                Our team members hold credentials from:
              </p>
              <ul className="space-y-2 text-ink-light">
                <li>• Certified Appraisers (American Society of Appraisers)</li>
                <li>• Certified Collections Specialists (Collections Trust)</li>
                <li>• Published authors and contributors to academic journals</li>
                <li>• Former museum curators and auction house specialists</li>
                <li>• Members of professional dealer associations and ethics boards</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-[12px] tracking-[0.2em] text-[var(--color-gold)] uppercase mb-4 font-normal text-center">
              CATEGORIES
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-16 leading-tight text-center">
              What We Collect
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="category-card bg-surface-1 p-8 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-serif text-2xl text-ink mb-3">
                    {category.name}
                  </h3>
                  <p className="text-ink-light leading-relaxed">
                    {category.description}
                  </p>
                  <span className="inline-block mt-4 text-accent-gold font-medium">
                    Explore →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 md:py-24 bg-accent-gold text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              Begin Your Collection
            </h2>
            <p className="text-xl mb-8 opacity-95">
              Explore our curated selection of authenticated antiques, rare books, fine art, and collectibles. Every piece has been carefully selected and verified by our experts.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-white text-accent-gold font-semibold px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Global footer is rendered via ClientBody */}
    </main>
  );
}