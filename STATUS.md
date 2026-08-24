# STATUS — adrianachira.ro

**Document de predare între sesiuni.** Dacă intri în proiect fără context, citește
acest fișier primul și integral. Descrie ce există, ce nu există, ce e blocat și care
e următorul pas concret.

| | |
|---|---|
| Ultima actualizare | **24 august 2026** |
| Stadiu general | Fazele 1, 2 și 3b complete · **site-ul are toate cele 15 rute publice** · homepage neatins la nivel de text · aura de secțiune și lumina paginii adăugate · fazele 4–7 neîncepute |
| Build | ✅ trece (`pnpm build`, `pnpm typecheck`, `pnpm verify:faza2` 10/10) |
| Ultimul commit | `a49f8b4` — Lumina paginii: un corp de lumină care traversează pagina la derulare |

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
   în fișier. Astăzi există exact PATRU componente de client în tot site-ul (vezi §4).
3. **Zero bibliotecă de animație.** CSS + un singur IntersectionObserver global.
4. **Zero bibliotecă de componente.** Fără shadcn, MUI, Radix. Se scriu de mână.
5. **Zero valori Tailwind implicite** (`gray-900`, `rounded-lg`, `shadow-md`).
   Toate valorile vin din tokenii din `src/app/globals.css`.
6. **Fără terți înainte de consimțământ.** Niciunul. Verifici în Network, nu presupui.
7. **Prețurile se citesc pe server.** Niciodată din client.
8. **TypeScript strict.** Zero `any`, zero `@ts-ignore`.
9. **Admin Payload în română.** Fiecare etichetă, descriere, mesaj de eroare.
10. **Diacritice cu virgulă:** `ș` (U+0219), `ț` (U+021B). Niciodată sedila `ş`/`ţ`.
    Verifică înainte de commit: `grep -rn "ş\|ţ" src/ scripts/` trebuie să dea zero.
11. **Fără date reale de client** în seed sau fixtures.
12. La final de fază: **oprește-te, rulează verificările fazei, raportează.**

---

## 3. Stack și comenzi

```
Next 16.3.1 · React 19.2.8 · Tailwind 4.3.3 · TypeScript 7 · pnpm 10.34.5
Payload 3.88.0 (+ db-postgres, next, richtext-lexical, storage-vercel-blob,
translations) · Stripe 22.5.0 · Zod 4.4.3 · Postgres 17
```

Zod se importă **exclusiv ca `zod/mini`**, niciodată ca `zod` — vezi §9.11.
Emailurile nu au SDK: `src/lib/email.ts` cheamă API-ul HTTP al Resend cu `fetch`.

Versiunile `next`, `react`, `react-dom`, `tailwindcss`, `stripe` și **toate** pachetele
`payload*` sunt **fixate exact**, fără caret — compatibilitatea Payload ↔ Next este
strictă și un minor necontrolat rupe build-ul.

`package.json` are `"type": "module"`. Fără el, CLI-ul Payload transpilează
`payload.config.ts` ca CommonJS și cade cu `ERR_REQUIRE_ASYNC_MODULE`.

### Pornirea de la zero

```bash
pnpm install
cp .env.example .env.local     # completează PAYLOAD_SECRET și DATABASE_URI
pnpm db:up                     # Postgres 17 în Docker, pe 127.0.0.1:5432
pnpm migrate                   # creează schema
pnpm seed                      # populează conținutul aprobat
pnpm dev                       # http://localhost:3000 · admin la /admin
```

### Comenzi

```bash
pnpm dev · pnpm build · pnpm start · pnpm typecheck

pnpm db:up / db:down       # baza de date locală (docker-compose.yml)
pnpm seed                  # idempotent; rulează oricând
pnpm migrate               # aplică migrațiile
pnpm migrate:create <nume> # generează o migrație nouă
pnpm migrate:fix           # repară importurile din migrațiile generate (vezi §10)
pnpm generate:types        # src/payload-types.ts, după orice schimbare de schemă
pnpm generate:importmap    # după adăugarea unei componente proprii în admin
pnpm verify:faza2          # verificările de acceptanță ale fazei 2
pnpm build:deploy          # migrate:fix + migrate + build — comanda de build pe Vercel
```

> **Pe Vercel, comanda de build este `pnpm build:deploy`, nu `pnpm build`.**
> În producție `push` este dezactivat, deci schema vine exclusiv din migrații.

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
| `SectionAura` | Server Component; stratul de atenție al secțiunii, pornit din `Section` prin `aura="…"`. Vezi mai jos |
| `PageLight` | Server Component; corpul de lumină care traversează pagina la derulare. Montat o singură dată, în layout |
| `Veil` | Server Component; obiectul de abur care însoțește cititorul. Singurul strat decorativ care stă **peste** conținut |
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

**Componente de client — exact patru în tot site-ul.** Dacă adaugi a cincea,
justifică în comentariu, în fișier. Trei dintre ele sunt pe lista din promptul §5.1;
a patra, `CopyLinkButton`, nu este — de aceea are justificarea din §9.10:

| Componentă | Unde | De ce nu poate fi pe server |
|---|---|---|
| `MobileNav` | pe toate paginile | stare deschis/închis, Escape, blocare de scroll |
| `ConsentBanner` | pe toate paginile | scrie cookie și schimbă starea Consent Mode |
| `ContactForm` | `/contact` | validare pe client, stări de trimitere, `aria-live` |
| `CopyLinkButton` | `/blog/[slug]` | `navigator.clipboard`; ~700 B, vezi §9.10 |

Header-ul a rămas pe server pentru că designul v3 nu are stare de scroll.
Link-ul „Setări cookie-uri" din footer funcționează prin delegare pe
`[data-consent-open]`, deci footerul rămâne Server Component.

### Aura de secțiune ✅

Singurul strat vizual din site care **nu** vine din designul aprobat. E un sistem de
atenție, nu decor: un câmp de lumină caldă se aprinde când secțiunea urcă spre centrul
ecranului, ține un platou cât o traversează, apoi se stinge — atenția coboară odată cu
cititorul. Pe hero se trezește la încărcare, cu ~260ms după primul rând de titlu.

- `src/components/ui/SectionAura.tsx` — Server Component, **zero JavaScript**.
  Preseturile (poziție, rază, intensitate, greutatea aurului) sunt date, nu CSS.
- Blocul „AURĂ DE SECȚIUNE" din `globals.css` — gradient radial, niciodată
  `filter: blur()`. Mișcarea vine din `animation-timeline: view()` unde există; pe
  restul browserelor rămâne aură statică. Decorul nu depinde de JS.
- Pusă pe **cinci** secțiuni, nu pe toate: `hero`, `metoda`, `citat`, `servicii`,
  `cta`. Un semnal folosit peste tot nu mai e semnal.
