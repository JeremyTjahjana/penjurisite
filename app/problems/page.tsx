"use client";

import { useState, useEffect } from "react";
import ProblemCard from "@/components/ProblemCard";
import { getAllProblems, Problem } from "@/lib/problems";

type DifficultyFilter = "all" | "easy" | "medium" | "hard";

export default function ProblemsPage() {
  const [filter, setFilter] = useState<DifficultyFilter>("all");
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      const problems = await getAllProblems();
      setAllProblems(problems);
      setLoading(false);
    };
    fetchProblems();
  }, []);

  const filteredProblems =
    filter === "all"
      ? allProblems
      : allProblems.filter((p) => p.difficulty === filter);

  return (
    <section className="flex flex-1 flex-col bg-zinc-100 px-6 py-8 md:px-10 md:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Practice
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            C++ Problems
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Latihan soal C++ untuk meningkatkan pemahaman konsep pemrograman
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
              filter === "all"
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
            }`}
          >
            All {allProblems.length > 0 && `(${allProblems.length})`}
          </button>
          <button
            onClick={() => setFilter("easy")}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
              filter === "easy"
                ? "bg-green-600 text-white"
                : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
            }`}
          >
            Easy ({allProblems.filter((p) => p.difficulty === "easy").length})
          </button>
          <button
            onClick={() => setFilter("medium")}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
              filter === "medium"
                ? "bg-yellow-600 text-white"
                : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
            }`}
          >
            Medium (
            {allProblems.filter((p) => p.difficulty === "medium").length})
          </button>
          <button
            onClick={() => setFilter("hard")}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
              filter === "hard"
                ? "bg-red-600 text-white"
                : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
            }`}
          >
            Hard ({allProblems.filter((p) => p.difficulty === "hard").length})
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <svg
                className="mb-3 h-8 w-8 animate-spin text-zinc-400"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-sm text-zinc-600">Memuat soal...</p>
            </div>
          ) : filteredProblems.length > 0 ? (
            filteredProblems.map((problem) => (
              <ProblemCard key={problem.id} {...problem} />
            ))
          ) : (
            <div className="col-span-full rounded-lg border border-dashed border-zinc-300 bg-zinc-50 py-16 text-center">
              <p className="text-sm text-zinc-600">Tidak ada soal ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
