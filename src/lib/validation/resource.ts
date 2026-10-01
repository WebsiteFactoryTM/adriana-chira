import * as z from 'zod/mini'

/**
 * Formularul pentru resursele „doar cu formular".
 *
 * Spre deosebire de `contact.ts`, schema asta NU ajunge în browser: formularul
 * e HTML simplu, trimis cu `<form method="post">`, ca butonul de plată. Pe
 * client lucrează validarea nativă (`required`, `type="email"`, `pattern`),
 * care oprește aproape orice greșeală fără un octet de JavaScript; aici se
 * repetă totul, pentru că validarea din browser se poate ocoli.
 *
 * `PHONE_PATTERN` e folosit și în atributul `pattern` al câmpului, deci cele
 * două verificări nu pot devia. Parantezele și punctul sunt scăpate: browserele
 * compilează `pattern` cu indicatorul `v`, unde `(`, `)` și `-` nescăpate
 * într-o clasă fac expresia invalidă — iar o expresie invalidă e ignorată în
 * tăcere, adică validarea dispare fără niciun semn.
 */
export const PHONE_PATTERN = '[+0-9 \\(\\)\\.\\-]{9,20}'

const phoneRe = new RegExp(`^${PHONE_PATTERN}$`)

const name = (message: string) =>
  z.string().check(z.trim(), z.minLength(2, message), z.maxLength(80, 'Textul este prea lung.'))

export const resourceRequestSchema = z.object({
  resource: z.string().check(z.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
  post: z.optional(z.string().check(z.regex(/^\d{0,12}$/))),
  firstName: name('Scrie-ți prenumele.'),
  lastName: name('Scrie-ți numele.'),
  email: z.pipe(
    z.string().check(z.trim(), z.maxLength(200)),
    z.email('Adresa de email nu pare corectă.'),
  ),
  phone: z
    .string()
    .check(
      z.trim(),
      z.regex(phoneRe, 'Numărul de telefon nu pare corect.'),
      z.refine((value) => value.replace(/\D/g, '').length >= 9, 'Numărul de telefon nu pare corect.'),
    ),
  consent: z.literal('on', 'Am nevoie de acordul tău.'),
  marketing: z.optional(z.literal('on')),
  /** Honeypot, ca la contact. */
  website: z.optional(z.string().check(z.maxLength(0))),
})

export type ResourceRequestInput = z.infer<typeof resourceRequestSchema>

/** `FormData` → obiect simplu, doar cu câmpurile cunoscute și doar șiruri. */
export function formToObject(form: FormData): Record<string, string> {
  const out: Record<string, string> = {}
  for (const key of ['resource', 'post', 'firstName', 'lastName', 'email', 'phone', 'consent', 'marketing', 'website']) {
    const value = form.get(key)
    if (typeof value === 'string') out[key] = value
  }
  return out
}
