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
    <div className="min-h-screen bg-lux-pearl">
      <section className="border-b border-border-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-16">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-400">
              Browse
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-ink-900">
              Browse Kollect-It
            </h1>
            <p className="max-w-2xl text-base text-ink-700">
              Explore the full catalog of fine art, rare books, militaria, and
              distinctive objects. Use filters and sorting to narrow in on what
              catches your eye.
            </p>
          </div>

          <div className="text-sm text-ink-600">
            <p className="uppercase tracking-[0.3em] text-ink-400">
              Curated inventory
            </p>
            <p className="mt-2 text-base font-semibold text-ink-900">
              {totalFiltered} pieces available
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-6 flex flex-col gap-6 border-b border-border-200 pb-4 lg:flex-row lg:gap-8">
          {/* Filtering Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <CategoryFilters
                minPrice={minPriceVal}
                maxPrice={maxPriceVal}
              />
            </div>
          </div>

          <div className="flex items-center justify-end lg:ml-auto">
            <SortingBar
              showing={pagedProducts.length}
              total={totalFiltered}
              currentSort={sort}
              currentView={currView}
            />
          </div>
        </div>

        <div className="pt-2">
          {pagedProducts.length > 0 ? (
            <ProductGrid products={pagedProducts} view={currView} />
          ) : (
            <div className="rounded-2xl border border-dashed border-border-200 bg-surface-50 px-6 py-16 text-center">
              <h3 className="mb-3 text-2xl font-semibold text-ink-900">
                No items match your filters
              </h3>
              <p className="mb-6 text-sm text-ink-600">
                Try adjusting your filters or clearing them to see more of the
                collection.
              </p>
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 rounded-full bg-lux-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-ink-900 transition-colors hover:bg-lux-gold-light"
              >
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
                    className="inline-flex items-center rounded-full border border-border-200 px-4 py-2 text-xs font-semibold text-ink-600 transition hover:border-ink-700 hover:text-ink-900"
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
                      className={`inline-flex min-w-[40px] items-center justify-center rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        isActive
                          ? "border-gold-500 bg-gold-500 text-ink-900"
                          : "border-border-200 text-ink-600 hover:border-ink-700 hover:text-ink-900"
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}

                {currentPage < totalPages && (
                  <Link
                    href={buildPageHref(currentPage + 1)}
                    className="inline-flex items-center rounded-full border border-border-200 px-4 py-2 text-xs font-semibold text-ink-600 transition hover:border-ink-700 hover:text-ink-900"
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