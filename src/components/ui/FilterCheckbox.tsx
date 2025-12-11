"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FilterCheckboxProps {
  /** Checkbox value */
  value: string;
  /** Checkbox label */
  label: string;
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Optional count badge */
  count?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FilterCheckbox - A luxury-styled checkbox for filter panels
 *
 * Used for: Search filters, category filters, filter sidebars
 *
 * @example
 * <FilterCheckbox
 *   value="fine-art"
 *   label="Fine Art"
 *   checked={selected.includes("fine-art")}
 *   onChange={(checked) => handleChange("fine-art", checked)}
 *   count={150}
 * />
 */
export function FilterCheckbox({
  value,
  label,
  checked,
  onChange,
  count,
  className = "",
}: FilterCheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm cursor-pointer transition-all duration-200",
        "hover:bg-surface-100",
        checked && "bg-lux-cream/50",
        className
      )}
    >
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-lux-silver text-lux-gold focus:ring-2 focus:ring-lux-gold focus:ring-offset-2 cursor-pointer"
      />
      <span className="flex-1 text-ink-700">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-lux-gray-light">({count})</span>
      )}
    </label>
  );
}

export default FilterCheckbox;
