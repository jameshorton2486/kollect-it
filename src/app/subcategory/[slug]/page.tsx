import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/ui";

interface SubcategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 60;

async function getSubcategoryData(slug: string) {
  return prisma.subcategory.findUnique({
    where: { slug },
    include: {
      Category: true,
      products: {
        where: {
          status: "active",
          isDraft: false,
        },
        include: {
          Image: { orderBy: { order: "asc" }, take: 1 },
          Category: true,
          subCategory: true,
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
    include: { Category: true },
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
            <span className="text-lux-gray-dark">/</span>
            <Link
              href={`/category/${subcategory.category.slug}`}
              className="hover:text-lux-gold transition-colors"
            >
              {subcategory.category.name}
            </Link>
            <span className="text-lux-gray-dark">/</span>
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
            <EmptyState
              icon={Package}
              title="No Pieces Available Yet"
              description="I'm always adding new pieces to the collection. Check back soon, or contact me to let me know what you're looking for and I'll keep an eye out."
              primaryAction={{ label: "Browse All Categories", href: "/browse" }}
              secondaryAction={{
                label: `← Back to ${subcategory.category.name}`,
                href: `/category/${subcategory.category.slug}`,
              }}
            />
          )}
        </div>
      </section>
    </main>
  );
}
