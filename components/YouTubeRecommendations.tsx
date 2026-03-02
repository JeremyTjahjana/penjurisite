export function YouTubeRecommendations() {
  const videos = [
    {
      label: "C++ Beginner Course",
      channel: "Kelas Terbuka",
      url: "https://youtube.com/playlist?list=PLZS-MHyEIRo4Ze0bbGB1WKBSNMPzi-eWI&si=L4gSpZrWprSAVc7w",
    },
    {
      label: "C++ OOP",
      channel: "Code Beauty",
      url: "https://youtube.com/playlist?list=PL43pGnjiVwgTJg7uz8KUGdXRdGKE0W_jN&si=bVvdxQXFOE_SAvev",
    },
    {
      label: "C++ Crash Course",
      channel: "BroCode",
      url: "https://youtu.be/-TkoO8Z07hI?si=67vVwUO9s46Vy--X",
    },
  ];

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <h2 className="mb-3 text-sm font-semibold text-zinc-900 md:text-base">
        YouTube Recommendations
      </h2>
      <ul className="space-y-2.5 text-xs text-zinc-600 md:text-sm">
        {videos.map((video) => (
          <li key={video.url} className="flex items-start gap-2">
            <span className="mt-0.5 text-zinc-400">•</span>
            <span>
              {video.label}:{" "}
              <a
                className="font-medium text-blue-600 underline decoration-blue-200 transition hover:decoration-blue-600"
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {video.channel}
              </a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
