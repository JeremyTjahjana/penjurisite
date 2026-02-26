interface CourseFormProps {
  courseForm: { name: string; sks: string };
  courseMode: "create" | "edit";
  onFormChange: (updates: Partial<{ name: string; sks: string }>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function CourseForm({
  courseForm,
  courseMode,
  onFormChange,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm backdrop-blur">
      <h3 className="text-sm font-semibold text-zinc-900">
        {courseMode === "create" ? "Tambah Mata Kuliah" : "Edit Mata Kuliah"}
      </h3>
      <div className="mt-4 space-y-3">
        <div>
          <label className="text-xs font-semibold text-zinc-600">
            Nama Mata Kuliah
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
            value={courseForm.name}
            onChange={(e) => onFormChange({ name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-600">SKS</label>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
            value={courseForm.sks}
            min={1}
            onChange={(e) => onFormChange({ sks: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSubmit}
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {courseMode === "create" ? "Simpan" : "Perbarui"}
          </button>
          {courseMode === "edit" && (
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
