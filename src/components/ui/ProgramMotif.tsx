/**
 * Motivul grafic din antetul fiecărui program. **Server Component, zero JS.**
 *
 * ## Ce problemă rezolvă
 *
 * Paginile de program n-au fotografie proprie și nu vor avea: ședința foto a
 * clientei a produs șase cadre, toate deja repartizate, iar același portret pus
 * pe toate trei paginile ar spune că sunt același lucru. Fără nimic în locul
 * lui, primul ecran al unei pagini de vânzare rămâne un titlu și un paragraf —
 * exact senzația de „document Word" pe care pagina asta trebuie să o piardă.
 *
 * ## De ce un desen, și nu o ilustrație cumpărată
 *
 * Pentru că fiecare motiv **este structura programului**, nu o metaforă lipită
 * peste el. Cine se uită la el învață ceva adevărat despre ce cumpără:
 *
 * | Program | Desenul | Ce spune |
 * |---|---|---|
 * | Strategic Performance Assessment™ | hartă radială, 6 axe | cele șase dimensiuni HPA, cu **exact** atâtea puncte pe fiecare axă câte atribute are dimensiunea: 3+4+4+4+3+2 = 20 |
 * | CLAR™ | traseu ascendent, 4 opriri | C → L → A → R, în ordine, pentru că ordinea e chiar metoda |
 * | Executive Performance Program™ | linie de timp | evaluarea inițială (nodul mare), 12 sesiuni, două evaluări intermediare, evaluarea finală |
 *
 * Numerele nu sunt decorative. Dacă cineva schimbă câte atribute are o
 * dimensiune, se schimbă și desenul — sunt aceleași date.
 *
 * ## Regulile de desen, aceleași ca la `HeroField`
 *
 * Linie de 1px, fără umpleri opace, aurul rămâne fir și nu devine suprafață.
 * Geometria se calculează din date, nu se scrie ca șiruri de coordonate: un
 * șir scris de mână se aliniază la lățimea la care a fost calibrat și se ratează
 * la oricare alta.
 *
 * `aria-hidden`: tot ce spune desenul e scris și în text, mai jos în pagină.
 * Un desen care ar avea nevoie de descriere proprie ar însemna că textul e
 * incomplet.
 */

import type { ReactNode } from 'react'

/** Caseta comună. Toate trei desenează în ea, deci antetul nu sare între pagini. */
const W = 400
const H = 340

type Props = {
  /** Slug-ul programului. Un slug necunoscut primește motivul neutru. */
  slug: string
  className?: string
}

