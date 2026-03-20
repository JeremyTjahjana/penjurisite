"use client";

import type { CourseTemplate } from "@/lib/course-templates";

interface CourseTemplatesProps {
  templates: CourseTemplate[];
  onAddTemplate: (templateKey: CourseTemplate["key"]) => void;
  pendingTemplateKey: CourseTemplate["key"] | null;
}

export default function CourseTemplates({
  templates,
  onAddTemplate,
  pendingTemplateKey,
}: CourseTemplatesProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Template Mata Kuliah
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Tambahkan preset bobot ke dashboard dalam satu klik.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {templates.map((template) => {
          const totalWeight = template.components.reduce(
            (sum, component) => sum + component.weight,
            0,
          );
          const isComplete = totalWeight === 100;
          const isPending = pendingTemplateKey === template.key;

          return (
            <div
              key={template.key}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {template.name} {template.sks} SKS
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {template.description}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    isComplete
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  Total {totalWeight}%
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {template.components.map((component) => (
                  <span
                    key={`${template.key}-${component.name}`}
                    className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-[11px] text-zinc-600"
                  >
                    {component.name} {component.weight}%
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <p
                  className={`text-xs ${
                    isComplete ? "text-zinc-500" : "text-amber-700"
                  }`}
                >
                  {isComplete
                    ? "Siap dipakai tanpa edit bobot manual."
                    : "Bobot belum total 100%, cek template ini sebelum dipakai."}
                </p>
                <button
                  onClick={() => onAddTemplate(template.key)}
                  disabled={isPending}
                  className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Menambahkan..." : "Tambah ke dashboard"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
