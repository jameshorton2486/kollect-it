/**
 * Responsive Table Component
 * Phase 6 Step 9 - Mobile-optimized data tables
 */

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  mobileLabel?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  keyField: string;
  onRowClick?: (row: any) => void;
}

export function ResponsiveTable({
  columns,
  data,
  keyField,
  onRowClick,
}: ResponsiveTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const sortedData = sortColumn
    ? [...data].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        const modifier = sortDirection === "asc" ? 1 : -1;

        if (typeof aVal === "string") {
          return aVal.localeCompare(bVal) * modifier;
        }
        return (aVal - bVal) * modifier;
      })
    : data;

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-surface-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer hover:bg-surface-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable &&
                      sortColumn === column.key &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface-0 divide-y divide-gray-200">
            {sortedData.map((row) => (
              <tr
                key={row[keyField]}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? "cursor-pointer hover:bg-surface-50" : ""}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-ink-900"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {sortedData.map((row) => (
          <div
            key={row[keyField]}
            onClick={() => onRowClick?.(row)}
            className="bg-surface-0 rounded-lg shadow-sm border border-border-200 p-4 space-y-3"
          >
            {columns.map((column) => (
              <div
                key={column.key}
                className="flex justify-between items-start"
              >
                <span className="text-sm font-medium text-ink-700">
                  {column.mobileLabel || column.label}
                </span>
                <span className="text-sm text-ink-900 text-right ml-4">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

