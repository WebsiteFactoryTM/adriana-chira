import type Stripe from 'stripe'

import { sendEmail } from '@/lib/email'
import { getPayloadClientSafe } from '@/lib/payload'
import { getStripe } from '@/lib/stripe'
import { formatSessionDate } from '@/lib/workshops'

/**
 * Webhook-ul Stripe — singurul loc din site care scrie o comandă.
 *
 * ## Trei reguli care fac diferența între o evidență corectă și una aproximativă
 *
 * 1. **Semnătura se verifică pe corpul BRUT.** `request.text()`, nu
 *    `request.json()`. Orice reserializare schimbă un octet și invalidează
 *    semnătura, iar atunci ori pică webhook-ul, ori — mult mai rău — cineva îl
 *    dezactivează „ca să meargă", și oricine poate scrie comenzi în evidență.
 *
 * 2. **Idempotență la nivel de bază de date.** Stripe reîncearcă livrarea unui
 *    eveniment până când primește 2xx, iar reîncercările sunt normale, nu
 *    excepții. `stripeSessionId` este `unique` în colecția `orders`, deci a
 *    doua livrare cade la inserare — o prindem și răspundem 200. Fără indexul
 *    unic, o rețea proastă ar produce comenzi duble.
 *
 * 3. **Erorile noastre nu se ascund.** Dacă baza de date e picată, răspundem
 *    500 ca Stripe să reîncerce mai târziu. Doar evenimentele pe care nu le
 *    tratăm primesc 200 imediat: pentru ele nu există nimic de reîncercat.
 *
 * ## De ce sunt copii, nu relații
 *
 * `packageNameSnapshot`, `sessionDateSnapshot`, `amount` și `currency` se
 * copiază în comandă. Dacă Adriana redenumește un program, îi schimbă prețul
 * sau mută workshopul pe altă dată, comenzile vechi trebuie să arate în
 * continuare ce s-a cumpărat, cu cât și pentru ce ediție.
 */

export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<Response> {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripe || !secret) {
    // Fără cheie nu putem verifica nimic, deci nu avem voie să scriem nimic.
    return json({ received: false, reason: 'Stripe nu este configurat' }, 503)
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) return json({ received: false, reason: 'Lipsește semnătura' }, 400)

  const raw = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return json({ received: false, reason: `Semnătură invalidă: ${message}` }, 400)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object
        if (session.payment_status !== 'paid') return json({ received: true, skipped: true })
        await recordOrder(stripe, session, event)
        return json({ received: true })
      }

      case 'charge.refunded': {
        await markRefunded(event.data.object)
        return json({ received: true })
      }

      default:
        return json({ received: true, ignored: event.type })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    // 500 înseamnă „reîncearcă": exact ce vrem când e o problemă de-a noastră.
    return json({ received: false, reason: message }, 500)
  }
}

/* -------------------------------------------------------------------------- */

async function recordOrder(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  event: Stripe.Event,
): Promise<void> {
  const payload = await getPayloadClientSafe()
  if (!payload) throw new Error('Baza de date nu răspunde')

  const kind = session.metadata?.kind === 'workshop' ? 'workshop' : 'pachet'
  const slug = session.metadata?.slug ?? null
  const sessionDate = session.metadata?.sessionDate ?? null

  // Numele și cantitatea se citesc din liniile plătite, nu din metadate:
  // cumpărătorul poate schimba numărul de locuri în pagina Stripe.
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 })
  const first = lineItems.data[0]
  const quantity = first?.quantity ?? 1
  const name = first?.description ?? session.metadata?.slug ?? 'Comandă'

  const relation = slug ? await findDocumentId(payload, kind, slug) : null
  const details = session.customer_details

  try {
    await payload.create({
      collection: 'orders',
      overrideAccess: true,
      depth: 0,
      data: {
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === 'string' ? session.payment_intent : null,
        itemType: kind,
        ...(kind === 'workshop' ? { workshop: relation } : { package: relation }),
        packageNameSnapshot: name,
        sessionDateSnapshot: sessionDate ? formatSessionDate(sessionDate) : null,
        quantity,
        // Stripe raportează în subunități. În evidență ținem lei întregi.
        amount: (session.amount_total ?? 0) / 100,
        currency: (session.currency ?? 'ron').toUpperCase(),
        customerName: details?.name ?? null,
        customerEmail: details?.email ?? 'necunoscut@adrianachira.ro',
        customerPhone: details?.phone ?? null,
        status: 'paid',
        rawEvent: event as unknown as Record<string, unknown>,
      },
    })
  } catch (error) {
    // Reîncercare a aceluiași eveniment: comanda există deja, din prima
    // livrare. Nu e o eroare, e chiar rostul indexului unic.
    if (isDuplicate(error)) return
    throw error
  }

  await notify({ name, quantity, session, kind, sessionDate })
}

