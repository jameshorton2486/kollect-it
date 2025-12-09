import Hero from "@/components/home/Hero";
import RecentAdditions from "@/components/home/RecentAdditions";
import CategoryGrid from "@/components/home/CategoryGrid";
import ValueBar from "@/components/home/ValueBar";
import ConsignmentTeaser from "@/components/home/ConsignmentTeaser";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const revalidate = 60;

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

export default async function HomePage() {
  // Fetch latest products
  const latestProducts = await prisma.product.findMany({
    where: { status: "active" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: true,
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  // Transform to card data format
  const latestCardData = latestProducts.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    slug: product.slug,
    images: product.images.length > 0 ? product.images : [{ url: "/placeholder.svg" }],
    category: product.category ? { name: product.category.name, slug: product.category.slug } : null,
  }));

  return (
    <main role="main" className="bg-lux-pearl">
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
