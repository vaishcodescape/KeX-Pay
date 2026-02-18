"use client";

import { useState } from "react";
import type { Transaction, InsightMetric } from "../../lib/types";

function computeInsights(transactions: Transaction[]): { percent: number; metrics: InsightMetric[] } {
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const savings = income - expense;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  const categories: Record<string, number> = {};
  transactions.filter((t) => t.type === "expense").forEach((t) => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });
  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

  const healthScore = Math.min(100, Math.max(0,
    (savingsRate >= 20 ? 40 : savingsRate >= 10 ? 25 : savingsRate >= 0 ? 10 : 0)
    + (transactions.length >= 5 ? 30 : transactions.length >= 2 ? 15 : 0)
    + (income > 0 ? 30 : 0)
  ));

  return {
    percent: healthScore,
    metrics: [
      { label: "Savings rate", value: `${savingsRate}%`, desc: income > 0 ? "of total income" : "No income yet" },
      { label: "Top spend", value: topCategory ? `₹${topCategory[1].toLocaleString("en-IN")}` : "—", desc: topCategory ? topCategory[0] : "No expenses" },
      { label: "Transactions", value: `${transactions.length}`, desc: "this period" },
    ],
  };
}

export default function InsightsWidget({ transactions = [] }: { transactions?: Transaction[] }) {
  const [tab, setTab] = useState<"overview" | "trends">("overview");
  const { percent, metrics } = computeInsights(transactions);
  const hasData = transactions.length > 0;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-base font-semibold text-white">Insights</h3>
      <p className="mt-0.5 text-sm text-zinc-400">Financial health overview</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("overview")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === "overview" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setTab("trends")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === "trends" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}
        >
          Trends
        </button>
      </div>

      {hasData ? (
        <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <div className="relative h-32 w-32 shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path
                fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                fill="none" stroke="url(#insightGrad)" strokeWidth="2.5"
                strokeDasharray={`${percent}, 100`} strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="insightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">{percent}%</span>
          </div>
          <ul className="flex-1 space-y-3">
            {metrics.map((m) => (
              <li key={m.label} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{m.label} {m.value}</p>
                    <p className="text-xs text-zinc-500">{m.desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-3 py-6">
          <div className="relative h-32 w-32">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-800"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm text-zinc-600">—</span>
          </div>
          <p className="text-xs text-zinc-600">Add transactions to see insights</p>
        </div>
      )}
    </div>
  );
}
