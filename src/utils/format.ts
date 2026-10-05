const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** 124000 → "124K", 1200000 → "1.2M". */
export function formatCompactNumber(value: number): string {
  return compactNumber.format(value);
}

/** 92 → "92%". Expects a whole-number percentage, not a 0–1 ratio. */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