export function ProgramMotif({ slug, className }: Props) {
  const draw = MOTIFS[slug] ?? neutralMotif

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      className={className}
    >
      {draw()}
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Unelte comune                                                               */
/* -------------------------------------------------------------------------- */

/** Punct pe cerc, cu unghiul în grade și 0° la ora 12. */
function polar(cx: number, cy: number, radius: number, degrees: number) {
  const rad = ((degrees - 90) * Math.PI) / 180
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
}

const LINE = 'var(--ac-line)'
const ACCENT = 'var(--ac-accent)'
const ACCENT_INK = 'var(--ac-accent-ink)'

/* -------------------------------------------------------------------------- */
/* I. Strategic Performance Assessment™ — harta celor șase dimensiuni          */
/* -------------------------------------------------------------------------- */

/**
 * Câte atribute are fiecare dimensiune, în ordinea din text.
 *
 * Direcție 3 · Execuție 4 · Reglare 4 · Adaptare 4 · Autonomie 3 · Expansiune 2.
 * Suma e 20, adică chiar HPA 20 — de aceea desenul nu poate să mintă.
 */
const HPA = [
  { label: '01', attributes: 3 },
  { label: '02', attributes: 4 },
  { label: '03', attributes: 4 },
  { label: '04', attributes: 4 },
  { label: '05', attributes: 3 },
  { label: '06', attributes: 2 },
] as const

function assessmentMotif() {
  const cx = W / 2
  const cy = H / 2
  const inner = 46
  const outer = 142
  const step = 360 / HPA.length

  // Profilul: raze diferite pe fiecare axă. Nu e un profil real al nimănui —
  // e chiar ideea evaluării, că forma nu e un cerc perfect.
  const profile = [0.82, 0.62, 0.9, 0.55, 0.74, 0.46]

  const profilePoints = profile
    .map((value, index) => {
      const point = polar(cx, cy, inner + (outer - inner) * value, index * step)
      return `${point.x.toFixed(1)},${point.y.toFixed(1)}`
    })
    .join(' ')

  return (
    <>
      {/* Inelele de referință. */}
      {[0.34, 0.62, 0.9, 1].map((ratio) => (
        <circle
          key={ratio}
          cx={cx}
          cy={cy}
          r={inner + (outer - inner) * ratio}
          stroke={LINE}
          strokeWidth="1"
        />
      ))}

      {HPA.map((dimension, index) => {
        const angle = index * step
        const start = polar(cx, cy, inner, angle)
        const end = polar(cx, cy, outer + 6, angle)
        const label = polar(cx, cy, outer + 26, angle)

        return (
          <g key={dimension.label}>
            {/* Axa dimensiunii. */}
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={LINE}
              strokeWidth="1"
            />

            {/* Câte un punct pentru fiecare atribut al dimensiunii. */}
            {Array.from({ length: dimension.attributes }, (_, position) => {
              const ratio = (position + 1) / (dimension.attributes + 1)
              const dot = polar(cx, cy, inner + (outer - inner) * ratio, angle)
              return (
                <circle
                  key={position}
                  cx={dot.x}
                  cy={dot.y}
                  r="2.4"
                  fill={ACCENT}
                  opacity="0.75"
                />
              )
            })}

            <text
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={ACCENT_INK}
              className="font-sans text-[10px] tracking-[0.18em]"
            >
              {dimension.label}
            </text>
          </g>
        )
      })}

      {/* Profilul, firul de aur care leagă cele șase. */}
      <polygon points={profilePoints} stroke={ACCENT} strokeWidth="1.1" />

      {/* Miezul: omul evaluat. */}
      <circle cx={cx} cy={cy} r="4" fill={ACCENT} />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* II. CLAR™ — traseul de la claritate la rezultate                            */
/* -------------------------------------------------------------------------- */

const CLAR_STEPS = ['C', 'L', 'A', 'R'] as const

function clarMotif() {
  // Traseul urcă de la stânga-jos la dreapta-sus. Cele patru opriri stau pe el,
  // la distanțe egale — opt săptămâni împărțite în patru etape.
  const left = 46
  const right = W - 46
  const bottom = H - 92
  const top = 96

  const points = CLAR_STEPS.map((letter, index) => {
    const ratio = index / (CLAR_STEPS.length - 1)
    return {
      letter,
      x: left + (right - left) * ratio,
      // Urcuș cu pantă descrescătoare: primul pas mută cel mai mult, ca în
      // program — claritatea schimbă cel mai mult, consolidarea cel mai puțin.
      y: bottom - (bottom - top) * Math.pow(ratio, 0.72),
    }
  })

  const first = points[0]
  const last = points[points.length - 1]
  if (!first || !last) return null

  // O singură cale netedă prin cele patru puncte, cu tangente orizontale în
  // opriri: traseul „se așază" la fiecare etapă, nu trece în viteză prin ea.
  const path = points
    .slice(1)
    .reduce((accumulator, point, index) => {
      const previous = points[index]
      if (!previous) return accumulator
      const handle = (point.x - previous.x) * 0.42
      return `${accumulator} C ${previous.x + handle} ${previous.y}, ${point.x - handle} ${point.y}, ${point.x} ${point.y}`
    }, `M ${first.x} ${first.y}`)

  return (
    <>
      {/* Linia de bază: de unde pleci. */}
      <line x1={left - 16} y1={bottom} x2={right + 16} y2={bottom} stroke={LINE} strokeWidth="1" />

      {/* Linia de sosire: unde ajungi. */}
      <line
        x1={left - 16}
        y1={top}
        x2={right + 16}
        y2={top}
        stroke={LINE}
        strokeWidth="1"
        strokeDasharray="2 6"
      />

      <path d={path} stroke={ACCENT} strokeWidth="1.1" />

      {points.map((point) => (
        <g key={point.letter}>
          {/* Verticala până la linia de bază: cât s-a câștigat la etapa asta. */}
          <line
            x1={point.x}
            y1={point.y}
            x2={point.x}
            y2={bottom}
            stroke={LINE}
            strokeWidth="1"
          />
          <circle
            cx={point.x}
            cy={point.y}
            r="5.5"
            fill="var(--ac-paper)"
            stroke={ACCENT}
            strokeWidth="1.1"
          />
          <text
            x={point.x}
            y={bottom + 30}
            textAnchor="middle"
            fill={ACCENT_INK}
            className="font-display text-[26px]"
          >
            {point.letter}
          </text>
        </g>
      ))}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* III. Executive Performance Program™ — șase luni, pas cu pas                 */
/* -------------------------------------------------------------------------- */

function executiveMotif() {
  const left = 56
  const right = W - 40
  const axis = H / 2 + 8
  const sessions = 12

  // Evaluarea inițială stă înaintea primei sesiuni; evaluarea finală după
  // ultima. Cele două evaluări intermediare cad la o treime și la două treimi.
  const gap = (right - left) / (sessions + 1)
  const ticks = Array.from({ length: sessions }, (_, index) => left + gap * (index + 1))
  const midpoints = [ticks[3], ticks[7]].filter((value): value is number => value !== undefined)

  return (
    <>
      {/* Axa celor șase luni. */}
      <line x1={left} y1={axis} x2={right} y2={axis} stroke={LINE} strokeWidth="1" />

      {/* Cele șase luni, ca repere sub axă. */}
      {Array.from({ length: 6 }, (_, index) => {
        const x = left + ((right - left) / 6) * (index + 0.5)
        return (
          <text
            key={index}
            x={x}
            y={axis + 52}
            textAnchor="middle"
            fill={ACCENT_INK}
            className="font-sans text-[10px] tracking-[0.18em]"
            opacity="0.75"
          >
            {`L${index + 1}`}
          </text>
        )
      })}

      {/* Separatoarele de lună. */}
      {Array.from({ length: 5 }, (_, index) => {
        const x = left + ((right - left) / 6) * (index + 1)
        return (
          <line
            key={index}
            x1={x}
            y1={axis + 14}
            x2={x}
            y2={axis + 30}
            stroke={LINE}
            strokeWidth="1"
          />
        )
      })}

      {/* Cele douăsprezece sesiuni. */}
      {ticks.map((x, index) => (
        <line
          key={index}
          x1={x}
          y1={axis - 16}
          x2={x}
          y2={axis}
          stroke={ACCENT}
          strokeWidth="1.1"
          opacity="0.8"
        />
      ))}

      {/* Evaluările intermediare: reperele la care direcția se ajustează. */}
      {midpoints.map((x, index) => (
        <g key={index}>
          <line x1={x} y1={axis - 58} x2={x} y2={axis} stroke={LINE} strokeWidth="1" />
          <circle cx={x} cy={axis - 58} r="3.2" fill={ACCENT} opacity="0.85" />
        </g>
      ))}

      {/* Evaluarea inițială: nodul mare de la care pornește tot. */}
      <circle cx={left} cy={axis} r="13" stroke={ACCENT} strokeWidth="1.1" />
      <circle cx={left} cy={axis} r="4" fill={ACCENT} />

      {/* Evaluarea finală. */}
      <circle cx={right} cy={axis} r="7" stroke={ACCENT} strokeWidth="1.1" />

      {/* Arcul care leagă începutul de sfârșit: procesul, nu suma sesiunilor. */}
      <path
        d={`M ${left} ${axis - 13} C ${left + 90} ${axis - 118}, ${right - 90} ${axis - 118}, ${right} ${axis - 7}`}
        stroke={LINE}
        strokeWidth="1"
      />
    </>
  )
}

/* -------------------------------------------------------------------------- */

/** Un program creat în admin, fără motiv desenat: un arc simplu, nu un gol. */
function neutralMotif() {
  const cx = W / 2
  const cy = H / 2

  return (
    <>
      {[54, 96, 138].map((radius) => (
        <circle key={radius} cx={cx} cy={cy} r={radius} stroke={LINE} strokeWidth="1" />
      ))}
      <path
        d={`M ${cx - 138} ${cy} A 138 138 0 0 1 ${cx + 138} ${cy}`}
        stroke={ACCENT}
        strokeWidth="1.1"
      />
      <circle cx={cx} cy={cy} r="4" fill={ACCENT} />
    </>
  )
}

const MOTIFS: Record<string, () => ReactNode> = {
  'strategic-performance-assessment': assessmentMotif,
  'program-performanta-clar': clarMotif,
  'executive-performance-program': executiveMotif,
}
