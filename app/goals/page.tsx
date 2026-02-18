"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import type { Goal } from "../lib/types";

function formatCurrency(n: number) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  return "₹" + n.toLocaleString("en-IN");
}

function formatCurrencyFull(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call — e.g. fetch("/api/goals")
    setGoals([]);
    setLoading(false);
  }, []);

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalSaved = goals.reduce((s, g) => s + g.current, 0);
  const overallPercent = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

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
              <span className="text-zinc-400">Goals</span>
            </nav>
            <h1 className="mt-1 text-2xl font-bold text-white">Goals</h1>
            <p className="mt-0.5 text-sm text-zinc-400">Track progress toward your financial milestones</p>
          </div>
          <button
            type="button"
            className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 sm:mt-0"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New goal
          </button>
        </div>

        {loading ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
              ))}
            </div>
          </>
        ) : goals.length > 0 ? (
          <>
            {/* Overview */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm font-medium text-zinc-400">Overall progress</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white">{overallPercent}%</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${overallPercent}%` }} />
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm font-medium text-zinc-400">Total saved</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-400">{formatCurrency(totalSaved)}</p>
                <p className="mt-1 text-xs text-zinc-500">across {goals.length} goals</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm font-medium text-zinc-400">Still needed</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-white">{formatCurrency(totalTarget - totalSaved)}</p>
                <p className="mt-1 text-xs text-zinc-500">to reach all targets</p>
              </div>
            </div>

            {/* Goal cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => {
                const percent = Math.round((goal.current / goal.target) * 100);
                const circumference = 2 * Math.PI * 40;
                const dashOffset = circumference - (percent / 100) * circumference;

                return (
                  <div
                    key={goal.id}
                    className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg p-2" style={{ backgroundColor: goal.color + "15" }}>
                          <svg className="h-5 w-5" style={{ color: goal.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={goal.icon} />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{goal.name}</p>
                          <p className="text-xs text-zinc-500">Due {goal.deadline}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="rounded p-1 text-zinc-600 opacity-0 transition-all hover:bg-zinc-800 hover:text-zinc-300 group-hover:opacity-100"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></svg>
                      </button>
                    </div>

                    <div className="mt-5 flex items-center justify-center">
                      <div className="relative h-28 w-28">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-zinc-800" />
                          <circle
                            cx="50" cy="50" r="40" fill="none"
                            stroke={goal.color}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            className="transition-all duration-500"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">{percent}%</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Saved</span>
                        <span className="font-medium text-white">{formatCurrencyFull(goal.current)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Target</span>
                        <span className="font-medium text-zinc-400">{formatCurrencyFull(goal.target)}</span>
                      </div>
                      <div className="border-t border-zinc-800 pt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Monthly needed</span>
                          <span className="font-medium text-amber-400">{formatCurrencyFull(goal.monthlyNeeded)}/mo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 py-16">
            <svg className="h-10 w-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>
            <p className="mt-3 text-sm font-medium text-zinc-400">No goals created yet</p>
            <p className="mt-1 text-xs text-zinc-600">Set a savings target — vacation, emergency fund, new gadget, anything</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
