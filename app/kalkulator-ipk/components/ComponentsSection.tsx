import { useState } from "react";
import type { ComponentItem } from "@/lib/gpa-actions";
import ComponentCreateModal from "./ComponentCreateModal";

interface ComponentsSectionProps {
  components: ComponentItem[];
  componentForm: { name: string; weight: string };
  componentMode: "create" | "edit";
  scoreInputs: Record<string, string>;
  onComponentEdit: (component: ComponentItem) => void;
  onComponentDelete: (componentId: string) => void;
  onFormChange: (updates: Partial<{ name: string; weight: string }>) => void;
  onScoreChange: (componentId: string, value: string) => void;
  onScoreBlur: (componentId: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ComponentsSection({
  components,
  componentForm,
  componentMode,
  scoreInputs,
  onComponentEdit,
  onComponentDelete,
  onFormChange,
  onScoreChange,
  onScoreBlur,
  onSubmit,
  onCancel,
}: ComponentsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    onCancel();
    setIsModalOpen(true);
  };

  const handleEditModal = (component: ComponentItem) => {
    onComponentEdit(component);
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
          Komponen Penilaian
        </h3>
        <p className="mt-2 text-sm text-zinc-600">
          Atur bobot komponen dalam satu daftar yang menyatu.
        </p>
      </div>

      <div className="space-y-0">
        {components.length === 0 ? (
          <p className="border-b border-zinc-200 py-3 text-sm text-zinc-500">
            Tambahkan komponen seperti UTS, UAS, Praktikum.
          </p>
        ) : (
          components.map((component) => (
            <div
              key={component.id}
              className="flex flex-col gap-3 border-b border-zinc-200 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-950">
                  {component.name}
                </p>
                <p className="text-xs text-zinc-500">
                  Bobot {component.weight}%
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={scoreInputs[component.id] ?? ""}
                  onChange={(e) => onScoreChange(component.id, e.target.value)}
                  onBlur={() => onScoreBlur(component.id)}
                  className="w-full border-b border-zinc-300 bg-transparent px-0 py-2 text-sm outline-none focus:border-zinc-950 sm:w-24"
                  placeholder="Nilai 0-100"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditModal(component)}
                    className="text-xs text-zinc-600 hover:text-zinc-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onComponentDelete(component.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Hapus
                  </button>
                </div>
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
          <span className="text-lg">+</span> Tambah Komponen
        </button>
      </div>

      <ComponentCreateModal
        isOpen={isModalOpen}
        mode={componentMode}
        name={componentForm.name}
        weight={componentForm.weight}
        onClose={handleCloseModal}
        onNameChange={(value) => onFormChange({ name: value })}
        onWeightChange={(value) => onFormChange({ weight: value })}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
