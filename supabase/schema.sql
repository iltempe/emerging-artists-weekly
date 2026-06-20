-- =========================================================
--  Contatori ascolti/like (OPZIONALE)
--  Esegui questo nell'SQL Editor del tuo progetto Supabase
--  SOLO se vuoi attivare i contatori. Una sola tabella, niente login.
-- =========================================================

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  track_id text not null,                 -- l'id del brano dal tuo site.config.ts
  tipo text not null check (tipo in ('play', 'like')),
  created_at timestamptz default now()
);
create index if not exists events_track_id_idx on events(track_id);

-- Sicurezza: chiunque può inserire un evento (anonimo) e leggere i conteggi.
alter table events enable row level security;

create policy "insert anonimo" on events
  for insert with check (tipo in ('play', 'like'));

create policy "lettura pubblica" on events
  for select using (true);

-- Vista con i totali per brano.
create or replace view event_counts with (security_invoker = on) as
select
  track_id,
  count(*) filter (where tipo = 'play') as plays,
  count(*) filter (where tipo = 'like') as likes
from events
group by track_id;

-- Fatto! Copia Project URL e anon key in site.config.ts (campo analytics)
-- oppure nelle variabili d'ambiente VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
