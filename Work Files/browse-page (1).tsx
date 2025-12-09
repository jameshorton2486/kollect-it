import { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SortingBar from "@/components/SortingBar";
import CategoryFilters from "@/components/CategoryFilters";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop All Items - Kollect-It",
  description:
    "Browse all fine art, rare books, collectibles, militaria, and curated objects available at Kollect-It.",
};

interface BrowsePageProps {
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

async function getAllProducts(
  sortBy?: string,
  filters?: {
    priceMin?: number;
    priceMax?: number;
    cond?: string[];
  },
) {
  let orderBy:
    | { price: "asc" | "desc" }
    | { createdAt: "asc" | "desc" }
    | { title: "asc" }
    | Array<{ featured: "desc" } | { createdAt: "desc" }> = {
    createdAt: "desc",
  };

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
    status: "active",
  };

  if (filters?.priceMin != null || filters?.priceMax != null) {
    const priceFilter: Prisma.FloatFilter = {};
    if (filters?.priceMin != null) priceFilter.gte = filters.priceMin;
    if (filters?.priceMax != null) priceFilter.lte = filters.priceMax;
    where.price = priceFilter;
  }

  if (filters?.cond && filters.cond.length > 0) {
    where.condition = { in: filters.cond };
  }

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

  return products;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const {
    sort,
    view,
    priceMin,
    priceMax,
    cond,
    yearMin,
    yearMax,
    page,
  } = await searchParams;

  const priceMinNum = priceMin ? Number(priceMin) : undefined;
  const priceMaxNum = priceMax ? Number(priceMax) : undefined;
  const condArr = Array.isArray(cond) ? cond : cond ? [cond] : [];
  const yearMinNum = yearMin ? Number(yearMin) : undefined;
  const yearMaxNum = yearMax ? Number(yearMax) : undefined;
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 12;

  const products = await getAllProducts(sort, {
    priceMin: priceMinNum,
    priceMax: priceMaxNum,
    cond: condArr,
  });

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

  const priceAgg = await prisma.product.aggregate({
    where: { status: "active" },
    _min: { price: true },
    _max: { price: true },
  });
  const minPriceVal = priceAgg._min.price ?? 0;
  const maxPriceVal = priceAgg._max.price ?? 10000;
  const currView: "grid" | "list" = view === "list" ? "list" : "grid";

  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (sort) params.set("sort", sort);
    if (view) params.set("view", view);
    if (priceMinNum != null) params.set("priceMin", String(priceMinNum));
    if (priceMaxNum != null) params.set("priceMax", String(priceMaxNum));
    if (yearMinNum != null) params.set("yearMin", String(yearMinNum));
    if (yearMaxNum != null) params.set("yearMax", String(yearMaxNum));
    condArr.forEach((c) => params.append("cond", c));
    params.set("page", String(targetPage));
    return `?${params.toString()}`;
  };

  return (
    <main className="bg-lux-pearl min-h-screen">
      {/* Page Header */}
      <section className="bg-lux-cream section-normal border-b border-lux-silver-soft">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-label text-lux-gold mb-2">Shop</p>
              <h1 className="heading-page text-lux-black">Browse Collection</h1>
              <p className="lead mt-4 max-w-2xl">
                Explore the full catalog of fine art, rare books, militaria, and
                distinctive objects. Use filters and sorting to find exactly what you&apos;re looking for.
              </p>
            </div>

            <div className="text-right">
              <p className="text-label text-lux-gray-dark">Curated Inventory</p>
              <p className="text-2xl font-serif font-semibold text-lux-black mt-1">
                {totalFiltered} pieces
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="section-normal">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <CategoryFilters
                  minPrice={minPriceVal}
                  maxPrice={maxPriceVal}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort Bar */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-lux-silver-soft">
                <p className="text-muted">
                  Showing {pagedProducts.length} of {totalFiltered} items
                </p>
                <SortingBar
                  showing={pagedProducts.length}
                  total={totalFiltered}
                  currentSort={sort}
                  currentView={currView}
                />
              </div>

              {/* Product Grid */}
              {pagedProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-luxury">
                  {pagedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        slug: product.slug,
                        images: product.images.length > 0 ? product.images : [{ url: "/placeholder.svg" }],
                        category: product.category ? { name: product.category.name, slug: product.category.slug } : null,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-lux-silver-soft bg-lux-cream px-6 py-16 text-center">
                  <h3 className="heading-subsection mb-2">No items match your filters</h3>
                  <p className="text-muted mb-6 max-w-md mx-auto">
                    Try adjusting your filters or clearing them to see more of the collection.
                  </p>
                  <Link href="/browse" className="btn-primary rounded-full">
                    Clear Filters
                  </Link>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={buildPageHref(currentPage - 1)}
                      className="inline-flex items-center rounded-full border border-lux-silver-soft px-4 py-2 text-sm font-medium text-lux-gray-dark transition hover:border-lux-gold hover:text-lux-gold"
                    >
                      ← Previous
                    </Link>
                  )}

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNumber = i + 1;
                    const href = buildPageHref(pageNumber);
                    const isActive = pageNumber === currentPage;
                    return (
                      <Link
                        key={pageNumber}
                        href={href}
                        className={`inline-flex min-w-[40px] items-center justify-center rounded-full border px-3 py-2 text-sm font-medium transition ${
                          isActive
                            ? "border-lux-gold bg-lux-gold text-lux-charcoal"
                            : "border-lux-silver-soft text-lux-gray-dark hover:border-lux-gold hover:text-lux-gold"
                        }`}
                      >
                        {pageNumber}
                      </Link>
                    );
                  })}

                  {currentPage < totalPages && (
                    <Link
                      href={buildPageHref(currentPage + 1)}
                      className="inline-flex items-center rounded-full border border-lux-silver-soft px-4 py-2 text-sm font-medium text-lux-gray-dark transition hover:border-lux-gold hover:text-lux-gold"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
