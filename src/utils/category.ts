import { palette } from "@/data/mock";

const icons: Record<string, string> = {
  Income: "banknote",
  Groceries: "shopping-bag",
  Dining: "utensils",
  Housing: "home",
  Transport: "car",
  Shopping: "shopping-bag",
  Utilities: "zap",
  Subscriptions: "film",
  Health: "heart-pulse",
  Travel: "plane",
  Education: "graduation-cap",
  Transfers: "arrow-left-right",
};

/**
 * Hues come from the shared chart palette rather than a separate set, so a
 * category reads the same colour in a transaction row, a budget bar, and the
 * spending donut. The six budget categories match `budgets` in mock data
 * exactly — keep them in step.
 */
const colors: Record<string, string> = {
  Housing: palette.steel,
  Groceries: palette.green,
  Dining: palette.brick,
  Shopping: palette.amber,
  Transport: palette.teal,
  Utilities: palette.plum,
  Income: palette.green,
  Travel: palette.steel,
  Education: palette.plum,
  Transfers: palette.teal,
  Subscriptions: palette.slate,
  Health: palette.slate,
};

export function categoryIcon(category: string): string {
  return icons[category] ?? "receipt";
}

export function categoryColor(category: string): string {
  return colors[category] ?? palette.slate;
}

export const statusVariant: Record<string, "mint" | "sun" | "coral"> = {
  completed: "mint",
  pending: "sun",
  failed: "coral",
};
