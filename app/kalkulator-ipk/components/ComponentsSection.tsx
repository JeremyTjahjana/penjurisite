import type { ComponentItem } from "@/lib/gpa-actions";

interface ComponentsSectionProps {
  components: ComponentItem[];
  componentForm: { name: string; weight: string };
  componentMode: "create" | "edit";
  onComponentEdit: (component: ComponentItem) => void;
  onComponentDelete: (componentId: string) => void;
  onFormChange: (updates: Partial<{ name: string; weight: string }>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ComponentsSection({
  components,
  componentForm,
  componentMode,
  onComponentEdit,
  onComponentDelete,
  onFormChange,
  onSubmit,
  onCancel,
}: ComponentsSectionProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Komponen Penilaian
      </h3>

      <div className="mt-4 space-y-3">
        {components.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Tambahkan komponen seperti UTS, UAS, Praktikum.
          </p>
        ) : (
          components.map((component) => (
            <div
              key={component.id}
              className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-zinc-800">
                  {component.name}
                </p>
                <p className="text-xs text-zinc-500">
                  Bobot {component.weight}%
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onComponentEdit(component)}
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
          ))
        )}
      </div>

      <div className="mt-5 border-t border-zinc-100 pt-4">
        <h4 className="text-sm font-semibold text-zinc-800">
          {componentMode === "create" ? "Tambah Komponen" : "Edit Komponen"}
        </h4>
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_120px]">
          <input
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
            placeholder="Nama komponen"
            value={componentForm.name}
            onChange={(e) => onFormChange({ name: e.target.value })}
          />
          <input
            type="number"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
            placeholder="Bobot %"
            value={componentForm.weight}
            min={0}
            onChange={(e) => onFormChange({ weight: e.target.value })}
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={onSubmit}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {componentMode === "create" ? "Simpan" : "Perbarui"}
          </button>
          {componentMode === "edit" && (
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
