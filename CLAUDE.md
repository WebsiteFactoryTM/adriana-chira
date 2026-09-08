# adrianachira.ro

**Citește `STATUS.md` integral înainte de a face orice.** Conține ce e gata, ce nu e,
ce e blocat și care e următorul pas. Acest fișier e doar indexul.

## Ce e proiectul

Site de prezentare și vânzare pentru Adriana Chira, consultant în performanță umană.
Română, un singur locale. Next 16 · React 19 · Tailwind v4 · TypeScript 7 strict ·
Payload 3.88 · Zod 4 (**doar `zod/mini`**) · Stripe 22.5 (sincronizarea prețurilor
**și checkout-ul**) · Postgres · Vercel.

Fazele 1, 2, 3b și 4 sunt complete: 17 rute publice, conținutul real al clientei în
CMS, plata online funcțională. Urmează fazele 5b–7.

Se vând **patru lucruri**: trei programe individuale (`/servicii/[slug]`, colecția
`packages`) și locuri la workshopuri (`/workshopuri-performanta-umana`, colecția
`workshops`). **Toate prețurile sunt în lei.** Se pot cumpăra întotdeauna doar
următoarele trei ediții de workshop cu dată în viitor — regula se calculează din
`sessionDate`, în `src/lib/workshops.ts`, și nu se bifează nicăieri.

## Surse de adevăr, în ordine

1. `design/homepage-approved.html` — aspectul. Aprobat de clientă. **Nu se modifică.**
2. `../01-BRIEF-GENERAL.md` — tot restul: ton, conținut, SEO, AEO, GDPR, plăți.
3. `../03-PROMPT-CLAUDE-CODE.md` — specificația pe 7 faze, cu verificări.
4. `STATUS.md` — stadiul curent și capcanele deja rezolvate.

Dacă brief-ul și designul aprobat se contrazic pe o chestiune de **aspect**,
câștigă designul. Pe orice altceva, câștigă brief-ul.

## Reguli care nu se încalcă

- Designul aprobat e lege. Ai o obiecție? `// NOTĂ DESIGN:` și implementezi varianta aprobată.
  Excepțiile cerute de clientă sunt numerotate în `STATUS.md` §9 — astăzi 30.
- Server Components implicit. `use client` cere justificare scrisă în fișier.
  Astăzi există exact patru: `MobileNav`, `ConsentBanner`, `ContactForm`,
  `CopyLinkButton`. **Butonul de plată nu e printre ele**: e un `<form method="post">`
  către `/api/stripe/checkout`, deci zero JS. Nu îl transforma în `onClick`.
- Zero bibliotecă de animație. Zero bibliotecă de componente. Zero bibliotecă de
  iconuri — semnele se desenează în `ui/Glyph.tsx`, linie de 1px, ca restul
  designului. Zero SDK acolo unde ajunge un `fetch` (vezi `src/lib/email.ts`).
- Pe paginile lungi, o secțiune își declară felul (`kind` în `PackageSection`) și
  primește banda potrivită, cu fundal alternat. Nu randa totul la fel: așa au
  ajuns paginile să pară documente Word. Vezi `ui/PackageBody`.
- `--ac-ink-50` NU se folosește pe suprafețe crem: dă 4.24:1, sub AA. Acolo,
  textul secundar e `--ac-ink-70`.
- Rich text-ul se randează pe server, cu `ui/RichText`, nu cu pachetul React al
  Payload — acela intră în bundle-ul de client.
- Zero valori Tailwind implicite (`gray-900`, `rounded-lg`). Totul din tokenii
  din `src/app/globals.css`.
- Fără terți înainte de consimțământ. Verifici în Network, nu presupui.
- TypeScript strict. Zero `any`, zero `@ts-ignore`.
- Diacritice cu virgulă: `ș` U+0219, `ț` U+021B. `grep -rn "ş\|ţ" src/` = zero.
- Prețurile se citesc pe server, niciodată din client.
- Admin Payload în română, fiecare etichetă.
- Submeniurile din navigație sunt CSS pur (`:hover` + `:focus-within` pe desktop,
  `<details>` pe telefon) și se ascund din `opacity`, niciodată din `display` sau
  `visibility` — altfel `:focus-within` nu se mai poate declanșa. Vezi `STATUS.md` §10.

## Comenzi

```bash
pnpm dev · pnpm build · pnpm start · pnpm typecheck
pnpm db:up · pnpm migrate · pnpm seed · pnpm verify:faza2
```

Baza de date locală rulează în Docker. Lista completă de comenzi: `STATUS.md` §3.
Pe Vercel, build command-ul este `pnpm build:deploy`, nu `pnpm build`.

Windows: dacă `pnpm` lipsește din PATH, e la `$HOME/AppData/Roaming/npm`
(`corepack enable` eșuează fără drepturi de administrator).

## Unde se conectează Payload

`src/lib/content.ts` — singurul loc care știe de unde vine conținutul. Componentele
primesc mereu tipurile din `src/content/types.ts`.

**API-ul local al Payload rulează cu `overrideAccess: true`**, adică ignoră regulile
din `src/access/`. Filtrele `_status: 'published'` și `active: true` din
`content.ts` sunt singurul lucru care ține ciornele și pachetele ascunse în afara
paginilor publice. Nu le scoate.

**Regula de îmbinare:** CMS-ul are întâietate, dar numai unde chiar a fost completat.
Orice câmp gol, `null` sau listă goală cade pe `src/content/*.ts`, adică pe textul
verificat la px față de designul aprobat. Acele fișiere **nu se șterg**: sunt și
fallback-ul, și sursa din care `pnpm seed` populează CMS-ul. Conținutul real al
clientei stă în `packages.ts`, `workshops.ts` și `testimonials.ts`.

**Prețul nu vine niciodată din cerere.** Butonul de plată trimite doar `tip` și
`slug`; suma se citește pe server, în `src/lib/checkout.ts`. Fără cheie Stripe,
ruta nu dă eroare — trimite cumpărătorul pe calea de rezervare fără plată online,
la `/contact`, cu produsul precompletat. Aceea e o funcționalitate cerută, nu un
fallback de avarie: nu o scoate.

Atingi UI-ul sau stratul de conținut? Refă diff-ul CMS ↔ fallback din `STATUS.md` §6.
Atingi o componentă folosită și de homepage? Refă și diff-ul HEAD ↔ acum, tot §6 —
homepage-ul e verificat la pixel și nu are voie să se schimbe pe tăcute.

## Înainte de commit

`pnpm build && pnpm typecheck` curate, grep-ul de sedile la zero pe `src/` și
`scripts/`, `pnpm verify:faza2` la 10/10, și **actualizează `STATUS.md`**.
Ai atins schema? `pnpm generate:types` + o migrație nouă + `pnpm migrate:fix`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
