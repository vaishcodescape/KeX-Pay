"use client";

import { useEffect, useState } from "react";
import type { InsightMetric } from "../../lib/types";

export default function InsightsWidget() {
  const [tab, setTab] = useState<"overview" | "trends">("overview");
  const [metrics, setMetrics] = useState<InsightMetric[]>([]);
  const [overallPercent, setOverallPercent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call — e.g. fetch("/api/dashboard/insights")
    setMetrics([]);
    setOverallPercent(null);
    setLoading(false);
  }, []);

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

      {loading ? (
        <div className="mt-6 flex justify-center">
          <div className="h-32 w-32 animate-pulse rounded-full bg-zinc-800" />
        </div>
      ) : overallPercent !== null && metrics.length > 0 ? (
        <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <div className="relative h-32 w-32 shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-zinc-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                fill="none"
                stroke="url(#insightGrad)"
                strokeWidth="2.5"
                strokeDasharray={`${overallPercent}, 100`}
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <defs>
                <linearGradient id="insightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">{overallPercent}%</span>
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
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-zinc-800"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm text-zinc-600">—</span>
          </div>
          <p className="text-xs text-zinc-600">No insights available yet</p>
        </div>
      )}
    </div>
  );
}
