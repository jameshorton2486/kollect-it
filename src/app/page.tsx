import Hero from "@/components/Hero";
import FeaturedCollection from "@/components/FeaturedCollection";
import ProcessOverview from "@/components/ProcessOverview";
import TrustStrip from "@/components/TrustStrip";
import LatestArrivalsClient from "@/components/home/LatestArrivalsClient";
import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, latestProducts] = await Promise.all([
    prisma.product.findMany({
      where: { status: "active", featured: true },
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.product.findMany({
      where: { status: "active" },
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const latestCardData = latestProducts.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    slug: product.slug,
    image: product.images[0]?.url || "/images/products/placeholder.svg",
    category: product.category.name,
  }));

  return (
    <main role="main" className="bg-lux-pearl">
      <Hero />
      <TrustStrip />

      {featuredProducts.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-400">
                  Featured
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-ink-900">
                  Collector highlights
                </h2>
                <p className="mt-2 text-sm text-ink-600">
                  A rotating selection of authenticated pieces ready for the most
                  considered interiors.
                </p>
              </div>
            </div>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      <LatestArrivalsClient products={latestCardData} />
      <FeaturedCollection />
      <ProcessOverview />
    </main>
  );
}

