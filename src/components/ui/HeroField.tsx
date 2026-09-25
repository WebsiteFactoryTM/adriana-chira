/**
 * Câmpul heroului — Server Component, zero JavaScript trimis la client.
 *
 * CE ESTE. Fundalul primului ecran: o coală de fildeș pe care fotografia stă
 * ca într-o pagină de revistă. Trei straturi, în ordinea în care se pictează:
 *
 *  1. FONDUL (`data-hero-wash`) — spălarea caldă de fildeș. Cea mai densă în
 *     stânga, sub coloana de text, și se stinge înainte de fotografie. Ea dă
 *     caracterul crem al ecranului.
 *  2. LUMINA (`data-hero-halo`) — un singur corp de lumină difuză, centrat în
 *     spatele portretului. Ridică luminanța hârtiei acolo unde stă fotografia,
 *     ca aceasta să pară că iese din pagină, nu că e lipită pe ea.
 *  3. CURBA (`data-hero-curve`) — un singur SVG: o linie organică care coboară
 *     între coloana de text și fotografie, cu suprafața din dreapta ei umplută
 *     cu lumină și cu muchia trasată de un fir de aur. Ea e tranziția.
 *
 * Plus granulația statică (`[data-hero-field]::after`, ~5%), care rupe
 * banding-ul și dă textură de hârtie.
 *
 * DE CE S-A SCHIMBAT REȚETA (a doua oară). Varianta anterioară avea trei
 * corpuri de lumină care derivau, trei voaluri conice care se roteau și două
 * inele de aur — o compoziție construită ca să fie observată. Clienta a cerut
 * altceva, pe baza unei fotografii de referință: fundal ivory/crem, foarte
 * minimalist, fără forme circulare, cu o tranziție organică între zona de text
 * și fotografie și cu accente de auriu foarte discrete. Cercurile și voalurile
 * au fost eliminate complet. Ce a rămas e o singură formă — curba — și o
 * singură lumină.
 *
 * CE NU S-A SCHIMBAT, ȘI NU SE SCHIMBĂ:
 *  - Contrastul. Singurul strat care ÎNTUNECĂ hârtia e fondul, iar el poartă
 *    masca de contrast: se stinge complet înainte de banda de etichete de sub
 *    butoane și de legenda portretului — singurele texte din pagină fără marjă
 *    peste AA (`--ac-ink-50` la 11px, 4.64:1, adică 0.14 peste prag). Lumina și
 *    umplutura curbei doar RIDICĂ luminanța, deci nu au nevoie de mască. Firul
 *    de aur se stinge singur, din gradientul lui, înainte de aceleași etichete.
 *  - Zero JS, zero bibliotecă de animație, `filter: blur()` nicăieri.
 *  - `position: absolute`, `z-index: -1`, în afara fluxului: nu mută niciun nod
 *    de text, deci comparația la pixel cu designul aprobat rămâne bună.
 *  - Se stinge dintr-un singur loc: `--ac-hero-field-gain: 0`.
 *
 * NOTĂ DESIGN: strat care nu vine din `design/homepage-approved.html`.
 * Vezi blocul „CÂMPUL HEROULUI" din `globals.css` pentru rețetele de culoare.
 */

