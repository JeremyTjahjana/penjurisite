"use client";

import { useState } from "react";
import type { CourseTemplate } from "@/lib/course-templates";

interface CourseCreateModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  courseName: string;
  sks: string;
  templates: CourseTemplate[];
  selectedTemplateKey: string;
  onClose: () => void;
  onCourseNameChange: (value: string) => void;
  onSksChange: (value: string) => void;
  onSelectedTemplateKeyChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export default function CourseCreateModal({
  isOpen,
  mode,
  courseName,
  sks,
  templates,
  selectedTemplateKey,
  onClose,
  onCourseNameChange,
  onSksChange,
  onSelectedTemplateKeyChange,
  onSubmit,
  submitting,
}: CourseCreateModalProps) {
  const [templateSearch, setTemplateSearch] = useState("");

  if (!isOpen) return null;

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(templateSearch.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/45 px-4 py-4 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-3xl border border-zinc-200 bg-white shadow-lg">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
              {mode === "edit" ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-900">
              {mode === "edit"
                ? "Perbarui data mata kuliah"
                : "Buat mata kuliah baru atau pakai template"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-zinc-300 text-lg text-zinc-600 hover:border-zinc-950 hover:bg-zinc-50 hover:text-zinc-950 transition"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1fr_1px_1fr]">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Nama mata kuliah
              </label>
              <input
                className="mt-2 w-full border-b border-zinc-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-zinc-950"
                value={courseName}
                onChange={(e) => onCourseNameChange(e.target.value)}
                placeholder="Contoh: Pemrog"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                SKS
              </label>
              <input
                type="number"
                min={1}
                className="mt-2 w-full border-b border-zinc-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-zinc-950"
                value={sks}
                onChange={(e) => onSksChange(e.target.value)}
                placeholder="3"
              />
            </div>

            <div className="border-t border-zinc-200 pt-3">
              <p className="text-sm font-semibold text-zinc-900">
                Template cepat
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Pilih preset untuk mengisi nama, SKS, dan komponen sekaligus.
              </p>
            </div>
          </div>

          {mode === "create" && (
            <>
              <div className="hidden bg-zinc-100 lg:block" />

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Cari template
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full border-b border-zinc-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-zinc-950"
                    placeholder="Cari nama template..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                  />
                </div>

                <div className="max-h-72 overflow-auto border-t border-zinc-200 pt-3">
                  {filteredTemplates.length === 0 ? (
                    <p className="py-6 text-center text-sm text-zinc-500">
                      Template tidak ditemukan
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {filteredTemplates.map((template) => (
                        <button
                          key={template.key}
                          type="button"
                          onClick={() =>
                            onSelectedTemplateKeyChange(template.key)
                          }
                          className={`w-full border-b px-0 py-3 text-left transition ${
                            selectedTemplateKey === template.key
                              ? "border-zinc-950 text-zinc-950 bg-zinc-50"
                              : "border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 pr-1">
                            <div>
                              <p className="font-semibold">{template.name}</p>
                              <p className="mt-1 text-xs text-zinc-500">
                                {template.description}
                              </p>
                            </div>
                            <span className="text-[11px] font-semibold text-zinc-500">
                              {template.sks} SKS
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-950 transition"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Menyimpan..."
              : mode === "edit"
                ? "Simpan perubahan"
                : "Tambah ke dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
