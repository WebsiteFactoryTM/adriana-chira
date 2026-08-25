import type { CSSProperties } from 'react'

/**
 * Câmpul heroului — Server Component, zero JavaScript trimis la client.
 *
 * CE ESTE. Fundalul viu al primului ecran, în trei straturi care se mișcă
 * neîntrerupt, fiecare cu rolul lui:
 *
 *  1. CORPURILE DE LUMINĂ (`data-hero-mass`) — trei mase mari de lumină caldă
 *     care se plimbă lent prin hero. Ele dau temperatura: hârtia pare
 *     luminată dintr-o parte, nu tipărită plat.
 *  2. VOALURILE (`data-hero-veil`) — trei pânze de mătase, adică gradiente
 *     conice care se rotesc foarte încet. Rotația face ca lumina să alunece
 *     pe suprafață, nu doar să stea. Ele dau MIȘCAREA pe care o vezi.
 *  3. INELELE (`data-hero-ring`) — două cercuri de un fir de aur, cu o zonă
 *     mai luminoasă care călătorește pe circumferință. Ele dau STRUCTURA:
 *     ochiul are în sfârșit ceva de prins, iar asta e diferența dintre un
 *     fundal frumos și un fundal care atrage atenția.
 *
 * DE CE S-A SCHIMBAT REȚETA. Varianta anterioară era construită explicit ca
 * să NU fie observată — lumină difuză, fără muchie, fără nimic de urmărit.
 * Clienta a cerut altceva: un prim ecran care atrage privirea. Compoziția de
 * acum inversează premisa. Regula nouă nu mai e „nu te uita la mine", ci
 * „uită-te, dar la text ajungi tot în două secunde": mișcarea rămâne lentă
 * (nimic nu are destinație, nimic nu se repetă la vedere), dar are acum și
 * contur, nu doar temperatură.
 *
 * CE NU S-A SCHIMBAT, ȘI NU SE SCHIMBĂ:
 *  - Contrastul. Aurul rămâne plafonat pe suprafețele mari; inelele sunt
 *    hairline, deci nu mută luminanța fundalului sub text. Masca stinge tot
 *    stratul înainte de banda de etichete de sub butoane și de legenda
 *    portretului — singurele texte din pagină fără marjă peste AA
 *    (`--ac-ink-50` la 11px, 4.64:1, adică 0.14 peste prag).
 *  - Zero JS, zero bibliotecă de animație. Totul e CSS, iar toate animațiile
 *    sunt `rotate` / `scale` / `translate`, adică proprietăți compuse pe GPU:
 *    nu declanșează nicio repictare per cadru.
 *  - Durate prime, toate diferite. Ansamblul nu se repetă practic niciodată,
 *    deci ochiul nu prinde un puls — iar pulsul citește ca ceas.
 *  - `position: absolute`, `z-index: -1`, în afara fluxului: nu mută niciun
 *    nod de text, deci comparația la pixel cu designul aprobat rămâne bună.
 *  - Se stinge dintr-un singur loc: `--ac-hero-field-gain: 0`.
 *
 * NOTĂ DESIGN: strat care nu vine din `design/homepage-approved.html`.
 * Vezi blocul „CÂMPUL HEROULUI" din `globals.css` pentru rețetele de culoare.
 */

/* -------------------------------------------------------------------------
   1. CORPURILE DE LUMINĂ — temperatura
   ------------------------------------------------------------------------- */

type Mass = {
  /** Centrul, în procente din caseta heroului. */
  x: string
  y: string
  /** Multiplicator peste `--ac-hero-field-size`. */
  size?: number
  /** Opacitatea corpului. */
  peak?: number
  /** Greutatea inelului de aur, `1` = rețeta plină din CSS. */
  accent?: number
  /** Greutatea miezului de lumină. Ridică luminanța, deci n-are plafon. */
  core?: number
  /** Traseul: A, B sau C. Trei drumuri diferite, ca să nu pară că plutesc în bloc. */
  path: 'a' | 'b' | 'c'
  /** Durata derivei și a respirației. Numere prime, mereu. */
  drift: string
  swell: string
  /** Decalaje de fază. Negative = pornesc deja intrate în mișcare. */
  driftDelay?: string
  swellDelay?: string
  /** Poziția sub 768px, unde heroul trece pe o coloană. Implicit, cea de sus. */
  xSm?: string
  ySm?: string
  sizeSm?: number
}

/**
 * Trei corpuri, nu cinci: peste trei, lumina devine uniformă și mișcarea se
 * anulează singură. Toate stau în jumătatea de sus a heroului — acolo e
 * titlul, acolo se uită omul, și tot acolo hârtia n-are text fără marjă.
 */
