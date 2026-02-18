"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Modal from "../components/ui/Modal";
import Dropdown, { DropdownItem } from "../components/ui/Dropdown";
import { useToast } from "../components/ui/Toast";
import type { BudgetCategory } from "../lib/types";

function formatCurrency(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function getStatusColor(percent: number) {
  if (percent >= 90) return { bar: "bg-red-500", text: "text-red-400", label: "Over limit" };
  if (percent >= 70) return { bar: "bg-amber-500", text: "text-amber-400", label: "Caution" };
  return { bar: "bg-emerald-500", text: "text-emerald-400", label: "On track" };
}

const categoryOptions = [
  { name: "Housing", icon: "M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25", color: "bg-violet-500" },
  { name: "Food & Dining", icon: "M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m18-12.75H3", color: "bg-orange-500" },
  { name: "Transport", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12", color: "bg-cyan-500" },
  { name: "Shopping", icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z", color: "bg-pink-500" },
  { name: "Entertainment", icon: "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5", color: "bg-purple-500" },
  { name: "Utilities", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", color: "bg-amber-500" },
  { name: "Health", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z", color: "bg-red-500" },
  { name: "Groceries", icon: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z", color: "bg-lime-500" },
];

const months = ["January 2026", "February 2026", "March 2026", "April 2026"];

function AddBudgetModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (budget: BudgetCategory) => void;
}) {
  const { toast } = useToast();
  const [selected, setSelected] = useState(0);
  const [budget, setBudget] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categoryOptions[selected];
    if (!budget) return;

    onAdd({
      id: crypto.randomUUID(),
      name: cat.name,
      icon: cat.icon,
      budget: parseFloat(budget),
      spent: 0,
      color: cat.color,
    });

    toast(`Budget set for ${cat.name}: ${formatCurrency(parseFloat(budget))}`, "success");
    setBudget("");
    setSelected(0);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Budget" description="Set a spending limit for a category">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400">Category</label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {categoryOptions.map((cat, i) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelected(i)}
                className={`flex flex-col items-center gap-1 rounded-lg p-2.5 text-xs transition-colors ${
                  selected === i
                    ? "bg-zinc-700 text-white ring-1 ring-zinc-600"
                    : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
                }`}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-md ${cat.color}/15`}>
                  <svg className={`h-3.5 w-3.5 ${cat.color.replace("bg-", "text-")}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                  </svg>
                </div>
                <span className="truncate">{cat.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400">Monthly limit (₹)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 15000"
            min="1"
            className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
            required
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800">Cancel</button>
          <button type="submit" className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500">Create budget</button>
        </div>
      </form>
    </Modal>
  );
}

export default function BudgetsPage() {
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("February 2026");
  const [addOpen, setAddOpen] = useState(false);

  const totalBudget = budgets.reduce((s, c) => s + c.budget, 0);
  const totalSpent = budgets.reduce((s, c) => s + c.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const addSpending = (id: string, amount: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, spent: b.spent + amount } : b))
    );
    toast(`Added ₹${amount.toLocaleString("en-IN")} spending`, "success");
  };

  const removeBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    toast("Budget removed", "info");
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
              <span className="text-zinc-400">Budgets</span>
            </nav>
            <h1 className="mt-1 text-2xl font-bold text-white">Budgets</h1>
            <p className="mt-0.5 text-sm text-zinc-400">Track spending against your monthly limits</p>
          </div>
          <div className="mt-4 flex items-center gap-2 sm:mt-0">
            <Dropdown
              trigger={
                <button type="button" className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
                  {selectedMonth}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              }
            >
              {months.map((m) => (
                <DropdownItem key={m} onClick={() => setSelectedMonth(m)}>
                  <span className={m === selectedMonth ? "text-emerald-400" : ""}>{m}</span>
                </DropdownItem>
              ))}
            </Dropdown>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New budget
            </button>
          </div>
        </div>

        {budgets.length > 0 ? (
          <>
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
                        className="transition-all duration-500"
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
                    <p className="mt-1 text-lg font-bold text-white">{formatCurrency(Math.round(Math.max(0, totalRemaining) / 20))}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {budgets.map((cat) => {
                const percent = Math.round((cat.spent / cat.budget) * 100);
                const status = getStatusColor(percent);
                const remaining = cat.budget - cat.spent;

                return (
                  <div key={cat.id} className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${cat.color}/10`}>
                          <svg className={`h-4 w-4 ${cat.color.replace("bg-", "text-")}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{cat.name}</p>
                          <p className={`text-xs font-medium ${status.text}`}>{status.label}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-bold tabular-nums text-white">{percent}%</p>
                        <button
                          type="button"
                          onClick={() => removeBudget(cat.id)}
                          className="rounded p-1 text-zinc-600 opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
                          aria-label="Remove"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                      <div className={`h-full rounded-full transition-all duration-500 ${status.bar}`} style={{ width: `${Math.min(percent, 100)}%` }} />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-zinc-500">{formatCurrency(cat.spent)} spent</span>
                      <span className={remaining >= 0 ? "text-zinc-400" : "text-red-400"}>
                        {remaining >= 0 ? formatCurrency(remaining) + " left" : formatCurrency(Math.abs(remaining)) + " over"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addSpending(cat.id, Math.round(cat.budget * 0.1))}
                      className="mt-3 w-full rounded-lg border border-zinc-700 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                    >
                      + Log spending
                    </button>
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
            <button type="button" onClick={() => setAddOpen(true)} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500">Create budget</button>
          </div>
        )}
      </div>

      <AddBudgetModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={(b) => setBudgets((prev) => [...prev, b])} />
    </DashboardLayout>
  );
}
