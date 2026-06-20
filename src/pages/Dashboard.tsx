import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { Track } from "../lib/types";
import ProfileForm from "../components/ProfileForm";
import UploadTrackForm from "../components/UploadTrackForm";
import MyTracks from "../components/MyTracks";
import Spinner from "../components/Spinner";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("tracks")
      .select("*")
      .eq("artist_id", user.id)
      .order("created_at", { ascending: false });
    setTracks((data as Track[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Studio</h1>
        {profile?.slug && (
          <Link to={`/@${profile.slug}`} className="btn-ghost text-sm">
            Vedi pagina pubblica ↗
          </Link>
        )}
      </div>

      <div className="space-y-8">
        <ProfileForm />
        <UploadTrackForm onDone={load} />
        <section>
          <h2 className="mb-4 text-lg font-bold">I tuoi brani</h2>
          {loading ? <Spinner /> : <MyTracks tracks={tracks} onChange={load} />}
        </section>
      </div>
    </div>
  );
}
