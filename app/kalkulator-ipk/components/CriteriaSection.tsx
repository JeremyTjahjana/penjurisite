import { useState } from "react";
import type { GradeCriterionItem } from "@/lib/gpa-actions";
import CriteriaCreateModal from "./CriteriaCreateModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    onCancel();
    setIsModalOpen(true);
  };

  const handleEditModal = (criterion: GradeCriterionItem) => {
    onCriteriaEdit(criterion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onCancel();
  };

  const handleModalSubmit = () => {
    onSubmit();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 border-t border-zinc-200 pt-5">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Kriteria Nilai
        </h3>
        <p className="mt-2 text-sm text-zinc-600">
          Tentukan batas huruf mutu untuk mata kuliah aktif.
        </p>
      </div>

      <div className="space-y-0">
        {gradeCriteria.length === 0 ? (
          <p className="border-b border-zinc-200 py-3 text-sm text-zinc-500">
            Tambahkan bobot nilai untuk A/AB/B/BC dan lainnya.
          </p>
        ) : (
          gradeCriteria.map((criterion) => (
            <div
              key={criterion.id}
              className="flex items-center justify-between border-b border-zinc-200 py-3"
            >
              <div>
                <p className="text-sm font-medium text-zinc-950">
                  {criterion.letterGrade}
                </p>
                <p className="text-xs text-zinc-500">
                  Minimum {criterion.minimumScore}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditModal(criterion)}
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

      <div className="border-t border-zinc-200 pt-4">
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-950 hover:bg-zinc-50"
        >
          <span className="text-lg">+</span> Tambah Kriteria
        </button>
      </div>

      <CriteriaCreateModal
        isOpen={isModalOpen}
        mode={criteriaMode}
        letterGrade={criteriaForm.letterGrade}
        minimumScore={criteriaForm.minimumScore}
        onClose={handleCloseModal}
        onLetterGradeChange={(value) => onFormChange({ letterGrade: value })}
        onMinimumScoreChange={(value) => onFormChange({ minimumScore: value })}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
