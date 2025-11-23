import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/image";
import { prisma } from "@/lib/prisma";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import { AesopSection } from "@/components/AesopSection";

export const metadata: Metadata = {
  title: "Shop All Collections",
  description:
    "Browse our curated collections of authenticated fine art, antique books, collectibles, and militaria with verified provenance.",
  openGraph: {
    title: "Shop All Collections",
    description:
      "Browse our curated collections of authenticated fine art, antique books, collectibles, and militaria with verified provenance.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Collections",
    description:
      "Browse our curated collections of authenticated fine art, antique books, collectibles, and militaria with verified provenance.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
  },
};

export const revalidate = 60;

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("Database not available, using fallback categories");
    }
    return [
      {
        id: "1",
        name: "Fine Art",
        slug: "fine-art",
        description:
          "Authenticated art pieces spanning various periods and mediums",
        image:
          "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      },
      {
        id: "2",
        name: "Antique Books",
        slug: "antique-books",
        description: "Scarce first editions and literary treasures",
        image:
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
      },
      {
        id: "3",
        name: "Collectibles",
        slug: "collectibles",
        description: "Rare memorabilia and unique ephemera",
        image:
          "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80",
      },
      {
        id: "4",
        name: "Militaria",
        slug: "militaria",
        description: "Historical artifacts with documented provenance",
        image: "https://ext.same-assets.com/kollect-it/militaria.jpg",
      },
    ];
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string | string[] }>;
}) {
  const categories = await getCategories();
  const sp = (await searchParams) || {};
  const qParam =
    typeof sp.q === "string"
      ? sp.q.trim()
      : Array.isArray(sp.q)
        ? sp.q[0]?.trim()
        : "";
  const q = qParam || "";

  let products: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    condition: string | null;
    images: { url: string }[];
    category: { name: string };
  }> = [];

  if (q) {
    try {
      products = await prisma.product.findMany({
        where: {
          status: "active",
          title: { contains: q, mode: "insensitive" },
        },
        include: {
          images: { orderBy: { order: "asc" } },
          category: true,
        },
        orderBy: { createdAt: "desc" },
        take: 60,
      });
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.log("Search query failed, returning empty results");
      }
    }
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Shop All Collections",
            description:
              "Browse our curated collections of authenticated fine art, antique books, collectibles, and militaria",
            url: "https://kollect-it.com/shop",
            mainEntity: {
              "@type": "ItemList",
              name: "Featured Collections",
              numberOfItems: categories.length,
              itemListElement: categories.map((cat, idx) => ({
                "@type": "CollectionPage",
                position: idx + 1,
                name: cat.name,
                description: cat.description,
                url: `https://kollect-it.com/category/${cat.slug}`,
              })),
            },
          }),
        }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
        ]}
      />

      {/* Page Content */}
          {/* Search Results */}
          {q && (
            <AesopSection variant="cream">
              <div className="mb-10">
              <h2 className="font-serif text-2xl mb-2">
                Search results for “{q}”
              </h2>
              {products.length > 0 ? (
                <>
                  <p className="text-ink-700 mb-4">
                    {products.length} result{products.length === 1 ? "" : "s"}
                  </p>
                  <ProductGrid products={products} />
                </>
              ) : (
                <div className="rounded border border-border-300 bg-cream p-6">
                  <p className="text-ink-700">
                    No products found. Try a different search term.
                  </p>
                  <div className="mt-3">
                    <Link href="/shop" className="underline">
                      Back to Shop
                    </Link>
                  </div>
                </div>
              )}
            </div>
            </AesopSection>
          )}

          {/* Animated Headline */}
          <AesopSection variant="sand">
            <div className="shop-intro text-center mb-[clamp(3rem,6vw,5rem)]">
              <p className="section-subtitle" data-reveal>
                PROFESSIONALLY CURATED COLLECTIONS
              </p>
              <h1
                className="section-title-main"
                data-reveal
                data-reveal-delay="100"
              >
                Shop by Category
              </h1>
              <p
                className="max-w-[700px] mx-auto text-base leading-[1.7] text-ink-700"
                data-reveal
                data-reveal-delay="200"
              >
                Browse rare books, fine art, collectibles, and historical
                artifacts. Professionally described, fairly priced, personally
                curated.
              </p>
            </div>
          </AesopSection>

          {/* Category Grid 2x2 */}
          <AesopSection variant="olive">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group block overflow-hidden rounded border border-border-300 bg-surface-0 shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={category.image}
                      alt={`${category.name} banner`}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      quality={85}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="ki-heading-sm mb-1">{category.name}</h4>
                    <p className="ki-text-sm text-ink-700">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </AesopSection>

    </main>
  );
}