- Se stinge pe tot site-ul dintr-un singur loc: `--ac-aura-gain: 0`.
- `prefers-reduced-motion` o lasă ca atmosferă, nemișcată și la jumătate din
  intensitate.

Regula de contrast care fixează plafoanele: miezul e alb cald și **ridică** luminanța,
deci textul închis câștigă contrast; haloul e accentul și o **scade**. De aceea pe
hârtie greutatea aurului stă la ~0.3–0.6, iar la greutate plină merge doar pe blocul
întunecat de citat, unde textul are ~17:1 de cheltuit. Măsura care dă plafonul e
`--ac-ink-50` la 11px: stă pe `--ac-paper` la 4.64:1, adică la 0.14 peste AA.
Preseturile țin acele etichete **în afara** inelului de accent, nu doar la intensitate
mică.

### Lumina paginii ✅

Al doilea strat vizual care nu vine din designul aprobat, și perechea aurei la altă
scară. Aura aparține unei secțiuni; lumina asta nu aparține niciuneia: e fixată de
ecran și **traversează pagina odată cu derularea**, ca o singură sursă care însoțește
lectura de la primul rând până la subsol. Aura spune „aici încetinește", lumina spune
„mai e drum".

- `src/components/ui/PageLight.tsx` — Server Component, un singur nod, **zero JS**.
- Blocul „LUMINA PAGINII" din `globals.css` — traseul pe `animation-timeline:
  scroll(root)`, deci **o mută cititorul, nu se mișcă singură**: dacă pagina stă, stă
  și ea. Peste traseu rulează o respirație lentă, în timp, ca să rămână vie la oprire.
- Stă la `z-index: -1`, adică **sub fundalurile secțiunilor**. Secțiunile `paper` n-au
  fundal propriu, deci lumina se vede prin ele; blocurile crem și cel întunecat sunt
  opace și o ascund. E efectul dorit: blocurile colorate sunt materie, lumina trece pe
  după ele. Consecința importantă — **nu trece niciodată peste litere.**
- Se stinge de tot dintr-un singur loc: `--ac-light-gain: 0`.
- `prefers-reduced-motion`: rămâne, dar nu mai călătorește și nu mai respiră — se
  așază în centru, la jumătate de intensitate.

**Plafonul de contrast, măsurat în pagină** (nu estimat), pe cazul cel mai prost:
`--ac-ink-50` la 11px pe `--ac-paper`, care pornește de la **4.64:1**, la 0.14 peste AA.
Lumina schimbă doar fundalul de sub text, nu și culoarea literelor, deci contează doar
cât întunecă hârtia:

| Halou peste hârtie | Aur curat (`--ac-accent`) | Aur amestecat 50/50 cu alb cald |
|---|---|---|
| 3 % | 4.54:1 ✅ | — |
| 4 % | 4.51:1 ✅ la limită | 4.58:1 ✅ |
| 4.5 % | **4.49:1 ❌** | — |
| 6 % | 4.45:1 ❌ | 4.55:1 ✅ |
| 8 % | — | 4.52:1 ✅ |
| 10 % | 4.33:1 ❌ | **4.49:1 ❌** |

De aici cele două decizii de rețetă: haloul **nu** e aur curat, ci aur încălzit cu miez
(`--ac-light-halo`), care rezistă la dublul intensității la același prag; și corpul
luminii se construiește din **miez**, nu din halou — miezul e alb cald, ridică
luminanța hârtiei, deci textul închis câștigă contrast și poate urca la 96% fără cost.
Aici haloul stă la 4.2 % efectiv, cu marjă păstrată pentru aura care se poate suprapune.

### Voalul ✅

Al treilea strat din afara designului aprobat, și singurul care e un **obiect**, nu
atmosferă. Un corp de abur translucid, fixat de ecran, care însoțește cititorul prin
toată pagina. Nu e mascotă, nu e buton, n-are text și nu duce nicăieri: rolul lui e
prezență, nu instrucțiune.

Cele trei straturi decorative, ca să nu fie confundate:

| | `PageLight` | `SectionAura` | `Veil` |
|---|---|---|---|
| Ce e | atmosferă | semnal de atenție | obiect |
| Unde stă | **sub** fundaluri | sub conținut, în secțiune | **peste** conținut |
| Mărime | mare, difuz, fără contur | mare, difuz | mic, cu contur și volum |
| Ce îl mișcă | derularea | secțiunea care intră în ecran | derularea + plutire proprie |

- `src/components/ui/Veil.tsx` — Server Component, **zero JS**.
- Blocul „VOALUL" din `globals.css`. Ce îl face să pară fizic: `backdrop-filter`
  (refractă efectiv ce e în spate — diferența dintre desen și corp), lumina care vine
  dintr-o direcție (reflex sus-stânga, umbră caldă jos-dreapta, inel de margine) și
  forma care se transformă lent, în loc de cerc perfect.
- Patru mișcări, cu durate fără numitor comun — 13s plutire, 19s respirație, 23s
  schimbare de formă, 31s rotația reflexului. Dacă s-ar sincroniza, ochiul ar prinde
  un puls, iar pulsul citește ca ceas, nu ca prezență.
- `pointer-events: none`, verificat: `elementFromPoint` din centrul lui returnează
  elementul de dedesubt, nu voalul.
- Se retrage complet (`display: none`) cât timp bara de consimțământ sau meniul mobil
  sunt deschise — prin `:has()` pe `body`, fără ascultători de evenimente.
- Se stinge dintr-un singur loc: `--ac-veil-gain: 0`.

**De ce iese din cadru, și nu stă frumos în colț.** Stând peste conținut, e singurul
strat care poate strica lizibilitatea: `backdrop-filter` înceață ce e sub el. Măsurat
la 1440px, așezat complet în pagină intra **~100px în coloana de text**. Gutterul are
24–88px, iar voalul 84–132px, deci nu încape niciodată întreg în margine. Soluția:
iese 45% din cadru, iar deriva pe orizontală are toate valorile ≤ 0 — nu se poate
apropia de text nici în repaus, nici în vreun punct al derulării. **Verificat la
1440px: marginea voalului 71px, textul începe la 72px.**

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

### Faza 2 — Payload CMS ✅

Baza de date locală rulează în **Docker** (`docker-compose.yml`, Postgres 17 pe
`127.0.0.1:5432`). Asta a deblocat faza: nu mai depinde de credențiale de la clientă.

**Colecții** — `src/collections/`, toate cu etichete și descrieri în română:

| Colecție | Ce ține | Cine o vede |
|---|---|---|
| `posts` | articolele; ciorne + versionare, `readingTime` calculat în hook | public doar `published` |
| `categories` | Performanță, Decizie, Perspectivă, Mindset | public |
| `packages` | pachetele, cu sincronizare Stripe la salvare | public doar `active` |
| `faqs` | întrebările, cu tabelul comparativ opțional | public |
| `media` | fișierele; `alt` **blocant** | public |
| `orders` | comenzile — doar citire, doar `admin` | nimeni public |
| `submissions` | mesajele din formular — doar `admin`, retenție 12 luni | nimeni public |
| `users` | `admin` și `editor`; rolul nu se poate schimba de un editor | doar propriul cont |

**Globals** — `src/globals/`: `site-settings` (contact, firmă, social, GA4),
`home-page` (textele celor 12 secțiuni, fiecare cu bifă de vizibilitate),
`about-page` (narațiune, repere, cele 4 principii).

**Panoul este în română integral.** Traducerea oficială `@payloadcms/translations`
acoperă interfața; trei șiruri ale ei foloseau sedila și unul avea substituenții
traduși (deci nu se completa) — sunt corectate în `src/payload.config.ts`.
`pnpm verify:faza2` verifică automat că **niciun** câmp nu rămâne fără etichetă
scrisă de noi (Payload i-ar genera una în engleză din numele câmpului).

**Stocarea fișierelor:** Vercel Blob când există `BLOB_READ_WRITE_TOKEN`, altfel disc
local în `public/media/` (gitignorat). Comutarea se face doar în `payload.config.ts`.

**Sincronizarea prețurilor cu Stripe** — `src/lib/stripe.ts` + hook `afterChange` pe
`packages`. Idempotentă (compară suma cu Price-ul activ înainte de a atinge Stripe),
creează un Price nou și îl arhivează pe cel vechi (prețurile Stripe sunt imutabile) și
**nu blochează salvarea** dacă Stripe e indisponibil sau cheia lipsește — pachetul
rămâne marcat „Nesincronizat". Fără cheie, azi, ramura normală este exact aceasta.

**Revalidarea** — `src/hooks/revalidate.ts`. Payload rulează în același proces cu Next,
deci hook-urile cheamă direct `revalidatePath`. De asta **nu** există `/api/revalidate`
cu secret: ruta aceea are rost doar cu CMS-ul găzduit separat.

#### Conectarea cu conținutul — cum funcționează îmbinarea

`src/lib/content.ts` a rămas singurul loc care știe de unde vine conținutul, iar
semnătura funcțiilor nu s-a schimbat. Regula de îmbinare:

> **CMS-ul are întâietate, dar numai unde chiar a fost completat.** Orice câmp gol,
> `null` sau listă goală cade pe `src/content/`, adică pe textul verificat nod-cu-nod
> față de designul aprobat.

Nu e o precauție teoretică: un global Payload se creează cu toate câmpurile `null`, iar
fără regula asta prima secțiune neatinsă ar goli pagina. Cel mai rău caz — baza de date
oprită, CMS gol, migrare pe jumătate — dă exact pagina din design. Verificat: cu
`DATABASE_URI` gol, `getPayloadClientSafe()` întoarce `null`, build-ul trece și pagina
se randează din fallback.

`src/content/home.ts` și `src/content/site.ts` **nu se șterg.** Sunt și fallback-ul, și
sursa din care seed-ul populează CMS-ul — de aceea textele nu pot devia unul de altul.

#### Seed

`pnpm seed`, idempotent, construit **din** `src/content/`. Populează 4 categorii,
6 întrebări (cu tabelul comparativ), 3 pachete, 3 articole, cele trei globals și, la
prima rulare, contul de administrator (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`; fără
ele generează o parolă aleatoare și o afișează o dată).

