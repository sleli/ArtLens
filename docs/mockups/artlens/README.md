# ArtLens — Mockup statici

Mockup HTML/CSS/JS isolati per il PRD ArtLens (`docs/PRD.md`).
**Solo esplorazione visiva** — nessun codice di produzione. L'implementazione è uno step separato (`archetipo-plan` + `archetipo-implement`).

## Schermate

| File | Cosa rappresenta | FR del PRD |
|---|---|---|
| `index.html` | Feed di swipe come "sala museale" — card opera con didascalia tipografica + rail laterali (progresso, tag emergenti, contesto sull'opera, domanda guida) | FR-001, FR-002, FR-003, FR-007 |
| `profile.html` | "Il quadro di Giulia" — non è una dashboard, è un poster editoriale: hero tipografica, manifesto, 5 pannelli (stili, top artisti, timeline, palette, vocabolario emotivo) | FR-004 |
| `discover.html` | "Per te, oggi" — mostra curata di 5 opere con narrazione del *perché*, layout asimmetrico alternato | FR-005, FR-007 |

## Direzione visiva

**Cataloghi del 21° secolo.** Incrocio tra catalogo museale editoriale (Phaidon, Taschen) e app contemporanea per gen-Z curiosa. Tipografia Fraunces serif per titoli, Inter per UI, JetBrains Mono per metadati (numeri di catalogo, tag, percentuali). Palette: avorio caldo (`#f3ecdd`), inchiostro caldo (`#1a1714`), accento ocra-bordeaux (`#b04924`), oro pallido (`#c9a96e`).

**Differenziatore**: ogni opera è frammentata in due livelli editoriali — l'immagine a tutta scena + l'etichetta museale tipografica sovrapposta in basso (numero di catalogo, autore, materiali, collezione). Le statistiche del profilo sono *blocchi tipografici*, non grafici SaaS.

## Stack del mockup

- HTML statico, CSS plain, JS plain (`pointerdown`/`pointermove` per swipe).
- Nessun framework, nessun bundler.
- Font: Google Fonts (Fraunces + Inter + JetBrains Mono).
- Immagini: Wikimedia Commons (pubblico dominio, hotlink).

## Come aprire

Apri `index.html` in browser. Naviga via topbar tra le 3 schermate.

Sulla feed: trascina la card o usa frecce ← → per swipe, ⎵ per salvare, ↩ per indietro.

## Cosa NON è

- Non è un componente Next.js, non è React.
- Non si integra col boilerplate Supabase/Prisma — è una vetrina.
- Le opere mostrate sono hardcoded, le percentuali sono ad-hoc.
- I tasti di navigazione tra pagine sono `<a href>` statici — non c'è auth, non c'è state.

Per portare questa direzione in produzione: pianificare con `/archetipo-plan` la storia "Feed swipe" e affini, riusando i pattern visivi di questi mockup come riferimento di design.
