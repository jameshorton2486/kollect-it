import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from '@/lib/prisma';
import CTA from '@/components/CTA';

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
    <main className="ki-section container mx-auto px-4 md:px-6 lg:px-8 py-12">
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
      
      <div className="max-w-[700px] text-center mx-auto">
        <p className="text-[12px] tracking-[0.2em] text-[var(--color-gold)] uppercase mb-6 font-normal">
          ABOUT US
        </p>
        <h1 className="mb-6 text-[clamp(36px,4vw,48px)] font-serif font-normal leading-[1.3] text-[var(--color-navy)]">
          Authenticated Expertise
        </h1>
        <p className="text-[16px] leading-[1.8] text-[var(--color-navy)] mb-12">
          Our team includes historians, appraisers, and category specialists who verify authenticity and document provenance for every item we offer.
        </p>
      </div>

      <section className="bg-[#FAFAF8] rounded-sm p-8 md:p-12 max-w-[800px] mx-auto">
        <h2 className="text-[24px] font-serif font-normal mb-4 text-[var(--color-navy)]">Our Mission</h2>
        <p className="text-[16px] leading-[1.8] text-[rgba(50,41,35,0.9)]">
          We connect discerning collectors with rare, authenticated antiques and collectibles. Every piece in our collection is carefully vetted by our team of experts and comes with comprehensive documentation of its provenance and condition.
        </p>
      </section>

      {/* Gallery Image */}

      {/* Gallery Image 2 */}
      <section className="ki-section p-0">
        <div className="container mx-auto max-w-[1400px]">
          <Image
            src="https://images.squarespace-cdn.com/content/v1/5fa1332a8b3f520c382b9816/080eb5c5-a933-4d73-be16-52c8efc0fc57/IMG_7691.jpg"
            alt="Museum display furniture in a curated gallery setting"
            width={1600}
            height={900}
            className="w-full h-auto object-cover aspect-[16/9]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1400px"
            priority={false}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="ki-section bg-[#FAFAF8] text-center">
        <div className="container mx-auto max-w-[900px]">
          <p
            className="text-[12px] tracking-[0.2em] text-[var(--color-gold)] uppercase mb-4 font-normal"
          >
            CATEGORIES
          </p>
          <h2 className="font-serif text-[clamp(36px,4vw,48px)] font-normal mb-16 leading-[1.3] text-[var(--color-navy)]">
            What We Collect
          </h2>

          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-12 text-left">
            {categories.map((category) => (
              <div key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="category-link no-underline text-[18px] font-medium tracking-[0.05em] uppercase text-[var(--color-navy)] block mb-3 font-serif hover:text-[var(--color-muted-gold)] transition-colors"
                >
                  {category.name}
                </Link>
                <p className="text-[16px] leading-[1.8] text-[rgba(50,41,35,0.9)] font-light">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CTA
        title="Begin Your Collection"
        description="Explore our curated selection of authenticated antiques and collectibles."
        buttonText="Browse Collection"
        buttonHref="/"
      />

      {/* Global footer is rendered via ClientBody */}
    </main>
  );
}