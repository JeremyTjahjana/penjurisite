import type { GradeCriterionItem } from "@/lib/gpa-actions";

interface CriteriaSectionProps {
  gradeCriteria: GradeCriterionItem[];
  criteriaForm: { letterGrade: string; minimumScore: string };
  criteriaMode: "create" | "edit";
  onCriteriaEdit: (criterion: GradeCriterionItem) => void;
  onCriteriaDelete: (criterionId: string) => void;
  onFormChange: (
    updates: Partial<{ letterGrade: string; minimumScore: string }>,
  ) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function CriteriaSection({
  gradeCriteria,
  criteriaForm,
  criteriaMode,
  onCriteriaEdit,
  onCriteriaDelete,
  onFormChange,
  onSubmit,
  onCancel,
}: CriteriaSectionProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Kriteria Nilai
      </h3>

      <div className="mt-4 space-y-3">
        {gradeCriteria.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Tambahkan bobot nilai untuk A/AB/B/BC dan lainnya.
          </p>
        ) : (
          gradeCriteria.map((criterion) => (
            <div
              key={criterion.id}
              className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-zinc-800">
                  {criterion.letterGrade}
                </p>
                <p className="text-xs text-zinc-500">
                  Minimum {criterion.minimumScore}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onCriteriaEdit(criterion)}
                  className="text-xs text-zinc-600 hover:text-zinc-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => onCriteriaDelete(criterion.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 border-t border-zinc-100 pt-4">
        <h4 className="text-sm font-semibold text-zinc-800">
          {criteriaMode === "create" ? "Tambah Kriteria" : "Edit Kriteria"}
        </h4>
        <p className="mt-2 text-xs text-zinc-500">
          A (4.0) • AB (3.5) • B (3.0) • BC (2.5) • C (2.0) • D (1.5) • E (1.0)
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-[120px_1fr]">
          <select
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
            value={criteriaForm.letterGrade}
            onChange={(e) => onFormChange({ letterGrade: e.target.value })}
          >
            {["A", "AB", "B", "BC", "C", "D", "E"].map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
            placeholder="Minimum score"
            value={criteriaForm.minimumScore}
            min={0}
            max={100}
            onChange={(e) => onFormChange({ minimumScore: e.target.value })}
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={onSubmit}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {criteriaMode === "create" ? "Simpan" : "Perbarui"}
          </button>
          {criteriaMode === "edit" && (
            <button
              onClick={onCancel}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            >
              Batal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
