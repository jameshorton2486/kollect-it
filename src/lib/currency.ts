export function formatUSD(amount: number | string | null | undefined): string {
  const num = typeof amount === 'string' ? Number(amount) : amount;
  if (num == null || Number.isNaN(num)) return '$0.00';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    // Fallback
    const fixed = Number(num).toFixed(2);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `$${parts.join('.')}`;
  }
}
