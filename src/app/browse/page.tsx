import { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SortingBar from "@/components/SortingBar";
import CategoryFilters from "@/components/CategoryFilters";
import ProductGrid from "@/components/ProductGrid";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Browse All Items - Kollect-It",
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

// Fetch all active products with optional sort + basic DB filters
async function getAllProducts(
  sortBy?: string,
  filters?: {
    priceMin?: number;
    priceMax?: number;
    cond?: string[];
  },
) {
  // Build orderBy based on sort parameter
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
      // Featured first, then newest
      orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
  }

  const where: Prisma.ProductWhereInput = {
    status: "active",
  };

  // Price filter
  if (filters?.priceMin != null || filters?.priceMax != null) {
    const priceFilter: Prisma.FloatFilter = {};
    if (filters?.priceMin != null) priceFilter.gte = filters.priceMin;
    if (filters?.priceMax != null) priceFilter.lte = filters.priceMax;
    where.price = priceFilter;
  }

  // Condition filter
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

  // Parse filters from query
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

  // Compute min/max price across all active products for the filters
  const priceAgg = await prisma.product.aggregate({
    where: { status: "active" },
    _min: { price: true },
    _max: { price: true },
  });
  const minPriceVal = priceAgg._min.price ?? 0;
  const maxPriceVal = priceAgg._max.price ?? 10000;
  const currView: "grid" | "list" = view === "list" ? "list" : "grid";

  // Helper to generate pagination links preserving filters
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
    <div className="browse-page min-h-screen bg-white">
      {/* Top band */}
      <section className="border-b border-lux-silver bg-lux-cream">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 pb-4 pt-8 lg:flex-row lg:items-end lg:justify-between lg:pb-6 lg:pt-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-lux-gold">
              Browse
            </p>
            <h1 className="mt-2 font-serif text-2xl tracking-tight text-lux-charcoal lg:text-3xl">
              Browse Kollect-It
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-lux-gray">
              Explore the full catalog of fine art, rare books, militaria, and
              distinctive objects. Use filters and sorting to narrow in on what
              catches your eye.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 text-xs text-lux-gray lg:items-end">
            <p className="uppercase tracking-[0.18em] text-lux-charcoal">
              Curated Inventory
            </p>
            <p className="text-sm text-lux-charcoal font-medium">
              {totalFiltered} pieces available
            </p>
          </div>
        </div>
      </section>

      {/* Filters + grid band */}
      <main className="mx-auto max-w-6xl px-6 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pb-4 border-b border-lux-silver mb-6">
          {/* Filtering Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <CategoryFilters
                minPrice={minPriceVal}
                maxPrice={maxPriceVal}
              />
            </div>
          </div>

          {/* Sorting Bar */}
          <div className="flex items-center justify-end lg:ml-auto">
            <SortingBar
              showing={pagedProducts.length}
              total={totalFiltered}
              currentSort={sort}
              currentView={currView}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="pt-2">

          {pagedProducts.length > 0 ? (
            <ProductGrid products={pagedProducts} view={currView} />
          ) : (
            <div className="text-center py-24 px-4 border border-lux-silver rounded-lg bg-lux-cream/50">
                <h3 className="font-serif text-lux-charcoal text-2xl mb-3">
                  No items match your filters
                </h3>
                <p className="text-lux-gray mb-6">
                  Try adjusting your filters or clearing them to see more of the
                  collection.
                </p>
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 bg-lux-gold hover:bg-lux-gold-light text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Clear Filters
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={buildPageHref(currentPage - 1)}
                    className="px-4 py-2 text-sm border border-lux-silver rounded-md hover:border-lux-gold hover:text-lux-gold transition-colors"
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
                      className={`min-w-[40px] h-10 flex items-center justify-center rounded-md border font-medium text-sm transition-all ${
                        isActive
                          ? "border-lux-gold bg-lux-gold text-white"
                          : "border-lux-silver text-lux-charcoal hover:border-lux-gold hover:text-lux-gold"
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}

                {currentPage < totalPages && (
                  <Link
                    href={buildPageHref(currentPage + 1)}
                    className="px-4 py-2 text-sm border border-lux-silver rounded-md hover:border-lux-gold hover:text-lux-gold transition-colors"
                  >
                    Next →
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}