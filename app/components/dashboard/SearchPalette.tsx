"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const pages = [
  { name: "Dashboard", href: "/", keywords: "home overview" },
  { name: "Accounts", href: "/accounts", keywords: "bank card wallet" },
  { name: "Transactions", href: "/transactions", keywords: "payments expenses income" },
  { name: "Budgets", href: "/budgets", keywords: "spending limits categories" },
  { name: "Goals", href: "/goals", keywords: "savings targets milestones" },
  { name: "Reports", href: "/reports", keywords: "analytics charts trends" },
  { name: "Settings", href: "/settings", keywords: "profile preferences notifications" },
  { name: "Support", href: "/support", keywords: "help faq contact" },
];

const actions = [
  { name: "Add Transaction", action: "add-transaction", keywords: "new expense income payment" },
  { name: "Add Account", action: "add-account", keywords: "new bank card" },
  { name: "Add Budget", action: "add-budget", keywords: "new spending limit" },
  { name: "Add Goal", action: "add-goal", keywords: "new savings target" },
  { name: "Export Data", action: "export", keywords: "download csv pdf" },
];

export default function SearchPalette({
  open,
  onClose,
  onAction,
}: {
  open: boolean;
  onClose: () => void;
  onAction?: (action: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const q = query.toLowerCase();
  const filteredPages = pages.filter(
    (p) => p.name.toLowerCase().includes(q) || p.keywords.includes(q)
  );
  const filteredActions = actions.filter(
    (a) => a.name.toLowerCase().includes(q) || a.keywords.includes(q)
  );
  const allResults = [
    ...filteredPages.map((p) => ({ type: "page" as const, ...p })),
    ...filteredActions.map((a) => ({ type: "action" as const, ...a })),
  ];

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (index: number) => {
    const item = allResults[index];
    if (!item) return;
    if (item.type === "page") {
      router.push(item.href);
    } else if (onAction) {
      onAction(item.action);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, allResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[20vh] backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="mx-4 w-full max-w-lg animate-in rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-zinc-800 px-4">
          <svg className="h-4 w-4 shrink-0 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, actions..."
            className="flex-1 bg-transparent py-4 text-sm text-white placeholder-zinc-500 outline-none"
          />
          <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">ESC</kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {filteredPages.length > 0 && (
            <>
              <p className="px-3 py-1.5 text-xs font-medium text-zinc-500">Pages</p>
              {filteredPages.map((page, i) => {
                const globalIndex = i;
                return (
                  <button
                    key={page.href}
                    type="button"
                    onClick={() => handleSelect(globalIndex)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      selectedIndex === globalIndex
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    {page.name}
                  </button>
                );
              })}
            </>
          )}

          {filteredActions.length > 0 && (
            <>
              <p className="mt-1 px-3 py-1.5 text-xs font-medium text-zinc-500">Actions</p>
              {filteredActions.map((action, i) => {
                const globalIndex = filteredPages.length + i;
                return (
                  <button
                    key={action.action}
                    type="button"
                    onClick={() => handleSelect(globalIndex)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      selectedIndex === globalIndex
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {action.name}
                  </button>
                );
              })}
            </>
          )}

          {allResults.length === 0 && (
            <p className="py-8 text-center text-sm text-zinc-500">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
