/**
 * Mobile Filter Panel Component
 * Phase 6 Step 9 - Touch-friendly filter controls
 */

"use client";

import { useState } from "react";
import { Filter, X, Check } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  id: string;
  label: string;
  type: "select" | "multiselect" | "date" | "range";
  options?: FilterOption[];
  placeholder?: string;
}

interface MobileFilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (filterId: string, value: any) => void;
  onApply: () => void;
  onReset: () => void;
}

export function MobileFilterPanel({
  filters,
  values,
  onChange,
  onApply,
  onReset,
}: MobileFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = Object.keys(values).filter((key) => {
    const value = values[key];
    return value && (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filters.map((filter) => (
                <div key={filter.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filter.label}
                  </label>

                  {filter.type === "select" && (
                    <select
                      value={values[filter.id] || ""}
                      onChange={(e) => onChange(filter.id, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    >
                      <option value="">
                        {filter.placeholder || "Select..."}
                      </option>
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {filter.type === "multiselect" && (
                    <div className="space-y-2 border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                      {filter.options?.map((option) => {
                        const selected = (values[filter.id] || []).includes(
                          option.value,
                        );
                        return (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <div
                              className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                                selected
                                  ? "bg-blue-600 border-blue-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {selected && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className="text-sm">{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {filter.type === "date" && (
                    <input
                      type="date"
                      value={values[filter.id] || ""}
                      onChange={(e) => onChange(filter.id, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    />
                  )}

                  {filter.type === "range" && (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={values[filter.id]?.min || ""}
                        onChange={(e) =>
                          onChange(filter.id, {
                            ...values[filter.id],
                            min: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={values[filter.id]?.max || ""}
                        onChange={(e) =>
                          onChange(filter.id, {
                            ...values[filter.id],
                            max: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  onReset();
                  setIsOpen(false);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  onApply();
                  setIsOpen(false);
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

