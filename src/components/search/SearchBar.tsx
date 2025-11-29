"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Filter, TrendingUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchSuggestion {
  id: string;
  name: string;
  category: string;
  image: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  showFilters?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  showFilters = true,
  placeholder = "Search for collectibles...",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(query)}`,
        );
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    // Navigate to search results
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);

    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
        className="flex items-center gap-3 rounded-full border border-border-200 bg-surface-100 px-5 py-2.5 shadow-sm"
      >
        <Search className="h-4 w-4 text-ink-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
        />
        <div className="flex items-center gap-2">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-200 text-ink-500 transition hover:text-ink-900"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {showFilters && (
            <button
              type="button"
              onClick={() => router.push("/search?filters=open")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-200 text-ink-500 transition hover:border-ink-700 hover:text-ink-900"
              aria-label="Open filters"
            >
              <Filter className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-surface-100 transition hover:bg-ink-700"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-3xl border border-border-200 bg-white shadow-xl">
          {recentSearches.length > 0 && !query && (
            <div className="px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                  <TrendingUp className="h-4 w-4 text-ink-500" />
                  Recent searches
                </h3>
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-xs font-semibold text-ink-400 hover:text-ink-900"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setQuery(search);
                      handleSearch(search);
                    }}
                    className="w-full rounded-2xl px-3 py-2 text-left text-sm text-ink-700 transition hover:bg-surface-100"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && suggestions.length > 0 && (
            <div className="border-t border-border-200 px-5 py-4">
              <h3 className="mb-3 text-sm font-semibold text-ink-900">
                Suggestions
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => router.push(`/product/${suggestion.id}`)}
                    className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-surface-100"
                  >
                    <img
                      src={suggestion.image}
                      alt={suggestion.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink-900">
                        {suggestion.name}
                      </p>
                      <p className="text-xs uppercase tracking-[0.3em] text-ink-400">
                        {suggestion.category}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="border-t border-border-200 px-5 py-3 text-center text-sm text-ink-500">
              Searching…
            </div>
          )}

          {query && !isLoading && suggestions.length === 0 && (
            <div className="border-t border-border-200 px-5 py-3 text-center text-sm text-ink-500">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