/* -------------------------------------------------------------------------
   CURBA — singura formă din compoziție
   -------------------------------------------------------------------------

   Geometria e scrisă într-un viewBox de 1000×1000 întins peste toată caseta
   heroului (`preserveAspectRatio="none"`). Coordonatele se citesc deci direct
   ca procente: `474` pe orizontală înseamnă 47.4% din lățimea heroului.

   CURBA TAIE FOTOGRAFIA, NU TRECE PE LÂNGĂ EA. Asta e diferența față de prima
   variantă și singurul motiv pentru care geometria stă scrisă ca DATE, nu ca
   șir de caractere. Pe desktop portretul e o placă lipită de marginea dreaptă a
   ecranului (vezi `Hero.tsx`), iar latura lui stângă e tăiată chiar de curba de
   aici. Ca cele două să coincidă la ORICE lățime, trebuie să trăiască în
   același sistem de coordonate — de aceea placa are lățime fixată în procente
   (`PLATE_LEFT`), iar masca ei se calculează din aceleași puncte, printr-o
   simplă schimbare de scară. Dacă ar fi două șiruri scrise de mână, s-ar
   alinia la 1440px și s-ar desincroniza la 1200px.

   DE CE ACOLO ȘI NU ALTUNDEVA. Coloana de text se termină la ~47% din lățimea
   heroului, la orice desktop (măsurat: 47.0% la 1000px, 47.0% la 1440px —
   grila are două coloane egale). Umflătura curbei coboară până la 51.2%, deci
   rămâne o bandă de 4 puncte procentuale între ultimul rând de text și muchia
   fotografiei: 38px la 1000px lățime, 60px la 1440px. Sub atât, textul ar
   atinge fotografia. Dacă cineva lărgește coloana de text, aici se măsoară
   din nou.

   Umplutura și firul sunt căi SEPARATE, deși desenează aceeași linie, și nu se
   pot uni: umplutura e o cale ÎNCHISĂ (are nevoie de laturile casetei ca să
   aibă ce umple), iar firul e o cale DESCHISĂ — dacă ar fi închisă, s-ar trasa
   și pe latura dreaptă și pe cea de jos, adică pe muchiile ecranului.
   ------------------------------------------------------------------------- */

/**
 * Curba mare, ca date: punctul de plecare și două segmente cubice, în
 * coordonate absolute de viewBox. Din ele se scriu toate variantele — firul,
 * ecoul, umplutura și masca fotografiei — printr-o singură funcție.
 */
type Curve = { start: [number, number]; segments: [number, number, number, number, number, number][] }

const CURVE_LG: Curve = {
  start: [640, 0],
  segments: [
    [588, 175, 532, 335, 512, 505],
    [492, 678, 546, 848, 690, 1000],
  ],
}

/**
 * Cât de departe stă muchia fotografiei față de firul de aur, în unități de
 * viewBox (8 = 0.8% din lățime, adică ~11px la 1440px).
 *
 * Nu zero, și motivul e practic: firul are 1.1px: dacă fotografia s-ar opri
 * exact pe el, i-ar acoperi jumătate, iar ce rămâne vizibil ar fi un fir de
 * o jumătate de pixel — care sfârâie la scalare și dispare pe unele ecrane.
 * Cu decalajul, firul rămâne întreg pe fildeș, iar între el și fotografie
 * rămâne o dungă subțire de lumină. E și ce se vede în fotografia de referință.
 */
const PLATE_GAP = 8

/**
 * Marginea stângă a plăcii cu portretul, în procente din lățimea heroului.
 * FIXĂ, nu `clamp()`: pe ea se sprijină schimbarea de scară care traduce curba
 * din coordonate de hero în coordonate de placă. Un `clamp()` aici ar rupe
 * potrivirea la orice lățime în afara punctului în care a fost calibrat.
 *
 * 48% lasă 3.2 puncte procentuale între ea și cel mai adânc punct al tăieturii
 * (51.2%), deci masca nu ajunge niciodată la muchia plăcii — dacă ar ajunge,
 * fotografia s-ar termina drept, nu curbat.
 */
export const PLATE_LEFT = 48

function toPath({ start, segments }: Curve, mapX: (x: number) => number = (x) => x): string {
  const head = `M${round(mapX(start[0]))} ${start[1]}`
  const body = segments
    .map((s) => `C${round(mapX(s[0]))} ${s[1]} ${round(mapX(s[2]))} ${s[3]} ${round(mapX(s[4]))} ${s[5]}`)
    .join('')
  return head + body
}

/** Două zecimale: sub atât se văd trepte pe curbă la ecrane late. */
const round = (n: number) => Math.round(n * 100) / 100

/** Aceeași curbă, mutată pe orizontală. Ecoul și tăietura de aici vin. */
const shift = (curve: Curve, dx: number): Curve => ({
  start: [curve.start[0] + dx, curve.start[1]],
  segments: curve.segments.map((s) => [s[0] + dx, s[1], s[2] + dx, s[3], s[4] + dx, s[5]]),
})

/** Firul de aur. */
const PATH_LG = toPath(CURVE_LG)
/** Ecoul: aceeași curbă, mutată cu 2.6% la stânga, mult mai palidă. */
const PATH_LG_ECHO = toPath(shift(CURVE_LG, -26))
/** Umplutura: aceeași linie, închisă peste colțul din dreapta al casetei. */
const PATH_LG_FILL = `${PATH_LG}H1000V0Z`

