/**
 * CSV Export Utility
 *
 * Converts JSON data to CSV format for download
 * Used for exporting analytics reports
 */

export interface CSVColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

/**
 * Convert JSON array to CSV string
 */
export function jsonToCSV(data: any[], columns: CSVColumn[]): string {
  if (!data || data.length === 0) {
    return "";
  }

  // Create header row
  const headers = columns.map((col) => escapeCSV(col.label)).join(",");

  // Create data rows
  const rows = data.map((row) => {
    return columns
      .map((col) => {
        const value = row[col.key];
        const formatted = col.format ? col.format(value) : value;
        return escapeCSV(String(formatted ?? ""));
      })
      .join(",");
  });

  return [headers, ...rows].join("\n");
}

/**
 * Escape special characters for CSV
 */
function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Format currency for CSV
 */
export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

/**
 * Format date for CSV
 */
export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

/**
 * Format datetime for CSV
 */
export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleString();
}

/**
 * Format percentage for CSV
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Create downloadable CSV blob
 */
export function createCSVBlob(csvContent: string): Blob {
  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
}

/**
 * Trigger CSV download in browser
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = createCSVBlob(csvContent);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export sales data to CSV
 */
export function exportSalesCSV(salesData: any[]): void {
  const columns: CSVColumn[] = [
    { key: "date", label: "Date", format: formatDate },
    { key: "revenue", label: "Revenue", format: formatCurrency },
    { key: "orders", label: "Orders" },
    {
      key: "avgOrderValue",
      label: "Average Order Value",
      format: formatCurrency,
    },
  ];

  const csv = jsonToCSV(salesData, columns);
  const filename = `sales-report-${new Date().toISOString().split("T")[0]}.csv`;
  downloadCSV(filename, csv);
}

/**
 * Export customer data to CSV
 */
export function exportCustomersCSV(customerData: any[]): void {
  const columns: CSVColumn[] = [
    { key: "email", label: "Email" },
    { key: "orderCount", label: "Total Orders" },
    { key: "totalSpent", label: "Total Spent", format: formatCurrency },
    { key: "firstOrder", label: "First Order", format: formatDate },
    { key: "lastOrder", label: "Last Order", format: formatDate },
  ];

  const csv = jsonToCSV(customerData, columns);
  const filename = `customers-report-${new Date().toISOString().split("T")[0]}.csv`;
  downloadCSV(filename, csv);
}

/**
 * Export product performance to CSV
 */
export function exportProductsCSV(productData: any[]): void {
  const columns: CSVColumn[] = [
    { key: "title", label: "Product" },
    { key: "revenue", label: "Revenue", format: formatCurrency },
    { key: "quantity", label: "Units Sold" },
    { key: "orders", label: "Number of Orders" },
  ];

  const csv = jsonToCSV(productData, columns);
  const filename = `products-report-${new Date().toISOString().split("T")[0]}.csv`;
  downloadCSV(filename, csv);
}

/**
 * Export orders to CSV
 */
export function exportOrdersCSV(orders: any[]): void {
  const columns: CSVColumn[] = [
    { key: "orderNumber", label: "Order Number" },
    { key: "customerName", label: "Customer" },
    { key: "customerEmail", label: "Email" },
    { key: "total", label: "Total", format: formatCurrency },
    { key: "status", label: "Status" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "createdAt", label: "Order Date", format: formatDateTime },
  ];

  const csv = jsonToCSV(orders, columns);
  const filename = `orders-export-${new Date().toISOString().split("T")[0]}.csv`;
  downloadCSV(filename, csv);
}

