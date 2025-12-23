import { DashboardMetrics } from "./types";

/**
 * Export analytics metrics as JSON
 */
export function exportMetricsAsJSON(metrics: DashboardMetrics): string {
  return JSON.stringify(metrics, null, 2);
}

/**
 * Export analytics metrics as CSV
 */
export function exportMetricsAsCSV(metrics: DashboardMetrics): string {
  const lines: string[] = [];

  // Approval Metrics
  lines.push("APPROVAL METRICS");
  lines.push(`Total Submitted,${metrics.approval.totalSubmitted}`);
  lines.push(`Approved,${metrics.approval.approved}`);
  lines.push(`Rejected,${metrics.approval.rejected}`);
  lines.push(`Pending,${metrics.approval.pending}`);
  lines.push(`Approval Rate %,${metrics.approval.approvalRate}`);
  lines.push("");

  // Revenue Metrics
  lines.push("REVENUE METRICS");
  lines.push(`Total Revenue,${metrics.revenue.totalRevenue}`);
  lines.push(`Average Order Value,${metrics.revenue.averageOrderValue}`);
  lines.push("");

  // Revenue by Category
  lines.push("REVENUE BY CATEGORY");
  lines.push("Category,Revenue,Percentage,Items Sold");
  metrics.revenue.revenueByCategory.forEach((cat) => {
    lines.push(
      `${cat.category},${cat.revenue},${cat.percentage},${cat.itemsSold}`,
    );
  });
  lines.push("");

  // Pricing Metrics
  lines.push("PRICING METRICS");
  lines.push(`Average Confidence,${metrics.pricing.averageConfidence}`);
  lines.push(`Auto-Approved Count,${metrics.pricing.autoApprovedCount}`);
  lines.push(`Manual Review Count,${metrics.pricing.manualReviewCount}`);
  lines.push(`Low Confidence Count,${metrics.pricing.lowConfidenceCount}`);
  lines.push("");

  // Product Metrics
  lines.push("PRODUCT METRICS");
  lines.push(`Total Products,${metrics.products.totalProducts}`);
  lines.push(`Active Products,${metrics.products.activeProducts}`);
  lines.push(`Average Price,${metrics.products.averagePrice}`);
  lines.push(`Min Price,${metrics.products.priceRange.min}`);
  lines.push(`Max Price,${metrics.products.priceRange.max}`);
  lines.push("");

  // Category Breakdown
  lines.push("CATEGORY BREAKDOWN");
  lines.push("Category,Count,Average Price,Revenue");
  metrics.products.categoryBreakdown.forEach((cat) => {
    lines.push(
      `${cat.category},${cat.count},${cat.averagePrice},${cat.revenue}`,
    );
  });

  return lines.join("\n");
}

/**
 * Download metrics as file
 */
export function downloadMetrics(
  metrics: DashboardMetrics,
  format: "json" | "csv" = "json",
) {
  const content =
    format === "json"
      ? exportMetricsAsJSON(metrics)
      : exportMetricsAsCSV(metrics);
  const filename = `analytics-${new Date().toISOString().split("T")[0]}.${format}`;

  const blob = new Blob([content], {
    type: format === "json" ? "application/json" : "text/csv",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