/**
 * Masca plăcii cu portretul: aceeași curbă, decalată cu `PLATE_GAP` și adusă în
 * coordonatele plăcii. Placa merge de la `PLATE_LEFT`% la 100% din lățimea
 * heroului, iar viewBox-ul ei e tot 1000 lat — deci scara e `1000 / (100 −
 * PLATE_LEFT)` procente, adică factorul de mai jos. Zona PĂSTRATĂ e cea din
 * dreapta curbei; restul devine transparent, adică fildeș.
 */
const PLATE_SCALE = 1000 / (1000 - PLATE_LEFT * 10)
const PLATE_PATH = `${toPath(shift(CURVE_LG, PLATE_GAP), (x) => (x - PLATE_LEFT * 10) * PLATE_SCALE)}H1000V0Z`

/**
 * Masca, ca `mask-image`, nu ca referință la un `<mask>` din SVG-ul de fundal.
 * Referințele de tip `url(#id)` către o mască SVG nu sunt susținute uniform pe
 * elemente HTML, iar decorul nu are voie să depindă de noroc: un SVG inline,
 * codat ca data URI, se comportă identic peste tot. Alb = păstrează,
 * transparent = șterge.
 *
 * Se consumă din `Hero.tsx`, ca variabilă CSS pe placă.
 */
const maskUrl = (d: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none"><path d="${d}" fill="#fff"/></svg>`,
  )}")`

export const PLATE_MASK = maskUrl(PLATE_PATH)

/**
 * Sub 1000px grila trece pe o coloană și portretul ajunge sub text. Ideea
 * rămâne aceeași — fotografia e tăiată de o linie organică, nu așezată ca
 * dreptunghi — dar se rotește cu 90°: unda taie MUCHIA DE SUS a fotografiei.
 *
 * DE CE E ÎN CASETA FOTOGRAFIEI, ȘI NU ÎN FUNDAL. Prima variantă desena unda
 * în fundalul heroului, la o înălțime calculată din măsurătoarea de la 390px
 * (banda de etichete 53.8%–60.6%, fotografia de la 63.3%). Măsurătoarea aceea
 * e adevărată doar la lățimea la care a fost făcută: la 999px coloana de text
 * are 899px, se rup mult mai puține rânduri, heroul se scurtează, iar unda ar
 * fi căzut prin MIJLOCUL fotografiei. O linie legată de înălțimea heroului e
 * legată, de fapt, de câte rânduri are textul.
 *
 * Legată de caseta fotografiei, se așază singură pe muchia ei, la orice
 * lățime și la orice conținut. Aceeași lecție ca la placa de pe desktop:
 * tăietura și lucrul tăiat trebuie să stea în același sistem de coordonate.
 *
 * Adâncimea maximă e 6.4% din înălțimea casetei (~29px la 390px): fotografia
 * e 2:3 într-o cutie 3:4, decupată deja la 60% pe verticală, deci spațiul de
 * deasupra capului e limitat. Peste ~8% s-ar atinge părul.
 *
 * PE TELEFON NU EXISTĂ FIR DE AUR, și e o decizie, nu o scăpare. Un fir care
 * traversează toată lățimea unui ecran de telefon nu mai e accent discret, e
 * dungă; iar sub el, la ~40px, stau etichetele de 11px care au 0.14 marjă
 * peste AA. Muchia tăiată se vede și fără linie. Pe desktop firul are unde să
 * stea, și acolo rămâne.
 */
const PLATE_PATH_SM = 'M0 64C170 20 330 58 500 36s340-30 500-22V1000H0Z'

/** Se consumă tot din `Hero.tsx`; comută din media query, nu din JS. */
export const PLATE_MASK_SM = maskUrl(PLATE_PATH_SM)

/**
 * Stopurile gradienților. `stop-color` vine din CSS (`globals.css`), ca toate
 * culorile să rămână în fișierul de tokeni; aici stau doar opacitățile.
 *
 * Firul de aur se stinge la ambele capete, și asta nu e ornament: în partea de
 * jos a heroului stau etichetele de 11px și legenda portretului. Firul ajunge
 * la zero la 86% din înălțime, adică deasupra lor. În partea de sus se stinge
 * ca să nu pară o linie tăiată de antet.
 */
type Stop = [offset: string, opacity: number]

