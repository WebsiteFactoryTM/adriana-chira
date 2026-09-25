import { Glyph, GlyphBadge, type GlyphName } from '@/components/ui/Glyph'
import { Reveal } from '@/components/ui/Reveal'
import { Section, Shell } from '@/components/ui/Section'
import type { PackageSection, PackageSectionKind } from '@/content/types'
import { slugifyAnchor } from '@/lib/lexical'

/**
 * Descrierea lungă a unui program.
 *
 * ## Ce s-a schimbat, și de ce
 *
 * Prima variantă randa toate secțiunile identic: `h2`, paragrafe, listă,
 * blocuri numerotate — la rând, într-o singură coloană, cu același spațiu între
 * ele. Textul era corect și pagina era, vizual, documentul Word din care
 * venise. Pe un program cu zece secțiuni, asta se citește ca o sarcină, nu ca o
 * ofertă: cititorul vede un perete și decide, în două secunde, că n-are timp.
 *
 * Acum **fiecare secțiune e o bandă proprie**, cu fundalul ei, cu semnul ei și
 * cu forma potrivită conținutului ei. Trei lucruri fac diferența:
 *
 * 1. **Fundalul alternează**, hârtie / crem. Separarea o face culoarea, nu
 *    spațiul — de aceea banda are `py-section-body`, mult mai strâns decât
 *    ritmul de pe prima pagină. Zece benzi la ritmul de acolo ar fi însemnat
 *    trei ecrane de gol.
 * 2. **Forma spune ce fel de conținut urmează**, înainte să fie citit: o listă
 *    de simptome arată altfel decât una de rezultate, chiar dacă amândouă sunt
 *    `string[]`. Felul se declară în conținut (`kind`), nu se ghicește aici.
 * 3. **Benzile de citit se deosebesc de cele de scanat.** Cele narative
 *    (`prose`) primesc doar numărul; toate celelalte primesc și un semn. Cine
 *    derulează repede vede din periferie unde e text de citit și unde e o listă
 *    din care poate lua doar ce îl privește.
 *
 * ## Textul nu s-a schimbat
 *
 * Singura intervenție este `trimItem`: punctul și virgula de la capătul unui
 * element de listă se scot la randare. Erau corecte când lista era o frază
 * lungă întreruptă; într-o grilă de carduri, fiecare element se citește singur,
 * iar `;`-ul rămas atârnă. Nu se atinge niciun cuvânt și niciun alt semn.
 *
 * Componenta intră doar când `longDescription` din admin lipsește — ceea ce
 * astăzi e cazul normal, pentru că textul celor trei programe a venit de la
 * clientă ca document, nu tastat în CMS.
 */

/** Semnul fiecărui fel de bandă. `prose` nu are: vezi motivul de mai sus. */
const GLYPHS: Record<PackageSectionKind, GlyphName | null> = {
  prose: null,
  checklist: 'check',
  cards: 'grid',
  steps: 'path',
  outcomes: 'diamond',
  split: 'split',
  statement: 'quote',
}

/**
 * Ancora unei secțiuni din descrierea lungă.
 *
 * Aceeași funcție calculează și ancorele din cuprinsul articolelor de blog,
 * deci cuprinsul paginii de program și titlurile pe care le țintește nu pot
 * devia — exact regula din STATUS §4, mutată de pe articole pe programe.
 */
export function packageSectionAnchor(heading: string): string {
  return slugifyAnchor(heading)
}

export type PackageOutlineEntry = {
  anchor: string
  heading: string
  numeral: string
  glyph: GlyphName | null
}

/**
 * Cuprinsul, calculat din aceleași date din care se randează benzile.
 *
 * Exportat, ca pagina să nu își construiască o listă paralelă: numerele din
 * chipsurile de sus și numerele de pe benzi vin din același loc, deci nu pot
 * ajunge să spună lucruri diferite.
 */
export function packageOutline(sections: PackageSection[]): PackageOutlineEntry[] {
  return sections.map((section, index) => ({
    anchor: packageSectionAnchor(section.heading),
    heading: section.heading,
    numeral: String(index + 1).padStart(2, '0'),
    glyph: GLYPHS[section.kind ?? 'prose'],
  }))
}

type BandTone = 'paper' | 'cream' | 'ink'

