import Link from "next/link";

export function ViewProblemsButton() {
  return (
    <Link
      href="/problems"
      className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 hover:scale-105 md:px-5 md:py-2.5 md:text-sm"
    >
      <span>Lihat soal-soal</span>
      <span>→</span>
    </Link>
  );
}
