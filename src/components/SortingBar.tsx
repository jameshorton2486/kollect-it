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
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-border-200 bg-surface-100/80 px-5 py-3 text-xs shadow-sm">
      <p className="font-semibold uppercase tracking-[0.3em] text-ink-400">
        Showing{" "}
        <span className="text-ink-900">
          {showing}/{total}
        </span>{" "}
        pieces
      </p>

      <div className="flex items-center gap-4">
        <label htmlFor="sort" className="hidden text-[0.65rem] uppercase tracking-[0.3em] text-ink-400 lg:inline">
          Sort
        </label>
        <select
          id="sort"
          className="rounded-full border border-border-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-900 outline-none transition hover:border-ink-700 focus:border-gold-500"
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
          className="hidden items-center gap-2 border-l border-border-200 pl-4 md:flex"
          role="group"
          aria-label="View toggle"
        >
          <button
            className={`inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-1 focus:ring-gold-500 ${
              currentView === "grid"
                ? "border-gold-500 bg-gold-500/10 text-ink-900"
                : "border-border-200 text-ink-500 hover:border-ink-700 hover:text-ink-900"
            }`}
            onClick={() => updateParam("view", "grid")}
            type="button"
            aria-label={
              currentView === "grid"
                ? "Grid view selected"
                : "Switch to grid view"
            }
          >
            <svg
              className="h-4 w-4"
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
            className={`inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-1 focus:ring-gold-500 ${
              currentView === "list"
                ? "border-gold-500 bg-gold-500/10 text-ink-900"
                : "border-border-200 text-ink-500 hover:border-ink-700 hover:text-ink-900"
            }`}
            onClick={() => updateParam("view", "list")}
            type="button"
            aria-label={
              currentView === "list"
                ? "List view selected"
                : "Switch to list view"
            }
          >
            <svg
              className="h-4 w-4"
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

