"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${enabled ? "bg-emerald-600" : "bg-zinc-700"}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <nav className="flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </Link>
            <span className="text-zinc-600">&gt;</span>
            <span className="text-zinc-400">Settings</span>
          </nav>
          <h1 className="mt-1 text-2xl font-bold text-white">Settings</h1>
          <p className="mt-0.5 text-sm text-zinc-400">Manage your account preferences</p>
        </div>

        {/* Profile section */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-sm font-semibold text-white">Profile</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Your personal information</p>
          <div className="mt-6 flex items-start gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-600/80 text-xl font-bold text-white">U</div>
            <div className="flex-1 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-400">Full name</label>
                  <input
                    type="text"
                    defaultValue="User"
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400">Email</label>
                  <input
                    type="email"
                    defaultValue="user@example.com"
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-zinc-600"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-400">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+91 98765 43210"
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400">Location</label>
                  <input
                    type="text"
                    defaultValue="Mumbai, India"
                    className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-zinc-600"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-sm font-semibold text-white">Preferences</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Customize your experience</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400">Currency</label>
              <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white">
                <span>🇮🇳</span>
                <span>Indian Rupee (₹)</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">Date format</label>
              <div className="mt-1.5 rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white">DD/MM/YYYY</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">Start of week</label>
              <div className="mt-1.5 rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white">Monday</div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-sm font-semibold text-white">Notifications</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Control how you receive alerts</p>
          <div className="mt-6 divide-y divide-zinc-800">
            <div className="flex items-center justify-between py-4 first:pt-0">
              <div>
                <p className="text-sm font-medium text-zinc-200">Push notifications</p>
                <p className="text-xs text-zinc-500">Get notified about new transactions</p>
              </div>
              <Toggle enabled={notifications} onToggle={() => setNotifications(!notifications)} />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium text-zinc-200">Budget alerts</p>
                <p className="text-xs text-zinc-500">Warn when spending exceeds 80% of budget</p>
              </div>
              <Toggle enabled={budgetAlerts} onToggle={() => setBudgetAlerts(!budgetAlerts)} />
            </div>
            <div className="flex items-center justify-between py-4 last:pb-0">
              <div>
                <p className="text-sm font-medium text-zinc-200">Weekly digest</p>
                <p className="text-xs text-zinc-500">Summary of spending every Sunday evening</p>
              </div>
              <Toggle enabled={weeklyDigest} onToggle={() => setWeeklyDigest(!weeklyDigest)} />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-sm font-semibold text-white">Security</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Protect your account</p>
          <div className="mt-6 divide-y divide-zinc-800">
            <div className="flex items-center justify-between py-4 first:pt-0">
              <div>
                <p className="text-sm font-medium text-zinc-200">Two-factor authentication</p>
                <p className="text-xs text-zinc-500">Add an extra layer of security with OTP</p>
              </div>
              <Toggle enabled={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium text-zinc-200">Biometric login</p>
                <p className="text-xs text-zinc-500">Use fingerprint or face recognition</p>
              </div>
              <Toggle enabled={biometric} onToggle={() => setBiometric(!biometric)} />
            </div>
            <div className="flex items-center justify-between py-4 last:pb-0">
              <div>
                <p className="text-sm font-medium text-zinc-200">Change password</p>
                <p className="text-xs text-zinc-500">Last changed 45 days ago</p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-zinc-700 px-3.5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-sm font-semibold text-white">Data & Privacy</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Your data, your control</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export all data
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Import data
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-red-900/50 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-950/30"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Delete account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
