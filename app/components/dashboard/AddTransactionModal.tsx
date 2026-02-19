"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import { useToast } from "../ui/Toast";
import type { Transaction } from "../../lib/types";

const categories = [
  "Salary", "Freelance", "Investment", "Housing", "Utilities",
  "Shopping", "Food & Dining", "Entertainment", "Transport", "Groceries", "Health",
];

const categoryColors: Record<string, string> = {
  Salary: "bg-cyan-500", Freelance: "bg-cyan-500", Investment: "bg-blue-500",
  Housing: "bg-violet-500", Utilities: "bg-amber-500", Shopping: "bg-pink-500",
  "Food & Dining": "bg-orange-500", Entertainment: "bg-purple-500",
  Transport: "bg-cyan-500", Groceries: "bg-lime-500", Health: "bg-red-500",
};

const accounts = ["HDFC Savings", "ICICI Credit Card", "Cash Wallet", "Zerodha", "SBI Savings"];

export default function AddTransactionModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (transaction: Transaction) => void;
}) {
  const { toast } = useToast();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [account, setAccount] = useState(accounts[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    const now = new Date();
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      description: description.trim(),
      category,
      categoryColor: categoryColors[category] || "bg-zinc-500",
      amount: parseFloat(amount),
      type,
      account,
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };

    onAdd(transaction);
    toast(`Transaction added: ${type === "income" ? "+" : "-"}₹${parseFloat(amount).toLocaleString("en-IN")}`, "success");
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory(categories[0]);
    setAccount(accounts[0]);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Transaction" description="Log a new income or expense entry">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div className="flex gap-2">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`glass-surface flex-1 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
                type === t
                  ? t === "income"
                    ? "bg-cyan-600/20 text-cyan-400 ring-1 ring-cyan-600/40"
                    : "bg-red-600/20 text-red-400 ring-1 ring-red-600/40"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-300"
              }`}
            >
              {t === "income" ? "Income" : "Expense"}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Grocery shopping at D-Mart"
            className="glass-surface mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-cyan-500/30"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="glass-surface mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-cyan-500/30"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-zinc-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-zinc-600"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400">Account</label>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-zinc-600"
            >
              {accounts.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="glass-surface flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
          >
            Add transaction
          </button>
        </div>
      </form>
    </Modal>
  );
}
