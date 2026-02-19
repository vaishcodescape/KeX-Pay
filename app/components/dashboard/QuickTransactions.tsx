"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Transaction } from "../../lib/types";
import { useToast } from "../ui/Toast";

const categoryColors: Record<string, string> = {
  Salary: "bg-cyan-500", Freelance: "bg-cyan-500", Investment: "bg-blue-500",
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="glass-card p-6"
    >
      <div className="relative">
        <h3 className="text-lg font-semibold text-white">Quick transactions</h3>
        <p className="mt-1 text-sm text-zinc-400">Log expenses or income quickly</p>

        <div className="mt-5 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setActiveTab("expense")}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === "expense" 
                ? "bg-white/10 text-white shadow-lg shadow-red-500/10" 
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            }`}
          >
            {activeTab === "expense" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-full bg-linear-to-r from-red-500/20 to-orange-500/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative">Expenses ({expenses.length})</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setActiveTab("income")}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === "income" 
                ? "bg-white/10 text-white shadow-lg shadow-cyan-500/10" 
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            }`}
          >
            {activeTab === "income" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-500/20 to-emerald-400/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative">Income ({income.length})</span>
          </motion.button>
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Description..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-cyan-500/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/20"
          />
          <input
            type="number"
            placeholder="₹"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="w-24 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-cyan-500/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/20"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleAdd}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:shadow-cyan-500/50"
            aria-label="Add"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {current.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center text-sm text-zinc-500"
            >
              No {activeTab === "expense" ? "expenses" : "income"} logged yet
            </motion.p>
          ) : (
            <motion.ul
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 max-h-48 space-y-2 overflow-y-auto"
            >
              <AnimatePresence>
                {current.map((t, index) => (
                  <motion.li
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center justify-between rounded-xl bg-white/5 backdrop-blur-sm px-4 py-3 transition-all duration-200 hover:bg-white/10"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-sm text-zinc-300 truncate block">{t.description}</span>
                      <span className="text-xs text-zinc-600">{t.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-semibold tabular-nums ${t.type === "income" ? "text-cyan-400" : "text-zinc-300"}`}>
                        {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                          onRemove(t.id);
                          toast("Transaction removed", "info");
                        }}
                        className="rounded-lg p-1.5 text-zinc-600 opacity-0 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
                        aria-label="Remove"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </motion.button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
