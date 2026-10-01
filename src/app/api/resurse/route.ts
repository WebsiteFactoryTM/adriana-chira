import { privacyPage } from '@/content/pages'
import { sendEmail } from '@/lib/email'
import { getPayloadClient } from '@/lib/payload'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import {
  DOWNLOAD_TOKEN_DAYS,
  createDownloadToken,
  resourceHref,
  resourceThanksHref,
} from '@/lib/resources'
import { siteUrlOr } from '@/lib/site-url'
import { formToObject, resourceRequestSchema } from '@/lib/validation/resource'

/**
 * Formularul unei resurse „doar cu formular".
 *
 * Primește un `<form method="post">` obișnuit și răspunde cu 303, exact ca
 * butonul de plată: zero JavaScript în pagină, funcționează și înainte de
 * hidratare, iar butonul „Înapoi" al browserului nu retrimite formularul.
 *
 * Ordinea, aceeași ca la contact:
 *   1. limitare de rată
 *   2. validare (schema din `validation/resource.ts`)
 *   3. salvare în `resource-requests` — dacă asta cade, omul nu primește linkul
 *   4. emailurile — best effort; linkul e oricum pe pagina următoare
 *
 * Erorile NU poartă datele în adresă: întoarcerea la formular are doar
 * `?eroare=…`. Numele și telefonul cuiva nu au ce căuta în istoricul
 * browserului sau în logurile de acces.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const back = (request: Request, path: string) =>
  Response.redirect(new URL(path, request.url), 303)

export async function POST(request: Request) {
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return back(request, '/blog')
  }

  const raw = formToObject(form)
  const slug = /^[a-z0-9-]{1,120}$/.test(raw.resource ?? '') ? (raw.resource as string) : null
  if (!slug) return back(request, '/blog')

  const formPage = (reason: string) => `${resourceHref(slug)}?eroare=${reason}#formular`

  const limit = rateLimit(`resurse:${clientIp(request.headers)}`, { limit: 8 })
  if (!limit.ok) return back(request, formPage('limita'))

  const parsed = resourceRequestSchema.safeParse(raw)
  if (!parsed.success) {
    // Honeypot completat: botul primește aceeași pagină ca un om care a greșit.
    return back(request, formPage('date'))
  }

  const data = parsed.data

  try {
    const payload = await getPayloadClient()

    const found = await payload.find({
      collection: 'resources',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    const resource = found.docs[0]
    if (!resource) return back(request, '/blog')

    // O resursă liberă nu cere date: nu le salvăm dacă cineva le trimite oricum.
    if (resource.access === 'free') return back(request, resourceHref(slug))

    const postId = data.post ? Number(data.post) : null

    const saved = await payload.create({
      collection: 'resource-requests',
      // `create` e închis prin API (`noone`). Scriem din cod, deci ocolim regula
      // explicit — ca la `submissions`.
      overrideAccess: true,
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        resource: resource.id,
        post: postId && Number.isSafeInteger(postId) ? postId : null,
        consent: true,
        policyVersion: privacyPage.updatedAt ?? null,
        marketingConsent: data.marketing === 'on',
      },
    })

    const token = createDownloadToken(resource.id, saved.id)
    const thanks = resourceThanksHref(slug, token)

    await notify({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      marketing: data.marketing === 'on',
      title: resource.title,
      link: new URL(thanks, siteUrlOr(new URL(request.url).origin)).toString(),
    })

    return back(request, thanks)
  } catch (error) {
    // Un id de articol inexistent ar cădea aici, la relație: nu e motiv să
    // pierdem solicitarea, dar nici nu o salvăm cu o referință ruptă.
    console.error('[resurse] solicitarea nu a putut fi salvată', error)
    return back(request, formPage('server'))
  }
}

async function notify(args: {
  firstName: string
  lastName: string
  email: string
  phone: string
  marketing: boolean
  title: string
  link: string
}): Promise<void> {
  const confirmation = await sendEmail({
    to: args.email,
    subject: `Documentul tău: ${args.title}`,
    text: [
      `Bună, ${args.firstName},`,
      '',
      `Mulțumesc pentru interes. Documentul „${args.title}" se descarcă de aici:`,
      args.link,
      '',
      `Linkul este valabil ${DOWNLOAD_TOKEN_DAYS} zile.`,
      '',
      'Adriana Chira',
      'Consultant în performanță umană',
    ].join('\n'),
  })
  if (confirmation.status === 'error') {
    console.error('[resurse] emailul către vizitator a eșuat:', confirmation.message)
  }

  const admin = process.env.EMAIL_TO_ADMIN
  if (!admin) return

  const notice = await sendEmail({
    to: admin,
    replyTo: args.email,
    subject: `Descărcare: ${args.title} — ${args.firstName} ${args.lastName}`,
    text: [
      `${args.firstName} ${args.lastName} a cerut „${args.title}".`,
      '',
      `Email: ${args.email}`,
      `Telefon: ${args.phone}`,
      `Noutăți pe email: ${args.marketing ? 'da' : 'nu'}`,
    ].join('\n'),
  })
  if (notice.status === 'error') {
    console.error('[resurse] notificarea către administrator a eșuat:', notice.message)
  }
}
