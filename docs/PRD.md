# ArtLens — Product Requirements Document

**Autore:** ARchetipo Inception
**Data:** 2026-05-01
**Versione:** 1.0

---

## Vision

ArtLens è un'app web per giovani adulti curiosi che, attraverso un'esperienza di swipe gamificata su opere d'arte, costruisce un profilo dei gusti personali e suggerisce nuove opere da esplorare, trasformando la frustrazione dell'arte "che non si capisce" in un viaggio di auto-scoperta divertente e strutturato.

## Personas

### Giulia — Il Curioso Culturale
- **Contesto:** 28 anni, lavora in ufficio, visita musei 2-3 volte l'anno ma si sente intimidita dalle sale troppo grandi.
- **Obiettivi:** Capire cosa le piace in modo semplice; avere un punto di partenza per conversazioni culturali.
- **Pain points:** Non ha un vocabolario artistico; si sente in colpa a non "capire" l'arte.
- **Jobs-to-be-done:** Quando entro in un museo o scrollo online, voglio capire subito se un'opera mi parla, così da costruire un gusto personale senza sentirmi inadeguata.

### Marco — L'Appassionato Visual
- **Contesto:** 32 anni, creativo, usa Pinterest e Instagram per trovare stimoli.
- **Obiettivi:** Scoprire artisti emergenti e movimenti poco conosciuti; strutturare i propri preferiti.
- **Pain points:** Le piattaforme social sono troppo dispersive; non tracciano l'evoluzione del suo gusto.
- **Jobs-to-be-done:** Quando cerco ispirazione visiva, voglio un feed curato per me, così da ampliare i miei riferimenti artistici in modo consapevole.

## Scope MVP

### Must-have
- Feed di opere d'arte con swipe like/dislike.
- Algoritmo base di profilazione per tag (stile, periodo, artista).
- Pagina profilo "Il mio quadro dei gusti" con visualizzazione grafica.
- Sezione "Scopri" con suggerimenti personalizzati.

### Nice-to-have (post-MVP)
- Collezione personale "Preferiti".
- Condivisione profilo su social.
- Filtri avanzati per epoca/stile.
- Badge e achievements.

### Fuori scope
- Upload foto proprie dell'utente.
- Integrazione biglietteria musei.
- Community e commenti.
- App mobile nativa (solo web responsive).

## Stack tecnologico

| Layer | Tecnologia | Versione | Razionale |
|---|---|---|---|
| Framework | Next.js | 15 (App Router) | Boilerplate esistente |
| Auth | Supabase Auth | — | Boilerplate, OAuth GitHub+Google già configurati |
| DB / ORM | Supabase Postgres + Prisma | — | Boilerplate, schema esistente in `prisma/schema.prisma` |
| Styling | Tailwind CSS | v4 + `@tailwindcss/postcss` | Boilerplate |
| UI | shadcn/ui | — | Boilerplate, design tokens in `globals.css` |
| Lingua | TypeScript | — | Boilerplate |

**Aggiunte proposte:**
- **Met Museum API / Wikimedia Commons:** fonte dati opere d'arte gratuite.
- **Framer Motion / react-tinder-card:** animazioni swipe immersive.
- **Recharts:** visualizzazione "quadro dei gusti".

## Requisiti funzionali

- **FR-001** — L'utente autenticato visualizza un feed di opere d'arte in formato card a tutto schermo con immagine, titolo, artista e anno.
- **FR-002** — L'utente può interagire con ogni card tramite swipe a sinistra (dislike) o destra (like), oppure tramite pulsanti equivalenti.
- **FR-003** — Il sistema registra ogni interazione like/dislike e aggiorna un punteggio di affinità per i tag associati all'opera (stile, periodo, artista, colore dominante).
- **FR-004** — Dopo almeno 5 interazioni, il sistema genera una pagina profilo "Il mio quadro dei gusti" che mostra visivamente le preferenze dell'utente con estetica artistica (es. grafico radar o barre per categorie).
- **FR-005** — La pagina profilo include una sezione "Scopri" che suggerisce 5 opere d'arte coerenti con il profilo di gusto calcolato, escludendo quelle già visualizzate, con descrizione accessibile al neofita.
- **FR-006** — L'utente può accedere alla pagina profilo e allo storico swipe solo dopo autenticazione. *(Estende boilerplate: Dashboard protetta)*
- **FR-007** — L'utente può salvare un'opera nella propria collezione personale ("Preferiti") dalla card o dalla sezione Scopri.
- **FR-008** — Il sistema popola inizialmente il database con un catalogo seed di almeno 100 opere d'arte con metadati completi.

---

_PRD generato via ARchetipo Inception (Lite) — 2026-05-01_
