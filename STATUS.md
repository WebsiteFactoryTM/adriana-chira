# STATUS — adrianachira.ro

**Document de predare între sesiuni.** Dacă intri în proiect fără context, citește
acest fișier primul și integral. Descrie ce există, ce nu există, ce e blocat și care
e următorul pas concret.

| | |
|---|---|
| Ultima actualizare | **24 august 2026** |
| Stadiu general | Faza 1 completă · homepage complet **și verificat vizual față de design** · fazele 2–7 neîncepute |
| Build | ✅ trece (`pnpm build`, `pnpm typecheck`) |
| Ultimul commit | `38c29e7` — Fidelitate față de designul aprobat: 12 din 12 secțiuni identice |

---

## 1. Ce este proiectul

Site de prezentare **și vânzare** pentru Adriana Chira, consultant în performanță
umană (Timișoara). Limba română, un singur locale, fără i18n.

Executant: Website Factory / Pixel Factory SRL.

### Documentele sursă — se citesc înainte de orice decizie

Sunt în **directorul părinte** al acestui repo (`../`), nu în repo:

| Fișier | Ce conține | Când îl citești |
|---|---|---|
| `../01-BRIEF-GENERAL.md` | Sursa de adevăr pentru tot: poziționare, ton, paletă, arhitectură, SEO, AEO, GDPR, plăți, criterii de acceptanță | Înainte de orice decizie de conținut sau arhitectură |
| `../03-PROMPT-CLAUDE-CODE.md` | Specificația de implementare pe 7 faze, cu verificări per fază | Înainte de a începe o fază nouă |
| `../02-PROMPT-CLAUDE-DESIGN.md` | Promptul care a generat designul | Rar; doar pentru context istoric |
| `design/homepage-approved.html` | **Designul aprobat de clientă.** Sursa de adevăr pentru tot ce ține de aspect | Înainte de a scrie orice linie de UI |
| `design/compare/README.md` | Harnessul de comparație vizuală design ↔ implementare, cu mod de rulare | Ori de câte ori atingi UI-ul |