/**
 * Id-ul documentului cumpărat, ca să rămână relația din admin.
 *
 * Întoarce `number`, nu `number | string`: adaptorul Postgres folosește chei
 * numerice, iar câmpul de relație din `orders` le cere ca atare. Un `string`
 * de aici ar fi trecut de compilare doar ca să pice la scriere.
 */
async function findDocumentId(
  payload: Awaited<ReturnType<typeof getPayloadClientSafe>>,
  kind: 'pachet' | 'workshop',
  slug: string,
): Promise<number | null> {
  if (!payload) return null
  try {
    const result = await payload.find({
      collection: kind === 'workshop' ? 'workshops' : 'packages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const id = result.docs[0]?.id
    return typeof id === 'number' ? id : null
  } catch {
    // Relația e un confort de administrare, nu o condiție a comenzii.
    return null
  }
}

async function markRefunded(charge: Stripe.Charge): Promise<void> {
  const payload = await getPayloadClientSafe()
  if (!payload) throw new Error('Baza de date nu răspunde')

  const intentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : null
  if (!intentId) return

  const result = await payload.find({
    collection: 'orders',
    where: { stripePaymentIntentId: { equals: intentId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const order = result.docs[0]
  if (!order) return

  await payload.update({
    collection: 'orders',
    id: order.id,
    data: { status: 'refunded' },
    overrideAccess: true,
    depth: 0,
  })
}

/**
 * Emailurile de după plată.
 *
 * Nu aruncă niciodată. `sendEmail` întoarce `skipped` fără cheie de Resend, iar
 * o eroare de trimitere nu are voie să transforme un webhook reușit într-un
 * 500 — Stripe ar reîncerca, iar reîncercarea ar cădea pe indexul unic. Plata
 * s-a făcut, comanda e scrisă; un email ratat se recuperează din admin.
 */
async function notify(args: {
  name: string
  quantity: number
  session: Stripe.Checkout.Session
  kind: 'pachet' | 'workshop'
  sessionDate: string | null
}): Promise<void> {
  const { name, quantity, session, kind, sessionDate } = args
  const details = session.customer_details
  const email = details?.email
  const total = `${((session.amount_total ?? 0) / 100).toLocaleString('ro-RO')} ${(
    session.currency ?? 'ron'
  ).toUpperCase()}`

  const dateLine =
    kind === 'workshop' && sessionDate
      ? `Data workshopului: ${formatSessionDate(sessionDate)}, între 09:00 și 17:00, în Timișoara.`
      : null

  if (email) {
    await sendEmail({
      to: email,
      subject: `Confirmare — ${name}`,
      text: [
        `Bună${details?.name ? `, ${details.name}` : ''},`,
        '',
        `Am primit plata pentru ${name}.`,
        quantity > 1 ? `Număr de locuri: ${quantity}.` : null,
        `Total: ${total}.`,
        dateLine,
        '',
        'Îți scriu personal în cel mult 24 de ore lucrătoare ca să stabilim pașii următori.',
        'Factura ajunge separat, tot pe email.',
        '',
        'Adriana Chira',
        'Consultant în Performanță Umană',
      ]
        .filter((line) => line !== null)
        .join('\n'),
    })
  }

  const admin = process.env.EMAIL_TO_ADMIN
  if (admin) {
    await sendEmail({
      to: admin,
      subject: `Comandă nouă — ${name}`,
      ...(email ? { replyTo: email } : {}),
      text: [
        `Produs: ${name}`,
        `Tip: ${kind === 'workshop' ? 'loc la workshop' : 'pachet de consultanță'}`,
        dateLine,
        `Cantitate: ${quantity}`,
        `Total: ${total}`,
        '',
        `Nume: ${details?.name ?? '—'}`,
        `Email: ${email ?? '—'}`,
        `Telefon: ${details?.phone ?? '—'}`,
        '',
        `Sesiune Stripe: ${session.id}`,
      ]
        .filter((line) => line !== null)
        .join('\n'),
    })
  }
}

/**
 * Eroarea de unicitate, oricum ar formula-o stratul de bază de date.
 *
 * Payload nu expune un cod stabil pentru încălcarea unui index unic, iar
 * mesajul diferă între adaptoare. Ne uităm la ce e comun: `23505`, codul
 * Postgres pentru `unique_violation`, sau textul lui.
 */
function isDuplicate(error: unknown): boolean {
  const text = error instanceof Error ? `${error.message}` : String(error)
  const code = (error as { code?: unknown } | null)?.code
  return code === '23505' || /unique|duplicate|23505/i.test(text)
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