Două lucruri sunt intenționat **ascunse**, ca pagina să rămână identică cu designul:

- **pachetele au `active: false`** — numele și prețurile nu sunt decise (§7.1). Câtă
  vreme sunt ascunse, cardurile afișează placeholderele din design, `[ Nume pachet ]`
  și `[ 000 ] EUR`. Prima bifă „Vizibil pe site" le aduce în pagină.
- **articolele sunt ciorne** — titlurile și rezumatele vin din design, textul nu a fost
  livrat. Ciornele nu sunt publice, deci secțiunea Blog rămâne cea aprobată.

Pachetele și articolele se creează o singură dată (`createOnly`): a doua rulare nu
suprascrie ce a început clienta să completeze.

### Faza 3b — Paginile interioare ✅

Site-ul are acum **15 rute publice**. Navigația a trecut de la ancore la rute reale,
dintr-un singur loc (`src/content/site.ts`).

| Rută | Ce e | Randare |
|---|---|---|
| `/despre` | narațiune + repere + 4 principii + CTA dublu | static |
| `/servicii` | grila de pachete, bandă de reasigurare, FAQ comercial | ISR 1h |
| `/servicii/[slug]` | detaliu, coloană de achiziție sticky, FAQ, pachete conexe | SSG + ISR |
| `/blog` · `/blog/pagina/[numar]` | grilă, filtre de categorie, paginare la 9 | SSG + ISR |
| `/blog/[slug]` | articol pe 68ch, cuprins, semnătură, share, conexe | SSG + ISR |
| `/blog/categorie/[slug]` (+ `/pagina/[numar]`) | aceeași grilă, filtrată | SSG + ISR |
| `/contact` | formular + date de contact + programare | dinamic (`?pachet=`) |
| `/multumim` · `/comanda-anulata` | confirmare și anulare, ambele `noindex` | dinamic |
| 4 pagini legale | cuprins lateral, secțiuni, date de identificare | static |

**Componente noi, toate pe server:** `PageHeader`, `PageCta`, `Breadcrumb`,
`Pagination`, `BlogIndex`, `LegalDocument`, `RichText`, `ShareRow`.

**Trei componente au fost EXTRASE din secțiunile de homepage**, ca `/servicii`,
`/blog` și paginile de articol să randeze exact același card: `ui/PackageCard`,
`ui/FaqList`, `ui/PostCard`. Markup-ul nu s-a schimbat cu un caracter — verificat
prin diff, vezi §6.

**`RichText`** (`src/components/ui/RichText.tsx`) randează Lexical → JSX pe server.
Payload livrează un pachet gata făcut (`@payloadcms/richtext-lexical/react`), dar
acela intră în bundle-ul de client; aici arborele e doar JSON și transformarea lui
nu costă niciun octet în browser. Nodurile necunoscute nu aruncă: li se randează
copiii. Tipografia de articol e `@utility ac-prose` din `globals.css` — singurul
bloc de stil care NU vine din designul aprobat, pentru că designul e o pagină unică
și nu conține corp de articol.

**Cuprinsul articolelor** apare de la 4 titluri `h2` în sus. Ancorele se calculează
de aceeași funcție care le pune pe titluri (`headingAnchors` / `RichText`), deci nu
pot devia.

