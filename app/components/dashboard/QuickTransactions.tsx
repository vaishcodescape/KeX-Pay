"use client";

import { useEffect, useState } from "react";
import type { Transaction } from "../../lib/types";

export default function QuickTransactions() {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");

  useEffect(() => {
    // TODO: Replace with API call — e.g. fetch("/api/transactions/recent")
    setTransactions([]);
    setLoading(false);
  }, []);

  const pending = transactions.filter((t) => t.type === "expense");
  const completed = transactions.filter((t) => t.type === "income");

  const handleAdd = () => {
    if (!input.trim()) return;
    // TODO: Replace with API call — e.g. POST /api/transactions
    setInput("");
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-base font-semibold text-white">Quick transactions</h3>
      <p className="mt-0.5 text-sm text-zinc-400">Log expenses or income quickly</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeTab === "active" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}
        >
          Pending ({pending.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeTab === "completed" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}
        >
          Completed ({completed.length})
        </button>
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Add a quick transaction..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
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

      {loading ? (
        <div className="mt-4 space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-zinc-800/50" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <p className="mt-4 text-center text-sm text-zinc-500">
          {activeTab === "active" ? "No pending transactions" : "No completed transactions"}
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {(activeTab === "active" ? pending : completed).map((t) => (
            <li key={t.id} className="flex items-center justify-between rounded-lg bg-zinc-800/30 px-3 py-2">
              <span className="text-sm text-zinc-300 truncate">{t.description}</span>
              <span className={`text-sm font-medium tabular-nums ${t.type === "income" ? "text-emerald-400" : "text-zinc-300"}`}>
                {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
