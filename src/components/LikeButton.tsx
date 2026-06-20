import { useState } from "react";
import { analyticsEnabled } from "../lib/analytics";
import { compact, hasLocal, logEvent } from "../lib/utils";

export default function LikeButton({
  trackId,
  initial,
}: {
  trackId: string;
  initial: number;
}) {
  const [count, setCount] = useState(initial);
  const [liked, setLiked] = useState(() => hasLocal(trackId, "like"));

  async function onLike(e: React.MouseEvent) {
    e.stopPropagation();
    if (liked) return;
    setLiked(true);
    setCount((c) => c + 1);
    await logEvent(trackId, "like");
  }

  return (
    <button
      onClick={onLike}
      aria-pressed={liked}
      aria-label="Mi piace"
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition active:scale-95 ${
        liked ? "bg-like/15 text-like" : "bg-elev text-dim hover:text-[#f3f3f6]"
      }`}
    >
      <span className="text-base leading-none">{liked ? "♥" : "♡"}</span>
      {analyticsEnabled && <span className="tabular-nums">{compact(count)}</span>}
    </button>
  );
}
