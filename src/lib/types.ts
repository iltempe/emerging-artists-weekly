export interface ProfileLinks {
  instagram?: string;
  spotify?: string;
  youtube?: string;
  bandcamp?: string;
  website?: string;
}

export interface Profile {
  id: string;
  slug: string | null;
  nome_arte: string;
  bio: string | null;
  citta: string | null;
  genere: string | null;
  avatar_url: string | null;
  links: ProfileLinks;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  artist_id: string;
  titolo: string;
  descrizione: string | null;
  audio_path: string;
  cover_url: string | null;
  genere: string | null;
  durata_sec: number | null;
  pubblicato: boolean;
  created_at: string;
}

/** Riga della view `tracks_public` (brano + dati artista + contatori). */
export interface TrackPublic extends Track {
  artist_slug: string | null;
  artist_nome: string;
  artist_avatar: string | null;
  plays: number;
  likes: number;
}
