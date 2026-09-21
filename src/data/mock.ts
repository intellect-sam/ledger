export type TransactionStatus = "completed" | "pending" | "failed";
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  /** ISO date, e.g. "2026-09-12" */
  date: string;
  /** Always positive — use `type` to determine direction. */
  amount: number;
  type: TransactionType;
  account: string;
  status: TransactionStatus;
}

export interface Account {
  id: string;
  name: string;
  /** e.g. "Visa •• 4291" */
  detail: string;
  balance: number;
  kind: "checking" | "savings" | "credit" | "investment" | "cash";
  /** Month-over-month change in percent. */
  change: number;
  /** Recent balance samples for the sparkline. */
  spark: number[];
}

export interface Budget {
  id: string;
  category: string;
  icon: string;
  spent: number;
  limit: number;
  /** Hex used by the progress bar and donut. */
  color: string;
}

export interface MonthlyPoint {
  label: string;
  income: number;
  expense: number;
}

export interface CategorySlice {
  label: string;
  value: number;
  color: string;
}

export interface Bill {
  id: string;
  name: string;
  icon: string;
  due: string;
  amount: number;
  autopay: boolean;
}

export interface Goal {
  id: string;
  name: string;
  saved: number;
  target: number;
  color: string;
}

/**
 * Muted, print-like data palette. Desaturated on purpose so the chart colors
 * stay legible without turning the dashboard into a rainbow.
 */
export const palette = {
  steel: "#2f6690",
  green: "#3f8f6f",
  brick: "#b4544a",
  amber: "#c08a2e",
  plum: "#6b5b95",
  slate: "#5f7a8a",
  teal: "#4a7c9b",
} as const;

export const navItems = [
  { label: "Overview", to: "/dashboard", icon: "layout-dashboard" },
  { label: "Transactions", to: "/transactions", icon: "arrow-left-right" },
  { label: "Budgets", to: "/budgets", icon: "target" },
  { label: "Accounts", to: "/accounts", icon: "wallet" },
  { label: "Analytics", to: "/analytics", icon: "bar-chart" },
  { label: "Settings", to: "/settings", icon: "settings" },
];

export const accounts: Account[] = [
  {
    id: "acc_1",
    name: "Everyday Checking",
    detail: "Chase •• 4291",
    balance: 12480.55,
    kind: "checking",
    change: 4.2,
    spark: [9.1, 9.8, 9.4, 10.6, 11.2, 10.9, 12.4],
  },
  {
    id: "acc_2",
    name: "High-Yield Savings",
    detail: "Ally •• 7710",
    balance: 28640.0,
    kind: "savings",
    change: 9.6,
    spark: [18.2, 19.4, 20.1, 22.8, 24.0, 26.1, 28.6],
  },
  {
    id: "acc_3",
    name: "Sapphire Card",
    detail: "Visa •• 1043",
    balance: -2145.9,
    kind: "credit",
    change: -12.8,
    spark: [3.4, 3.1, 2.9, 2.6, 2.4, 2.3, 2.1],
  },
  {
    id: "acc_4",
    name: "Brokerage",
    detail: "Fidelity •• 8820",
    balance: 41920.34,
    kind: "investment",
    change: 15.3,
    spark: [28.4, 30.1, 31.9, 35.2, 37.0, 39.4, 41.9],
  },
  {
    id: "acc_5",
    name: "Travel Wallet",
    detail: "Revolut •• 3312",
    balance: 860.4,
    kind: "cash",
    change: -3.1,
    spark: [1.1, 1.0, 0.98, 0.95, 0.9, 0.88, 0.86],
  },
];

