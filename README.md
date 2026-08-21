# adrianachira.ro

Site de prezentare și vânzare pentru **Adriana Chira, consultant în performanță umană**.
Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript strict · deploy pe Vercel.

Documentele de proiect (brief, prompturi) stau în directorul părinte al acestui repo.
Designul aprobat de clientă: [`design/homepage-approved.html`](design/homepage-approved.html) — **sursa de adevăr pentru tot ce ține de aspect. Nu se șterge niciodată.**

---

## Stadiu

| Fază | Conținut | Stadiu |
|---|---|---|
| 1 | Fundație: setup, tokeni, fonturi, bibliotecă UI | ✅ gata |
| 3a | Homepage — cele 12 secțiuni din designul aprobat | ✅ gata |
| 5a | SEO/AEO pentru homepage: metadata, JSON-LD, robots, sitemap, llms.txt | ✅ gata |
| 6a | Consent Mode v2 + bara de consimțământ | ✅ gata |
| 2 | Payload: colecții, globals, seed | ⏳ urmează |
| 3b | Paginile interioare: /despre, /servicii, /blog, /contact, legale | ⏳ urmează |
| 4 | Stripe Checkout + webhook + emailuri | ⏳ urmează |
| 7 | Lighthouse, axe, lansare | ⏳ urmează |

---

## Rulare locală

```bash
pnpm install
cp .env.example .env.local     # completează NEXT_PUBLIC_SITE_URL
pnpm dev                       # http://localhost:3000
```

| Comandă | Ce face |
|---|---|
| `pnpm dev` | server de dezvoltare |
| `pnpm build` | build de producție (Turbopack) |
| `pnpm start` | servește build-ul de producție |
| `pnpm typecheck` | `tsc --noEmit`, TypeScript 7 |

`pnpm` este obligatoriu (`packageManager` fixat în `package.json`). Dacă nu îl ai:
`npm i -g pnpm` sau `corepack enable pnpm`.

---

## Arhitectură

```
src/
├─ app/
│  ├─ globals.css              ← TOȚI tokenii de design, în @theme
│  ├─ fonts.ts                 ← next/font, subset latin + latin-ext
│  ├─ robots.ts
│  └─ (frontend)/
│     ├─ layout.tsx            ← layout rădăcină: consent, header, footer, JSON-LD
│     ├─ page.tsx              ← homepage
│     ├─ not-found.tsx
│     ├─ [...notFound]/        ← trimite rutele necunoscute către not-found.tsx
│     ├─ sitemap.ts
│     ├─ llms.txt/route.ts
│     └─ opengraph-image.tsx
├─ components/
│  ├─ layout/                  Header, Footer, MobileNav
│  ├─ sections/                cele 12 secțiuni de homepage
│  ├─ ui/                      Button, Eyebrow, ImageSlot, Reveal, Section, TextLink
│  ├─ consent/                 ConsentBanner
│  └─ seo/                     JsonLd
├─ content/                    conținutul, tipat (types.ts, site.ts, home.ts)
└─ lib/                        content.ts (resolvere), consent.ts, schema.ts, cn.ts
```

### Stratul de conținut — cheia scalabilității

Componentele **nu** știu de unde vine conținutul. Citesc doar din `src/lib/content.ts`:

```ts
const content = await getHomeContent()   // azi: src/content/home.ts
```

Când intră Payload (faza 2), se schimbă **doar corpul acelor funcții** — se citește
globalul `home-page` și se face merge peste valorile din `src/content/home.ts`, care
rămân ca fallback. Zero modificări în cele 12 secțiuni. Funcțiile sunt `async` de la
început tocmai ca semnătura să nu se schimbe.

Același principiu pentru `getSiteSettings()` → globalul `site-settings`.

### Tokenii de design

Toate valorile vin din `@theme` în `src/app/globals.css`, extrase unu-la-unu din
designul aprobat. Numele urmează convenția din brief (`--ac-paper`, `--ac-ink`,
`--ac-accent-ink`, …) și sunt expuse și ca variabile CSS canonice în `:root`.

**Regulă:** nicio culoare, rază, umbră sau spațiere care nu există în designul
aprobat. Nicio clasă Tailwind implicită (`gray-900`, `rounded-lg`, `shadow-md`).

### Componente de client — exact două

| Componentă | De ce nu poate fi pe server |
|---|---|
| `MobileNav` | stare deschis/închis, Escape, blocare de scroll |
| `ConsentBanner` | scrie cookie și schimbă starea Consent Mode |

Tot restul homepage-ului este Server Component. Header-ul rămâne pe server pentru că
bara este mereu translucidă în designul aprobat — nu are stare de scroll.
`Reveal` este Server Component: animația e pur CSS (`animation-timeline: view()`),
iar pe browserele fără suport un singur script inline de ~600 B comută atributele.

---

## Ce a fost implementat conform brief-ului

**Accesibilitate** — skip-link, un singur `h1`, ierarhie de headinguri fără sărituri,
ținte de atingere ≥ 44px, focus vizibil (`2px --ac-accent-ink`, offset 3px),
`prefers-reduced-motion` oprește complet mișcarea, FAQ navigabil de la tastatură.

**AEO** — tot conținutul e în HTML-ul livrat de server; FAQ pe `<details>` nativ, deci
răspunsurile rămân în DOM și când acordeonul e închis; tabelul comparativ
psihoterapie / coaching / performanță umană este `<table>` semantic cu `<caption>`
ascuns vizual; `/llms.txt` generat din același conținut.

