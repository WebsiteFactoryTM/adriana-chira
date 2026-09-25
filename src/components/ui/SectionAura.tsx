import type { CSSProperties } from 'react'

/**
 * Aura de secțiune — Server Component, zero JavaScript trimis la client.
 *
 * NOTĂ DESIGN: stratul acesta nu există în `design/homepage-approved.html`.
 * E singura adăugire vizuală peste designul aprobat și e proiectată ca să nu
 * atingă designul deloc: `position: absolute`, în afara fluxului, `z-index: -1`
 * sub o secțiune cu `isolation: isolate`. Nu mută niciun nod de text, deci
 * comparația la pixel din STATUS §6 rămâne valabilă. Se stinge complet dintr-un
 * singur loc: `--ac-aura-gain: 0` în `globals.css`.
 *
 * Rolul ei e de sistem de atenție, nu de decor: lumina se aprinde când
 * secțiunea ajunge în centrul ecranului și se stinge când o părăsești, deci
 * coboară odată cu cititorul. Toată mișcarea e CSS — `animation-timeline:
 * view()` pe browserele care o au, aură statică pe restul. Nu folosește
 * IntersectionObserver și nu depinde de JS: decorul nu are voie să depindă
 * de JS. Vezi blocul „AURĂ DE SECȚIUNE" din `globals.css`.
 *
 * Aura NU se pune pe toate secțiunile. Un semnal folosit peste tot nu mai e
 * semnal. Cele cinci variante de mai jos sunt punctele în care cititorul
 * trebuie să încetinească: deschiderea, metoda, citatul, oferta, invitația.
 */

type Field = {
  /** Centrul câmpului, în procente din secțiune. */
  x: string
  y: string
  /** Multiplicator peste `--ac-aura-size`. */
  size?: number
  /** Opacitatea de vârf a câmpului. */
  peak?: number
  /**
   * Greutatea haloului de accent, `1` = rețeta plină din `globals.css`.
   * Pe hârtie stă la ~0.45: aurul întunecă fundalul, iar `--ac-ink-50` la 11px
   * are doar 0.14 marjă peste AA. Pe blocul întunecat urcă la 1.
   */
  accent?: number
  /** Greutatea miezului de lumină. Ridică luminanța, deci nu are plafon de contrast. */
  core?: number
  /** Poziția sub 768px, unde grila trece pe o coloană. Implicit, cea de sus. */
  xSm?: string
  ySm?: string
  sizeSm?: number
  /** Decalaj de fază. Negativ = pornește deja intrat în derivă. */
  delay?: string
  duration?: string
  /** Culoarea miezului. Pe fundal întunecat, accentul citește ca lumânare. */
  coreColor?: string
}

type Variant = {
  /** `wake` = la încărcarea paginii (hero). `focus` = la trecerea prin ecran. */
  mode: 'wake' | 'focus'
  fields: Field[]
}

export type AuraVariant = 'hero' | 'metoda' | 'citat' | 'servicii' | 'cta'

