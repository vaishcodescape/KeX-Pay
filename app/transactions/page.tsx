"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import type { Transaction } from "../lib/types";

const categories = ["All", "Salary", "Investment", "Housing", "Utilities", "Shopping", "Food & Dining", "Freelance", "Entertainment", "Transport", "Groceries", "Health"];

function formatCurrency(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
}

function groupByDate(txns: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  for (const t of txns) {
    if (!groups[t.date]) groups[t.date] = [];
    groups[t.date].push(t);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // TODO: Replace with API call — e.g. fetch("/api/transactions")
    setTransactions([]);
    setLoading(false);
  }, []);

  const filtered = transactions.filter((t) => {
    if (filter !== "All" && t.category !== filter) return false;
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = groupByDate(filtered);

  const totalIncome = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

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
              <span className="text-zinc-400">Transactions</span>
            </nav>
            <h1 className="mt-1 text-2xl font-bold text-white">Transactions</h1>
            <p className="mt-0.5 text-sm text-zinc-400">Your complete financial activity log</p>
          </div>
          <button
            type="button"
            className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 sm:mt-0"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add transaction
          </button>
        </div>

        {/* Summary strip */}
        <div className="grid gap-4 sm:grid-cols-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
            ))
          ) : (
            <>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Income</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-emerald-400">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Expenses</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-red-400">{formatCurrency(totalExpense)}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Net Flow</p>
                <p className={`mt-1 text-xl font-bold tabular-nums ${totalIncome - totalExpense >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {totalIncome - totalExpense >= 0 ? "+" : ""}{formatCurrency(totalIncome - totalExpense)}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "income", "expense"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${typeFilter === t ? "bg-zinc-800 text-white" : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"}`}
              >
                {t === "all" ? "All" : t === "income" ? "Income" : "Expenses"}
              </button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === c ? "bg-zinc-700 text-white" : "border border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Transaction list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
            ))}
          </div>
        ) : grouped.length > 0 ? (
          <div className="space-y-6">
            {grouped.map(([date, txns]) => (
              <div key={date}>
                <p className="mb-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">{formatDateLabel(date)}</p>
                <div className="space-y-2">
                  {txns.map((t) => (
                    <div
                      key={t.id}
                      className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 transition-colors hover:border-zinc-700"
                    >
                      <div className={`h-9 w-9 shrink-0 rounded-lg ${t.categoryColor}/15 flex items-center justify-center`}>
                        <div className={`h-2.5 w-2.5 rounded-full ${t.categoryColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{t.description}</p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {t.category} · {t.account} · {t.time}
                        </p>
                      </div>
                      <p className={`text-sm font-bold tabular-nums ${t.type === "income" ? "text-emerald-400" : "text-zinc-200"}`}>
                        {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 py-16">
            <svg className="h-10 w-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
            <p className="mt-3 text-sm font-medium text-zinc-400">No transactions yet</p>
            <p className="mt-1 text-xs text-zinc-600">Add your first transaction to start tracking</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