export function PackageBody({ sections }: { sections: PackageSection[] }) {
  /*
    Alternanța se calculează înainte de randare, nu în timpul ei: o secțiune
    `statement` stă pe bloc întunecat și NU consumă un pas, ca hârtia și cremul
    să continue corect de o parte și de alta a ei.
  */
  let step = 0
  const bands = sections.map((section, index) => {
    const kind = section.kind ?? 'prose'
    const tone: BandTone =
      kind === 'statement' ? 'ink' : (section.tone ?? (step++ % 2 === 0 ? 'paper' : 'cream'))
    return { section, kind, tone, numeral: String(index + 1).padStart(2, '0') }
  })

  return (
    <>
      {bands.map(({ section, kind, tone, numeral }) => (
        <Band key={section.heading} section={section} kind={kind} tone={tone} numeral={numeral} />
      ))}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Banda                                                                       */
/* -------------------------------------------------------------------------- */

type BandProps = {
  section: PackageSection
  kind: PackageSectionKind
  tone: BandTone
  numeral: string
}

function Band({ section, kind, tone, numeral }: BandProps) {
  const anchor = packageSectionAnchor(section.heading)
  const headingId = `${anchor}-titlu`

  if (kind === 'statement') {
    return <StatementBand section={section} anchor={anchor} headingId={headingId} />
  }

  const heading = (
    <BandHeading
      heading={section.heading}
      headingId={headingId}
      numeral={numeral}
      glyph={GLYPHS[kind]}
    />
  )

  const content = <BandContent section={section} kind={kind} tone={tone} />

  /*
    Două așezări, alese după cum se citește conținutul:

    - coloane — titlul într-una, conținutul în cealaltă. Pentru text care se
      citește în ordine: narațiune, simptome, etape, rezultate. Coloana de
      titlu ține măsura textului la ~62 de caractere fără niciun efort.
    - stivuit — titlul deasupra, conținutul lat dedesubt. Pentru grile de
      carduri și pentru cele două coloane opuse, care au nevoie de toată
      lățimea ca să nu se strivească.
  */
  const stacked = kind === 'cards' || kind === 'split'

  return (
    <Section
      id={anchor}
      tone={tone}
      padding="body"
      aria-labelledby={headingId}
      /* 132px = bara sticky. Fără el, săritura din cuprins ascunde titlul. */
      className="scroll-mt-[132px]"
    >
      {stacked ? (
        <Shell>
          {heading}
          <div className="mt-[clamp(32px,4vw,52px)]">{content}</div>
        </Shell>
      ) : (
        <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-x-col-gap gap-y-[clamp(28px,3.5vw,44px)]">
          {heading}
          <div>{content}</div>
        </Shell>
      )}
    </Section>
  )
}

function BandHeading({
  heading,
  headingId,
  numeral,
  glyph,
}: {
  heading: string
  headingId: string
  numeral: string
  glyph: GlyphName | null
}) {
  return (
    <div>
      <div className="flex items-center gap-4">
        {glyph ? (
          <GlyphBadge name={glyph} />
        ) : (
          /* Benzile de citit n-au semn. Liniuța le ține totuși aliniate cu
             cele care au, ca numerele să cadă pe aceeași verticală. */
          <span aria-hidden="true" className="block h-px w-11 shrink-0 bg-ac-accent" />
        )}
        <span className="font-medium text-label uppercase text-ac-accent-ink">{numeral}</span>
      </div>

      <Reveal
        as="h2"
        id={headingId}
        className="mt-7 max-w-[20ch] font-display text-h2-col font-light"
      >
        {heading}
      </Reveal>
    </div>
  )
}

function BandContent({
  section,
  kind,
  tone,
}: {
  section: PackageSection
  kind: PackageSectionKind
  tone: BandTone
}) {
  const lead = section.paragraphs ?? []

  if (kind === 'split') {
    return <SplitBlock paragraphs={lead} labels={section.splitLabels} tone={tone} />
  }

  return (
    <div className="grid gap-[clamp(28px,3vw,40px)]">
      {kind === 'prose' ? (
        <Prose paragraphs={lead} size="lg" />
      ) : (
        lead.length > 0 && <Prose paragraphs={lead} size="md" />
      )}

      {kind === 'cards' && <CardGrid section={section} tone={tone} />}
      {kind === 'steps' && section.steps && <StepList steps={section.steps} tone={tone} />}
      {kind === 'checklist' && section.list && <CheckList items={section.list} />}
      {kind === 'outcomes' && section.list && <OutcomeList items={section.list} />}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Blocuri                                                                     */
/* -------------------------------------------------------------------------- */

function Prose({ paragraphs, size }: { paragraphs: string[]; size: 'lg' | 'md' }) {
  if (paragraphs.length === 0) return null

  return (
    <div className="grid gap-6">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={`max-w-[62ch] text-ac-ink-70 ${size === 'lg' ? 'text-body-lg' : 'text-body'}`}
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}

/**
 * Punctul și virgula de la capătul unui element de listă.
 *
 * Corect cât timp lista era o frază lungă întreruptă de puncte și virgulă;
 * greșit de îndată ce fiecare element stă într-un card sau pe un rând cu
 * numărul lui, unde se citește singur. Se scoate la randare, nu din conținut:
 * fișierul rămâne sursa din care `pnpm seed` populează CMS-ul, iar acolo textul
 * trebuie să fie cel livrat de clientă.
 */
function trimItem(value: string): string {
  return value.replace(/;$/, '')
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-8 sm:grid-cols-2">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-4 border-t border-ac-line py-[14px] text-body text-ac-ink-70"
        >
          <Glyph name="check" size="sm" className="mt-[7px] text-ac-accent" />
          <span>{trimItem(item)}</span>
        </li>
      ))}
    </ul>
  )
}

function OutcomeList({ items }: { items: string[] }) {
  return (
    <ol className="grid">
      {items.map((item, index) => (
        <li
          key={index}
          className="grid grid-cols-[auto_1fr] items-start gap-x-5 border-t border-ac-line py-[18px] last:border-b"
        >
          <span aria-hidden="true" className="font-medium text-label text-ac-accent-ink">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="max-w-[58ch] text-body text-ac-ink-70">{trimItem(item)}</span>
        </li>
      ))}
    </ol>
  )
}

/**
 * Grila de carduri.
 *
 * Acceptă și `steps` (dimensiunile HPA, metoda CLAR, rolurile), și `list` —
 * pentru listele ale căror elemente sunt de fapt „titlu: explicație", ca
 * tensiunile dintre calități. Împărțirea se face pe primul „: " din text, deci
 * nu cere nicio rescriere: propoziția clientei rămâne exact cum a scris-o, doar
 * că prima ei jumătate devine titlul cardului.
 */
function CardGrid({ section, tone }: { section: PackageSection; tone: BandTone }) {
  const surface = tone === 'cream' ? 'bg-ac-paper' : 'bg-ac-cream-50'

  const cards =
    section.steps ??
    (section.list ?? []).map((item, index) => {
      const clean = trimItem(item)
      const separator = clean.indexOf(': ')
      const numeral = String(index + 1).padStart(2, '0')
      return separator > 0
        ? { index: numeral, title: clean.slice(0, separator), body: clean.slice(separator + 2) }
        : { index: numeral, title: '', body: clean }
    })

  if (cards.length === 0) return null

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,270px),1fr))] items-stretch gap-[clamp(16px,1.8vw,24px)]">
      {cards.map((card, index) => (
        <Reveal
          as="article"
          key={card.index}
          start={`${(index % 3) * 3}%`}
          className={`flex flex-col rounded-card border border-ac-line p-[clamp(24px,2.4vw,32px)] ${surface}`}
        >
          <p
            aria-hidden="true"
            className="font-display text-numeral-roman font-light text-ac-accent"
          >
            {card.index}
          </p>

          {card.title && (
            <h3 className="mt-5 font-display text-h3 font-normal text-ac-ink">{card.title}</h3>
          )}

          <p
            className={`text-body-sm leading-[1.75] text-ac-ink-70 ${card.title ? 'mt-3' : 'mt-5'}`}
          >
            {card.body}
          </p>
        </Reveal>
      ))}
    </div>
  )
}

