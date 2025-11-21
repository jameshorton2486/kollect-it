import { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/ProductGrid";
import CategoryHero from "@/components/CategoryHero";
import SortingBar from "@/components/SortingBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryFilters from "@/components/CategoryFilters";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: string;
    view?: "grid" | "list";
    priceMin?: string;
    priceMax?: string;
    cond?: string | string[];
    yearMin?: string;
    yearMax?: string;
    page?: string;
  }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

async function getCategoryWithProducts(
  slug: string,
  sortBy?: string,
  filters?: {
    priceMin?: number;
    priceMax?: number;
    cond?: string[];
  },
) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return null;

  // Build orderBy based on sort parameter
  let orderBy:
    | { price: "asc" | "desc" }
    | { createdAt: "asc" | "desc" }
    | { title: "asc" }
    | Array<{ featured: "desc" } | { createdAt: "desc" }> = {
    createdAt: "desc",
  }; // default

  switch (sortBy) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "title":
      orderBy = { title: "asc" };
      break;
    default:
      orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
  }

  const where: Prisma.ProductWhereInput = {
    categoryId: category.id,
    status: "active",
  };
  if (filters?.priceMin != null || filters?.priceMax != null) {
    const priceFilter: Prisma.FloatFilter = {};
    if (filters?.priceMin != null) priceFilter.gte = filters.priceMin;
    if (filters?.priceMax != null) priceFilter.lte = filters.priceMax;
    where.price = priceFilter;
  }
  if (filters?.cond && filters.cond.length > 0)
    where.condition = { in: filters.cond };

  const products = await prisma.product.findMany({
    where,
    include: {
      images: {
        orderBy: { order: "asc" },
        take: 1,
      },
      category: true,
    },
    orderBy,
  });

  return { category, products };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryWithProducts(slug);

  if (!data) {
    return {
      title: "Category Not Found",
    };
  }

  const { category } = data;

  return {
    title: `${category.name} - Kollect-It`,
    description: category.description,
    openGraph: {
      title: `${category.name} - Kollect-It`,
      description: category.description,
      images: [category.image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} - Kollect-It`,
      description: category.description || undefined,
      images: [category.image],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { sort, view, priceMin, priceMax, cond, yearMin, yearMax, page } =
    await searchParams;

  // Parse filters
  const priceMinNum = priceMin ? Number(priceMin) : undefined;
  const priceMaxNum = priceMax ? Number(priceMax) : undefined;
  const condArr = Array.isArray(cond) ? cond : cond ? [cond] : [];
  const yearMinNum = yearMin ? Number(yearMin) : undefined;
  const yearMaxNum = yearMax ? Number(yearMax) : undefined;
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 12;

  const data = await getCategoryWithProducts(slug, sort, {
    priceMin: priceMinNum,
    priceMax: priceMaxNum,
    cond: condArr,
  });

  if (!data) {
    notFound();
  }

  const { category, products } = data;

  // Apply year filter (string field) in memory
  const yearFiltered = products.filter((p) => {
    if (yearMinNum == null && yearMaxNum == null) return true;
    const y = p.year ? parseInt(p.year, 10) : NaN;
    if (Number.isNaN(y)) return false;
    if (yearMinNum != null && y < yearMinNum) return false;
    if (yearMaxNum != null && y > yearMaxNum) return false;
    return true;
  });

  const totalFiltered = yearFiltered.length;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pagedProducts = yearFiltered.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  // Compute min/max price for filters (across category active products)
  const priceAgg = await prisma.product.aggregate({
    where: { categoryId: category.id, status: "active" },
    _min: { price: true },
    _max: { price: true },
  });
  const minPriceVal = priceAgg._min.price ?? 0;
  const maxPriceVal = priceAgg._max.price ?? 10000;
  const currView: "grid" | "list" = view === "list" ? "list" : "grid";

  // JSON-LD Schema for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kollect-it.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `https://kollect-it.com/category/${category.slug}`,
      },
    ],
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `https://kollect-it.com/category/${category.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "Product",
        position: index + 1,
        name: product.title,
        description: product.description,
        image: product.images[0]?.url,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      })),
    },
  };

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="category-page min-h-screen bg-white">
        {/* Breadcrumbs with better spacing */}
        <div className="border-b border-[var(--color-gray-light)] bg-[var(--color-cream)]">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: category.name, href: `/category/${category.slug}` },
              ]}
            />
          </div>
        </div>

        {/* Enhanced Hero Section */}
        <CategoryHero
          title={category.name}
          description={category.description}
          backgroundImage={category.image}
          productCount={products.length}
        />

        {/* Main Content with improved spacing */}
        <main
          className="container mx-auto px-4 md:px-6 lg:px-8 py-12"
          role="main"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtering Sidebar (desktop) - sticky positioning */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <CategoryFilters
                  minPrice={minPriceVal}
                  maxPrice={maxPriceVal}
                />
              </div>
            </div>

            {/* Products Section */}
            <div className="flex-1 min-w-0">
              {/* Sorting Bar with improved styling */}
              <div className="mb-8">
                <SortingBar
                  showing={pagedProducts.length}
                  total={totalFiltered}
                  currentSort={sort}
                  currentView={currView}
                />
              </div>

              {/* Product Grid with better gap spacing */}
              {pagedProducts.length > 0 ? (
                <ProductGrid products={pagedProducts} view={currView} />
              ) : (
                <div className="no-products text-center py-24 px-4 border-2 border-dashed border-[var(--color-gray-light)] rounded-lg">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-[var(--color-gray-medium)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="font-serif text-[var(--color-charcoal)] text-2xl mb-3">
                    No products found
                  </h3>
                  <p className="text-[var(--color-gray-dark)] mb-6">
                    Try adjusting your filters or browse all products.
                  </p>
                  <Link
                    href="/shop"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Browse All Products
                  </Link>
                </div>
              )}

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams()), page: String(currentPage - 1) }).toString()}`}
                      className="btn-secondary px-4 py-2 text-sm"
                    >
                      ← Previous
                    </Link>
                  )}

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const params = new URLSearchParams();
                    if (sort) params.set("sort", sort);
                    if (currView) params.set("view", currView);
                    if (priceMinNum != null)
                      params.set("priceMin", String(priceMinNum));
                    if (priceMaxNum != null)
                      params.set("priceMax", String(priceMaxNum));
                    if (yearMinNum != null)
                      params.set("yearMin", String(yearMinNum));
                    if (yearMaxNum != null)
                      params.set("yearMax", String(yearMaxNum));
                    condArr.forEach((c) => params.append("cond", c));
                    params.set("page", String(i + 1));
                    const href = `?${params.toString()}`;
                    const isActive = i + 1 === currentPage;
                    return (
                      <Link
                        key={i}
                        href={href}
                        className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg border-2 font-semibold text-sm transition-all ${
                          isActive
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                            : "border-[var(--color-gray-light)] text-[var(--color-charcoal)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                        }`}
                      >
                        {i + 1}
                      </Link>
                    );
                  })}

                  {currentPage < totalPages && (
                    <Link
                      href={`?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams()), page: String(currentPage + 1) }).toString()}`}
                      className="btn-secondary px-4 py-2 text-sm"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
