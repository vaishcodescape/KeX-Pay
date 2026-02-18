"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Modal from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";
import type { Account } from "../lib/types";

const accountTypes: Account["type"][] = ["Savings", "Checking", "Credit Card", "Investment", "Cash"];
const accentColors = ["bg-emerald-500", "bg-blue-500", "bg-violet-500", "bg-amber-500", "bg-pink-500", "bg-cyan-500", "bg-red-500"];

function formatCurrency(n: number) {
  const abs = Math.abs(n);
  return (n < 0 ? "-" : "") + "₹" + abs.toLocaleString("en-IN");
}

function AddAccountModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (account: Account) => void;
}) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [type, setType] = useState<Account["type"]>("Savings");
  const [balance, setBalance] = useState("");
  const [number, setNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const account: Account = {
      id: crypto.randomUUID(),
      name: name.trim(),
      institution: institution.trim() || "Personal",
      type,
      balance: parseFloat(balance) || 0,
      lastActivity: "Just now",
      accentColor: accentColors[Math.floor(Math.random() * accentColors.length)],
      number: number.trim() || "••••" + Math.floor(1000 + Math.random() * 9000),
    };

    onAdd(account);
    toast(`Account "${name}" added`, "success");
    setName("");
    setInstitution("");
    setType("Savings");
    setBalance("");
    setNumber("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Account" description="Link a new bank, card, or cash account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400">Account name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. HDFC Savings"
            className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-zinc-400">Institution</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. HDFC Bank"
              className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Account["type"])}
              className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-zinc-600"
            >
              {accountTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-zinc-400">Balance (₹)</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0.00"
              step="0.01"
              className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400">Account number (optional)</label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="••••1234"
              className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800">Cancel</button>
          <button type="submit" className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500">Add account</button>
        </div>
      </form>
    </Modal>
  );
}

export default function AccountsPage() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalAssets = accounts.filter((a) => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = Math.abs(accounts.filter((a) => a.balance < 0).reduce((s, a) => s + a.balance, 0));

  const removeAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    toast("Account removed", "info");
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
              <span className="text-zinc-400">Accounts</span>
            </nav>
            <h1 className="mt-1 text-2xl font-bold text-white">Accounts</h1>
            <p className="mt-0.5 text-sm text-zinc-400">All your financial accounts in one place</p>
          </div>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 sm:mt-0"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add account
          </button>
        </div>

        {accounts.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 sm:col-span-1">
              <p className="text-sm font-medium text-zinc-400">Net worth</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm font-medium text-zinc-400">Total assets</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-400">{formatCurrency(totalAssets)}</p>
              <p className="mt-1 text-xs text-zinc-500">{accounts.filter((a) => a.balance > 0).length} accounts</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm font-medium text-zinc-400">Liabilities</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-red-400">{formatCurrency(totalLiabilities)}</p>
              <p className="mt-1 text-xs text-zinc-500">{accounts.filter((a) => a.balance < 0).length} accounts</p>
            </div>
          </div>
        )}

        {accounts.length > 0 ? (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="group flex items-center gap-5 rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
              >
                <div className={`h-10 w-1 rounded-full ${account.accentColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-white">{account.name}</p>
                    <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">{account.type}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">{account.institution}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="font-mono text-xs text-zinc-500">{account.number}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{account.lastActivity}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold tabular-nums tracking-tight ${account.balance >= 0 ? "text-white" : "text-red-400"}`}>
                    {formatCurrency(account.balance)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeAccount(account.id)}
                  className="rounded-lg p-2 text-zinc-600 opacity-0 transition-all hover:bg-zinc-800 hover:text-red-400 group-hover:opacity-100"
                  aria-label="Remove account"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 py-16">
            <svg className="h-10 w-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
            <p className="mt-3 text-sm font-medium text-zinc-400">No accounts added yet</p>
            <p className="mt-1 text-xs text-zinc-600">Add your first bank account, credit card, or cash wallet to get started</p>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Add account
            </button>
          </div>
        )}
      </div>

      <AddAccountModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={(a) => setAccounts((prev) => [...prev, a])} />
    </DashboardLayout>
  );
}
