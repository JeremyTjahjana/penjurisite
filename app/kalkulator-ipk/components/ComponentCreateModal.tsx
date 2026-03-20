"use client";

interface ComponentCreateModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  name: string;
  weight: string;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onSubmit: () => void;
}

export default function ComponentCreateModal({
  isOpen,
  mode,
  name,
  weight,
  onClose,
  onNameChange,
  onWeightChange,
  onSubmit,
}: ComponentCreateModalProps) {
  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit();
  };

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
          {mode === "edit" ? "Edit Komponen" : "Tambah Komponen"}
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          {mode === "edit"
            ? "Perbarui nama dan bobot komponen penilaian."
            : "Masukkan nama dan bobot komponen penilaian."}
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-700">
              Nama Komponen
            </label>
            <input
              type="text"
              placeholder="Contoh: UTS, UAS, Praktikum"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="mt-2 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">
              Bobot (%)
            </label>
            <input
              type="number"
              placeholder="Contoh: 30"
              value={weight}
              onChange={(e) => onWeightChange(e.target.value)}
              min={0}
              max={100}
              className="mt-2 w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"
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
            onClick={handleSubmit}
            className="flex-1 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            {mode === "edit" ? "Perbarui" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
