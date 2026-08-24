# adrianachira.ro

**Citește `STATUS.md` integral înainte de a face orice.** Conține ce e gata, ce nu e,
ce e blocat și care e următorul pas. Acest fișier e doar indexul.

## Ce e proiectul

Site de prezentare și vânzare pentru Adriana Chira, consultant în performanță umană.
Română, un singur locale. Next 16 · React 19 · Tailwind v4 · TypeScript 7 strict ·
Payload 3 (neinstalat încă) · Stripe (neinstalat încă) · Vercel.

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
```

Windows: dacă `pnpm` lipsește din PATH, e la `$HOME/AppData/Roaming/npm`
(`corepack enable` eșuează fără drepturi de administrator).

## Unde se conectează Payload

`src/lib/content.ts` — `getSiteSettings()` și `getHomeContent()`, deja `async`.
Componentele nu știu de unde vine conținutul. La faza 2 se schimbă doar corpul
acestor funcții; `src/content/*.ts` rămâne ca fallback. Detalii în `STATUS.md` §5.

## Înainte de commit

`pnpm build && pnpm typecheck` curate, grep-ul de sedile la zero, și
**actualizează `STATUS.md`**.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
