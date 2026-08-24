/**
 * Extragerea textului simplu dintr-un document Lexical.
 *
 * Ne trebuie în trei locuri: timpul de citire (hook pe `posts`), `llms.txt` și
 * meta description-ul generat automat. Payload livrează conținutul ca arbore
 * JSON; parcurgem recursiv și adunăm nodurile de text.
 *
 * Nu depindem de tipurile interne ale editorului: forma nodurilor s-a schimbat
 * între versiuni de Lexical, iar aici ne interesează un singur lucru — câmpul
 * `text` de pe frunze și `children` pe restul.
 */

export type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

export type LexicalDocument = {
  root?: LexicalNode
} | null | undefined

/** Tipurile de nod după care punem separator de bloc, ca să nu lipim cuvintele. */
const BLOCK_TYPES = new Set(['paragraph', 'heading', 'quote', 'listitem', 'list'])

function walk(node: LexicalNode, out: string[]): void {
  if (typeof node.text === 'string' && node.text.length > 0) {
    out.push(node.text)
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, out)
  }
  if (node.type && BLOCK_TYPES.has(node.type)) {
    out.push('\n')
  }
}

export function lexicalToPlainText(doc: LexicalDocument): string {
  if (!doc?.root) return ''
  const parts: string[] = []
  walk(doc.root, parts)
  return parts
    .join(' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n+ */g, '\n')
    .trim()
}

/**
 * Timpul de citire în minute.
 *
 * 200 de cuvinte pe minut este media pentru română la text de nonficțiune;
 * rotunjim în sus și nu coborâm niciodată sub 1, ca eticheta „0 min" să nu
 * apară pe articolele scurte.
 */
export function readingTimeMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/* -------------------------------------------------------------------------- */
/* Titluri — cuprinsul automat                                                 */
/* -------------------------------------------------------------------------- */

export type Heading = {
  /** Ancora, identică cu `id`-ul pus de `RichText` pe titlul din pagină. */
  id: string
  text: string
  level: 2 | 3
}

/** Textul unui nod, cu tot ce are dedesubt. */
export function nodeText(node: LexicalNode): string {
  const parts: string[] = []
  const visit = (current: LexicalNode): void => {
    if (typeof current.text === 'string') parts.push(current.text)
    if (Array.isArray(current.children)) current.children.forEach(visit)
  }
  visit(node)
  return parts.join('').replace(/\s+/g, ' ').trim()
}

/**
 * Ancorele titlurilor.
 *
 * Se calculează în DOUĂ locuri — aici, pentru cuprins, și în `RichText`, la
 * randare — deci trebuie să fie o funcție pură de (text, poziție). Sufixul
 * numeric intră doar la coliziune: două titluri cu același text ar da aceeași
 * ancoră, iar linkul din cuprins ar duce mereu la primul.
 */
export function headingAnchors(doc: LexicalDocument): Heading[] {
  const children = doc?.root?.children
  if (!Array.isArray(children)) return []

  const seen = new Map<string, number>()
  const headings: Heading[] = []

  for (const node of children) {
    if (node.type !== 'heading') continue
    const tag = typeof node.tag === 'string' ? node.tag : 'h2'
    if (tag !== 'h2' && tag !== 'h3') continue

    const text = nodeText(node)
    if (text.length === 0) continue

    const base = slugifyAnchor(text)
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)

    headings.push({
      id: count === 0 ? base : `${base}-${count + 1}`,
      text,
      level: tag === 'h2' ? 2 : 3,
    })
  }

  return headings
}

/**
 * Ancoră ASCII dintr-un titlu românesc.
 *
 * Aceeași normalizare ca `slugify` din `src/fields/slug.ts`, dar fără să
 * importăm de acolo: acela e cod de admin (rulează în hook-urile Payload), iar
 * ăsta rulează la randarea paginii. Diacriticele cu sedilă sunt scrise prin
 * coduri, ca verificarea din STATUS §12 să rămână la zero.
 */
function slugifyAnchor(input: string): string {
  const map: Record<string, string> = {
    '\u0103': 'a',
    '\u00E2': 'a',
    '\u00EE': 'i',
    '\u0219': 's',
    '\u021B': 't',
    '\u015F': 's',
    '\u0163': 't',
  }

  return input
    .toLowerCase()
    .replace(/[\u0103\u00E2\u00EE\u0219\u021B\u015F\u0163]/g, (char) => map[char] ?? char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['"\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export { slugifyAnchor }

/**
 * Trecerea de la tipul de contract la arborele intern.
 *
 * `RichTextDocument` din `src/content/types.ts` ține rădăcina ca `unknown`
 * intenționat: contractul de conținut nu trebuie să depindă de forma internă a
 * editorului, care s-a schimbat deja între versiuni de Lexical. Conversia se
 * face într-un singur loc — aici — și verifică ce presupune.
 */
export function asLexical(value: unknown): LexicalDocument {
  if (!value || typeof value !== 'object') return null
  const root = (value as { root?: unknown }).root
  if (!root || typeof root !== 'object') return null
  return { root: root as LexicalNode }
}

/**
 * Toate adresele către care trimite un document.
 *
 * Ne trebuie ca să știm dacă un articol are deja legăturile interne obligatorii
 * (brief: cel puțin una către un pachet și una către `/despre`). Se citesc și
 * linkurile scrise de mână, și cele către documente din CMS — pentru ultimele
 * contează colecția, nu URL-ul, pentru că relația poate fi nepopulată.
 */
export function collectLinkTargets(doc: LexicalDocument): string[] {
  const targets: string[] = []
  if (!doc?.root) return targets

  const visit = (node: LexicalNode): void => {
    if (node.type === 'link' || node.type === 'autolink') {
      const fields = node.fields as
        | { url?: unknown; linkType?: unknown; doc?: { relationTo?: unknown } | null }
        | undefined

      if (typeof fields?.url === 'string') targets.push(fields.url)

      const relationTo = fields?.doc?.relationTo
      if (typeof relationTo === 'string') targets.push(`payload:${relationTo}`)
    }
    if (Array.isArray(node.children)) node.children.forEach(visit)
  }

  visit(doc.root)
  return targets
}
