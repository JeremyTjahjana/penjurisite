import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Problems", href: "/problems" },
];

export default function AppSidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white md:w-64">
      <div className="px-5 py-6">
        <div className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
          C/C++
        </div>
        <div className="mt-2 text-2xl font-semibold text-zinc-900">
          Dashboard
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-2 px-3 pb-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-zinc-200 px-5 py-4 text-xs text-zinc-500">
        Gunakan dengan bijak ya!
      </div>
    </aside>
  );
}
