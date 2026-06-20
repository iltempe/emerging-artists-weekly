# Contribuire a OpenStage

Grazie per l'interesse! OpenStage è un progetto open source pensato per i cantautori emergenti. Ogni contributo — codice, design, documentazione, traduzioni, idee — è benvenuto.

## Come iniziare

1. Fai un **fork** del repo e clona il tuo fork.
2. Segui l'avvio locale nel [README](README.md#-avvio-locale).
3. Crea un branch descrittivo: `git checkout -b feat/ricerca-brani`.
4. Fai le tue modifiche. Prima di aprire la PR:
   ```bash
   npm run typecheck
   npm run build
   ```
5. Apri una **Pull Request** verso `main` spiegando cosa cambia e perché.

## Linee guida

- **TypeScript** ovunque; niente `any` non necessari.
- Componenti piccoli e a responsabilità singola in `src/components`, pagine in `src/pages`.
- Stile con **Tailwind**; usa i token colore definiti in `tailwind.config.js`.
- L'accesso ai dati passa **sempre** dal client Supabase con RLS — mai chiavi segrete nel frontend.
- Commit chiari (it/en va bene). Conventional Commits gradito ma non obbligatorio.

## Buona prima issue

- Filtri per genere ed una barra di ricerca
- Pagina "Artisti" con la lista dei profili
- Modifica/eliminazione copertina di un brano già caricato
- Internazionalizzazione (i18n) IT/EN
- Miglioramenti accessibilità (focus, ARIA, contrasto)

## Codice di condotta

Sii gentile e rispettoso. Questo è uno spazio per aiutare gli artisti a farsi ascoltare: trattiamo le persone come vorremmo essere trattati.
