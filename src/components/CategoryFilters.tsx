"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CategoryFiltersProps {
  minPrice?: number;
  maxPrice?: number;
}

const CONDITIONS = ["Fine", "Very Good", "Good", "Fair"] as const;

type Condition = (typeof CONDITIONS)[number];

export default function CategoryFilters({
  minPrice = 0,
  maxPrice = 10000,
}: CategoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local UI state sourced from URL
  const [priceMin, setPriceMin] = useState<number>(
    Number(searchParams.get("priceMin")) || minPrice,
  );
  const [priceMax, setPriceMax] = useState<number>(
    Number(searchParams.get("priceMax")) || maxPrice,
  );
  const [yearMin, setYearMin] = useState<number | "">(
    Number(searchParams.get("yearMin")) || "",
  );
  const [yearMax, setYearMax] = useState<number | "">(
    Number(searchParams.get("yearMax")) || "",
  );
  const selectedConds = useMemo<Set<Condition>>(() => {
    const raw = searchParams.getAll("cond");
    return new Set(
      raw.filter((v): v is Condition => CONDITIONS.includes(v as Condition)),
    );
  }, [searchParams]);
  const [conds, setConds] = useState<Set<Condition>>(selectedConds);

  useEffect(() => {
    setConds(selectedConds);
    // Keep price/year in sync when location changes elsewhere
    setPriceMin(Number(searchParams.get("priceMin")) || minPrice);
    setPriceMax(Number(searchParams.get("priceMax")) || maxPrice);
    setYearMin(Number(searchParams.get("yearMin")) || "");
    setYearMax(Number(searchParams.get("yearMax")) || "");
  }, [searchParams, minPrice, maxPrice, selectedConds]);

  const apply = () => {
    const params = new URLSearchParams(searchParams.toString());
    // Price
    if (priceMin && priceMin !== minPrice)
      params.set("priceMin", String(priceMin));
    else params.delete("priceMin");
    if (priceMax && priceMax !== maxPrice)
      params.set("priceMax", String(priceMax));
    else params.delete("priceMax");
    // Year range
    if (yearMin !== "") params.set("yearMin", String(yearMin));
    else params.delete("yearMin");
    if (yearMax !== "") params.set("yearMax", String(yearMax));
    else params.delete("yearMax");
    // Conditions (multiple)
    params.delete("cond");
    Array.from(conds).forEach((c) => params.append("cond", c));

    // Reset to first page when filters change
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["priceMin", "priceMax", "yearMin", "yearMax", "cond", "page"].forEach(
      (k) => params.delete(k),
    );
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside
      className="hidden w-64 shrink-0 lg:block"
      role="region"
      aria-label="Filters"
    >
      <div className="sticky top-24 rounded-3xl border border-border-200 bg-white/90 p-5 shadow-lg">
        <div className="mb-6">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-ink-400">
            Refine results
          </p>
          <p className="text-sm text-ink-500">
            Adjust filters to tailor the catalog to your taste.
          </p>
        </div>

        <fieldset className="mb-6 space-y-3">
          <legend className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-300">
            Price
          </legend>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-24 rounded-full border border-border-200 bg-surface-50 px-4 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-300"
              value={priceMin}
              min={0}
              onChange={(e) =>
                setPriceMin(Math.max(0, Number(e.target.value) || 0))
              }
              aria-label="Min price"
              placeholder="Min"
            />
            <span className="text-ink-300">—</span>
            <input
              type="number"
              className="w-24 rounded-full border border-border-200 bg-surface-50 px-4 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-300"
              value={priceMax}
              min={0}
              onChange={(e) =>
                setPriceMax(Math.max(0, Number(e.target.value) || 0))
              }
              aria-label="Max price"
              placeholder="Max"
            />
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-ink-300">
            Condition
          </legend>
          <div className="space-y-2">
            {CONDITIONS.map((c) => (
              <label
                key={c}
                className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-ink-700 transition hover:bg-surface-100"
              >
                <input
                  type="checkbox"
                  checked={conds.has(c)}
                  onChange={(e) => {
                    const next = new Set(conds);
                    if (e.target.checked) next.add(c);
                    else next.delete(c);
                    setConds(next);
                  }}
                  className="h-4 w-4 rounded border-border-200 text-ink-900 focus:ring-gold-300"
                />
                <span className="font-medium">{c}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-ink-300">
            Year
          </legend>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-24 rounded-full border border-border-200 bg-surface-50 px-4 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-300"
              value={yearMin as number | ""}
              min={0}
              onChange={(e) => setYearMin(Number(e.target.value) || "")}
              aria-label="Min year"
              placeholder="From"
            />
            <span className="text-ink-300">—</span>
            <input
              type="number"
              className="w-24 rounded-full border border-border-200 bg-surface-50 px-4 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-300"
              value={yearMax as number | ""}
              min={0}
              onChange={(e) => setYearMax(Number(e.target.value) || "")}
              aria-label="Max year"
              placeholder="To"
            />
          </div>
        </fieldset>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={apply}
            className="inline-flex w-full items-center justify-center rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-700"
          >
            Apply filters
          </button>
          <button
            onClick={clearAll}
            className="inline-flex w-full items-center justify-center rounded-full border border-border-200 px-5 py-2.5 text-sm font-semibold text-ink-900 transition hover:border-ink-700 hover:text-ink-700"
          >
            Clear all
          </button>
        </div>
      </div>
    </aside>
  );
}

