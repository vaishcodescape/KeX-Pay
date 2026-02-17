"use client";

import { useEffect, useState } from "react";

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
    <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="relative z-10">
        <h2 className="text-lg font-semibold text-zinc-200">
          {greeting} greetings, User
        </h2>
        <p className="mt-1 text-sm text-zinc-400">Stay on top of your finances today.</p>
        <p className="mt-4 text-4xl font-bold tabular-nums tracking-tight text-white">
          {mounted ? time : "—:— —"}
        </p>
      </div>
      <div className="absolute right-4 top-4 z-10 rounded-lg border border-zinc-700/80 bg-zinc-800/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2 text-zinc-300">
          <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span className="text-lg font-semibold">25°C</span>
        </div>
        <p className="mt-0.5 text-xs text-zinc-500">Overcast</p>
        <p className="text-xs text-zinc-500">{mounted ? formatDate() : ""}</p>
      </div>
    </div>
  );
}