const VARIANTS: Record<AuraVariant, Variant> = {
  /**
   * Hero. Se trezește la deschiderea paginii, cu ~260ms după primul rând de
   * titlu, deci lumina pare că aduce textul cu ea.
   *
   * Amândouă câmpurile stau în jumătatea de sus. Nu din compoziție, ci din
   * contrast: cele trei etichete de sub butoane și legenda de sub portret sunt
   * `--ac-ink-50` la 11px, singurul text din pagină fără marjă peste AA. Ținute
   * la peste ~70% din raza câmpului, primesc sub 1% accent, adică nimic
   * măsurabil. Lumina rămâne unde e titlul, adică unde trebuie să se uite omul.
   *
   * ACCENTUL E AICI MAI MIC DECÂT PE ORICE ALTĂ SECȚIUNE, și nu întâmplător.
   * Rețeta câmpului are un halou de aur între 50% și 82% din rază — pe fundal
   * încărcat trece neobservat, dar pe coala de fildeș a heroului refăcut
   * (vezi `HeroField`) ar reapărea exact ca inelul pe care clienta a cerut să
   * îl eliminăm. La 0.12 rămâne temperatură, nu contur. Restul variantelor nu
   * se ating: ele stau pe secțiuni cu fundal propriu.
   */
  hero: {
    mode: 'wake',
    fields: [
      {
        x: '62%',
        y: '24%',
        size: 1.4,
        peak: 0.8,
        accent: 0.12,
        xSm: '58%',
        ySm: '18%',
        sizeSm: 1.25,
      },
      {
        x: '14%',
        y: '26%',
        size: 0.9,
        peak: 0.5,
        accent: 0.1,
        xSm: '18%',
        ySm: '44%',
        sizeSm: 0.95,
        delay: '-9s',
        duration: '31s',
      },
    ],
  },

  /** Metoda — secțiune centrată. Câmpul stă exact sub titlu. */
  metoda: {
    mode: 'focus',
    fields: [{ x: '50%', y: '40%', size: 1.5, peak: 0.75, accent: 0.4 }],
  },

  /**
   * Citatul. Singurul bloc întunecat din pagină și locul în care aura chiar
   * are ce face: pe `--ac-ink`, lumina caldă citește ca o lumânare, iar miezul
   * e accentul, nu albul. Aici aurul merge la greutate plină — textul
   * `--ac-paper` are ~17:1 de cheltuit. Plafonul îl dă atribuirea de dedesubt,
   * 12px în `--ac-accent`: la 0.38 rămâne la 5.2:1, la 0.5 ar cădea la 4.45.
   */
  citat: {
    mode: 'focus',
    fields: [
      {
        x: '50%',
        y: '56%',
        size: 1.45,
        peak: 0.34,
        accent: 1,
        coreColor: 'var(--ac-accent)',
        duration: '34s',
      },
    ],
  },

  /** Serviciile — câmpul stă în colțul de sus-dreapta, departe de prețuri. */
  servicii: {
    mode: 'focus',
    fields: [
      { x: '80%', y: '20%', size: 1.35, peak: 0.75, accent: 0.4, xSm: '72%', ySm: '12%', sizeSm: 1.25 },
    ],
  },

  /**
   * Invitația finală. Ultimul punct de oprire: câmpul urcă din spatele
   * CTA-ului. Pe `--ac-cream-100` tot textul e `--ac-ink-70` sau mai închis,
   * deci aurul are voie să urce.
   */
  cta: {
    mode: 'focus',
    fields: [{ x: '50%', y: '52%', size: 1.45, peak: 0.8, accent: 0.6, duration: '29s' }],
  },
}

function styleFor(field: Field): CSSProperties {
  const vars: Record<string, string> = {
    '--fx': field.x,
    '--fy': field.y,
  }
  if (field.size !== undefined) vars['--fs'] = String(field.size)
  if (field.peak !== undefined) vars['--fp'] = String(field.peak)
  if (field.accent !== undefined) vars['--fa'] = String(field.accent)
  if (field.core !== undefined) vars['--fk'] = String(field.core)
  if (field.xSm) vars['--fx-sm'] = field.xSm
  if (field.ySm) vars['--fy-sm'] = field.ySm
  if (field.sizeSm !== undefined) vars['--fs-sm'] = String(field.sizeSm)
  if (field.delay) vars['--fdelay'] = field.delay
  if (field.duration) vars['--fdur'] = field.duration
  if (field.coreColor) vars['--fc'] = field.coreColor
  return vars as CSSProperties
}

export function SectionAura({ variant }: { variant: AuraVariant }) {
  const { mode, fields } = VARIANTS[variant]

  return (
    <div aria-hidden="true" data-aura={variant} data-aura-mode={mode}>
      {fields.map((field, index) => (
        <span key={`${field.x}-${field.y}-${index}`} data-aura-focus style={styleFor(field)}>
          <span data-aura-field />
        </span>
      ))}
    </div>
  )
}
