"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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

interface SearchFiltersProps {
  filters: FilterSection[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (filterId: string, values: string[]) => void;
  onClearAll: () => void;
}

export default function SearchFilters({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleCheckboxChange = (filterId: string, value: string) => {
    const current = selectedFilters[filterId] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange(filterId, updated);
  };

  const handleRadioChange = (filterId: string, value: string) => {
    onFilterChange(filterId, [value]);
  };

  const totalSelected = Object.values(selectedFilters).reduce(
    (sum, values) => sum + values.length,
    0,
  );

  return (
    <div className="rounded-3xl border border-border-200 bg-white/90 shadow-lg">
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
            className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-700 underline-offset-4 hover:text-ink-900 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="divide-y divide-border-200">
        {filters.map((section) => {
          const isExpanded = expandedSections[section.id] !== false;
          const sectionValues = selectedFilters[section.id] || [];

          return (
            <div key={section.id} className="px-5 py-4">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-ink-900">
                  {section.title}
                  {sectionValues.length > 0 && (
                    <span className="ml-2 text-xs text-ink-700">
                      ({sectionValues.length})
                    </span>
                  )}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-ink-700" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-ink-700" />
                )}
              </button>

              {isExpanded && (
                <div className="mt-4 space-y-2">
                  {section.type === "checkbox" && section.options && (
                    <>
                      {section.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-ink-700 transition hover:bg-surface-100"
                        >
                          <input
                            type="checkbox"
                            checked={sectionValues.includes(option.value)}
                            onChange={() =>
                              handleCheckboxChange(section.id, option.value)
                            }
                            className="h-4 w-4 rounded border-border-200 text-ink-900 focus:ring-lux-gold"
                          />
                          <span className="flex-1">
                            {option.label}
                            {option.count !== undefined && (
                              <span className="ml-2 text-xs text-ink-700">
                                ({option.count})
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </>
                  )}

                  {section.type === "radio" && section.options && (
                    <>
                      {section.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-ink-700 transition hover:bg-surface-100"
                        >
                          <input
                            type="radio"
                            name={section.id}
                            checked={sectionValues.includes(option.value)}
                            onChange={() =>
                              handleRadioChange(section.id, option.value)
                            }
                            className="border-border-200 text-ink-900 focus:ring-lux-gold"
                          />
                          <span className="flex-1">{option.label}</span>
                        </label>
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
                        value={sectionValues[0] || ""}
                        onChange={(e) => {
                          const newValues = [
                            e.target.value,
                            sectionValues[1] || "",
                          ];
                          onFilterChange(
                            section.id,
                            newValues.filter(Boolean),
                          );
                        }}
                        className="flex-1 rounded-full border border-border-200 bg-surface-50 px-4 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-lux-gold focus:outline-none focus:ring-1 focus:ring-lux-gold"
                      />
                      <span className="text-ink-300">—</span>
                      <input
                        type="number"
                        placeholder="Max"
                        min={section.min}
                        max={section.max}
                        value={sectionValues[1] || ""}
                        onChange={(e) => {
                          const newValues = [
                            sectionValues[0] || "",
                            e.target.value,
                          ];
                          onFilterChange(
                            section.id,
                            newValues.filter(Boolean),
                          );
                        }}
                        className="flex-1 rounded-full border border-border-200 bg-surface-50 px-4 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-lux-gold focus:outline-none focus:ring-1 focus:ring-lux-gold"
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
