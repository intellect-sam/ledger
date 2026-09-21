const usd = (decimals: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/** `-1234.5` → `"-$1,234.50"` */
export function formatCurrency(value: number, decimals = true): string {
  const digits = decimals ? 2 : 0;
  const sign = value < 0 ? "-" : "";
  return `${sign}${usd(digits).format(Math.abs(value))}`;
}

/** `1234.5` → `"+$1,234.50"`, `-20` → `"-$20.00"` */
export function formatSignedCurrency(value: number): string {
  return `${value < 0 ? "-" : "+"}${usd(2).format(Math.abs(value))}`;
}

/** Chart axes and dense tiles: `24600` → `"$24.6k"` */
export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

/** `12.44` → `"12.4%"` */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** `"2026-09-12"` → `"Sep 12"` */
export function formatDate(iso: string, withYear = false): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

/** Turns `"2026-09-12"` into `"Today"` / `"Yesterday"` when it is recent. */
export function formatRelativeDate(iso: string, today = new Date()): string {
  const date = new Date(`${iso}T00:00:00`);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.round((startOfToday.getTime() - date.getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days > 1 && days < 7) return `${days} days ago`;
  return formatDate(iso);
}
