/**
 * Trimiterea emailurilor, prin API-ul HTTP al Resend.
 *
 * Fără SDK: Resend expune un singur `POST /emails` cu JSON, iar `fetch` există
 * deja în runtime. O dependență în plus ar aduce cod pe care nu-l folosim și
 * încă o versiune de urmărit — proiectul are deja regula „zero biblioteci care
 * nu-și merită locul" (STATUS §2).
 *
 * DEGRADARE INTENȚIONATĂ: fără `RESEND_API_KEY`, funcția nu aruncă. Se
 * loghează și se întoarce `skipped`. Motivul e concret: mesajul din formular e
 * deja salvat în colecția `submissions` și vizibil în admin, deci a NU trimite
 * emailul înseamnă o notificare ratată, nu un mesaj pierdut. Un formular care
 * răspunde cu eroare pentru că lipsește o cheie de mediu ar pierde mesajul —
 * mult mai rău.
 */

export type EmailResult = { status: 'sent' | 'skipped' | 'error'; message?: string }

type SendArgs = {
  to: string
  subject: string
  text: string
  replyTo?: string
}

const ENDPOINT = 'https://api.resend.com/emails'

export async function sendEmail({ to, subject, text, replyTo }: SendArgs): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM

  if (!apiKey || !from) {
    return { status: 'skipped', message: 'RESEND_API_KEY sau EMAIL_FROM lipsește' }
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      return { status: 'error', message: `${response.status}: ${detail.slice(0, 200)}` }
    }

    return { status: 'sent' }
  } catch (error) {
    return { status: 'error', message: error instanceof Error ? error.message : String(error) }
  }
}
