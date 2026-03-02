"use client";

import { useState } from "react";

interface SolutionConfirmationModalProps {
  hints?: string[];
  onConfirm: () => void;
  onCancel: () => void;
  problemTitle: string;
}

export function SolutionConfirmationModal({
  hints = ["", "", ""],
  onConfirm,
  onCancel,
  problemTitle,
}: SolutionConfirmationModalProps) {
  const [viewedHints, setViewedHints] = useState<Set<number>>(new Set());

  const toggleHint = (index: number) => {
    const newViewed = new Set(viewedHints);
    if (newViewed.has(index)) {
      newViewed.delete(index);
    } else {
      newViewed.add(index);
    }
    setViewedHints(newViewed);
  };

  const availableHints = hints.filter((h) => h.trim() !== "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg md:max-w-lg">
        <h2 className="mb-2 text-base font-semibold text-zinc-900 md:text-lg">
          Apakah anda yakin ingin melihat solusi?
        </h2>
        <p className="mb-6 text-xs text-zinc-600 md:text-sm">
          Pastikan anda telah mencoba sendiri terlebih dahulu dengan bantuan
          hints yaaa, nono males :3
        </p>

        {availableHints.length > 0 && (
          <div className="mb-6 space-y-2">
            <p className="text-xs font-medium text-zinc-700 md:text-sm">
              Hints yang tersedia:
            </p>
            <div className="space-y-2">
              {availableHints.map((hint, index) => (
                <button
                  key={index}
                  onClick={() => toggleHint(index)}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-left text-xs text-zinc-900 transition hover:bg-zinc-100 md:text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Hint {index + 1}</span>
                  </div>
                  {viewedHints.has(index) && (
                    <div className="mt-2 border-t border-zinc-200 pt-2 text-zinc-700">
                      {hint}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 md:text-sm"
          >
            oke deh coba lagii..
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-red-700 md:text-sm"
          >
            gbs bg susah, mau liat aja
          </button>
        </div>
      </div>
    </div>
  );
}
