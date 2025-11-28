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
      products: {
        where: { status: "active" },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          category: true,
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

  return {
    title: `${category.name} – Kollect-It`,
    description:
      category.description ||
      `Browse authenticated ${category.name.toLowerCase()} at Kollect-It.`,
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
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-400">
              Category
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              {category.name}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              {category.description ||
                "Curated inventory from the Kollect-It catalog."}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          {products.length > 0 ? (
            <>
              <div className="mb-10 space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
                  Available pieces
                </h2>
                <p className="text-sm text-ink-600">
                  Showing {products.length}{" "}
                  {products.length === 1 ? "item" : "items"} currently on offer.
                </p>
              </div>
              <ProductGrid products={products} />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-200 bg-surface-50 px-6 py-12 text-sm text-ink-700">
              <p className="text-base font-semibold text-ink-900">
                No listings yet
              </p>
              <p className="mt-2 max-w-2xl">
                Inventory in this category is still small. Check back soon or{" "}
                <Link
                  href="/contact"
                  className="text-lux-gold underline-offset-4 hover:underline"
                >
                  contact me
                </Link>{" "}
                with specifics and I&apos;ll keep an eye out.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
