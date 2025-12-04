import Hero from "@/components/Hero";
import ProcessOverview from "@/components/ProcessOverview";
import TrustStrip from "@/components/TrustStrip";
import LatestArrivalsClient from "@/components/home/LatestArrivalsClient";
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
  const latestProducts = await prisma.product.findMany({
    where: { status: "active" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: true,
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

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
      <Hero />
      <TrustStrip />

      <div className="py-16 sm:py-24">
        <LatestArrivalsClient products={latestCardData} />
      </div>
      
      <ProcessOverview />
    </main>
  );
}
