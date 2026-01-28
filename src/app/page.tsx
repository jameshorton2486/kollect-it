import Hero from "@/components/home/Hero";
import RecentAdditions from "@/components/home/RecentAdditions";
import CategoryGrid from "@/components/home/CategoryGrid";
import ValueBar from "@/components/home/ValueBar";
import ConsignmentTeaser from "@/components/home/ConsignmentTeaser";
import { Metadata } from "next";

// Force dynamic rendering - fetch fresh data on each request
// This prevents build-time database calls that fail without DATABASE_URL
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kollect-It | Curated Fine Art, Rare Books & Collectibles",
  description:
    "Curated fine art, rare books, collectibles, and militaria—handpicked for discerning collectors. Every piece is thoughtfully photographed and reviewed so you can shop with confidence.",
  alternates: {
    canonical: "https://kollect-it.com",
  },
  openGraph: {
    title: "Kollect-It | Curated Fine Art, Rare Books & Collectibles",
    description:
      "Curated fine art, rare books, collectibles, and militaria—handpicked for discerning collectors.",
    url: "https://kollect-it.com",
    type: "website",
  },
};

// Helper function to safely fetch products
async function getLatestProducts() {
  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set - returning empty products array");
    return [];
  }

  try {
    // Dynamic import to avoid build-time initialization
    const { prisma } = await import("@/lib/prisma");

    const products = await prisma.product.findMany({
      where: {
        status: "active",
        isDraft: false,
      },
      include: {
        Image: { orderBy: { order: "asc" }, take: 1 },
        Category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function HomePage() {
  // Fetch latest products with error handling
  const latestProducts = await getLatestProducts();

  // Transform to card data format
  const latestCardData = latestProducts.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    slug: product.slug,
    Image: product.Image.length > 0 ? product.Image : [{ url: "/placeholder.svg" }],
    category: product.Category ? { name: product.Category.name, slug: product.Category.slug } : null,
  }));

  // Organization schema for SEO
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kollect-It",
    url: "https://kollect-it.com",
    logo: "https://kollect-it.com/logo.png",
    description: "Curated marketplace for fine antiques, rare books, collectibles, and militaria.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Antonio",
      addressRegion: "TX",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-469-386-6065",
      contactType: "customer service",
      email: "jameshorton2486@gmail.com",
    },
  };

  return (
    <main role="main" className="bg-lux-pearl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* Section 1: Hero */}
      <Hero />

      {/* Section 2: Recent Additions */}
      <RecentAdditions products={latestCardData} />

      {/* Section 3: Category Grid (2x2) */}
      <CategoryGrid />

      {/* Section 4: Value / Trust Bar */}
      <ValueBar />

      {/* Section 5: Consignment Teaser */}
      <ConsignmentTeaser />
    </main>
  );
}
