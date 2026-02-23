"use client";

import { useState } from "react";
import ProblemCard from "@/components/ProblemCard";
import { problemsData } from "@/lib/problems-data";

type DifficultyFilter = "all" | "easy" | "medium" | "hard";

const allProblems = Object.values(problemsData).map((problem) => ({
  id: problem.id,
  title: problem.title,
  description: problem.description,
  timeLimit: problem.timeLimit,
  memoryLimit: problem.memoryLimit,
  difficulty: problem.difficulty,
}));

export default function ProblemsPage() {
  const [filter, setFilter] = useState<DifficultyFilter>("all");

  const filteredProblems =
    filter === "all"
      ? allProblems
      : allProblems.filter((p) => p.difficulty === filter);

  return (
    <section className="flex flex-1 flex-col gap-8 bg-zinc-100 px-10 py-12">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
          Practice
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">
          C++ Problems
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-600">
          Latihan soal C++ untuk meningkatkan pemahaman konsep dasar
          pemrograman. Klik pada kartu untuk melihat detail soal lengkap.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          All ({allProblems.length})
        </button>
        <button
          onClick={() => setFilter("easy")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            filter === "easy"
              ? "bg-green-600 text-white"
              : "bg-white text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          Easy ({allProblems.filter((p) => p.difficulty === "easy").length})
        </button>
        <button
          onClick={() => setFilter("medium")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            filter === "medium"
              ? "bg-yellow-600 text-white"
              : "bg-white text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          Medium ({allProblems.filter((p) => p.difficulty === "medium").length})
        </button>
        <button
          onClick={() => setFilter("hard")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            filter === "hard"
              ? "bg-red-600 text-white"
              : "bg-white text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          Hard ({allProblems.filter((p) => p.difficulty === "hard").length})
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProblems.map((problem) => (
          <ProblemCard key={problem.id} {...problem} />
        ))}
      </div>
    </section>
  );
}
