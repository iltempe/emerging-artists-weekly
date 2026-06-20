# Contribuire a OpenStage

Grazie per l'interesse! OpenStage è un template open-source che permette a un cantautore di avere il proprio sito musicale in pochi minuti. Contributi di ogni tipo — codice, design, temi, documentazione, traduzioni — sono benvenuti.

## Come iniziare

1. Fai un **fork** del repo e clonalo.
2. `npm install` poi `npm run dev`.
3. Crea un branch: `git checkout -b feat/tema-chiaro`.
4. Prima della PR verifica che tutto compili:
   ```bash
   npm run typecheck
   npm run build
   ```
5. Apri una **Pull Request** verso `main` spiegando cosa cambia.

## Principi del progetto

- **Semplicità prima di tutto.** Il pubblico è un artista che non programma: ogni feature deve restare configurabile da `site.config.ts` senza toccare il codice.
- **Statico di default.** Il sito deve funzionare senza backend; i contatori (Supabase) sono opt-in e degradano in modo pulito se assenti.
- **TypeScript** ovunque, componenti piccoli, stile con **Tailwind** usando i token in `tailwind.config.js`.

## Buona prima issue

- Temi/preset di colore aggiuntivi
- Layout alternativo della copertina (griglia invece di lista)
- Pagina/embed per condividere il singolo brano
- Internazionalizzazione (i18n) IT/EN dell'interfaccia
- Generatore di Open Graph image per le anteprime social
- Migliorie di accessibilità (focus, ARIA, contrasto)

## Codice di condotta

Sii gentile e rispettoso. Questo progetto esiste per aiutare gli artisti a farsi ascoltare.
