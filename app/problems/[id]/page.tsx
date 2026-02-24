"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProblemById, Problem } from "@/lib/problems";

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = use(params);

  useEffect(() => {
    const fetchProblem = async () => {
      const data = await getProblemById(id);
      setProblem(data);
      setLoading(false);
    };
    fetchProblem();
  }, [id]);

  if (loading) {
    return (
      <section className="flex flex-1 flex-col bg-zinc-100 px-10 py-12">
        <div className="text-center py-12">
          <p className="text-zinc-600">Memuat soal...</p>
        </div>
      </section>
    );
  }

  if (!problem) {
    notFound();
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(problem.solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="flex flex-1 flex-col bg-zinc-100 px-10 py-12">
      <Link
        href="/problems"
        className="mb-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        ← Kembali ke daftar soal
      </Link>

      <div className="mx-auto w-full max-w-4xl rounded-lg bg-white px-12 py-10 shadow-sm">
        <h2 className="border-b-2 border-zinc-900 pb-3 text-center text-2xl font-semibold text-zinc-900">
          {problem.title}
        </h2>

        <div className="mb-6 mt-6 border-l-4 border-zinc-500 bg-zinc-50 p-4 font-mono text-sm text-zinc-700">
          <div>Time limit: {problem.timeLimit}</div>
          <div>Memory limit: {problem.memoryLimit}</div>
        </div>

        <div className="space-y-6 text-zinc-800">
          <div>
            <h3 className="mb-3 mt-8 text-base font-semibold uppercase tracking-wide text-zinc-900">
              Deskripsi
            </h3>
            <div className="whitespace-pre-line leading-relaxed">
              {problem.description}
            </div>
          </div>

          {problem.constraints && (
            <div>
              <h3 className="mb-3 mt-8 text-base font-semibold uppercase tracking-wide text-zinc-900">
                Batasan
              </h3>
              <p className="whitespace-pre-line leading-relaxed">
                {problem.constraints}
              </p>
            </div>
          )}

          <div>
            <h3 className="mb-3 mt-8 text-base font-semibold uppercase tracking-wide text-zinc-900">
              Masukan
            </h3>
            <p className="whitespace-pre-line leading-relaxed">
              {problem.input}
            </p>
          </div>

          <div>
            <h3 className="mb-3 mt-8 text-base font-semibold uppercase tracking-wide text-zinc-900">
              Keluaran
            </h3>
            <p className="leading-relaxed">{problem.output}</p>
          </div>

          {problem.examples.map((example, index) => (
            <div key={index}>
              <h3 className="mb-3 mt-8 text-base font-semibold uppercase tracking-wide text-zinc-900">
                Contoh Masukan {index + 1}
              </h3>
              <div className="inline-block rounded bg-zinc-100 px-4 py-3 font-mono text-sm">
                {example.input}
              </div>

              <h3 className="mb-3 mt-6 text-base font-semibold uppercase tracking-wide text-zinc-900">
                Contoh Keluaran {index + 1}
              </h3>
              <div className="inline-block rounded bg-zinc-100 px-4 py-3 font-mono text-sm">
                {example.output}
              </div>

              {example.explanation && (
                <>
                  <h3 className="mb-3 mt-6 text-base font-semibold uppercase tracking-wide text-zinc-900">
                    Penjelasan Contoh {index + 1}
                  </h3>
                  <p className="leading-relaxed">{example.explanation}</p>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-8">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            {showSolution ? "Sembunyikan Solusi" : "Lihat Solusi"}
          </button>

          {showSolution && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold uppercase tracking-wide text-zinc-900">
                  Solusi
                </h3>
                <button
                  onClick={handleCopy}
                  className="rounded bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-300"
                >
                  {copied ? "✓ Tersalin!" : "Salin Kode"}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-5 text-sm text-zinc-100">
                <code>{problem.solution}</code>
              </pre>

              <div className="mt-6 rounded-lg border-2 border-zinc-200 bg-zinc-50 p-4">
                <h3 className="text-base font-semibold uppercase tracking-wide text-zinc-900">
                  Video Tutorial
                </h3>
                {problem.youtubeLink ? (
                  <div className="mt-4">
                    {(() => {
                      const url = problem.youtubeLink;
                      let videoId = "";

                      // Extract video ID from various YouTube URL formats
                      if (url.includes("watch?v=")) {
                        videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
                      } else if (url.includes("youtu.be/")) {
                        videoId =
                          url.split("youtu.be/")[1]?.split("?")[0] || "";
                      } else if (url.includes("embed/")) {
                        videoId = url.split("embed/")[1]?.split("?")[0] || "";
                      }

                      if (!videoId) {
                        return (
                          <div className="text-sm text-zinc-600">
                            <p>Link video tidak valid: {url}</p>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block text-blue-600 hover:underline"
                            >
                              Buka di YouTube →
                            </a>
                          </div>
                        );
                      }

                      const embedUrl = `https://www.youtube.com/embed/${videoId}`;

                      return (
                        <>
                          <iframe
                            width="100%"
                            height="315"
                            src={embedUrl}
                            title="Video Tutorial"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                          ></iframe>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-block text-sm text-blue-600 hover:underline"
                          >
                            Buka di YouTube →
                          </a>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-zinc-600">
                    Video tutorial belum tersedia
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
