import type { Formatter, ValueType } from "recharts/types/component/DefaultTooltipContent";

/**
 * Recharts Formatter contract:
 * - Generic must be ValueType
 * - value MAY be undefined at runtime
 * - undefined must be handled inside the function
 */

export const currencyFormatter: Formatter<ValueType, string> = (value) => {
  if (typeof value !== "number") return "$0.00";
  return `$${value.toFixed(2)}`;
};

export const revenueFormatter: Formatter<ValueType, "Revenue"> = (value) => {
  if (typeof value !== "number") return ["$0.00", "Revenue"];
  return [`$${value.toFixed(2)}`, "Revenue"];
};

export const ordersFormatter: Formatter<ValueType, "Orders"> = (value) => {
  if (typeof value !== "number") return ["0 orders", "Orders"];
  return [`${value} orders`, "Orders"];
};

export const visitorsFormatter: Formatter<ValueType, "Visitors"> = (value) => {
  if (typeof value !== "number") return ["0", "Visitors"];
  return [`${value}`, "Visitors"];
};