"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchFilters from "./SearchFilters";
import { Grid3x3, List, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  price: number;
  images: { url: string }[];
  condition: string;
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
  }, [query, selectedFilters, sortBy]);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("q", query);
      params.append("sort", sortBy);

      Object.entries(selectedFilters).forEach(([key, values]) => {
        values.forEach((value) => params.append(key, value));
      });

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
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
    <div className="min-h-screen">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {query ? `Search results for "${query}"` : "Search Results"}
        </h1>
        <p className="text-muted-foreground">
          {isLoading ? "Searching..." : `${results.total} items found`}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="relevance">Most Relevant</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 border rounded ${viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}`}
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 border rounded ${viewMode === "list" ? "bg-primary text-primary-foreground" : ""}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filters Sidebar */}
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

        {/* Results */}
        <main className="flex-1">
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : results.products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg mb-2">No results found</p>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {results.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className={`block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                    viewMode === "list" ? "flex gap-4" : ""
                  }`}
                >
                  <img
                    src={product.images[0]?.url || "/placeholder.svg"}
                    alt={product.title}
                    className={
                      viewMode === "list"
                        ? "w-48 h-48 object-cover"
                        : "w-full h-64 object-cover"
                    }
                  />
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.condition}
                    </p>
                    <p className="text-lg font-bold text-primary mb-2">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.category.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

