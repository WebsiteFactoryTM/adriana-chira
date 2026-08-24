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

type LexicalNode = {
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
