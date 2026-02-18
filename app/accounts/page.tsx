"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import type { Account } from "../lib/types";

function formatCurrency(n: number) {
  const abs = Math.abs(n);
  return (n < 0 ? "-" : "") + "₹" + abs.toLocaleString("en-IN");
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call — e.g. fetch("/api/accounts")
    setAccounts([]);
    setLoading(false);
  }, []);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalAssets = accounts.filter((a) => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = Math.abs(accounts.filter((a) => a.balance < 0).reduce((s, a) => s + a.balance, 0));

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
            className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 sm:mt-0"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add account
          </button>
        </div>

        {/* Net worth hero */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
            ))}
          </div>
        ) : accounts.length > 0 ? (
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
        ) : null}

        {/* Account cards */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
            ))}
          </div>
        ) : accounts.length > 0 ? (
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
                  className="rounded-lg p-2 text-zinc-600 opacity-0 transition-all hover:bg-zinc-800 hover:text-zinc-300 group-hover:opacity-100"
                  aria-label="Account options"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 py-16">
            <svg className="h-10 w-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
            <p className="mt-3 text-sm font-medium text-zinc-400">No accounts added yet</p>
            <p className="mt-1 text-xs text-zinc-600">Add your first bank account, credit card, or cash wallet to get started</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
