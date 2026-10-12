import type { PayloadEmailAdapter } from 'payload'

/**
 * Trimiterea emailurilor, prin API-ul HTTP al Resend.
 *
 * Fără SDK: Resend expune un singur `POST /emails` cu JSON, iar `fetch` există
 * deja în runtime. O dependență în plus ar aduce cod pe care nu-l folosim și
 * încă o versiune de urmărit — proiectul are deja regula „zero biblioteci care
 * nu-și merită locul" (STATUS §2). Tot de aici trimite și panoul Payload
 * (resetarea parolei), prin `resendEmailAdapter` — fără `@payloadcms/email-*`.
 *
 * DEGRADARE INTENȚIONATĂ: fără `RESEND_API_KEY`, funcția nu aruncă. Se
 * loghează și se întoarce `skipped`. Motivul e concret: mesajul din formular e
 * deja salvat în colecția `submissions` și vizibil în admin, deci a NU trimite
 * emailul înseamnă o notificare ratată, nu un mesaj pierdut. Un formular care
 * răspunde cu eroare pentru că lipsește o cheie de mediu ar pierde mesajul —
 * mult mai rău.
 *
 * Variabilele (vezi `.env.example`):
 *   RESEND_API_KEY  cheia, din contul Resend în care `adrianachira.ro` e verificat
 *   EMAIL_FROM      „Adriana Chira <contact@adrianachira.ro>" — numele apare în inbox
 *   EMAIL_TO_ADMIN  unde ajung notificările; mai multe adrese, separate prin virgulă
 */

export type EmailResult = { status: 'sent' | 'skipped' | 'error'; id?: string; message?: string }

type SendArgs = {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  replyTo?: string
  /** Doar pentru emailurile panoului, care își compun singure expeditorul. */
  from?: string
}

const ENDPOINT = 'https://api.resend.com/emails'
const DEFAULT_SENDER_NAME = 'Adriana Chira'

export async function sendEmail({
  to,
  subject,
  text,
  html,
  replyTo,
  from,
}: SendArgs): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  const sender = from ?? process.env.EMAIL_FROM
  const recipients = (Array.isArray(to) ? to : [to]).map((item) => item.trim()).filter(Boolean)

  if (!apiKey || !sender) {
    return { status: 'skipped', message: 'RESEND_API_KEY sau EMAIL_FROM lipsește' }
  }
  if (recipients.length === 0) return { status: 'skipped', message: 'fără destinatar' }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: recipients,
        // Subiectul e un antet: un rând nou în el (un nume scris pe două
        // rânduri în formular) face Resend să refuze tot mesajul.
        subject: subject.replace(/\s+/g, ' ').trim(),
        ...(text ? { text } : {}),
        ...(html ? { html } : {}),
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      return { status: 'error', message: `${response.status}: ${detail.slice(0, 200)}` }
    }

    const body = (await response.json().catch(() => null)) as { id?: unknown } | null
    return { status: 'sent', ...(typeof body?.id === 'string' ? { id: body.id } : {}) }
  } catch (error) {
    return { status: 'error', message: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Adresele care primesc notificările: mesaj nou, cerere de document, comandă.
 *
 * O listă, nu o adresă: notificarea poate merge la Adriana și, cât timp site-ul
 * e în rodaj, și la cine îl administrează — fără cod, doar din variabilă.
 */
export function adminRecipients(): string[] {
  return (process.env.EMAIL_TO_ADMIN ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

/**
 * Emailurile panoului Payload — azi, „Ai uitat parola?".
 *
 * Fără adaptor, Payload doar scrie emailul în log: resetarea parolei pare să
 * meargă, iar mesajul nu pleacă nicăieri. Fără cheie întoarcem `undefined`, ca
 * Payload să rămână pe adaptorul lui de consolă — local, linkul de resetare se
 * vede în terminal.
 *
 * Aici o eroare de trimitere ARUNCĂ, invers decât la formulare: nu există un
 * mesaj salvat în altă parte, iar panoul trebuie să spună că n-a mers, nu
 * „verifică-ți emailul".
 */
export function resendEmailAdapter(): PayloadEmailAdapter<EmailResult> | undefined {
  const from = process.env.EMAIL_FROM
  if (!process.env.RESEND_API_KEY || !from) return undefined

  const sender = parseSender(from)

  return () => ({
    name: 'resend',
    defaultFromAddress: sender.address,
    defaultFromName: sender.name,
    async sendEmail(message) {
      const result = await sendEmail({
        to: addressList(message.to),
        subject: typeof message.subject === 'string' ? message.subject : '',
        ...(typeof message.html === 'string' ? { html: message.html } : {}),
        ...(typeof message.text === 'string' ? { text: message.text } : {}),
        from: formatAddress(message.from) ?? from,
        ...(formatAddress(message.replyTo) ? { replyTo: formatAddress(message.replyTo) } : {}),
      })
      if (result.status !== 'sent') throw new Error(`Emailul nu a plecat: ${result.message ?? ''}`)
      return result
    },
  })
}

/** `Adriana Chira <contact@…>` → nume + adresă; o adresă goală primește numele implicit. */
function parseSender(value: string): { name: string; address: string } {
  const match = /^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/.exec(value)
  if (!match) return { name: DEFAULT_SENDER_NAME, address: value.trim() }
  return { name: match[1]?.trim() || DEFAULT_SENDER_NAME, address: (match[2] ?? '').trim() }
}

/**
 * Adresele din mesajele Payload au forma Nodemailer: șir, `{ name, address }`
 * sau listă din ambele. Tipurile Nodemailer nu sunt în proiect, deci le
 * citim ca `unknown` și le îngustăm aici.
 */
function formatAddress(value: unknown): string | undefined {
  if (typeof value === 'string') return value.trim() || undefined
  if (value && typeof value === 'object' && 'address' in value) {
    const { address, name } = value as { address?: unknown; name?: unknown }
    if (typeof address !== 'string' || !address) return undefined
    return typeof name === 'string' && name ? `${name} <${address}>` : address
  }
  return undefined
}

function addressList(value: unknown): string[] {
  const list: unknown[] = Array.isArray(value) ? value : [value]
  return list.map(formatAddress).filter((item): item is string => Boolean(item))
}
