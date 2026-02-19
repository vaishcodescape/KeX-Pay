"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Modal from "../components/ui/Modal";
import Dropdown, { DropdownItem } from "../components/ui/Dropdown";
import { useToast } from "../components/ui/Toast";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${enabled ? "bg-cyan-500" : "bg-zinc-700"}`}
      role="switch"
      aria-checked={enabled}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

const currencies = ["Indian Rupee (₹)", "US Dollar ($)", "Euro (€)", "British Pound (£)"];
const dateFormats = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
const weekStarts = ["Monday", "Sunday", "Saturday"];

export default function SettingsPage() {
  const { toast } = useToast();

  const [name, setName] = useState("User");
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [location, setLocation] = useState("Mumbai, India");
  const [saving, setSaving] = useState(false);

  const [currency, setCurrency] = useState(currencies[0]);
  const [dateFormat, setDateFormat] = useState(dateFormats[0]);
  const [weekStart, setWeekStart] = useState(weekStarts[0]);

  const [notifications, setNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleSaveProfile = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast("Profile saved successfully", "success");
    }, 600);
  };

  const handleExportData = () => {
    toast("Preparing data export...", "info");
    setTimeout(() => toast("Data exported as JSON", "success"), 1000);
  };

  const handleImportData = () => {
    toast("Import feature coming soon", "info");
  };

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

        {/* Profile */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white">Profile</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Your personal information</p>
          <div className="mt-6 flex items-start gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-emerald-500 text-xl font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-400">Full name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="glass-surface mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-cyan-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-surface mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:ring-2 focus:ring-cyan-500/30" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-400">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-zinc-600" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-zinc-600" />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white">Preferences</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Customize your experience</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400">Currency</label>
              <Dropdown
                align="left"
                trigger={
                  <div className="glass-surface mt-1.5 flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-sm text-white transition-all duration-200 hover:bg-white/5">
                    <span>{currency}</span>
                    <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                }
              >
                {currencies.map((c) => (
                  <DropdownItem key={c} onClick={() => { setCurrency(c); toast(`Currency set to ${c}`, "success"); }}>
                    <span className={c === currency ? "text-cyan-400" : ""}>{c}</span>
                  </DropdownItem>
                ))}
              </Dropdown>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">Date format</label>
              <Dropdown
                align="left"
                trigger={
                  <div className="glass-surface mt-1.5 flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-sm text-white transition-all duration-200 hover:bg-white/5">
                    <span>{dateFormat}</span>
                    <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                }
              >
                {dateFormats.map((f) => (
                  <DropdownItem key={f} onClick={() => { setDateFormat(f); toast(`Date format: ${f}`, "success"); }}>
                    <span className={f === dateFormat ? "text-cyan-400" : ""}>{f}</span>
                  </DropdownItem>
                ))}
              </Dropdown>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">Start of week</label>
              <Dropdown
                align="left"
                trigger={
                  <div className="glass-surface mt-1.5 flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-sm text-white transition-all duration-200 hover:bg-white/5">
                    <span>{weekStart}</span>
                    <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                }
              >
                {weekStarts.map((w) => (
                  <DropdownItem key={w} onClick={() => { setWeekStart(w); toast(`Week starts on ${w}`, "success"); }}>
                    <span className={w === weekStart ? "text-cyan-400" : ""}>{w}</span>
                  </DropdownItem>
                ))}
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white">Notifications</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Control how you receive alerts</p>
          <div className="mt-6 divide-y divide-zinc-800">
            <div className="flex items-center justify-between py-4 first:pt-0">
              <div><p className="text-sm font-medium text-zinc-200">Push notifications</p><p className="text-xs text-zinc-500">Get notified about new transactions</p></div>
              <Toggle enabled={notifications} onToggle={() => { setNotifications(!notifications); toast(notifications ? "Push notifications off" : "Push notifications on", "info"); }} />
            </div>
            <div className="flex items-center justify-between py-4">
              <div><p className="text-sm font-medium text-zinc-200">Budget alerts</p><p className="text-xs text-zinc-500">Warn when spending exceeds 80% of budget</p></div>
              <Toggle enabled={budgetAlerts} onToggle={() => { setBudgetAlerts(!budgetAlerts); toast(budgetAlerts ? "Budget alerts off" : "Budget alerts on", "info"); }} />
            </div>
            <div className="flex items-center justify-between py-4 last:pb-0">
              <div><p className="text-sm font-medium text-zinc-200">Weekly digest</p><p className="text-xs text-zinc-500">Summary of spending every Sunday evening</p></div>
              <Toggle enabled={weeklyDigest} onToggle={() => { setWeeklyDigest(!weeklyDigest); toast(weeklyDigest ? "Weekly digest off" : "Weekly digest on", "info"); }} />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white">Security</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Protect your account</p>
          <div className="mt-6 divide-y divide-zinc-800">
            <div className="flex items-center justify-between py-4 first:pt-0">
              <div><p className="text-sm font-medium text-zinc-200">Two-factor authentication</p><p className="text-xs text-zinc-500">Add an extra layer of security with OTP</p></div>
              <Toggle enabled={twoFactor} onToggle={() => { setTwoFactor(!twoFactor); toast(twoFactor ? "2FA disabled" : "2FA enabled", twoFactor ? "info" : "success"); }} />
            </div>
            <div className="flex items-center justify-between py-4">
              <div><p className="text-sm font-medium text-zinc-200">Biometric login</p><p className="text-xs text-zinc-500">Use fingerprint or face recognition</p></div>
              <Toggle enabled={biometric} onToggle={() => { setBiometric(!biometric); toast(biometric ? "Biometric login off" : "Biometric login on", "info"); }} />
            </div>
            <div className="flex items-center justify-between py-4 last:pb-0">
              <div><p className="text-sm font-medium text-zinc-200">Change password</p><p className="text-xs text-zinc-500">Last changed 45 days ago</p></div>
              <button type="button" onClick={() => setPasswordModalOpen(true)} className="rounded-lg border border-zinc-700 px-3.5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800">Update</button>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white">Data & Privacy</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Your data, your control</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={handleExportData} className="glass-surface flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:bg-white/5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export all data
            </button>
            <button type="button" onClick={handleImportData} className="glass-surface flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:bg-white/5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Import data
            </button>
            <button type="button" onClick={() => setDeleteModalOpen(true)} className="glass-surface flex items-center gap-2 rounded-xl border-red-900/50 px-4 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-950/30">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Delete account
            </button>
          </div>
        </div>
      </div>

      {/* Password modal */}
      <Modal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} title="Change Password">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPasswordModalOpen(false);
            toast("Password updated successfully", "success");
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-zinc-400">Current password</label>
            <input type="password" placeholder="••••••••" className="glass-surface mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-cyan-500/30" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400">New password</label>
            <input type="password" placeholder="••••••••" className="glass-surface mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-cyan-500/30" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400">Confirm new password</label>
            <input type="password" placeholder="••••••••" className="glass-surface mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-cyan-500/30" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setPasswordModalOpen(false)} className="glass-surface flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:bg-white/5">Cancel</button>
            <button type="submit" className="flex-1 rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-90">Update password</button>
          </div>
        </form>
      </Modal>

      {/* Delete account modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Account">
        <div className="space-y-4">
          <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4">
            <p className="text-sm font-medium text-red-400">This action is irreversible</p>
            <p className="mt-1 text-xs text-red-400/70">All your data, including accounts, transactions, budgets, and goals will be permanently deleted.</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400">Type &ldquo;DELETE&rdquo; to confirm</label>
            <input type="text" placeholder="DELETE" className="glass-surface mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-red-500/30" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setDeleteModalOpen(false)} className="glass-surface flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:bg-white/5">Cancel</button>
            <button type="button" onClick={() => { setDeleteModalOpen(false); toast("Account deletion cancelled (demo mode)", "info"); }} className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-red-500">Delete account</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