**Legăturile interne obligatorii** (brief §9.3): fiecare articol trebuie să trimită
cel puțin o dată spre un pachet și o dată spre `/despre`. `collectLinkTargets()`
citește arborele Lexical; ce lipsește din text, componenta adaugă în blocul „Mai
departe" de la final. Nu e opțional — e mecanismul prin care blogul aduce conversii.

**Formularul de contact** — `src/components/contact/ContactForm.tsx` +
`src/app/api/contact/route.ts`:

- Schemă unică, `src/lib/validation/contact.ts`, importată și de client, și de rută.
- Câmpuri: nume, email, telefon opțional, mesaj, bifă **neprebifată**. Nimic în plus.
- Anti-spam: honeypot + limitare de rată 5 cereri / 10 minute pe IP. **Fără reCAPTCHA.**
- Ordinea pe server: limitare → validare → **salvare în `submissions`** → notificare
  pe email. Emailul e ultimul intenționat: dacă pică, mesajul e deja în siguranță.
- Stări accesibile: `aria-invalid` + `aria-describedby` pe câmpuri, `aria-live` pe
  mesajul de răspuns, focus mutat pe primul câmp greșit, buton dezactivat la trimitere.

**Al patrulea Client Component** din tot site-ul este `CopyLinkButton` (~700 B), pentru
butonul „Copiază adresa" din blocul de partajare. Restul butoanelor de share sunt
`<a>`-uri obișnuite, randate pe server, fără niciun script terț. Vezi §9.10.

**SEO:** `src/lib/seo.ts` — `pageMetadata()` este singurul loc care știe regula
„valorile din admin au întâietate, restul din document", inclusiv `noindex`. Fiecare
pagină are canonical, OG, breadcrumb vizibil ȘI `BreadcrumbList` construit din
aceeași listă.

---

## 5. CE NU ESTE FĂCUT

### Faza 4 — Stripe ⏳ **următorul pas recomandat**

Lipsesc `/api/stripe/checkout`, `/api/stripe/webhook` și emailurile de comandă.
Există deja: clientul Stripe (`src/lib/stripe.ts`), sincronizarea prețurilor, colecția
`orders` cu `stripeSessionId` **unic la nivel de bază de date** — cheia de idempotență
a webhook-ului, pentru că Stripe reîncearcă livrarea evenimentelor — și câmpurile
`packageNameSnapshot` / `amount`, copii, nu relații live.

Prețul se citește **doar pe server**, din `packages.price`, niciodată din client.

Trei lucruri sunt deja pregătite pentru faza 4 și așteaptă doar cheia:

- `src/lib/email.ts` — trimite prin API-ul HTTP al Resend, fără SDK. Fără
  `RESEND_API_KEY` se întoarce `skipped`, nu aruncă.
- `/multumim` verifică `session_id` la Stripe, pe server. Fără cheie, afișează
  varianta neutră: nu pretinde niciodată o plată neconfirmată.
- `/comanda-anulata` citește `?pachet=` și trimite înapoi exact la pachetul respectiv.

**Un singur loc de înlocuit în UI:** butonul „Vreau acest pachet" din
`src/app/(frontend)/servicii/[slug]/page.tsx` duce azi la `/contact?pachet=<slug>`.
Acolo intră `CheckoutButton`. Comentariul e în fișier.

### Faza 5b — SEO pentru restul site-ului ⏳

Făcute la faza 3b: `sitemap.ts` cu articole, categorii, pachete și paginile legale
(`lastModified` real din `updatedAt`), plus `Article`, `Service`, `BreadcrumbList`,
`ProfilePage`, `ContactPage`, `CollectionPage` în `src/lib/schema.ts`.

**Rămâne `rss.xml`.**

### Faza 6b — Conformitate ⏳

Cele patru pagini legale **există și au conținut**, dar textul e un draft nevalidat
juridic — vezi §7.10 și comutatorul `LEGAL_DRAFT` din `src/content/pages.ts`.

Rămân: validarea de către un jurist, completarea datelor de firmă și evenimentele
GA4 (`view_package`, `begin_checkout`, `purchase`, …).

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
| `pnpm verify:faza2` — cele 4 criterii din prompt + 6 verificări de acces | ✅ 10/10 |
| `pnpm seed` rulat de trei ori la rând | ✅ zero duplicate, zero suprascrieri |
| Migrație aplicată pe bază de date curată, apoi seed | ✅ |
| **Pagina randată din CMS vs. pagina din fallback** | ✅ HTML identic, vezi mai jos |
| **Homepage, HEAD vs. faza 3b** | ✅ 11 diferențe, toate ancore→rute; text identic la caracter |
| Cele 15 rute publice răspund 200 | ✅ |
| `/blog/inexistent`, `/servicii/inexistent`, `/blog/pagina/1` | ✅ 404 |
| Formularul de contact, în browser, pe build de producție | ✅ trimite, salvează, confirmă |
| Formular: date invalide, honeypot, limitare de rată | ✅ 400 / 400 / 429 |
| Ordinea de tabulare pe o pagină interioară | ✅ 28 elemente, fără capcane |
| `/sitemap.xml`, `/llms.txt` după faza 3b | ✅ toate rutele noi |

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

### ✅ CMS-ul nu schimbă pagina aprobată — verificat prin diff

Riscul real al fazei 2 nu e ca ceva să nu meargă, ci ca pagina verificată la px să se
schimbe pe tăcute. Verificarea: două build-uri de producție, unul cu `DATABASE_URI`
setat (conținut din Payload) și unul cu el gol (conținut din `src/content/`), apoi
diff pe HTML-ul livrat de `/`.

**Rezultat: HTML vizibil identic, text identic (9621 de caractere).** Singurele
diferențe sunt blocurile `self.__next_f.push(...)`, adică payload-ul RSC de hidratare,
pe care React îl împarte altfel de la un build la altul, plus atributul `crossorigin`
pus inconsecvent pe un `<script>`.

Testul a și găsit o regresie, înainte de a fi comisă: globalul modela titlul din hero
pe **două** rânduri (`heroHeadlineLine1/2`, cum sugera promptul §4.2), iar designul are
**trei**. Randarea din CMS pierdea rândul „ce ai de făcut.". Câmpul a devenit o listă
cu `minRows: 3, maxRows: 3` — numărul de rânduri e parte din design, nu preferință.

Reproducere:

```bash
pnpm build && pnpm start -p 3210          # cu baza de date
DATABASE_URI="" pnpm build && DATABASE_URI="" pnpm start -p 3211
# apoi curl pe ambele și diff, ignorând <script>self.__next_f.push(...)</script>
```

### ✅ Faza 3b nu a atins homepage-ul — verificat prin diff

