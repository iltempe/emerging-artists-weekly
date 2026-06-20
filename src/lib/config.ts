import { site } from "../../site.config";

export const config = site;

// Le credenziali analytics possono stare nel config oppure nelle env (VITE_*).
// Le env hanno la precedenza, comodo per il deploy senza toccare il config.
const url = import.meta.env.VITE_SUPABASE_URL || site.analytics?.supabaseUrl || "";
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || site.analytics?.supabaseAnonKey || "";

export const analyticsCreds = { url, key };
export const analyticsEnabled = Boolean(url && key);
