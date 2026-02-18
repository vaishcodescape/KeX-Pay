"use client";

import { useState } from "react";
import type { Transaction } from "../../lib/types";
import { useToast } from "../ui/Toast";

const categoryColors: Record<string, string> = {
  Salary: "bg-emerald-500", Freelance: "bg-teal-500", Investment: "bg-blue-500",
  Housing: "bg-violet-500", Utilities: "bg-amber-500", Shopping: "bg-pink-500",
  "Food & Dining": "bg-orange-500", Entertainment: "bg-purple-500",
  Transport: "bg-cyan-500", Groceries: "bg-lime-500", Health: "bg-red-500",
};

export default function QuickTransactions({
  transactions,
  onAdd,
  onRemove,
}: {
  transactions: Transaction[];
  onAdd: (t: Transaction) => void;
  onRemove: (id: string) => void;
}) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [input, setInput] = useState("");
  const [amount, setAmount] = useState("");

  const expenses = transactions.filter((t) => t.type === "expense");
  const income = transactions.filter((t) => t.type === "income");
  const current = activeTab === "expense" ? expenses : income;

  const handleAdd = () => {
    if (!input.trim() || !amount.trim()) return;

    const now = new Date();
    const t: Transaction = {
      id: crypto.randomUUID(),
      description: input.trim(),
      category: activeTab === "income" ? "Salary" : "Shopping",
      categoryColor: activeTab === "income" ? categoryColors["Salary"] : categoryColors["Shopping"],
      amount: parseFloat(amount) || 0,
      type: activeTab,
      account: "Cash Wallet",
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
    onAdd(t);
    toast(`Quick ${activeTab} added: ₹${(parseFloat(amount) || 0).toLocaleString("en-IN")}`, "success");
    setInput("");
    setAmount("");
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-base font-semibold text-white">Quick transactions</h3>
      <p className="mt-0.5 text-sm text-zinc-400">Log expenses or income quickly</p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("expense")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeTab === "expense" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}
        >
          Expenses ({expenses.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("income")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeTab === "income" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}
        >
          Income ({income.length})
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Description..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
        />
        <input
          type="number"
          placeholder="₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="w-24 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-500"
          aria-label="Add"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      {current.length === 0 ? (
        <p className="mt-4 text-center text-sm text-zinc-500">
          No {activeTab === "expense" ? "expenses" : "income"} logged yet
        </p>
      ) : (
        <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto">
          {current.map((t) => (
            <li key={t.id} className="group flex items-center justify-between rounded-lg bg-zinc-800/30 px-3 py-2">
              <div className="min-w-0 flex-1">
                <span className="text-sm text-zinc-300 truncate block">{t.description}</span>
                <span className="text-xs text-zinc-600">{t.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium tabular-nums ${t.type === "income" ? "text-emerald-400" : "text-zinc-300"}`}>
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onRemove(t.id);
                    toast("Transaction removed", "info");
                  }}
                  className="rounded p-1 text-zinc-600 opacity-0 transition-all hover:bg-zinc-700 hover:text-zinc-300 group-hover:opacity-100"
                  aria-label="Remove"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
