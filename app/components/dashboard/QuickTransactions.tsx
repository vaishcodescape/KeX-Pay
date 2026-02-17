"use client";

import { useState } from "react";

const placeholderTasks: { id: string; label: string; done: boolean }[] = [];

export default function QuickTransactions() {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [tasks] = useState(placeholderTasks);
  const [input, setInput] = useState("");

  const activeCount = tasks.filter((t) => !t.done).length;
  const completedCount = tasks.filter((t) => t.done).length;

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
          Pending ({activeCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeTab === "completed" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}
        >
          Completed ({completedCount})
        </button>
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Add a quick transaction..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
        />
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-500"
          aria-label="Add"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-zinc-500">
        {activeTab === "active" ? "No pending transactions" : "No completed transactions"}
      </p>
    </div>
  );
}
