"use client";

interface CriteriaCreateModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  letterGrade: string;
  minimumScore: string;
  onClose: () => void;
  onLetterGradeChange: (value: string) => void;
  onMinimumScoreChange: (value: string) => void;
  onSubmit: () => void;
}

export default function CriteriaCreateModal({
  isOpen,
  mode,
  letterGrade,
  minimumScore,
  onClose,
  onLetterGradeChange,
  onMinimumScoreChange,
  onSubmit,
}: CriteriaCreateModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-zinc-950">
          {mode === "edit" ? "Edit Kriteria" : "Tambah Kriteria"}
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          {mode === "edit"
            ? "Perbarui huruf mutu dan nilai minimum."
            : "Tentukan huruf mutu dan nilai minimum."}
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-700">
              Huruf Mutu
            </label>
            <select
              value={letterGrade}
              onChange={(e) => onLetterGradeChange(e.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
            >
              {[
                { value: "A", label: "A (4.0)" },
                { value: "AB", label: "AB (3.5)" },
                { value: "B", label: "B (3.0)" },
                { value: "BC", label: "BC (2.5)" },
                { value: "C", label: "C (2.0)" },
                { value: "D", label: "D (1.5)" },
                { value: "E", label: "E (1.0)" },
              ].map((grade) => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">
              Nilai Minimum
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={minimumScore}
              onChange={(e) => onMinimumScoreChange(e.target.value)}
              placeholder="Contoh: 75"
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            {mode === "edit" ? "Perbarui" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
