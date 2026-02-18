export type Account = {
  id: string;
  name: string;
  institution: string;
  type: "Savings" | "Checking" | "Credit Card" | "Investment" | "Cash";
  balance: number;
  lastActivity: string;
  accentColor: string;
  number: string;
};

export type Transaction = {
  id: string;
  description: string;
  category: string;
  categoryColor: string;
  amount: number;
  type: "income" | "expense";
  account: string;
  date: string;
  time: string;
};

export type BudgetCategory = {
  id: string;
  name: string;
  icon: string;
  budget: number;
  spent: number;
  color: string;
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
  icon: string;
  monthlyNeeded: number;
};

export type MonthlyData = {
  month: string;
  income: number;
  expense: number;
};

export type CategoryBreakdown = {
  name: string;
  amount: number;
  percent: number;
  color: string;
};

export type MerchantSummary = {
  name: string;
  count: number;
  total: number;
};

export type MetricData = {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
};

export type InsightMetric = {
  label: string;
  value: string;
  desc: string;
};

export type ChartPoint = {
  month: string;
  value: number;
};
