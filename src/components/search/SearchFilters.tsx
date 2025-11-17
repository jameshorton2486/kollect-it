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
    <div className="bg-background border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="font-semibold">Filters</h2>
          {totalSelected > 0 && (
            <p className="text-sm text-muted-foreground">
              {totalSelected} selected
            </p>
          )}
        </div>
        {totalSelected > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="divide-y">
        {filters.map((section) => {
          const isExpanded = expandedSections[section.id] !== false;
          const sectionValues = selectedFilters[section.id] || [];

          return (
            <div key={section.id} className="p-4">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex justify-between items-center mb-3"
              >
                <span className="font-medium">
                  {section.title}
                  {sectionValues.length > 0 && (
                    <span className="ml-2 text-sm text-primary">
                      ({sectionValues.length})
                    </span>
                  )}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-2">
                  {section.type === "checkbox" && section.options && (
                    <>
                      {section.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={sectionValues.includes(option.value)}
                            onChange={() =>
                              handleCheckboxChange(section.id, option.value)
                            }
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="flex-1 text-sm">
                            {option.label}
                            {option.count !== undefined && (
                              <span className="text-muted-foreground ml-1">
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
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={section.id}
                            checked={sectionValues.includes(option.value)}
                            onChange={() =>
                              handleRadioChange(section.id, option.value)
                            }
                            className="border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="flex-1 text-sm">{option.label}</span>
                        </label>
                      ))}
                    </>
                  )}

                  {section.type === "range" && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
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
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                        <span className="py-2">-</span>
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
                          className="flex-1 px-3 py-2 border rounded text-sm"
                        />
                      </div>
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

