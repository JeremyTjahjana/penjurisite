"use client";

interface VisitorStatsProps {
  weeklyVisitors: number;
  loading: boolean;
}

export function VisitorStats({ weeklyVisitors, loading }: VisitorStatsProps) {
  return (
    <div className="text-xs text-zinc-400">
      {loading ? (
        <span className="inline-block h-4 w-20 animate-pulse rounded bg-zinc-200"></span>
      ) : (
        <>
          <span className="font-medium">Visitors this week:</span>{" "}
          <span className="font-mono font-semibold text-zinc-600">
            {weeklyVisitors.toLocaleString()}
          </span>
        </>
      )}
    </div>
  );
}
