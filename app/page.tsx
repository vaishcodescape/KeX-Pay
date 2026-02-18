"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import GreetingCard from "./components/dashboard/GreetingCard";
import MetricCard from "./components/dashboard/MetricCard";
import QuickTransactions from "./components/dashboard/QuickTransactions";
import CalendarWidget from "./components/dashboard/CalendarWidget";
import InsightsWidget from "./components/dashboard/InsightsWidget";
import SpendingChart from "./components/dashboard/SpendingChart";
import type { MetricData } from "./lib/types";

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

export default function Home() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call — e.g. fetch("/api/dashboard/metrics")
    setMetrics([]);
    setLoading(false);
  }, []);

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
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              This month
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>

        <GreetingCard />

        {/* Metric cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
            ))
          ) : metrics.length > 0 ? (
            metrics.map((m, i) => (
              <MetricCard
                key={m.title}
                title={m.title}
                value={m.value}
                change={m.change}
                trend={m.trend}
                icon={metricIcons[i] ?? walletIcon}
              />
            ))
          ) : (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 p-8">
                <p className="text-xs text-zinc-600">No data yet</p>
              </div>
            ))
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <QuickTransactions />
          <CalendarWidget />
          <InsightsWidget />
        </div>

        <SpendingChart />
      </div>
    </DashboardLayout>
  );
}
