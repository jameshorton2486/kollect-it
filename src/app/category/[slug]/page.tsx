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

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryData(slug);

  if (!category) {
    notFound();
  }

  const products = category.products;

  return (
    <main className="bg-surface-50 text-ink-900">
      <section className="border-b border-surface-200 bg-surface-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-14 lg:flex-row lg:items-center lg:py-20">
          <div className="md:self-start">
            <Link
              href="/categories"
              className="inline-flex items-center text-sm font-semibold text-gold-600 transition-colors hover:text-gold-700"
            >
              <span aria-hidden="true" className="mr-2">
                ←
              </span>
              Back to all categories
            </Link>
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
              Category
            </p>
            <h1 className="mt-3 text-3xl font-light leading-tight text-ink-900 sm:text-4xl lg:text-5xl">
              {category.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
              {category.description ||
                "Curated inventory from the Kollect-It catalog."}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
          {products.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-light text-ink-900 sm:text-3xl">
                  Available pieces
                </h2>
                <p className="mt-2 text-sm text-ink-700">
                  Showing {products.length}{" "}
                  {products.length === 1 ? "item" : "items"} currently on offer.
                </p>
              </div>
              <ProductGrid products={products} />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-surface-300 bg-surface-50 px-6 py-10 text-sm text-ink-700">
              <p className="font-semibold text-ink-900">No listings yet</p>
              <p className="mt-2">
                Inventory in this category is still small. Check back soon or{" "}
                <Link
                  href="/contact"
                  className="text-gold-600 underline-offset-4 hover:underline"
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
