"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [totalVisitors, setTotalVisitors] = useState<number>(0);
  const [todayVisitors, setTodayVisitors] = useState<number>(0);
  const [weeklyVisitors, setWeeklyVisitors] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const response = await fetch("/api/visitors");
        const data = await response.json();
        if (data.success) {
          setTotalVisitors(data.totalVisitors);
          setTodayVisitors(data.todayVisitors);
          setWeeklyVisitors(data.weeklyVisitors);
        }
      } catch (error) {
        console.error("Error tracking visitor:", error);
      } finally {
        setLoading(false);
      }
    };

    trackVisitor();
  }, []);

  return (
    <>
      <section className="flex flex-1 flex-col bg-zinc-100 px-6 py-8 md:px-10 md:py-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Welcome
              </p>
              <div className="text-xs text-zinc-400">
                {loading ? (
                  <span className="inline-block h-4 w-20 animate-pulse rounded bg-zinc-200"></span>
                ) : (
                  <>
                    <span className="font-medium">Visitors this week:</span>{" "}
                    <span className="font-mono font-semibold text-zinc-600">
                      {weeklyVisitors.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-zinc-900">
              C/C++ Stuff
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600">
              Disini ku bakalan upload soal-soal kemarin buat latihan beserta
              solusi yang sudah di acc ya ges, semoga bisa membantu kalian buat
              latihan dan belajar lebih baik lagi. Jangan lupa buat latihan
              terus ya, biar makin jago! Semangatttt!
            </p>
            <p
              className="text-blue-600 mt-2 text-xs
            opacity-50 transition hover:opacity-100"
            >
              Ada fitur baru di "Your IPK" buat bantu kalian ngitung IPK dan
              prediksi dapet A/AB berdasarkan nilai yang udah kalian dapetin!
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <h2 className="mb-3 text-base font-semibold text-zinc-900">
                Practice Sites Recommendation
              </h2>
              <ul className="space-y-2.5 text-sm text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-zinc-400">•</span>
                  <span>
                    Goated C/C++ Practice Site:{" "}
                    <a
                      className="font-medium text-blue-600 underline decoration-blue-200 transition hover:decoration-blue-600"
                      href="https://tlx.toki.id/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Toki/TLX
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-zinc-400">•</span>
                  <span>
                    Practice job interview problems:{" "}
                    <a
                      className="font-medium text-blue-600 underline decoration-blue-200 transition hover:decoration-blue-600"
                      href="https://leetcode.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LeetCode
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-zinc-400">•</span>
                  <span>
                    Game-like problem solving:{" "}
                    <a
                      className="font-medium text-blue-600 underline decoration-blue-200 transition hover:decoration-blue-600"
                      href="https://www.codedex.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Codedex
                    </a>{" "}
                    &{" "}
                    <a
                      className="font-medium text-blue-600 underline decoration-blue-200 transition hover:decoration-blue-600"
                      href="https://codecombat.com/play"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      CodeCombat
                    </a>
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <h2 className="mb-3 text-base font-semibold text-zinc-900">
                YouTube Recommendations
              </h2>
              <ul className="space-y-2.5 text-sm text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-zinc-400">•</span>
                  <span>
                    C++ Beginner Course:{" "}
                    <a
                      className="font-medium text-blue-600 underline decoration-blue-200 transition hover:decoration-blue-600"
                      href="https://youtube.com/playlist?list=PLZS-MHyEIRo4Ze0bbGB1WKBSNMPzi-eWI&si=L4gSpZrWprSAVc7w"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Kelas Terbuka
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-zinc-400">•</span>
                  <span>
                    C++ OOP:{" "}
                    <a
                      className="font-medium text-blue-600 underline decoration-blue-200 transition hover:decoration-blue-600"
                      href="https://youtube.com/playlist?list=PL43pGnjiVwgTJg7uz8KUGdXRdGKE0W_jN&si=bVvdxQXFOE_SAvev"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Code Beauty
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-zinc-400">•</span>
                  <span>
                    C++ Crash Course:{" "}
                    <a
                      className="font-medium text-blue-600 underline decoration-blue-200 transition hover:decoration-blue-600"
                      href="https://youtu.be/-TkoO8Z07hI?si=67vVwUO9s46Vy--X"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      BroCode
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <Link
            href="/problems"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:scale-105"
          >
            <span>Lihat soal-soal</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Total page views counter - fixed bottom right */}
      <div className="fixed bottom-4 right-4 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 shadow-sm">
        {loading ? (
          <span className="inline-block h-3 w-24 animate-pulse rounded bg-zinc-200"></span>
        ) : (
          <>
            <span className="text-zinc-500">Total visitors:</span>{" "}
            <span className="ml-1 font-mono font-semibold">
              {totalVisitors.toLocaleString()}
            </span>
          </>
        )}
      </div>
    </>
  );
}
