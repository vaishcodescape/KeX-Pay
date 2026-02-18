"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Modal from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";
import type { Goal } from "../lib/types";

function formatCurrency(n: number) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  return "₹" + n.toLocaleString("en-IN");
}

function formatCurrencyFull(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

const goalPresets = [
  { name: "Emergency Fund", icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z", color: "#f59e0b" },
  { name: "Vacation", icon: "M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64", color: "#3b82f6" },
  { name: "New Gadget", icon: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3", color: "#8b5cf6" },
  { name: "Home Down Payment", icon: "M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25", color: "#10b981" },
  { name: "Education", icon: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5", color: "#ec4899" },
  { name: "Car", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12", color: "#06b6d4" },
];

function AddGoalModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (goal: Goal) => void;
}) {
  const { toast } = useToast();
  const [selected, setSelected] = useState(0);
  const [customName, setCustomName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    const preset = goalPresets[selected];
    const name = customName.trim() || preset.name;
    const targetNum = parseFloat(target);
    const monthsLeft = deadline
      ? Math.max(1, Math.ceil((new Date(deadline).getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000)))
      : 12;

    onAdd({
      id: crypto.randomUUID(),
      name,
      target: targetNum,
      current: 0,
      deadline: deadline || "Dec 2026",
      color: preset.color,
      icon: preset.icon,
      monthlyNeeded: Math.round(targetNum / monthsLeft),
    });

    toast(`Goal "${name}" created: ${formatCurrencyFull(targetNum)}`, "success");
    setCustomName("");
    setTarget("");
    setDeadline("");
    setSelected(0);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Goal" description="Set a savings target to work toward" wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400">Goal type</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {goalPresets.map((preset, i) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => { setSelected(i); setCustomName(""); }}
                className={`flex items-center gap-2 rounded-lg p-2.5 text-xs transition-colors ${
                  selected === i
                    ? "bg-zinc-700 text-white ring-1 ring-zinc-600"
                    : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
                }`}
              >
                <svg className="h-4 w-4 shrink-0" style={{ color: preset.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={preset.icon} />
                </svg>
                <span className="truncate">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400">Custom name (optional)</label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder={goalPresets[selected].name}
            className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-zinc-400">Target amount (₹)</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 500000"
              min="1"
              className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-zinc-600"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800">Cancel</button>
          <button type="submit" className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500">Create goal</button>
        </div>
      </form>
    </Modal>
  );
}

export default function GoalsPage() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalSaved = goals.reduce((s, g) => s + g.current, 0);
  const overallPercent = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const addSavings = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, current: Math.min(g.current + amount, g.target) } : g))
    );
    toast(`Added ${formatCurrencyFull(amount)} to savings`, "success");
  };

  const removeGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    toast("Goal removed", "info");
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
              <span className="text-zinc-400">Goals</span>
            </nav>
            <h1 className="mt-1 text-2xl font-bold text-white">Goals</h1>
            <p className="mt-0.5 text-sm text-zinc-400">Track progress toward your financial milestones</p>
          </div>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 sm:mt-0"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New goal
          </button>
        </div>

        {goals.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm font-medium text-zinc-400">Overall progress</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white">{overallPercent}%</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${overallPercent}%` }} />
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

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => {
                const percent = Math.round((goal.current / goal.target) * 100);
                const circumference = 2 * Math.PI * 40;
                const dashOffset = circumference - (percent / 100) * circumference;

                return (
                  <div key={goal.id} className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700">
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
                        onClick={() => removeGoal(goal.id)}
                        className="rounded p-1 text-zinc-600 opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
                        aria-label="Remove"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>

                    <div className="mt-5 flex items-center justify-center">
                      <div className="relative h-28 w-28">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-zinc-800" />
                          <circle
                            cx="50" cy="50" r="40" fill="none"
                            stroke={goal.color} strokeWidth="6" strokeLinecap="round"
                            strokeDasharray={circumference} strokeDashoffset={dashOffset}
                            className="transition-all duration-700"
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

                    {percent < 100 && (
                      <button
                        type="button"
                        onClick={() => addSavings(goal.id, goal.monthlyNeeded)}
                        className="mt-3 w-full rounded-lg border border-zinc-700 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                      >
                        + Add {formatCurrencyFull(goal.monthlyNeeded)}
                      </button>
                    )}
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
            <button type="button" onClick={() => setAddOpen(true)} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500">Create goal</button>
          </div>
        )}
      </div>

      <AddGoalModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={(g) => setGoals((prev) => [...prev, g])} />
    </DashboardLayout>
  );
}
