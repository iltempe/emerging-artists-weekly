import { Link } from "react-router-dom";
import type { TrackPublic } from "../lib/types";
import { usePlayer } from "../context/PlayerContext";
import { compact } from "../lib/utils";
import LikeButton from "./LikeButton";

export default function TrackCard({ track }: { track: TrackPublic }) {
  const { current, isPlaying, play, toggle } = usePlayer();
  const active = current?.id === track.id;
  const showPause = active && isPlaying;

  return (
    <div className="card group overflow-hidden">
      <div className="relative aspect-square bg-elev">
        {track.cover_url ? (
          <img src={track.cover_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-accent/30 to-bg text-3xl">
            🎵
          </div>
        )}
        <button
          onClick={() => (active ? toggle() : play(track))}
          aria-label={showPause ? "Pausa" : "Riproduci"}
          className="absolute bottom-2 right-2 grid h-11 w-11 place-items-center rounded-full bg-accent text-white shadow-lg shadow-accent/40 transition active:scale-95"
        >
          {showPause ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      <div className="p-3">
        <div className="truncate font-semibold leading-tight">{track.titolo}</div>
        <Link
          to={track.artist_slug ? `/@${track.artist_slug}` : "#"}
          className="truncate text-sm text-dim hover:text-[#f3f3f6]"
        >
          {track.artist_nome}
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-dim">▶ {compact(track.plays)} ascolti</span>
          <LikeButton trackId={track.id} initial={track.likes} />
        </div>
      </div>
    </div>
  );
}
