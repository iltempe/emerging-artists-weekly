import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { TrackPublic } from "../lib/types";
import { useAuth } from "../context/AuthContext";
import TrackCard from "../components/TrackCard";
import Spinner from "../components/Spinner";

export default function Home() {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<TrackPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("tracks_public")
      .select("*")
      .eq("pubblicato", true)
      .order("created_at", { ascending: false })
      .limit(60)
      .then(({ data }) => {
        setTracks((data as TrackPublic[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {!user && (
        <section className="mb-10 rounded-3xl bg-gradient-to-br from-accent/25 via-surface to-bg p-8 sm:p-12">
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            La musica dei cantautori emergenti, senza algoritmi.
          </h1>
          <p className="mt-3 max-w-xl text-dim">
            OpenStage è la piattaforma open-source dove pubblichi i tuoi brani,
            costruisci la tua pagina e fai ascoltare la tua musica. Gratis, per sempre.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/signup" className="btn-primary px-5 py-3">
              Pubblica la tua musica
            </Link>
            <a
              href="https://github.com/iltempe/emerging-artists-weekly"
              target="_blank"
              rel="noopener"
              className="btn-ghost px-5 py-3"
            >
              ★ Progetto open source
            </a>
          </div>
        </section>
      )}

      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-xl font-bold">Ultimi brani</h2>
      </div>

      {loading ? (
        <Spinner />
      ) : tracks.length === 0 ? (
        <div className="rounded-2xl bg-surface p-10 text-center text-dim">
          <p className="mb-3 text-lg font-semibold text-[#f3f3f6]">
            Ancora nessun brano.
          </p>
          <p className="mb-5">Sii il primo a pubblicare la tua musica su OpenStage.</p>
          <Link to="/signup" className="btn-primary">
            Inizia ora
          </Link>
        </div>
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