const MASSES: Mass[] = [
  /* Deschiderea: urcă din spatele titlului, spre stânga. Cel mai luminos
     dintre cele trei, pentru că e singurul care traversează coloana de text —
     iar peste text vrem miez, adică plus de contrast, nu aur. */
  {
    x: '24%',
    y: '20%',
    size: 1.15,
    peak: 0.66,
    accent: 0.42,
    core: 1,
    path: 'a',
    drift: '71s',
    swell: '37s',
    driftDelay: '-11s',
    xSm: '30%',
    ySm: '14%',
    sizeSm: 1,
  },
  /* Corpul din dreapta: cel mai mare și cel mai cald. Stă în jurul
     portretului, unde nu există text mic, deci aurul are voie să conteze. */
  {
    x: '73%',
    y: '30%',
    size: 1.4,
    peak: 0.6,
    accent: 0.62,
    core: 0.9,
    path: 'b',
    drift: '89s',
    swell: '43s',
    driftDelay: '-29s',
    swellDelay: '-7s',
    xSm: '68%',
    ySm: '34%',
    sizeSm: 1.15,
  },
  /* Al treilea trece prin mijloc, între cele două coloane: e cel care face ca
     mișcarea să se vadă, pentru că traversează cel mai mult spațiu gol. */
  {
    x: '50%',
    y: '52%',
    size: 0.95,
    peak: 0.46,
    accent: 0.5,
    core: 1,
    path: 'c',
    drift: '101s',
    swell: '47s',
    driftDelay: '-41s',
    swellDelay: '-19s',
    xSm: '52%',
    ySm: '58%',
    sizeSm: 0.9,
  },
]

/* -------------------------------------------------------------------------
   2. VOALURILE — mișcarea
   ------------------------------------------------------------------------- */

type Veil = {
  x: string
  y: string
  /** Multiplicator peste `--ac-hero-veil-size`. */
  size?: number
  /** Opacitatea voalului. Stratul cel mai întins, deci cel mai plafonat. */
  peak?: number
  /** Unghiul de pornire al gradientului conic. Rupe simetria între voaluri. */
  from: string
  /** Durata unei rotații complete. Prime, diferite, în ambele sensuri. */
  spin: string
  /** `reverse` = se rotește invers. Două pânze care merg în același sens se
      citesc ca un singur obiect care se învârte. */
  reverse?: boolean
  /** Respirația: aceeași idee ca la corpuri, pe altă durată. */
  swell: string
  spinDelay?: string
  swellDelay?: string
  xSm?: string
  ySm?: string
  sizeSm?: number
  /** Sub 768px, al treilea voal iese: pe telefon trei pânze suprapuse dau noroi. */
  hideSm?: boolean
}

/**
 * De ce se rotesc, și nu derivă. Deriva mută lumina dintr-un loc în altul —
 * ochiul o pierde, pentru că nu are muchie de urmărit. Rotația unui gradient
 * conic mută MUCHIA dintre sectoare de-a lungul unei curbe: se vede că
 * suprafața e vie, fără ca ceva să plece efectiv de undeva. E cea mai ieftină
 * mișcare vizibilă care nu devine niciodată „obiect care traversează ecranul".
 */
const VEILS: Veil[] = [
  /* Pânza din stânga, în spatele titlului. Cea mai palidă: peste ea trece
     tot textul lung al heroului. */
  {
    x: '28%',
    y: '24%',
    size: 1.1,
    peak: 0.5,
    from: '18deg',
    spin: '149s',
    swell: '53s',
    spinDelay: '-37s',
    xSm: '35%',
    ySm: '13%',
    sizeSm: 0.86,
  },
  /* Pânza mare din dreapta, în jurul portretului. Aici e voie cu aur: sub ea
     nu stă niciun text mic, iar portretul o taie oricum pe jumătate. */
  {
    x: '71%',
    y: '36%',
    size: 1.45,
    peak: 0.62,
    from: '212deg',
    spin: '191s',
    reverse: true,
    swell: '67s',
    spinDelay: '-83s',
    swellDelay: '-23s',
    xSm: '62%',
    ySm: '34%',
    sizeSm: 0.88,
  },
  /* Pânza de legătură, jos între coloane. Rol de tranziție: fără ea, cele
     două de sus par două pete, nu o singură suprafață. */
  {
    x: '48%',
    y: '58%',
    size: 0.95,
    peak: 0.34,
    from: '96deg',
    spin: '233s',
    swell: '59s',
    spinDelay: '-19s',
    hideSm: true,
  },
]

