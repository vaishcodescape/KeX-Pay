type Trend = "up" | "down" | "neutral";

const trendConfig: Record<Trend, { color: string; icon: string }> = {
  up: { color: "text-emerald-400", icon: "M5 10l7-7m0 0l7 7m-7-7v18" },
  down: { color: "text-red-400", icon: "M19 14l-7 7m0 0l-7-7m7 7V3" },
  neutral: { color: "text-zinc-500", icon: "M5 12h14" },
};

export default function MetricCard({
  title,
  value,
  change,
  trend = "neutral",
  icon,
}: {
  title: string;
  value: string;
  change?: string;
  trend?: Trend;
  icon: React.ReactNode;
}) {
  const config = trendConfig[trend];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-zinc-800 p-2.5 text-zinc-400">{icon}</div>
          <div>
            <p className="text-sm font-medium text-zinc-400">{title}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-white">{value}</p>
            {change != null && (
              <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${config.color}`}>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                </svg>
                {change}
              </p>
            )}
          </div>
        </div>
        <button type="button" className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300" aria-label="More options">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></svg>
        </button>
      </div>
    </div>
  );
}
