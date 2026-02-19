"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
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

function AnimatedProgress({ percent }: { percent: number }) {
  const circumference = 2 * Math.PI * 15.9155;
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPercent(percent);
    }, 100);
    return () => clearTimeout(timer);
  }, [percent]);

  const offset = circumference - (displayPercent / 100) * circumference;

  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-zinc-800/50"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <motion.path
          fill="none"
          stroke="url(#insightGrad)"
          strokeWidth="2.5"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          strokeLinecap="round"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="insightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <motion.span
        className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {Math.round(displayPercent)}%
      </motion.span>
    </div>
  );
}

export default function InsightsWidget({ transactions = [] }: { transactions?: Transaction[] }) {
  const [tab, setTab] = useState<"overview" | "trends">("overview");
  const { percent, metrics } = computeInsights(transactions);
  const hasData = transactions.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="glass-card p-6"
    >
      <div className="relative">
        <h3 className="text-lg font-semibold text-white">Insights</h3>
        <p className="mt-1 text-sm text-zinc-400">Financial health overview</p>
        <div className="mt-5 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setTab("overview")}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              tab === "overview"
                ? "bg-white/10 text-white shadow-lg shadow-blue-500/10"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            }`}
          >
            {tab === "overview" && (
              <motion.div
                layoutId="insightTab"
                className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-500/20 to-emerald-400/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative">Overview</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setTab("trends")}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              tab === "trends"
                ? "bg-white/10 text-white shadow-lg shadow-blue-500/10"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            }`}
          >
            {tab === "trends" && (
              <motion.div
                layoutId="insightTab"
                className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-500/20 to-emerald-400/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative">Trends</span>
          </motion.button>
        </div>

        {hasData ? (
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
            <AnimatedProgress percent={percent} />
            <ul className="flex-1 space-y-3">
              {metrics.map((m, index) => (
                <motion.li
                  key={m.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between gap-4 rounded-lg bg-white/5 px-3 py-2 backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                        className="h-2 w-2 rounded-full bg-linear-to-r from-cyan-400 to-emerald-400"
                    />
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{m.label} {m.value}</p>
                      <p className="text-xs text-zinc-500">{m.desc}</p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex flex-col items-center gap-3 py-6"
          >
            <div className="relative h-32 w-32">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-800/50"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm text-zinc-600">—</span>
            </div>
            <p className="text-xs text-zinc-600">Add transactions to see insights</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
