import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Profile, TrackPublic } from "../lib/types";
import TrackCard from "../components/TrackCard";
import Spinner from "../components/Spinner";

const LINK_LABELS: Record<string, string> = {
  instagram: "Instagram",
  spotify: "Spotify",
  youtube: "YouTube",
  bandcamp: "Bandcamp",
  website: "Sito",
};

export default function ArtistPage() {
  const { handle } = useParams<{ handle: string }>();
  const slug = (handle ?? "").replace(/^@/, "");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tracks, setTracks] = useState<TrackPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!prof) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setProfile(prof as Profile);
      const { data: tr } = await supabase
        .from("tracks_public")
        .select("*")
        .eq("artist_id", (prof as Profile).id)
        .eq("pubblicato", true)
        .order("created_at", { ascending: false });
      setTracks((tr as TrackPublic[]) ?? []);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <Spinner />;
  if (notFound || !profile)
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-dim">
        <p className="text-lg font-semibold text-[#f3f3f6]">Artista non trovato</p>
        <Link to="/" className="mt-4 inline-block text-accent-soft">
          Torna all'esplora
        </Link>
      </div>
    );

  const links = Object.entries(profile.links || {}).filter(([, v]) => !!v);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full bg-elev">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-4xl">🎤</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight">{profile.nome_arte}</h1>
          <p className="mt-1 text-sm text-accent-soft">
            {[profile.genere, profile.citta].filter(Boolean).join(" • ")}
          </p>
          {profile.bio && (
            <p className="mt-3 max-w-2xl whitespace-pre-line text-dim">{profile.bio}</p>
          )}
          {links.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {links.map(([k, v]) => (
                <a
                  key={k}
                  href={v as string}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full bg-elev px-3 py-1.5 text-xs font-semibold text-[#f3f3f6] hover:bg-elev/70"
                >
                  {LINK_LABELS[k] ?? k} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 className="mb-5 mt-10 text-xl font-bold">
        Brani {tracks.length > 0 && <span className="text-dim">({tracks.length})</span>}
      </h2>
      {tracks.length === 0 ? (
        <p className="rounded-2xl bg-surface p-8 text-center text-dim">
          {profile.nome_arte} non ha ancora pubblicato brani.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tracks.map((t) => (
            <TrackCard key={t.id} track={t} />
          ))}
        </div>
      )}
    </div>
  );
}
