interface CourseSummaryProps {
  totalWeight: number;
  finalScore: number;
  letterGrade: string | null;
  gradePoint: number;
}

export default function CourseSummary({
  totalWeight,
  finalScore,
  letterGrade,
  gradePoint,
}: CourseSummaryProps) {
  return (
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-zinc-900 px-4 py-3 text-white">
          <p className="text-xs uppercase tracking-wide text-zinc-300">
            Total Bobot
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {totalWeight.toFixed(0)}%
          </p>
        </div>
        <div className="rounded-xl bg-zinc-100 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Nilai Akhir
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {finalScore.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl bg-zinc-100 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Letter Grade
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {letterGrade || "-"}
          </p>
        </div>
        <div className="rounded-xl bg-zinc-100 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Grade Point
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {gradePoint.toFixed(2)}
          </p>
        </div>
      </div>

      {totalWeight !== 100 && (
        <p className="mt-4 text-sm text-amber-600">
          Bobot total harus 100%. Saat ini {totalWeight.toFixed(0)}%.
        </p>
      )}
    </>
  );
}
