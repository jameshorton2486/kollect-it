"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { FilterCheckbox } from "./FilterCheckbox";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterSection {
  id: string;
  title: string;
  type: "checkbox" | "range" | "radio";
  options?: FilterOption[];
  min?: number;
  max?: number;
}

interface FilterPanelProps {
  /** Array of filter sections */
  sections: FilterSection[];
  /** Selected filter values */
  selectedFilters: Record<string, string[]>;
  /** Filter change handler */
  onFilterChange: (filterId: string, values: string[]) => void;
  /** Clear all filters handler */
  onClearAll: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FilterPanel - A luxury-styled filter sidebar component
 *
 * Used for: Browse page, search page, category pages
 *
 * @example
 * <FilterPanel
 *   sections={filterSections}
 *   selectedFilters={selectedFilters}
 *   onFilterChange={handleFilterChange}
 *   onClearAll={handleClearAll}
 * />
 */
export function FilterPanel({
  sections,
  selectedFilters,
  onFilterChange,
  onClearAll,
  className = "",
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, section) => ({ ...acc, [section.id]: true }), {})
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleCheckboxChange = (filterId: string, value: string, checked: boolean) => {
    const current = selectedFilters[filterId] || [];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFilterChange(filterId, updated);
  };

  const totalSelected = Object.values(selectedFilters).reduce(
    (sum, values) => sum + values.length,
    0
  );

  return (
    <div className={cn("rounded-3xl border border-border-200 bg-white/90 shadow-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-200 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-700">
            Filters
          </p>
          {totalSelected > 0 && (
            <p className="text-sm text-ink-700">{totalSelected} selected</p>
          )}
        </div>
        {totalSelected > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-700 underline-offset-4 hover:text-lux-gold hover:underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="divide-y divide-border-200">
        {sections.map((section) => {
          const isExpanded = expandedSections[section.id] !== false;
          const sectionValues = selectedFilters[section.id] || [];

          return (
            <div key={section.id} className="px-5 py-4">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2"
              >
                <span className="text-sm font-semibold text-ink-900">
                  {section.title}
                  {sectionValues.length > 0 && (
                    <span className="ml-2 text-xs text-lux-gray-light">
                      ({sectionValues.length})
                    </span>
                  )}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-lux-gold" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-lux-gray" />
                )}
              </button>

              {isExpanded && (
                <div className="mt-4 space-y-2">
                  {section.type === "checkbox" && section.options && (
                    <>
                      {section.options.map((option) => (
                        <FilterCheckbox
                          key={option.value}
                          value={option.value}
                          label={option.label}
                          checked={sectionValues.includes(option.value)}
                          onChange={(checked) =>
                            handleCheckboxChange(section.id, option.value, checked)
                          }
                          count={option.count}
                        />
                      ))}
                    </>
                  )}

                  {section.type === "range" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        min={section.min}
                        max={section.max}
                        className="flex-1 rounded-full border border-border-200 bg-surface-50 px-4 py-2 text-sm text-ink-900 placeholder:text-lux-gray-light focus:border-lux-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2"
                      />
                      <span className="text-lux-gray-light">—</span>
                      <input
                        type="number"
                        placeholder="Max"
                        min={section.min}
                        max={section.max}
                        className="flex-1 rounded-full border border-border-200 bg-surface-50 px-4 py-2 text-sm text-ink-900 placeholder:text-lux-gray-light focus:border-lux-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-lux-gold focus-visible:ring-offset-2"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FilterPanel;

