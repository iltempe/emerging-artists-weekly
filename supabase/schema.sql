-- =========================================================
-- OpenStage — schema di riferimento (Supabase / PostgreSQL)
-- Già applicato sul progetto via migrazioni. Qui per chi
-- vuole ricreare il backend da zero su un proprio progetto.
-- =========================================================

-- ---------- profiles (1:1 con auth.users) ----------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  slug text unique,
  nome_arte text not null default 'Nuovo artista',
  bio text,
  citta text,
  genere text,
  avatar_url text,
  links jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- tracks ----------
create table tracks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references profiles(id) on delete cascade,
  titolo text not null,
  descrizione text,
  audio_path text not null,
  cover_url text,
  genere text,
  durata_sec integer,
  pubblicato boolean not null default true,
  created_at timestamptz default now()
);
create index tracks_artist_id_idx on tracks(artist_id);
create index tracks_created_at_idx on tracks(created_at desc);

-- ---------- eventi anonimi (play / like) ----------
create table track_events (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references tracks(id) on delete cascade,
  tipo text not null check (tipo in ('play', 'like')),
  created_at timestamptz default now()
);
create index track_events_track_id_idx on track_events(track_id);

-- ---------- view pubblica con contatori ----------
create view tracks_public with (security_invoker = on) as
select
  t.*,
  p.slug       as artist_slug,
  p.nome_arte  as artist_nome,
  p.avatar_url as artist_avatar,
  count(e.id) filter (where e.tipo = 'play') as plays,
  count(e.id) filter (where e.tipo = 'like') as likes
from tracks t
join profiles p on p.id = t.artist_id
left join track_events e on e.track_id = t.id
group by t.id, p.slug, p.nome_arte, p.avatar_url;

-- ---------- trigger: crea profilo alla registrazione ----------
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome_arte)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome_arte', split_part(new.email, '@', 1)));
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profiles_updated_at
  before update on profiles for each row execute function set_updated_at();

-- =========================================================
-- RLS
-- =========================================================
alter table profiles enable row level security;
create policy "profiles_select_public" on profiles for select using (true);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

alter table tracks enable row level security;
create policy "tracks_select_public" on tracks for select using (pubblicato = true or artist_id = auth.uid());
create policy "tracks_insert_own" on tracks for insert with check (artist_id = auth.uid());
create policy "tracks_update_own" on tracks for update using (artist_id = auth.uid()) with check (artist_id = auth.uid());
create policy "tracks_delete_own" on tracks for delete using (artist_id = auth.uid());

alter table track_events enable row level security;
create policy "events_insert_anon" on track_events for insert with check (tipo in ('play', 'like'));
create policy "events_select_public" on track_events for select using (true);

-- =========================================================
-- Storage: bucket pubblici, scrittura nella cartella <uid>/...
-- =========================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('tracks',  'tracks',  true, 26214400, array['audio/mpeg','audio/mp3','audio/wav','audio/x-wav','audio/ogg']),
  ('avatars', 'avatars', true, 5242880,  array['image/png','image/jpeg','image/webp']),
  ('covers',  'covers',  true, 5242880,  array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;

-- Per ogni bucket: lettura pubblica + insert/update/delete nella propria cartella.
-- (vedi le policy complete nelle migrazioni del progetto)
