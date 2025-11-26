"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface SortingBarProps {
  showing: number;
  total: number;
  currentSort?: string;
  currentView?: "grid" | "list";
}

export default function SortingBar({
  showing,
  total,
  currentSort,
  currentView = "grid",
}: SortingBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price (Low-High)" },
    { value: "price-desc", label: "Price (High-Low)" },
    { value: "title", label: "A-Z" },
  ];

  const updateParam = (key: string, val?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!val || val === "featured") params.delete(key);
    else params.set(key, val);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-lux-silver pb-4">
      <div className="text-xs font-medium tracking-wider uppercase text-lux-gray">
        Showing <span className="text-lux-charcoal">{showing}</span> of{" "}
        <span className="text-lux-charcoal">{total}</span> items
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort"
            className="text-sm text-lux-gray-dark"
          >
            Sort by
          </label>
          <select
            id="sort"
            className="rounded-md border border-lux-silver bg-white px-3 py-2 text-sm text-lux-charcoal leading-tight focus:outline-none focus:ring-1 focus:ring-lux-gold focus:border-lux-gold transition-colors cursor-pointer"
            value={currentSort || "featured"}
            onChange={(e) => updateParam("sort", e.target.value)}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="ml-2 hidden md:flex items-center gap-1 border-l border-lux-silver pl-4"
          role="group"
          aria-label="View toggle"
        >
          <button
            className={`rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-lux-gold ${
              currentView === "grid"
                ? "border-lux-gold text-lux-gold bg-lux-gold/5"
                : "border-lux-silver text-lux-gray hover:border-lux-gold hover:text-lux-gold"
            }`}
            onClick={() => updateParam("view", "grid")}
            aria-pressed={currentView === "grid"}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            className={`rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-lux-gold ${
              currentView === "list"
                ? "border-lux-gold text-lux-gold bg-lux-gold/5"
                : "border-lux-silver text-lux-gray hover:border-lux-gold hover:text-lux-gold"
            }`}
            onClick={() => updateParam("view", "list")}
            aria-pressed={currentView === "list"}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

