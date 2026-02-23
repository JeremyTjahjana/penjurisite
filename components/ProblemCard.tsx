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
  return (
    <Link href={`/problems/${id}`}>
      <div className="group cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${difficultyStyles[difficulty]}`}
          >
            {difficultyLabels[difficulty]}
          </span>
        </div>

        <h3 className="border-b-2 border-zinc-900 pb-3 text-center text-xl font-semibold text-zinc-900">
          {title}
        </h3>

        <div className="mb-4 mt-4 border-l-4 border-zinc-500 bg-zinc-50 p-3 font-mono text-xs text-zinc-700">
          <div>Time limit: {timeLimit}</div>
          <div>Memory limit: {memoryLimit}</div>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600">
          {description}
        </p>

        <div className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">
          View problem →
        </div>
      </div>
    </Link>
  );
}
