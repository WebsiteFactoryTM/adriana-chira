import * as z from 'zod/mini'

/**
 * Schema formularului de contact — un singur adevăr, pe client ȘI pe server.
 *
 * Promptul §5.4 cere validare în ambele locuri. Dacă ar fi două definiții, ele
 * ar devia: prima dată când cineva schimbă o limită într-una, cealaltă ar
 * accepta ce prima respinge. De aceea fișierul e importat și de `ContactForm`,
 * și de ruta care primește cererea.
 *
 * ## De ce `zod/mini` și nu `zod`
 *
 * Schema ajunge în bundle-ul de client, iar varianta clasică a Zod adaugă
 * **61 KB gzipped** paginii de contact — jumătate din bugetul de JS al întregului
 * site (STATUS §8), pe pagina care trebuie să convertească. `zod/mini` are
 * exact aceleași verificări și același `safeParse`, dar sub 3 KB, pentru că
 * regulile sunt funcții importate separat în loc de metode pe un obiect.
 *
 * Costul: sintaxa e mai verbosă (`.check(z.minLength(...))` în loc de
 * `.min(...)`). Merită.
 *
 * Mesajele sunt în română pentru că ajung direct sub câmp, la utilizator.
 */

export const CONTACT_LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 200 },
  phone: { max: 40 },
  message: { min: 20, max: 5000 },
} as const

export const contactSchema = z.object({
  name: z
    .string()
    .check(
      z.trim(),
      z.minLength(CONTACT_LIMITS.name.min, 'Scrie-mi cum te cheamă.'),
      z.maxLength(CONTACT_LIMITS.name.max, 'Numele este prea lung.'),
    ),

  email: z.pipe(
    z.string().check(z.trim(), z.maxLength(CONTACT_LIMITS.email.max, 'Adresa este prea lungă.')),
    z.email('Adresa de email nu pare corectă.'),
  ),

  phone: z.optional(
    z
      .string()
      .check(z.trim(), z.maxLength(CONTACT_LIMITS.phone.max, 'Numărul de telefon este prea lung.')),
  ),

  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(CONTACT_LIMITS.message.min, 'Scrie câteva rânduri despre situația ta.'),
      z.maxLength(CONTACT_LIMITS.message.max, 'Mesajul este prea lung. Păstrează esențialul.'),
    ),

  consent: z.literal(true, 'Am nevoie de acordul tău ca să îți pot răspunde.'),

  /**
   * Honeypot. Un câmp invizibil pentru oameni; boturile îl completează pentru
   * că citesc DOM-ul, nu CSS-ul. Fără reCAPTCHA — acela e transfer de date
   * către Google și ar complica politica de confidențialitate (prompt §5.4).
   */
  website: z.optional(z.string().check(z.maxLength(0, 'Cerere respinsă.'))),
})

export type ContactInput = z.infer<typeof contactSchema>

/**
 * Erorile pe câmp, în forma pe care o consumă formularul.
 *
 * Un singur mesaj sub fiecare câmp: dacă un câmp are mai multe probleme,
 * prima e cea care contează, restul se văd după ce o rezolvi.
 */
export type FieldErrors = Partial<Record<keyof ContactInput, string>>

export function fieldErrors(error: z.core.$ZodError<ContactInput>): FieldErrors {
  const out: FieldErrors = {}

  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && !(key in out)) {
      out[key as keyof ContactInput] = issue.message
    }
  }

  return out
}
