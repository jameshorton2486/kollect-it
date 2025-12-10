"use client";

/**
 * Metric Card Component
 */

import { MetricCardData } from "@/lib/analytics/types";

interface MetricCardProps extends MetricCardData {}

export function MetricCard({
  title,
  value,
  unit,
  prefix = "",
  trend,
  trendLabel,
  color = "bg-lux-charcoal",
  borderColor = "border-lux-gold",
}: MetricCardProps) {
  // Determine trend direction and styling
  let trendDirection: "up" | "down" | "neutral" = "neutral";
  let trendPercentage = 0;

  if (typeof trend === "number") {
    trendPercentage = Math.abs(trend);
    trendDirection = trend > 0 ? "up" : trend < 0 ? "down" : "neutral";
  } else if (trend) {
    trendDirection = trend.direction;
    trendPercentage = trend.percentage;
  }

  const trendColor =
    trendDirection === "up"
      ? "text-green-400"
      : trendDirection === "down"
        ? "text-red-400"
        : "text-lux-gray";

  const trendIcon =
    trendDirection === "up" ? "↑" : trendDirection === "down" ? "↓" : "→";

  return (
    <div className={`${color} border ${borderColor} rounded-xl p-6 shadow-clean`}>
      <p className="text-sm font-medium text-label text-lux-cream">{title}</p>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-lux-cream">
            {prefix}
            {typeof value === "number"
              ? value.toLocaleString("en-US", {
                  maximumFractionDigits: value > 100 ? 0 : 2,
                })
              : value}
          </p>
          <p className="text-xs text-lux-gray-light mt-1">{unit}</p>
        </div>
        {trend !== undefined && (
          <div className={`text-right ${trendColor}`}>
            <p className="text-lg font-semibold">
              {trendIcon} {trendPercentage.toFixed(1)}%
            </p>
            <p className="text-xs text-lux-gray-light">{trendLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}