> `design/homepage-approved.html` **nu se șterge și nu se modifică niciodată.**
> Este varianta v3 („Homepage completă cu 14 secțiuni"), aprobată de clientă.

---

## 2. Reguli permanente — nu se încalcă fără acordul echipei

1. **Designul aprobat este lege.** Vezi ceva ce ai face altfel? Notează
   `// NOTĂ DESIGN:` și implementează varianta aprobată.
2. **Server Components implicit.** `use client` cere justificare scrisă în comentariu,
   în fișier. Astăzi există exact două componente de client (vezi §4).
3. **Zero bibliotecă de animație.** CSS + un singur IntersectionObserver global.
4. **Zero bibliotecă de componente.** Fără shadcn, MUI, Radix. Se scriu de mână.
5. **Zero valori Tailwind implicite** (`gray-900`, `rounded-lg`, `shadow-md`).
   Toate valorile vin din tokenii din `src/app/globals.css`.
6. **Fără terți înainte de consimțământ.** Niciunul. Verifici în Network, nu presupui.
7. **Prețurile se citesc pe server.** Niciodată din client.
8. **TypeScript strict.** Zero `any`, zero `@ts-ignore`.
9. **Admin Payload în română.** Fiecare etichetă, descriere, mesaj de eroare.
10. **Diacritice cu virgulă:** `ș` (U+0219), `ț` (U+021B). Niciodată sedila `ş`/`ţ`.
    Verifică înainte de commit: `grep -rn "ş\|ţ" src/` trebuie să dea zero.
11. **Fără date reale de client** în seed sau fixtures.
12. La final de fază: **oprește-te, rulează verificările fazei, raportează.**

---

## 3. Stack și comenzi

```
Next 16.3.1 · React 19.2.8 · Tailwind 4.3.3 · TypeScript 7 · pnpm 10.34.5
```

Versiunile `next`, `react`, `react-dom`, `tailwindcss` sunt **fixate exact**, fără
caret — compatibilitatea Payload ↔ Next este strictă.

```bash
pnpm install
cp .env.example .env.local
pnpm dev          # http://localhost:3000
pnpm build        # build de producție (Turbopack)
pnpm start        # servește build-ul
pnpm typecheck    # tsc --noEmit
```

**Notă de mediu (Windows):** `corepack enable` eșuează fără drepturi de administrator
(EPERM pe `C:\Program Files\nodejs`). `pnpm` a fost instalat la nivel de utilizator:
`npm config set prefix "$HOME/AppData/Roaming/npm" && npm i -g pnpm@10`.
Dacă `pnpm` nu e găsit, adaugă `$HOME/AppData/Roaming/npm` în PATH.

---

## 4. CE ESTE GATA

### Faza 1 — Fundație ✅

- `package.json` cu versiuni fixate, `packageManager` pnpm, `engines.node >= 20.9`
- `tsconfig.json` strict + `noUncheckedIndexedAccess`, alias `@/*` → `src/*`
- `next.config.ts`: AVIF/WebP, `remotePatterns` pentru Vercel Blob (pregătit),
  `poweredByHeader: false`, anteturi de securitate
- `postcss.config.mjs` cu `@tailwindcss/postcss`
- `.env.example` complet, comentat, inclusiv variabilele fazelor viitoare
- `.npmrc`, `.nvmrc`, `.gitignore`

**Tokeni de design** — `src/app/globals.css`, blocul `@theme`. Extrași unu-la-unu din
designul aprobat. Numele urmează convenția din brief §5.3:

```
--color-ac-paper #FAF5EC   --color-ac-ink        #17140F   --color-ac-line       #E1D7C6
--color-ac-cream-50 #F2EBDD --color-ac-ink-70    #4A443C   --color-ac-accent     #C0A47B
--color-ac-cream-100 #E7DBC5 --color-ac-ink-50   #756E64   --color-ac-accent-ink #7A6038
                                                            --color-ac-accent-deep #6B5430
```

> **Atenție:** valorile din designul aprobat DIFERĂ de cele orientative din brief §5.3
> (`#FCFAF7`, `#F5F0E8`, `#E8DFD1`, `#A98C5F`, `#7E653F`). Designul aprobat are
> precedență. `--ac-accent-deep` apare și în design (10 locuri) și se folosește **doar
> pe `cream-100`**, unde `--ac-accent-ink` dă 4.31:1 și pică AA. Pe `paper` și
> `cream-50` accentul rămâne `--ac-accent-ink`, ca în design. Vezi §9.3.

> **line-height pe etichete:** tokenii `eyebrow`, `label`, `nav` și `btn` sunt pe
> `normal`, nu pe o valoare numerică. Designul nu pune `line-height` pe niciuna dintre
> aceste mărimi, iar `html` are explicit `line-height: normal` ca să anuleze `1.5`-ul
> din preflight. Nu le pune valori numerice „ca să fie consecvent" — crește fiecare
> etichetă cu ~3px și deplasează tot ce urmează.

Plus scala de tipografie (`--text-h1`, `--text-h2-col`, `--text-quote`, …), ritmul
(`--spacing-section`, `--spacing-gutter`, `--spacing-col-gap`, …), containerele și
curba de easing `--ease-ac`. Toate reproduc exact un `clamp()` din design.

**Fonturi** — `src/app/fonts.ts`. Cormorant Garamond 300/400 + Inter 400/500, subset
`latin` **+ `latin-ext`**, auto-găzduite. Verificat: zero request către
`fonts.googleapis.com` / `fonts.gstatic.com`.

**Bibliotecă UI** — `src/components/ui/`:

| Componentă | Rol |
|---|---|
| `Button` + `Arrow` | variante `primary \| outline \| soft \| onDark`, mărimi `sm–xl`, ca `<a>`/`<Link>`/`<button>` |
| `Eyebrow` | eticheta versală; ornamente `line \| pulse \| none`; poate randa ca `h2` |
| `Section`, `Shell`, `StickyColumn`, `Rule` | învelișul de secțiune, coloana de 1560px, coloana sticky, hairline |
| `ImageSlot` | **cheie** — raport fixat de tip de slot, placeholder crem când `src` lipsește. CLS 0 la înlocuirea fotografiei |
| `Reveal` | Server Component; pune atributele, animația e pur CSS |
| `RevealFallback` | script inline ~600 B, un singur observer, doar pe browsere fără `animation-timeline` |
| `TextLink` | subliniere care crește din stânga |

### Homepage — cele 12 secțiuni ✅

`src/app/(frontend)/page.tsx` + `src/components/sections/`. Ordinea și `id`-urile sunt
identice cu designul aprobat:

```
hero → problema → metoda → pentru-cine → univers → despre
     → valori → citat → servicii → blog → faq → cta
```

Layout: `src/components/layout/` — `Header`, `MobileNav`, `Footer`.

**Componente de client — exact două.** Dacă adaugi a treia, justifică în comentariu:

| Componentă | De ce nu poate fi pe server |
|---|---|
| `MobileNav` | stare deschis/închis, Escape, blocare de scroll |
| `ConsentBanner` | scrie cookie și schimbă starea Consent Mode |

Header-ul a rămas pe server pentru că designul v3 nu are stare de scroll.
Link-ul „Setări cookie-uri" din footer funcționează prin delegare pe
`[data-consent-open]`, deci footerul rămâne Server Component.

### SEO / AEO pentru homepage ✅

- `generateMetadata` static în `layout.tsx` + `page.tsx`: `metadataBase`, canonical,
  OG `ro_RO`, Twitter `summary_large_image`
- JSON-LD în `src/lib/schema.ts` + `src/components/seo/JsonLd.tsx`:
  `Person` (layout, toate paginile), `WebSite`, `ProfessionalService`, `FAQPage`
- `src/app/robots.ts` — **la rădăcina `app/`, nu în grupul `(frontend)`.**
  În grup nu era compilat deloc. `sitemap.ts` funcționează din grup.
- `src/app/(frontend)/sitemap.ts` — deocamdată doar `/`
- `src/app/(frontend)/llms.txt/route.ts` — generat din același conținut ca pagina
- `src/app/(frontend)/opengraph-image.tsx` — 1200×630, `force-static`
- FAQ pe `<details>` nativ; tabelul comparativ e `<table>` semantic cu `<caption>`
  ascuns vizual

### Consimțământ ✅

- `src/lib/consent.ts` — cookie `ac_consent`, versionat (`v: 1`), `SameSite=Lax`,
  `Secure`, 6 luni; plus scriptul de bootstrap
- Scriptul rulează **primul în `<head>`**, inline (nu `next/script` — nu garantează
  ordinea): `dataLayer` + `gtag`, toate stările `denied`, `wait_for_update: 500`
- **Mod de bază:** GA4 se încarcă DOAR după consimțământ acordat, și doar după
  `requestIdleCallback`. Vezi raționamentul complet în `src/lib/consent.ts`.
- `ConsentBanner`: trei acțiuni cu greutate vizuală egală, panou de setări cu
  Necesare / Analiză / Marketing, nimic prebifat, închiderea fără alegere ≠ consimțământ

### Alte rute ✅

- `not-found.tsx` în limbajul vizual al site-ului
- `[...notFound]/page.tsx` — captează rutele necunoscute și le trimite la `not-found`.
  **Necesar** pentru că layout-ul rădăcină trăiește în grupul `(frontend)`; fără el,
  un URL inexistent cădea pe 404-ul implicit al Next-ului, în engleză.

---

## 5. CE NU ESTE FĂCUT

### Faza 2 — Payload CMS ⏳ **următorul pas recomandat**

Nu depinde de UI. Are nevoie de `DATABASE_URI` (Postgres **pooled**),
`PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`.

Nimic din Payload nu e instalat: fără `payload.config.ts`, fără colecții, fără
`src/app/(payload)/`. Grupul `(frontend)` există deja tocmai ca `(payload)` să poată fi
adăugat alături, cu layout propriu.

De făcut, în ordine (spec: `../03-PROMPT-CLAUDE-CODE.md` §4):

1. Instalare `payload@3.88.0`, `@payloadcms/next`, `@payloadcms/db-postgres`,
   `@payloadcms/richtext-lexical`, `@payloadcms/storage-vercel-blob` — toate `3.88.0` fix
2. Colecții: `users`, `media`, `posts`, `categories`, `packages`, `faqs`, `orders`,
   `submissions`. **Toate etichetele în română.**
3. Globals: `site-settings`, `home-page`, `about-page`
4. Hook `afterChange` pe `packages` → sincronizare preț cu Stripe, idempotent
5. `pnpm seed` idempotent
6. **Mutarea resolverelor** — vezi mai jos

> #### Punctul exact de conectare cu Payload
>
> `src/lib/content.ts` conține `getSiteSettings()` și `getHomeContent()`, ambele
> `async` **special ca semnătura să nu se schimbe**. Componentele nu știu de unde vine
> conținutul. La faza 2 se schimbă doar corpul lor:
>
> ```ts
> const payload = await getPayload({ config })
> const home = await payload.findGlobal({ slug: 'home-page' })
> return mergeWithFallback(home, homeContent)   // homeContent rămâne fallback
> ```
>
> `src/content/home.ts` și `src/content/site.ts` **nu se șterg** — rămân valorile de
> rezervă din designul aprobat, pentru câmpurile necompletate în CMS.
> Tipurile din `src/content/types.ts` sunt contractul; ele nu se schimbă.

### Faza 3b — Paginile interioare ⏳

Nu există: `/despre`, `/servicii`, `/servicii/[slug]`, `/blog`, `/blog/[slug]`,
`/blog/categorie/[slug]`, `/contact`, `/multumim`, `/comanda-anulata` și cele patru
pagini legale.

**La crearea lor, schimbă ancorele în rute reale** — dintr-un singur loc,
`src/content/site.ts`: `nav`, `mobileNav`, `footerNav`. Astăzi sunt `#despre`,
`#servicii`, `#blog`, `#cta` pentru că demo-ul aprobat e o pagină unică.

Formularul de contact: Zod pe client și pe server, honeypot + rate limiting,
**fără reCAPTCHA**.

### Faza 4 — Stripe ⏳

Nimic. `/api/stripe/checkout`, `/api/stripe/webhook`, emailurile Resend.
Două capcane semnalate în prompt: **idempotența webhook-ului** pe `stripeSessionId`
(Stripe reîncearcă) și citirea prețului **doar pe server**.

### Faza 5b — SEO pentru restul site-ului ⏳

`sitemap.ts` trebuie extins cu articolele și pachetele, cu `lastModified` real din
baza de date. Lipsesc `rss.xml`, `Article`, `Service`, `BreadcrumbList`.

### Faza 6b — Conformitate ⏳

Cele patru pagini legale, cu conținut real, validate de un jurist.
Evenimentele GA4 (`view_package`, `begin_checkout`, `purchase`, …).

### Faza 7 — Performanță, accesibilitate, lansare ⏳

Lighthouse pe toate cele 5 pagini, axe DevTools, test cu NVDA/VoiceOver,
`@next/bundle-analyzer`, CI care blochează merge-ul la depășirea bugetului de JS.

---

## 6. Verificări rulate

| Verificare | Rezultat |
|---|---|
| `pnpm build` | ✅ fără erori, fără warning-uri |
| `pnpm typecheck` (TS 7, strict) | ✅ zero erori |
| Cereri terțe înainte de consimțământ | ✅ zero; niciun `preconnect`/`dns-prefetch` |
| Request-uri către domenii Google | ✅ zero — fonturi auto-găzduite |
| `grep -rn "ş\|ţ" src/` | ✅ zero sedile |
| Ordinea celor 12 secțiuni și `id`-urile | ✅ identice cu designul |
| Un singur `h1`, ierarhie fără sărituri | ✅ |
| JSON-LD | ✅ JSON valid, 4 tipuri |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | ✅ 200 |
| 404 personalizat | ✅ status 404, layout-ul site-ului |
| Test de crawler fără JS (`curl` pe `/`) | ✅ tot textul vizibil e în HTML |
| Cele 6 `<details>` din FAQ, închise în HTML-ul livrat | ✅ ca în design |
| Hidratare pe build de producție (meniu mobil, bară de consimțământ) | ✅ |
| **Comparație vizuală cu designul aprobat, 375 / 768 / 1440** | ✅ vezi mai jos |

### ✅ Comparația vizuală cu designul aprobat — rulată pe 24 august 2026

Testul de acceptanță al fazei de UI (prompt §0). Metoda și modul de re-rulare:
`design/compare/README.md`. Rulat pe **build de producție**, la 375px, 768px și
1440px, comparând nod-de-text cu nod-de-text: poziție, dimensiune, `font-size`,
`line-height`, `font-weight`, `color`, `letter-spacing`.

**Rezultat după corecții — înălțimea celor 12 secțiuni:**

| Lățime | Secțiuni identice la px | Abatere maximă pe secțiune | Abatere pe toată pagina |
|---|---|---|---|
| 1440px | 11 / 12 | 1px (`metoda`) | 1px din 14015 |
| 768px | 10 / 12 | 2px (`univers`) | 2px din 14535 |
| 375px | 9 / 12 | 2px (`metoda`, `univers`, `valori`) | 6px din 17541 |

Header și footer identice la px la toate cele trei lățimi. Abaterile de 1–2px vin
toate din normalizarea `line-height`-ului pe h3 (vezi §9.4) și sunt sub pragul
vizual.

**Ce a găsit testul — șapte diferențe reale, toate corectate:**

| # | Diferență | Cauză | Corecție |
|---|---|---|---|
| 1 | Prima întrebare din FAQ era deschisă | `defaultOpen: true` în `src/content/home.ts` | Eliminat — în design toate cele 6 sunt închise. Răspunsul rămâne în HTML oricum, deci AEO nu pierde nimic |
| 2 | Fiecare etichetă mică era cu ~3px mai înaltă | Preflight pune `line-height: 1.5` pe `html`; resetul designului nu pune nimic | `line-height: normal` pe `html` + tokenii `eyebrow`/`label`/`nav`/`btn` pe `normal` |
| 3 | Link-urile de text erau cu ~7px mai înalte | `text-body*` aduce `line-height: 1.8`; în design linkurile n-au line-height | `leading-[normal]` intrat în `TextLink`, nu la fiecare apel |
| 4 | Listele din footer, cu ~30px mai înalte | Aceeași cauză, pe `<a>`-urile din liste | `leading-[normal]` pe linkuri; mărimea a coborât de pe `<ul>` pe copii, ca în design |
| 5 | La 375px, header-ul cu 8px mai scund | `ac-shell` dă gutter minim 24px; header-ul din design e singurul loc cu 20px. Plus `shrink-0` pe wordmark, care împiedica subtitlul să treacă pe două rânduri | Gutter propriu pe header, `shrink-0` eliminat |
| 6 | Link-ul din bara de consimțământ avea culoarea textului din jur | Preflight face `a` să moștenească culoarea; resetul designului dă `a { color: ink }` | `text-ac-ink` pe link |
| 7 | `ac-accent-deep` folosit în 5 locuri unde designul are `ac-accent-ink` | Regula „pe crem folosim varianta închisă" aplicată prea larg | Restrânsă la `cream-100`, unde chiar pică AA (vezi §9.3) |

**Placeholderele din footer** (`[ email ]`, `[ LinkedIn ]`) erau desenate cu 65%
opacitate; în design au culoarea normală a textului. Componenta `Placeholder` nu mai
impune culoare — moștenește, deci arată corect și în bara de jos, unde fundalul e
închis.

---

## 7. Blocaje și decizii care așteaptă clienta

Din brief §13. Toate se completează dintr-un singur loc: `src/content/site.ts`
(→ ulterior globalul Payload `site-settings`).

| # | Element | Cum se manifestă în cod acum | Blochează |
|---|---|---|---|
| 1 | **Pachetele de servicii** — nume, conținut, durată, preț | Cele 3 carduri randează `[ Nume pachet ]`, `[ 000 ] EUR`. Structura e finală. | Faza 4 (Stripe), pagina Servicii |
| 2 | **Portret profesional** | Se folosește `public/images/adriana-portret.jpg` din pachetul de design. `ImageSlot` fixează raportul → CLS 0 la înlocuire. | Calitatea hero-ului |
| 3 | Domeniul | `NEXT_PUBLIC_SITE_URL` are ca implicit `https://adrianachira.ro` | Deploy, canonical |
| 4 | Email, telefon | Footerul afișează `[ email ]`, `[ telefon ]` | Contact, schema |
| 5 | Conturi social media | `[ LinkedIn ]`, `[ Instagram ]`, `[ Facebook ]`; `sameAs` lipsește din `Person` | Schema Person |
| 6 | CUI, reg. com., sediu | Footerul afișează `[ Denumire firmă · CUI · Reg. Com. ]` | ANPC, Termeni |
| 7 | Regim TVA, PFA sau SRL | — | Configurarea Stripe |
| 8 | Cont Stripe | — | Faza 4 |
| 9 | GA4 + Search Console | `NEXT_PUBLIC_GA4_ID` gol → GA4 nu se încarcă niciodată (intenționat) | Analytics |
| 10 | Validare juridică a paginilor legale | — | Lansare |
| 11 | **Decizia privind crawlerele AI** | `src/app/robots.ts` le permite explicit | Vezi mai jos |
| 13 | Locația sesiunilor | FAQ spune deja „online sau față în față, în Timișoara" | De confirmat |

> ### ⚠️ Decizie deschisă: crawlerele AI
>
> `src/app/robots.ts` permite explicit GPTBot, ClaudeBot, Claude-Web, PerplexityBot,
> Google-Extended, CCBot. Este premisa întregii părți de AEO din ofertă.
>
> Promptul cere **confirmare scrisă de la clientă** înainte de lansare. Blocarea lor
> este o alegere legitimă, dar anulează AEO și trebuie reflectată în ofertă.
> Fișierul conține un comentariu vizibil cu acest avertisment.

---

## 8. Buget de JS depășit — decizie de echipă, nu bug

| | gzip |
|---|---|
| Buget din brief §10.1 | ≤ 110 KB |
| **Măsurat** (Turbopack) | **~142 KB** |
| Măsurat (webpack, comparație) | ~140 KB |
| din care codul aplicației | ~12 KB |
| din care React 19 + runtime App Router | ~126 KB |

Chunk-ul de polyfill-uri (39 KB gz) are `noModule` — browserele moderne nu îl descarcă
și nu intră în calcul.

~126 KB din 142 sunt podeaua Next 16 + React 19 cu App Router. **Nu se optimizează** —
ar cere renunțarea la App Router. Ori se ajustează bugetul la ~150 KB, ori se
reevaluează stack-ul. Nu blochează Lighthouse Performance (scripturile sunt `async`,
în afara căii LCP), dar trebuie decis explicit, nu ignorat.

Cum se remăsoară:

```bash
pnpm build && pnpm start -p 3000
curl -s http://localhost:3000/ -o /tmp/h.html
# apoi însumează, gzip-at, doar <script src> FĂRĂ atributul noModule
```

---

## 9. Abateri conștiente de la literă

Cinci, toate documentate în cod prin comentarii:

1. **„Perspective" → „Blog" în navigație** (`src/content/site.ts`).
   Header-ul demo-ului scria „Perspective", dar footerul aceluiași demo și brief §4.3
   impun „Blog" în navigație și rute (cerință de proiect + SEO). Am ales forma
   consecventă.
2. **Header fără stare de scroll** (`src/components/layout/Header.tsx`).
   Brief §5.6 descria transparent → paper după 80px. Designul aprobat (v3) l-a
   simplificat la translucid permanent. Am implementat varianta aprobată; economisește
   un Client Component.
3. **`ac-accent-deep` pe `cream-100`** (`src/components/ui/Eyebrow.tsx`).
   Designul folosește `#7A6038` pentru etichetele în accent. Măsurat: 5.44:1 pe
   `paper`, 4.98:1 pe `cream-50` — ambele trec AA — dar **4.31:1 pe `cream-100`**,
   sub prag. Doar acolo (secțiunea `cta`) folosim `#6B5430` (5.22:1). Designul
   însuși îl folosește deja în 10 locuri: etichetele de slot de imagine și pachetul
   evidențiat din `servicii`.

4. **`line-height` normalizat pe h3** (`src/app/globals.css`).
   Exportul designului e inconsecvent: aceeași mărime de h3 apare de 6 ori, de 3 ori
   cu `line-height` și de 3 ori fără. Tokenii impun o singură valoare. Diferența față
   de `normal` la Cormorant e sub 0.5px pe rând și explică toate abaterile de 1–2px
   din §6.

5. **`Reveal` este Server Component** (`src/components/ui/Reveal.tsx`).
   Promptul cerea Client Component cu IntersectionObserver propriu. Un observer per
   element ar însemna sute de instanțe și un `use client` pe fiecare secțiune.
   Rezultatul vizual e identic; costul în JS pe browsere moderne e zero.

De asemenea: ancorele din navigație reproduc demo-ul aprobat, care este o pagină unică.
Se înlocuiesc cu rutele reale la faza 3b.

---

## 10. Capcane deja rezolvate — nu le reintroduce

| Problemă | Cauză | Soluție aplicată |
|---|---|---|
| `/robots.txt` returna 404 | `robots.ts` în grupul `(frontend)` nu era compilat | Mutat la `src/app/robots.ts`. `sitemap.ts` funcționează din grup. |
| 404-ul implicit al Next, în engleză | Layout-ul rădăcină e în `(frontend)`, deci rutele nematchuite nu-l primesc | `src/app/(frontend)/[...notFound]/page.tsx` apelează `notFound()` |
| Conținut invizibil cu JS oprit | Fallback-ul de reveal ascundea elementele necondiționat | Ascunderea e condiționată de `<html data-ac-reveal="js">`, pus de script din `<head>` |
| `max-w-prose` suprascria un default Tailwind | Token numit `--container-prose` | Redenumit `--container-narrow` |
| Warning la build pe `Cache-Control` | Override pe `/_next/static/media` | Eliminat — Next livrează deja `immutable` |
| „Hidratarea nu funcționează": meniul mobil nu se deschide, bara de consimțământ nu apare | În `next dev`, dacă deschizi site-ul prin altceva decât `localhost` (IP de rețea, tunel), Next blochează resursele de dev cross-origin. Mesajul apare **doar în logul serverului** | Testează hidratarea pe `pnpm build && pnpm start`, sau adaugă `allowedDevOrigins` în `next.config.ts`. Nu e un bug al site-ului |
| Etichetele mici, cu ~3px mai înalte decât în design | Preflight-ul Tailwind pune `line-height: 1.5` pe `html`; resetul designului nu pune nimic, deci tot ce moștenește rulează pe `normal` | `line-height: normal` pe `html`. Nu pune `line-height` pe tokenii de etichetă: designul n-are niciunul |
| Link-uri de text mai înalte decât în design | Tokenii `text-body*` aduc `line-height: 1.8`, corect pentru paragrafe, greșit pentru linkuri | `TextLink` are deja `leading-[normal]`. Nu-l adăuga la fiecare apel |
| CLAUDE.md apare modificat după `next dev` | Next adaugă singur blocul `nextjs-agent-rules` | Se comite odată cu restul; se dezactivează cu `agentRules: false` în `next.config.ts` |

---

## 11. Structura repo-ului

```
adriana-chira-repo/
├─ design/
│  ├─ homepage-approved.html      ← NU se șterge, NU se modifică
│  └─ compare/                   ← harnessul de comparație vizuală (§6)
├─ public/images/adriana-portret.jpg
├─ src/
│  ├─ app/
│  │  ├─ globals.css               ← TOȚI tokenii, în @theme
│  │  ├─ fonts.ts
│  │  ├─ robots.ts                 ← la rădăcină, nu în grup
│  │  └─ (frontend)/
│  │     ├─ layout.tsx             ← layout rădăcină
│  │     ├─ page.tsx               ← homepage
│  │     ├─ not-found.tsx
│  │     ├─ [...notFound]/page.tsx
│  │     ├─ sitemap.ts
│  │     ├─ llms.txt/route.ts
│  │     └─ opengraph-image.tsx
│  ├─ components/{layout,sections,ui,consent,seo}/
│  ├─ content/                     types.ts · site.ts · home.ts
│  └─ lib/                         content.ts · consent.ts · schema.ts · cn.ts
├─ README.md                       ← prezentare pentru echipă
└─ STATUS.md                       ← acest fișier
```

Directoare care **vor** apărea la faza 2: `src/app/(payload)/`, `src/collections/`,
`src/globals/`, `src/emails/`, `src/payload.config.ts`.

---

## 12. Când termini o bucată de lucru

1. Rulează verificările fazei din `../03-PROMPT-CLAUDE-CODE.md`.
2. `pnpm build && pnpm typecheck` — ambele trebuie să treacă curat.
3. `grep -rn "ş\|ţ" src/` — zero rezultate.
4. **Actualizează acest fișier:** mută ce ai făcut din §5 în §4, actualizează data și
   commit-ul din antet, adaugă în §10 orice capcană nouă pe care ai rezolvat-o.
5. Commit mic, cu mesaj descriptiv în română.

---

*Website Factory · Pixel Factory SRL · Timișoara*
