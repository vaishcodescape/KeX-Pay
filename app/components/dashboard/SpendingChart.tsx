"use client";

import { useState } from "react";
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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Cash flow</h3>
          <p className="mt-0.5 text-sm text-zinc-400">
            {hasData
              ? `₹${totalIncome.toLocaleString("en-IN")} in · ₹${totalExpense.toLocaleString("en-IN")} out`
              : "Income vs expenses this quarter"
            }
          </p>
        </div>
        <Dropdown
          trigger={
            <button type="button" className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
              {period}
              <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          }
        >
          {periodOptions.map((p) => (
            <DropdownItem key={p} onClick={() => setPeriod(p)}>
              <span className={p === period ? "text-emerald-400" : ""}>{p}</span>
            </DropdownItem>
          ))}
        </Dropdown>
      </div>

      {hasData ? (
        <>
          <div className="mt-6 h-48 w-full">
            <svg viewBox="0 0 100 64" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path fill="url(#chartGrad)" stroke="none" d={toPath(data, min, range)} />
              <path
                fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                d={data.map((item, i) => {
                  const x = (i / (data.length - 1)) * 100;
                  const y = 60 - ((item.value - min) / range) * 52 - 4;
                  return `${i === 0 ? "M" : "L"} ${x},${y}`;
                }).join(" ")}
              />
              {data.map((item, i) => {
                const x = (i / (data.length - 1)) * 100;
                const y = 60 - ((item.value - min) / range) * 52 - 4;
                return <circle key={i} cx={x} cy={y} r="1.5" fill="#10b981" className="transition-all" />;
              })}
            </svg>
          </div>
          <div className="flex justify-between border-t border-zinc-800 pt-3 text-xs text-zinc-500">
            {data.map((d) => (
              <span key={d.month}>{d.month}</span>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6 flex h-48 items-center justify-center rounded-lg border border-dashed border-zinc-800">
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
            <p className="mt-2 text-xs text-zinc-600">No cash flow data yet</p>
            <p className="mt-0.5 text-xs text-zinc-700">Add transactions to see trends</p>
          </div>
        </div>
      )}
    </div>
  );
}