const FILL_LG: Stop[] = [
  ['0%', 0.42],
  ['26%', 0.6],
  ['58%', 0.78],
  ['82%', 0.85],
  ['100%', 0.66],
]

const LINE_LG: Stop[] = [
  ['0%', 0],
  ['10%', 0.22],
  ['34%', 0.62],
  ['56%', 0.5],
  ['74%', 0.2],
  ['86%', 0],
]

const ECHO_LG: Stop[] = [
  ['0%', 0],
  ['16%', 0.1],
  ['42%', 0.24],
  ['66%', 0.14],
  ['82%', 0],
]

/** Axele gradienților, în coordonate de viewBox (`userSpaceOnUse`). */
type Axis = { x1: number; y1: number; x2: number; y2: number }

/** Umplutura urcă în diagonală: mai palidă lângă curbă, plină la dreapta. */
const AXIS_FILL_LG: Axis = { x1: 490, y1: 60, x2: 1000, y2: 430 }
/** Firul se stinge pe verticală, la ambele capete. */
const AXIS_LINE_LG: Axis = { x1: 0, y1: 0, x2: 0, y2: 1000 }

function Gradient({ id, axis, stops, kind }: { id: string; axis: Axis; stops: Stop[]; kind: 'fill' | 'line' }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" {...axis}>
      {stops.map(([offset, opacity]) => (
        <stop key={offset} offset={offset} data-hero-stop={kind} stopOpacity={opacity} />
      ))}
    </linearGradient>
  )
}

/**
 * Stingerea de jos a umpluturii, pe desktop.
 *
 * Fără ea, forma se termină prost. Firul de aur se stinge la 86% din înălțime,
 * ca să nu ajungă peste banda de etichete — dar umplutura mergea până jos, deci
 * în ultima cincime rămânea o muchie tonală fără linie pe ea, adică o tăietură.
 * Aici umplutura coboară odată cu firul: forma se termină ca lumină, nu ca
 * margine. Pe telefon nu e nevoie — acolo fotografia ocupă ultima treime, deci
 * lumina trebuie să rămână exact unde umplutura s-ar stinge.
 *
 * Albul e valoare de mască, nu culoare de design: `#fff` = păstrează,
 * transparent = șterge, exact ca `#000` din `mask-image`-urile din `globals.css`.
 */
const FADE_LG: Stop[] = [
  ['0%', 1],
  ['52%', 1],
  ['76%', 0.45],
  ['96%', 0],
]

export function HeroField() {
  return (
    <div data-hero-field aria-hidden="true">
      <span data-hero-wash />
      <span data-hero-halo />

      {/* Curba din fundal e doar de desktop: sub 1000px portretul ajunge sub
          text, iar tăietura lui se mută pe muchia fotografiei (vezi
          `PLATE_PATH_SM`). Media query-ul o scoate din `display`, nu JS-ul:
          decorul nu are voie să depindă de JavaScript. */}
      <svg data-hero-curve viewBox="0 0 1000 1000" preserveAspectRatio="none" focusable="false">
        <defs>
          <Gradient id="acHeroFillLg" axis={AXIS_FILL_LG} stops={FILL_LG} kind="fill" />
          <Gradient id="acHeroLineLg" axis={AXIS_LINE_LG} stops={LINE_LG} kind="line" />
          <Gradient id="acHeroEchoLg" axis={AXIS_LINE_LG} stops={ECHO_LG} kind="line" />

          <linearGradient id="acHeroFadeLg" gradientUnits="userSpaceOnUse" {...AXIS_LINE_LG}>
            {FADE_LG.map(([offset, opacity]) => (
              <stop key={offset} offset={offset} stopColor="#fff" stopOpacity={opacity} />
            ))}
          </linearGradient>
          <mask id="acHeroFillMaskLg" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
            <rect x="0" y="0" width="1000" height="1000" fill="url(#acHeroFadeLg)" />
          </mask>
        </defs>

        <path d={PATH_LG_FILL} fill="url(#acHeroFillLg)" mask="url(#acHeroFillMaskLg)" />
        <path d={PATH_LG_ECHO} fill="none" stroke="url(#acHeroEchoLg)" />
        <path d={PATH_LG} fill="none" stroke="url(#acHeroLineLg)" />
      </svg>
    </div>
  )
}
