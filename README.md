# OpenStage 🎤

**La piattaforma open-source dove i cantautori emergenti pubblicano e promuovono la propria musica.**

Niente algoritmi, niente gatekeeper. Ti registri, carichi i tuoi brani, costruisci la tua pagina pubblica e condividi il link. Gli ascoltatori scoprono, ascoltano e mettono like — in modo anonimo. Gratis, per sempre, e open source.

> Progetto in evoluzione. Nato come MVP, cresce con la community.

---

## ✨ Funzionalità

- **Registrazione libera** per gli artisti (email + password, Supabase Auth)
- **Upload dei brani** (MP3/WAV/OGG) con copertina, direttamente dall'artista
- **Pagina pubblica** per ogni artista: `/@nome-arte` con bio, generi, link social e brani
- **Player audio globale** persistente durante la navigazione
- **Esplora** gli ultimi brani caricati
- **Like e ascolti anonimi** (nessun account richiesto per ascoltare)
- **Studio** personale per gestire profilo e brani (pubblica / nascondi / elimina)

## 🧱 Stack

| Layer | Tecnologia |
|---|---|
| Frontend | React + TypeScript + Vite |
| Stile | Tailwind CSS |
| Auth / DB / Storage | Supabase (PostgreSQL, Auth, Storage) |
| Hosting | Vercel / Netlify (statico) |

## 🚀 Avvio locale

Servono **Node 18+** e un progetto Supabase.

```bash
git clone https://github.com/iltempe/emerging-artists-weekly
cd emerging-artists-weekly
npm install
cp .env.example .env     # inserisci URL e anon key del tuo Supabase
npm run dev              # http://localhost:5173
```

### Configurare Supabase

1. Crea un progetto su [supabase.com](https://supabase.com).
2. Esegui [`supabase/schema.sql`](supabase/schema.sql) nell'SQL Editor (tabelle, RLS, trigger, bucket).
3. Copia **Project URL** e **anon key** in `.env`.
4. (Sviluppo) In *Authentication → Providers → Email* puoi disattivare la conferma email per testare le registrazioni all'istante.

## 📁 Struttura

```
src/
├── main.tsx              # entry point + provider
├── App.tsx              # router e layout
├── lib/                 # supabase client, tipi, utility
├── context/             # AuthContext, PlayerContext (player globale)
├── components/          # Navbar, PlayerBar, TrackCard, form…
└── pages/               # Home, ArtistPage, Login, Signup, Dashboard
supabase/schema.sql       # schema DB + RLS + storage
docs/archive/             # documenti del concept precedente (storico)
```

## 🔐 Sicurezza & privacy

- La **anon key** è pubblica per design: l'accesso ai dati è protetto da **Row Level Security**.
- Ogni artista può modificare solo il proprio profilo e i propri brani.
- I file vengono caricati in cartelle isolate per utente (`<uid>/...`).
- Gli ascolti e i like sono **anonimi**: nessun dato personale dell'ascoltatore.

## 🤝 Contribuire

Le contribuzioni sono benvenute! Vedi [CONTRIBUTING.md](CONTRIBUTING.md).
Idee aperte: ricerca, generi/filtri, commenti, notifiche, embed esterni, i18n, PWA offline, app mobile.

## 📄 Licenza

[MIT](LICENSE) — usalo, modificalo, fanne quello che vuoi.
