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
    <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Input Nilai
      </h3>

      {components.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">
          Tambahkan komponen terlebih dahulu.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {components.map((component) => (
            <div
              key={component.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-zinc-800">
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
                className="w-28 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-800 focus:outline-none"
                placeholder="0-100"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