/** Etapele unui proces: verticală numerotată, cu firul care le leagă. */
function StepList({
  steps,
  tone,
}: {
  steps: NonNullable<PackageSection['steps']>
  tone: BandTone
}) {
  const surface = tone === 'cream' ? 'bg-ac-cream-50' : 'bg-ac-paper'

  return (
    <ol className="grid">
      {steps.map((step, index) => {
        const last = index === steps.length - 1

        return (
          <li key={step.index} className="relative grid grid-cols-[auto_1fr] gap-x-6">
            {/*
              Firul dintre pastile. Pornește de sub pastilă și coboară până la
              următoarea; pe ultima nu există, altfel procesul ar părea că are
              o etapă nedesenată.
            */}
            {!last && (
              <span
                aria-hidden="true"
                className="absolute top-11 bottom-0 left-[21px] w-px bg-ac-line"
              />
            )}

            <span
              aria-hidden="true"
              className={`z-[1] flex size-11 shrink-0 items-center justify-center rounded-pill border border-ac-accent font-display text-lg leading-none font-normal text-ac-accent-ink ${surface}`}
            >
              {step.index}
            </span>

            <div className={last ? '' : 'pb-[clamp(28px,3vw,40px)]'}>
              <h3 className="font-display text-h3 font-normal">{step.title}</h3>
              <p className="mt-3 max-w-[58ch] text-body text-ac-ink-70">{step.body}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Două coloane opuse: cui i se potrivește și cui nu.
 *
 * Textul era deja scris ca două paragrafe care se opun — primul „este potrivit
 * dacă…", al doilea „nu este potrivit dacă…". Ca paragrafe la rând, opoziția se
 * pierde: arată ca o continuare. Alăturate, cu marginea din stânga în accent pe
 * cea favorabilă, se citesc dintr-o privire, iar cine se recunoaște în coloana
 * din dreapta economisește o conversație de potrivire — ceea ce e în interesul
 * amândurora.
 */
function SplitBlock({
  paragraphs,
  labels,
  tone,
}: {
  paragraphs: string[]
  labels?: [string, string]
  tone: BandTone
}) {
  const surface = tone === 'cream' ? 'bg-ac-paper' : 'bg-ac-cream-50'
  const [yes, no] = paragraphs

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(16px,2vw,28px)]">
      {yes && (
        <div
          className={`rounded-card border border-ac-line border-l-ac-accent p-[clamp(24px,2.6vw,36px)] ${surface}`}
        >
          <p className="flex items-center gap-3 font-medium text-label uppercase text-ac-accent-ink">
            <Glyph name="check" size="sm" className="text-ac-accent" />
            {labels?.[0] ?? 'Da'}
          </p>
          <p className="mt-5 text-body leading-[1.8] text-ac-ink-70">{yes}</p>
        </div>
      )}

      {no && (
        <div className={`rounded-card border border-ac-line p-[clamp(24px,2.6vw,36px)] ${surface}`}>
          <p className="flex items-center gap-3 font-medium text-label uppercase text-ac-ink-70">
            <Glyph name="split" size="sm" className="text-ac-ink-70" />
            {labels?.[1] ?? 'Nu'}
          </p>
          <p className="mt-5 text-body leading-[1.8] text-ac-ink-70">{no}</p>
        </div>
      )}
    </div>
  )
}

/**
 * Promisiunea programului, pe bloc întunecat.
 *
 * Este singura bandă care se rupe complet din ritm, și e deliberat: pe toată
 * pagina există un singur bloc `ink`, exact ca pe prima pagină, unde acela e
 * citatul. Un al doilea l-ar face pe primul să nu mai însemne nimic.
 */
function StatementBand({
  section,
  anchor,
  headingId,
}: {
  section: PackageSection
  anchor: string
  headingId: string
}) {
  const [first] = section.paragraphs ?? []

  return (
    <Section
      id={anchor}
      tone="ink"
      padding="body"
      aria-labelledby={headingId}
      className="scroll-mt-[132px]"
    >
      <div className="mx-auto max-w-cta px-gutter text-center">
        <h2
          id={headingId}
          className="flex items-center justify-center gap-4 font-medium text-label uppercase text-ac-accent"
        >
          <Glyph name="quote" size="sm" />
          {section.heading}
        </h2>

        {first && (
          <Reveal
            as="p"
            end="34%"
            className="mx-auto mt-[clamp(28px,3.4vw,44px)] max-w-[26ch] font-display text-quote font-light"
          >
            {first}
          </Reveal>
        )}
      </div>
    </Section>
  )
}
