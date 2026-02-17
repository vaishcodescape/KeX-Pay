"use client";

// Simple area chart data (mock monthly cash flow)
const data = [
  { month: "Aug", value: 28 },
  { month: "Sep", value: 35 },
  { month: "Oct", value: 42 },
  { month: "Nov", value: 38 },
  { month: "Dec", value: 52 },
  { month: "Jan", value: 48 },
  { month: "Feb", value: 58 },
];

const max = Math.max(...data.map((d) => d.value));
const min = Math.min(...data.map((d) => d.value));
const range = max - min || 1;

function toPath(d: typeof data) {
  const w = 100;
  const h = 60;
  const points = d.map((item, i) => {
    const x = (i / (d.length - 1)) * w;
    const y = h - ((item.value - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });
  return `M ${points.join(" L ")} L 100,64 L 0,64 Z`;
}

export default function SpendingChart() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Cash flow</h3>
          <p className="mt-0.5 text-sm text-zinc-400">Income vs expenses this quarter</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          This quarter
          <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div className="mt-6 h-48 w-full">
        <svg viewBox="0 0 100 64" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#chartGrad)" stroke="none" d={toPath(data)} />
          <path
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d={data.map((item, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = 60 - ((item.value - min) / range) * 52 - 4;
              return `${i === 0 ? "M" : "L"} ${x},${y}`;
            }).join(" ")}
          />
        </svg>
      </div>
      <div className="flex justify-between border-t border-zinc-800 pt-3 text-xs text-zinc-500">
        {data.map((d) => (
          <span key={d.month}>{d.month}</span>
        ))}
      </div>
    </div>
  );
}