export const transactions: Transaction[] = [
  {
    id: "txn_001",
    merchant: "Salary — Northwind Labs",
    category: "Income",
    date: "2026-09-15",
    amount: 6420.0,
    type: "income",
    account: "Everyday Checking",
    status: "completed",
  },
  {
    id: "txn_002",
    merchant: "Whole Foods Market",
    category: "Groceries",
    date: "2026-09-14",
    amount: 184.32,
    type: "expense",
    account: "Sapphire Card",
    status: "completed",
  },
  {
    id: "txn_003",
    merchant: "Spotify Premium",
    category: "Subscriptions",
    date: "2026-09-14",
    amount: 11.99,
    type: "expense",
    account: "Sapphire Card",
    status: "completed",
  },
  {
    id: "txn_004",
    merchant: "Rent — Maple Street",
    category: "Housing",
    date: "2026-09-13",
    amount: 2100.0,
    type: "expense",
    account: "Everyday Checking",
    status: "completed",
  },
  {
    id: "txn_005",
    merchant: "Uber",
    category: "Transport",
    date: "2026-09-12",
    amount: 24.6,
    type: "expense",
    account: "Sapphire Card",
    status: "completed",
  },
  {
    id: "txn_006",
    merchant: "Freelance — Delta Studio",
    category: "Income",
    date: "2026-09-11",
    amount: 1450.0,
    type: "income",
    account: "Everyday Checking",
    status: "completed",
  },
  {
    id: "txn_007",
    merchant: "Blue Bottle Coffee",
    category: "Dining",
    date: "2026-09-11",
    amount: 8.75,
    type: "expense",
    account: "Travel Wallet",
    status: "completed",
  },
  {
    id: "txn_008",
    merchant: "Equinox Membership",
    category: "Health",
    date: "2026-09-10",
    amount: 215.0,
    type: "expense",
    account: "Sapphire Card",
    status: "completed",
  },
  {
    id: "txn_009",
    merchant: "Amazon",
    category: "Shopping",
    date: "2026-09-09",
    amount: 143.18,
    type: "expense",
    account: "Sapphire Card",
    status: "pending",
  },
  {
    id: "txn_010",
    merchant: "Delta Air Lines",
    category: "Travel",
    date: "2026-09-08",
    amount: 612.4,
    type: "expense",
    account: "Sapphire Card",
    status: "completed",
  },
  {
    id: "txn_011",
    merchant: "Con Edison",
    category: "Utilities",
    date: "2026-09-07",
    amount: 128.55,
    type: "expense",
    account: "Everyday Checking",
    status: "completed",
  },
  {
    id: "txn_012",
    merchant: "Vanguard Dividend",
    category: "Income",
    date: "2026-09-06",
    amount: 328.7,
    type: "income",
    account: "Brokerage",
    status: "completed",
  },
  {
    id: "txn_013",
    merchant: "Trader Joe's",
    category: "Groceries",
    date: "2026-09-05",
    amount: 96.14,
    type: "expense",
    account: "Sapphire Card",
    status: "completed",
  },
  {
    id: "txn_014",
    merchant: "Netflix",
    category: "Subscriptions",
    date: "2026-09-04",
    amount: 22.99,
    type: "expense",
    account: "Sapphire Card",
    status: "failed",
  },
  {
    id: "txn_015",
    merchant: "Shell Gas Station",
    category: "Transport",
    date: "2026-09-03",
    amount: 61.2,
    type: "expense",
    account: "Sapphire Card",
    status: "completed",
  },
  {
    id: "txn_016",
    merchant: "Bookshop.org",
    category: "Shopping",
    date: "2026-09-02",
    amount: 47.5,
    type: "expense",
    account: "Sapphire Card",
    status: "completed",
  },
];

export const budgets: Budget[] = [
  { id: "b_1", category: "Housing", icon: "home", spent: 2100, limit: 2200, color: palette.steel },
  { id: "b_2", category: "Groceries", icon: "shopping-bag", spent: 640, limit: 900, color: palette.green },
  { id: "b_3", category: "Dining", icon: "utensils", spent: 412, limit: 400, color: palette.brick },
  { id: "b_4", category: "Transport", icon: "car", spent: 186, limit: 350, color: palette.teal },
  { id: "b_5", category: "Shopping", icon: "shopping-bag", spent: 291, limit: 500, color: palette.amber },
  { id: "b_6", category: "Utilities", icon: "zap", spent: 128, limit: 260, color: palette.plum },
];

