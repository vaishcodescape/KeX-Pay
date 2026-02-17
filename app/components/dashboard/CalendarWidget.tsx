"use client";

import { useState } from "react";

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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-base font-semibold text-white">Calendar</h3>
      <p className="mt-0.5 text-sm text-zinc-400">
        {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-300">
          {date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <div className="flex gap-1">
          <button type="button" onClick={prevMonth} className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button type="button" onClick={nextMonth} className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d) => (
          <span key={d} className="py-1 text-xs font-medium text-zinc-500">{d}</span>
        ))}
        {grid.map((d, i) => (
          <button
            key={i}
            type="button"
            className={`rounded py-1.5 text-sm ${d == null ? "invisible" : isToday(d) ? "bg-emerald-600 font-medium text-white" : "text-zinc-300 hover:bg-zinc-800 hover:text-white"}`}
          >
            {d ?? ""}
          </button>
        ))}
      </div>
    </div>
  );
}
