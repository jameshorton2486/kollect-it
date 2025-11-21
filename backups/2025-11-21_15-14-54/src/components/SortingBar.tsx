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
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-ink-300 pb-3">
      <div className="text-xs tracking-wider uppercase text-[hsl(var(--ink-900))]">
        Showing {showing} of {total} products
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor="sort"
          className="text-sm font-medium text-[hsl(var(--ink-900))]"
        >
          Sort by
        </label>
        <select
          id="sort"
          className="rounded border border-border-300 bg-surface-0 px-3 py-2 text-sm leading-tight focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 focus:ring-offset-surface-0"
          value={currentSort || "featured"}
          onChange={(e) => updateParam("sort", e.target.value)}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div
          className="ml-2 hidden md:flex items-center gap-1"
          role="group"
          aria-label="View toggle"
        >
          <button
            className={`rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-white ${currentView === "grid" ? "border-gold text-ink" : "border-ink-300"}`}
            onClick={() => updateParam("view", "grid")}
          >
            Grid
          </button>
          <button
            className={`rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-white ${currentView === "list" ? "border-gold text-ink" : "border-ink-300"}`}
            onClick={() => updateParam("view", "list")}
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
}

