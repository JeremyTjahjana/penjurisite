import type { ComponentItem } from "@/lib/gpa-actions";

interface ScoreInputSectionProps {
  components: ComponentItem[];
  scoreInputs: Record<string, string>;
  onScoreChange: (componentId: string, value: string) => void;
  onScoreBlur: (componentId: string) => void;
}

export default function ScoreInputSection({
  components,
  scoreInputs,
  onScoreChange,
  onScoreBlur,
}: ScoreInputSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Input Nilai
        </h3>
        <p className="mt-2 text-sm text-zinc-600">
          Isi nilai per komponen. Perhitungan akan tersimpan otomatis saat
          keluar dari input.
        </p>
      </div>

      {components.length === 0 ? (
        <p className="border-t border-zinc-200 pt-4 text-sm text-zinc-500">
          Tambahkan komponen terlebih dahulu.
        </p>
      ) : (
        <div className="space-y-0 border-t border-zinc-200 pt-2">
          {components.map((component) => (
            <div
              key={component.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 py-3"
            >
              <div>
                <p className="text-sm font-medium text-zinc-950">
                  {component.name}
                </p>
                <p className="text-xs text-zinc-500">
                  Bobot {component.weight}%
                </p>
              </div>
              <input
                type="number"
                min={0}
                max={100}
                value={scoreInputs[component.id] ?? ""}
                onChange={(e) => onScoreChange(component.id, e.target.value)}
                onBlur={() => onScoreBlur(component.id)}
                className="w-28 border-b border-zinc-300 bg-transparent px-0 py-2 text-sm outline-none focus:border-zinc-950"
                placeholder="0-100"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