/* -------------------------------------------------------------------------
   3. INELELE — structura, adică lucrul care atrage atenția
   ------------------------------------------------------------------------- */

type Ring = {
  x: string
  y: string
  /** Multiplicator peste `--ac-hero-ring-size`. */
  size?: number
  /** Opacitatea inelului. Grosimea rămâne fixă: un fir, la orice ecran. */
  peak?: number
  /** Unghiul de pornire al zonei luminoase. */
  from: string
  /**
   * Turtirea elipsei, pe verticală. 1 = cerc perfect — adică rotație
   * INVIZIBILĂ. Sub 1, forma se vede că se întoarce. Vezi comentariul de la
   * lista de mai jos.
   */
  flatten?: number
  /** O rotație completă a formei. Odată cu ea se plimbă și zona luminoasă. */
  spin: string
  reverse?: boolean
  spinDelay?: string
  /** Respirația razei. Foarte mică: 2–3%, cât să nu pară cerc desenat cu compasul. */
  swell: string
  swellDelay?: string
  xSm?: string
  ySm?: string
  sizeSm?: number
  hideSm?: boolean
}

/**
 * DOUĂ inele, nu patru. Un inel e un accident fericit; două se citesc ca
 * intenție; patru se citesc ca ornament, iar ornamentul îmbătrânește într-un an.
 *
 * DE CE SUNT ELIPSE, ȘI DE CE ASTA E ÎNTREGUL TRUC. Un cerc perfect care se
 * rotește nu arată absolut nimic: e simetric față de propria axă, deci după
 * rotație e identic cu el însuși. Prima variantă avea cercuri și rotația se
 * vedea doar ca o zonă mai luminoasă care aluneca — prea puțin. Turtite cu
 * 16–24%, formele se văd că se ÎNTORC: același drum, la nesfârșit, fără
 * început și fără capăt. Asta a fost cerută — continuitate, nu efect.
 *
 * Turtirea stă în nodul dinăuntru (`data-hero-ring-body`), iar rotația în
 * învelișul din afară. Ordinea nu e negociabilă: dacă ar fi invers, elipsa ar
 * rămâne fixă pe ecran și s-ar învârti doar desenul din interiorul ei.
 *
 * Cele două nu se rotesc la fel — 163s într-un sens, 211s în celălalt, cu
 * turtiri diferite. Două forme care se întorc identic se citesc ca un singur
 * obiect; două care se întorc diferit se citesc ca mișcare.
 *
 * Firul e hairline (`--ac-hero-ring-width`, 1.25px). De asta inelele n-au
 * plafon de contrast ca suprafețele mari: 1px de aur la 30% nu mută luminanța
 * medie a hârtiei de sub un rând de text.
 */
const RINGS: Ring[] = [
  /* Inelul mare, centrat pe portret: intră în spatele lui și reapare de
     cealaltă parte. Ăsta e cel pe care îl vede omul primul.
     Pe telefon se mută în centru, deasupra titlului, și se micșorează până
     încape ÎNTREG pe lățime — vezi nota de responsivitate de mai jos. */
  {
    x: '69%',
    y: '40%',
    size: 1,
    flatten: 0.84,
    peak: 0.62,
    from: '140deg',
    spin: '163s',
    swell: '71s',
    xSm: '50%',
    ySm: '15%',
    sizeSm: 0.92,
  },
  /* Inelul mic, în spatele primelor rânduri de titlu, rotit invers și turtit
     mai tare. Rol de contrapunct: dă adâncime, pentru că două forme care se
     întorc în sensuri diferite citesc ca planuri diferite. */
  {
    x: '23%',
    y: '26%',
    size: 0.6,
    flatten: 0.76,
    peak: 0.46,
    from: '310deg',
    spin: '211s',
    reverse: true,
    spinDelay: '-53s',
    swell: '83s',
    swellDelay: '-31s',
    xSm: '30%',
    ySm: '31%',
    sizeSm: 0.52,
  },
]

/**
 * RESPONSIVITATEA, pe scurt, pentru că e ușor de stricat la loc.
 *
 * Măsurat la 388px lățime: heroul are 1418px înălțime, iar caseta câmpului
 * 373px. Prima variantă punea acolo un voal de 617px — de 1.7 ori lățimea
 * ecranului. Un voal mai lat decât ecranul nu mai e formă, e spălare de
 * fundal: ochiul nu-i vede marginile, deci nu-i vede nici mișcarea. Inelul
 * mare ieșea cu 13px în afara casetei, adică era retezat exact de marginea
 * ecranului, ceea ce citește ca greșeală, nu ca intenție.
 *
 * Regula pe telefon: voalurile stau sub ~1 lățime de ecran, iar inelele încap
 * ÎNTREGI, cu marjă de fiecare parte. Pe desktop e invers — acolo inelele au
 * voie să fie tăiate de cadru sau să intre în spatele portretului, pentru că
 * un cerc întreg, complet vizibil, pe un ecran lat devine „logo pe fundal".
 */

