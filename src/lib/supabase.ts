import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  // Messaggio chiaro per chi clona il repo senza .env
  throw new Error(
    "Mancano VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copia .env.example in .env."
  );
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

/** URL pubblico di un file in uno storage bucket pubblico. */
export function publicUrl(bucket: string, path: string | null | undefined): string {
  if (!path) return "";
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
