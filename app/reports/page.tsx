"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Dropdown, { DropdownItem } from "../components/ui/Dropdown";
import { useToast } from "../components/ui/Toast";
import type { MonthlyData, CategoryBreakdown, MerchantSummary } from "../lib/types";

function formatCurrency(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function ReportsPage() {
  const { toast } = useToast();
  const [period, setPeriod] = useState<"monthly" | "quarterly">("monthly");
  const [monthlyData] = useState<MonthlyData[]>([]);
  const [categories] = useState<CategoryBreakdown[]>([]);
  const [merchants] = useState<MerchantSummary[]>([]);

  const currentMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData.length >= 2 ? monthlyData[monthlyData.length - 2] : null;
  const maxValue = monthlyData.length > 0 ? Math.max(...monthlyData.map((d) => Math.max(d.income, d.expense))) : 1;

  const expenseChange = currentMonth && prevMonth
    ? Math.round(((currentMonth.expense - prevMonth.expense) / prevMonth.expense) * 100)
    : 0;
  const savingsRate = currentMonth && currentMonth.income > 0
    ? Math.round(((currentMonth.income - currentMonth.expense) / currentMonth.income) * 100)
    : 0;

  const hasData = monthlyData.length > 0;

  const handleExport = () => {
    if (!hasData) {
      toast("No report data to export yet", "info");
      return;
    }
    toast("PDF export started (demo)", "success");
  };

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
              <span className="text-zinc-400">Reports</span>
            </nav>
            <h1 className="mt-1 text-2xl font-bold text-white">Reports</h1>
            <p className="mt-0.5 text-sm text-zinc-400">Understand your spending patterns and trends</p>
          </div>
          <div className="mt-4 flex gap-2 sm:mt-0">
            {(["monthly", "quarterly"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${period === p ? "bg-zinc-800 text-white" : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"}`}
              >
                {p === "monthly" ? "Monthly" : "Quarterly"}
              </button>
            ))}
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export PDF
            </button>
          </div>
        </div>

        {hasData ? (
          <>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Income</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-emerald-400">{formatCurrency(currentMonth!.income)}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Expenses</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-red-400">{formatCurrency(currentMonth!.expense)}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Expense trend</p>
                <p className={`mt-1 text-xl font-bold tabular-nums ${expenseChange > 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {expenseChange > 0 ? "+" : ""}{expenseChange}%
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Savings rate</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-amber-400">{savingsRate}%</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 lg:col-span-3">
                <h3 className="text-sm font-semibold text-white">Income vs Expenses</h3>
                <p className="mt-0.5 text-xs text-zinc-500">6-month comparison</p>
                <div className="mt-6 space-y-3">
                  {monthlyData.map((d) => (
                    <div key={d.month} className="flex items-center gap-3">
                      <span className="w-8 text-xs font-medium text-zinc-500">{d.month}</span>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="h-2 rounded-full bg-emerald-500/80 transition-all duration-500" style={{ width: `${(d.income / maxValue) * 100}%` }} />
                          <span className="text-xs tabular-nums text-zinc-400">{formatCurrency(d.income)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 rounded-full bg-zinc-600 transition-all duration-500" style={{ width: `${(d.expense / maxValue) * 100}%` }} />
                          <span className="text-xs tabular-nums text-zinc-500">{formatCurrency(d.expense)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-4 border-t border-zinc-800 pt-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-400"><div className="h-2 w-6 rounded-full bg-emerald-500/80" />Income</div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500"><div className="h-2 w-6 rounded-full bg-zinc-600" />Expenses</div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 lg:col-span-2">
                <h3 className="text-sm font-semibold text-white">By Category</h3>
                <p className="mt-0.5 text-xs text-zinc-500">Where your money goes</p>
                <div className="mt-4 flex justify-center">
                  <div className="relative h-32 w-32">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                      {categories.reduce<{ elements: React.ReactNode[]; offset: number }>((acc, cat, i) => {
                        const dash = cat.percent * 0.88;
                        acc.elements.push(
                          <circle key={i} cx="18" cy="18" r="14" fill="none" stroke={cat.color} strokeWidth="3" strokeDasharray={`${dash} ${88 - dash}`} strokeDashoffset={-acc.offset} />
                        );
                        acc.offset += dash;
                        return acc;
                      }, { elements: [], offset: 0 }).elements}
                    </svg>
                    <span className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-white">{formatCurrency(categories.reduce((s, c) => s + c.amount, 0))}</span>
                      <span className="text-xs text-zinc-500">total</span>
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-2.5">
                  {categories.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: cat.color }} />
                      <span className="flex-1 truncate text-xs text-zinc-300">{cat.name}</span>
                      <span className="text-xs font-medium tabular-nums text-zinc-400">{cat.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {merchants.length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="text-sm font-semibold text-white">Top Merchants</h3>
                <p className="mt-0.5 text-xs text-zinc-500">Most frequent spending destinations</p>
                <div className="mt-4 divide-y divide-zinc-800">
                  {merchants.map((m, i) => (
                    <div key={m.name} className="flex items-center gap-4 py-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-xs font-bold text-zinc-400">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">{m.name}</p>
                        <p className="text-xs text-zinc-500">{m.count} transaction{m.count > 1 ? "s" : ""}</p>
                      </div>
                      <p className="text-sm font-bold tabular-nums text-white">{formatCurrency(m.total)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 py-16">
            <svg className="h-10 w-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
            <p className="mt-3 text-sm font-medium text-zinc-400">No report data yet</p>
            <p className="mt-1 text-xs text-zinc-600">Add transactions to generate spending insights and trends</p>
            <Link href="/transactions" className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500">
              Go to Transactions
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
