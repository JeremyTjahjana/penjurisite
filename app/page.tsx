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
      <section className="flex flex-1 flex-col gap-8 px-10 py-12">
        <div>
          <div className="mb-4 flex items-center gap-4">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
              Welcome
            </p>
            <div className="text-xs text-zinc-400">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  Visitors this week:{" "}
                  <span className="font-mono font-semibold">
                    {weeklyVisitors.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-900">
            C/C++ Stuff
          </h1>
          <p className="mt-3 max-w-2xl text-base text-zinc-600">
            Disini ku bakalan upload soal-soal kemarin buat latihan beserta
            solusi yang sudah di acc ya ges, semoga bisa membantu kalian buat
            latihan dan belajar lebih baik lagi. Jangan lupa buat latihan terus
            ya, biar makin jago! Semangatttt!
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              Practice sites Recomendation!
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>
                Goated C/C++ Practice Site:{" "}
                <span>
                  {" "}
                  <a
                    className="underline text-blue-600"
                    href="https://tlx.toki.id/"
                  >
                    Toki/TLX
                  </a>{" "}
                </span>
              </li>
              <li>
                Practice job interview problems{" "}
                <span>
                  {" "}
                  <a
                    className="underline text-blue-600"
                    href="https://leetcode.com/"
                  >
                    LeetCode
                  </a>{" "}
                </span>
              </li>
              <li>
                Game like problem solving sites:{" "}
                <span>
                  {" "}
                  <a
                    className="underline text-blue-600"
                    href="https://www.codedex.io/"
                  >
                    Codedex dan
                  </a>{" "}
                  <a
                    className="underline text-blue-600"
                    href="https://www.https://codecombat.com/play.io/"
                  >
                    CodeCombat
                  </a>{" "}
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              Youtube Recommendations!
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>
                C++ Beginner Course:{" "}
                <span>
                  {" "}
                  <a
                    className="underline text-blue-600"
                    href="https://youtube.com/playlist?list=PLZS-MHyEIRo4Ze0bbGB1WKBSNMPzi-eWI&si=L4gSpZrWprSAVc7w"
                  >
                    Kelas Terbuka
                  </a>{" "}
                </span>
              </li>
              <li>
                C++ OOP :{" "}
                <span>
                  {" "}
                  <a
                    className="underline text-blue-600"
                    href="https://youtube.com/playlist?list=PL43pGnjiVwgTJg7uz8KUGdXRdGKE0W_jN&si=bVvdxQXFOE_SAvev"
                  >
                    Code Beauty
                  </a>{" "}
                </span>
              </li>
              <li>
                C++ Crash Course :{" "}
                <span>
                  {" "}
                  <a
                    className="underline text-blue-600"
                    href="https://youtu.be/-TkoO8Z07hI?si=67vVwUO9s46Vy--X"
                  >
                    BroCode
                  </a>{" "}
                </span>
              </li>
            </ul>
          </div>
          <Link
            href="/problems"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 max-w-40"
          >
            Lihat soal-soal →
          </Link>
        </div>
      </section>

      {/* Lifetime visitors counter - fixed bottom right */}
      <div className="fixed bottom-4 right-4 text-xs text-zinc-500">
        {!loading && (
          <>
            Total page views:{" "}
            <span className="font-mono">{totalVisitors.toLocaleString()}</span>
          </>
        )}
      </div>
    </>
  );
}
