import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";

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

  return (
    <main className="bg-lux-pearl text-ink-900">
      <section className="border-b border-border-200 bg-white">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6 lg:py-16">
          <Link
            href="/categories"
            className="inline-flex items-center text-sm font-semibold text-ink-600 transition-colors hover:text-ink-900"
          >
            <span aria-hidden="true" className="mr-2">
              ←
            </span>
            Back to all categories
          </Link>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-700">
              Category
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              {category.name}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              {category.description ||
                "A carefully selected collection of pieces in this category, each one chosen for its quality, character, or story."}
            </p>
          </div>
        </div>
      </section>

      {/* Subcategories Section */}
      {category.subcategories && category.subcategories.length > 0 && (
        <section className="border-b border-border-200 bg-surface-50">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
            <h2 className="text-2xl font-semibold tracking-tight text-ink-900 mb-6">
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
                    className="group border border-border-200 bg-white p-4 rounded-lg hover:border-lux-gold hover:shadow-soft transition-all"
                  >
                    <div className="font-medium text-ink-900 group-hover:text-lux-gold transition-colors">
                      {sub.name}
                    </div>
                    {subProductCount > 0 && (
                      <div className="text-xs text-ink-600 mt-1">
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

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          {products.length > 0 ? (
            <>
              <div className="mb-10 space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
                  All {category.name} Pieces
                </h2>
                <p className="text-sm text-ink-600">
                  {products.length === 1
                    ? "One piece currently available in this category."
                    : `${products.length} pieces currently available in this category.`}
                </p>
              </div>
              <ProductGrid products={products} />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-200 bg-surface-50 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-ink-900 mb-2">
                No pieces available in this category right now
              </p>
              <p className="text-sm text-ink-600 max-w-2xl mx-auto">
                I&apos;m always adding new pieces to the collection. Check back soon, or{" "}
                <Link
                  href="/contact"
                  className="text-lux-gold underline-offset-4 hover:underline font-medium"
                >
                  let me know
                </Link>{" "}
                what you&apos;re looking for and I&apos;ll keep an eye out for similar pieces.
              </p>
              <div className="mt-6">
                <Link
                  href="/browse"
                  className="inline-flex items-center text-sm font-medium text-lux-gold hover:text-lux-gold-light transition-colors"
                >
                  Browse all categories
                  <span aria-hidden="true" className="ml-2">→</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
