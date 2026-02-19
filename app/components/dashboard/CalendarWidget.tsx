"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CalendarWidget() {
  const [date, setDate] = useState(new Date(2026, 1, 1)); // Feb 2026
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setDate(new Date(year, month - 1));
  const nextMonth = () => setDate(new Date(year, month + 1));

  const grid: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);

  const isToday = (d: number | null) =>
    d != null && today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="glass-card p-6"
    >
      <div className="relative">
        <h3 className="text-lg font-semibold text-white">Calendar</h3>
        <p className="mt-1 text-sm text-zinc-400">
          {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-300">
            {date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
          <div className="flex gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={prevMonth}
              className="rounded-lg p-1.5 text-zinc-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={nextMonth}
              className="rounded-lg p-1.5 text-zinc-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </motion.button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
          {DAYS.map((d) => (
            <span key={d} className="py-1.5 text-xs font-semibold text-zinc-500">{d}</span>
          ))}
          <AnimatePresence mode="wait">
            {grid.map((d, i) => (
              <motion.button
                key={`${month}-${d}-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.01 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className={`rounded-lg py-2 text-sm transition-all duration-200 ${
                  d == null
                    ? "invisible"
                    : isToday(d)
                    ? "bg-linear-to-r from-cyan-500 to-emerald-500 font-semibold text-white shadow-lg shadow-cyan-500/30"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {d ?? ""}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
