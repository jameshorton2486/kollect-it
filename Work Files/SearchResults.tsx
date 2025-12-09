"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchFilters from "./SearchFilters";
import SearchBar from "./SearchBar";
import { Grid3x3, List, SlidersHorizontal, Search } from "lucide-react";
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
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchResultsData>({
    products: [],
    total: 0,
    filters: [],
  });
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
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

      setResults({
        products: data.products || [],
        total: data.total || 0,
        filters: data.filters || [],
      });
    } catch (error) {
      console.error("Search failed:", error);
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
        { value: "fine-art", label: "Fine Art", count: 150 },
        { value: "rare-books", label: "Rare Books", count: 89 },
        { value: "collectibles", label: "Collectibles", count: 234 },
        { value: "militaria", label: "Militaria", count: 67 },
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
  ];

  return (
    <main className="min-h-screen bg-lux-pearl">
      {/* Search Header */}
      <section className="bg-lux-cream section-normal border-b border-lux-silver-soft">
        <div className="container mx-auto max-w-4xl">
          <p className="text-label text-lux-gold mb-2">Search</p>
          <h1 className="heading-page text-lux-black">
            {query ? `Results for "${query}"` : "Search the Catalog"}
          </h1>
          <p className="text-muted mt-4">
            {isLoading
              ? "Searching inventory…"
              : `${results.total} pieces match your criteria`}
          </p>
          
          <div className="mt-8">
            <SearchBar placeholder="Search fine art, militaria, rare books…" />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="section-normal">
        <div className="container mx-auto">
          {/* Filter/Sort Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-lux-white rounded-lg border border-lux-silver-soft px-6 py-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 rounded-full border border-lux-silver-soft px-4 py-2 text-sm font-medium text-lux-gray-dark transition hover:border-lux-gold hover:text-lux-gold"
                type="button"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-lux-silver-soft bg-lux-white px-4 py-2 text-sm font-medium text-lux-black outline-none transition hover:border-lux-gold focus:border-lux-gold focus:ring-1 focus:ring-lux-gold"
              >
                <option value="relevance">Most Relevant</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
                  viewMode === "grid"
                    ? "border-lux-gold bg-lux-gold/10 text-lux-gold"
                    : "border-lux-silver-soft text-lux-gray hover:border-lux-gold hover:text-lux-gold"
                }`}
                type="button"
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
                  viewMode === "list"
                    ? "border-lux-gold bg-lux-gold/10 text-lux-gold"
                    : "border-lux-silver-soft text-lux-gray hover:border-lux-gold hover:text-lux-gold"
                }`}
                type="button"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <aside className="w-64 flex-shrink-0 hidden lg:block">
                <SearchFilters
                  filters={filterSections}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAll}
                />
              </aside>
            )}

            {/* Results */}
            <div className="flex-1">
              {isLoading ? (
                <div className="rounded-xl border border-dashed border-lux-silver-soft bg-lux-cream px-6 py-16 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-lux-pearl mb-4">
                    <Search className="h-6 w-6 text-lux-gold animate-pulse" />
                  </div>
                  <p className="text-lux-gray-dark">Searching the archive…</p>
                </div>
              ) : results.products.length === 0 ? (
                <div className="rounded-xl border border-dashed border-lux-silver-soft bg-lux-cream px-6 py-16 text-center">
                  <h3 className="heading-subsection mb-2">No Results Found</h3>
                  <p className="text-muted mb-6 max-w-md mx-auto">
                    We couldn&apos;t find any items matching &quot;{query}&quot;. Try adjusting your search terms or browse our categories.
                  </p>
                  <div className="space-y-2">
                    <p className="text-label text-lux-gray-dark">Suggestions:</p>
                    <ul className="text-sm text-ink-600 space-y-1">
                      <li>Check your spelling</li>
                      <li>Try more general terms</li>
                      <li>Use fewer keywords</li>
                    </ul>
                  </div>
                  <Link href="/browse" className="btn-primary rounded-full mt-6 inline-flex">
                    Browse All Items
                  </Link>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 gap-luxury"
                      : "space-y-4"
                  }
                >
                  {results.products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className={`group bg-lux-white rounded-lg border border-lux-silver-soft shadow-clean transition hover:shadow-soft hover:-translate-y-1 ${
                        viewMode === "list" ? "flex gap-4 p-4" : "overflow-hidden"
                      }`}
                    >
                      <img
                        src={product.images[0]?.url || "/placeholder.svg"}
                        alt={product.images[0]?.alt || product.title}
                        className={
                          viewMode === "list"
                            ? "h-32 w-32 rounded-lg object-cover"
                            : "h-56 w-full object-cover"
                        }
                      />
                      <div className={viewMode === "list" ? "flex-1" : "p-4"}>
                        <p className="text-label text-lux-gold">
                          {product.category.name}
                        </p>
                        <h3 className="mt-1 font-serif text-lg font-medium text-lux-black line-clamp-2 group-hover:text-lux-gold transition-colors">
                          {product.title}
                        </h3>
                        {product.condition && (
                          <p className="text-muted mt-1">
                            Condition: {product.condition}
                          </p>
                        )}
                        <p className="mt-3 text-xl font-semibold text-lux-gold">
                          ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
