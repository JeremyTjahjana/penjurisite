import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center bg-zinc-100 px-10 py-12">
      <div className="mx-auto max-w-md rounded-lg bg-white px-12 py-10 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-zinc-900">
          Soal Tidak Ditemukan
        </h2>
        <p className="mt-4 text-zinc-600">
          Maaf, soal yang Anda cari tidak tersedia.
        </p>
        <Link
          href="/problems"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Kembali ke Daftar Soal
        </Link>
      </div>
    </section>
  );
}
