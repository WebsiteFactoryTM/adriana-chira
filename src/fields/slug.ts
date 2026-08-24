import type { Field, FieldHook } from 'payload'

/**
 * Transformă un titlu românesc într-un slug ASCII.
 *
 * Diacriticele nu se rezolvă doar cu `normalize('NFD')`: `ș` și `ț` cu virgulă
 * (U+0219 / U+021B) se descompun corect, dar variantele cu sedilă (U+015F /
 * U+0163), care apar în texte lipite din Word, nu. Le mapăm explicit.
 * Le scriem prin coduri, nu ca litere, ca verificarea de sedile din STATUS.md
 * §12 să rămână la zero pe tot arborele `src/`.
 *
 * Rezultatul trebuie să fie stabil: același titlu dă mereu același slug.
 */
const DIACRITICS: Record<string, string> = {
  // Forma corectă, cu virgulă dedesubt.
  'ă': 'a',
  'â': 'a',
  'î': 'i',
  '\u0219': 's',
  '\u021B': 't',
  'Ă': 'a',
  'Â': 'a',
  'Î': 'i',
  '\u0218': 's',
  '\u021A': 't',
  // Forma cu sedilă — greșită, dar frecventă în conținut lipit.
  '\u015F': 's',
  '\u0163': 't',
  '\u015E': 's',
  '\u0162': 't',
}

const DIACRITICS_RE = /[\u0103\u00E2\u00EE\u0219\u021B\u0102\u00C2\u00CE\u0218\u021A\u015F\u0163\u015E\u0162]/g

export function slugify(input: string): string {
  return input
    .trim()
    .replace(DIACRITICS_RE, (char) => DIACRITICS[char] ?? char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['"\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generează slug-ul din câmpul sursă doar dacă redactorul nu a scris unul.
 * După publicare, redenumirea titlului nu trebuie să schimbe slug-ul — ar rupe
 * linkurile existente și ar arunca 404-uri în index.
 */
const formatSlug =
  (sourceField: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    if (operation === 'create' || operation === 'update') {
      const source = data?.[sourceField]
      if (typeof source === 'string' && source.length > 0) return slugify(source)
    }
    return value
  }

type SlugFieldOptions = {
  /** Câmpul din care se generează slug-ul. Implicit `title`. */
  from?: string
  description?: string
}

export const slugField = ({ from = 'title', description }: SlugFieldOptions = {}): Field => ({
  name: 'slug',
  type: 'text',
  label: 'Slug (adresa în URL)',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description:
      description ??
      'Se completează singur din titlu, fără diacritice. Îl poți edita, dar după publicare schimbarea rupe linkurile existente.',
  },
  hooks: {
    beforeValidate: [formatSlug(from)],
  },
  validate: (value: unknown) => {
    if (typeof value !== 'string' || value.length === 0) return 'Slug-ul este obligatoriu.'
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      return 'Slug-ul poate conține doar litere mici fără diacritice, cifre și cratime.'
    }
    return true
  },
})
