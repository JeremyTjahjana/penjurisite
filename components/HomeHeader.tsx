import { VisitorStats } from "./VisitorStats";

interface HomeHeaderProps {
  weeklyVisitors: number;
  loading: boolean;
}

export function HomeHeader({ weeklyVisitors, loading }: HomeHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Welcome
        </p>
        <VisitorStats weeklyVisitors={weeklyVisitors} loading={loading} />
      </div>
      <h1 className="mt-2 text-2xl font-bold text-zinc-900 md:text-3xl">
        C/C++ Stuff
      </h1>
      <p className="mt-2 max-w-3xl text-xs leading-relaxed text-zinc-600 md:text-sm">
        Disini ku bakalan upload soal-soal kemarin buat latihan beserta solusi
        yang sudah di acc ya ges, semoga bisa membantu kalian buat latihan dan
        belajar lebih baik lagi. Jangan lupa buat latihan terus ya, biar makin
        jago! Semangatttt!
      </p>
      <p className="mt-2 text-[11px] text-blue-600 opacity-50 transition hover:opacity-100 md:text-xs">
        Ada fitur baru di "Your IPK" buat bantu kalian ngitung IPK dan prediksi
        dapet A/AB berdasarkan nilai yang udah kalian dapetin!
      </p>
    </div>
  );
}
