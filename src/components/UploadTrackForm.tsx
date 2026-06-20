import { useState, type FormEvent } from "react";
import { supabase, publicUrl } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function readDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const a = document.createElement("audio");
    a.preload = "metadata";
    a.onloadedmetadata = () => resolve(Math.round(a.duration) || null);
    a.onerror = () => resolve(null);
    a.src = URL.createObjectURL(file);
  });
}

const safeName = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, "_");

export default function UploadTrackForm({ onDone }: { onDone: () => void }) {
  const { user } = useAuth();
  const [titolo, setTitolo] = useState("");
  const [genere, setGenere] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user || !audio) return;
    setBusy(true);
    setErr(null);

    try {
      const dur = await readDuration(audio);

      const audioPath = `${user.id}/${Date.now()}-${safeName(audio.name)}`;
      const up = await supabase.storage.from("tracks").upload(audioPath, audio);
      if (up.error) throw up.error;

      let coverUrl: string | null = null;
      if (cover) {
        const coverPath = `${user.id}/${Date.now()}-${safeName(cover.name)}`;
        const cu = await supabase.storage.from("covers").upload(coverPath, cover);
        if (cu.error) throw cu.error;
        coverUrl = publicUrl("covers", coverPath);
      }

      const { error } = await supabase.from("tracks").insert({
        artist_id: user.id,
        titolo,
        genere: genere || null,
        descrizione: descrizione || null,
        audio_path: audioPath,
        cover_url: coverUrl,
        durata_sec: dur,
      });
      if (error) throw error;

      setTitolo("");
      setGenere("");
      setDescrizione("");
      setAudio(null);
      setCover(null);
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Errore durante il caricamento");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <h2 className="text-lg font-bold">Carica un brano</h2>

      <div>
        <label className="label">Titolo</label>
        <input className="input" value={titolo} onChange={(e) => setTitolo(e.target.value)} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">File audio (MP3/WAV/OGG, max 25MB)</label>
          <input
            type="file"
            accept="audio/*"
            className="input cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-elev file:px-3 file:py-1 file:text-[#f3f3f6]"
            onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
            required
          />
        </div>
        <div>
          <label className="label">Copertina (opzionale)</label>
          <input
            type="file"
            accept="image/*"
            className="input cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-elev file:px-3 file:py-1 file:text-[#f3f3f6]"
            onChange={(e) => setCover(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <div>
        <label className="label">Descrizione (opzionale)</label>
        <textarea
          className="input min-h-[70px] resize-y"
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
        />
      </div>

      {err && <p className="text-sm text-like">{err}</p>}
      <button className="btn-primary" disabled={busy || !audio}>
        {busy ? "Caricamento…" : "Pubblica brano"}
      </button>
    </form>
  );
}
