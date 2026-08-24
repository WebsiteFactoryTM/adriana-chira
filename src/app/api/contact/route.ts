import { NextResponse } from 'next/server'

import { sendEmail } from '@/lib/email'
import { getPayloadClient } from '@/lib/payload'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { contactSchema, fieldErrors } from '@/lib/validation/contact'

/**
 * Formularul de contact.
 *
 * Ordinea operațiilor nu e întâmplătoare:
 *   1. limitare de rată — cel mai ieftin filtru, înainte de orice altceva
 *   2. validare cu ACEEAȘI schemă ca pe client
 *   3. salvare în `submissions` — sursa de adevăr; dacă asta cade, e eroare
 *   4. notificare pe email — dacă asta cade, mesajul e deja în siguranță
 *
 * Adică: un mesaj ajuns aici nu se pierde niciodată din cauza unei chei de
 * email lipsă sau a unui furnizor picat.
 */

export const runtime = 'nodejs'
/** Nimic de prerandat: ruta scrie în baza de date la fiecare cerere. */
export const dynamic = 'force-dynamic'

type Payload = Record<string, unknown>

export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientIp(request.headers)}`)
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Prea multe mesaje trimise. Încearcă din nou mai târziu.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  let body: Payload
  try {
    body = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ ok: false, error: 'Cerere invalidă.' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: fieldErrors(parsed.error) },
      { status: 400 },
    )
  }

  const { name, email, phone, message } = parsed.data

  try {
    const payload = await getPayloadClient()

    await payload.create({
      collection: 'submissions',
      // `create` este închis prin API (`noone`) tocmai ca nimeni să nu poată
      // scrie direct în colecție. Aici scriem din cod, deci ocolim regula
      // explicit — singurul loc din proiect unde se întâmplă asta.
      overrideAccess: true,
      data: {
        name,
        email,
        phone: phone && phone.length > 0 ? phone : null,
        message,
        consent: true,
      },
    })
  } catch (error) {
    console.error('[contact] salvarea mesajului a eșuat', error)
    return NextResponse.json(
      { ok: false, error: 'Mesajul nu a putut fi salvat. Încearcă din nou.' },
      { status: 500 },
    )
  }

  await notify({ name, email, phone, message })

  return NextResponse.json({ ok: true })
}

/**
 * Notificarea și confirmarea.
 *
 * Ambele sunt „best effort": eșecul lor nu schimbă răspunsul către utilizator,
 * pentru că mesajul e deja salvat. Se loghează, ca să se vadă în Vercel.
 */
async function notify({
  name,
  email,
  phone,
  message,
}: {
  name: string
  email: string
  phone?: string
  message: string
}): Promise<void> {
  const admin = process.env.EMAIL_TO_ADMIN

  if (admin) {
    const result = await sendEmail({
      to: admin,
      replyTo: email,
      subject: `Mesaj nou de la ${name}`,
      text: [
        `Nume: ${name}`,
        `Email: ${email}`,
        phone ? `Telefon: ${phone}` : 'Telefon: —',
        '',
        message,
      ].join('\n'),
    })

    if (result.status === 'error') {
      console.error('[contact] notificarea către administrator a eșuat:', result.message)
    }
  }

  const confirmation = await sendEmail({
    to: email,
    subject: 'Am primit mesajul tău',
    text: [
      `Bună, ${name},`,
      '',
      'Am primit mesajul tău și îți răspund personal, în maximum 24 de ore lucrătoare.',
      '',
      'Ai scris:',
      message,
      '',
      'Adriana Chira',
      'Consultant în performanță umană',
    ].join('\n'),
  })

  if (confirmation.status === 'error') {
    console.error('[contact] confirmarea către expeditor a eșuat:', confirmation.message)
  }
}
