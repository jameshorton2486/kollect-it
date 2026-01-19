import { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

async function getCategoryData(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      subcategories: {
        orderBy: { name: "asc" },
      },
      products: {
        where: { 
          status: "active",
          isDraft: false,
        },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          category: true,
          subcategory: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function generateMetadata(
  props: CategoryPageProps,
): Promise<Metadata> {
  const { params } = props;
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return {
      title: "Category Not Found – Kollect-It",
      description: "The requested collection could not be found.",
    };
  }

  const description = category.description ||
    `Browse authenticated ${category.name.toLowerCase()} at Kollect-It. Carefully curated and quality-reviewed pieces.`;

  return {
    title: `${category.name} | Kollect-It`,
    description,
    alternates: {
      canonical: `https://kollect-it.com/category/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | Kollect-It`,
      description,
      url: `https://kollect-it.com/category/${category.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${category.name} | Kollect-It`,
      description,
    },
  };
}

export default async function CategoryPage(props: CategoryPageProps) {
  const { params } = props;
  const { slug } = await params;
  const category = await getCategoryData(slug);

  if (!category) {
    notFound();
  }

  const products = category.products;

  // CollectionPage structured data for SEO
  const categoryJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description || `Browse ${category.name} at Kollect-It`,
    url: `https://kollect-it.com/category/${category.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Kollect-It",
      url: "https://kollect-it.com",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://kollect-it.com/product/${product.slug}`,
      })),
    },
  };

  return (
    <main className="bg-lux-pearl text-ink-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />
      <PageHeader
        label="Category"
        title={category.name}
        description={
          category.description ||
          "A carefully selected collection of pieces in this category, each one chosen for its quality, character, or story."
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name, href: `/category/${category.slug}` },
        ]}
        maxWidth="4xl"
      />

      {/* Subcategories Section */}
      {category.subcategories && category.subcategories.length > 0 && (
        <section className="bg-lux-pearl section-normal">
          <div className="container mx-auto max-w-4xl">
            <h2 className="heading-section text-lux-black mb-6">
              Browse by Subcategory
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {category.subcategories.map((sub) => {
                const subProductCount = products.filter(
                  (p) => p.subcategoryId === sub.id
                ).length;
                return (
                  <Link
                    key={sub.id}
                    href={`/subcategory/${sub.slug}`}
                    className="group border border-lux-silver-soft bg-lux-white p-4 rounded-lg hover:border-lux-gold hover:shadow-soft transition-all"
                  >
                    <div className="heading-subsection text-lux-black group-hover:text-lux-gold transition-colors">
                      {sub.name}
                    </div>
                    {subProductCount > 0 && (
                      <div className="text-lux-gray-dark mt-1">
                        {subProductCount} {subProductCount === 1 ? "item" : "items"}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-lux-pearl section-normal">
        <div className="container mx-auto max-w-4xl">
          {products.length > 0 ? (
            <>
              <div className="mb-10 space-y-2">
                <h2 className="heading-section text-lux-black">
                  All {category.name} Pieces
                </h2>
                <p className="text-lux-gray-dark">
                  {products.length === 1
                    ? "One piece currently available in this category."
                    : `${products.length} pieces currently available in this category.`}
                </p>
              </div>
              <ProductGrid products={products} />
            </>
          ) : (
            <EmptyState
              icon={Package}
              title="No pieces available in this category right now"
              description="I'm always adding new pieces to the collection. Check back soon, or let me know what you're looking for and I'll keep an eye out for similar pieces."
              primaryAction={{ label: "Contact Me", href: "/contact" }}
              secondaryAction={{ label: "Browse All Categories", href: "/browse" }}
            />
          )}
        </div>
      </section>
    </main>
  );
}
