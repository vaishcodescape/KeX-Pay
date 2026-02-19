"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Transaction, ChartPoint } from "../../lib/types";
import Dropdown, { DropdownItem } from "../ui/Dropdown";

function transactionsToChart(transactions: Transaction[]): ChartPoint[] {
  const byDate: Record<string, number> = {};
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  let runningBalance = 0;
  for (const t of sorted) {
    runningBalance += t.type === "income" ? t.amount : -t.amount;
    byDate[t.date] = runningBalance;
  }

  return Object.entries(byDate).map(([date, value]) => ({
    month: new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value,
  }));
}

function toPath(data: ChartPoint[], min: number, range: number) {
  const w = 100;
  const h = 60;
  const points = data.map((item, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((item.value - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });
  return `M ${points.join(" L ")} L 100,64 L 0,64 Z`;
}

const periodOptions = ["This quarter", "Last quarter", "Last 6 months", "This year"];

export default function SpendingChart({ transactions = [] }: { transactions?: Transaction[] }) {
  const [period, setPeriod] = useState("This quarter");
  const data = transactionsToChart(transactions);

  const hasData = data.length >= 2;
  const min = hasData ? Math.min(...data.map((d) => d.value)) : 0;
  const max = hasData ? Math.max(...data.map((d) => d.value)) : 1;
  const range = max - min || 1;

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="glass-card p-6"
    >
      <div className="relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white">Cash flow</h3>
          <p className="mt-0.5 truncate text-sm text-zinc-400">
            {hasData
              ? `₹${totalIncome.toLocaleString("en-IN")} in · ₹${totalExpense.toLocaleString("en-IN")} out`
              : "Income vs expenses this quarter"
            }
          </p>
        </div>
        <Dropdown
          trigger={
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-2 text-sm text-zinc-300 transition-all duration-200 hover:bg-white/10"
            >
              {period}
              <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </motion.button>
          }
        >
          {periodOptions.map((p) => (
            <DropdownItem key={p} onClick={() => setPeriod(p)}>
              <span className={p === period ? "text-cyan-400" : ""}>{p}</span>
            </DropdownItem>
          ))}
        </Dropdown>
      </div>

      {hasData ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 h-48 w-full"
          >
            <svg viewBox="0 0 100 64" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="chartLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                fill="url(#chartGrad)"
                stroke="none"
                d={toPath(data, min, range)}
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                fill="none"
                stroke="url(#chartLineGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d={data.map((item, i) => {
                  const x = (i / (data.length - 1)) * 100;
                  const y = 60 - ((item.value - min) / range) * 52 - 4;
                  return `${i === 0 ? "M" : "L"} ${x},${y}`;
                }).join(" ")}
              />
              {data.map((item, i) => {
                const x = (i / (data.length - 1)) * 100;
                const y = 60 - ((item.value - min) / range) * 52 - 4;
                return (
                  <motion.circle
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="url(#chartLineGrad)"
                    className="drop-shadow-lg"
                  />
                );
              })}
            </svg>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-between border-t border-white/10 pt-4 text-xs text-zinc-500"
          >
            {data.map((d) => (
              <span key={d.month}>{d.month}</span>
            ))}
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex h-48 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5"
        >
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
            <p className="mt-2 text-xs text-zinc-600">No cash flow data yet</p>
            <p className="mt-0.5 text-xs text-zinc-700">Add transactions to see trends</p>
          </div>
        </motion.div>
      )}
      </div>
    </motion.div>
  );
}
