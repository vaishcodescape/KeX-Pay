"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

function formatTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function GreetingCard() {
  const [time, setTime] = useState(formatTime());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(t);
  }, []);

  const greeting = mounted ? getGreeting() : "Welcome";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/60 via-zinc-900/40 to-zinc-900/60 backdrop-blur-xl p-8"
      style={{ 
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Subtle top-edge highlight only */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(99,102,241,0.04)_0%,transparent_40%)]" />
      
      <div className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold text-zinc-200 sm:text-xl"
        >
          Good {greeting}, User
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-1.5 text-sm text-zinc-400"
        >
          Stay on top of your finances today.
        </motion.p>
        <motion.p
          key={time}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-4xl font-bold tabular-nums tracking-tight text-white sm:mt-6 sm:text-5xl"
        >
          {mounted ? time : "—:— —"}
        </motion.p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 mt-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 sm:absolute sm:right-6 sm:top-6 sm:mt-0 sm:px-5 sm:py-4"
        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 0 rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-2.5 text-zinc-300">
          <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span className="text-lg font-semibold">25°C</span>
        </div>
        <p className="mt-1 text-xs text-zinc-500">Overcast</p>
        <p className="mt-0.5 text-xs text-zinc-500">{mounted ? formatDate() : ""}</p>
      </motion.div>
    </motion.div>
  );
}
