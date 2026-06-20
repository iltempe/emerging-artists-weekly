import { supabase } from "../lib/supabase";
import type { Track } from "../lib/types";
import { usePlayer } from "../context/PlayerContext";
import type { TrackPublic } from "../lib/types";
import { useAuth } from "../context/AuthContext";

export default function MyTracks({
  tracks,
  onChange,
}: {
  tracks: Track[];
  onChange: () => void;
}) {
  const { play, current, isPlaying, toggle } = usePlayer();
  const { profile } = useAuth();

  async function remove(t: Track) {
    if (!confirm(`Eliminare "${t.titolo}"? L'operazione è definitiva.`)) return;
    await supabase.storage.from("tracks").remove([t.audio_path]);
    await supabase.from("tracks").delete().eq("id", t.id);
    onChange();
  }

  async function togglePublish(t: Track) {
    await supabase.from("tracks").update({ pubblicato: !t.pubblicato }).eq("id", t.id);
    onChange();
  }

  if (tracks.length === 0)
    return (
      <p className="rounded-2xl bg-surface p-8 text-center text-dim">
        Non hai ancora caricato brani. Usa il modulo qui sopra.
      </p>
    );

  return (
    <div className="card divide-y divide-elev/60">
      {tracks.map((t) => {
        const asPublic = {
          ...t,
          artist_slug: profile?.slug ?? null,
          artist_nome: profile?.nome_arte ?? "",
          artist_avatar: profile?.avatar_url ?? null,
          plays: 0,
          likes: 0,
        } as TrackPublic;
        const active = current?.id === t.id;
        return (
          <div key={t.id} className="flex items-center gap-3 p-3">
            <button
              onClick={() => (active ? toggle() : play(asPublic))}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-elev text-[#f3f3f6]"
              aria-label="Riproduci"
            >
              {active && isPlaying ? "⏸" : "▶"}
            </button>
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{t.titolo}</div>
              <div className="text-xs text-dim">
                {t.pubblicato ? "Pubblico" : "Bozza"}
                {t.genere ? ` • ${t.genere}` : ""}
              </div>
            </div>
            <button onClick={() => togglePublish(t)} className="btn-ghost px-3 py-1.5 text-xs">
              {t.pubblicato ? "Nascondi" : "Pubblica"}
            </button>
            <button
              onClick={() => remove(t)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-like hover:bg-like/10"
            >
              Elimina
            </button>
          </div>
        );
      })}
    </div>
  );
}
