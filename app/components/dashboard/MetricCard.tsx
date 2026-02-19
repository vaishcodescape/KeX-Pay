"use client";

import { motion } from "motion/react";

type Trend = "up" | "down" | "neutral";

const trendConfig: Record<Trend, { color: string; icon: string }> = {
  up: { color: "text-cyan-400", icon: "M5 10l7-7m0 0l7 7m-7-7v18" },
  down: { color: "text-red-400", icon: "M19 14l-7 7m0 0l-7-7m7 7V3" },
  neutral: { color: "text-zinc-500", icon: "M5 12h14" },
};

export default function MetricCard({
  title,
  value,
  change,
  trend = "neutral",
  icon,
  index = 0,
}: {
  title: string;
  value: string;
  change?: string;
  trend?: Trend;
  icon: React.ReactNode;
  index?: number;
}) {
  const config = trendConfig[trend];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card group cursor-pointer p-6 transition-all duration-300"
    >
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="rounded-xl bg-linear-to-br from-white/10 to-white/5 p-3 text-zinc-300 backdrop-blur-sm"
            style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.1)" }}
          >
            {icon}
          </motion.div>
          <div>
            <p className="text-sm font-medium text-zinc-400">{title}</p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="mt-1.5 text-2xl font-bold tracking-tight text-white"
            >
              {value}
            </motion.p>
            {change != null && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className={`mt-1.5 flex items-center gap-1.5 text-xs font-medium ${config.color}`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                </svg>
                {change}
              </motion.p>
            )}
          </div>
        </div>
        <button 
          type="button" 
          className="rounded-lg p-1.5 text-zinc-500 transition-all duration-200 hover:bg-white/5 hover:text-zinc-300 opacity-0 group-hover:opacity-100" 
          aria-label="More options"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></svg>
        </button>
      </div>
    </motion.div>
  );
}
