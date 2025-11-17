export function formatUSD(amount: number | string | null | undefined): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (num == null || Number.isNaN(num)) return "$0.00";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    // Fallback
    const fixed = Number(num).toFixed(2);
    const parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `$${parts.join(".")}`;
  }
}

export function formatUSDWhole(
  amount: number | string | null | undefined,
): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (num == null || Number.isNaN(num)) return "$0";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    // Fallback: thousands with no decimals
    const whole = Math.round(Number(num));
    const s = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `$${s}`;
  }
}

export function formatUSD0(amount: number | string | null | undefined): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (num == null || Number.isNaN(num)) return "$0";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    // Fallback: thousands separators, no decimals
    const int = Math.round(Number(num));
    const withSep = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `$${withSep}`;
  }
}

