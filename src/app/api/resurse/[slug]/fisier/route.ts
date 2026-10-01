import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { getPayloadClient } from '@/lib/payload'
import { RESOURCE_STATIC_DIR, resourceHref, verifyDownloadToken } from '@/lib/resources'

/**
 * Singura ușă către fișierul unei resurse.
 *
 * - **liberă**: se descarcă direct, fără nimic;
 * - **cu formular**: cere jetonul semnat primit după formular (`?t=`), legat de
 *   ACEASTĂ resursă și încă valabil. Altfel, omul ajunge la formular, nu la o
 *   pagină de eroare.
 *
 * ## Cum se livrează octeții
 *
 * Cu Vercel Blob, ruta **redirecționează** spre fișier, nu îl trece prin ea.
 * O funcție care ar transmite un PDF de 20 MB ar plăti transferul de două ori
 * și s-ar lovi de limita de răspuns a platformei. Adresa Blob are sufix
 * aleator (`addRandomSuffix`), deci nu se poate ghici, iar `?download=1` îi
 * cere lui Blob să o trimită ca atașament.
 *
 * Asta înseamnă că un link de Blob, odată primit, se poate da mai departe. E
 * acceptat conștient: formularul e un schimb („documentul pentru datele
 * tale"), nu o protecție anti-copiere — cine are PDF-ul îl poate trimite
 * oricum pe email.
 *
 * Fără Blob (local), fișierul se citește de pe disc, din afara lui `public/`.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Context = { params: Promise<{ slug: string }> }

export async function GET(request: Request, { params }: Context) {
  const { slug } = await params
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return new Response('Not found', { status: 404 })

  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'resources',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const resource = found.docs[0]
  if (!resource?.filename) return new Response('Not found', { status: 404 })

  if (resource.access !== 'free') {
    const token = verifyDownloadToken(new URL(request.url).searchParams.get('t'))
    if (!token || token.resourceId !== resource.id) {
      return Response.redirect(new URL(`${resourceHref(slug)}?eroare=expirat#formular`, request.url), 303)
    }
  }

  // Resursele cu formular nu au ce căuta în cache-uri intermediare.
  const cache = resource.access === 'free' ? 'public, max-age=3600' : 'private, no-store'

  if (process.env.BLOB_READ_WRITE_TOKEN && resource.url?.startsWith('https://')) {
    const target = new URL(resource.url)
    target.searchParams.set('download', '1')
    return new Response(null, {
      status: 302,
      headers: { Location: target.toString(), 'Cache-Control': cache },
    })
  }

  try {
    // `filename` vine de la Payload, deja curățat; `basename` e a doua plasă,
    // ca nimic să nu poată ieși din director. `turbopackIgnore`: fără el,
    // calea dinamică face Turbopack să urmărească tot proiectul în funcție.
    const directory = path.resolve(/* turbopackIgnore: true */ process.cwd(), RESOURCE_STATIC_DIR)
    const file = await readFile(path.join(directory, path.basename(resource.filename)))
    return new Response(new Uint8Array(file), {
      headers: {
        'Content-Type': resource.mimeType ?? 'application/octet-stream',
        'Content-Length': String(file.byteLength),
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(resource.filename)}`,
        'Cache-Control': cache,
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
