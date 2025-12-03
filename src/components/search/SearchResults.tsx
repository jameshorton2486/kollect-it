"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchFilters from "./SearchFilters";
import SearchBar from "./SearchBar";
import { Grid3x3, List, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  images: { url: string; alt?: string | null }[];
  condition: string | null;
  category: {
    name: string;
  };
}

interface SearchResultsData {
  products: Product[];
  total: number;
  filters: any[];
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  // const router = useRouter(); // Removed unused variable
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchResultsData>({
    products: [],
    total: 0,
    filters: [],
  });
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedFilters, sortBy]);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) {
        params.append("q", query);
      }
      params.append("sort", sortBy);

      Object.entries(selectedFilters).forEach(([key, values]) => {
        values.forEach((value) => params.append(key, value));
      });

      const response = await fetch(`/api/search?${params}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ensure data structure matches expected format
      setResults({
        products: data.products || [],
        total: data.total || 0,
        filters: data.filters || [],
      });
    } catch (error) {
      console.error("Search failed:", error);
      // Set empty results on error
      setResults({
        products: [],
        total: 0,
        filters: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterId: string, values: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: values,
    }));
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const filterSections = [
    {
      id: "category",
      title: "Category",
      type: "checkbox" as const,
      options: [
        { value: "trading-cards", label: "Trading Cards", count: 150 },
        { value: "action-figures", label: "Action Figures", count: 89 },
        { value: "comics", label: "Comics", count: 234 },
        { value: "vintage-toys", label: "Vintage Toys", count: 67 },
        { value: "coins", label: "Coins & Currency", count: 112 },
      ],
    },
    {
      id: "condition",
      title: "Condition",
      type: "checkbox" as const,
      options: [
        { value: "mint", label: "Mint", count: 45 },
        { value: "near-mint", label: "Near Mint", count: 123 },
        { value: "excellent", label: "Excellent", count: 89 },
        { value: "good", label: "Good", count: 234 },
        { value: "fair", label: "Fair", count: 56 },
      ],
    },
    {
      id: "price",
      title: "Price Range",
      type: "range" as const,
      min: 0,
      max: 10000,
    },
    {
      id: "shipping",
      title: "Shipping",
      type: "checkbox" as const,
      options: [
        { value: "free", label: "Free Shipping" },
        { value: "fast", label: "Fast Shipping (2-3 days)" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="space-y-6 border-b border-border-200 pb-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-400">
              Search
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              {query ? `Results for “${query}”` : "Search the catalog"}
            </h1>
            <p className="text-sm text-ink-600">
              {isLoading
                ? "Searching inventory…"
                : `${results.total} pieces match your criteria`}
            </p>
          </div>
          <SearchBar placeholder="Search fine art, militaria, rare books…" />
        </div>

        <div className="mt-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border-200 bg-white/80 px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 rounded-full border border-border-200 px-4 py-2 text-xs font-semibold text-ink-700 transition hover:border-ink-700 hover:text-ink-900"
                type="button"
                aria-label={showFilters ? "Hide filters" : "Show filters"}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort search results"
                className="rounded-full border border-border-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-900 outline-none transition hover:border-ink-700 focus:border-gold-500"
              >
                <option value="relevance">Most relevant</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest arrivals</option>
                <option value="popular">Most popular</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition ${
                  viewMode === "grid"
                    ? "border-gold-500 bg-gold-500/10 text-ink-900"
                    : "border-border-200 text-ink-400 hover-border-ink-700 hover:text-ink-900"
                }`}
                type="button"
                aria-label={
                  viewMode === "grid"
                    ? "Grid view selected"
                    : "Switch to grid view"
                }
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition ${
                  viewMode === "list"
                    ? "border-gold-500 bg-gold-500/10 text-ink-900"
                    : "border-border-200 text-ink-400 hover:border-ink-700 hover:text-ink-900"
                }`}
                type="button"
                aria-label={
                  viewMode === "list"
                    ? "List view selected"
                    : "Switch to list view"
                }
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            {showFilters && (
              <aside className="w-64 flex-shrink-0">
                <SearchFilters
                  filters={filterSections}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAll}
                />
              </aside>
            )}

            <main className="flex-1">
              {isLoading ? (
                <div className="rounded-3xl border border-dashed border-border-200 bg-white/70 px-6 py-12 text-center text-sm text-ink-500">
                  Searching the archive…
                </div>
              ) : results.products.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border-200 bg-white/70 px-6 py-12 text-center">
                  <p className="text-lg font-semibold text-ink-900">
                    No results found
                  </p>
                  <p className="mt-2 text-sm text-ink-600">
                    Adjust your keywords or filters to explore more of the
                    collection.
                  </p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                      : "space-y-4"
                  }
                >
                  {results.products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className={`group rounded-3xl border border-border-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-elevated ${
                        viewMode === "list"
                          ? "flex gap-4 p-4"
                          : "overflow-hidden"
                      }`}
                    >
                      <img
                        src={product.images[0]?.url || "/placeholder.svg"}
                        alt={product.images[0]?.alt || product.title}
                        className={
                          viewMode === "list"
                            ? "h-36 w-36 rounded-2xl object-cover"
                            : "h-64 w-full object-cover"
                        }
                      />
                      <div className="p-4">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-ink-400">
                          {product.category.name}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink-900 line-clamp-2 group-hover:text-gold-500">
                          {product.title}
                        </h3>
                        {product.condition && (
                          <p className="mt-1 text-sm text-ink-500">
                            Condition: {product.condition}
                          </p>
                        )}
                        <p className="mt-3 text-xl font-semibold text-gold-500">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