Faza 3b a scos trei componente din secțiunile de homepage (`PackageCard`, `FaqList`,
`PostCard`) ca să fie folosite și de paginile noi. O extragere „curată" care mută o
virgulă de spațiere ar strica fidelitatea la pixel obținută anterior, fără ca nimeni
să observe.

Metoda: build de producție pe `HEAD`, build de producție pe faza 3b, `curl` pe `/`
în ambele, diff după normalizarea payload-ului RSC și a hash-urilor de chunk.

**Rezultat: 901 linii în ambele, 11 diferențe — toate cele 11 sunt schimbarea
ancoră → rută din navigație și subsol** (`#despre` → `/despre` etc.), plus ordinea
atributelor pe care o schimbă `next/link`. Textul vizibil este identic la caracter:
**9621 de caractere în ambele**, exact cifra din verificarea anterioară.

Cu alte cuvinte: comparația la pixel de mai sus rămâne valabilă, nu trebuie refăcută.

Reproducere:

```bash
pnpm build && pnpm start -p 3210 && curl -s http://127.0.0.1:3210/ -o dupa.html
git stash -u && pnpm build && pnpm start -p 3211 && curl -s http://127.0.0.1:3211/ -o inainte.html
git stash pop
# apoi diff, ignorând <script>self.__next_f.push(...)</script> și /_next/static/*
```

---

### ✅ Aura nu a mișcat niciun text — verificat prin diff

Aura e singura adăugire peste designul verificat la pixel, deci trebuia dovedit că nu
atinge nimic. Metoda din §12.5: build de producție pe `HEAD`, build de producție cu
aura, `curl` pe `/` în ambele, diff după normalizarea payload-ului RSC și a hash-urilor
de chunk.

**Rezultat: 44 de linii diferite, toate nodurile de aură** — pe cele cinci secțiuni,
`class` primește `relative isolate` și apare un `<div aria-hidden>` cu câmpurile.
Niciun nod de text nu s-a mutat: **text vizibil identic la caracter, 9692 în ambele.**
Stratul e `position: absolute`, în afara fluxului, deci înălțimile secțiunilor rămân
cele din comparația de mai sus și **aceasta nu trebuie refăcută.**

Verificat și în browser, pe build de producție, la 1440px: hero, citat, servicii și
CTA se aprind cum sunt descrise, iar `CSS.supports('animation-timeline: view()')` e
`true` pe Chrome-ul de pe mașina de lucru.

### ✅ Lumina paginii nu a mișcat niciun text — verificat prin diff

Aceeași metodă ca la aură (§12.5): build de producție pe `HEAD`, build de producție cu
lumina, `curl` pe `/` în ambele, diff după normalizarea payload-ului RSC și a
hash-urilor de chunk.

**Rezultat: două linii în plus, exact nodul luminii** (`<div data-page-light>` la
nivelul lui `<body>`), plus o singură diferență colaterală — hash-ul `useId` al
meniului mobil (`_R_iivb_` → `_R_mivb_`), care se schimbă pentru că arborele React a
câștigat un nod. **Text vizibil identic la caracter: 9692 în ambele.**

Fiind `position: fixed`, stratul e în afara fluxului: înălțimile secțiunilor rămân
cele din comparația la pixel, care **nu trebuie refăcută**.

### ✅ Voalul nu a mișcat niciun text — verificat prin diff

Aceeași metodă (§12.5). **Rezultat: opt linii în plus, exact nodurile voalului**
(`<div data-veil>` cu corpul, pielea și reflexul), nimic altceva. **Text vizibil
identic la caracter: 9692 în ambele.** Fiind `position: fixed`, e în afara fluxului.

---

## 7. Blocaje și decizii care așteaptă clienta

Din brief §13. **Toate se completează acum din panoul de administrare**, fără cod și
fără redeploy: globalul `site-settings` pentru datele de contact și firmă, colecția
`packages` pentru pachete. Valorile din `src/content/site.ts` rămân doar ca rezervă.

