import { useState, type FormEvent } from "react";
import { supabase, publicUrl } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { slugify } from "../lib/utils";
import type { ProfileLinks } from "../lib/types";

export default function ProfileForm() {
  const { user, profile, refreshProfile } = useAuth();
  const [nomeArte, setNomeArte] = useState(profile?.nome_arte ?? "");
  const [slug, setSlug] = useState(profile?.slug ?? "");
  const [citta, setCitta] = useState(profile?.citta ?? "");
  const [genere, setGenere] = useState(profile?.genere ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [links, setLinks] = useState<ProfileLinks>(profile?.links ?? {});
  const [avatar, setAvatar] = useState(profile?.avatar_url ?? "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function uploadAvatar(file: File) {
    if (!user) return;
    setErr(null);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (error) {
      setErr(error.message);
      return;
    }
    setAvatar(publicUrl("avatars", path));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setErr(null);
    setMsg(null);
    const finalSlug = slugify(slug || nomeArte);
    const { error } = await supabase
      .from("profiles")
      .update({
        nome_arte: nomeArte,
        slug: finalSlug,
        citta: citta || null,
        genere: genere || null,
        bio: bio || null,
        avatar_url: avatar || null,
        links,
      })
      .eq("id", user.id);
    setBusy(false);
    if (error) {
      setErr(
        error.code === "23505"
          ? "Questo indirizzo profilo è già in uso, scegline un altro."
          : error.message
      );
      return;
    }
    setSlug(finalSlug);
    setMsg("Profilo salvato.");
    await refreshProfile();
  }

  const linkField = (key: keyof ProfileLinks, label: string, ph: string) => (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        value={links[key] ?? ""}
        onChange={(e) => setLinks({ ...links, [key]: e.target.value })}
        placeholder={ph}
      />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <h2 className="text-lg font-bold">Il tuo profilo</h2>

      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-elev">
          {avatar ? (
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-2xl">🎤</div>
          )}
        </div>
        <label className="btn-ghost cursor-pointer">
          Cambia foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Nome d'arte</label>
          <input className="input" value={nomeArte} onChange={(e) => setNomeArte(e.target.value)} required />
        </div>
        <div>
          <label className="label">Indirizzo profilo</label>
          <div className="flex items-center gap-1">
            <span className="text-sm text-dim">/@</span>
            <input
              className="input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={slugify(nomeArte) || "il-tuo-nome"}
            />
          </div>
        </div>
        <div>
          <label className="label">Città</label>
          <input className="input" value={citta} onChange={(e) => setCitta(e.target.value)} />
        </div>
        <div>
          <label className="label">Genere</label>
          <input className="input" value={genere} onChange={(e) => setGenere(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label">Bio</label>
        <textarea
          className="input min-h-[90px] resize-y"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Racconta chi sei e cosa canti…"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {linkField("instagram", "Instagram", "https://instagram.com/…")}
        {linkField("spotify", "Spotify", "https://open.spotify.com/artist/…")}
        {linkField("youtube", "YouTube", "https://youtube.com/@…")}
        {linkField("website", "Sito / Bandcamp", "https://…")}
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={busy}>
          {busy ? "Salvataggio…" : "Salva profilo"}
        </button>
        {msg && <span className="text-sm text-accent-soft">{msg}</span>}
        {err && <span className="text-sm text-like">{err}</span>}
      </div>
    </form>
  );
}