**Consimțământ** — mod de **bază**: GA4 se încarcă doar după consimțământ acordat,
și doar după `requestIdleCallback`. Stările implicite `denied` sunt declarate într-un
script inline care rulează primul în `<head>`. Cele trei acțiuni au greutate vizuală
egală. Cookie `ac_consent`, versionat, `SameSite=Lax`, `Secure`, 6 luni.
Link permanent de retragere în footer.

**Conformitate RO** — badge ANPC și link SOL în footer, pe toate paginile.

---

## Verificări rulate

| Verificare | Rezultat |
|---|---|
| `pnpm build` | ✅ fără erori, fără warning-uri |
| `pnpm typecheck` (TS 7, strict) | ✅ zero erori, zero `any` |
| Cereri către terți înainte de consimțământ | ✅ **zero** (niciun `preconnect`, niciun `dns-prefetch`) |
| Request-uri către `fonts.googleapis.com` / `gstatic` | ✅ zero — fonturi auto-găzduite |
| Diacritice cu sedilă (`ş`, `ţ`) în sursă | ✅ zero |
| Ordinea celor 12 secțiuni și `id`-urile | ✅ identice cu designul aprobat |
| Un singur `h1` | ✅ |
| JSON-LD | ✅ `Person`, `WebSite`, `ProfessionalService`, `FAQPage` — JSON valid |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | ✅ 200 |
| 404 personalizat, în limbajul vizual al site-ului | ✅ status 404 |
| Test de crawler fără JS (`curl` pe `/`) | ✅ tot textul vizibil este în HTML |

### First-load JS — buget depășit din cauza framework-ului

| | gzip |
|---|---|
| Buget din brief (§10.1) | ≤ 110 KB |
| **Măsurat** (Turbopack) | **~142 KB** |
| Măsurat (webpack, pentru comparație) | ~140 KB |
| din care codul nostru | ~12 KB |
| din care React 19 + runtime-ul App Router | ~126 KB |
| HTML homepage (gzip) | 25 KB |
| CSS (raw) | 44 KB |

Chunk-ul de polyfill-uri (39 KB gz) are `noModule` — browserele moderne nu îl
descarcă și nu intră în calcul.

**Concluzie:** ~126 KB din cele 142 sunt podeaua Next 16 + React 19 cu App Router.
Codul aplicației contribuie cu ~12 KB. Bugetul de 110 KB nu este atins cu acest stack,
indiferent de cât optimizăm — ar cere renunțarea la App Router. De discutat în echipă:
fie se ajustează bugetul la ~150 KB, fie se reevaluează stack-ul. Nu afectează direct
Lighthouse Performance (JS-ul e `async`, nu blochează LCP), dar trebuie decis explicit,
nu ignorat.

---

## Ce lipsește și blochează (brief §13)

| # | Element | Efect în cod acum |
|---|---|---|
| 1 | **Pachetele de servicii** | Cele 3 carduri randează `[ Nume pachet ]`, `[ 000 ] EUR` etc. Structura e finală — la popularea datelor nu se schimbă niciun layout. |
| 2 | **Portret profesional** | Se folosește `public/images/adriana-portret.jpg` din pachetul de design. La înlocuire, `ImageSlot` fixează raportul, deci CLS rămâne 0. |
| 4 | Email, telefon | Footerul afișează `[ email ]`, `[ telefon ]`. Nu inventăm date de contact. |
| 5 | Conturi social media | `[ LinkedIn ]`, `[ Instagram ]`, `[ Facebook ]`; `sameAs` lipsește din schema `Person` până la confirmare. |
| 6 | CUI, reg. com., sediu | Footerul afișează `[ Denumire firmă · CUI · Reg. Com. ]`. |
| 11 | **Decizia privind crawlerele AI** | `src/app/robots.ts` le permite explicit. **Necesită confirmare scrisă de la clientă** — vezi comentariul din fișier. |

Toate se completează dintr-un singur loc: `src/content/site.ts` (→ ulterior
globalul Payload `site-settings`).

---

## Decizii de implementare care se abat de la literă

Sunt trei, toate documentate și în cod:

1. **„Perspective" → „Blog" în navigație.** Header-ul demo-ului scria „Perspective",
   dar footerul aceluiași demo și brief §4.3 impun „Blog" (cerință de proiect + SEO).
   Am ales forma consecventă. `src/content/site.ts`.
2. **Header fără stare de scroll.** Brief §5.6 descria transparent → paper după 80px.
   Designul aprobat (v3) l-a simplificat la translucid permanent. Am implementat
   varianta aprobată; economisește un Client Component. `src/components/layout/Header.tsx`.
3. **`Reveal` este Server Component.** Promptul cerea Client Component cu
   IntersectionObserver propriu. Un observer per element ar însemna sute de instanțe.
   Rezultatul vizual e identic; costul în JS pe browsere moderne e zero.
   `src/components/ui/Reveal.tsx`.

Ancorele din navigație (`#despre`, `#servicii`, …) reproduc demo-ul aprobat, care este
o pagină unică. La intrarea paginilor interioare se înlocuiesc cu rutele reale —
dintr-un singur loc, `src/content/site.ts`.

---

## Următorul pas recomandat

**Faza 2 — Payload.** Nu depinde de UI și poate rula în paralel. Are nevoie de:
`DATABASE_URI` (Postgres pooled), `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`.

Ordinea: colecții și globals → seed idempotent → mutarea resolverelor din
`src/lib/content.ts` pe Payload → webhook `afterChange` → `/api/revalidate`.

---

*Website Factory · Pixel Factory SRL · Timișoara*
