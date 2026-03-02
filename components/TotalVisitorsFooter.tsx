interface TotalVisitorsFooterProps {
  totalVisitors: number;
  loading: boolean;
}

export function TotalVisitorsFooter({
  totalVisitors,
  loading,
}: TotalVisitorsFooterProps) {
  return (
    <div className="fixed bottom-4 right-4 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 shadow-sm">
      {loading ? (
        <span className="inline-block h-3 w-24 animate-pulse rounded bg-zinc-200"></span>
      ) : (
        <>
          <span className="text-zinc-500">Total visitors:</span>{" "}
          <span className="ml-1 font-mono font-semibold">
            {totalVisitors.toLocaleString()}
          </span>
        </>
      )}
    </div>
  );
}