/* ------------------------------------------------------------------------- */

function styleFor(mass: Mass): CSSProperties {
  const vars: Record<string, string> = {
    '--mx': mass.x,
    '--my': mass.y,
    '--mdur': mass.drift,
    '--msdur': mass.swell,
  }
  if (mass.size !== undefined) vars['--ms'] = String(mass.size)
  if (mass.peak !== undefined) vars['--mo'] = String(mass.peak)
  if (mass.accent !== undefined) vars['--ma'] = String(mass.accent)
  if (mass.core !== undefined) vars['--mk'] = String(mass.core)
  if (mass.driftDelay) vars['--mdelay'] = mass.driftDelay
  if (mass.swellDelay) vars['--msdelay'] = mass.swellDelay
  if (mass.xSm) vars['--mx-sm'] = mass.xSm
  if (mass.ySm) vars['--my-sm'] = mass.ySm
  if (mass.sizeSm !== undefined) vars['--ms-sm'] = String(mass.sizeSm)
  return vars as CSSProperties
}

function styleForVeil(veil: Veil): CSSProperties {
  const vars: Record<string, string> = {
    '--vx': veil.x,
    '--vy': veil.y,
    '--vfrom': veil.from,
    '--vdur': veil.spin,
    '--vsdur': veil.swell,
    '--vdir': veil.reverse ? 'reverse' : 'normal',
  }
  if (veil.size !== undefined) vars['--vs'] = String(veil.size)
  if (veil.peak !== undefined) vars['--vo'] = String(veil.peak)
  if (veil.spinDelay) vars['--vdelay'] = veil.spinDelay
  if (veil.swellDelay) vars['--vsdelay'] = veil.swellDelay
  if (veil.xSm) vars['--vx-sm'] = veil.xSm
  if (veil.ySm) vars['--vy-sm'] = veil.ySm
  if (veil.sizeSm !== undefined) vars['--vs-sm'] = String(veil.sizeSm)
  return vars as CSSProperties
}

function styleForRing(ring: Ring): CSSProperties {
  const vars: Record<string, string> = {
    '--rx': ring.x,
    '--ry': ring.y,
    '--rfrom': ring.from,
    '--rdur': ring.spin,
    '--rsdur': ring.swell,
    '--rdir': ring.reverse ? 'reverse' : 'normal',
  }
  if (ring.size !== undefined) vars['--rs'] = String(ring.size)
  if (ring.flatten !== undefined) vars['--rflat'] = String(ring.flatten)
  if (ring.peak !== undefined) vars['--ro'] = String(ring.peak)
  if (ring.spinDelay) vars['--rdelay'] = ring.spinDelay
  if (ring.swellDelay) vars['--rsdelay'] = ring.swellDelay
  if (ring.xSm) vars['--rx-sm'] = ring.xSm
  if (ring.ySm) vars['--ry-sm'] = ring.ySm
  if (ring.sizeSm !== undefined) vars['--rs-sm'] = String(ring.sizeSm)
  return vars as CSSProperties
}

export function HeroField() {
  return (
    <div data-hero-field aria-hidden="true">
      {/* Ordinea contează: temperatura dedesubt, mișcarea peste ea, firul de
          aur deasupra tuturor — altfel inelul se pierde în voal. */}
      {MASSES.map((mass) => (
        <span key={`m-${mass.path}`} data-hero-mass={mass.path} style={styleFor(mass)} />
      ))}

      {VEILS.map((veil) => (
        <span key={`v-${veil.x}-${veil.y}`} data-hero-veil={veil.hideSm ? 'sm-hidden' : ''} style={styleForVeil(veil)} />
      ))}

      {/* Inelul are două noduri, și motivul e tot ce ține de mișcare: învelișul
          se ROTEȘTE, corpul dinăuntru e TURTIT. Turtirea trebuie să stea sub
          rotație, nu invers — altfel elipsa ar rămâne fixă pe ecran și s-ar
          roti doar desenul din ea, ceea ce arată exact ca un cerc nemișcat. */}
      {RINGS.map((ring) => (
        <span
          key={`r-${ring.x}-${ring.y}`}
          data-hero-ring={ring.hideSm ? 'sm-hidden' : ''}
          style={styleForRing(ring)}
        >
          <span data-hero-ring-body />
        </span>
      ))}
    </div>
  )
}
