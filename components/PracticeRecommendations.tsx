export function PracticeRecommendations() {
  const sites = [
    {
      label: "Goated C/C++ Practice Site",
      name: "Toki/TLX",
      url: "https://tlx.toki.id/",
    },
    {
      label: "Practice job interview problems",
      name: "LeetCode",
      url: "https://leetcode.com/",
    },
    {
      label: "Game-like problem solving",
      name: "Codedex",
      url: "https://www.codedex.io/",
    },
  ];

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <h2 className="mb-3 text-sm font-semibold text-zinc-900 md:text-base">
        Practice Sites Recommendation
      </h2>
      <ul className="space-y-2.5 text-xs text-zinc-600 md:text-sm">
        {sites.map((site) => (
          <li key={site.url} className="flex items-start gap-2">
            <span className="mt-0.5 text-zinc-400">•</span>
            <span>
              {site.label}:{" "}
              <a
                className="font-medium text-blue-600 underline decoration-blue-200 transition hover:decoration-blue-600"
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.name}
              </a>
            </span>
          </li>
        ))}
        <li className="flex items-start gap-2">
          <span className="mt-0.5 text-zinc-400">•</span>
          <span>
            Game-like problem solving:{" "}
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
  );
}
