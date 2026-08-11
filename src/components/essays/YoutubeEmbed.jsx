import { useState } from "react";

export default function YoutubeEmbed({ videoId, title }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        {playing ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group block h-full w-full"
          >
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={title}
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#15803d">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-green-800 underline"
        >
          Watch on YouTube ↗
        </a>
      </div>
    </div>
  );
}
