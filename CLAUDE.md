# adrianachira.ro

**Citește `STATUS.md` integral înainte de a face orice.** Conține ce e gata, ce nu e,
ce e blocat și care e următorul pas. Acest fișier e doar indexul.

## Ce e proiectul

Site de prezentare și vânzare pentru Adriana Chira, consultant în performanță umană.
Română, un singur locale. Next 16 · React 19 · Tailwind v4 · TypeScript 7 strict ·
Payload 3.88 (instalat, faza 2 completă) · Stripe 22.5 (doar sincronizarea prețurilor) ·
Postgres · Vercel.

## Surse de adevăr, în ordine

1. `design/homepage-approved.html` — aspectul. Aprobat de clientă. **Nu se modifică.**
2. `../01-BRIEF-GENERAL.md` — tot restul: ton, conținut, SEO, AEO, GDPR, plăți.
3. `../03-PROMPT-CLAUDE-CODE.md` — specificația pe 7 faze, cu verificări.
4. `STATUS.md` — stadiul curent și capcanele deja rezolvate.

Dacă brief-ul și designul aprobat se contrazic pe o chestiune de **aspect**,
câștigă designul. Pe orice altceva, câștigă brief-ul.

## Reguli care nu se încalcă

- Designul aprobat e lege. Ai o obiecție? `// NOTĂ DESIGN:` și implementezi varianta aprobată.
- Server Components implicit. `use client` cere justificare scrisă în fișier.
  Astăzi există exact două: `MobileNav`, `ConsentBanner`.
- Zero bibliotecă de animație. Zero bibliotecă de componente.
- Zero valori Tailwind implicite (`gray-900`, `rounded-lg`). Totul din tokenii
  din `src/app/globals.css`.
- Fără terți înainte de consimțământ. Verifici în Network, nu presupui.
- TypeScript strict. Zero `any`, zero `@ts-ignore`.
- Diacritice cu virgulă: `ș` U+0219, `ț` U+021B. `grep -rn "ş\|ţ" src/` = zero.
- Prețurile se citesc pe server, niciodată din client.
- Admin Payload în română, fiecare etichetă.

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

**Regula de îmbinare:** CMS-ul are întâietate, dar numai unde chiar a fost completat.
Orice câmp gol, `null` sau listă goală cade pe `src/content/*.ts`, adică pe textul
verificat la px față de designul aprobat. Acele fișiere **nu se șterg**: sunt și
fallback-ul, și sursa din care `pnpm seed` populează CMS-ul.

Atingi UI-ul sau stratul de conținut? Refă diff-ul CMS ↔ fallback din `STATUS.md` §6.

## Înainte de commit

`pnpm build && pnpm typecheck` curate, grep-ul de sedile la zero pe `src/` și
`scripts/`, `pnpm verify:faza2` la 10/10, și **actualizează `STATUS.md`**.
Ai atins schema? `pnpm generate:types` + o migrație nouă + `pnpm migrate:fix`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
