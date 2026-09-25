# STATUS — adrianachira.ro

**Document de predare între sesiuni.** Dacă intri în proiect fără context, citește
acest fișier primul și integral. Descrie ce există, ce nu există, ce e blocat și care
e următorul pas concret.

| | |
|---|---|
| Ultima actualizare | **25 septembrie 2026** |
| Stadiu general | Fazele 1, 2, 3b **și 4 (Stripe)** complete · **17 rute publice** · **conținutul real al clientei este în site**: 3 programe individuale (unul cu preț afișat, două pe ofertă), 14 workshopuri, 6 recomandări · **plata online funcționează, cu o cale paralelă de rezervare fără plată** · **paginile de program sunt pagini de vânzare complete, iar navigația are submeniuri** · **layout adaptat pentru laptopuri de 14"** · fazele 5b–7 neîncepute |
| Build | ✅ trece (`pnpm build`, `pnpm typecheck`) · `pnpm verify:faza2` **12/12**, rulat pe 25 septembrie 2026 |
| Ultimul commit | vezi `git log` — Preț la cerere, laptopuri de 14", meniuri care se închid |

> **Ce s-a schimbat pe 25 septembrie 2026.** Șase cereri ale clientei, toate
> livrate într-o singură rundă. Detalii în §4 („Runda din 25 septembrie"),
> §9.31–§9.35, §10 și §6.
>
> 1. **`/despre`: portretul a urcat în antet**, lângă titlu; narațiunea și
>    reperele (acum pe două coloane) stau dedesubt, pe aceeași lățime.
> 2. **Submeniurile se închid după alegere.** Rămâneau deschise peste pagina
>    nouă: `:focus-within` + mouse-ul încă deasupra. Vezi §10.
> 3. **Antetul paginilor de program pe telefon**: fir redus la „← Servicii",
>    fapte pe o coloană strânsă, buton pe toată lățimea, desenul ascuns sub
>    640px, harta paginii pe un singur rând derulabil.
> 4. **Butonul „Înapoi sus"** pe workshopuri și pe paginile de program — zero JS.
> 5. **Preț la cerere**: CLAR™ și EPP nu mai afișează prețul; în locul lui,
>    „Solicită ofertă" → formular precompletat. Bifă nouă în admin + migrație.
>    Contactul a primit un CTA în antet care coboară la formular, iar
>    formularul stă acum într-o cartelă evidențiată.
> 6. **Laptopuri de 14"**: varianta `short:` și tokenii care se adaptează la
>    înălțimea ecranului. Peste 860px înălțime nu se schimbă nimic.

> **Ce s-a schimbat pe 8 septembrie 2026, runda a doua.** Clienta a semnalat că
> paginile de program și cea de workshopuri „par pagini din Word" și a cerut ca
> vizitatorul să nu se sperie de cât are de citit: secțiuni împărțite vizibil,
> fundaluri diferite, pictograme, ierarhie clară și un antet sugestiv pentru
> fiecare serviciu. **Nu s-a atins niciun cuvânt din textul clientei.**
>
> Ce a intrat: **benzi de secțiune cu fundal alternat și formă potrivită
> conținutului** (`ui/PackageBody`), **un set propriu de pictograme desenate**
> (`ui/Glyph`), **un desen de antet pentru fiecare program, care ESTE structura
> lui** (`ui/ProgramMotif`), o **hartă a paginii** din chipsuri numerotate și
> aceeași împărțire pe pagina de workshopuri, cu o bară de sărituri către oricare
> dintre cele paisprezece. Detalii în §4 („Cum se citesc paginile lungi"),
> §9.28–§9.30 și §6.

> **Ce s-a schimbat pe 8 septembrie 2026, runda întâi.** Clienta a retrimis cele trei documente
> de serviciu (Strategic Performance Assessment, CLAR, Executive Performance
> Program) și a cerut pagini dedicate pentru fiecare program, cu CTA proprii, plus
> submeniuri în navigație — programele sub „Servicii", workshopurile sub
> „Workshopuri", fiecare workshop ducând la cardul lui din catalog.
>
> **Rutele nu s-au schimbat: erau deja `/servicii/[slug]`**, exact formatul cerut.
> Ce s-a schimbat este pagina de la capătul lor: din pagină de detaliu de pachet a
> devenit pagină de vânzare, cu cuprins, bandă de investiție și trei puncte de
> cumpărare. Detalii în §4 („Paginile de program"), §9.23–§9.25 și §6.
>
> **Un 404 tăcut a fost reparat pe drum.** `getPackageBySlug` ieșea din funcție cu
> `null` când baza de date nu răspundea, deci toate cele trei pagini de program
> dădeau 404 pe calea de rezervă — deși `generateStaticParams` le producea rutele
> din textul aprobat. Vezi §10.

> **Ce s-a schimbat pe 7 septembrie 2026.** Clienta a livrat materialele finale:
> cele trei programe individuale (Strategic Performance Assessment, CLAR,
> Executive Performance Program), catalogul de 14 workshopuri și trei
> recomandări. Odată cu ele s-au ridicat două blocaje vechi — §7.1 (pachetele
> fără nume și preț) și faza 4 (Stripe) — și au apărut trei lucruri noi în site:
> pagina de workshopuri, pagina de recomandări și secțiunea de recomandări de pe
> prima pagină. Detalii în §4 („Conținutul real"), §9.21–§9.24 și §6.
>
> **Moneda s-a schimbat din EUR în RON, peste tot.** Toate prețurile clientei
> sunt în lei. Nu a mai rămas niciun `EUR` în cod.

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
pnpm migrate               # aplică migrațiile — atârnă în dev, vezi §10
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
| `ImageSlot` | **cheie** — raport fixat de tip de slot, placeholder crem când `src` lipsește. CLS 0 la înlocuirea fotografiei. Cinci sloturi: `hero-portrait` 3:4, `about-portrait` 4:5, `post-cover` 4:3, `page-portrait` 2:3, `page-wide` 3:2 |
| `Reveal` | Server Component; pune atributele, animația e pur CSS |
| `SectionAura` | Server Component; stratul de atenție al secțiunii, pornit din `Section` prin `aura="…"`. Vezi mai jos |
| `PageLight` | Server Component; corpul de lumină care traversează pagina la derulare. Montat o singură dată, în layout |
| `HeroField` | Server Component; fundalul viu al heroului — trei corpuri de lumină care derivă continuu, în timp. Doar pe hero. Vezi mai jos |
| `RevealFallback` | script inline ~600 B, un singur observer, doar pe browsere fără `animation-timeline` |
| `TextLink` | subliniere care crește din stânga |

### Fotografiile clientei ✅

Din ședința foto, câte una pe pagină. Toate în `public/images/`, servite prin
`next/image`, deci convertite la cerere în WebP/AVIF.

| Fișier | Unde apare | Slot | Decupaj |
|---|---|---|---|
| `adriana-hero.jpg` | homepage, hero | `hero-portrait` 3:4 | 2:3 → se taie 11% pe verticală; `50% 60%` păstrează și spațiul de deasupra capului, și pantofii |
| `adriana-despre.jpg` | homepage secțiunea Despre **și** `/despre` | `about-portrait` 4:5 | `50% 16%` — cadru strâns, decupajul urcă |
| `adriana-servicii.jpg` | antetul `/servicii` | `page-wide` 3:2 | niciunul — slotul are chiar raportul fișierului |
| `adriana-blog.jpg` | antetul `/blog` | `page-portrait` 2:3 | niciunul |
| `adriana-contact.jpg` | antetul `/contact` | `page-portrait` 2:3 | niciunul |
| `adriana-workshopuri.jpg` | antetul `/workshopuri-performanta-umana` | `page-portrait` 2:3 | niciunul |

Fotografiile din antete intră prin `image` pe `PageHeader`, care trece antetul pe
două coloane doar când primește una. Paginile legale, `/multumim` și
`/comanda-anulata` nu primesc niciuna și randează exact aceeași coloană unică de
dinainte. `personSchema` din layout arată acum spre `adriana-despre.jpg`.

Placeholderul din pachetul de design (`adriana-portret.jpg`) a fost șters: avea
filigranul fotografului peste colțul din dreapta jos.

Fotografia din antet este elementul LCP al paginii ei, deci primește `priority` —
singura excepție de la regula „doar hero-ul", scrisă ca atare în componentă.

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

### Câmpul heroului ✅ — refăcut a doua oară pe 31 august 2026

Al treilea strat din afara designului aprobat. **Rețeta a fost schimbată din temelii
de două ori**, iar a doua schimbare a mers în sens invers față de prima: pe 25 august
clienta ceruse un hero care atrage privirea (§9.19), iar pe 31 august a trimis o
fotografie de referință și a cerut exact opusul — fundal ivory/crem, „foarte
minimalist și elegant", **fără formele circulare**, cu o tranziție organică între zona
de text și fotografie și cu accente de auriu „foarte discrete" (§9.20).

Ce a fost eliminat complet: trei corpuri de lumină care derivau, trei voaluri conice
care se roteau, două inele de aur, opt animații și șapte seturi de keyframes. Ce a
rămas e **o singură formă și o singură lumină**.

| Strat | Selector | Ce face | Ce îl mișcă |
|---|---|---|---|
| Fondul | `[data-hero-wash]` | spălarea caldă de fildeș, sub coloana de text | nimic — e static |
| Lumina | `[data-hero-halo]` | ridică luminanța hârtiei în spatele portretului | derivă <2vw + respirație 6% (127s / 97s) |
| Curba | `[data-hero-curve]` | tranziția text ↔ fotografie, cu fir de aur pe muchie | nimic — e statică |

Plus stratul static de granulație (`[data-hero-field]::after`, ~5%), păstrat din
varianta veche: rupe banding-ul și dă textură de hârtie.

Cele trei straturi decorative ale site-ului, ca să nu fie confundate:

| | `PageLight` | `SectionAura` | `HeroField` |
|---|---|---|---|
| Ce e | atmosferă | semnal de atenție | coala pe care stă fotografia |
| Unde stă | **sub** fundaluri | sub conținut, în secțiune | sub conținut, doar în hero |
| Ce îl mișcă | derularea | secțiunea care intră în ecran | aproape nimic |
| Când se vede | pe toată pagina | pe cinci secțiuni | doar pe primul ecran |

- `src/components/ui/HeroField.tsx` — Server Component, **zero JS**. Geometria curbei
  (căi Bézier în coordonate de viewBox) și opacitățile gradienților sunt date, nu CSS.
- Blocul „CÂMPUL HEROULUI" din `globals.css` — gradiente liniare și radiale,
  **niciodată `filter: blur()`**. Culorile stau toate acolo, inclusiv `stop-color`-ul
  gradienților din SVG; în componentă rămân doar geometria și opacitățile.
- Se stinge dintr-un singur loc: `--ac-hero-field-gain: 0`.

**Curba e un SVG întins peste toată caseta, cu `preserveAspectRatio="none"`.**
Întinderea e intenționată: coordonatele viewBox-ului de 1000×1000 se citesc atunci
direct ca procente din hero, deci forma stă mereu în același raport față de grilă, la
orice lățime. `vector-effect="non-scaling-stroke"` e obligatoriu, nu opțional — fără
el, întinderea neuniformă ar îngroșa firul pe orizontală și l-ar subția pe verticală.

**De ce Bézier și nu `border-radius`.** O formă din `border-radius` e o elipsă:
simetrică, previzibilă, se citește ca obiect geometric — adică fix ce a cerut clienta
să dispară. O cale Bézier are curbură variabilă și se citește ca linie trasată de mână.
Diferența dintre cele două e diferența dintre „decor" și „editorial".

**Poziția curbei e măsurată, nu aleasă.** Portretul e coloana din dreapta a grilei:
marginea lui stângă cade între 53% (la 1000px lățime) și 59% (la 1440px și peste).
Curba intră pe sus la 61.2%, adică din spatele fotografiei, se umflă spre stânga până
la 47% și revine. Așa fotografia pare că stă *în interiorul* formei, nu lângă ea —
care e chiar tranziția organică cerută. Dacă cineva mută grila, aici se măsoară din nou.

**Plafonul de contrast — regula nu s-a schimbat, dar acum e împărțită pe straturi.**
Singurul strat care **întunecă** hârtia e fondul, și doar el poartă masca
(`--ac-hero-dim`, 50% → 92%), împreună cu granulația. Lumina și umplutura curbei sunt
alb-cald: **ridică** luminanța, deci textul închis câștigă contrast și n-au nevoie de
mască. Firul de aur nu e mascat, ci se stinge singur din gradientul lui, la 86% din
înălțime — deasupra benzii de etichete de sub butoane și a legendei portretului,
singurele texte din pagină fără marjă peste AA (`--ac-ink-50` la 11px, 4.64:1).

Măsura care fixează plafonul fondului: `--ac-cream-50` plin sub acele etichete dă
**4.24:1**, adică sub AA. De aceea `--ac-hero-ivory` e `--ac-cream-50` la 62% peste
hârtie, iar masca îl stinge oricum înainte să ajungă acolo. Aurul rămâne exclusiv fir:
un hairline de 1.1px nu mută luminanța medie a hârtiei de sub un rând de text, o
suprafață aurie de 900px la 10% o mută.

**Aurul aurei de hero a coborât de la 0.32/0.30 la 0.12/0.10.** Rețeta din
`SectionAura` are un halou de accent între 50% și 82% din rază. Pe fundalul încărcat
de dinainte trecea neobservat; pe coala de fildeș ar fi reapărut exact ca inelul pe
care clienta a cerut să îl eliminăm. Restul variantelor de aură **nu s-au atins**:
ele stau pe secțiuni cu fundal propriu.

**Mișcarea.** A rămas una singură, și e deliberat aproape invizibilă: haloul derivă
sub 2vw și respiră 6%, pe două durate prime diferite (127s și 97s), deci ansamblul nu
se repetă la vedere. Curba **nu se mișcă** — o muchie care se mișcă se citește ca
tremur, nu ca respirație. `prefers-reduced-motion` nu mai are nevoie de nicio regulă
proprie pentru hero: regula globală oprește singura animație, iar ce rămâne e exact
compoziția de start, la intensitate plină.

**Telefonul.** Sub 768px grila trece pe o coloană, portretul ajunge sub text, iar
heroul devine mult mai înalt (măsurat la 390px lățime: **1486px**). Compoziția se
rotește cu 90°: unda trece pe deasupra fotografiei, lumina coboară în dreptul ei.

| | Telefon (≤767px) | Desktop |
|---|---|---|
| Curba | undă orizontală, amplitudine ±17 unități (~25px) | linie verticală între text și portret |
| Firul de aur | **nu există** — vezi mai jos | fir + ecou, stinse la ambele capete |
| Lumina | 92vw, centrată la 56% / 72% | până la 1180px, la 70% / 36% |
| Masca fondului | 46% → 86% | 50% → 92% |

**Pe telefon nu există fir de aur, și e o decizie, nu o scăpare.** Măsurat la 390px:
banda de etichete stă între 53.8% și 60.6% din hero, iar fotografia începe la 63.3% —
fereastra dintre ele are ~40px. Un fir trasat acolo ar sta la câțiva pixeli de niște
etichete de 11px cu 0.14 marjă peste AA, iar prima modificare de conținut l-ar muta
peste ele. Prima variantă chiar trecea prin ele; s-a văzut în browser. A rămas
umplutura, care doar **luminează** hârtia, deci poate traversa orice text fără să-i
strice contrastul. Unda trece prin fereastra 59.4% → 62.8%, adică intră în fotografie
de sus — care e chiar rolul ei.

**Unsprezece stopuri la lumină, nu patru.** Regulă păstrată din varianta veche, și
motivul e neschimbat: un fundal atât de palid trăiește în doi-trei pași de cuantizare
pe 8 biți, iar orice rupere de pantă în alfa se vede ca **inel desenat pe hârtie**.
Stopurile aproximează o cădere gaussiană (fiecare pas ~0.62 din precedentul) și ajung
la zero abia la 100%. Dacă le rărește cineva „ca să fie mai curat CSS-ul", inelul se
întoarce — pe compoziția asta, minimalistă, s-ar vedea de două ori mai bine.

**Umplutura se stinge pe verticală odată cu firul** (`acHeroFillMaskLg`). Fără asta,
în ultima cincime a heroului rămânea o muchie tonală fără linie pe ea, adică o
tăietură. Așa forma se termină ca lumină, nu ca margine. Pe telefon nu se aplică:
acolo fotografia ocupă ultima treime, deci lumina trebuie să rămână exact unde
umplutura s-ar stinge.

### Placa cu portretul ✅ — 31 august 2026

Runda a doua a refacerii: clienta a semnalat că fotografia „este încă un dreptunghi,
are margini clare, în loc să fie integrată în background și linia curbă". Avea
dreptate — curba trecea pe **lângă** casetă, nu prin ea. Acum fotografia e tăiată chiar
de curbă, ca în fotografia de referință.

| | Sub 1000px | Peste 1000px |
|---|---|---|
| Cum stă portretul | casetă 3:4, max 520px, sub text (neschimbat) | **placă** lipită de marginea dreaptă, de sus până jos |
| Ce îl taie | muchia de **sus**, undă de 6.4% | latura **stângă**, aceeași curbă ca fundalul |
| Fir de aur pe tăietură | nu | da, cu 0.8% înaintea muchiei |
| Curba din fundal | ascunsă | vizibilă |

**Cele două curbe sunt aceeași curbă, și asta e tot ce contează tehnic.** Geometria e
scrisă o singură dată, ca DATE (`CURVE_LG` în `HeroField.tsx`: un punct de start și
două segmente cubice), iar din ea se emit toate variantele — firul, ecoul, umplutura și
masca plăcii — printr-o funcție. Masca plăcii se obține din aceleași puncte printr-o
schimbare de scară, pentru că placa are marginea stângă **fixată** la 48%
(`--ac-hero-plate-left`, `PLATE_LEFT`). Dacă ar fi două șiruri scrise de mână, s-ar
alinia la lățimea la care au fost calibrate și s-ar rata la oricare alta.

De aceea lățimea plăcii **nu are `clamp()`** și nu are voie să primească unul. Cele
două valori se schimbă întotdeauna împreună.

**Firul stă cu 8 unități (0.8%, ~11px la 1440px) înaintea muchiei fotografiei.** Nu
zero: firul are 1.1px, iar dacă fotografia s-ar opri exact pe el i-ar acoperi
jumătate, lăsând un fir de o jumătate de pixel — care sfârâie la scalare și dispare pe
unele ecrane. Cu decalajul, firul rămâne întreg pe fildeș și între el și fotografie
rămâne o dungă subțire de lumină, exact ca în fotografia de referință.

**`Shell` nu mai e `relative z-[1]` în hero, și e o schimbare cu miză.** Un `Shell`
poziționat devine blocul de referință al plăcii absolute — iar caseta lui e coloana de
conținut: mai îngustă decât secțiunea peste 1560px și mai scurtă cu tot paddingul
vertical al heroului. Prima încercare a avut exact acest bug: cele două curbe se
rateau cu ~110px pe verticală, iar fotografia părea tăiată aiurea. Fără `relative`,
blocul de referință redevine secțiunea, adică fix cutia în care desenează
`HeroField`. Ce ținea `z-[1]` — conținutul deasupra câmpului — e acoperit de
`z-index: -1` al câmpului plus `z-[2]` explicit pe coloana de text.

**Masca stă pe cutia imaginii, nu pe figură.** `mask-image` se aplică întregului
subarbore: pe figură ștergea și `figcaption`-ul, pentru că legenda stă tocmai în zona
în care stingerea de jos e deja transparentă. S-a văzut în browser.

**Stingerea de jos** (`--ac-hero-plate-fade`, 80% → 96%) nu e ornament. Fotografia de
referință iese din ecran pe jos; heroul nostru are un capăt vizibil, deci fără stingere
ar rămâne o muchie orizontală dreaptă exact acolo unde începe secțiunea următoare —
adică fix dreptunghiul pe care îl scoatem. Sub ea rămâne fâșia pe care stă legenda, pe
fildeș curat: sunt 11px în `--ac-ink-50`, textul fără marjă peste AA, care nu are voie
să ajungă peste fotografie, unde luminanța nu e garantată.

**Pragul e 1000px, nu 768px.** Grila heroului e `repeat(auto-fit, minmax(min(100%,
420px), 1fr))` cu gap `clamp(40px, 6vw, 96px)`: măsurat, trece pe o coloană exact sub
1000px. Prima variantă comuta decorul la 768px, deci între 768 și 999px desena curba
verticală peste un layout care era deja pe o coloană. Pragul decorului urmează grila,
nu breakpoint-ul generic de telefon.

**Unda de sub 1000px e legată de fotografie, nu de înălțimea heroului**, și tot din
lecția asta. Prima variantă o poziționa la 59.4%–62.8% din hero, valoare măsurată la
390px lățime. Măsurătoarea e adevărată doar acolo: la 999px coloana de text are 899px,
se rup mult mai puține rânduri, heroul se scurtează cu câteva sute de pixeli, iar unda
ar fi căzut prin **mijlocul** fotografiei. Legată de caseta fotografiei, se așază
singură pe muchia ei, la orice lățime și la orice conținut.

Adâncimea undei e plafonată la 6.4% din înălțimea casetei (~29px la 390px): fotografia
e 2:3 într-o cutie 3:4, decupată deja la 60% pe verticală, deci spațiul de deasupra
capului e limitat. Peste ~8% s-ar atinge părul.

> **Voalul (obiectul de abur din colțul stânga-jos) rămâne eliminat** — vezi §9.18.
> **Corpurile de lumină, voalurile conice și inelele de aur au fost eliminate** pe
> 31 august 2026, la cererea clientei — vezi §9.20. Niciunele nu se reintroduc fără o
> cerere explicită.

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

Faza 3b a adus **15 rute publice** (17 din 7 septembrie 2026, odată cu
`/workshopuri-performanta-umana` și `/testimoniale`). Navigația a trecut de la ancore
la rute reale, dintr-un singur loc (`src/content/site.ts`).

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

### Conținutul real al clientei ✅ — 7 septembrie 2026

Materialele finale au intrat în site. Trei documente de servicii, un catalog de
workshopuri și un fișier de recomandări, livrate de clientă, rescrise pentru web și
puse în CMS prin `pnpm seed`.

**Sursa textului, ca peste tot în proiect, este un fișier din `src/content/`, care e
în același timp fallback-ul și materialul din care seed-ul populează CMS-ul.** Un
singur text, deci cele două nu pot devia.

| Fișier | Ce conține |
|---|---|
| `src/content/packages.ts` | Cele 3 programe individuale, cu preț, durată, secțiuni și FAQ |
| `src/content/workshops.ts` | Cele 14 workshopuri, plus partea comună tuturor |
| `src/content/testimonials.ts` | Cele 3 recomandări, integral |

#### Cele trei programe individuale

Blocajul §7.1 s-a ridicat: pachetele au nume, conținut, durată și preț.

| # | Program | Durată | Preț |
|---|---|---|---|
| I | Strategic Performance Assessment™ | 3 ore, o sesiune | 1.500 lei |
| II | CLAR™ Performance Transformation *(cardul evidențiat)* | 8 săptămâni, 6 sesiuni | 5.100 lei |
| III | Executive Performance Program™ | 6 luni, evaluare + 12 sesiuni | 15.000 lei |

Ordinea e cea a angajamentului crescător, iar cardul evidențiat rămâne **cel din
mijloc**, ca în designul aprobat. EPP e „serviciul principal" în documentul clientei,
dar evidențierea în design e o poziție, nu un premiu — vezi §9.24.

`longDescription` (rich text) rămâne **necompletat intenționat**. Descrierea lungă are
titluri, liste și blocuri numerotate (metoda CLAR, cele șase dimensiuni HPA); scrisă
ca document Lexical în seed ar fi devenit ilizibilă și necorectabilă. Cât timp câmpul
e gol, pagina randează secțiunile structurate din `packages.ts`, prin
`ui/PackageBody`. Dacă Adriana scrie rich text în admin, acela are întâietate.

> **De curățat din admin:** pe o bază veche există încă cele trei pachete
> `pachet-i`, `pachet-ii`, `pachet-iii` cu text `[ DE COMPLETAT ]`. Au alte
> slug-uri, deci seed-ul nu le-a atins și rămân ascunse (`active: false`). Se pot
> șterge când e sigur că nu au comenzi legate.

#### Workshopurile — rută nouă

`/workshopuri-performanta-umana`, colecția `workshops`, componenta `ui/WorkshopCard`.
Adresa e cea recomandată explicit în documentul clientei.

**Regula de vânzare, și de ce e calculată, nu bifată.** Se pot cumpăra întotdeauna
doar **următoarele trei ediții cu dată în viitor**. Nu există bifă „deschis la
înscriere" în admin, și e o decizie: o bifă ar trebui întoarsă manual în fiecare lună,
iar ziua în care cineva uită să o întoarcă e ziua în care site-ul vinde locuri la o
ediție care a trecut. Regula stă în `src/lib/workshops.ts`, se calculează din
`sessionDate` și se mută singură. **Ca să deschizi un workshop la înscriere, îi pui o
dată. Atât.**

Ordinea din pagină e ordinea desfășurării: întâi edițiile cu dată, cronologic, apoi
restul catalogului în ordinea logică a seriei. Un workshop căruia i-a trecut data nu
dispare — coboară în lista fără dată, pentru că workshopul există în continuare, doar
ediția s-a consumat.

Astăzi sunt programate trei: **Busola internă** (17 octombrie 2026), **Sub presiune**
(14 noiembrie 2026), **Spațiul dintre stimul și răspuns** (12 decembrie 2026).
Toate 14 costă 510 lei de participant.

**Detaliul se deschide pe `<details>` nativ, nu pe stare de React.** Cerința clientei
era descriere scurtă pe card plus un buton care deschide tot programul. `<details>`
face exact asta cu zero JavaScript, iar textul rămâne în DOM și când acordeonul e
închis — ceea ce contează pentru AEO, fiindcă crawlerele de AI în general nu execută
JS. Verificat: **componentele de client sunt tot exact patru.**

**Partea comună nu se repetă de paisprezece ori.** Durata, orarul, ce include prețul,
„Cum se desfășoară" și „Pentru cine" sunt identice la toate; stau o dată, în
`WORKSHOP_COMMON`, și se randează o dată, în capul paginii. Fiecare workshop păstrează
doar ce îl deosebește, inclusiv fraza proprie despre ce se lucrează în ziua respectivă.

#### Recomandările — rută nouă

`/testimoniale`, colecția `testimonials`, plus extrase pe prima pagină, pe `/despre`
(două) și pe `/servicii` (una).

**Șase recomandări**, livrate în două loturi. Primul lot (3) e marcat pentru prima
pagină; al doilea lot (3), primit pe 7 septembrie 2026, are `featured: false`.

| # | Autor | Funcție | Pe prima pagină |
|---|---|---|---|
| 0 | Livia Wagner-Rus | Director general, AGRO MARUS SRL | da |
| 1 | Dr. Gabriel Vasile Oltean | Economist · Conferențiar universitar · Trainer | da |
| 2 | Paul Ștefănescu | Consultant, trainer, auditor, antreprenor | da |
| 3 | Gabriela Tarna | Regional Head of Talent Acquisition… (DRÄXLMAIER) | nu |
| 4 | Marian Rujoiu | Extreme Training | nu |
| 5 | Bogdan Vasiliu | **lipsește din document** | nu |

**De ce lotul al doilea nu e pe prima pagină.** Secțiunea arată maximum trei
recomandări. Dacă le-aș fi marcat și pe acestea, două dintre cele deja aprobate ar fi
dispărut de pe homepage în tăcere, ca efect secundar al unei simple adăugări. Toate
șase se citesc integral pe `/testimoniale`; schimbarea trioului e o bifă în admin.

**`role` a devenit opțional** (migrația `20260907_135248_rol_optional_la_recomandari`,
o singură instrucțiune: `DROP NOT NULL`). Documentul lui Bogdan Vasiliu semnează doar
cu numele. Textul vorbește despre „provocările de HR", dar de acolo până la o funcție
anume e o presupunere — iar presupunerea ar fi atribuită unui om real, sub numele lui.
Când funcția lipsește, rândul dispare de pe card și de pe pagină; nu se umple cu
placeholder și nu se ghicește. Verificat: `jobTitle` se emite pentru cinci din șase.

**Fără note, stele sau medii, deliberat.** Niciunul dintre cei trei oameni nu a fost
rugat să dea un punctaj, deci orice cifră ar fi inventată de noi. Marcajul urmează
aceeași regulă: `Review` fără `reviewRating` și fără `aggregateRating` — un
`aggregateRating` fabricat este exact motivul pentru care Google dă penalizări manuale.

Fraza scoasă în evidență pe carduri este **copiată** din textul integral, nu rezumată,
iar fiecare card duce la recomandarea întreagă. Regulile sunt scrise în capul lui
`src/content/testimonials.ts`.

Intervențiile tipografice făcute (și de confirmat cu clienta): diacriticele au fost
completate în recomandarea lui Paul Ștefănescu, scrisă fără ele — niciun cuvânt și
nicio topică nu s-au schimbat.

#### Faza 4 — plata prin Stripe ✅

| Ce | Unde |
|---|---|
| Pornirea plății | `src/app/api/stripe/checkout/route.ts` |
| Rezolvarea produsului și sesiunea | `src/lib/checkout.ts` |
| Înregistrarea comenzii și emailurile | `src/app/api/stripe/webhook/route.ts` |
| Butonul | `src/components/ui/CheckoutButton.tsx` |
| Sincronizarea prețului, comună | `src/hooks/stripeSync.ts` |

**Butonul de plată este un `<form method="post">`, nu un `onClick`.** Ruta răspunde cu
303 către Stripe, browserul urmează redirectarea. Consecințe: zero JavaScript, nicio a
cincea componentă de client, și butonul funcționează inclusiv înainte de hidratare.

**Din formular pleacă doar `tip` și `slug`.** Prețul se citește pe server, din
document (regula 7 din §2). Nu există niciun câmp cu sumă de rescris din DevTools.

**Verificarea se repetă pe server.** Pagina nu arată butonul pe o ediție închisă, dar
un `POST` scris de mână întâlnește aceeași regulă și e refuzat. Verificat:

```
tip=workshop&slug=busola-interna              → 303 spre Stripe (sau spre contact, fără cheie)
tip=workshop&slug=dincolo-de-prima-concluzie  → 303 /contact?...&motiv=inchis
tip=workshop&slug=nu-exista                   → 303 /workshopuri-performanta-umana
```

**Webhook-ul.** Semnătura se verifică pe corpul brut (`request.text()`).
Idempotența stă pe indexul unic `stripeSessionId`: a doua livrare a aceluiași
eveniment cade la inserare, o prindem și răspundem 200. Erorile noastre răspund 500,
ca Stripe să reîncerce. Emailurile nu aruncă niciodată — un email ratat nu are voie să
transforme o plată reușită într-un webhook eșuat.

Colecția `orders` a primit `itemType`, relația `workshop`, `sessionDateSnapshot` și
`quantity`. Data ediției se **copiază** în comandă: un workshop își schimbă
`sessionDate` la ediția următoare, iar fără copie lista de participanți ar deveni
greșită exact când e nevoie de ea.

#### Calea de rezervare fără plată online

Cerută explicit. Nu e un mesaj de eroare, e a doua cale de cumpărare, și duce peste tot
la `/contact` cu produsul precompletat în mesaj:

| Situația | Ce vede omul |
|---|---|
| Ediție deschisă, dar vrea factură pe firmă sau transfer | Link sub buton: „Rezervă fără plată online" |
| Workshop fără dată | Buton: „Anunță-mă când se programează" |
| Stripe n-a putut porni sesiunea | Redirect cu notă scrisă pentru om, nu cod de eroare |
| Ediția s-a închis între încărcarea paginii și click | Redirect cu „Ediția aceasta nu mai este deschisă" |

Fiecare situație are alt text precompletat (`contactPage.workshopPrefill`,
`waitlistPrefill`, `checkoutFallbackNote`), ca Adriana să nu ghicească despre ce e
vorba la fiecare mesaj.

#### SEO / AEO / GEO pentru conținutul nou

- **Metadate** din documentele clientei: title, meta description și URL recomandat.
- **Date structurate:** `Event` + `Offer` pentru fiecare ediție cu dată (`InStock` pe
  cele deschise, `PreOrder` pe restul), `Review` fără rating pentru recomandări,
  `Service` + `Offer` în lei pe pachete, `FAQPage`, `ItemList`, `BreadcrumbList`.
- **Referințele `@id` nu mai atârnă.** `Event.organizer`, `Service.provider` și
  `Review.itemReviewed` trimit la `#serviciu`, nod care se emitea doar pe homepage.
  Acum `professionalServiceSchema` se emite pe fiecare pagină care îl referă, deci
  graful fiecărei pagini se rezolvă singur.
- **`llms.txt`** enumeră programele cu preț, seria de workshopuri, edițiile deschise
  cu dată și link, catalogul complet și recomandările. A trecut de la `force-static`
  la `revalidate = 3600`: prerandat o dată, ar fi continuat să spună asistenților că
  se pot cumpăra locuri la o ediție trecută.
- **`sitemap.ts`** are cele două rute noi; catalogul e `weekly`, restul lunar.
- **Fără keyword stuffing.** Expresiile-cheie livrate de clientă sunt stocate în
  colecție ca notițe de redactare (`keywords`) și **nu se randează în pagină**.

---

### Paginile de program ✅ — 8 septembrie 2026

`/servicii/[slug]`, trei rute, formatul cerut de clientă. Ruta exista din faza 3b;
ce s-a schimbat este ce randează.

| Bloc | De unde vine | De ce e acolo |
|---|---|---|
| Linia de deasupra titlului (`kicker`) | `packages.ts` | poartă expresia căutată în Google, ca `h1` să rămână numele programului — termenul de brand |
| Faptele scanabile (`highlights`) | `packages.ts` | „3 ore · 20 de atribute · 6 dimensiuni", cifrele din document; spun ce cumperi înainte de preț |
| Caseta de achiziție | `packages` (CMS) | preț, durată, format, buton — **prima în DOM**, vezi mai jos |
| Cuprinsul | titlurile din `body` | programele au 8–10 secțiuni; fără el, pe telefon sunt un perete |
| Corpul | `body` din `packages.ts` | textul aprobat, structurat |
| Banda de investiție | `includes` + `investmentNotes` | lista integrală, tranșele, factura pe firmă, al doilea buton |
| Întrebări frecvente | `packages.faq` | neschimbat |
| Celelalte programe | `getPackages()` | neschimbat |
| Blocul final | `cta` din `packages.ts` | al treilea buton, cu textul propriu al programului |

**Ordinea din DOM e gândită pentru telefon, nu pentru desktop.** Peste 1000px pagina
are două coloane și caseta de preț stă lipită de titlu, în dreapta. Sub 1000px grila
cade pe o coloană — iar cu ordinea de desktop, prețul și butonul ar fi ajuns **după**
cele nouă secțiuni de text, adică la câteva mii de pixeli de primul ecran. De aceea
caseta e prima în DOM și trece în dreapta abia pe desktop, din `order`.

**Trei puncte de cumpărare, nu unul, și fiecare are textul lui.** Documentele
clientei își numesc singure butoanele — „Aplică pentru programul CLAR™",
„Programează conversația de potrivire", „Rezervă-ți locul" — și cer explicit CTA în
trei poziții: sus, la investiție și la final. Un buton care spune ce urmează
convertește altfel decât unul generic, deci textele stau în conținut, lângă program
(`PackageCta` în `src/content/types.ts`), nu în componentă.

**Câmpurile noi NU sunt în schemă, și e o decizie.** `kicker`, `highlights`,
`investmentNotes` și `cta` vin exclusiv din `src/content/packages.ts`, prin aceeași
poartă ca `body`: `toPackageDetail` le citește din pachetul aprobat, potrivit pe
slug. Sunt redactare de pagină de vânzare, nu date pe care cineva să le țină
sincronizate în admin — iar patru câmpuri noi în colecție ar fi însemnat o migrație
pentru text care oricum se schimbă odată cu documentul clientei. Un pachet creat
direct în CMS rămâne fără ele și cade pe variantele generice din `CTA_FALLBACK`.

**Ancorele cuprinsului se calculează cu `slugifyAnchor`**, aceeași funcție care le
pune pe titlurile articolelor de blog, deci nu pot devia. Verificat: cele 11 ancore
din cuprinsul paginii SPA au fiecare un `<section id>` corespunzător.

**Textul nou din documente**, față de ce era deja în site: secțiunea „Ce urmărim, în
funcție de rolul tău" (antreprenori / lideri și manageri / profesioniști), din
documentul Strategic Performance Assessment. Restul documentelor era deja în
`packages.ts` din 7 septembrie.

### Submeniurile din navigație ✅ — 8 septembrie 2026

„Servicii" și „Workshopuri" se deschid, în antet și în meniul mobil.

| | Antet (≥1000px) | Meniu mobil |
|---|---|---|
| Componenta | `layout/NavDropdown.tsx` — **Server Component** | `<details>` nativ, în `MobileNav` |
| Ce îl deschide | `:hover` și `:has(:focus-visible)`, pur CSS (din 25 sept.; înainte `:focus-within`, vezi §10) | apăsarea pe `<summary>` |
| JavaScript | zero | zero în plus — `MobileNav` era deja componentă de client |

**Componentele de client sunt tot exact patru.** Un meniu care se deschide pare, din
reflex, o chestiune de stare. Nu este: `:hover` rezolvă mouse-ul, `:focus-within`
rezolvă tastatura, iar acordeonul nativ le rezolvă pe amândouă pe telefon.

**Panoul se ascunde din `opacity`, niciodată din `display` sau `visibility`.** Ambele
din urmă scot linkurile din ordinea de tabulare — iar atunci `:focus-within` nu se
mai poate declanșa niciodată, pentru că nimic din interior nu mai poate primi focus.
Rezultatul ar fi un meniu perfect cu mouse-ul și inaccesibil de la tastatură. Cu
`opacity: 0` + `pointer-events: none`, prima tastă Tab intră în panou, `:focus-within`
devine adevărat și panoul se aprinde; mouse-ul nu poate apăsa ce nu se vede.

**Paddingul de sus stă pe învelișul poziționat, nu pe cartelă**, ca spațiul dintre
intrarea din meniu și panou să facă parte din zona de hover. Fără puntea asta, meniul
se închide când cobori mouse-ul spre el.

**Panoul e ancorat la dreapta** (`right-0`): crește spre interiorul paginii, deci nu
iese din ecran nici la 1000px, unde „Workshopuri" stă deja aproape de marginea din
dreapta. Catalogul de paisprezece primește panoul pe două coloane; cele trei programe,
o singură coloană.

**Submeniurile se atașează pe server, într-un singur loc** — `src/lib/nav.ts`, chemat
din layout — și merg **și** în `nav`, **și** în `mobileNav`, deci antetul și meniul
mobil nu pot ajunge să arate lucruri diferite. Nu sunt scrise în `src/content/site.ts`:
navigația statică e o listă de rute, iar submeniul e inventarul a ceea ce se vinde
astăzi. Scris de mână, un program redenumit din admin ar fi apărut cu numele vechi în
meniu și cu cel nou în pagină.

**Workshopurile duc la ancore, nu la rute proprii.** Catalogul e o singură pagină —
cerință de conținut, partea comună a celor paisprezece se scrie o dată, în capul ei.
Fiecare card are deja `id={slug}` și `scroll-mt-[132px]` cât bara sticky. Verificat:
toate cele 14 ancore din meniu au un card cu `id` pe `/workshopuri-performanta-umana`.

**Ordinea din submeniu e ordinea din pagină**, calculată de `prepareWorkshops`: întâi
edițiile cu dată, cronologic, apoi restul catalogului. Cine coboară prin meniu
găsește cardurile în aceeași succesiune.

### Cum se citesc paginile lungi ✅ — 8 septembrie 2026, runda a doua

Problema semnalată de clientă: paginile de program și cea de workshopuri „par
pagini din Word". Avea dreptate, și cauza era una singură — **toate secțiunile
erau randate identic**. Titlu, paragrafe, listă, blocuri numerotate, la rând,
într-o coloană, cu același spațiu între ele. Pe un program cu zece secțiuni asta
se citește ca o sarcină, nu ca o ofertă.

Nu s-a schimbat niciun cuvânt din textul clientei. S-a schimbat ce știe pagina
despre el.

#### 1. Fiecare secțiune își declară felul

`PackageSection` a primit `kind`, iar `src/content/packages.ts` îl scrie pe
fiecare secțiune. Nu e o preferință de stil: e o afirmație despre conținut, de
aceea stă lângă text, nu în componentă.

| Fel | Ce e | Cum arată | Semn |
|---|---|---|---|
| `prose` | narațiune | coloană îngustă, ritm de articol | — |
| `checklist` | situații în care te recunoști | grilă de rânduri cu bifă, 2 coloane | bifă |
| `cards` | lucruri care stau alături | carduri, 2–3 pe rând | grilă |
| `steps` | etape parcurse în ordine | verticală numerotată, cu firul care le leagă | traseu |
| `outcomes` | ce primești la final | rânduri numerotate | romb |
| `split` | aceeași întrebare, două răspunsuri | două coloane opuse | cerc tăiat |
| `statement` | promisiunea programului | citat pe bloc întunecat | ghilimele |

**Benzile de citit se deosebesc de cele de scanat.** Cele narative primesc doar
numărul; toate celelalte primesc și un semn. Cine derulează repede vede din
periferie unde e text de citit și unde e o listă din care poate lua doar ce îl
privește. Asta e toată diferența dintre „am de citit mult" și „văd unde e ce mă
interesează".

#### 2. Fundalul alternează, spațiul nu crește

Fiecare secțiune e acum o `<Section>` proprie, hârtie / crem, alternat.
Separarea o face culoarea, nu spațiul: tokenul nou `--spacing-section-body`
(`clamp(3.5rem, 6vw, 6rem)`) e mult mai strâns decât `--spacing-section` de pe
prima pagină. Zece benzi la ritmul de acolo ar fi însemnat trei ecrane de gol.

**Un singur bloc `ink` pe pagină**, exact ca pe prima pagină, unde acela e
citatul. Îl primește `statement` — promisiunea programului. Un al doilea l-ar
face pe primul să nu mai însemne nimic. Secțiunea `statement` **nu consumă un
pas** din alternanță, ca hârtia și cremul să continue corect de o parte și de
alta a ei.

#### 3. Pictogramele sunt desenate, nu importate

`src/components/ui/Glyph.tsx`, douăsprezece semne, **zero dependențe**. Regula 4
din §2 interzice bibliotecile de componente, dar motivul real e de design:
seturile obișnuite sunt desenate la 1.5–2px, cu colțuri rotunjite și cu un
vocabular de aplicație. Peste Cormorant Garamond și peste hairline-urile de 1px
ale designului aprobat ar arăta ca un panou de administrare lipit peste o pagină
editorială. Ale noastre sunt trasate în limbajul paginii: **linie de 1px, în
accent, fără umplere**, pe o casetă de 24 de unități.

**Un semn per tip de bloc, nu unul per rând.** Un semn repetat pe fiecare
element dintr-o listă de nouă nu mai transmite nimic — devine marcator de listă,
și pentru asta există `<ul>`. Excepția e bifa, care chiar marchează elemente.
Toate sunt `aria-hidden`: informația stă în titlul de lângă ele.

#### 4. Antetul fiecărui program are un desen care ESTE programul

`src/components/ui/ProgramMotif.tsx`. Paginile n-au fotografie proprie și nu vor
avea: ședința foto a produs șase cadre, toate repartizate, iar același portret pe
toate trei ar spune că programele sunt același lucru.

| Program | Desenul | Ce spune |
|---|---|---|
| Strategic Performance Assessment™ | hartă radială, 6 axe | cele șase dimensiuni, cu **exact** atâtea puncte pe fiecare axă câte atribute are: 3+4+4+4+3+2 = 20 |
| CLAR™ | traseu ascendent, 4 opriri | C → L → A → R, în ordine, pentru că ordinea e chiar metoda |
| Executive Performance Program™ | linie de timp | evaluarea inițială (nodul mare), 12 sesiuni, două evaluări intermediare, evaluarea finală |

**Numerele nu sunt decorative.** Dacă cineva schimbă câte atribute are o
dimensiune, se schimbă și desenul — sunt aceleași date. Regulile de trasare sunt
cele de la `HeroField`: linie de 1px, aurul rămâne fir și nu devine suprafață,
geometria se calculează din date, nu se scrie ca șiruri de coordonate.

#### 5. Harta paginii

Chipsuri numerotate, una pe bandă, imediat sub antet. Numerele sunt aceleași cu
cele de pe benzi pentru că vin din aceeași funcție (`packageOutline`), deci nu
pot ajunge să spună lucruri diferite. Apare de la patru secțiuni în sus.

#### 6. Antetul răspunde înainte de orice derulare

Linia cu expresia căutată, numele, promisiunea, faptele scanabile, **prețul și
butonul** — plus desenul, în dreapta. **Coloana sticky de achiziție a dispărut**:
avea sens cât timp corpul paginii era o coloană de text, dar lângă benzi late
le-ar fi tăiat în două pe toată înălțimea. Rolul ei l-a luat antetul.

Cele trei fapte din ea — durată, format, pentru cine — au coborât în banda de
investiție, adică fix acolo unde omul le recitește: în clipa în care decide.
Verificat prin diff că nu s-a pierdut nimic pe drum; vezi §6.

#### 7. Pagina de workshopuri, aceeași operație

Partea comună — ce diferențiază seria, programul zilei, pentru cine e — era o
singură coloană de trei ecrane, deasupra a paisprezece carduri. Acum sunt patru
benzi: carduri pentru diferențiatori, tabel pentru orar (rămâne `<table>`
semantic, pentru AEO — s-a schimbat doar cum arată: modulele au marginea în
accent, pauzele stau retrase), bloc întunecat pentru fraza despre public.

Catalogul a primit o **bară de sărituri** cu cele paisprezece titluri, în care
punctul auriu marchează edițiile deschise. Înlocuiește fraza „Deschise acum: …",
care spunea strict mai puțin și tot text era.

**Cardul deschis se vede acum de la doi metri**, prin trei semnale deodată:
fundal crem, margine în accent și pastila „Înscrieri deschise". Culoarea singură
n-ar fi suficientă — cine n-o distinge ar rămâne fără informație, iar pastila o
scrie în cuvinte. Secțiunea catalogului a trecut de pe crem pe hârtie tocmai ca
să existe contrastul: înainte, cardurile crem stăteau pe o secțiune tot crem și
nu se deosebeau deloc.

#### Singura atingere a textului, și de ce

`trimItem` scoate **la randare** punctul și virgula de la capătul elementelor de
listă. Erau corecte când lista era o frază lungă întreruptă; într-o grilă de
carduri, fiecare element se citește singur, iar `;`-ul rămas atârnă. Se scoate la
randare, nu din conținut: fișierul rămâne sursa din care `pnpm seed` populează
CMS-ul, iar acolo textul trebuie să fie cel livrat de clientă.

Cardurile din `cards` își iau titlul din prima jumătate a propoziției, până la
primul „: ". Propoziția clientei rămâne exact cum a scris-o.

Singurele două șiruri adăugate sunt etichete de navigație, nu conținut:
`splitLabels` pe secțiunea „Cui i se potrivește și cui nu" — „Este pentru tine
dacă" / „Nu este programul potrivit dacă", care doar numesc ce spunea deja prima
frază a fiecărui paragraf — și „Ziua de workshop", eticheta benzii cu orarul.

#### Contrastul, recalculat pe suprafețele noi

`--ac-ink-50` pe `--ac-cream-50` dă **4.24:1**, sub AA — aceeași cifră măsurată
la câmpul heroului. Benzile crem și cardurile de workshop deschise sunt tocmai
crem, deci textul secundar de pe ele a urcat la `--ac-ink-70` (**8.11:1**). Nu e
o preferință: e aceeași regulă ca la `ac-accent-deep` pe `cream-100` (§9.3) —
varianta mai închisă se folosește strict unde cea normală pică.

Pastila cu semn (`GlyphBadge`) e în `--ac-accent-ink`, nu în `--ac-accent`:
5.44:1 pe hârtie și 4.98:1 pe crem, adică peste pragul de 3:1 pentru elemente
negrafice. Semnele mici inline rămân în `--ac-accent`, ca toate hairline-urile și
numeralele designului aprobat — sunt decorative și dublează un text de lângă.

---

## 5. CE NU ESTE FĂCUT

### Faza 4 — Stripe ✅ **completă din 7 septembrie 2026** (vezi §4)

Ce rămâne de făcut e **configurare, nu cod**: cheile din §7.8 și abonarea
endpointului de webhook la evenimente, în dashboard-ul Stripe. Fără ele site-ul
funcționează, dar nu încasează — butonul de plată trimite cumpărătorul pe calea de
rezervare fără plată online. Este o degradare intenționată, verificată.

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
### Runda din 25 septembrie 2026 ✅

#### Preț la cerere — „Solicită ofertă"

Bifă nouă în admin, pe pachet: **„Preț la cerere"** (`priceOnRequest`,
migrația `20260925_075050_pret_la_cerere`). Bifată pe CLAR™ și EPP.

| Unde | Program cu preț | Program la cerere |
|---|---|---|
| Card (homepage, `/servicii`, conexe) | preț + „Detalii și achiziție" | „Solicită ofertă" + „Detalii program" |
| Antetul paginii de program | preț + buton de plată | „Ofertă personalizată" + „Solicită ofertă" |
| Banda de investiție | preț + buton de plată | „Ofertă personalizată" + „Solicită ofertă" |
| Submeniul din antet | durată · preț | doar durata |
| `llms.txt` | `Preț: 1500 RON.` | `Preț: ofertă personalizată, la cerere…` |
| JSON-LD `Service` | cu `Offer` | fără `Offer` (un `Offer` fără preț e mai rău decât niciunul) |
| `POST /api/stripe/checkout` | Stripe | 303 → `/contact?pachet=…&cerere=oferta#formular` |

**Prețul nu ajunge în pagină, nu doar nu se afișează.** `content.ts` (din CMS)
și `publicPackage()` (din fallback) pun `price: null` înainte ca pachetul să
plece spre componente; `pricing: 'quote'` spune de ce e `null`. Niciun
consumator — card, meniu, `llms.txt`, schema — nu îl poate afișa din greșeală.
Prețul rămâne în document și în `packagesFallback`, pentru seed și Stripe.
Verificat: zero apariții ale sumelor în HTML **și** în payload-ul RSC.

**Trei texte ale clientei pomeneau suma** și au fost atinse, minimal: nota de
investiție CLAR (tranșele de 2.550 lei), FAQ-ul CLAR despre tranșe și întrebarea
EPP „Ce include investiția de 15.000 lei?". Plus a doua frază din intro-ul
secțiunii Servicii („Poți achiziționa direct din pagină"), care nu mai era
adevărată. **Migrația le actualizează și în CMS**, dar numai dacă textul e exact
cel scris de seed — ce a rescris Adriana în admin rămâne neatins.

`quoteHref()` în `src/lib/routes.ts` e singurul loc care știe adresa cererii de
ofertă. Contactul recunoaște `cerere=oferta` și precompletează un mesaj cu
câmpurile de care are nevoie o ofertă (`contactPage.quotePrefill`).

#### Pagina de contact

CTA în antet — „Scrie-mi acum ↓" (sau „Cere o ofertă personalizată ↓") — către
`#formular`. Formularul stă pe o bandă crem, într-o cartelă de hârtie cu margine
în accent; ținta ancorei e cartela, nu banda. Pe crem, textul secundar al
coloanei „Sau direct" a urcat la `ink-70`.

#### `/despre`

Portretul intră prin `image` pe `PageHeader`, ca pe celelalte pagini interioare.
Sub antet: narațiunea în stânga, reperele pe două coloane în dreapta (opt
repere într-o coloană erau de trei ori mai înalte decât cele două paragrafe).

#### Laptopuri de 14" — varianta `short:`

`@custom-variant short` = `(min-width: 1000px) and (max-height: 860px)`. Două
mecanisme, amândouă în `globals.css`:

1. **Tokenii se plafonează pe înălțime**: `--text-h1: clamp(2.5rem, min(4.9vw,
   8.6vh), 4.5rem)` și la fel titlurile, lead-ul și ritmul secțiunilor. Pe un
   ecran înalt câștigă termenul în `vw`, deci valoarea e cea din design.
2. **`short:` pe marginile verticale** ale heroului, `PageHeader`, firului
   Ariadnei și antetului de program.

Fotografiile din `PageHeader` și desenul programului sunt plafonate și la
`(100svh − 230px) × raport`, deci încap întregi în primul ecran.

Măsurat la 1536 × 784: pe homepage, ambele butoane și banda de etichete sunt în
primul ecran (înainte: nici butoanele); pe paginile de program, prețul/oferta și
butonul (înainte: sub primul ecran); pe contact și workshopuri, antetul întreg.

#### Butonul „Înapoi sus" — `ui/BackToTop`

Server Component, `<a href="#top">`. Apare după 60vh derulați, dintr-o animație
`scroll(root)`. **Starea de bază e vizibilă**: fără timeline de derulare sau cu
`prefers-reduced-motion`, butonul e vizibil tot timpul, nu invizibil pentru
totdeauna (capcana din §10). Pe workshopuri și pe cele trei pagini de program.

#### Firul Ariadnei pe telefon

Sub 640px, un fir de 3+ niveluri devine doar „← Servicii". Lista completă
rămâne în HTML, `BreadcrumbList` nu se schimbă.


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
| Cele 15 rute publice răspund 200 | ✅ (17 după 7 septembrie 2026) |
| **Ruta de plată, pe cele patru căi** | ✅ deschis → Stripe · închis → contact · inexistent → catalog · pachet → Stripe |
| **Precompletarea din contact, pe cele trei situații** | ✅ rezervare cu dată · listă de așteptare · plată indisponibilă |
| **Componente de client după faza 4** | ✅ tot patru — butonul de plată nu adaugă JS |
| `/blog/inexistent`, `/servicii/inexistent`, `/blog/pagina/1` | ✅ 404 |
| Formularul de contact, în browser, pe build de producție | ✅ trimite, salvează, confirmă |
| Formular: date invalide, honeypot, limitare de rată | ✅ 400 / 400 / 429 |
| Ordinea de tabulare pe o pagină interioară | ✅ 28 elemente, fără capcane |
| `/sitemap.xml`, `/llms.txt` după faza 3b | ✅ toate rutele noi |
| **Homepage, HEAD vs. paginile de program + submeniuri** | ✅ zero linii dispărute, 40 adăugate — toate în cele două submeniuri din antet |
| **Pagina randată din CMS vs. din fallback, după schimbări** | ✅ text identic pe `/` și pe toate trei paginile de program |
| **Cele trei pagini de program, fără bază de date** | ✅ 200 (înainte: 404 — vezi §10) |
| **Ancorele cuprinsului vs. `id`-urile secțiunilor** | ✅ 11/11 pe SPA |
| **Ancorele workshopurilor din meniu vs. cardurile din catalog** | ✅ 14/14 |
| **Variantele CSS ale submeniului, în bundle-ul compilat** | ✅ `group-hover:` și `group-focus-within:` emise pentru opacitate, `translate` și `pointer-events` |
| **Componente de client după submeniuri** | ✅ tot patru |
| **Homepage, înainte vs. după refacerea vizuală** | ✅ text identic la caracter — 12.985 în ambele |
| **Text pierdut la refacerea paginilor de program** | ✅ zero, după ce diff-ul a găsit două scăpări și au fost reparate |
| **CMS vs. fallback după refacerea vizuală** | ✅ identic pe `/`, pe toate trei paginile de program și pe workshopuri |
| **Componente de client după refacerea vizuală** | ✅ tot patru — pictogramele și desenele sunt SVG randat pe server |
| **Contrast pe suprafețele crem noi** | ✅ text secundar urcat la `ink-70` (8.11:1); `ink-50` pe crem dădea 4.24:1 |

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
| **25 sept.: sumele CLAR/EPP în HTML și în payload-ul RSC** | ✅ zero pe `/`, `/servicii`, cele trei programe, `/despre`, `/contact`, workshopuri, `llms.txt` |
| **25 sept.: `POST` de plată pe CLAR / EPP / SPA** | ✅ 303 → formular de ofertă · 303 → formular de ofertă · SPA neschimbat |
| **25 sept.: migrația, rulată din starea de dinainte** | ✅ bifa pe 2 pachete, FAQ-urile și intro-ul actualizate, zero `lei` rămas în FAQ |
| **25 sept.: CMS vs. fallback** | ✅ text identic pe 8 pagini, după migrație |
| **25 sept.: homepage, HEAD vs. acum** | ✅ doar schimbările cerute: 2 prețuri din submeniu, 2 prețuri de pe carduri → „Solicită ofertă", intro-ul Servicii |
| **25 sept.: `pnpm seed` de două ori** | ✅ pachetele neatinse, zero duplicate |
| **25 sept.: în browser, 1536 × 784 și 390px** | ✅ submeniul se închide după click; „Înapoi sus" ascuns sus, vizibil după derulare; antetele încap pe 14" |
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

### ✅ Câmpul heroului nu a mișcat niciun text — verificat prin diff

Aceeași metodă (§12.5), rulată pe 25 august 2026 pentru schimbul „voal scos, câmp
pus": build de producție pe `HEAD`, build de producție cu schimbarea, `curl` pe `/` în
ambele, diff pe markup normalizat.

**Rezultat: 32 de linii diferite, toate explicabile** — opt noduri de voal scoase,
opt noduri de câmp adăugate (`<div data-hero-field>` cu cele trei corpuri), hash-ul
fișierului CSS, și renumerotarea id-urilor din payload-ul RSC, care se decalează cu
unu pentru că arborele React a pierdut un nod (aceeași diferență colaterală ca la
lumina paginii). **Text vizibil identic la caracter: 9616 în ambele.**

> Nota de cifre: 9616, nu 9692 ca în comparațiile de mai sus, pentru că Postgres-ul
> local era oprit și ambele build-uri au căzut pe `src/content/`. Comparația rămâne
> validă — contează că cele două părți sunt identice între ele.

Câmpul e `position: absolute`, `z-index: -1`, într-o secțiune care era deja
`relative isolate` din cauza aurei: înălțimile secțiunilor rămân cele din comparația
la pixel, care **nu trebuie refăcută.**

### ✅ Voalurile și inelele n-au mișcat niciun text — verificat prin diff

Rulat pe 25 august 2026, pentru refacerea câmpului (§9.19). De data asta A/B-ul a fost
direct: serverul de producție de pe `:3000` rula încă build-ul dinainte de schimbare,
iar cel de dezvoltare, pe `:3100`, avea schimbarea. `curl` pe `/` în ambele, tag-urile
scoase, spațiile normalizate, comparație caracter cu caracter.

**Rezultat: text vizibil identic — 9616 caractere în ambele.** Singurele noduri
adăugate sunt cinci `<span>`-uri decorative în interiorul `[data-hero-field]`, care
era deja `position: absolute; z-index: -1`. Comparația la pixel cu designul aprobat
**nu trebuie refăcută.**

Verificat în plus, pe build de producție, la 1440px: zero mesaje în consolă, banda de
etichete de sub butoane și legenda portretului stau pe hârtie curată (masca își face
treaba), iar toate cele opt animații rulează — numai `rotate`, `translate` și `scale`,
deci compuse pe GPU.

**Runda a doua (inele eliptice + responsivitate), aceeași zi.** Aceeași metodă, pe
build de producție: **9616 caractere vizibile**, identic cu referința. Nodurile
adăugate sunt două `<span>`-uri (`data-hero-ring-body`), tot în interiorul câmpului.

Responsivitatea, măsurată în browser la 388px lățime: `scrollWidth` 373 pe un viewport
de 388, deci **zero depășire orizontală**; ambele inele încap integral în casetă
(278px și 157px pe 373px), iar voalurile au coborât de la 617px la 280–287px. Banda de
etichete de pe telefon stă tot pe hârtie curată, cu masca nouă (46% → 86%).

### ✅ Coala de fildeș n-a mișcat niciun text — verificat prin diff

Rulat pe 31 august 2026, pentru refacerea de la §9.20 (fundal ivory, curbă organică,
zero forme circulare). Metoda, de data asta, e mai strictă decât comparația pe text
vizibil: A/B pe HTML-ul randat, cu `git stash` între cele două capturi, deci **exact
același server, aceeași bază de date, același build**.

```bash
curl -s http://localhost:3000/ > now.html
git stash push -- src/components/ui/HeroField.tsx src/components/ui/SectionAura.tsx src/app/globals.css
curl -s http://localhost:3000/ > head.html
git stash pop
# apoi: scoase <script>self.__next_f.push(...)</script> și /_next/static/*,
# spart pe tag-uri (`sed 's#>#>\n#g'`) și diff token cu token
```

**Rezultat: în afara stratului decorativ, doar două atribute diferă** — cele două
`--fa` ale aurei de hero, coborâte de la 0.32/0.30 la 0.12/0.10, adică schimbarea
intenționată din §4. Zero noduri de text, zero clase, zero atribute de layout
modificate. Tot restul diferențelor sunt înăuntrul lui `[data-hero-field]`, care e
`position: absolute; z-index: -1`. Comparația la pixel cu designul aprobat **nu
trebuie refăcută.**

Verificat în plus, în browser la 1440px: `pnpm build` și `pnpm typecheck` curate,
`pnpm verify:faza2` la 10/10, grep-ul de sedile la zero. Fundalul e fildeș cald sub
coloana de text și lumină sub fotografie, firul de aur și ecoul lui se sting înainte
de banda de etichete, iar în ultima cincime a heroului forma se dizolvă în hârtie.

**Telefonul, măsurat într-un iframe de 390px** (media query-ul se aplică pe viewportul
iframe-ului, deci compoziția de sub 1000px se poate vedea fără redimensionarea
ferestrei): heroul are 1486px, banda de etichete stă între 53.8% și 60.6%, fotografia
începe la 63.3%. **Prima variantă avea firul de aur exact peste etichete** — s-a văzut
în browser și a fost scos; vezi §4 pentru de ce nu se reintroduce.

### ✅ Conținutul real n-a rupt grila homepage-ului — verificat prin diff

7 septembrie 2026. Aceeași metodă ca mai sus: build de producție pe `HEAD`, build de
producție cu modificările, `curl` pe `/` în ambele, diff după normalizarea
payload-ului RSC și a hash-urilor de chunk. **Atenție la citire: ambele build-uri au
citit din ACEEAȘI bază de date, deja populată**, deci „înainte" înseamnă aici
„cardurile cu listele complete din CMS", nu placeholderele din design.

**Rezultat: 11 fragmente de text dispărute, 25 adăugate. Toate explicate:**

| Dispărut | De ce |
|---|---|
| 8 rânduri din listele „Ce include" | `CARD_INCLUDES = 3` — vezi mai jos |
| 3 × `EUR` | înlocuit cu `RON` |

| Adăugat | De ce |
|---|---|
| „Workshopuri", „Recomandări" (×2 fiecare) | intrări noi în antet și subsol |
| 21 de fragmente | secțiunea de recomandări, cerută de clientă (§9.21) |
| 3 × `RON` | moneda reală |

**Nimic altceva nu s-a mutat.**

**Descoperirea importantă a acestei verificări.** Programele reale au între cinci și
șase elemente în „Ce include". Randate integral, cardurile ar fi avut liste de
lungimi diferite, iar cardul din mijloc ar fi crescut cu peste 60px — grila verificată
la pixel s-ar fi rupt tăcut, la prima populare a CMS-ului. Numărat în cele trei surse:

```
build HEAD (liste complete din CMS)  →  [5, 6, 6]
design/homepage-approved.html        →  [3, 3, 3]
build acum (cu CARD_INCLUDES)        →  [3, 3, 3]
```

De aceea `mergePackages` taie lista la trei rânduri pe card. Elementele nu se pierd:
apar integral pe pagina pachetului. Dacă cineva scoate plafonul „ca să se vadă tot",
grila se rupe din nou — și nu se vede în niciun test.

### ✅ Submeniurile n-au atins niciun cuvânt din homepage — verificat prin diff

8 septembrie 2026. Antetul e pe toate paginile, deci un submeniu prost pus e o
regresie pe toate. Metoda din §12.5: build de producție pe `HEAD` (`git stash -u`),
build de producție cu schimbările, `curl` pe `/` în ambele, comparație pe textul
vizibil după scoaterea tag-urilor și normalizarea spațiilor.

**Rezultat: zero linii dispărute, 40 adăugate — toate în cele două submeniuri.**
Nouă rânduri pentru cele trei programe (nume + durata și prețul) și 31 pentru
catalogul de paisprezece (titlu + subtitlu), plus cele două rânduri „vezi tot". Nicio
altă schimbare: aceleași 296 de linii de dinainte se regăsesc, în aceeași ordine.

Cele două submeniuri sunt în HTML-ul livrat, nu injectate după hidratare — deci și
crawlerele care nu execută JS văd legăturile către cele trei programe și către cele
paisprezece workshopuri. Submeniurile din meniul mobil **nu** apar în HTML-ul inițial,
pentru că panoul mobil se randează doar când e deschis; e comportamentul dinainte al
lui `MobileNav`, neschimbat.

### ✅ CMS-ul și fallback-ul dau aceleași pagini de program — verificat prin diff

Aceeași zi, aceeași metodă ca la §6 „CMS-ul nu schimbă pagina aprobată", extinsă la
cele trei pagini de program: build cu `DATABASE_URI` setat, build cu el gol, `curl` pe
`/` și pe cele trei rute, comparație pe text vizibil.

**Rezultat: identic pe toate patru** — `/` 12.985 caractere, SPA 15.592, CLAR 13.770,
EPP 9.634, aceleași cifre în ambele build-uri.

Verificarea a și găsit ce descrie §10: în build-ul fără bază de date, cele trei
pagini de program răspundeau **404**. Nu se vedea altfel — rutele existau, sitemap-ul
le lista, iar cu Postgres pornit totul era în regulă.

### ✅ Refacerea vizuală n-a pierdut niciun cuvânt — verificat prin diff

8 septembrie 2026, runda a doua. Riscul unei refaceri vizuale nu e ca ceva să
arate prost — se vede —, ci ca o informație să dispară odată cu blocul care o
purta. Metoda: `curl` pe pagina de dinainte și pe cea de după, textul vizibil
extras din amândouă, apoi **fiecare linie dispărută căutată una câte una în
pagina nouă**. Diff-ul simplu n-ar fi fost suficient: majoritatea liniilor se
schimbă oricum, pentru că `;`-ul final se scoate și pentru că un element de listă
se rupe în titlu de card plus corp.

**Verificarea a găsit două scăpări reale**, amândouă venite din desființarea
coloanei sticky de achiziție:

1. `forWho` — „Antreprenori, lideri, manageri și profesioniști care vor să
   înțeleagă ce susține și ce limitează rezultatele lor actuale." Dispăruse de
   tot din pagină.
2. „Plata se face securizat, prin Stripe." — singura mențiune de pe pagină
   despre cine procesează plata.

Amândouă au fost puse înapoi, în banda de investiție, împreună cu durata și
formatul. **După reparație: zero linii pierdute** pe toate cele patru pagini.
Restul diferențelor sunt exact cele intenționate — `;`-ul de la capătul
elementelor de listă și împărțirea „titlu: explicație" în titlu de card plus
corp, ambele verificate ca fiind prezente integral în pagina nouă.

Pe workshopuri, singurul text scos e fraza „Deschise acum: …", înlocuită de bara
de sărituri, care marchează aceleași trei ediții și le mai și numește pe toate
paisprezece.

**Homepage-ul nu s-a mișcat**, deși `globals.css` și `ui/Section` s-au atins:
text vizibil identic la caracter, 12.985 în ambele, față de commit-ul anterior.

Reproducere:

```bash
pnpm build && pnpm start -p 3000
curl -s http://127.0.0.1:3000/servicii/strategic-performance-assessment -o acum.html
# ... acelasi lucru pe commit-ul dinainte, apoi:
# scoase <script>, <style> si tag-urile; spatiile normalizate; fiecare linie
# disparuta cautata cu grep -F in pagina noua, nu doar diff
```

### ⚠️ Refacerea vizuală — NEverificată în browser

Aceeași cauză ca mai jos, din aceeași sesiune. Ce se verifică la prima sesiune cu
browser, la 1440px, ~1000px și 390px:

1. ritmul benzilor — că alternanța hârtie / crem se citește ca separare și că
   `--spacing-section-body` nu e nici prea strâns, nici prea larg;
2. cele trei desene de antet la toate lățimile: caseta e comună (400×340), dar
   textele din ele (`01`–`06`, `C L A R`, `L1`–`L6`) sunt trasate în coordonate
   de viewBox și se scalează odată cu desenul;
3. bara de chipsuri pe telefon, unde zece–paisprezece chipsuri se rup pe multe
   rânduri;
4. pastilele cu semn de lângă titluri — că semnul de 22px într-un cerc de 44px
   nu pare nici pierdut, nici înghesuit;
5. tabelul orarului sub 480px, unde are `min-w-[440px]` și derulează orizontal
   în caseta lui.

### ⚠️ Submeniurile și paginile de program — NEverificate în browser

Extensia de browser nu s-a putut conecta la serverul local în sesiunea din 8
septembrie 2026: serverul răspunde `200` din PowerShell, pe `127.0.0.1` și pe
`localhost`, dar Chrome dă `ERR_CONNECTION_REFUSED` pe ambele. Nu e o problemă a
site-ului — build-ul, HTML-ul livrat și CSS-ul compilat sunt verificate mai sus — dar
înseamnă că **nimeni nu a văzut cu ochii** următoarele, și se verifică la prima
sesiune cu browser, la 1440px, ~1000px și 390px:

1. panoul de submeniu care se deschide la hover și la Tab, și **puntea de hover**
   (mouse-ul coboară de pe „Servicii" în panou fără să se închidă);
2. panoul lat al catalogului la exact 1000px — calculul spune că încape ancorat la
   dreapta, dar marginea e strânsă;
3. acordeoanele din meniul mobil, cu cele paisprezece intrări;
4. ordinea de pe telefon a paginii de program: caseta de preț înainte de corp;
5. săritura din cuprins, cu titlul dedesubtul barei sticky (`scroll-mt-[132px]`).

### ⚠️ Placa cu portretul — verificată doar parțial în browser

Runda a doua (fotografia tăiată de curbă, §4) a fost făcută pe 31 august 2026.
`pnpm build` și `pnpm typecheck` curate, `pnpm verify:faza2` la 10/10, grep-ul de
sedile la zero, iar CSS-ul compilat conține toate regulile (`mask-composite: intersect`
prezent, ambele media query-uri emise, măștile prezente în markup cu geometria
așteptată — calea plăcii iese exact `M323.08 0C223.08 175 115.38 335 76.92 505C38.46
678 142.31 848 419.23 1000H1000V0Z`, adică ce dă calculul de mână).

**Ce s-a văzut cu ochii, la 1545px:** placa full-bleed, tăietura curbă pe latura
stângă, firul de aur care merge exact pe muchia ei, stingerea de jos. Tot atunci s-au
prins și s-au reparat două defecte: cele două curbe ratate cu ~110px (blocul de
referință greșit, vezi §4) și legenda ștearsă de mască.

**Ce NU s-a mai putut vedea** — extensia de browser s-a deconectat înainte:
1. legenda „ADRIANA CHIRA" la baza plăcii, după mutarea măștii pe cutia imaginii;
2. stingerea de jos strânsă de la 74%→92% la 80%→96%;
3. compoziția de sub 1000px, unde unda a fost mutată de pe fundal pe muchia de sus a
   fotografiei.

Primele două sunt schimbări de o valoare fiecare, a treia e geometrie nouă. **Se
verifică la următoarea sesiune cu browser**, la 1440px, la ~900px (tabletă, cazul care
a scos la iveală problema) și la 390px.

> **Comparația la pixel cu designul aprobat NU mai e valabilă pe hero, peste 1000px** —
> și e o schimbare cerută, nu un regres. Portretul iese din coloana grilei și devine
> placă lipită de marginea dreaptă (§9.20). Coloana de text rămâne exact unde era:
> grila are în continuare două coloane egale, doar că a doua e goală, iar `Shell` a
> pierdut `relative z-[1]`, care nu deplasa nimic. Sub 1000px layout-ul e neschimbat.

---

## 7. Blocaje și decizii care așteaptă clienta

Din brief §13. **Toate se completează acum din panoul de administrare**, fără cod și
fără redeploy: globalul `site-settings` pentru datele de contact și firmă, colecția
`packages` pentru pachete. Valorile din `src/content/site.ts` rămân doar ca rezervă.

| # | Element | Cum se manifestă în cod acum | Blochează |
|---|---|---|---|
| 1 | ~~**Pachetele de servicii**~~ ✅ **rezolvat pe 7 septembrie 2026** | Cele trei programe reale sunt în CMS, vizibile, cu preț în lei. Vezi §4, „Conținutul real". | — |
| 2 | ~~**Portret profesional**~~ ✅ **rezolvat** | Fotografiile din ședința foto a clientei sunt în `public/images/`, câte una pe pagină. Placeholderul filigranat din pachetul de design a fost șters. | — |
| 3 | Domeniul | `NEXT_PUBLIC_SITE_URL` are ca implicit `https://adrianachira.ro` | Deploy, canonical |
| 4 | Email, telefon | Footerul, pagina de contact, `/multumim` și paginile legale afișează `[ email ]`, `[ telefon ]`. Formularul funcționează oricum: mesajele ajung în `submissions`, în admin | Contact, schema, notificarea pe email |
| 5 | Conturi social media | `[ LinkedIn ]`, `[ Instagram ]`, `[ Facebook ]`; `sameAs` lipsește din `Person` | Schema Person |
| 6 | CUI, reg. com., sediu | Footerul afișează `[ Denumire firmă · CUI · Reg. Com. ]` | ANPC, Termeni |
| 7 | **Regim TVA, PFA sau SRL** | Prețurile se afișează ca sume simple, fără mențiune de TVA. Documentul CLAR cere explicit confirmarea: 5.100 lei este cu TVA inclus sau „+ TVA"? Se aplică la toate cele patru prețuri. | Afișarea prețurilor, configurarea Stripe |
| 8 | **Cont Stripe + chei** | Codul e complet și verificat (§4, faza 4). Lipsesc `STRIPE_SECRET_KEY` și `STRIPE_WEBHOOK_SECRET`. Fără ele, butonul de plată duce pe calea de rezervare fără plată — funcțional, dar site-ul nu încasează. Endpointul de webhook se abonează la `checkout.session.completed`, `checkout.session.async_payment_succeeded` și `charge.refunded`. | Încasările |
| 8b | **Acordul scris al celor șase autori de recomandări** | Recomandările sunt publicate integral, cu nume și funcție, pe `/testimoniale` și, trei dintre ele, pe prima pagină, pe `/despre` și pe `/servicii`. Fiecare autor trebuie să confirme în scris publicarea. Se retrage instant din admin, debifând „Vizibil pe site". De confirmat și corectura de diacritice din recomandarea lui Paul Ștefănescu. | Lansare |
| 8d | **Funcția lui Bogdan Vasiliu** | Documentul primit semnează doar cu numele. Câmpul e gol, iar rândul nu se randează — nu inventăm o funcție pentru un om real. Se completează în admin, la recomandarea lui. | — (recomandarea e publicabilă și fără) |
| 8e | **Scrierea numelui „Gabriela Tarna"** | Așa apare în document. Nu am completat diacritice ghicite pe numele unei persoane. De confirmat forma corectă. | Lansare |
| 8c | **Datele edițiilor de workshop de după decembrie 2026** | Trei ediții sunt programate (octombrie, noiembrie, decembrie 2026). Celelalte 11 workshopuri apar în catalog fără dată și fără buton de plată. Adriana le deschide punându-le o dată în admin — se pot cumpăra automat următoarele trei. | Vânzarea workshopurilor din 2027 |
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

Treizeci și cinci, toate documentate în cod prin comentarii. **Ultimele cinci
(31–35) sunt din 25 septembrie 2026.** **Ultimele șase (25–30) sunt
din 8 septembrie 2026**: submeniurile din navigație, CTA-urile proprii ale
fiecărui program, pictogramele desenate de mână, desenele de antet și trecerea
paginilor lungi pe benzi — toate cerute de clientă — plus `revalidate` pe layout,
impusă de prima dintre ele.

> Numerele 21–24 au fost renumerotate pe 8 septembrie 2026. Erau scrise ca
> „19, 20, 21, 22" după un 19 și un 20 care existau deja; Markdown le renumerota
> singur la afișare, deci nu se vedea, dar în fișier trimiteau în două locuri.

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

18. **Voalul a fost eliminat, câmpul heroului i-a luat locul** (25 august 2026).
    Clienta a respins obiectul de abur din colțul stânga-jos („nu arată bine deloc")
    și a cerut în locul lui un fundal de hero cu mișcare continuă și lentă. Voalul e
    scos complet — componentă, bloc CSS, montare în layout — nu doar stins din
    `--ac-veil-gain`. **Nu se reintroduce fără o cerere explicită.**

    Lecția, pentru orice decor viitor: obiectul cerea atenție tocmai pentru că era un
    obiect — mic, cu contur, cu volum, fixat de ecran, deasupra conținutului. Cu cât
    era mai reușit tehnic, cu atât se uita omul mai mult la el și mai puțin la text.
    Înlocuitorul (`src/components/ui/HeroField.tsx`, descris în §4) face invers: n-are
    contur, e mare, stă sub conținut și nu ajunge nicăieri — mișcă ochiul, nu îl
    cheamă. Se stinge din `--ac-hero-field-gain: 0`.

19. **Heroul are voie să atragă atenția** (25 august 2026). După ce câmpul a înlocuit
    voalul, clienta a cerut mai mult: un fundal de hero „plăcut vizual, în mișcare
    continuă lentă, elegant — ceva care să atragă atenția". Premisa se inversează
    față de punctul 18: nu mai e „nu te uita la mine", ci „uită-te, dar la text
    ajungi tot în două secunde".

    Ce s-a schimbat concret: peste corpurile de lumină s-au adăugat trei voaluri de
    mătase (gradiente conice care se rotesc încet) și două inele de aur cu halou,
    plus un strat static de granulație. Descrise integral în §4.

    **A doua rundă, aceeași zi:** clienta a cerut ca rotația să se și *vadă* —
    „mișcare continuă lentă, semnificând infinitul / continuitate" — și a semnalat
    că pe telefon compoziția pare că depășește ecranul. Inelele au devenit elipse
    (un cerc perfect care se rotește nu arată nimic), iar toate dimensiunile de pe
    telefon au fost recalibrate: voalurile au coborât de la 617px la ~285px pe o
    casetă de 373px, iar inelele încap acum întregi. Vezi §4 și verificarea din §6.

    Ce NU s-a schimbat, și nu se schimbă nici la o cerere de „mai mult": plafonul de
    aur pe suprafețele mari, masca ce stinge tot stratul înainte de banda de
    etichete, zero JS, zero bibliotecă de animație, durate prime, și
    `position: absolute; z-index: -1` — adică zero text mutat. Verificat prin diff,
    vezi §6.

    **Punctul acesta a fost anulat pe 31 august 2026** — vezi punctul 20.

20. **Heroul redevine minimalist, pe bază de fotografie de referință**
    (31 august 2026). Clienta a trimis o imagine de referință pentru primul ecran și
    a cerut: fundal ivory/crem, „foarte minimalist și elegant", **eliminarea formelor
    circulare actuale**, o tranziție organică și subtilă între zona de text și
    fotografie, accente „foarte discrete" de auriu cald, rezultat „premium, editorial
    și rafinat". Explicit: fără modificări de structură, conținut, fonturi,
    fotografie, layout sau culori de brand — doar fundalul și decorul care îl
    integrează cu fotografia.

    Premisa se inversează a doua oară, și acum se întoarce dincolo de punctul de
    plecare. La punctul 18 decorul nu avea voie să fie observat. La 19 avea voie să
    atragă privirea. Aici **atenția se mută pe fotografie**: fundalul nu mai
    concurează cu ea, o încadrează. Regula nouă: singurul lucru la care se uită omul
    pe primul ecran e portretul și titlul; tot restul e hârtie.

    Ce s-a eliminat, complet — componente, blocuri CSS, keyframes: trei corpuri de
    lumină care derivau, trei voaluri conice care se roteau, două inele de aur cu
    halou, opt animații, șapte seturi de keyframes. **Nu se reintroduc fără o cerere
    explicită.** Ce a rămas: un fond de fildeș, o singură lumină difuză în spatele
    portretului și o curbă Bézier cu fir de aur între coloana de text și fotografie.
    Descrise integral în §4.

    O singură schimbare atinge un fișier din afara heroului: greutatea aurului din
    varianta `hero` a aurei de secțiune, coborâtă de la 0.32/0.30 la 0.12/0.10.
    Motivul e chiar cererea: haloul de accent al aurei stă între 50% și 82% din rază
    și, pe fundalul minimalist de acum, ar fi reapărut ca inel. Celelalte patru
    variante de aură nu s-au atins.

    Ce NU s-a schimbat: aurul rămâne fir, niciodată suprafață; stratul care întunecă
    hârtia poartă în continuare masca de contrast înainte de banda de etichete de
    11px; zero JS, zero bibliotecă de animație; `position: absolute; z-index: -1`,
    adică zero text mutat. Verificat prin diff pe HTML randat, vezi §6.

    **Runda a doua, aceeași zi — fotografia intră în compoziție.** Prima variantă
    lăsa curba să treacă pe LÂNGĂ fotografie, iar clienta a semnalat corect că
    „poza cu persoana este încă un dreptunghi, are margini clare, în loc să fie
    integrată în background și linia curbă". Peste 1000px portretul iese acum din
    coloana grilei și devine placă lipită de marginea dreaptă a ecranului, de sus
    până jos, cu latura stângă tăiată chiar de curbă — compoziția din fotografia de
    referință. Sub 1000px caseta rămâne unde era, dar cu muchia de sus tăiată de
    aceeași idee, rotită. Descris integral în §4.

    **Aceasta e singura schimbare de layout din tot lucrul de pe 31 august**, și e
    cerută explicit: fără ea fotografia rămâne un dreptunghi, oricât de bine ar
    arăta fundalul din jurul lui. Coloana de text nu se mișcă. Comparația la pixel
    cu designul aprobat nu mai e valabilă pe heroul de desktop — vezi nota din §6.

21. **A treisprezecea secțiune pe homepage: recomandările** (7 septembrie 2026).
    `src/components/sections/Testimoniale.tsx`, între blocul de citat și pachete.
    Designul aprobat are douăsprezece secțiuni. **Adăugarea a fost cerută explicit
    de clientă**, odată cu livrarea celor trei recomandări.

    Ce s-a păstrat, ca să nu se simtă lipită: aceeași grilă de trei carduri,
    aceleași margini, aceeași etichetă versală și același `h2` ca la secțiunea de
    servicii. Nicio formă vizuală nouă. Poziția e aleasă: dovada socială cade fix
    înaintea prețurilor. Ritmul de fundal rămâne citit corect — ink, crem, hârtie.

    Textele lungi NU sunt aici: cardul poartă o singură frază, iar recomandarea
    întreagă stă pe `/testimoniale`. Trei texte de câte opt paragrafe ar fi rupt
    pagina în două.

    Secțiunea dispare singură dacă nicio recomandare nu e marcată pentru prima
    pagină, deci nu i-am mai dat comutator propriu în CMS: `featured` și „Vizibil pe
    site" pe fiecare recomandare fac deja treaba, mai fin.

22. **A cincea intrare în navigație: „Workshopuri"** (`src/content/site.ts`).
    Designul aprobat are patru. Nu contrazice designul, îl extinde: la momentul
    aprobării, workshopurile nu existau ca ofertă. Sunt al doilea lucru vandabil din
    site, cu pagină și preț propriu, iar o linie de produs care nu apare în
    navigație nu se vinde. Măsurat la 1000px, pragul la care apare navigația pe
    desktop, cele cinci intrări plus butonul de programare încap fără să se rupă
    rândul. În meniul mobil și în subsol intră și „Recomandări".

    Eticheta e scurtă, deși adresa e lungă (`/workshopuri-performanta-umana`, cea
    recomandată în documentul clientei): adresa poartă expresia căutată în Google,
    meniul poartă cuvântul pe care îl caută omul cu ochiul.

23. **Lista „Ce include" e tăiată la trei rânduri pe card**
    (`CARD_INCLUDES` în `src/content/packages.ts`). Programele reale au între cinci
    și șase elemente. Randate integral, ar fi înălțat cardul din mijloc cu peste
    60px și ar fi rupt grila verificată la pixel — tăcut, la prima populare a
    CMS-ului. Cardul din designul aprobat are exact trei rânduri, iar plafonul le
    readuce la trei. Elementele nu se pierd: apar integral pe pagina pachetului.
    Măsurătoarea e în §6.

24. **Cardul evidențiat rămâne cel din mijloc, deși „serviciul principal" e al
    treilea.** Documentul clientei numește Executive Performance Program™
    „serviciul principal al ecosistemului CHIRA Model™". Ordinea din pagină este
    însă a angajamentului crescător — 3 ore, 8 săptămâni, 6 luni — iar în designul
    aprobat cardul evidențiat este **poziția din mijloc**, nu un premiu acordat unui
    produs. Evidențiat rămâne deci CLAR™. Dacă clienta vrea altfel, se mută bifa
    „Card evidențiat" în admin, fără cod — dar atunci designul are două carduri de
    aceeași greutate lângă unul evidențiat, la marginea grilei.

25. **Navigația are submeniuri, deși designul aprobat are o bară plată**
    (8 septembrie 2026, `src/components/layout/NavDropdown.tsx`). Cerută explicit de
    clientă: programele sub „Servicii", workshopurile sub „Workshopuri", fiecare
    workshop ducând în dreptul cardului lui.

    Nu contrazice designul, îl extinde — la momentul aprobării nu exista nici
    catalogul de paisprezece workshopuri, nici cele trei programe cu nume. Bara
    însăși nu se schimbă cu un pixel: submeniul e `position: absolute`, sub bară,
    ascuns din `opacity`, deci intrările din meniu rămân exact unde erau. Verificat
    prin diff — zero cuvinte mutate pe homepage, vezi §6.

    Ce NU s-a schimbat, și nu se schimbă nici la o cerere de „mai mult": zero
    JavaScript (`:hover` + `:focus-within` pe desktop, `<details>` nativ pe telefon),
    componentele de client rămân patru, iar linkurile submeniului sunt în HTML-ul
    livrat, nu injectate după hidratare.

26. **Paginile de program au trei butoane de cumpărare, cu texte proprii**
    (8 septembrie 2026). Documentele clientei cer explicit CTA în trei poziții —
    hero, investiție, final — și își numesc singure butoanele: „Aplică pentru
    programul CLAR™", „Programează conversația de potrivire", „Rezervă-ți locul".

    Pe o pagină de 8–10 secțiuni, un singur buton sus se pierde; iar un buton generic
    („Cumpără") pierde exact informația pentru care documentul l-a formulat: ce
    urmează după apăsare. Textele stau deci în conținut, lângă program (`PackageCta`),
    nu în componentă. Prețul rămâne același în toate trei și se citește pe server.

27. **`revalidate = 3600` pe layout-ul site-ului**
    (`src/app/(frontend)/layout.tsx`). E o consecință, nu o preferință: de când
    antetul poartă submeniul de workshopuri, fiecare pagină conține o listă a cărei
    ordine se calculează din ziua curentă. Paginile fără `revalidate` propriu — prima
    pagină, `/despre`, cele patru pagini legale — se prerandau o singură dată, la
    build, deci ar fi păstrat ordinea de atunci până la următorul deploy. Este exact
    capcana din §10: o ieșire care depinde de `new Date()` nu are voie să fie statică
    pentru totdeauna. Paginile care declară altceva își păstrează valoarea proprie,
    inclusiv `force-static` de pe `opengraph-image.tsx`.

28. **Un set propriu de pictograme, desenat de mână** (`src/components/ui/Glyph.tsx`,
    8 septembrie 2026). Clienta a cerut pictograme. Regula 4 din §2 interzice
    bibliotecile de componente, dar motivul real e de design și e mai important
    decât regula: seturile obișnuite sunt trasate la 1.5–2px, cu colțuri
    rotunjite și cu un vocabular de aplicație. Peste Cormorant Garamond și peste
    hairline-urile de 1px ale designului aprobat ar arăta ca un panou de
    administrare lipit peste o pagină editorială.

    Cele douăsprezece semne de aici sunt desenate în limbajul paginii: linie de
    1px, în accent, fără umplere, pe o casetă de 24 de unități. Un semn per tip
    de bloc, nu unul per rând — un semn repetat pe fiecare element al unei liste
    devine marcator de listă, și pentru asta există `<ul>`. Toate `aria-hidden`.

29. **Un desen de antet pentru fiecare program** (`src/components/ui/ProgramMotif.tsx`,
    8 septembrie 2026). Al patrulea strat vizual din afara designului aprobat,
    după aură, lumina paginii și câmpul heroului — dar spre deosebire de ele,
    acesta e **conținut**, nu atmosferă: fiecare desen este structura
    programului, nu o metaforă lipită peste el. Cine se uită la el învață ceva
    adevărat despre ce cumpără. Descris integral în §4.

    Cerut de clientă („ceva sugestiv pentru fiecare serviciu"). Alternativa —
    aceeași fotografie pe toate trei paginile — ar fi spus că programele sunt
    același lucru.

30. **Paginile lungi se citesc pe benzi, nu pe o coloană** (`ui/PackageBody`,
    8 septembrie 2026). Cerut de clientă: „pare că sunt pagini din Word", cu
    teama explicită că vizitatorul vede prea mult text. Descris integral în §4.

    Ce NU s-a schimbat, și nu se schimbă nici la o cerere de „și mai vizual":
    niciun cuvânt din textul clientei; zero componente de client noi (semnele și
    desenele sunt SVG randat pe server); zero bibliotecă de iconuri sau de
    componente; un singur bloc `ink` pe pagină; și `--ac-ink-50` nu se mai
    folosește pe suprafețe crem, unde pică AA.

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
31. **Două programe fără preț afișat** (25 septembrie 2026, cerut de clientă).
    Designul aprobat are un preț pe fiecare card. CLAR™ și EPP îl înlocuiesc cu
    „Solicită ofertă"; se comută din admin, bifa „Preț la cerere". Descris în §4.

32. **Portretul din `/despre` a urcat în antet** (cerut de clientă). Pagina nu
    e în designul aprobat; forma urmează acum celelalte pagini interioare.

33. **Heroul homepage-ului se strânge pe ecranele scunde** (`short:`, laptopuri
    de 14"). Peste 860px înălțime clasele nu se aplică, deci comparația la
    pixel de la 1440 × 900 rămâne valabilă. Sub prag, heroul e mai compact decât
    designul — cerut explicit: pe 14" butoanele erau sub primul ecran.

34. **`MobileNav` ascultă click-urile din submeniul de desktop**. Nu e o a
    cincea componentă de client: e un ascultător delegat în componenta de
    client care exista deja în antet. Motivul e în §10 — închiderea după
    alegere nu se poate exprima în CSS.

35. **Pe telefon, desenul programului dispare** (sub 640px). La 340px
    etichetele lui ar avea ~7px; rămânea un gol de 300px între buton și
    conținut. Ce spune el spun deja faptele din antet și benzile.

| Animația scroll-driven nu pornește deloc: timeline atașat, dar `currentTime` e `null`, iar elementul stă în starea de bază | Scurtătura `animation:` **resetează** `animation-timeline` și `animation-range` la valorile inițiale. Scrise înaintea ei, sunt șterse în tăcere | Declară `animation-timeline` și `animation-range` **după** scurtătură. Verifică cu `el.getAnimations()[0].currentTime`: `null` = timeline inactiv sau resetat, un procent = funcționează |
| Două animații pe același element se anulează una pe alta | Amândouă scriu `transform`; ultima din listă câștigă | `translate`, `scale` și `rotate` sunt proprietăți independente. Pune traseul pe `translate` și respirația pe `scale` — se compun singure, fără `<div>`-uri de ambalaj (vezi `PageLight`) |
| Un strat decorativ pus peste conținut înceață textul de dedesubt | `backdrop-filter` e singurul lucru care face un strat să pară corp fizic, dar tot el face ilizibil ce acoperă. Gutterul paginii (24–88px) e mai îngust decât orice obiect care merită văzut (84–132px), deci „îl pun în margine" nu e o soluție | Lasă-l să iasă din cadru și interzice-i deriva spre coloana de text (toate valorile de `translate` orizontal ≤ 0). Verifică, nu presupune: compară `getBoundingClientRect().right` al obiectului cu `x + paddingLeft` al lui `.ac-shell` |
| `pnpm migrate` atârnă fără niciun mesaj, la fel ca `pnpm seed` | Aceeași cauză ca la seed: comanda inițializează Payload cu `push` activ (în dev), iar drizzle pune o întrebare interactivă. Peste ea, `payload migrate` mai are UN prompt propriu: „ai rulat în dev mode, se poate pierde date, continui?" | `NODE_ENV=production pnpm migrate` dezactivează `push`. Pentru al doilea prompt: `printf 'y\n' \| NODE_ENV=production pnpm exec payload migrate`. **Înainte, verifică `up()` migrației**: dacă are `DROP`/`DELETE`/`TRUNCATE`, nu răspunde „da" fără backup. `--force-accept-warning` NU funcționează pe versiunea din proiect |
| Verificare care codifică starea de moment, nu regula | `verify-faza2.ts` cerea „publicul vede 0 pachete" — adevărat doar cât timp toate erau ascunse. Când pachetele au devenit vizibile, verificarea a picat pentru un motiv bun, ceea ce e chiar semnul că verifica altceva | Scrie regula: publicul vede EXACT documentele cu `active: true`, niciunul în plus. Se aplică identic la `packages`, `workshops` și `testimonials`, deci se verifică în buclă pe toate trei |
| Referință `@id` care atârnă în datele structurate | `Event.organizer`, `Service.provider` și `Review.itemReviewed` trimit la `#serviciu`, dar nodul `ProfessionalService` se emitea doar pe homepage. Marcajul e valid sintactic, deci niciun validator nu se plânge — referința pur și simplu nu se rezolvă | `professionalServiceSchema(settings)` se emite pe fiecare pagină care îl referă. Regula: **graful unei pagini trebuie să se rezolve singur**, fără să depindă de ce a mai crawlat motorul |
| Un fișier care depinde de data curentă, prerandat cu `force-static` | `llms.txt` enumeră edițiile deschise la înscriere, iar fereastra se mută lunar. Prerandat o dată la build, ar fi continuat să spună asistenților AI că se pot cumpăra locuri la o ediție trecută — exact răspunsul greșit pe care AEO-ul trebuie să îl prevină | `export const revalidate = 3600`. Regulă generală: orice ieșire care depinde de `new Date()` nu are voie să fie `force-static` |
| Diacriticele devin mojibake după un `perl -i` (`și` → `Èi`, `î` → `Ã®`) | `perl -CSD` decodează intrarea ca UTF-8, dar șirul de înlocuire din linia de comandă vine deja ca octeți UTF-8 — rezultatul se codează a doua oară. Fișierul rămâne valid, deci nimic nu semnalează eroarea, iar textul stricat ajunge în commit | Editează fișierele cu diacritice prin unealta de editare, nu prin `perl -i`/`sed`. Dacă tot folosești un filtru, pune textul de înlocuire într-un fișier separat și splice-uiește-l cu `awk`. Verifică după: `grep -c "Ã\|È" <fișier>` trebuie să dea zero |
| Un script de editare a tăiat jumătate din `STATUS.md`, fără nicio eroare | Fișierele `.md` din repo au terminatori **CRLF**. Un `s.indexOf('\n\n')` care caută o linie goală nu găsește nimic, întoarce `-1`, iar `s.slice(-1)` taie tot în afară de ultimul caracter. Scriptul rulează, tipărește „ok" și lasă fișierul trunchiat | Editează documentele cu unealta de editare, nu cu scripturi de tăiat șiruri. Dacă tot scrii un script, caută `\r?\n\r?\n` și **verifică rezultatul**: `wc -l` și `grep -n "^## "` înainte și după. Recuperare: `git checkout -- STATUS.md`, apoi refaci editările |
| Text secundar ilizibil pe suprafețe crem | `--ac-ink-50` dă 4.64:1 pe hârtie, dar **4.24:1 pe `--ac-cream-50`** — sub AA. Se vede greu, deci nimeni nu-l semnalează; e chiar cifra măsurată la câmpul heroului | Pe crem, textul secundar e `--ac-ink-70` (8.11:1). Regula e scrisă și în `CLAUDE.md`. Când muți un bloc de pe hârtie pe crem, reverifică fiecare `ink-50` din el |
| Un card colorat pus pe o secțiune de aceeași culoare | Cardurile de workshop deschise erau `bg-ac-cream-50` pe o secțiune `tone="cream"`, adică tot `cream-50`. Marcajul exista în cod și nu se vedea în pagină | Culoarea unui element se alege față de fundalul pe care ajunge, nu în abstract. Aici secțiunea a trecut pe hârtie. Și: un singur semnal nu ajunge — cardul deschis are fundal, margine în accent ȘI pastila scrisă în cuvinte |
| Comentariu care rupe compilarea într-un tag JSX | În lista de atribute, `{/* … */}` nu e valid — acolo se scriu comentarii JS simple, `/* … */`. Forma cu acolade merge doar între copii | `/* … */` între atribute, sau comentariul deasupra elementului |
| Măsurătorile din browser se blochează, `requestAnimationFrame` nu mai răspunde și tabul pare că nu mai pictează | Tabul nu mai e în prim-plan: Chrome nu mai produce cadre, deci orice `await requestAnimationFrame(...)` atârnă până la timeout, iar capturile ies goale. **Nu e o regresie a paginii** | Măsoară sincron (`getComputedStyle` forțează recalculul) sau reîncarcă tabul. Înainte să dai vina pe cod, verifică dacă un element din pagină chiar are dimensiuni: `document.querySelector('h1').getBoundingClientRect()` |
| Rută prerandată care dă 404 imediat ce baza de date tace | `getPackageBySlug` începea cu `if (!payload) return null`, deși `getPackages` — pe care oricum îl chema imediat după — știe să cadă pe textul aprobat. `generateStaticParams` producea deci cele trei rute din `src/content/packages.ts`, iar pagina le refuza pe toate. Cu Postgres pornit nu se vedea nimic | Ieșirea scurtă a fost scoasă. **Regula: verificarea „avem CMS?" se face o singură dată, în funcția care chiar citește din CMS.** Un resolver care doar filtrează rezultatul altuia nu are ce decide. Se prinde cu `DATABASE_URI="" pnpm build && pnpm start`, apoi `curl` pe rutele prerandate — nu doar pe `/` |
| Un submeniu CSS care merge cu mouse-ul și e inaccesibil de la tastatură | Panoul ascuns cu `display: none` sau `visibility: hidden`. Ambele scot linkurile din ordinea de tabulare, deci nimic din interior nu mai poate primi focus — și atunci `:focus-within`, care ar fi trebuit să îl deschidă, nu se declanșează niciodată | Ascunde-l din `opacity: 0` + `pointer-events: none`. Linkurile rămân focusabile, prima tastă Tab aprinde panoul, iar mouse-ul tot nu poate apăsa ce nu se vede. Vezi `NavDropdown.tsx` |
| Un submeniu care se închide când cobori mouse-ul spre el | Spațiul dintre intrarea din meniu și cartelă nu aparținea niciunui element hoverabil | Paddingul de sus stă pe **învelișul poziționat**, nu pe cartelă: spațiul devine parte din zona de hover |
| `transition-transform` nu animează nimic pe `translate-y-*` | În Tailwind v4 utilitarele `translate-*`, `scale-*` și `rotate-*` scriu proprietățile CSS independente (`translate`, `scale`, `rotate`), nu `transform`. Tranziția ascultă o proprietate care nu se schimbă | `transition-[translate]`, `transition-[scale]` etc. Aceeași cauză ca la capcana „două animații pe același element se anulează" |
| Cu `prefers-reduced-motion`, un element animat de la `opacity: 0` rămâne la intensitatea de vârf | Regula globală din `globals.css` oprește toate animațiile, deci elementul stă în starea finală pe toată pagina — nu dispare, ci devine permanent | Dă-i explicit o opacitate proprie în blocul `prefers-reduced-motion` (aura coboară la jumătate). Verifică fiecare decor animat din opacitate |

---

## 11. Structura repo-ului

```
adriana-chira-repo/
├─ design/
│  ├─ homepage-approved.html      ← NU se șterge, NU se modifică
│  └─ compare/                    ← harnessul de comparație vizuală (§6)
├─ docker-compose.yml             ← Postgres local
├─ public/images/                  ← fotografiile clientei, câte una pe pagină
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
│  │  │  ├─ workshopuri-performanta-umana/page.tsx   ← catalogul, o singură rută
│  │  │  ├─ testimoniale/page.tsx                    ← recomandările, integral
│  │  │  ├─ blog/{page,[slug],pagina/[numar],categorie/[slug]/…}
│  │  │  ├─ politica-de-confidentialitate/ · politica-de-cookies/
│  │  │  ├─ termeni-si-conditii/ · politica-de-retur/
│  │  │  ├─ not-found.tsx
│  │  │  ├─ [...notFound]/page.tsx
│  │  │  ├─ sitemap.ts
│  │  │  ├─ llms.txt/route.ts
| Submeniul rămâne deschis peste pagina nouă după click | Două cauze. (1) `:focus-within`: linkul apăsat rămâne focusat, iar antetul nu se remontează la navigare. (2) Mouse-ul e încă deasupra panoului, deci `:hover` e adevărat | (1) `group-has-[:focus-visible]` în loc de `group-focus-within` — se aprinde doar la tastatură. (2) Ascultătorul din `MobileNav` pune `data-dismissed` pe grup la click și îl scoate la `pointerleave` sau la prima tastă. **Nu reveni la `:focus-within`** |
| Migrația cade cu „column already exists" pe baza locală | `pnpm dev` rulează Payload cu `push`, care adaugă singur coloana nouă de îndată ce schimbi colecția. Pe producție `push` e oprit, deci acolo migrația e singura cale | Local: `ALTER TABLE … DROP COLUMN …` și rulezi migrația din nou, ca să o verifici exact ca pe producție. Nu scrie `IF NOT EXISTS` în migrație ca să „treacă" |
| O sumă care nu mai are voie să apară rămâne în pagină | Prețul nu stă doar în câmpul `price`: apare și în texte scrise de mână (FAQ, note de investiție, `llms.txt`) | `grep` pe sume în HTML **și** în payload-ul RSC (nu doar în textul vizibil), pe toate paginile care randează pachetul |
│  │  │  └─ opengraph-image.tsx
│  │  ├─ api/contact/route.ts      ← formularul
│  │  ├─ api/stripe/checkout/      ← pornirea plății (form POST → 303 spre Stripe)
│  │  ├─ api/stripe/webhook/       ← singurul loc care scrie o comandă
│  │  └─ (payload)/                ← generat de Payload, nu se editează manual
│  │     ├─ layout.tsx             ← layout rădăcină al panoului
│  │     ├─ admin/[[...segments]]/ + importMap.js · importMap.d.ts
│  │     └─ api/{[...slug],graphql,graphql-playground}/
│  ├─ access/                      ← regulile de acces, într-un singur loc
│  ├─ collections/                 Posts · Categories · Packages · Workshops
│  │                               Testimonials · Faqs · Media · Orders
│  │                               Submissions · Users
│  ├─ globals/                     SiteSettings · HomePage · AboutPage
│  ├─ fields/                      slug.ts · seo.ts · section.ts
│  ├─ hooks/                       revalidate.ts · stripeSync.ts
│  ├─ migrations/                  ← schema pentru producție
│  ├─ seed/index.ts                ← pnpm seed
│  ├─ components/{layout,sections,ui,consent,contact,seo}/
│  │                               ui/Glyph.tsx        ← semnele, desenate
│  │                               ui/ProgramMotif.tsx ← antetul fiecărui program
│  │                               ui/PackageBody.tsx  ← benzile paginilor lungi
│  │                               layout/NavDropdown.tsx ← submeniul din antet
│  ├─ content/                     types.ts · site.ts · home.ts · pages.ts
│  │                               packages.ts · workshops.ts · testimonials.ts
│  │                               ← fallback ȘI sursa seed-ului
│  ├─ lib/                         content.ts · payload.ts · stripe.ts · lexical.ts
│  │                               checkout.ts · workshops.ts · nav.ts
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
│  │                               ui/BackToTop.tsx    ← „Înapoi sus", zero JS

*Website Factory · Pixel Factory SRL · Timișoara*
