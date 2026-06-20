// Seed di verifica: crea un artista demo, carica un brano (WAV generato) e una cover.
// Usa il percorso REALE autenticato (anon key + RLS), come farebbe il frontend.
//   node --env-file=.env scripts/seed-demo.mjs <email> <password>
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const email = process.argv[2];
const password = process.argv[3];
const supabase = createClient(url, key);

// --- genera un WAV PCM 16-bit mono: un accordo breve ---
function makeWav(seconds = 3, freqs = [261.63, 329.63, 392.0]) {
  const rate = 22050;
  const n = seconds * rate;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22); buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate * 2, 28);
  buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    const env = Math.min(1, t * 4) * Math.max(0, 1 - t / seconds);
    let s = 0;
    for (const f of freqs) s += Math.sin(2 * Math.PI * f * t);
    const v = Math.round((s / freqs.length) * env * 12000);
    buf.writeInt16LE(v, 44 + i * 2);
  }
  return buf;
}

const run = async () => {
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
  if (authErr) throw authErr;
  const uid = auth.user.id;
  console.log("Loggato come", uid);

  await supabase.from("profiles").update({
    slug: "marta-lo-russo",
    nome_arte: "Marta Lo Russo",
    citta: "Napoli",
    genere: "Cantautorato",
    bio: "Voce graffiante da Napoli, testi che parlano di quartiere e di sogni.\nQuesto è il mio primo EP, registrato in cameretta.",
    links: { instagram: "https://instagram.com/marta", spotify: "https://open.spotify.com" },
  }).eq("id", uid);

  const wav = makeWav();
  const audioPath = `${uid}/${Date.now()}-demo.wav`;
  const up = await supabase.storage.from("tracks").upload(audioPath, wav, { contentType: "audio/wav" });
  if (up.error) throw up.error;
  console.log("Audio caricato:", audioPath);

  const { error: insErr } = await supabase.from("tracks").insert([
    { artist_id: uid, titolo: "Quartiere", genere: "Cantautorato", descrizione: "Primo singolo.", audio_path: audioPath, durata_sec: 3 },
    { artist_id: uid, titolo: "Sogni a Forcella", genere: "Cantautorato", audio_path: audioPath, durata_sec: 3 },
  ]);
  if (insErr) throw insErr;
  console.log("Brani inseriti. Fatto.");
};

run().catch((e) => { console.error("ERRORE:", e.message ?? e); process.exit(1); });