export const monthlySeries: MonthlyPoint[] = [
  { label: "Oct", income: 7100, expense: 5240 },
  { label: "Nov", income: 6850, expense: 5610 },
  { label: "Dec", income: 9200, expense: 7480 },
  { label: "Jan", income: 6900, expense: 4820 },
  { label: "Feb", income: 7050, expense: 5390 },
  { label: "Mar", income: 7480, expense: 6120 },
  { label: "Apr", income: 7120, expense: 4980 },
  { label: "May", income: 7900, expense: 5740 },
  { label: "Jun", income: 7260, expense: 5210 },
  { label: "Jul", income: 8340, expense: 6480 },
  { label: "Aug", income: 7620, expense: 5560 },
  { label: "Sep", income: 8198, expense: 3935 },
];

export const categoryBreakdown: CategorySlice[] = [
  { label: "Housing", value: 2100, color: palette.steel },
  { label: "Groceries", value: 640, color: palette.green },
  { label: "Dining", value: 412, color: palette.brick },
  { label: "Shopping", value: 291, color: palette.amber },
  { label: "Transport", value: 186, color: palette.teal },
  { label: "Utilities", value: 128, color: palette.plum },
];

/** Average spend per weekday for the current month. */
export const weekdaySpending: CategorySlice[] = [
  { label: "Monday", value: 320, color: palette.steel },
  { label: "Tuesday", value: 268, color: palette.steel },
  { label: "Wednesday", value: 412, color: palette.steel },
  { label: "Thursday", value: 356, color: palette.steel },
  { label: "Friday", value: 584, color: palette.plum },
  { label: "Saturday", value: 892, color: palette.brick },
  { label: "Sunday", value: 486, color: palette.slate },
];

export const netWorthSeries = [
  58200, 59600, 59100, 62400, 63900, 63200, 66800, 68400, 67900, 71200, 73500, 76120,
];

/** Cumulative spend against a monthly budget line, for pace tracking. */
export const paceActual = [
  52, 170, 254, 464, 607, 703, 764, 892, 1066, 1158, 1205, 1425, 1583, 1671, 2073, 2205, 2281, 2475,
  2585, 2649, 2797, 2889, 3007, 3175, 3259, 3315, 3437, 3535, 3609, 3655,
];

export const paceBudget = Array.from({ length: 30 }, (_, index) =>
  Math.round(((index + 1) / 30) * 3700),
);

export const cashFlowSeries = [1860, 1240, 1720, 2080, 1660, 1360, 2140, 2160, 2050, 1860, 2060, 4263];

export const goals: Goal[] = [
  { id: "goal_1", name: "Emergency Fund", saved: 18400, target: 24000, color: palette.green },
  { id: "goal_2", name: "Japan Trip", saved: 3120, target: 6000, color: palette.steel },
  { id: "goal_3", name: "New MacBook", saved: 1450, target: 2600, color: palette.plum },
];

export const upcomingBills: Bill[] = [
  { id: "bill_1", name: "Rent — Maple Street", icon: "home", due: "2026-10-01", amount: 2100, autopay: true },
  { id: "bill_2", name: "Con Edison", icon: "zap", due: "2026-10-03", amount: 132.4, autopay: true },
  { id: "bill_3", name: "Equinox Membership", icon: "heart-pulse", due: "2026-10-10", amount: 215, autopay: false },
  { id: "bill_4", name: "Spotify Premium", icon: "film", due: "2026-10-14", amount: 11.99, autopay: true },
  { id: "bill_5", name: "Sapphire Card Payment", icon: "credit-card", due: "2026-10-18", amount: 1840.22, autopay: false },
];

/** Convenience totals used by the Overview stat cards. */
export const summary = {
  totalBalance: 81755.39,
  totalBalanceChange: 6.8,
  monthlyIncome: 8198,
  monthlyIncomeChange: 7.6,
  monthlyExpense: 3935,
  monthlyExpenseChange: -18.4,
  savingsRate: 52,
  savingsRateChange: 9.2,
};
