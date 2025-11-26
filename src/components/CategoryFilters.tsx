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
      className="hidden lg:block w-64 shrink-0"
      role="region"
      aria-label="Filters"
    >
      <div className="sticky top-24 space-y-6">
        {/* Filter Header */}
        <div className="pb-4 border-b border-lux-silver">
          <h3 className="font-serif text-lg text-lux-charcoal">Refine Results</h3>
        </div>

        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-lux-gray-dark">
            Price
          </legend>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-20 rounded-md border border-lux-silver px-3 py-2 text-sm bg-white focus:border-lux-gold focus:ring-1 focus:ring-lux-gold focus:outline-none transition-colors"
              value={priceMin}
              min={0}
              onChange={(e) =>
                setPriceMin(Math.max(0, Number(e.target.value) || 0))
              }
              aria-label="Min price"
            />
            <span className="text-lux-gray-light">–</span>
            <input
              type="number"
              className="w-20 rounded-md border border-lux-silver px-3 py-2 text-sm bg-white focus:border-lux-gold focus:ring-1 focus:ring-lux-gold focus:outline-none transition-colors"
              value={priceMax}
              min={0}
              onChange={(e) =>
                setPriceMax(Math.max(0, Number(e.target.value) || 0))
              }
              aria-label="Max price"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-lux-gray-dark">
            Condition
          </legend>
          <div className="space-y-2">
            {CONDITIONS.map((c) => (
              <label key={c} className="flex items-center gap-3 text-sm cursor-pointer group">
                <input
                  type="checkbox"
                  checked={conds.has(c)}
                  onChange={(e) => {
                    const next = new Set(conds);
                    if (e.target.checked) next.add(c);
                    else next.delete(c);
                    setConds(next);
                  }}
                  className="w-4 h-4 rounded border-lux-silver text-lux-gold focus:ring-lux-gold focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-lux-charcoal group-hover:text-lux-gold transition-colors">{c}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-lux-gray-dark">
            Year
          </legend>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-20 rounded-md border border-lux-silver px-3 py-2 text-sm bg-white focus:border-lux-gold focus:ring-1 focus:ring-lux-gold focus:outline-none transition-colors"
              value={yearMin as number | ""}
              min={0}
              onChange={(e) => setYearMin(Number(e.target.value) || "")}
              aria-label="Min year"
              placeholder="From"
            />
            <span className="text-lux-gray-light">–</span>
            <input
              type="number"
              className="w-20 rounded-md border border-lux-silver px-3 py-2 text-sm bg-white focus:border-lux-gold focus:ring-1 focus:ring-lux-gold focus:outline-none transition-colors"
              value={yearMax as number | ""}
              min={0}
              onChange={(e) => setYearMax(Number(e.target.value) || "")}
              aria-label="Max year"
              placeholder="To"
            />
          </div>
        </fieldset>

        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={apply}
            className="w-full bg-lux-gold hover:bg-lux-gold-light text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={clearAll}
            className="w-full border border-lux-silver hover:border-lux-gold text-lux-charcoal hover:text-lux-gold px-4 py-2.5 rounded-md text-sm transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </aside>
  );
}

