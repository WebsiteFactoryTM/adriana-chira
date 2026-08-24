import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import type { RichTextDocument } from '@/content/types'
import { cn } from '@/lib/cn'
import { asLexical, nodeText, slugifyAnchor, type LexicalNode } from '@/lib/lexical'

/**
 * Randarea conținutului Lexical, ca Server Component.
 *
 * Payload livrează un pachet gata făcut (`@payloadcms/richtext-lexical/react`),
 * dar acela intră în bundle-ul de client. Aici arborele e doar JSON, iar
 * transformarea lui în JSX nu are nevoie de niciun octet de JavaScript în
 * browser — la fel ca `Reveal` (STATUS §9.5).
 *
 * Nodurile necunoscute nu aruncă: le randăm copiii. Un editor care primește
 * un tip de bloc nou nu trebuie să scoată pagina din funcțiune.
 */

/* Masca de format de pe nodurile de text, din Lexical. */
const BOLD = 1
const ITALIC = 1 << 1
const STRIKETHROUGH = 1 << 2
const UNDERLINE = 1 << 3
const CODE = 1 << 4
const SUBSCRIPT = 1 << 5
const SUPERSCRIPT = 1 << 6

type Props = {
  content: RichTextDocument
  className?: string
}

export function RichText({ content, className }: Props) {
  const children = asLexical(content)?.root?.children
  if (!Array.isArray(children) || children.length === 0) return null

  return <div className={cn('ac-prose', className)}>{renderNodes(children, anchorCounter())}</div>
}

/**
 * Numărătoarea ancorelor de titlu.
 *
 * Trebuie să dea exact aceleași `id`-uri ca `headingAnchors()`, altfel
 * cuprinsul articolului trimite în gol. Ambele merg în ordinea documentului și
 * adaugă sufix numeric doar la coliziune.
 */
function anchorCounter(): (text: string) => string {
  const seen = new Map<string, number>()
  return (text: string) => {
    const base = slugifyAnchor(text)
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return count === 0 ? base : `${base}-${count + 1}`
  }
}

function renderNodes(nodes: LexicalNode[], anchor: (text: string) => string): ReactNode {
  return nodes.map((node, index) => (
    <RenderNode key={index} node={node} anchor={anchor} />
  ))
}

function RenderNode({
  node,
  anchor,
}: {
  node: LexicalNode
  anchor: (text: string) => string
}): ReactNode {
  const children = Array.isArray(node.children) ? node.children : []
  const inner = children.length > 0 ? renderNodes(children, anchor) : null

  switch (node.type) {
    case 'text':
      return renderText(node)

    case 'linebreak':
      return <br />

    case 'paragraph':
      // Un paragraf gol în editor e doar spațiu vertical involuntar.
      if (children.length === 0) return null
      return <p>{inner}</p>

    case 'heading': {
      const tag = typeof node.tag === 'string' ? node.tag : 'h2'
      const text = nodeText(node)
      if (tag === 'h2' || tag === 'h3') {
        const Tag = tag
        return <Tag id={text ? anchor(text) : undefined}>{inner}</Tag>
      }
      // Un singur h1 pe pagină, iar acela e titlul. Restul coboară la h4.
      return <h4>{inner}</h4>
    }

    case 'quote':
      return <blockquote>{inner}</blockquote>

    case 'list': {
      const ordered = node.listType === 'number'
      const Tag = ordered ? 'ol' : 'ul'
      return <Tag data-list={node.listType ?? 'bullet'}>{inner}</Tag>
    }

    case 'listitem':
      return <li>{inner}</li>

    case 'horizontalrule':
      return <hr />

    case 'link':
    case 'autolink':
      return <RenderLink node={node}>{inner}</RenderLink>

    case 'upload':
      return <RenderUpload node={node} />

    default:
      // Inclusiv `root` și orice tip de bloc adăugat ulterior în editor.
      return inner
  }
}

/** Nod de text, cu formatările aplicate ca elemente semantice. */
function renderText(node: LexicalNode): ReactNode {
  const value = typeof node.text === 'string' ? node.text : ''
  if (value.length === 0) return null

  const format = typeof node.format === 'number' ? node.format : 0
  let out: ReactNode = value

  if (format & CODE) out = <code>{out}</code>
  if (format & SUBSCRIPT) out = <sub>{out}</sub>
  if (format & SUPERSCRIPT) out = <sup>{out}</sup>
  if (format & STRIKETHROUGH) out = <s>{out}</s>
  if (format & UNDERLINE) out = <u>{out}</u>
  if (format & ITALIC) out = <em>{out}</em>
  if (format & BOLD) out = <strong>{out}</strong>

  return out
}

/**
 * Legăturile din conținut.
 *
 * Payload le salvează fie ca URL scris de mână, fie ca relație către un
 * document. Relația se rezolvă doar dacă a fost populată (`depth >= 1`); dacă
 * nu, randăm textul fără link, nu un `href` greșit.
 */
function RenderLink({ node, children }: { node: LexicalNode; children: ReactNode }) {
  const fields = (node.fields ?? {}) as {
    url?: string | null
    newTab?: boolean | null
    linkType?: string | null
    doc?: { relationTo?: string; value?: unknown } | null
  }

  const href = fields.linkType === 'internal' ? internalHref(fields.doc) : fields.url

  if (typeof href !== 'string' || href.length === 0) return <>{children}</>

  const external = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
  const rel = fields.newTab ? 'noopener noreferrer' : undefined
  const target = fields.newTab ? '_blank' : undefined

  if (external || href.startsWith('#')) {
    return (
      <a href={href} target={target} rel={rel} className="ac-underline leading-[normal]">
        {children}
      </a>
    )
  }

  return (
    <Link href={href} target={target} rel={rel} className="ac-underline leading-[normal]">
      {children}
    </Link>
  )
}

/** Ruta publică a unui document legat din editor. */
function internalHref(doc: { relationTo?: string; value?: unknown } | null | undefined): string | null {
  if (!doc || typeof doc.value !== 'object' || doc.value === null) return null
  const slug = (doc.value as { slug?: unknown }).slug
  if (typeof slug !== 'string' || slug.length === 0) return null

  switch (doc.relationTo) {
    case 'posts':
      return `/blog/${slug}`
    case 'packages':
      return `/servicii/${slug}`
    case 'categories':
      return `/blog/categorie/${slug}`
    default:
      return null
  }
}

/** Imagine încărcată în editor. `alt` este blocant în colecția `media`. */
function RenderUpload({ node }: { node: LexicalNode }) {
  const value = node.value as
    | { url?: string | null; alt?: string | null; width?: number | null; height?: number | null; caption?: string | null }
    | null
    | undefined

  if (!value || typeof value.url !== 'string') return null

  const width = typeof value.width === 'number' ? value.width : 1200
  const height = typeof value.height === 'number' ? value.height : 800

  return (
    <figure>
      <Image
        src={value.url}
        alt={typeof value.alt === 'string' ? value.alt : ''}
        width={width}
        height={height}
        sizes="(max-width: 900px) 100vw, 720px"
        className="block h-auto w-full"
      />
      {typeof value.caption === 'string' && value.caption.length > 0 && (
        <figcaption>{value.caption}</figcaption>
      )}
    </figure>
  )
}
