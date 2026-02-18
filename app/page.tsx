"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import GreetingCard from "./components/dashboard/GreetingCard";
import MetricCard from "./components/dashboard/MetricCard";
import QuickTransactions from "./components/dashboard/QuickTransactions";
import CalendarWidget from "./components/dashboard/CalendarWidget";
import InsightsWidget from "./components/dashboard/InsightsWidget";
import SpendingChart from "./components/dashboard/SpendingChart";
import AddTransactionModal from "./components/dashboard/AddTransactionModal";
import Dropdown, { DropdownItem } from "./components/ui/Dropdown";
import { useToast } from "./components/ui/Toast";
import type { MetricData, Transaction } from "./lib/types";

const walletIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
const incomeIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const expenseIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2h-2m-4-1V7a2 2 0 012-2h2a2 2 0 012 2v1" />
  </svg>
);
const savingsIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const metricIcons = [walletIcon, incomeIcon, expenseIcon, savingsIcon];
const periodOptions = ["This month", "Last month", "Last 3 months", "This year"];

function computeMetrics(transactions: Transaction[]): MetricData[] {
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savings = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  return [
    { title: "Balance", value: `₹${balance.toLocaleString("en-IN")}`, change: transactions.length > 0 ? "Current period" : undefined, trend: balance >= 0 ? "up" : "down" },
    { title: "Income", value: `₹${totalIncome.toLocaleString("en-IN")}`, change: transactions.filter((t) => t.type === "income").length + " entries", trend: "up" },
    { title: "Expenses", value: `₹${totalExpense.toLocaleString("en-IN")}`, change: transactions.filter((t) => t.type === "expense").length + " entries", trend: totalExpense > 0 ? "down" : "neutral" },
    { title: "Savings Rate", value: `${savings}%`, change: totalIncome > 0 ? "of income saved" : undefined, trend: savings >= 20 ? "up" : savings > 0 ? "neutral" : "down" },
  ];
}

export default function Home() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [period, setPeriod] = useState("This month");

  const metrics = computeMetrics(transactions);

  const addTransaction = (t: Transaction) => {
    setTransactions((prev) => [t, ...prev]);
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      toast("No data to export yet", "info");
      return;
    }
    const csv = ["Description,Type,Amount,Category,Account,Date,Time"]
      .concat(transactions.map((t) => `${t.description},${t.type},${t.amount},${t.category},${t.account},${t.date},${t.time}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kexpay-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Data exported as CSV", "success");
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
              <span className="text-zinc-400">Dashboard</span>
            </nav>
            <h1 className="mt-1 text-2xl font-bold text-white">Overview</h1>
            <p className="mt-0.5 text-sm text-zinc-400">Monitor your finances and stay on budget</p>
          </div>
          <div className="mt-4 flex items-center gap-2 sm:mt-0">
            <Dropdown
              trigger={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  {period}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              }
              align="right"
            >
              {periodOptions.map((p) => (
                <DropdownItem key={p} onClick={() => setPeriod(p)}>
                  <span className={p === period ? "text-emerald-400" : ""}>{p}</span>
                </DropdownItem>
              ))}
            </Dropdown>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </button>
          </div>
        </div>

        <GreetingCard />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <MetricCard key={m.title} title={m.title} value={m.value} change={m.change} trend={m.trend} icon={metricIcons[i] ?? walletIcon} />
          ))}
        </div>

        {/* Add transaction FAB */}
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 transition-transform hover:scale-105 hover:bg-emerald-500 lg:hidden"
          aria-label="Add transaction"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>

        <div className="grid gap-6 lg:grid-cols-3">
          <QuickTransactions
            transactions={transactions}
            onAdd={addTransaction}
            onRemove={removeTransaction}
          />
          <CalendarWidget />
          <InsightsWidget transactions={transactions} />
        </div>

        <SpendingChart transactions={transactions} />
      </div>

      <AddTransactionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addTransaction}
      />
    </DashboardLayout>
  );
}
