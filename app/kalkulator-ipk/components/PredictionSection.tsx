import type { PredictionResult } from "@/lib/prediction";

interface PredictionSectionProps {
  missingComponentsCount: number;
  predictionTargets: PredictionResult[];
}

export default function PredictionSection({
  missingComponentsCount,
  predictionTargets,
}: PredictionSectionProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Prediksi Nilai
      </h3>

      {missingComponentsCount === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">
          Semua komponen sudah terisi.
        </p>
      ) : missingComponentsCount > 1 ? (
        <p className="mt-4 text-sm text-zinc-500">
          Isi nilai hingga tersisa 1 komponen untuk prediksi.
        </p>
      ) : predictionTargets.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">
          Kriteria nilai belum lengkap.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {predictionTargets.map((target) => (
            <div
              key={target.letterGrade}
              className={`rounded-lg px-3 py-2 ${
                target.status === "impossible"
                  ? "border border-red-200 bg-red-50"
                  : "border border-zinc-100 bg-zinc-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-semibold ${
                    target.status === "impossible"
                      ? "text-red-700"
                      : "text-zinc-800"
                  }`}
                >
                  Target {target.letterGrade}
                </span>
                <span
                  className={`text-sm ${
                    target.status === "impossible"
                      ? "text-red-600"
                      : "text-zinc-600"
                  }`}
                >
                  {target.requiredScore === null
                    ? "-"
                    : `${target.requiredScore.toFixed(2)}`}
                </span>
              </div>
              <p
                className={`text-xs ${
                  target.status === "impossible"
                    ? "text-red-600"
                    : "text-zinc-500"
                }`}
              >
                {target.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
