import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";

interface SubcategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 60;

async function getSubcategoryData(slug: string) {
  return prisma.subcategory.findUnique({
    where: { slug },
    include: {
      category: true,
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
  props: SubcategoryPageProps,
): Promise<Metadata> {
  const { params } = props;
  const { slug } = await params;
  const subcategory = await prisma.subcategory.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!subcategory) {
    return {
      title: "Subcategory Not Found – Kollect-It",
      description: "The requested subcategory could not be found.",
    };
  }

  const description = `Browse ${subcategory.name.toLowerCase()} in ${subcategory.category.name.toLowerCase()} at Kollect-It. Carefully curated and quality-reviewed pieces.`;

  return {
    title: `${subcategory.name} | ${subcategory.category.name} | Kollect-It`,
    description,
    alternates: {
      canonical: `https://kollect-it.com/subcategory/${subcategory.slug}`,
    },
    openGraph: {
      title: `${subcategory.name} | ${subcategory.category.name} | Kollect-It`,
      description,
      url: `https://kollect-it.com/subcategory/${subcategory.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${subcategory.name} | ${subcategory.category.name} | Kollect-It`,
      description,
    },
  };
}

export default async function SubcategoryPage(props: SubcategoryPageProps) {
  const { params } = props;
  const { slug } = await params;
  const subcategory = await getSubcategoryData(slug);

  if (!subcategory) {
    notFound();
  }

  const products = subcategory.products;

  return (
    <main className="bg-lux-pearl text-ink-900">
      <section className="border-b border-border-200 bg-white">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex items-center gap-2 text-sm text-ink-600">
            <Link
              href="/browse"
              className="hover:text-ink-900 transition-colors"
            >
              Browse
            </Link>
            <span>/</span>
            <Link
              href={`/category/${subcategory.category.slug}`}
              className="hover:text-ink-900 transition-colors"
            >
              {subcategory.category.name}
            </Link>
            <span>/</span>
            <span className="text-ink-900 font-medium">{subcategory.name}</span>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-700">
              {subcategory.category.name} / {subcategory.name}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              {subcategory.name}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">
              A carefully selected collection of {subcategory.name.toLowerCase()} pieces, each one chosen for its quality, character, or story.
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
                  {products.length === 1
                    ? "One piece currently available in this subcategory."
                    : `${products.length} pieces currently available in this subcategory.`}
                </p>
              </div>
              <ProductGrid products={products} />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-200 bg-surface-50 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-ink-900 mb-2">
                No pieces available in this subcategory right now
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
              <div className="mt-6 flex gap-4 justify-center">
                <Link
                  href={`/category/${subcategory.category.slug}`}
                  className="inline-flex items-center text-sm font-medium text-lux-gold hover:text-lux-gold-light transition-colors"
                >
                  ← Back to {subcategory.category.name}
                </Link>
                <Link
                  href="/browse"
                  className="inline-flex items-center text-sm font-medium text-lux-gold hover:text-lux-gold-light transition-colors"
                >
                  Browse all categories →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

