import { supabase } from "./supabase";

/** Converte una stringa in slug URL-safe. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** Formatta i secondi in m:ss. */
export function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Numeri compatti (1.2k). */
export function compact(n: number): string {
  return Intl.NumberFormat("it", { notation: "compact" }).format(n ?? 0);
}

// ---- anti-spam like/play via localStorage ----
const KEY = "openstage_events";
function readEvents(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
export function hasEvent(trackId: string, tipo: "play" | "like"): boolean {
  return !!readEvents()[`${trackId}_${tipo}`];
}
export function markEvent(trackId: string, tipo: "play" | "like"): void {
  const data = readEvents();
  data[`${trackId}_${tipo}`] = Date.now();
  localStorage.setItem(KEY, JSON.stringify(data));
}

/** Registra un evento anonimo (una volta per device grazie a localStorage). */
export async function trackEvent(trackId: string, tipo: "play" | "like"): Promise<boolean> {
  if (hasEvent(trackId, tipo)) return false;
  markEvent(trackId, tipo);
  const { error } = await supabase.from("track_events").insert({ track_id: trackId, tipo });
  if (error) console.warn("track_event", error.message);
  return true;
}
