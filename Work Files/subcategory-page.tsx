import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
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

export async function generateMetadata(props: SubcategoryPageProps): Promise<Metadata> {
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
    <main className="flex-1">
      {/* Breadcrumb + Header */}
      <section className="bg-lux-cream section-normal border-b border-lux-silver-soft">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-ink-600 mb-6">
            <Link href="/browse" className="hover:text-lux-gold transition-colors">
              Browse
            </Link>
            <span className="text-lux-gray-light">/</span>
            <Link
              href={`/category/${subcategory.category.slug}`}
              className="hover:text-lux-gold transition-colors"
            >
              {subcategory.category.name}
            </Link>
            <span className="text-lux-gray-light">/</span>
            <span className="text-lux-black font-medium">{subcategory.name}</span>
          </nav>

          {/* Header */}
          <p className="text-label text-lux-gold mb-2">
            {subcategory.category.name}
          </p>
          <h1 className="heading-page text-lux-black">{subcategory.name}</h1>
          <p className="lead mt-4 max-w-3xl">
            A carefully selected collection of {subcategory.name.toLowerCase()} pieces, 
            each one chosen for its quality, character, or story.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="bg-lux-pearl section-normal">
        <div className="container mx-auto max-w-6xl px-4">
          {products.length > 0 ? (
            <>
              <div className="mb-10 space-y-2">
                <h2 className="heading-section text-lux-black">Available Pieces</h2>
                <p className="text-ink-600">
                  {products.length === 1
                    ? "One piece currently available in this subcategory."
                    : `${products.length} pieces currently available in this subcategory.`}
                </p>
              </div>
              <ProductGrid products={products} />
            </>
          ) : (
            /* Empty State */
            <div className="bg-lux-white rounded-2xl border border-dashed border-lux-silver-soft px-6 py-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-lux-cream flex items-center justify-center mb-6">
                <Package className="h-8 w-8 text-lux-gray" />
              </div>
              <h2 className="heading-section text-lux-black mb-3">
                No Pieces Available Yet
              </h2>
              <p className="lead max-w-xl mx-auto mb-8">
                I&apos;m always adding new pieces to the collection. Check back soon, or{" "}
                <Link
                  href="/contact"
                  className="text-lux-gold hover:underline underline-offset-4"
                >
                  let me know
                </Link>{" "}
                what you&apos;re looking for and I&apos;ll keep an eye out.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/category/${subcategory.category.slug}`}
                  className="btn-secondary rounded-full"
                >
                  ← Back to {subcategory.category.name}
                </Link>
                <Link href="/browse" className="btn-primary rounded-full">
                  Browse All Categories
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
