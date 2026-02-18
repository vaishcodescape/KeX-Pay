"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

const faqs = [
  {
    q: "How do I add a new bank account?",
    a: "Go to the Accounts page and click 'Add account'. Enter your bank name, account type, and starting balance. We don't connect to your bank directly — all tracking is manual for your privacy.",
  },
  {
    q: "Can I set different budgets for each month?",
    a: "Yes. Navigate to Budgets and click 'New budget'. Each budget is tied to a specific month. You can copy last month's budgets as a starting point.",
  },
  {
    q: "How are financial insights calculated?",
    a: "Insights are based on your transaction history. We calculate averages, trends, and patterns from the data you've entered. The more consistent you are with logging, the better the insights.",
  },
  {
    q: "Is my financial data secure?",
    a: "Your data is stored locally on your device and encrypted. We never share your information with third parties. You can export or delete your data anytime from Settings.",
  },
  {
    q: "How do I track recurring expenses?",
    a: "When adding a transaction, you can mark it as recurring. Set the frequency (daily, weekly, monthly, yearly) and KeXPay will remind you to log it each cycle.",
  },
  {
    q: "Can I export my data for tax filing?",
    a: "Yes. Go to Settings > Data & Privacy > Export all data. You can export as CSV or PDF, filtered by date range and category — ready for your CA.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [message, setMessage] = useState("");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <nav className="flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </Link>
            <span className="text-zinc-600">&gt;</span>
            <span className="text-zinc-400">Support</span>
          </nav>
          <h1 className="mt-1 text-2xl font-bold text-white">Support</h1>
          <p className="mt-0.5 text-sm text-zinc-400">Find answers or reach out for help</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* FAQ */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-sm font-semibold text-white">Frequently Asked Questions</h2>
              <p className="mt-0.5 text-xs text-zinc-500">Quick answers to common questions</p>
              <div className="mt-6 divide-y divide-zinc-800">
                {faqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={i} className="py-4 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="flex w-full items-start justify-between gap-4 text-left"
                      >
                        <span className="text-sm font-medium text-zinc-200">{faq.q}</span>
                        <svg
                          className={`mt-0.5 h-4 w-4 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact + Quick links */}
          <div className="space-y-6 lg:col-span-2">
            {/* Contact form */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-sm font-semibold text-white">Send a Message</h2>
              <p className="mt-0.5 text-xs text-zinc-500">We typically reply within 24 hours</p>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400">Subject</label>
                  <input
                    type="text"
                    placeholder="What's this about?"
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your issue or question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1.5 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600"
                  />
                </div>
                <button
                  type="button"
                  className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                >
                  Send message
                </button>
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-sm font-semibold text-white">Quick Links</h2>
              <div className="mt-4 space-y-2">
                {[
                  { label: "Getting started guide", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" },
                  { label: "Keyboard shortcuts", icon: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" },
                  { label: "Privacy policy", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
                  { label: "Release notes", icon: "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z M6 6h.008v.008H6V6z" },
                ].map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-zinc-800"
                  >
                    <svg className="h-4 w-4 shrink-0 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                    </svg>
                    <span className="text-sm text-zinc-300">{link.label}</span>
                    <svg className="ml-auto h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