| # | Element | Cum se manifestă în cod acum | Blochează |
|---|---|---|---|
| 1 | **Pachetele de servicii** — nume, conținut, durată, preț | Există 3 pachete în CMS, ascunse (`active: false`), cu text `[ DE COMPLETAT ]`. Homepage-ul și `/servicii` randează placeholderele din design. **Cât timp sunt ascunse, `/servicii/[slug]` nu are nicio rută** — `generateStaticParams` întoarce listă goală și orice slug dă 404, corect. Prima bifă „Vizibil pe site" aduce pachetul și în listă, și pe pagina lui. | Faza 4 (Stripe), paginile de pachet |
| 2 | **Portret profesional** | Se folosește `public/images/adriana-portret.jpg` din pachetul de design. `ImageSlot` fixează raportul → CLS 0 la înlocuire. | Calitatea hero-ului |
| 3 | Domeniul | `NEXT_PUBLIC_SITE_URL` are ca implicit `https://adrianachira.ro` | Deploy, canonical |
| 4 | Email, telefon | Footerul, pagina de contact, `/multumim` și paginile legale afișează `[ email ]`, `[ telefon ]`. Formularul funcționează oricum: mesajele ajung în `submissions`, în admin | Contact, schema, notificarea pe email |
| 5 | Conturi social media | `[ LinkedIn ]`, `[ Instagram ]`, `[ Facebook ]`; `sameAs` lipsește din `Person` | Schema Person |
| 6 | CUI, reg. com., sediu | Footerul afișează `[ Denumire firmă · CUI · Reg. Com. ]` | ANPC, Termeni |
| 7 | Regim TVA, PFA sau SRL | — | Configurarea Stripe |
| 8 | Cont Stripe | — | Faza 4 |
| 9 | GA4 + Search Console | Se completează în admin, în `site-settings` → Analytics. Gol → GA4 nu se încarcă niciodată (intenționat) | Analytics |
| 10 | **Validare juridică a paginilor legale** | Cele patru pagini EXISTĂ, cu text scris pe situația reală a site-ului, dar marcat vizibil ca draft. Nota se scoate din `LEGAL_DRAFT`, în `src/content/pages.ts` | Lansare |
| 11 | **Decizia privind crawlerele AI** | `src/app/robots.ts` le permite explicit | Vezi mai jos |
| 12 | **Textul celor 3 articole de lansare** | Titlurile, rezumatele și categoriile din design sunt în CMS, ca **ciorne**; corpul e `[ DE COMPLETAT ]`. `/blog` afișează starea goală („Primele articole sunt în lucru"), iar secțiunea Blog de pe homepage rămâne cea din design. Prima publicare le aduce automat în ambele | Conținutul blogului, RSS |
| 13 | Locația sesiunilor | FAQ spune deja „online sau față în față, în Timișoara" | De confirmat |
| 16 | **Link de programare** (Cal.com / Calendly) | `site-settings` → `bookingUrl`. Gol → pagina de contact afișează `[ link de programare ]`. Completat → apare butonul „Vezi intervalele libere" | Programarea directă |
| 14 | **Cont Vercel + `BLOB_READ_WRITE_TOKEN`** | Fără el, fișierele încărcate în admin se salvează pe disc. Local e suficient; pe Vercel filesystem-ul e efemer, deci **imaginile s-ar pierde la fiecare deploy** | Încărcarea de imagini în producție |
| 15 | **Postgres pentru producție** (Neon / Vercel Postgres, string POOLED) | Local rulează în Docker. Producția are nevoie de o bază proprie și de `pnpm build:deploy` ca build command | Deploy |

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
| **Măsurat pe `/`** (Turbopack) | **142.8 KB** |
| Măsurat (webpack, comparație) | ~140 KB |
| din care codul aplicației | ~12 KB |
| din care React 19 + runtime App Router | ~126 KB |

Faza 3b **nu a mișcat cifra de pe `/`**. Celelalte rute, măsurate la fel:

| Rută | gzip |
|---|---|
| `/`, `/blog`, `/despre` | 142.8 KB |
| `/contact` | 150.1 KB — cele 7 KB în plus sunt formularul și schema de validare |
| `/servicii` | 137.3 KB |

Chunk-ul de polyfill-uri (39 KB gz) are `noModule` — browserele moderne nu îl descarcă
și nu intră în calcul.

**Payload nu a schimbat cifra.** Panoul trăiește în grupul `(payload)`, cu layout
rădăcină propriu; JS-ul lui nu ajunge niciodată într-o pagină publică. Nici stratul de
conținut nu adaugă nimic: `src/lib/content.ts` rulează exclusiv pe server.

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

Optsprezece, toate documentate în cod prin comentarii:

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

6. **Titlul din hero este o listă, nu `heroHeadlineLine1/2`** (`src/globals/HomePage.ts`).
   Promptul §4.2 numea două câmpuri; designul are **trei** rânduri, fiecare cu animația
   lui. Am ales lista, cu `minRows: 3, maxRows: 3`. Designul e lege și bate literatura
   promptului. Fără corecție, randarea din CMS pierdea un rând — vezi §6.

7. **Revalidare în proces, fără `/api/revalidate`** (`src/hooks/revalidate.ts`).
   Promptul §2 prevedea o rută cu `REVALIDATE_SECRET`. Payload rulează însă în același
   proces cu Next, deci hook-urile cheamă direct `revalidatePath`: o rută HTTP cu secret
   ar fi un ocol prin rețea către propriul proces. Variabila rămâne în `.env.example`,
   marcată nefolosită, pentru cazul în care CMS-ul se mută pe alt host.

8. **Pachetele și articolele intră ascunse** (`src/seed/index.ts`).
   Promptul cerea trei pachete seed cu text `[ DE COMPLETAT ]`. Vizibile, ar fi înlocuit
   placeholderele din designul aprobat (`[ Nume pachet ]`) cu marcajul nostru de lucru,
   adică o regresie vizuală. Intră cu `active: false`, respectiv ca ciorne; conținutul e
   acolo, în admin, dar pagina rămâne cea aprobată până când cineva le publică.

9. **Tabelul comparativ din FAQ este editabil în CMS** (`src/collections/Faqs.ts`).
   Promptul descria `faqs` cu `question` / `answer` / `page` / `order`. Designul are
   însă un tabel comparativ pe una dintre întrebări, iar acela e fragmentul cel mai
   citabil din pagină pentru AEO. L-am modelat ca grup opțional; resolverul îl afișează
   doar dacă are titlu, coloane și rânduri complete pe toate coloanele.

10. **`CopyLinkButton` este al patrulea Client Component** (`src/components/ui/CopyLinkButton.tsx`).
    Promptul §5.1 enumeră componentele de client permise; aceasta nu e pe listă.
    Copierea în clipboard nu are echivalent declarativ — cere `navigator.clipboard`,
    deci un handler. Costă ~700 B și se randează abia după hidratare: fără JavaScript
    nu apare deloc, pentru că un buton mort e mai rău decât unul absent. Restul
    butoanelor de partajare sunt `<a>`-uri pe server.

11. **`zod/mini`, nu `zod`** (`src/lib/validation/contact.ts`).
    Promptul §5.4 cere Zod pe client și pe server. Schema ajunge în bundle-ul de
    client, iar varianta clasică adăuga **61 KB gzipped** paginii de contact — mai
    mult decât jumătate din bugetul întregului site, exact pe pagina care trebuie să
    convertească. `zod/mini` are aceleași verificări și același `safeParse`, sub 3 KB.
    Costul e sintaxa mai verbosă (`.check(z.minLength(...))`). Măsurat înainte și
    după: 203.5 KB → 150.1 KB pe `/contact`.

12. **Formularul are exact 5 câmpuri** (`src/content/pages.ts`).
    Un câmp „Despre ce vrei să vorbim" ar fi cerut o coloană nouă în `submissions`,
    deci o migrație — pentru o informație care se află oricum în prima frază a
    mesajului. Promptul §5.3 enumeră exact nume, email, telefon opțional, mesaj și
    bifă. Am rămas la ele. Cine vine de pe pagina unui pachet primește mesajul
    precompletat cu numele pachetului, prin `?pachet=<slug>`.

13. **Paginare pe rute, nu pe `?pagina=`** (`src/lib/routes.ts`).
    `/blog/pagina/2`, `/blog/categorie/decizie/pagina/2`. Un parametru de căutare ar
    fi făcut `/blog` dinamică, iar ea trebuie să rămână prerandată. `/blog/pagina/1`
    nu există: ar fi un duplicat al lui `/blog`, deci dă 404.

14. **Butonul de programare este un link, nu un widget încărcat în pagină**
    (`src/app/(frontend)/contact/page.tsx`). Brief §10.2 cere ca widgetul de calendar
    să se încarce „doar la click". Un link către pagina furnizorului satisface
    cerința literal și complet, fără script terț și fără încă un Client Component.
    Se schimbă ușor dacă clienta vrea calendarul încorporat în pagină.

15. **Paginile legale au conținut, marcat vizibil ca draft** (`src/content/pages.ts`).
    Promptul le trimite la faza 6b, „validate de un jurist". Patru pagini goale nu
    ajută pe nimeni, iar textul depinde de cum funcționează chiar acest site — ce
    date se colectează, ce cookie-uri există. Am scris draftul acum, pe situația
    reală, cu o notă vizibilă pe fiecare pagină. Nota se scoate dintr-un singur loc:
    `LEGAL_DRAFT`. Datele de firmă NU sunt inventate — vin din `site-settings` și
    până atunci se afișează ca placeholdere.

16. **Aura de secțiune — adăugire, nu abatere** (`src/components/ui/SectionAura.tsx`).
    Singurul strat vizual care nu există în designul aprobat, descris în §4. E
    proiectat ca să nu atingă designul: în afara fluxului, `z-index: -1`, sub o
    secțiune cu `isolation: isolate`. Diff-ul din §6 arată zero text mutat. Dacă
    clienta o refuză, se stinge dintr-un singur loc — `--ac-aura-gain: 0` — fără să
    se atingă nicio secțiune.

17. **Lumina paginii — a doua adăugire peste designul aprobat**
    (`src/components/ui/PageLight.tsx`). Descrisă în §4. Ca și aura, e în afara
    fluxului și nu mută nimic — diff-ul din §6 o confirmă. Spre deosebire de aură,
    stă **sub** fundalurile secțiunilor, deci nu trece niciodată peste text. Se
    stinge din `--ac-light-gain: 0`, fără să se atingă nicio secțiune.

18. **Voalul — a treia adăugire, și singura care trece peste conținut**
    (`src/components/ui/Veil.tsx`). Descris în §4. Singurul strat decorativ cu
    `pointer-events` de verificat și cu risc de lizibilitate, tocmai pentru că e
    deasupra. De aceea iese din cadru și n-are voie să derive spre dreapta.
    Se stinge din `--ac-veil-gain: 0`.

De asemenea: ancorele din navigație au fost înlocuite cu rutele reale la faza 3b.
Singura ancoră rămasă este `/#faq` în meniul mobil — întrebările frecvente trăiesc
pe homepage și nu au pagină proprie.

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
| `ERR_REQUIRE_ASYNC_MODULE` la orice comandă `payload ...` | Fără `"type": "module"`, tsx transpilează `payload.config.ts` ca CommonJS, iar `@payloadcms/richtext-lexical` are top-level await | `"type": "module"` în `package.json` |
| `Cannot find package '@payloadcms/translations'` | Pachetul e dependență tranzitivă a `payload`; pnpm nu îl expune la rădăcină | Declarat ca dependență directă, fixat pe `3.88.0` |
| Migrațiile cad cu `does not provide an export named 'MigrateDownArgs'` | Generatorul Payload scrie tipurile ca import de **valoare**, iar ESM le caută la rulare | `pnpm migrate:fix` după fiecare `migrate:create`. Rulează automat și în `pnpm build:deploy` |
| Hook `afterChange` care scrie înapoi în document cade cu 404 la **creare** | Update-ul rula în afara tranzacției de creare, deci documentul încă nu exista | Se pasează `req` la `payload.update` — intră în aceeași tranzacție. Vezi `src/collections/Packages.ts` |
| Hook care scrie înapoi → buclă infinită | `update` declanșează din nou `afterChange` | `context: { skipStripeSync: true }`, verificat la intrarea în hook. În plus, nu se scrie deloc dacă valorile n-ar schimba nimic |
| `pnpm seed` pare blocat, fără niciun mesaj | După o schimbare de schemă, `push` din drizzle pune o întrebare interactivă (coloană creată sau redenumită?) și așteaptă la `stdin` | Rulează comanda fără pipe, ca să vezi întrebarea; sau resetează baza locală și aplică migrațiile: e oricum calea din producție |
| Erori TS pe `importMap.js` | Fișierul e generat ca JavaScript, iar `allowJs` e `false` (regula 8) | `src/app/(payload)/admin/importMap.d.ts`, scris de mână. Generatorul atinge doar `.js`-ul de alături |
| Panoul de admin nu autentifică pe alt host decât cel din `serverURL` | Nu e un bug al site-ului: cu un token pus manual pe cookie, Payload refuză. Autentificarea normală, prin formular, nu e afectată | Deschide adminul pe hostul din `NEXT_PUBLIC_SITE_URL`. Vezi și capcana cu `localhost` de mai sus |
| `pkill -f "next start"` nu oprește serverul, pe Windows | Procesul real e `node`, iar `pkill` din Git Bash nu vede arborele de procese Windows. Serverul rămâne pe port, iar comanda următoare pare că a pornit unul nou | `netstat -ano \| grep :PORT`, apoi `taskkill //F //PID <pid>`. **Verifică mereu portul**, nu presupune că `pkill` a reușit |
| Măsurătoarea de buget dă cifre prea mici, fără nicio eroare | Server vechi + `.next` reconstruit: HTML-ul servit trimite la chunk-uri cu alt hash, care nu mai există pe disc, iar scriptul de măsurare le sare | Oprește serverul ÎNAINTE de rebuild (vezi capcana de mai sus) și numără fișierele lipsă, nu doar octeții. Scriptul din §8 o face |
| Erori de sintaxă la scrierea fișierelor mari cu `cat > … <<'EOF'` | Heredoc-urile lungi, cu diacritice și ghilimele, se rup înainte de delimitator | Fișierele mari se scriu cu unealta de scriere a fișierelor sau cu un script `.mjs` pus în directorul temporar, nu prin heredoc |
| Ghilimelele de închidere arată altfel decât în restul textului | Convenția proiectului este `„text"` — U+201E la deschidere, ASCII `"` la închidere. U+201D nu apare nicăieri în designul aprobat | `grep -rn $'”' src/` trebuie să dea zero. Într-un atribut JSX delimitat cu `"`, un `"` în text rupe oricum compilarea |
| Aura se aprindea cu o jumătate de rază mai jos decât secțiunea | `animation-timeline: view()` își calculează progresul din **caseta de layout** și ignoră complet `transform`. Centrarea câmpului prin `translate(-50%,-50%)` era deci invizibilă pentru timeline | Centrarea se face din margini negative (`margin-left/top: -50%` din lățime), care intră în layout. `transform` rămâne liber pentru animație |
| Un strat decorativ tăiat cu `overflow: hidden` pe `<section>` | Ar rupe `StickyColumn` — poziționarea `sticky` nu funcționează într-un strămoș cu `overflow` | `contain: paint` pe stratul decorativ: taie la marginile secțiunii **și** scutește pictarea cât e în afara ecranului |
| Animația scroll-driven nu pornește deloc: timeline atașat, dar `currentTime` e `null`, iar elementul stă în starea de bază | Scurtătura `animation:` **resetează** `animation-timeline` și `animation-range` la valorile inițiale. Scrise înaintea ei, sunt șterse în tăcere | Declară `animation-timeline` și `animation-range` **după** scurtătură. Verifică cu `el.getAnimations()[0].currentTime`: `null` = timeline inactiv sau resetat, un procent = funcționează |
| Două animații pe același element se anulează una pe alta | Amândouă scriu `transform`; ultima din listă câștigă | `translate`, `scale` și `rotate` sunt proprietăți independente. Pune traseul pe `translate` și respirația pe `scale` — se compun singure, fără `<div>`-uri de ambalaj (vezi `PageLight`) |
| Un strat decorativ pus peste conținut înceață textul de dedesubt | `backdrop-filter` e singurul lucru care face un strat să pară corp fizic, dar tot el face ilizibil ce acoperă. Gutterul paginii (24–88px) e mai îngust decât orice obiect care merită văzut (84–132px), deci „îl pun în margine" nu e o soluție | Lasă-l să iasă din cadru și interzice-i deriva spre coloana de text (toate valorile de `translate` orizontal ≤ 0). Verifică, nu presupune: compară `getBoundingClientRect().right` al obiectului cu `x + paddingLeft` al lui `.ac-shell` |
| Comentariu care rupe compilarea într-un tag JSX | În lista de atribute, `{/* … */}` nu e valid — acolo se scriu comentarii JS simple, `/* … */`. Forma cu acolade merge doar între copii | `/* … */` între atribute, sau comentariul deasupra elementului |
| Măsurătorile din browser se blochează, `requestAnimationFrame` nu mai răspunde și tabul pare că nu mai pictează | Tabul nu mai e în prim-plan: Chrome nu mai produce cadre, deci orice `await requestAnimationFrame(...)` atârnă până la timeout, iar capturile ies goale. **Nu e o regresie a paginii** | Măsoară sincron (`getComputedStyle` forțează recalculul) sau reîncarcă tabul. Înainte să dai vina pe cod, verifică dacă un element din pagină chiar are dimensiuni: `document.querySelector('h1').getBoundingClientRect()` |
| Cu `prefers-reduced-motion`, un element animat de la `opacity: 0` rămâne la intensitatea de vârf | Regula globală din `globals.css` oprește toate animațiile, deci elementul stă în starea finală pe toată pagina — nu dispare, ci devine permanent | Dă-i explicit o opacitate proprie în blocul `prefers-reduced-motion` (aura coboară la jumătate). Verifică fiecare decor animat din opacitate |

---

## 11. Structura repo-ului

```
adriana-chira-repo/
├─ design/
│  ├─ homepage-approved.html      ← NU se șterge, NU se modifică
│  └─ compare/                    ← harnessul de comparație vizuală (§6)
├─ docker-compose.yml             ← Postgres local
├─ public/images/adriana-portret.jpg
├─ public/media/                  ← fișiere încărcate, gitignorat
├─ scripts/
│  ├─ verify-faza2.ts             ← verificările de acceptanță (pnpm verify:faza2)
│  └─ fix-migration-imports.mjs   ← vezi §10
├─ src/
│  ├─ app/
│  │  ├─ globals.css               ← TOȚI tokenii, în @theme
│  │  ├─ fonts.ts
│  │  ├─ robots.ts                 ← la rădăcină, nu în grup
│  │  ├─ (frontend)/
│  │  │  ├─ layout.tsx             ← layout rădăcină al site-ului
│  │  │  ├─ page.tsx               ← homepage
│  │  │  ├─ despre/ · contact/ · multumim/ · comanda-anulata/
│  │  │  ├─ servicii/{page,[slug]}
│  │  │  ├─ blog/{page,[slug],pagina/[numar],categorie/[slug]/…}
│  │  │  ├─ politica-de-confidentialitate/ · politica-de-cookies/
│  │  │  ├─ termeni-si-conditii/ · politica-de-retur/
│  │  │  ├─ not-found.tsx
│  │  │  ├─ [...notFound]/page.tsx
│  │  │  ├─ sitemap.ts
│  │  │  ├─ llms.txt/route.ts
│  │  │  └─ opengraph-image.tsx
│  │  ├─ api/contact/route.ts      ← formularul; `/api/stripe/*` intră la faza 4
│  │  └─ (payload)/                ← generat de Payload, nu se editează manual
│  │     ├─ layout.tsx             ← layout rădăcină al panoului
│  │     ├─ admin/[[...segments]]/ + importMap.js · importMap.d.ts
│  │     └─ api/{[...slug],graphql,graphql-playground}/
│  ├─ access/                      ← regulile de acces, într-un singur loc
│  ├─ collections/                 Posts · Categories · Packages · Faqs
│  │                               Media · Orders · Submissions · Users
│  ├─ globals/                     SiteSettings · HomePage · AboutPage
│  ├─ fields/                      slug.ts · seo.ts · section.ts
│  ├─ hooks/                       revalidate.ts
│  ├─ migrations/                  ← schema pentru producție
│  ├─ seed/index.ts                ← pnpm seed
│  ├─ components/{layout,sections,ui,consent,contact,seo}/
│  ├─ content/                     types.ts · site.ts · home.ts · pages.ts
│  │                               ← fallback ȘI sursa seed-ului
│  ├─ lib/                         content.ts · payload.ts · stripe.ts · lexical.ts
│  │                               consent.ts · schema.ts · seo.ts · routes.ts
│  │                               email.ts · rate-limit.ts · cn.ts
│  │                               validation/contact.ts
│  ├─ payload.config.ts
│  └─ payload-types.ts             ← generat, se comite
├─ README.md                       ← prezentare pentru echipă
└─ STATUS.md                       ← acest fișier
```

Directoare care **vor** apărea la fazele următoare: `src/app/api/stripe/`.

---

## 12. Când termini o bucată de lucru

1. Rulează verificările fazei din `../03-PROMPT-CLAUDE-CODE.md`.
2. `pnpm build && pnpm typecheck` — ambele trebuie să treacă curat.
3. `grep -rn "ş\|ţ" src/ scripts/` — zero rezultate.
4. Dacă ai atins schema: `pnpm generate:types`, `pnpm migrate:create <nume>`,
   `pnpm migrate:fix`, apoi `pnpm seed` de două ori la rând.
5. Dacă ai atins UI-ul sau stratul de conținut: refă diff-ul CMS ↔ fallback din §6.
   Costă două build-uri și prinde exact regresia pe care n-o vezi cu ochiul.
   Ai atins o componentă folosită și de homepage? Refă și diff-ul HEAD ↔ acum, tot
   §6 — homepage-ul e verificat la pixel și orice diferență trebuie să fie una pe
   care ai vrut-o.
6. **Actualizează acest fișier:** mută ce ai făcut din §5 în §4, actualizează data și
   commit-ul din antet, adaugă în §10 orice capcană nouă pe care ai rezolvat-o.
7. Commit mic, cu mesaj descriptiv în română.

---

*Website Factory · Pixel Factory SRL · Timișoara*
