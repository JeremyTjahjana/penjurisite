import Link from "next/link";

interface ProblemCardProps {
  id: string;
  title: string;
  description: string;
  timeLimit: string;
  memoryLimit: string;
  difficulty: "easy" | "medium" | "hard";
}

const difficultyStyles = {
  easy: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  hard: "bg-red-100 text-red-700 border-red-300",
};

const difficultyLabels = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export default function ProblemCard({
  id,
  title,
  description,
  timeLimit,
  memoryLimit,
  difficulty,
}: ProblemCardProps) {
  const problemHref = `/problems/${encodeURIComponent(id)}`;

  return (
    <Link href={problemHref}>
      <div className="group h-full cursor-pointer rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md md:p-5">
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase md:text-xs ${difficultyStyles[difficulty]}`}
          >
            {difficultyLabels[difficulty]}
          </span>
        </div>

        <h3 className="mb-3 text-base font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 md:text-lg">
          {title}
        </h3>

        <div className="mb-3 border-l-2 border-zinc-400 bg-zinc-50 px-3 py-2 font-mono text-[11px] text-zinc-600 md:text-xs">
          <div>Time: {timeLimit}</div>
          <div>Memory: {memoryLimit}</div>
        </div>

        <p className="mb-3 line-clamp-2 text-xs text-zinc-600 md:text-sm">
          {description}
        </p>

        <div className="text-xs font-medium text-blue-600 transition-colors group-hover:text-blue-700">
          Lihat soal →
        </div>
      </div>
    </Link>
  );
}
