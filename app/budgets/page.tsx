"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import type { BudgetCategory } from "../lib/types";

function formatCurrency(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function getStatusColor(percent: number) {
  if (percent >= 90) return { bar: "bg-red-500", text: "text-red-400", label: "Over limit" };
  if (percent >= 70) return { bar: "bg-amber-500", text: "text-amber-400", label: "Caution" };
  return { bar: "bg-emerald-500", text: "text-emerald-400", label: "On track" };
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth] = useState("February 2026");

  useEffect(() => {
    // TODO: Replace with API call — e.g. fetch("/api/budgets?month=2026-02")
    setBudgets([]);
    setLoading(false);
  }, []);

  const totalBudget = budgets.reduce((s, c) => s + c.budget, 0);
  const totalSpent = budgets.reduce((s, c) => s + c.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <nav className="flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/" className="hover:text-zinc-300">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </Link>
              <span className="text-zinc-600">&gt;</span>
              <span className="text-zinc-400">Budgets</span>
            </nav>
            <h1 className="mt-1 text-2xl font-bold text-white">Budgets</h1>
            <p className="mt-0.5 text-sm text-zinc-400">Track spending against your monthly limits</p>
          </div>
          <div className="mt-4 flex items-center gap-2 sm:mt-0">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              {selectedMonth}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New budget
            </button>
          </div>
        </div>

        {loading ? (
          <>
            <div className="h-32 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-36 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
              ))}
            </div>
          </>
        ) : budgets.length > 0 ? (
          <>
            {/* Overall budget health */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative h-24 w-24 shrink-0">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-zinc-800" />
                      <circle
                        cx="18" cy="18" r="14" fill="none"
                        stroke={overallPercent >= 90 ? "#ef4444" : overallPercent >= 70 ? "#f59e0b" : "#10b981"}
                        strokeWidth="3"
                        strokeDasharray={`${overallPercent * 0.88} 88`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">{overallPercent}%</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-400">Monthly budget used</p>
                    <p className="mt-1 text-2xl font-bold tracking-tight text-white">{formatCurrency(totalSpent)}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">of {formatCurrency(totalBudget)} total budget</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Remaining</p>
                    <p className="mt-1 text-lg font-bold text-emerald-400">{formatCurrency(totalRemaining)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Daily allowance</p>
                    <p className="mt-1 text-lg font-bold text-white">{formatCurrency(Math.round(totalRemaining / 20))}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category budgets */}
            <div className="grid gap-4 sm:grid-cols-2">
              {budgets.map((cat) => {
                const percent = Math.round((cat.spent / cat.budget) * 100);
                const status = getStatusColor(percent);
                const remaining = cat.budget - cat.spent;

                return (
                  <div
                    key={cat.id}
                    className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${cat.color}/10`}>
                          <svg className={`h-4.5 w-4.5 ${cat.color.replace("bg-", "text-")}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{cat.name}</p>
                          <p className={`text-xs font-medium ${status.text}`}>{status.label}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold tabular-nums text-white">{percent}%</p>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={`h-full rounded-full transition-all ${status.bar}`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-zinc-500">{formatCurrency(cat.spent)} spent</span>
                      <span className={remaining >= 0 ? "text-zinc-400" : "text-red-400"}>
                        {remaining >= 0 ? formatCurrency(remaining) + " left" : formatCurrency(Math.abs(remaining)) + " over"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 py-16">
            <svg className="h-10 w-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z M13.5 3.75a7.5 7.5 0 017.5 7.5h-7.5V3.75z" /></svg>
            <p className="mt-3 text-sm font-medium text-zinc-400">No budgets set up yet</p>
            <p className="mt-1 text-xs text-zinc-600">Create category budgets to track your monthly spending limits</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
